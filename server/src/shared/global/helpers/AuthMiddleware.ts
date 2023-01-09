import { NotAuthorizedError } from './ErrorHandler';
import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { config } from '@/config';
import { AuthPayload } from '@/features/auth/interfaces/Auth';

export class AuthMiddleware {
  public verifyUser(req: Request, _res: Response, next: NextFunction): void {
    if (!req.session?.jwt) {
      throw new NotAuthorizedError(
        'Token is not available. Please login again.',
      );
    }

    try {
      const payload = jwt.verify(
        req.session?.jwt,
        config.JWT_TOKEN,
      ) as AuthPayload;
      req.currentUser = payload;
    } catch (error) {
      throw new NotAuthorizedError(
        'Token is not available. Please login again.',
      );
    }
    next();
  }

  public checkAuthentication(
    req: Request,
    _res: Response,
    next: NextFunction,
  ): void {
    if (!req.currentUser) {
      throw new NotAuthorizedError(
        'Authentication is required to access this resource.',
      );
    }
    next();
  }
}

export const authMiddleware = new AuthMiddleware();
