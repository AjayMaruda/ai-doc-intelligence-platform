import { Request, Response, NextFunction } from 'express';
import { ZodObject, ZodRawShape } from 'zod';
import { ApiError } from '../utils/apiError';
import { StatusCodes } from 'http-status-codes';
import { AUTH_MESSAGES } from '../constants/messages';

export const validate =
  <T extends ZodRawShape>(schema: ZodObject<T>) =>
  (req: Request, res: Response, next: NextFunction): void => {
    const result = schema.safeParse(req.body);
    if (!result.success) {
      return next(
        new ApiError(
          StatusCodes.BAD_REQUEST,
          AUTH_MESSAGES.VALIDATION_FAILED,
          result.error?.issues,
        ),
      );
    }

    req.body = result.data;
    next();
  };
