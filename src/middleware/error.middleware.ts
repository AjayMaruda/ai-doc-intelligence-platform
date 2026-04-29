import { NextFunction, Request, Response } from 'express';
import { logger } from '../config/logger';
import { env } from '../config/env';

export function errorHandler(
  err: any,
  _req: Request,
  res: Response,
  _next: NextFunction,
) {
  logger.error(
    {
      message: err.message,
      stack: err.stack,
    },
    'Unhandled Error',
  );
  res.status(500).json({
    success: false,
    message: err.message || 'Internal Server Error',
    error: env.NODE_ENV === 'development' ? err.stack : undefined,
  });
}
