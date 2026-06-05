import express, { Request, Response } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import logger from './shared/utils/logger.js';
import accountRoutes from './domains/accounts/account.routes.js';
import postRoutes from './domains/posts/post.routes.js';
import aiRoutes from './domains/ai/ai.routes.js';
import webhookRoutes from './domains/webhooks/webhook.routes.js';
import analyticsRoutes from './domains/analytics/analytics.routes.js';
import { errorMiddleware } from './shared/middleware/error.middleware.js';
import { NotFoundError } from './shared/errors/AppError.js';

dotenv.config();

const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json());

// Request logging middleware
app.use((req, res, next) => {
  logger.info(`${req.method} ${req.url}`);
  next();
});

// Routes
app.use('/api/accounts', accountRoutes);
app.use('/api/posts', postRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/webhooks', webhookRoutes);
app.use('/api/analytics', analyticsRoutes);

// Health check endpoint
app.get('/health', (req: Request, res: Response) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// 404 handler
app.use((req, res, next) => {
  next(new NotFoundError(`Route ${req.method} ${req.url} not found`));
});

// Global Error Handler (Must be last)
app.use(errorMiddleware);

export default app;
