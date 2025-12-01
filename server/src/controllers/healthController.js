// Health check controller

/**
 * Health check endpoint handler
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
export function healthCheck(req, res) {
  res.json({ 
    status: 'ok', 
    timestamp: new Date().toISOString() 
  });
}

