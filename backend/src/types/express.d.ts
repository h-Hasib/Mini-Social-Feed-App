import { Request } from 'express';

declare global {
  namespace Express {
    interface Request {
      user?: {
        userId: string;
        sessionId: string;
        email?: string;
        userName?: string;
        [key: string]: any;
      };
    }
  }
}