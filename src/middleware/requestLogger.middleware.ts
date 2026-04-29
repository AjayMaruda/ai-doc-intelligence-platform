import { Request, Response, NextFunction } from 'express';
import { logger } from '../config/logger';

export function requestLogger(req: Request, res: Response, next: NextFunction) {
  const startTimer = Date.now();

  logger.info(
    {
      method: req.method,
      url: req.originalUrl,
      query: req.query,
      params: req.params,
      ip: req.ip,
    },
    'Incoming Request',
  );

  res.on('finish', () => {
    logger.info(
      {
        method: req.method,
        url: req.originalUrl,
        statusCode: res.statusCode,
        duratuon: `${Date.now() - startTimer} ms`,
      },
      'Request Completed',
    );
  });

  next();
}
