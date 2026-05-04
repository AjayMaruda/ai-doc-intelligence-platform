import { Worker } from 'bullmq';
import { redisConnection } from '../config/redis';
import {
  findDocumentById,
  updateDocumentStatus,
} from '../modules/document/document.repository';
import { logger } from '../config/logger';
import { ApiError } from '../utils/apiError';
import { StatusCodes } from 'http-status-codes';
import { DOCUMENT_STATUS } from '../constants/document.constant';

export const documentWorker = new Worker(
  'document-processing',
  async (job) => {
    const { documentId } = job.data;

    try {
      logger.info(`Started processing document job: ${documentId}`);

      await updateDocumentStatus(documentId, DOCUMENT_STATUS.PROCESSING);

      const document = await findDocumentById(documentId);

      if (!document) {
        throw new ApiError(
          StatusCodes.NOT_FOUND,
          `Document not found for ID: ${documentId}`,
        );
      }

      await new Promise((resolve) => setTimeout(resolve, 5000));

      const extractedData = {
        extractedText: `Simulated AI extraction for file ${document.fileName}`,
        pages: 3,
        confidence: 96,
      };

      await updateDocumentStatus(
        documentId,
        DOCUMENT_STATUS.COMPLETED,
        extractedData,
      );

      logger.info(`Completed processing document job: ${documentId}`);
    } catch (error) {
      logger.error(error, `Error processing document job ${documentId}:`);
      await updateDocumentStatus(documentId, DOCUMENT_STATUS.FAILED);
      throw error;
    }
  },
  {
    connection: redisConnection,
  },
);
