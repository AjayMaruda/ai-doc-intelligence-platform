import { Request, Response, NextFunction } from 'express';
import { StatusCodes } from 'http-status-codes';
import { verifyAccessToken } from '../utils/jwt';
import { ApiError } from '../utils/apiError';

export const authenticate = (
  req: Request,
  _res: Response,
  next: NextFunction,
) => {
  try {
    const authHeader = req.headers['authorization'];

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new ApiError(
        StatusCodes.UNAUTHORIZED,
        'Authentication token missing or invalid.',
      );
    }

    const token = authHeader.split(' ')[1];
    const decoded = verifyAccessToken(token);

    req.user = {
      id: decoded.userId,
      email: decoded.email,
    };

    next();
  } catch (error) {
    if (
      (error as Error).name === 'TokenExpiredError' ||
      (error as Error).name === 'JsonWebTokenError'
    ) {
      return next(
        new ApiError(StatusCodes.UNAUTHORIZED, (error as Error).message),
      );
    }
    next(error);
  }
};
