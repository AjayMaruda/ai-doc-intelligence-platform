import { NextFunction, Request, Response } from 'express';
import { login, registerUser, viewProfile } from '../auth/auth.service';
import { StatusCodes } from 'http-status-codes';
import { AUTH_MESSAGES } from '../../constants/messages';
import { loginSchema } from './auth.validation';

export const register = async function (
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const result = await registerUser(req.body);

    res.status(StatusCodes.ACCEPTED).json({
      success: true,
      message: `User ${AUTH_MESSAGES.REGISTERED_SUCCESSFULLY}`,
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

export const loginUser = async function (
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const data = loginSchema.parse(req.body);
    const result = await login(data.email, data.password);

    res.status(StatusCodes.ACCEPTED).json(result);
  } catch (error) {
    next(error);
  }
};

export const viewProfileUser = async function (
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const result = await viewProfile(req.user!.id);

    res.status(StatusCodes.OK).json({
      success: true,
      message: `User profile ${AUTH_MESSAGES.GET}`,
      data: result,
    });
  } catch (error) {
    next(error);
  }
};
