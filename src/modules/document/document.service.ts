import { StatusCodes } from 'http-status-codes';
import { DOCUMENT_STATUS } from '../../constants/document.constant';
import { addDocumentJob } from '../../queues/document.queue';
import { ApiError } from '../../utils/apiError';
import { createDocument, findDocumentByIdAndUser } from './document.repository';
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
