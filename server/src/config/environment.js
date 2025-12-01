// Environment configuration and setup
import { execSync } from 'child_process';
import { join } from 'path';
import { tmpdir } from 'os';

// Set up environment for child processes to find Java
export function getJavaHome() {
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
export const execEnv = { ...process.env };
if (javaHome) {
  execEnv.JAVA_HOME = javaHome;
  execEnv.PATH = `${javaHome}/bin:${process.env.PATH}`;
  console.log(`✅ Java found at: ${javaHome}`);
} else {
  console.log('⚠️  Java not found in standard locations. Make sure Java is installed and JAVA_HOME is set.');
}

// Temporary directory for code files
export const TEMP_DIR = join(tmpdir(), 'algo-compiler');

// Server configuration
export const PORT = process.env.PORT || 3001;

