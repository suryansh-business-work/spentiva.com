import jwt from 'jsonwebtoken';
import type { Request } from 'express';
import config from '../config/config';

/**
 * Authenticated user attached to the GraphQL context.
 * Mirrors the shape produced by the REST `authenticateMiddleware` so that
 * resolvers and existing services can share the same expectations.
 */
export interface AuthContextUser {
  id: string;
  userId: string;
  email: string;
  name: string;
  userName: string;
  role: 'user' | 'admin';
}

export interface GraphQLContext {
  user: AuthContextUser | null;
  ip?: string;
}

interface JwtPayload {
  userId: string;
  email: string;
  userName: string;
  role: 'user' | 'admin';
}

/**
 * Builds the per-request GraphQL context. Authentication is optional here —
 * resolvers decide whether a user is required via `requireAuth`/`requireAdmin`.
 */
export const buildContext = async ({ req }: { req: Request }): Promise<GraphQLContext> => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  const ip = req.ip || req.socket?.remoteAddress;

  if (!token) {
    return { user: null, ip };
  }

  try {
    const decoded = jwt.verify(token, config.JWT_SECRET) as JwtPayload;
    return {
      user: {
        id: decoded.userId,
        userId: decoded.userId,
        email: decoded.email,
        name: decoded.userName,
        userName: decoded.userName,
        role: decoded.role,
      },
      ip,
    };
  } catch {
    // Invalid/expired token => treat as anonymous; protected resolvers throw.
    return { user: null, ip };
  }
};
