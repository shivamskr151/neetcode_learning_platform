// Compiler service for executing code in different languages
import { extractFunctionName, buildTestCode } from '../utils/codeBuilder.js';

// Python execution using Pyodide (loaded from CDN)
let pyodide = null;
let pyodideLoading = false;

async function loadPyodide() {
  if (pyodide) return pyodide;
  if (pyodideLoading) {
    // Wait for existing load to complete
    while (pyodideLoading) {
      await new Promise(resolve => setTimeout(resolve, 100));
    }
    return pyodide;
  }

  pyodideLoading = true;
  try {
    // Load Pyodide from CDN using script tag
    if (typeof window === 'undefined') {
      throw new Error('Pyodide requires a browser environment');
    }

    // Check if Pyodide is already loaded
    if (!window.loadPyodide) {
      // Load the Pyodide script
      await new Promise((resolve, reject) => {
        // Check if script already exists
        const existingScript = document.querySelector('script[src*="pyodide"]');
        if (existingScript && window.loadPyodide) {
          resolve();
          return;
        }

        const script = document.createElement('script');
        script.src = 'https://cdn.jsdelivr.net/pyodide/v0.24.1/full/pyodide.js';
        script.async = true;
        
        script.onload = () => {
          // Wait a bit for Pyodide to initialize
          const checkLoad = setInterval(() => {
            if (window.loadPyodide) {
              clearInterval(checkLoad);
              resolve();
            }
          }, 50);
          
          // Timeout after 10 seconds
          setTimeout(() => {
            clearInterval(checkLoad);
            if (!window.loadPyodide) {
              reject(new Error('Pyodide failed to initialize'));
            }
          }, 10000);
        };
        
        script.onerror = () => {
          reject(new Error('Failed to load Pyodide script from CDN'));
        };
        
        document.head.appendChild(script);
      });
    }
    
    // Initialize Pyodide
    if (window.loadPyodide) {
      pyodide = await window.loadPyodide({
        indexURL: 'https://cdn.jsdelivr.net/pyodide/v0.24.1/full/'
      });
    } else {
      throw new Error('Pyodide loadPyodide function is not available');
    }
    
    return pyodide;
  } catch (error) {
    pyodideLoading = false;
    throw error;
  } finally {
    pyodideLoading = false;
  }
}

// Extract function name from Python code
function extractPythonFunctionName(code) {
  // Try to find function definition (supports both camelCase and snake_case)
  const funcMatch = code.match(/^def\s+(\w+)\s*\(/m);
  if (funcMatch) {
    return funcMatch[1];
  }
  
  // Try common function names (both camelCase and snake_case)
  const commonNames = [
    'twoSum', 'two_sum',
    'containsDuplicate', 'contains_duplicate',
    'isAnagram', 'is_anagram',
    'groupAnagrams', 'group_anagrams',
    'topKFrequent', 'top_k_frequent',
    'productExceptSelf', 'product_except_self',
    'isValidSudoku', 'is_valid_sudoku',
    'longestConsecutive', 'longest_consecutive',
    'solution', 'solve'
  ];
  
  for (const name of commonNames) {
    if (code.includes(`def ${name}(`)) return name;
  }
  
  return null;
}

// Execute Python code
async function executePython(code, testCases, debugMode = false) {
  try {
    const pyodideInstance = await loadPyodide();
    
    // Extract function name
    const funcName = extractPythonFunctionName(code);
    
    if (!funcName) {
      throw new Error('Could not find a function definition in your Python code. Please define a function like:\ndef myFunction(...):\n    ...');
    }
    
    // Prepare code with test execution
    let executionCode = code;
    
    // Add test execution code
    executionCode += '\n\n# Test execution\nresults = []\n';
    
    testCases.forEach((testCase, idx) => {
      const input = testCase.input;
      let callArgs = '';
      
      // Build function call arguments
      if (input.nums !== undefined && input.target !== undefined) {
        callArgs = `nums=${JSON.stringify(input.nums)}, target=${input.target}`;
      } else if (input.nums !== undefined && input.k !== undefined) {
        callArgs = `nums=${JSON.stringify(input.nums)}, k=${input.k}`;
      } else if (input.nums !== undefined) {
        callArgs = `nums=${JSON.stringify(input.nums)}`;
      } else if (input.s !== undefined && input.t !== undefined) {
        callArgs = `s="${input.s}", t="${input.t}"`;
      } else if (input.strs !== undefined) {
        callArgs = `strs=${JSON.stringify(input.strs)}`;
      } else if (input.board !== undefined) {
        callArgs = `board=${JSON.stringify(input.board)}`;
      } else if (Object.keys(input).length > 0) {
        // Build keyword arguments
        const args = Object.entries(input)
          .map(([key, value]) => `${key}=${JSON.stringify(value)}`)
          .join(', ');
        callArgs = args;
      }
      
      executionCode += `\ntry:\n`;
      executionCode += `    result_${idx} = ${funcName}(${callArgs})\n`;
      executionCode += `    import json\n`;
      executionCode += `    expected_json = json.loads('${JSON.stringify(testCase.output)}')\n`;
      executionCode += `    actual_json = json.loads(json.dumps(result_${idx}))\n`;
      executionCode += `    passed_${idx} = actual_json == expected_json\n`;
      executionCode += `    results.append({\n`;
      executionCode += `        'example': ${idx + 1},\n`;
      executionCode += `        'input': json.loads('${JSON.stringify(input)}'),\n`;
      executionCode += `        'expected': expected_json,\n`;
      executionCode += `        'actual': actual_json,\n`;
      executionCode += `        'passed': passed_${idx},\n`;
      executionCode += `        'error': None\n`;
      executionCode += `    })\n`;
      executionCode += `except Exception as e:\n`;
      executionCode += `    import json\n`;
      executionCode += `    results.append({\n`;
      executionCode += `        'example': ${idx + 1},\n`;
      executionCode += `        'input': json.loads('${JSON.stringify(input)}'),\n`;
      executionCode += `        'expected': json.loads('${JSON.stringify(testCase.output)}'),\n`;
      executionCode += `        'actual': None,\n`;
      executionCode += `        'passed': False,\n`;
      executionCode += `        'error': str(e)\n`;
      executionCode += `    })\n`;
    });
    
    // Execute code
    pyodideInstance.runPython(executionCode);
    
    // Get results from Python
    const resultsJson = pyodideInstance.runPython('import json; json.dumps(results, default=str)');
    const parsedResults = JSON.parse(resultsJson);
    
    return {
      success: true,
      results: parsedResults
    };
  } catch (error) {
    return {
      success: false,
      error: error.message || 'Python execution failed'
    };
  }
}

// Execute code via Judge0 API (for Java, C++, Go)
async function executeViaJudge0(language, code, testCases, debugMode = false) {
  const API_KEY = import.meta.env.VITE_JUDGE0_API_KEY;
  const API_URL = import.meta.env.VITE_JUDGE0_API_URL || 'https://judge0-ce.p.rapidapi.com';
  const API_HOST = import.meta.env.VITE_JUDGE0_API_HOST || 'judge0-ce.p.rapidapi.com';
  
  if (!API_KEY) {
    return {
      success: false,
      error: 'Judge0 API key not configured. Please add VITE_JUDGE0_API_KEY to your .env file.\n\n' +
        'Get your free API key from: https://rapidapi.com/judge0-official/api/judge0-ce'
    };
  }

  // Language ID mapping for Judge0
  const languageIds = {
    'java': 62,      // Java (OpenJDK 13.0.1)
    'cpp': 54,       // C++ (GCC 9.2.0)
    'go': 60,        // Go (1.13.5)
  };

  const languageId = languageIds[language];
  if (!languageId) {
    return {
      success: false,
      error: `Unsupported language for Judge0: ${language}`
    };
  }

  try {
    // Extract function name and build test code
    const funcName = extractFunctionName(language, code);
    const testCode = buildTestCode(language, code, funcName, testCases);

    const results = [];
    
    // Execute each test case
    for (let i = 0; i < testCases.length; i++) {
      const testCase = testCases[i];
      
      // Build input string
      const inputStr = JSON.stringify(testCase.input);
      
      // Submit code for execution (wait=true means synchronous execution)
      const submitResponse = await fetch(
        `${API_URL}/submissions?base64_encoded=false&wait=true&fields=stdout,stderr,compile_output,status_id,time,memory`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'X-RapidAPI-Key': API_KEY,
            'X-RapidAPI-Host': API_HOST
          },
          body: JSON.stringify({
            source_code: testCode,
            language_id: languageId,
            stdin: inputStr,
            cpu_time_limit: 5,
            memory_limit: 128000
          }),
          signal: AbortSignal.timeout(30000) // 30 second timeout
        }
      );

      if (!submitResponse.ok) {
        const errorText = await submitResponse.text();
        throw new Error(`Judge0 API error (${submitResponse.status}): ${errorText}`);
      }

      const result = await submitResponse.json();
      
      // Check for compilation or runtime errors
      if (result.compile_output) {
        results.push({
          example: i + 1,
          input: testCase.input,
          expected: testCase.output,
          actual: null,
          passed: false,
          error: result.compile_output
        });
        continue;
      }

      if (result.stderr) {
        results.push({
          example: i + 1,
          input: testCase.input,
          expected: testCase.output,
          actual: null,
          passed: false,
          error: result.stderr
        });
        continue;
      }

      // Status 3 = Accepted, others indicate errors
      if (result.status_id && result.status_id !== 3) {
        const statusMessages = {
          1: 'In Queue',
          2: 'Processing',
          4: 'Wrong Answer',
          5: 'Time Limit Exceeded',
          6: 'Compilation Error',
          7: 'Runtime Error',
          8: 'Runtime Error',
          9: 'Runtime Error',
          10: 'Runtime Error',
          11: 'Runtime Error',
          12: 'Runtime Error',
          13: 'Internal Error'
        };
        results.push({
          example: i + 1,
          input: testCase.input,
          expected: testCase.output,
          actual: null,
          passed: false,
          error: statusMessages[result.status_id] || `Status: ${result.status_id}`
        });
        continue;
      }
      
      // Parse output
      let actual = null;
      if (result.stdout) {
        // Try to parse RESULT_X: format
        const resultPattern = new RegExp(`RESULT_${i}:(.+)`, 'm');
        const match = result.stdout.match(resultPattern);
        
        if (match) {
          const resultStr = match[1].trim();
          try {
            // Try to parse as JSON array
            if (resultStr.startsWith('[') || resultStr.includes(',')) {
              const cleaned = resultStr.replace(/[\[\]]/g, '');
              if (cleaned) {
                actual = cleaned.split(',').map(s => {
                  const trimmed = s.trim();
                  const num = parseInt(trimmed, 10);
                  return isNaN(num) ? trimmed : num;
                });
              } else {
                actual = [];
              }
            } else {
              // Try to parse as number
              const num = parseInt(resultStr, 10);
              actual = isNaN(num) ? resultStr : num;
            }
          } catch (e) {
            actual = resultStr;
          }
        } else {
          // Fallback: try to parse entire stdout as JSON
          try {
            actual = JSON.parse(result.stdout.trim());
          } catch (e) {
            actual = result.stdout.trim();
          }
        }
      }
      
      // Compare results
      const passed = JSON.stringify(actual) === JSON.stringify(testCase.output);
      
      results.push({
        example: i + 1,
        input: testCase.input,
        expected: testCase.output,
        actual: actual,
        passed: passed,
        error: null
      });
    }
    
    return {
      success: true,
      results: results
    };
    
  } catch (error) {
    let errorMessage = error.message;
    
    if (error.name === 'AbortError') {
      errorMessage = 'Execution timed out. The code may be taking too long to run.';
    } else if (error.message.includes('API key')) {
      errorMessage = error.message;
    } else {
      errorMessage = `Judge0 API error: ${errorMessage}\n\n` +
        'Make sure you have:\n' +
        '1. Added VITE_JUDGE0_API_KEY to your .env file\n' +
        '2. Signed up at https://rapidapi.com/judge0-official/api/judge0-ce';
    }
    
    return {
      success: false,
      error: errorMessage
    };
  }
}

// Main execution function
export async function executeCode(language, code, testCases, debugMode = false) {
  switch (language) {
    case 'javascript':
      // JavaScript is handled directly in ProblemDetail component
      throw new Error('JavaScript execution should be handled in component');
    
    case 'python':
      return await executePython(code, testCases, debugMode);
    
    case 'java':
    case 'cpp':
    case 'go':
      return await executeViaJudge0(language, code, testCases, debugMode);
    
    default:
      return {
        success: false,
        error: `Language ${language} is not supported yet.`
      };
  }
}

// Check if a language can be executed
export function canExecuteLanguage(language) {
  return ['javascript', 'python', 'java', 'cpp', 'go'].includes(language);
}

