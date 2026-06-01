import express, { Request, Response } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import logger from './shared/utils/logger';
import accountRoutes from './domains/accounts/account.routes';
import { errorMiddleware } from './shared/middleware/error.middleware';
import { NotFoundError } from './shared/errors/AppError';

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
