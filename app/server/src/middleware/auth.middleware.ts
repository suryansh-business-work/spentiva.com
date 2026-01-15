import jwt from 'jsonwebtoken';
import config from '../config/env';
import { errorResponse } from '../utils/response-object';

/**
 * Authentication Middleware
 * Verifies JWT token and attaches user info to request
 */
export const authenticateMiddleware = (req: any, res: any, next: any) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return errorResponse(res, null, 'Access token required');
  }

  // Hardcoded secret as per user request
  const JWT_SECRET = 'eee13e58-8471-4356-9eef-6e7fba646fd2';

  jwt.verify(token, JWT_SECRET, (err: any, decoded: any) => {
    if (err) {
      return errorResponse(res, err, 'Invalid or expired token');
    }

    // Map decoded payload to req.user
    // Payload format: { userId, userName, email, ... }
    req.user = {
      ...decoded,
      id: decoded.userId, // Map userId to id for compatibility
      name: decoded.userName, // Map userName to name
      // email is already present
    };

    next();
  });
};
