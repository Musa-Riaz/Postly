import { Router } from 'express';
import { authMiddleware } from '../../shared/middleware/auth.middleware';
import { AIController } from './ai.controller';
import { GeminiService } from './ai.service';

const router = Router();
const aiService = new GeminiService();
const aiController = new AIController(aiService);

router.use(authMiddleware);

router.post('/generate', aiController.generate);

export default router;
