// Utility functions for file management
import { mkdir } from 'fs/promises';
import { TEMP_DIR } from '../config/environment.js';

/**
 * Ensure temporary directory exists
 */
export async function ensureTempDir() {
  try {
    await mkdir(TEMP_DIR, { recursive: true });
  } catch (error) {
    // Directory might already exist
  }
}

