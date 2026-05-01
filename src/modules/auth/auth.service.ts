import { StatusCodes } from 'http-status-codes';
import { ApiError } from '../../utils/apiError';
import { createUser, findUserByEmail } from './auth.repository';
import { RegisterUserDto } from './auth.types';
import { AUTH_MESSAGES } from '../../constants/messages';
import { hashPassword } from '../../utils/bycrypt';
import { generateAccessToken } from '../../utils/jwt';
import bcrypt from 'bcrypt';

export const registerUser = async (dto: RegisterUserDto) => {
  const existingUser = await findUserByEmail(dto.email);

  if (existingUser) {
    throw new ApiError(
      StatusCodes.CONFLICT,
      `User ${AUTH_MESSAGES.ALREADY_EXIST}`,
    );
  }

  const hashedPassword = await hashPassword(dto.password);

  const user = await createUser({
    ...dto,
    password: hashedPassword,
  });

  return { userId: user.id };
};

export const login = async (email: string, password: string) => {
  const user = await findUserByEmail(email);

  if (!user) {
    throw new ApiError(
      StatusCodes.NOT_FOUND,
      `email ${AUTH_MESSAGES.NOT_FOUND}`,
    );
  }

  const match = await bcrypt.compare(password, user.password);

  if (!match) {
    throw new ApiError(
      StatusCodes.BAD_REQUEST,
      `Credentials ${AUTH_MESSAGES.NOT_FOUND}`,
    );
  }

  const token = generateAccessToken(user.id, user.email);

  return { token };
};
