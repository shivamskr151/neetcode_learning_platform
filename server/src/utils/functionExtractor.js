// Utility functions for extracting function names from code
import { RESERVED_CPP_WORDS, COMMON_FUNCTION_NAMES } from '../config/constants.js';

/**
 * Extract function name from code based on language
 * @param {string} language - Programming language
 * @param {string} code - Source code
 * @returns {string} - Extracted function name
 */
export function extractFunctionName(language, code) {
  switch (language) {
    case 'java':
      // Match: public static ... returnType functionName(...)
      const javaMatch = code.match(/public\s+static\s+\w+\s+(\w+)\s*\(/);
      return javaMatch ? javaMatch[1] : 'solution';
    
    case 'cpp':
      return extractCppFunctionName(code);
    
    case 'go':
      // Match: func functionName(...)
      const goMatch = code.match(/func\s+(\w+)\s*\(/);
      return goMatch ? goMatch[1] : 'Solution';
    
    default:
      return 'solution';
  }
}

/**
 * Extract function name from C++ code
 * @param {string} code - C++ source code
 * @returns {string} - Extracted function name
 */
function extractCppFunctionName(code) {
  // Clean code - remove comments that might interfere
  const cleanCode = code.replace(/\/\/.*$/gm, '').trim();
  
  // Match: returnType functionName(...) - handles templates, references, etc.
  // Try multiple patterns in order of specificity
  const cppPatterns = [
    // Pattern 1: vector<type> functionName(...) - most specific
    /vector<\w+>\s+(\w+)\s*\(/,
    // Pattern 2: int/bool/string return type
    /(?:^|\n)\s*(?:int|bool|string|double|float|char|void)\s+(\w+)\s*\(/,
    // Pattern 3: Any return type (including templates) followed by function name
    /(?:^|\n)\s*[\w:<>]+\s+(\w+)\s*\(/,
    // Pattern 4: Simple function name at start of line
    /(?:^|\n)\s*(\w+)\s*\(/,
  ];
  
  // Try patterns in order
  for (const pattern of cppPatterns) {
    const match = cleanCode.match(pattern);
    if (match && match[1]) {
      const funcName = match[1];
      if (!RESERVED_CPP_WORDS.includes(funcName) && /^[a-zA-Z_][a-zA-Z0-9_]*$/.test(funcName)) {
        console.log(`✅ Found C++ function: ${funcName}`);
        return funcName;
      }
    }
  }
  
  console.log(`⚠️  C++ function not found with patterns, trying common names...`);
  
  // Try common function names by checking if they appear in function definition
  for (const name of COMMON_FUNCTION_NAMES) {
    // Check if it's a function definition - look for return type before function name
    const funcDefPattern = new RegExp(`[\\w:<>]+\\s+${name}\\s*\\([^)]*\\)\\s*\\{`, 'm');
    if (funcDefPattern.test(cleanCode) || funcDefPattern.test(code)) {
      console.log(`✅ Found C++ function via common names: ${name}`);
      return name;
    }
  }
  
  console.log(`❌ C++ function not found, defaulting to 'solution'`);
  console.log(`Code preview: ${cleanCode.substring(0, 150)}...`);
  return 'solution';
}

