// Main routes file
import express from 'express';
import { healthCheck } from '../controllers/healthController.js';
import { checkCompilersHandler } from '../controllers/compilerController.js';
import { executeCodeHandler } from '../controllers/executeController.js';

const router = express.Router();

// Health check route
router.get('/health', healthCheck);

// Compiler check route
router.get('/api/check-compilers', checkCompilersHandler);

// Execute code route
router.post('/api/execute', executeCodeHandler);

export default router;

