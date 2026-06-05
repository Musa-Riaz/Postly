import { Response, NextFunction } from 'express';
import { AIService } from './ai.entity.js';
import { AuthRequest } from '../../shared/middleware/auth.middleware.js';
import { AuthenticationError } from '../../shared/errors/AppError.js';

export class AIController {
  constructor(private readonly aiService: AIService) {}

  generate = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const userId = req.user?.id;
      if (!userId) throw new AuthenticationError('User not authenticated');

      const { prompt, tone, platform } = req.body;
      const content = await this.aiService.generateContent({ prompt, tone, platform });

      res.json({ content });
    } catch (error) {
      next(error);
    }
  };
}
