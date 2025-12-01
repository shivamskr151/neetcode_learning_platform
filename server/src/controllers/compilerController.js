// Compiler controller
import { checkCompilers } from '../services/compilerCheckService.js';

/**
 * Check compiler availability endpoint handler
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
export async function checkCompilersHandler(req, res) {
  try {
    const compilers = await checkCompilers();
    res.json(compilers);
  } catch (error) {
    res.status(500).json({
      error: error.message || 'Failed to check compilers'
    });
  }
}

