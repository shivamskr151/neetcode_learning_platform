// Compiler service for executing code in different languages

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

// Check if backend server is available
export async function checkBackendHealth() {
  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';
  
  try {
    const response = await fetch(`${API_URL}/health`, {
      method: 'GET',
      signal: AbortSignal.timeout(3000) // 3 second timeout
    });
    
    if (response.ok) {
      const data = await response.json();
      return { available: true, data };
    }
    return { available: false, error: `Server returned status ${response.status}` };
  } catch (error) {
    if (error.name === 'AbortError' || error.name === 'TypeError') {
      return { 
        available: false, 
        error: 'Backend server is not reachable. Please start the server by running: cd server && npm start' 
      };
    }
    return { available: false, error: error.message };
  }
}

// Check compiler availability
export async function checkCompilers() {
  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';
  
  try {
    const response = await fetch(`${API_URL}/api/check-compilers`, {
      method: 'GET',
      signal: AbortSignal.timeout(5000)
    });
    
    if (response.ok) {
      return await response.json();
    }
    return null;
  } catch (error) {
    return null;
  }
}

// Execute code via backend API (for Java, C++, Go)
async function executeBackendCode(language, code, testCases, debugMode = false) {
  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';
  
  // Validate code matches expected language
  if (language === 'cpp') {
    // Check for JavaScript patterns that shouldn't be in C++
    if (code.includes('function ') && !code.includes('std::function')) {
      return {
        success: false,
        error: 'The code appears to be JavaScript, not C++. Please make sure you have selected the C++ language tab and the correct code is loaded.'
      };
    }
    // Check for C++ patterns
    if (!code.includes('vector') && !code.includes('#include') && !code.includes('int ') && !code.includes('void ')) {
      return {
        success: false,
        error: 'The code does not appear to be valid C++ code. Please check that you have selected C++ and the correct solution is loaded.'
      };
    }
  }
  
  if (debugMode) {
    console.log(`Sending ${language} code to backend (first 200 chars):`, code.substring(0, 200));
  }
  
  try {
    const response = await fetch(`${API_URL}/api/execute`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        language,
        code,
        testCases
      }),
      signal: AbortSignal.timeout(30000) // 30 second timeout for execution
    });
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
      throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
    }
    
    const result = await response.json();
    return result;
  } catch (error) {
    // Provide helpful error messages
    let errorMessage = error.message;
    
    if (error.name === 'AbortError') {
      errorMessage = `Execution timed out. The code may be taking too long to run.`;
    } else if (error.name === 'TypeError' && error.message.includes('fetch')) {
      errorMessage = `Cannot connect to backend server at ${API_URL}.\n\n` +
        `Please make sure the backend server is running:\n` +
        `1. Open a terminal and run: cd server && npm start\n` +
        `2. The server should start on http://localhost:3001\n` +
        `3. Then try running your code again.`;
    } else if (!errorMessage.includes('backend') && !errorMessage.includes('server')) {
      errorMessage = `Failed to execute ${language} code: ${errorMessage}\n\n` +
        `Make sure the backend server is running on ${API_URL}`;
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
      return await executeBackendCode(language, code, testCases, debugMode);
    
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

