import { useState, useEffect, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getProblemById } from '../data/problems';
import CodeEditor from './CodeEditor';
import ExecutionResults from './ExecutionResults';
import DebugConsole from './DebugConsole';
import { executeCode, canExecuteLanguage, checkBackendHealth, checkCompilers } from '../services/compilerService';

function ProblemDetail() {
  const { id } = useParams();
  const problem = getProblemById(parseInt(id));
  const [selectedLanguage, setSelectedLanguage] = useState('javascript');
  const [code, setCode] = useState(problem?.solution[selectedLanguage] || '');
  const [executionResult, setExecutionResult] = useState(null);
  const [useHinglish, setUseHinglish] = useState(false);
  const [debugMode, setDebugMode] = useState(false);
  const [debugLogs, setDebugLogs] = useState([]);
  const [backendStatus, setBackendStatus] = useState(null); // null = checking, true = available, false = unavailable
  const [compilerStatus, setCompilerStatus] = useState(null);

  if (!problem) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-400">Problem not found</p>
        <Link to="/" className="text-blue-400 hover:text-blue-300 mt-4 inline-block">
          ← Back to Categories
        </Link>
      </div>
    );
  }

  // Get available languages, ensuring JavaScript is always available - memoized to prevent recreations
  const languages = useMemo(() => {
    if (!problem || !problem.solution) return ['javascript'];
    const availableLanguages = Object.keys(problem.solution);
    return availableLanguages.length > 0 ? availableLanguages : ['javascript'];
  }, [problem?.id]); // Only depend on problem.id
  
  // Update code when language changes or problem loads
  useEffect(() => {
    if (problem && problem.solution) {
      const newCode = problem.solution[selectedLanguage] || '';
      if (newCode !== code) {
        console.log(`Updating code for language: ${selectedLanguage}, code length: ${newCode.length}`);
        setCode(newCode);
      }
      setExecutionResult(null);
      setDebugLogs([]);
    }
  }, [selectedLanguage, problem?.id]); // Only depend on problem.id, not entire problem object
  
  // Ensure selected language is available - only run once when problem changes
  useEffect(() => {
    if (problem && problem.solution) {
      const availableLangs = Object.keys(problem.solution);
      if (availableLangs.length > 0 && !availableLangs.includes(selectedLanguage)) {
        setSelectedLanguage('javascript');
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [problem?.id]); // Only check when problem ID changes

  // Check backend health and compiler status for languages that need it
  useEffect(() => {
    const needsBackend = ['java', 'cpp', 'go'].includes(selectedLanguage);
    if (needsBackend) {
      setBackendStatus(null); // Checking
      setCompilerStatus(null);
      
      checkBackendHealth().then(({ available }) => {
        setBackendStatus(available);
        if (available) {
          // Check compiler availability
          checkCompilers().then(compilers => {
            setCompilerStatus(compilers);
          });
        }
      }).catch(() => {
        setBackendStatus(false);
      });
    } else {
      setBackendStatus(null); // Not needed
      setCompilerStatus(null);
    }
  }, [selectedLanguage]);

  const handleLanguageChange = (lang) => {
    setSelectedLanguage(lang);
    const newCode = problem.solution[lang] || '';
    setCode(newCode);
    setExecutionResult(null);
    console.log(`Language changed to ${lang}, code length: ${newCode.length}`);
  };

  const handleCodeChange = (newCode) => {
    setCode(newCode);
    setExecutionResult(null);
  };

  const handleRun = async () => {
    setDebugLogs([]);
    setExecutionResult(null);
    
    // Check if problem has examples
    if (!problem.examples || problem.examples.length === 0) {
      setExecutionResult({
        success: false,
        error: 'This problem does not have test cases yet. Please add examples to the problem data.'
      });
      return;
    }
    
    // Check if code is empty
    if (!code || code.trim().length === 0) {
      setExecutionResult({
        success: false,
        error: 'Please write some code before running.'
      });
      return;
    }
    
    // Check if language can be executed
    if (!canExecuteLanguage(selectedLanguage)) {
      setExecutionResult({
        success: false,
        error: `Language ${selectedLanguage} is not supported for execution.`
      });
      return;
    }
    
    // Handle JavaScript execution (client-side)
    if (selectedLanguage === 'javascript') {
      try {
        // Capture console.log for debug mode
        const originalLog = console.log;
        const originalError = console.error;
        const logs = [];
        
        if (debugMode) {
          console.log = (...args) => {
            const message = args.map(arg => 
              typeof arg === 'object' ? JSON.stringify(arg, null, 2) : String(arg)
            ).join(' ');
            logs.push({
              type: 'log',
              message: message
            });
            originalLog(...args);
          };
          
          console.error = (...args) => {
            const message = args.map(arg => 
              typeof arg === 'object' ? JSON.stringify(arg, null, 2) : String(arg)
            ).join(' ');
            logs.push({
              type: 'error',
              message: `ERROR: ${message}`
            });
            originalError(...args);
          };
        }
        
        // Extract function from code - improved approach
        let func;
        try {
          // Clean the code
          const cleanCode = code.trim();
          
          // Pattern 1: Function declaration - function name(...) {...}
          const funcDeclMatch = cleanCode.match(/function\s+(\w+)\s*\([^)]*\)\s*\{/);
          
          // Pattern 2: Arrow function - const name = (...) => {...} or const name = function(...) {...}
          const arrowFuncMatch = cleanCode.match(/(?:const|let|var)\s+(\w+)\s*=\s*(?:\([^)]*\)\s*=>|function\s*\([^)]*\))\s*\{/);
          
          // Pattern 3: Function expression - (function name(...) {...})
          const funcExprMatch = cleanCode.match(/\(function\s+(\w+)\s*\([^)]*\)\s*\{/);
          
          const funcName = funcDeclMatch?.[1] || arrowFuncMatch?.[1] || funcExprMatch?.[1];
          
          if (debugMode && funcName) {
            logs.push({
              type: 'info',
              message: `Found function: ${funcName}`
            });
          }
          
          // Execute code and extract function
          const executeCode = `
            ${cleanCode}
            
            // Return the function if we found its name
            ${funcName ? `
              if (typeof ${funcName} === 'function') {
                return ${funcName};
              }
            ` : ''}
            
            // Try common function names
            const commonNames = [
              'twoSum', 'containsDuplicate', 'isAnagram', 'groupAnagrams',
              'topKFrequent', 'productExceptSelf', 'isValidSudoku',
              'longestConsecutive', 'solution', 'solve', 'main'
            ];
            
            for (const name of commonNames) {
              try {
                if (typeof eval(name) === 'function') {
                  return eval(name);
                }
              } catch (e) {
                // Continue
              }
            }
            
            // If code itself is a function expression, return it
            try {
              const maybeFunc = eval('(' + \`${cleanCode.replace(/`/g, '\\`')}\` + ')');
              if (typeof maybeFunc === 'function') {
                return maybeFunc;
              }
            } catch (e) {
              // Not a function expression
            }
            
            return null;
          `;
          
          try {
            func = new Function(executeCode)();
          } catch (evalError) {
            console.error('Function evaluation error:', evalError);
            throw new Error(`Code execution error: ${evalError.message}. Please check your syntax.`);
          }
          
          if (!func || typeof func !== 'function') {
            throw new Error('Could not find a function in your code. Please make sure you define a function like:\nfunction myFunction(...) { ... }\nor\nconst myFunction = (...) => { ... }');
          }
          
          if (debugMode) {
            logs.push({
              type: 'success',
              message: `Successfully extracted function: ${func.name || 'anonymous'}`
            });
          }
          
          if (debugMode) {
            logs.push({
              type: 'success',
              message: `Successfully extracted function: ${func.name || 'anonymous'}`
            });
          }
        } catch (parseError) {
          const errorMsg = parseError.message || 'Unknown error';
          if (debugMode) {
            logs.push({
              type: 'error',
              message: `Function extraction failed: ${errorMsg}`
            });
          }
          throw new Error(`Failed to extract function: ${errorMsg}\n\nMake sure your code defines a function. Examples:\n\nfunction twoSum(nums, target) {\n  // your code\n}\n\nor\n\nconst twoSum = (nums, target) => {\n  // your code\n}`);
        }
        
        const results = [];
        
        // Run examples
        problem.examples.forEach((example, idx) => {
          try {
            let result;
            const input = example.input;
            
            if (debugMode) {
              logs.push({
                type: 'info',
                message: `Running test case ${idx + 1} with input: ${JSON.stringify(input)}`
              });
            }
            
            // Determine function signature based on input keys
            if (input.nums !== undefined && input.target !== undefined) {
              result = func(input.nums, input.target);
            } else if (input.nums !== undefined && input.k !== undefined) {
              result = func(input.nums, input.k);
            } else if (input.nums !== undefined) {
              result = func(input.nums);
            } else if (input.s !== undefined && input.t !== undefined) {
              result = func(input.s, input.t);
            } else if (input.strs !== undefined) {
              result = func(input.strs);
            } else if (input.board !== undefined) {
              result = func(input.board);
            } else if (Object.keys(input).length > 0) {
              // Try to pass all input values as arguments
              const args = Object.values(input);
              result = func(...args);
            } else {
              // No input, try calling without arguments
              result = func();
            }
            
            // Compare results
            const passed = JSON.stringify(result) === JSON.stringify(example.output);
            
            if (debugMode) {
              logs.push({
                type: passed ? 'success' : 'error',
                message: `Test case ${idx + 1}: ${passed ? 'PASSED' : 'FAILED'}\nExpected: ${JSON.stringify(example.output)}\nGot: ${JSON.stringify(result)}`
              });
            }
            
            results.push({
              example: idx + 1,
              input: example.input,
              expected: example.output,
              actual: result,
              passed,
              explanation: useHinglish && example.explanationHinglish 
                ? example.explanationHinglish 
                : example.explanation
            });
          } catch (err) {
            if (debugMode) {
              logs.push({
                type: 'error',
                message: `Test case ${idx + 1} error: ${err.message}\nStack: ${err.stack || 'N/A'}`
              });
            }
            
            results.push({
              example: idx + 1,
              input: example.input,
              expected: example.output,
              actual: null,
              passed: false,
              error: err.message
            });
          }
        });
        
        // Restore console methods before setting state
        console.log = originalLog;
        console.error = originalError;
        
        if (debugMode) {
          setDebugLogs(logs);
        }
        
        setExecutionResult({
          success: true,
          results
        });
      } catch (error) {
        const errorMessage = error.message || 'An unknown error occurred while executing the code.';
        setExecutionResult({
          success: false,
          error: errorMessage
        });
        
        if (debugMode) {
          setDebugLogs([{
            type: 'error',
            message: `Execution failed: ${errorMessage}\n${error.stack || ''}`
          }]);
        }
      }
    } else {
      // Handle other languages (Python, Java, C++, Go) via compiler service
      try {
        if (debugMode) {
          setDebugLogs([{
            type: 'info',
            message: `Executing ${selectedLanguage} code...`
          }]);
        }
        
        // Validate that we have the correct code for the selected language
        const expectedCode = problem.solution[selectedLanguage];
        if (expectedCode && code !== expectedCode) {
          // User may have edited the code, but let's verify it's the right language
          // For C++, check for C++ keywords/patterns
          if (selectedLanguage === 'cpp' && !code.includes('vector') && !code.includes('#include') && code.includes('function')) {
            // This looks like JavaScript code, not C++
            setExecutionResult({
              success: false,
              error: 'The code in the editor appears to be JavaScript, not C++. Please select C++ language and ensure the correct code is loaded.'
            });
            return;
          }
        }
        
        if (debugMode) {
          setDebugLogs(prev => [...prev, {
            type: 'info',
            message: `Sending ${selectedLanguage} code to compiler (${code.length} characters)`
          }]);
        }
        
        const result = await executeCode(selectedLanguage, code, problem.examples, debugMode);
        
        if (result.success) {
          // Map results to match expected format
          const mappedResults = result.results.map((r, idx) => ({
            example: r.example || idx + 1,
            input: r.input,
            expected: r.expected,
            actual: r.actual,
            passed: r.passed || JSON.stringify(r.actual) === JSON.stringify(r.expected),
            error: r.error || null,
            explanation: useHinglish && problem.examples[idx]?.explanationHinglish 
              ? problem.examples[idx].explanationHinglish 
              : problem.examples[idx]?.explanation
          }));
          
          setExecutionResult({
            success: true,
            results: mappedResults
          });
          
          if (debugMode) {
            setDebugLogs(prev => [...prev, {
              type: 'success',
              message: `Execution completed successfully for ${selectedLanguage}`
            }]);
          }
        } else {
          setExecutionResult({
            success: false,
            error: result.error || 'Execution failed'
          });
          
          if (debugMode) {
            setDebugLogs(prev => [...prev, {
              type: 'error',
              message: `Execution failed: ${result.error}`
            }]);
          }
        }
      } catch (error) {
        const errorMessage = error.message || 'An unknown error occurred while executing the code.';
        setExecutionResult({
          success: false,
          error: errorMessage
        });
        
        if (debugMode) {
          setDebugLogs([{
            type: 'error',
            message: `Execution failed: ${errorMessage}\n${error.stack || ''}`
          }]);
        }
      }
    }
  };

  return (
    <div>
      <Link 
        to={`/category/${problem.categoryId}`}
        className="text-blue-400 hover:text-blue-300 mb-4 inline-block"
      >
        ← Back to {problem.categoryName}
      </Link>

      <div className="bg-gray-800 rounded-lg p-6 mb-6 border border-gray-700">
        <div className="flex items-center gap-3 mb-4">
          <span className="text-gray-400 font-mono text-sm">#{problem.id}</span>
          <h1 className="text-3xl font-bold">{problem.title}</h1>
          <span className={`px-3 py-1 rounded text-sm ${
            problem.difficulty === 'Easy' ? 'bg-green-600' :
            problem.difficulty === 'Medium' ? 'bg-yellow-600' :
            'bg-red-600'
          }`}>
            {problem.difficulty}
          </span>
          <span className="px-3 py-1 rounded text-sm bg-blue-600">
            {problem.pattern}
          </span>
        </div>

        {problem.description && (
          <p className="text-gray-300 mb-6 text-lg">
            {problem.description}
          </p>
        )}

        {/* Pattern Explanation */}
        {(problem.patternExplanation || problem.patternExplanationHinglish) && (
          <div className="bg-blue-900/30 border border-blue-700 rounded-lg p-5 mb-6">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-xl font-semibold text-blue-300">
                🎯 Pattern Recognition
              </h2>
              <button
                onClick={() => setUseHinglish(!useHinglish)}
                className="px-3 py-1 text-xs bg-purple-600 hover:bg-purple-700 rounded transition-colors"
              >
                {useHinglish ? '🇮🇳 Hinglish' : '🇬🇧 English'}
              </button>
            </div>
            <div className="text-gray-200 whitespace-pre-line leading-relaxed">
              {useHinglish && problem.patternExplanationHinglish
                ? problem.patternExplanationHinglish
                : problem.patternExplanation || 'Pattern explanation not available yet.'}
            </div>
          </div>
        )}

        {/* Examples */}
        {problem.examples && problem.examples.length > 0 && (
          <div className="mb-6">
            <h2 className="text-xl font-semibold mb-4">📝 Examples</h2>
            <div className="space-y-4">
              {problem.examples.map((example, idx) => (
              <div key={idx} className="bg-gray-700 rounded-lg p-4 border border-gray-600">
                <div className="mb-2">
                  <span className="text-gray-400">Example {idx + 1}:</span>
                </div>
                <div className="mb-2">
                  <span className="text-gray-400">Input: </span>
                  <code className="text-green-400">
                    {JSON.stringify(example.input)}
                  </code>
                </div>
                <div className="mb-2">
                  <span className="text-gray-400">Output: </span>
                  <code className="text-yellow-400">
                    {JSON.stringify(example.output)}
                  </code>
                </div>
                <div className="text-gray-300 text-sm italic">
                  {useHinglish && example.explanationHinglish
                    ? example.explanationHinglish
                    : example.explanation}
                </div>
              </div>
              ))}
            </div>
          </div>
        )}

        {/* Complexity */}
        {problem.complexity && (
          <div className="bg-gray-700 rounded-lg p-4 border border-gray-600">
            <h3 className="font-semibold mb-2">⏱️ Complexity</h3>
            <div className="text-sm text-gray-300">
              <div><strong>Time:</strong> {problem.complexity.time}</div>
              <div><strong>Space:</strong> {problem.complexity.space}</div>
            </div>
          </div>
        )}
      </div>

      {/* Code Editor Section */}
      <div className="bg-gray-800 rounded-lg p-6 border border-gray-700 mb-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-semibold">💻 Code Playground</h2>
          <div className="flex gap-2 flex-wrap">
            {languages.map(lang => {
              const langNames = {
                javascript: 'JS',
                python: 'Python',
                java: 'Java',
                cpp: 'C++',
                go: 'Go'
              };
              const langName = langNames[lang] || lang;
              const canExecute = canExecuteLanguage(lang);
              
              return (
                <button
                  key={lang}
                  onClick={() => handleLanguageChange(lang)}
                  className={`px-4 py-2 rounded text-sm font-medium transition-colors relative ${
                    selectedLanguage === lang
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                  }`}
                  title={`Run ${langName} code`}
                >
                  {langName}
                </button>
              );
            })}
            <button
              onClick={() => setDebugMode(!debugMode)}
              className={`px-4 py-2 rounded text-sm font-medium transition-colors ${
                debugMode
                  ? 'bg-orange-600 text-white'
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
              title="Enable debug mode to see console.log output"
            >
              🐛 Debug
            </button>
            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                handleRun();
              }}
              type="button"
              className="px-6 py-2 bg-green-600 hover:bg-green-700 rounded text-sm font-medium transition-colors"
            >
              ▶ Run Code
            </button>
          </div>
        </div>

        <CodeEditor
          language={selectedLanguage}
          value={code}
          onChange={handleCodeChange}
        />
        
        {selectedLanguage === 'python' && (
          <div className="mt-4 p-4 bg-blue-900/30 border border-blue-700 rounded-lg">
            <div className="flex items-start gap-2">
              <span className="text-blue-400 text-xl">ℹ️</span>
              <div className="text-blue-200 text-sm">
                <strong>Note:</strong> Python code is executed using Pyodide (Python in the browser). 
                Some advanced features may not be available.
              </div>
            </div>
          </div>
        )}
        {(selectedLanguage === 'java' || selectedLanguage === 'cpp' || selectedLanguage === 'go') && (
          <div className="mt-4 p-4 bg-blue-900/30 border border-blue-700 rounded-lg">
            <div className="flex items-start gap-2">
              <span className="text-blue-400 text-xl">ℹ️</span>
              <div className="text-blue-200 text-sm flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <strong>Backend Status:</strong>
                  {backendStatus === null && (
                    <span className="text-yellow-400">🔄 Checking...</span>
                  )}
                  {backendStatus === true && (
                    <span className="text-green-400">✅ Connected</span>
                  )}
                  {backendStatus === false && (
                    <span className="text-red-400">❌ Not Available</span>
                  )}
                </div>
                <div>
                  <strong>Note:</strong> {selectedLanguage === 'go' ? 'Go' : selectedLanguage === 'java' ? 'Java' : 'C++'} code is executed via backend API.
                </div>
                {backendStatus === false && (
                  <div className="mt-2 p-2 bg-red-900/30 border border-red-700 rounded text-red-200">
                    <strong>Backend server is not running.</strong>
                    <div className="mt-1 text-xs">
                      To start the server:
                      <ol className="list-decimal list-inside mt-1 ml-2 space-y-1">
                        <li>Open a terminal</li>
                        <li>Run: <code className="bg-gray-800 px-1 py-0.5 rounded">cd server && npm start</code></li>
                        <li>Wait for: <code className="bg-gray-800 px-1 py-0.5 rounded">Server running on http://localhost:3001</code></li>
                        <li>Refresh this page</li>
                      </ol>
                    </div>
                  </div>
                )}
                {backendStatus === true && compilerStatus && (
                  <div className="mt-2 space-y-1">
                    <div className="text-xs font-semibold">Compiler Status:</div>
                    {selectedLanguage === 'java' && (
                      <div className={`text-xs ${compilerStatus.java?.installed ? 'text-green-300' : 'text-red-300'}`}>
                        Java: {compilerStatus.java?.installed ? '✅ Installed' : '❌ Not Found'}
                        {!compilerStatus.java?.installed && compilerStatus.java?.error && (
                          <div className="mt-1 p-2 bg-red-900/30 border border-red-700 rounded text-xs">
                            <div className="font-semibold mb-1">Install Java:</div>
                            <div className="space-y-1">
                              <div>1. Install Homebrew: <code className="bg-gray-800 px-1 py-0.5 rounded">/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"</code></div>
                              <div>2. Install OpenJDK: <code className="bg-gray-800 px-1 py-0.5 rounded">brew install openjdk</code></div>
                              <div>3. Set JAVA_HOME: <code className="bg-gray-800 px-1 py-0.5 rounded">export JAVA_HOME=$(/usr/libexec/java_home)</code></div>
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                    {selectedLanguage === 'cpp' && (
                      <div className={`text-xs ${compilerStatus.cpp?.installed ? 'text-green-300' : 'text-red-300'}`}>
                        C++: {compilerStatus.cpp?.installed ? '✅ Installed' : '❌ Not Found'}
                        {!compilerStatus.cpp?.installed && (
                          <div className="mt-1 p-2 bg-red-900/30 border border-red-700 rounded text-xs">
                            Install: <code className="bg-gray-800 px-1 py-0.5 rounded">brew install gcc</code> or <code className="bg-gray-800 px-1 py-0.5 rounded">xcode-select --install</code>
                          </div>
                        )}
                      </div>
                    )}
                    {selectedLanguage === 'go' && (
                      <div className={`text-xs ${compilerStatus.go?.installed ? 'text-green-300' : 'text-red-300'}`}>
                        Go: {compilerStatus.go?.installed ? '✅ Installed' : '❌ Not Found'}
                        {!compilerStatus.go?.installed && (
                          <div className="mt-1 p-2 bg-red-900/30 border border-red-700 rounded text-xs">
                            Install: <code className="bg-gray-800 px-1 py-0.5 rounded">brew install go</code>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                )}
                {backendStatus === true && !compilerStatus && (
                  <div className="mt-2 text-xs text-green-300">
                    Backend server is running and ready to execute code.
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Debug Console */}
      {debugMode && (
        <DebugConsole logs={debugLogs} />
      )}

      {/* Execution Results */}
      {executionResult && (
        <ExecutionResults result={executionResult} />
      )}
    </div>
  );
}

export default ProblemDetail;

