import type { Request, Response, NextFunction } from 'express';
import { Unauthenticated } from '../errors';

export function requireAuth(req: Request, _res: Response, next: NextFunction) {
  if (!req.auth.userId) {
    throw new Unauthenticated('Not Authenticated');
  }
  next();
}
