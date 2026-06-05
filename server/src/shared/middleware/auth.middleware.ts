import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { createRemoteJWKSet, jwtVerify } from 'jose';
import logger from '../utils/logger.js';

export interface AuthRequest extends Request {
  user?: {
    id: string;
    email?: string;
  };
}

// Helper to get JWKS Client
let _jwks: any = null;
const getJWKS = () => {
  if (!_jwks) {
    const projectId = process.env.SUPABASE_PROJECT_ID;
    if (!projectId) {
      throw new Error('SUPABASE_PROJECT_ID is missing');
    }
    _jwks = createRemoteJWKSet(
        new URL(`https://${projectId}.supabase.co/auth/v1/.well-known/jwks.json`)
    );
  }
  return _jwks;
};

export const authMiddleware = async (req: AuthRequest, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Unauthorized: No token provided' });
  }

  const token = authHeader.split(' ')[1];

  try {
    // If we have a secret and the token is HS256, we can use the secret
    // But since the log shows ES256, we MUST use JWKS or the Project Public Key
    const secret = process.env.SUPABASE_JWT_SECRET;
    
    // Check if token is ES256 (Supabase Default now)
    const tokenParts = token.split('.');
    if (tokenParts.length !== 3) {
      throw new Error('Invalid token format');
    }
    const header = JSON.parse(Buffer.from(tokenParts[0], 'base64').toString());

    if (header.alg === 'ES256') {
      const JWKS = getJWKS();
      const { payload } = await jwtVerify(token, JWKS, {
        algorithms: ['ES256'],
      });
      
      req.user = {
        id: payload.sub as string,
        email: payload.email as string,
      };
      next();
    } else {
      // Fallback to HMAC if using older Supabase project or custom secret
      if (!secret) throw new Error('SUPABASE_JWT_SECRET is missing for HS256');
      const decoded = jwt.verify(token, secret) as { sub: string; email?: string };
      req.user = {
        id: decoded.sub,
        email: decoded.email,
      };
      next();
    }
  } catch (error: any) {
    logger.error({ 
      error: error.message,
      tokenHint: token.substring(0, 10) + '...'
    }, 'JWT Verification failed');
    return res.status(401).json({ error: `Unauthorized: ${error.message}` });
  }
};

