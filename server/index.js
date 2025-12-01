// Backend API server for code execution (Java, C++, Go)
import express from 'express';
import cors from 'cors';
import { exec, execSync } from 'child_process';
import { promisify } from 'util';
import { writeFile, unlink, mkdir } from 'fs/promises';
import { join } from 'path';
import { tmpdir } from 'os';

const execAsync = promisify(exec);
const app = express();
const PORT = process.env.PORT || 3001;

// Set up environment for child processes to find Java
function getJavaHome() {
  try {
    // Try /usr/libexec/java_home first
    const javaHome = execSync('/usr/libexec/java_home 2>/dev/null', { encoding: 'utf8' }).trim();
    if (javaHome) return javaHome;
  } catch (e) {
    // Ignore
  }
  
  try {
    // Try Homebrew path
    const brewPath = execSync('brew --prefix openjdk 2>/dev/null', { encoding: 'utf8' }).trim();
    if (brewPath) {
      // Homebrew installs to libexec/openjdk.jdk/Contents/Home
      const possiblePaths = [
        `${brewPath}/libexec/openjdk.jdk/Contents/Home`,
        `${brewPath}/libexec/openjdk/Contents/Home`,
        `${brewPath}/Contents/Home`,
        brewPath
      ];
      for (const path of possiblePaths) {
        try {
          // Check if java executable exists
          const testJava = execSync(`test -f "${path}/bin/java" && echo "${path}"`, { encoding: 'utf8', shell: '/bin/bash' }).trim();
          if (testJava) return testJava;
        } catch (e) {
          // Continue
        }
      }
    }
  } catch (e) {
    // Ignore
  }
  
  return null;
}

// Get Java home and set up environment
const javaHome = getJavaHome();
const execEnv = { ...process.env };
if (javaHome) {
  execEnv.JAVA_HOME = javaHome;
  execEnv.PATH = `${javaHome}/bin:${process.env.PATH}`;
  console.log(`✅ Java found at: ${javaHome}`);
} else {
  console.log('⚠️  Java not found in standard locations. Make sure Java is installed and JAVA_HOME is set.');
}

app.use(cors());
app.use(express.json({ limit: '10mb' }));

// Create temp directory for code files
const TEMP_DIR = join(tmpdir(), 'algo-compiler');

async function ensureTempDir() {
  try {
    await mkdir(TEMP_DIR, { recursive: true });
  } catch (error) {
    // Directory might already exist
  }
}

// Extract function name from code
function extractFunctionName(language, code) {
  switch (language) {
    case 'java':
      // Match: public static ... returnType functionName(...)
      const javaMatch = code.match(/public\s+static\s+\w+\s+(\w+)\s*\(/);
      return javaMatch ? javaMatch[1] : 'solution';
    
    case 'cpp':
      // Clean code - remove comments that might interfere
      const cleanCode = code.replace(/\/\/.*$/gm, '').trim();
      
      // Match: returnType functionName(...) - handles templates, references, etc.
      // Try multiple patterns in order of specificity
      const cppPatterns = [
        // Pattern 1: vector<type> functionName(...) - most specific (works with or without leading whitespace)
        /vector<\w+>\s+(\w+)\s*\(/,
        // Pattern 2: int/bool/string return type
        /(?:^|\n)\s*(?:int|bool|string|double|float|char|void)\s+(\w+)\s*\(/,
        // Pattern 3: Any return type (including templates) followed by function name
        /(?:^|\n)\s*[\w:<>]+\s+(\w+)\s*\(/,
        // Pattern 4: Simple function name at start of line
        /(?:^|\n)\s*(\w+)\s*\(/,
      ];
      
      const reservedWords = ['main', 'if', 'for', 'while', 'do', 'switch', 'case', 'return', 'class', 'struct', 'namespace', 'using', 'include', 'define', 'cout', 'cin', 'endl', 'std', 'vector', 'map', 'unordered_map', 'set', 'string'];
      
      // Try patterns in order (use cleanCode)
      for (const pattern of cppPatterns) {
        const match = cleanCode.match(pattern);
        if (match && match[1]) {
          const funcName = match[1];
          if (!reservedWords.includes(funcName) && /^[a-zA-Z_][a-zA-Z0-9_]*$/.test(funcName)) {
            console.log(`✅ Found C++ function: ${funcName}`);
            return funcName;
          }
        }
      }
      
      console.log(`⚠️  C++ function not found with patterns, trying common names...`);
      
      // Try common function names by checking if they appear in function definition
      const commonNames = ['twoSum', 'containsDuplicate', 'isAnagram', 'groupAnagrams',
        'topKFrequent', 'productExceptSelf', 'isValidSudoku', 'longestConsecutive',
        'solution', 'solve'];
      
      for (const name of commonNames) {
        // Check if it's a function definition - look for return type before function name
        // Use both original code and clean code
        const funcDefPattern = new RegExp(`[\\w:<>]+\\s+${name}\\s*\\([^)]*\\)\\s*\\{`, 'm');
        if (funcDefPattern.test(cleanCode) || funcDefPattern.test(code)) {
          console.log(`✅ Found C++ function via common names: ${name}`);
          return name;
        }
      }
      
      console.log(`❌ C++ function not found, defaulting to 'solution'`);
      console.log(`Code preview: ${cleanCode.substring(0, 150)}...`);
      return 'solution';
    
    case 'go':
      // Match: func functionName(...)
      const goMatch = code.match(/func\s+(\w+)\s*\(/);
      return goMatch ? goMatch[1] : 'Solution';
    
    default:
      return 'solution';
  }
}

// Build test code wrapper
function buildTestCode(language, code, funcName, testCases) {
  switch (language) {
    case 'java':
      // Wrap in a complete Java class
      let javaCode = `import java.util.*;\nimport java.util.stream.Collectors;\n\npublic class Solution {\n`;
      
      // Add the user's code (indented)
      const indentedCode = code.split('\n').map(line => '    ' + line).join('\n');
      javaCode += indentedCode;
      
      // Add main method
      javaCode += '\n\n    public static void main(String[] args) {\n';
      javaCode += '        Solution solution = new Solution();\n';
      
      testCases.forEach((testCase, idx) => {
        const input = testCase.input;
        let args = '';
        
        if (input.nums !== undefined && input.target !== undefined) {
          args = `new int[]{${input.nums.join(',')}}, ${input.target}`;
        } else if (input.nums !== undefined && input.k !== undefined) {
          args = `new int[]{${input.nums.join(',')}}, ${input.k}`;
        } else if (input.nums !== undefined) {
          args = `new int[]{${input.nums.join(',')}}`;
        } else if (input.s !== undefined && input.t !== undefined) {
          args = `"${input.s}", "${input.t}"`;
        } else if (input.strs !== undefined) {
          args = `new String[]{${input.strs.map(s => `"${s}"`).join(', ')}}`;
        } else {
          args = JSON.stringify(input);
        }
        
        javaCode += `        int[] result${idx} = solution.${funcName}(${args});\n`;
        javaCode += `        System.out.println("RESULT_${idx}:" + Arrays.toString(result${idx}));\n`;
      });
      
      javaCode += '    }\n';
      javaCode += '}\n';
      
      return javaCode;
    
    case 'cpp':
      // Add includes and main function
      let cppCode = `#include <iostream>\n#include <vector>\n#include <unordered_map>\n#include <string>\n#include <algorithm>\nusing namespace std;\n\n`;
      
      // Add the user's code
      cppCode += code;
      
      // Add main function
      cppCode += '\n\nint main() {\n';
      
      testCases.forEach((testCase, idx) => {
        const input = testCase.input;
        let args = '';
        let needsVar = false;
        let varDecl = '';
        
        // Check if function signature has reference parameters
        const hasRefParam = code.includes('vector<int>&') || code.includes('vector<int> &');
        
        if (input.nums !== undefined && input.target !== undefined) {
          if (hasRefParam) {
            // Create a variable for reference parameter
            varDecl = `    vector<int> nums${idx} = {${input.nums.join(',')}};\n`;
            args = `nums${idx}, ${input.target}`;
            needsVar = true;
          } else {
            args = `vector<int>{${input.nums.join(',')}}, ${input.target}`;
          }
        } else if (input.nums !== undefined && input.k !== undefined) {
          if (hasRefParam) {
            varDecl = `    vector<int> nums${idx} = {${input.nums.join(',')}};\n`;
            args = `nums${idx}, ${input.k}`;
            needsVar = true;
          } else {
            args = `vector<int>{${input.nums.join(',')}}, ${input.k}`;
          }
        } else if (input.nums !== undefined) {
          if (hasRefParam) {
            varDecl = `    vector<int> nums${idx} = {${input.nums.join(',')}};\n`;
            args = `nums${idx}`;
            needsVar = true;
          } else {
            args = `vector<int>{${input.nums.join(',')}}`;
          }
        } else if (input.s !== undefined && input.t !== undefined) {
          args = `"${input.s}", "${input.t}"`;
        } else {
          args = JSON.stringify(input);
        }
        
        if (needsVar) {
          cppCode += varDecl;
        }
        
        // Determine return type (try to infer from function signature)
        let returnType = 'auto';
        const returnTypePatterns = [
          /vector<\w+>\s+\w+\s*\(/,  // vector<type> return
          /int\s+\w+\s*\(/,  // int return
          /bool\s+\w+\s*\(/,  // bool return
          /string\s+\w+\s*\(/,  // string return
          /double\s+\w+\s*\(/,  // double return
        ];
        
        if (code.match(/vector<\w+>\s+\w+\s*\(/)) {
          returnType = 'vector<int>';
        } else if (code.match(/int\s+\w+\s*\(/)) {
          returnType = 'int';
        } else if (code.match(/bool\s+\w+\s*\(/)) {
          returnType = 'bool';
        } else if (code.match(/string\s+\w+\s*\(/)) {
          returnType = 'string';
        }
        
        cppCode += `    ${returnType} result${idx} = ${funcName}(${args});\n`;
        cppCode += `    cout << "RESULT_${idx}:";\n`;
        cppCode += `    for (int i = 0; i < result${idx}.size(); i++) {\n`;
        cppCode += `        cout << (i > 0 ? "," : "") << result${idx}[i];\n`;
        cppCode += `    }\n`;
        cppCode += `    cout << endl;\n`;
      });
      
      cppCode += '    return 0;\n';
      cppCode += '}\n';
      
      return cppCode;
    
    case 'go':
      // Extract just the function definitions, removing package and main if present
      let goCode = code;
      
      // Remove package declaration if present
      goCode = goCode.replace(/^package\s+\w+\s*\n?/m, '');
      
      // Remove import blocks if present (we'll add our own)
      goCode = goCode.replace(/^import\s*\([^)]*\)\s*\n?/m, '');
      goCode = goCode.replace(/^import\s+"[^"]+"\s*\n?/gm, '');
      
      // Remove existing main function if present (we'll add our own)
      goCode = goCode.replace(/func\s+main\s*\([^)]*\)\s*\{[\s\S]*?\n\}/, '');
      
      // Remove comments that might be at the start
      goCode = goCode.replace(/^\/\/.*$/gm, '');
      goCode = goCode.trim();
      
      // Now add our package, imports, and main
      goCode = `package main\n\nimport (\n    "fmt"\n)\n\n${goCode}\n\nfunc main() {\n`;
      
      testCases.forEach((testCase, idx) => {
        const input = testCase.input;
        let args = '';
        
        if (input.nums !== undefined && input.target !== undefined) {
          args = `[]int{${input.nums.join(',')}}, ${input.target}`;
        } else if (input.nums !== undefined && input.k !== undefined) {
          args = `[]int{${input.nums.join(',')}}, ${input.k}`;
        } else if (input.nums !== undefined) {
          args = `[]int{${input.nums.join(',')}}`;
        } else if (input.s !== undefined && input.t !== undefined) {
          args = `"${input.s}", "${input.t}"`;
        } else {
          args = JSON.stringify(input);
        }
        
        goCode += `    result${idx} := ${funcName}(${args})\n`;
        goCode += `    fmt.Printf("RESULT_${idx}:%v\\n", result${idx})\n`;
      });
      
      goCode += '}\n';
      
      return goCode;
    
    default:
      return code;
  }
}

// Execute code
async function executeCode(language, code, testCases) {
  await ensureTempDir();
  
  const timestamp = Date.now();
  const randomId = Math.random().toString(36).substring(7);
  const fileId = `${timestamp}-${randomId}`;
  
  let filename, compileCmd, runCmd, cleanupFiles;
  
  switch (language) {
    case 'java':
      filename = `Solution_${fileId}.java`;
      compileCmd = `javac ${filename}`;
      runCmd = `java Solution_${fileId}`;
      cleanupFiles = [`Solution_${fileId}.java`, `Solution_${fileId}.class`];
      break;
    
    case 'cpp':
      filename = `solution_${fileId}.cpp`;
      compileCmd = `g++ -std=c++17 -o solution_${fileId} ${filename}`;
      runCmd = `./solution_${fileId}`;
      cleanupFiles = [`solution_${fileId}.cpp`, `solution_${fileId}`];
      break;
    
    case 'go':
      filename = `solution_${fileId}.go`;
      compileCmd = null; // Go doesn't need separate compilation
      runCmd = `go run ${filename}`;
      cleanupFiles = [`solution_${fileId}.go`];
      break;
    
    default:
      throw new Error(`Unsupported language: ${language}`);
  }
  
  const filePath = join(TEMP_DIR, filename);
  const funcName = extractFunctionName(language, code);
  console.log(`🔍 Extracted function name for ${language}: ${funcName}`);
  const testCode = buildTestCode(language, code, funcName, testCases);
  
  try {
    // Write code to file
    await writeFile(filePath, testCode, 'utf8');
    
    // Compile if needed
    if (compileCmd) {
      const { stdout: compileStdout, stderr: compileStderr } = await execAsync(
        compileCmd,
        { cwd: TEMP_DIR, timeout: 10000, env: execEnv }
      );
      
      if (compileStderr && !compileStderr.includes('warning')) {
        throw new Error(`Compilation error: ${compileStderr}`);
      }
    }
    
    // Execute
    const { stdout, stderr } = await execAsync(
      runCmd,
      { cwd: TEMP_DIR, timeout: 5000, env: execEnv }
    );
    
    // Parse output and build results
    const results = testCases.map((testCase, idx) => {
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
    
    // Cleanup
    for (const file of cleanupFiles) {
      try {
        await unlink(join(TEMP_DIR, file));
      } catch (error) {
        // Ignore cleanup errors
      }
    }
    
    return {
      success: true,
      results,
      stdout,
      stderr: stderr || null
    };
  } catch (error) {
    // Cleanup on error
    for (const file of cleanupFiles) {
      try {
        await unlink(join(TEMP_DIR, file));
      } catch (cleanupError) {
        // Ignore cleanup errors
      }
    }
    
    // Provide helpful error messages
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
    
    return {
      success: false,
      error: errorMessage,
      stderr: error.stderr || null
    };
  }
}

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Compiler check endpoint
app.get('/api/check-compilers', async (req, res) => {
  const compilers = {
    java: { installed: false, version: null, error: null },
    cpp: { installed: false, version: null, error: null },
    go: { installed: false, version: null, error: null }
  };
  
  // Check Java
  try {
    const { stdout } = await execAsync('javac -version', { timeout: 3000, env: execEnv });
    compilers.java.installed = true;
    compilers.java.version = stdout.trim() || 'installed';
  } catch (error) {
    compilers.java.error = error.message;
  }
  
  // Check C++
  try {
    const { stdout } = await execAsync('g++ --version', { timeout: 3000, env: execEnv });
    compilers.cpp.installed = true;
    compilers.cpp.version = stdout.split('\n')[0] || 'installed';
  } catch (error) {
    compilers.cpp.error = error.message;
  }
  
  // Check Go
  try {
    const { stdout } = await execAsync('go version', { timeout: 3000, env: execEnv });
    compilers.go.installed = true;
    compilers.go.version = stdout.trim() || 'installed';
  } catch (error) {
    compilers.go.error = error.message;
  }
  
  res.json(compilers);
});

// Execute endpoint
app.post('/api/execute', async (req, res) => {
  try {
    const { language, code, testCases } = req.body;
    
    if (!language || !code || !testCases) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields: language, code, testCases'
      });
    }
    
    if (!['java', 'cpp', 'go'].includes(language)) {
      return res.status(400).json({
        success: false,
        error: `Unsupported language: ${language}`
      });
    }
    
    // Validate code matches language
    if (language === 'cpp') {
      // Check for JavaScript patterns
      if (code.includes('function ') && !code.includes('std::function')) {
        console.log('❌ Received JavaScript code for C++ language!');
        console.log('Code preview:', code.substring(0, 200));
        return res.status(400).json({
          success: false,
          error: 'Invalid code: The code appears to be JavaScript, not C++. Please ensure you have selected the C++ language and the correct code is loaded in the editor.'
        });
      }
    }
    
    console.log(`📝 Executing ${language} code (${code.length} chars)`);
    const result = await executeCode(language, code, testCases);
    
    if (result.success) {
      res.json(result);
    } else {
      res.status(500).json(result);
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message || 'Internal server error'
    });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Compiler API server running on http://localhost:${PORT}`);
  console.log(`📝 Supported languages: Java, C++, Go`);
});

