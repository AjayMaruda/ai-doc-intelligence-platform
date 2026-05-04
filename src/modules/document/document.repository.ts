import { prisma } from '../../config/prisma';
import { Prisma } from '../../generated/prisma/client';
import { CreateDocumentDto } from './document.types';

export const createDocument = async (dto: CreateDocumentDto) => {
  return prisma.document.create({ data: dto });
};

export const updateDocumentStatus = async (
  id: number,
  status: string,
  extractedData?: Prisma.InputJsonValue,
) => {
  return prisma.document.update({
    where: { id },
    data: {
      status,
      extractedData,
    },
  });
};

export const findDocumentById = async (id: number) => {
  return prisma.document.findUnique({ where: { id } });
};

export const findDocumentByIdAndUser = async (id: number, userId: number) => {
  return prisma.document.findFirst({
    where: {
      id,
      userId,
    },
  });
};
