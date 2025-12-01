// Utility functions for building test code wrappers and extracting function names

/**
 * Extract function name from code based on language
 */
export function extractFunctionName(language, code) {
  switch (language) {
    case 'java':
      const javaMatch = code.match(/public\s+(?:static\s+)?\w+\s+(\w+)\s*\(/);
      return javaMatch ? javaMatch[1] : 'solution';
    
    case 'cpp':
      return extractCppFunctionName(code);
    
    case 'go':
      const goMatch = code.match(/func\s+(\w+)\s*\(/);
      return goMatch ? goMatch[1] : 'Solution';
    
    default:
      return 'solution';
  }
}

function extractCppFunctionName(code) {
  const cleanCode = code.replace(/\/\/.*$/gm, '').trim();
  const cppPatterns = [
    /vector<\w+>\s+(\w+)\s*\(/,
    /(?:^|\n)\s*(?:int|bool|string|double|float|char|void)\s+(\w+)\s*\(/,
    /(?:^|\n)\s*[\w:<>]+\s+(\w+)\s*\(/,
  ];
  
  for (const pattern of cppPatterns) {
    const match = cleanCode.match(pattern);
    if (match && match[1]) {
      return match[1];
    }
  }
  
  // Try common function names
  const commonNames = ['twoSum', 'containsDuplicate', 'isAnagram', 'groupAnagrams',
    'topKFrequent', 'productExceptSelf', 'isValidSudoku', 'longestConsecutive', 'solution'];
  
  for (const name of commonNames) {
    if (code.includes(`${name}(`)) return name;
  }
  
  return 'solution';
}

/**
 * Build test code wrapper with test cases for Judge0
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

function buildJavaTestCode(code, funcName, testCases) {
  let javaCode = `import java.util.*;\n\npublic class Solution {\n`;
  
  const indentedCode = code.split('\n').map(line => '    ' + line).join('\n');
  javaCode += indentedCode;
  
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
    
    javaCode += `        Object result${idx} = solution.${funcName}(${args});\n`;
    javaCode += `        System.out.println("RESULT_${idx}:" + java.util.Arrays.deepToString(new Object[]{result${idx}}));\n`;
  });
  
  javaCode += '    }\n}\n';
  return javaCode;
}

function buildCppTestCode(code, funcName, testCases) {
  let cppCode = `#include <iostream>\n#include <vector>\n#include <unordered_map>\n#include <string>\n#include <algorithm>\nusing namespace std;\n\n`;
  cppCode += code;
  cppCode += '\n\nint main() {\n';
  
  testCases.forEach((testCase, idx) => {
    const input = testCase.input;
    let args = '';
    const hasRefParam = code.includes('vector<int>&') || code.includes('vector<int> &');
    
    if (input.nums !== undefined && input.target !== undefined) {
      if (hasRefParam) {
        cppCode += `    vector<int> nums${idx} = {${input.nums.join(',')}};\n`;
        args = `nums${idx}, ${input.target}`;
      } else {
        args = `vector<int>{${input.nums.join(',')}}, ${input.target}`;
      }
    } else if (input.nums !== undefined && input.k !== undefined) {
      if (hasRefParam) {
        cppCode += `    vector<int> nums${idx} = {${input.nums.join(',')}};\n`;
        args = `nums${idx}, ${input.k}`;
      } else {
        args = `vector<int>{${input.nums.join(',')}}, ${input.k}`;
      }
    } else if (input.nums !== undefined) {
      if (hasRefParam) {
        cppCode += `    vector<int> nums${idx} = {${input.nums.join(',')}};\n`;
        args = `nums${idx}`;
      } else {
        args = `vector<int>{${input.nums.join(',')}}`;
      }
    } else if (input.s !== undefined && input.t !== undefined) {
      args = `"${input.s}", "${input.t}"`;
    }
    
    const returnType = code.match(/vector<\w+>\s+\w+\s*\(/) ? 'vector<int>' :
                      code.match(/int\s+\w+\s*\(/) ? 'int' :
                      code.match(/bool\s+\w+\s*\(/) ? 'bool' :
                      code.match(/string\s+\w+\s*\(/) ? 'string' : 'auto';
    
    cppCode += `    ${returnType} result${idx} = ${funcName}(${args});\n`;
    cppCode += `    cout << "RESULT_${idx}:";\n`;
    if (returnType.includes('vector')) {
      cppCode += `    for (int i = 0; i < result${idx}.size(); i++) {\n`;
      cppCode += `        cout << (i > 0 ? "," : "") << result${idx}[i];\n`;
      cppCode += `    }\n`;
    } else {
      cppCode += `    cout << result${idx};\n`;
    }
    cppCode += `    cout << endl;\n`;
  });
  
  cppCode += '    return 0;\n}\n';
  return cppCode;
}

function buildGoTestCode(code, funcName, testCases) {
  let goCode = code.replace(/^package\s+\w+\s*\n?/m, '')
                   .replace(/^import\s*\([^)]*\)\s*\n?/m, '')
                   .replace(/^import\s+"[^"]+"\s*\n?/gm, '')
                   .replace(/func\s+main\s*\([^)]*\)\s*\{[\s\S]*?\n\}/, '')
                   .replace(/^\/\/.*$/gm, '')
                   .trim();
  
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
    }
    
    goCode += `    result${idx} := ${funcName}(${args})\n`;
    goCode += `    fmt.Printf("RESULT_${idx}:%v\\n", result${idx})\n`;
  });
  
  goCode += '}\n';
  return goCode;
}

