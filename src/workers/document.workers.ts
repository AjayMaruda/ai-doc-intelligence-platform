import { Worker } from 'bullmq';
import { redisConnection } from '../config/redis';
import {
  findDocumentById,
  updateDocumentStatus,
} from '../modules/document/document.repository';
import { DOCUMENT_STATUS } from '../constants/document.constant';
import { extractTextFromBuffer } from '../utils/file-parser';
import { downloadFileFromStorage } from '../services/storage.service';
import { extractStructuredDocumentData } from '../services/ai-extraction.service';
import { parseAiResponse } from '../utils/ai-json-parser';
import { logger } from '../config/logger';
import { prepareTextForAI } from '../utils/text-preprocessor';

export const documentWorker = new Worker(
  'document-processing',
  async (job) => {
    const { documentId } = job.data;

    let document;
    try {
      await updateDocumentStatus(documentId, DOCUMENT_STATUS.PROCESSING);

      document = await findDocumentById(documentId);

      if (!document) {
        throw new Error(`Document not found for ID: ${documentId}`);
      }

      // Fake simulation delay
      await new Promise((resolve) => setTimeout(resolve, 2000));

      logger.info(`Reading file from path: ${document.objectKey}`);

      logger.info(`JOB STARTED for documentId: ${documentId}`);

      logger.info(`Downloading file from MinIO: ${document.objectKey}`);
      const fileBuffer = await downloadFileFromStorage(document.objectKey);
      logger.info(`File downloaded. Size: ${fileBuffer.length}`);

      logger.info(`Starting text extraction`);
      const rawText = await extractTextFromBuffer(
        fileBuffer,
        document.mimeType,
      );

      const preparedText = prepareTextForAI(rawText);

      logger.info(`Prepared AI text length: ${preparedText.length}`);
      logger.info(`Text extracted. Length: ${rawText.length}`);

      logger.info(`Calling AI service`);

      const aiResult = await extractStructuredDocumentData(preparedText);
      logger.info({ aiResult }, `AI response received`);

      const extractedData = parseAiResponse(aiResult);

      await updateDocumentStatus(
        documentId,
        DOCUMENT_STATUS.COMPLETED,
        extractedData,
      );

      logger.info(`Completed processing document job: ${documentId}`);
    } catch (error) {
      logger.error(
        {
          error: (error as Error).message,
          stack: (error as Error).stack,
          documentId,
        },
        'Worker job failed',
      );

      const isLastAttempt = job.attemptsMade + 1 >= (job.opts.attempts || 1);

      if (isLastAttempt) {
        await updateDocumentStatus(
          documentId,
          DOCUMENT_STATUS.FAILED,
          undefined,
          (error as Error).message,
        );
      }

      throw error;
    }
  },
  {
    connection: redisConnection,
    concurrency: 2,
  },
);
