import { StatusCodes } from 'http-status-codes';
import {
  DOCUMENT_STATUS,
  MAX_DOCUMENT_RETRIES,
} from '../../constants/document.constant';
import { addDocumentJob } from '../../queues/document.queue';
import { ApiError } from '../../utils/apiError';
import {
  createDocument,
  findDocumentByIdAndUser,
  findDocumentByUser,
  getDocumentAnalytics,
  getRecentDocuments,
  resetDocumentForRetry,
} from './document.repository';
import { CreateDocumentDto } from './document.types';
import { AUTH_MESSAGES } from '../../constants/messages';

export const uploadDocument = async (dto: CreateDocumentDto) => {
  const document = await createDocument({
    ...dto,
    status: DOCUMENT_STATUS.PENDING,
  });

  await addDocumentJob(document.id);

  return document;
};

export const getDocumentById = async (documentId: number, userId: number) => {
  const document = await findDocumentByIdAndUser(documentId, userId);

  if (!document) {
    throw new ApiError(
      StatusCodes.NOT_FOUND,
      `Document ${AUTH_MESSAGES.NOT_FOUND}`,
    );
  }

  return document;
};

export const getUserDocuments = async (
  userId: number,
  page: number,
  limit: number,
) => {
  const { document, total } = await findDocumentByUser(userId, page, limit);

  const formattedDocuments = document.map((doc) => ({
    id: doc.id,
    fileName: doc.fileName,
    status: doc.status,
    retryCount: doc.retryCount,
    createdAt: doc.createdAt,
    updatedAt: doc.updatedAt,
  }));

  return {
    documents: formattedDocuments,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  };
};

export const getDocumentAnalyticsService = async (userId: number) => {
  const analytics = await getDocumentAnalytics(userId);

  return analytics;
};

export const getRecentDocumentInsights = async (
  userId: number,
  limit: number,
) => {
  const documents = await getRecentDocuments(userId, limit);

  return documents.map((doc) => ({
    id: doc.id,
    fileName: doc.fileName,
    createdAt: doc.createdAt,

    documentType: (doc.extractedData as any)?.documentType || null,

    summary: (doc.extractedData as any)?.summary || null,
  }));
};

export const retryFailedDocument = async (
  documentId: number,
  userId: number,
) => {
  const document = await findDocumentByIdAndUser(documentId, userId);

  if (!document) {
    throw new ApiError(
      StatusCodes.NOT_FOUND,
      `Document ${AUTH_MESSAGES.NOT_FOUND}`,
    );
  }

  if (document.status !== DOCUMENT_STATUS.FAILED) {
    throw new ApiError(StatusCodes.BAD_REQUEST, 'Document is not failed');
  }

  if (document.retryCount >= MAX_DOCUMENT_RETRIES) {
    throw new ApiError(
      StatusCodes.BAD_REQUEST,
      `Maximum retry limit of ${MAX_DOCUMENT_RETRIES} reached`,
    );
  }

  await resetDocumentForRetry(documentId);

  await addDocumentJob(documentId);

  return {
    message: 'Document retry queued successfully',
  };
};
