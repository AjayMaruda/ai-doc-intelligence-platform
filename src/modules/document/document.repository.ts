import { prisma } from '../../config/prisma';
import { Prisma } from '../../generated/prisma/client';
import { CreateDocumentDto } from './document.types';
import { DOCUMENT_STATUS } from '../../constants/document.constant';
import { storageClient } from '../../config/storage';
import { env } from '../../config/env';
import { ApiError } from '../../utils/apiError';
import { StatusCodes } from 'http-status-codes';
import { AUTH_MESSAGES } from '../../constants/messages';
import { deleteFileFromStorage } from '../../services/storage.service';
export const createDocument = async (dto: CreateDocumentDto) => {
  return prisma.document.create({ data: dto });
};

export const updateDocumentStatus = async (
  id: number,
  status: string,
  extractedData?: Prisma.InputJsonValue,
  failureReason?: string,
  retryCount?: number,
) => {
  return prisma.document.update({
    where: { id },
    data: {
      status,
      extractedData,
      failureReason,
      retryCount,
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

export const findDocumentByUser = async (
  userId: number,
  page: number,
  limit: number,
) => {
  const skip = (page - 1) * limit;

  const [document, total] = await Promise.all([
    prisma.document.findMany({
      where: {
        userId,
      },
      orderBy: {
        createdAt: 'desc',
      },
      skip,
      take: limit,
    }),
    prisma.document.count({
      where: {
        userId,
      },
    }),
  ]);

  return {
    document,
    total,
  };
};

export const getDocumentAnalytics = async (userId: number) => {
  const [totalDocuments, completed, processing, pending, failed] =
    await Promise.all([
      prisma.document.count({ where: { userId } }),
      prisma.document.count({
        where: { userId, status: DOCUMENT_STATUS.COMPLETED },
      }),
      prisma.document.count({
        where: { userId, status: DOCUMENT_STATUS.PROCESSING },
      }),
      prisma.document.count({
        where: { userId, status: DOCUMENT_STATUS.PENDING },
      }),
      prisma.document.count({
        where: { userId, status: DOCUMENT_STATUS.FAILED },
      }),
    ]);

  return {
    totalDocuments,
    completed,
    processing,
    pending,
    failed,
  };
};

export const getRecentDocuments = async (userId: number, limit: number) => {
  return prisma.document.findMany({
    where: {
      userId,
      status: DOCUMENT_STATUS.COMPLETED,
    },
    orderBy: {
      createdAt: 'desc',
    },
    take: limit,
  });
};

export const resetDocument = async (documentId: number) => {
  return prisma.document.update({
    where: {
      id: documentId,
    },
    data: {
      status: DOCUMENT_STATUS.PENDING,
      failureReason: null,
    },
  });
};

export const resetDocumentForRetry = async (documentId: number) => {
  return prisma.document.update({
    where: {
      id: documentId,
    },
    data: {
      status: DOCUMENT_STATUS.PENDING,
      failureReason: null,
      retryCount: {
        increment: 1,
      },
    },
  });
};

export const deleteDocument = async (documentId: number, userId: number) => {
  const document = await findDocumentByIdAndUser(documentId, userId);

  if (!document) {
    throw new ApiError(
      StatusCodes.NOT_FOUND,
      `Document ${AUTH_MESSAGES.NOT_FOUND}`,
    );
  }

  if (document.status === DOCUMENT_STATUS.PROCESSING) {
    throw new ApiError(
      StatusCodes.BAD_REQUEST,
      `Document can not be deleted, document is processing.`,
    );
  }
  await deleteFileFromStorage(document.objectKey);

  await prisma.document.delete({
    where: {
      id: documentId,
    },
  });

  return {
    deleted: true,
  };
};
