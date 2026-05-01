import { NextFunction, Request, Response } from 'express';
import { login, registerUser, viewProfile } from '../auth/auth.service';
import { StatusCodes } from 'http-status-codes';
import { AUTH_MESSAGES } from '../../constants/messages';
import { loginSchema } from './auth.validation';
import { sendResponse } from '../../utils/apiResponse';
import { catchAsync } from '../../utils/catchAsync';

export const register = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const result = await registerUser(req.body);

    sendResponse(res, {
      statusCode: StatusCodes.ACCEPTED,
      success: true,
      message: `User ${AUTH_MESSAGES.REGISTERED_SUCCESSFULLY}`,
      data: result,
    });
  },
);

export const loginUser = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const data = loginSchema.parse(req.body);
    const result = await login(data.email, data.password);

    sendResponse(res, {
      statusCode: StatusCodes.ACCEPTED,
      success: true,
      message: 'Logged in successfully.',
      data: result,
    });
  },
);

export const viewProfileUser = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const result = await viewProfile(req.user!.id);

    sendResponse(res, {
      statusCode: StatusCodes.OK,
      success: true,
      message: `User profile ${AUTH_MESSAGES.GET}`,
      data: result,
    });
  },
);
