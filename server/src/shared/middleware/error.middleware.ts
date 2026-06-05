import { Request, Response, NextFunction } from 'express';
import { AppError } from '../errors/AppError.js';
import logger from '../utils/logger.js';

export const errorMiddleware = (
  err: Error | AppError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (err instanceof AppError) {
    logger.error({
      message: err.message,
      statusCode: err.statusCode,
      stack: err.stack,
      path: req.path,
      method: req.method,
    });

    return res.status(err.statusCode).json({
      status: 'error',
      message: err.message,
    });
  }

  // Unexpected errors
  logger.error({
    message: err.message,
    stack: err.stack,
    path: req.path,
    method: req.method,
  });

  return res.status(500).json({
    status: 'error',
    message: process.env.NODE_ENV === 'production' 
      ? 'An unexpected error occurred' 
      : err.message,
  });
};
