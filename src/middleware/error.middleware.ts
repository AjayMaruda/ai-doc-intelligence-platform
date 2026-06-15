import { NextFunction, Request, Response } from 'express';
import { logger } from '../config/logger';
import { ApiError } from '../utils/apiError';

export function errorHandler(
  err: any,
  _req: Request,
  res: Response,
  _next: NextFunction,
) {
  const statusCode = err instanceof ApiError ? err.statusCode : 500;
  const message = err.message || 'Internal Server Error';

  logger.error(
    {
      statusCode,
      message,
      stack: err.stack,
    },
    'API Error',
  );

  res.status(statusCode).json({
    success: false,
    statusCode,
    message,
    data: null,
  });
}
