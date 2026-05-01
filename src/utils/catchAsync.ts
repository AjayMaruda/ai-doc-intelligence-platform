import { NextFunction, Request, Response } from 'express';

type AsyncHandler = (
  req: Request,
  res: Response,
  next: NextFunction,
) => Promise<void>;

/**
 * Wraps an asynchronous function to catch any errors and pass them to the next middleware.
 * @param fn The asynchronous function to wrap.
 * @returns A function that executes the asynchronous function and catches any errors.
 */
export const catchAsync =
  (fn: AsyncHandler) =>
  (req: Request, res: Response, next: NextFunction): void => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
