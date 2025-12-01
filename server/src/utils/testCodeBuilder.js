// Utility functions for building test code wrappers

/**
 * Build test code wrapper with test cases
 * @param {string} language - Programming language
 * @param {string} code - User's code
 * @param {string} funcName - Function name to call
 * @param {Array} testCases - Array of test cases
 * @returns {string} - Complete testable code
 */
export function buildTestCode(language, code, funcName, testCases) {
  switch (language) {
    case 'java':
      return buildJavaTestCode(code, funcName, testCases);
    
    case 'cpp':
      return buildCppTestCode(code, funcName, testCases);
    
    case 'go':
      return buildGoTestCode(code, funcName, testCases);
    
    default:
      return code;
  }
}

/**
 * Build Java test code wrapper
 */
function buildJavaTestCode(code, funcName, testCases) {
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
}

/**
 * Build C++ test code wrapper
 */
function buildCppTestCode(code, funcName, testCases) {
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
}

/**
 * Build Go test code wrapper
 */
function buildGoTestCode(code, funcName, testCases) {
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
}

