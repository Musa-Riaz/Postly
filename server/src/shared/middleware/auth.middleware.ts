import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import jwksClient from 'jwks-rsa';
import logger from '../utils/logger.js';

export interface AuthRequest extends Request {
  user?: {
    id: string;
    email?: string;
  };
}

// Helper to get JWKS Client
let _jwksClient: any = null;
const getJwksClient = () => {
  if (!_jwksClient) {
    const projectId = process.env.SUPABASE_PROJECT_ID;
    if (!projectId) {
      throw new Error('SUPABASE_PROJECT_ID is missing');
    }
    _jwksClient = jwksClient({
      jwksUri: `https://${projectId}.supabase.co/auth/v1/.well-known/jwks.json`
    });
  }
  return _jwksClient;
};

function getKey(header: any, callback: any) {
  const client = getJwksClient();
  client.getSigningKey(header.kid, function(err: any, key: any) {
    if (err) {
      callback(err);
    } else {
      const signingKey = key?.getPublicKey();
      callback(null, signingKey);
    }
  });
}

export const authMiddleware = (req: AuthRequest, res: Response, next: NextFunction) => {
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
    const header = JSON.parse(Buffer.from(tokenParts[0], 'base64').toString());

    if (header.alg === 'ES256') {
      jwt.verify(token, getKey, { algorithms: ['ES256'] }, (err, decoded) => {
        if (err) {
          logger.error({ error: err.message }, 'JWKS Verification failed');
          return res.status(401).json({ error: `Unauthorized: ${err.message}` });
        }
        
        const payload = decoded as { sub: string; email?: string };
        req.user = {
          id: payload.sub,
          email: payload.email,
        };
        next();
      });
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

