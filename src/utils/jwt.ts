import jwt from 'jsonwebtoken';
import { env } from '../config/env';

export const generateAccessToken = (userId: number, email: string): string => {
  return jwt.sign({ userId, email }, env.JWT_SECRET, {
    expiresIn: '15m',
  });
};

export const verifyAccessToken = (
  token: string,
): { userId: number; email: string } => {
  return jwt.verify(token, env.JWT_SECRET) as { userId: number; email: string };
};
