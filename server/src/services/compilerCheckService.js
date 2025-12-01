// Service for checking compiler availability
import { exec } from 'child_process';
import { promisify } from 'util';
import { execEnv } from '../config/environment.js';

const execAsync = promisify(exec);

/**
 * Check availability of all compilers
 * @returns {Promise<Object>} - Compiler status for each language
 */
export async function checkCompilers() {
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
  
  return compilers;
}

