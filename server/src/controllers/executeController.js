// Code execution controller
import { executeCode } from '../services/codeExecutionService.js';
import { SUPPORTED_LANGUAGES } from '../config/constants.js';

/**
 * Execute code endpoint handler
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
export async function executeCodeHandler(req, res) {
  try {
    const { language, code, testCases } = req.body;
    
    // Validate required fields
    if (!language || !code || !testCases) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields: language, code, testCases'
      });
    }
    
    // Validate language
    if (!SUPPORTED_LANGUAGES.includes(language)) {
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
}

