import { prisma } from '../../config/prisma';
import { RegisterUserDto } from './auth.types';

export const findUserByEmail = async (email: string) => {
  return prisma.user.findUnique({
    where: { email },
  });
};

export const createUser = async (dto: RegisterUserDto) => {
  return prisma.user.create({
    data: {
      email: dto.email,
      password: dto.password,
    },
  });
};

export const findUserById = async (id: number) => {
  return prisma.user.findUnique({
    where: { id },
  });
};
