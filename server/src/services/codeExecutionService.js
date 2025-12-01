// Service for executing code in different languages
import { exec } from 'child_process';
import { promisify } from 'util';
import { writeFile, unlink } from 'fs/promises';
import { join } from 'path';
import { TEMP_DIR, execEnv } from '../config/environment.js';
import { COMPILER_TIMEOUTS, SUPPORTED_LANGUAGES } from '../config/constants.js';
import { extractFunctionName } from '../utils/functionExtractor.js';
import { buildTestCode } from '../utils/testCodeBuilder.js';
import { ensureTempDir } from '../utils/fileManager.js';
import { parseExecutionOutput, formatErrorMessage } from '../utils/outputParser.js';

const execAsync = promisify(exec);

/**
 * Execute code in the specified language
 * @param {string} language - Programming language
 * @param {string} code - Source code
 * @param {Array} testCases - Array of test cases
 * @returns {Promise<Object>} - Execution result
 */
export async function executeCode(language, code, testCases) {
  if (!SUPPORTED_LANGUAGES.includes(language)) {
    throw new Error(`Unsupported language: ${language}`);
  }

  await ensureTempDir();
  
  const timestamp = Date.now();
  const randomId = Math.random().toString(36).substring(7);
  const fileId = `${timestamp}-${randomId}`;
  
  const { filename, compileCmd, runCmd, cleanupFiles } = getLanguageConfig(language, fileId);
  const filePath = join(TEMP_DIR, filename);
  const funcName = extractFunctionName(language, code);
  
  console.log(`🔍 Extracted function name for ${language}: ${funcName}`);
  const testCode = buildTestCode(language, code, funcName, testCases);
  
  try {
    // Write code to file
    await writeFile(filePath, testCode, 'utf8');
    
    // Compile if needed
    if (compileCmd) {
      await compileCode(compileCmd);
    }
    
    // Execute
    const { stdout, stderr } = await execAsync(
      runCmd,
      { cwd: TEMP_DIR, timeout: COMPILER_TIMEOUTS.execution, env: execEnv }
    );
    
    // Parse output and build results
    const results = parseExecutionOutput(stdout, stderr, testCases);
    
    // Cleanup
    await cleanupTempFiles(cleanupFiles);
    
    return {
      success: true,
      results,
      stdout,
      stderr: stderr || null
    };
  } catch (error) {
    // Cleanup on error
    await cleanupTempFiles(cleanupFiles);
    
    return {
      success: false,
      error: formatErrorMessage(error),
      stderr: error.stderr || null
    };
  }
}

/**
 * Get language-specific configuration
 * @param {string} language - Programming language
 * @param {string} fileId - Unique file identifier
 * @returns {Object} - Language configuration
 */
function getLanguageConfig(language, fileId) {
  switch (language) {
    case 'java':
      return {
        filename: `Solution_${fileId}.java`,
        compileCmd: `javac Solution_${fileId}.java`,
        runCmd: `java Solution_${fileId}`,
        cleanupFiles: [`Solution_${fileId}.java`, `Solution_${fileId}.class`]
      };
    
    case 'cpp':
      return {
        filename: `solution_${fileId}.cpp`,
        compileCmd: `g++ -std=c++17 -o solution_${fileId} solution_${fileId}.cpp`,
        runCmd: `./solution_${fileId}`,
        cleanupFiles: [`solution_${fileId}.cpp`, `solution_${fileId}`]
      };
    
    case 'go':
      return {
        filename: `solution_${fileId}.go`,
        compileCmd: null, // Go doesn't need separate compilation
        runCmd: `go run solution_${fileId}.go`,
        cleanupFiles: [`solution_${fileId}.go`]
      };
    
    default:
      throw new Error(`Unsupported language: ${language}`);
  }
}

/**
 * Compile code
 * @param {string} compileCmd - Compilation command
 */
async function compileCode(compileCmd) {
  const { stdout: compileStdout, stderr: compileStderr } = await execAsync(
    compileCmd,
    { cwd: TEMP_DIR, timeout: COMPILER_TIMEOUTS.compilation, env: execEnv }
  );
  
  if (compileStderr && !compileStderr.includes('warning')) {
    throw new Error(`Compilation error: ${compileStderr}`);
  }
}

/**
 * Cleanup temporary files
 * @param {Array} files - Array of file names to delete
 */
async function cleanupTempFiles(files) {
  for (const file of files) {
    try {
      await unlink(join(TEMP_DIR, file));
    } catch (error) {
      // Ignore cleanup errors
    }
  }
}

