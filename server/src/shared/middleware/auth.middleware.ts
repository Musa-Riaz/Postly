import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import logger from '../utils/logger';

export interface AuthRequest extends Request {
  user?: {
    id: string;
    email?: string;
  };
}

export const authMiddleware = (req: AuthRequest, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Unauthorized: No token provided' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const secret = process.env.SUPABASE_JWT_SECRET;
    
    if (!secret) {
      logger.error('SUPABASE_JWT_SECRET is not defined in environment variables');
      return res.status(500).json({ error: 'Internal server error' });
    }

    const decoded = jwt.verify(token, secret) as { sub: string; email?: string };

    req.user = {
      id: decoded.sub, // Supabase uses 'sub' for user ID
      email: decoded.email,
    };

    next();
  } catch (error) {
    logger.error('JWT Verification failed:', error);
    return res.status(401).json({ error: 'Unauthorized: Invalid token' });
  }
};
