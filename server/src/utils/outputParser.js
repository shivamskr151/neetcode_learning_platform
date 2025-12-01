// Utility functions for parsing execution output

/**
 * Parse execution output and compare with expected results
 * @param {string} stdout - Standard output from execution
 * @param {string} stderr - Standard error from execution
 * @param {Array} testCases - Array of test cases
 * @returns {Array} - Array of test results
 */
export function parseExecutionOutput(stdout, stderr, testCases) {
  return testCases.map((testCase, idx) => {
    // Parse RESULT_X: format
    const resultPattern = new RegExp(`RESULT_${idx}:(.+)`, 'm');
    const match = stdout.match(resultPattern);
    let actual = null;
    
    if (match) {
      const resultStr = match[1].trim();
      try {
        // Try to parse as JSON array
        if (resultStr.startsWith('[') || resultStr.includes(',')) {
          // Parse array-like output
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
    }
    
    // Compare results
    const passed = JSON.stringify(actual) === JSON.stringify(testCase.output);
    
    return {
      example: idx + 1,
      input: testCase.input,
      expected: testCase.output,
      actual: actual,
      passed: passed,
      error: stderr || null
    };
  });
}

/**
 * Format error message for better user experience
 * @param {Error} error - Error object
 * @returns {string} - Formatted error message
 */
export function formatErrorMessage(error) {
  let errorMessage = error.message || 'Execution failed';
  
  // Check for common compiler/runtime issues
  if (error.stderr) {
    if (error.stderr.includes('Unable to locate a Java Runtime') || 
        error.stderr.includes('java: command not found')) {
      errorMessage = `Java Runtime is not installed or not in PATH.\n\n` +
        `To install Java on macOS:\n` +
        `1. Install Homebrew if not already installed: /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"\n` +
        `2. Install OpenJDK: brew install openjdk\n` +
        `3. Set JAVA_HOME: export JAVA_HOME=$(/usr/libexec/java_home)\n` +
        `4. Add to PATH: export PATH="$JAVA_HOME/bin:$PATH"\n\n` +
        `Or download from: https://www.oracle.com/java/technologies/downloads/`;
    } else if (error.stderr.includes('g++: command not found') || 
               error.stderr.includes('gcc: command not found')) {
      errorMessage = `C++ compiler (g++) is not installed.\n\n` +
        `To install on macOS:\n` +
        `brew install gcc\n\n` +
        `Or install Xcode Command Line Tools:\n` +
        `xcode-select --install`;
    } else if (error.stderr.includes('go: command not found')) {
      errorMessage = `Go compiler is not installed.\n\n` +
        `To install on macOS:\n` +
        `brew install go\n\n` +
        `Or download from: https://go.dev/dl/`;
    } else {
      errorMessage = `${errorMessage}\n\nCompiler output:\n${error.stderr}`;
    }
  }
  
  return errorMessage;
}

