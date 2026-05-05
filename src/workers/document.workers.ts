import { Worker } from 'bullmq';
import { redisConnection } from '../config/redis';
import {
  findDocumentById,
  updateDocumentStatus,
} from '../modules/document/document.repository';
import { DOCUMENT_STATUS } from '../constants/document.constant';
import { extractTextFromFile } from '../utils/file-parser';
import { extractStructuredDocumentData } from '../services/ai-extraction.service';
import { parseAiResponse } from '../utils/ai-json-parser';
import { logger } from '../config/logger';

export const documentWorker = new Worker(
  'document-processing',
  async (job) => {
    const { documentId } = job.data;

    try {
      await updateDocumentStatus(documentId, DOCUMENT_STATUS.PROCESSING);

      const document = await findDocumentById(documentId);

      if (!document) {
        throw new Error(`Document not found for ID: ${documentId}`);
      }

      // Fake simulation delay
      await new Promise((resolve) => setTimeout(resolve, 2000));

      logger.info(`Reading file from path: ${document.fileUrl}`);

      const rawText = await extractTextFromFile(
        document.fileUrl,
        document.mimeType,
      );

      logger.info(
        `Attempt number ${job.attemptsMade + 1} for document ${documentId}`,
      );
      logger.info(`Extracted raw text length: ${rawText.length}`);

      const aiResult = await extractStructuredDocumentData(rawText);

      logger.info(`AI response received from Groq`);

      const extractedData = parseAiResponse(aiResult);

      await updateDocumentStatus(
        documentId,
        DOCUMENT_STATUS.COMPLETED,
        extractedData,
      );

      logger.info(`Completed processing document job: ${documentId}`);
    } catch (error) {
      const isLastAttempt = job.attemptsMade + 1 >= (job.opts.attempts || 1);

      if (isLastAttempt) {
        await updateDocumentStatus(
          documentId,
          DOCUMENT_STATUS.FAILED,
          undefined,
          (error as Error).message,
        );
      }
    }
  },
  {
    connection: redisConnection,
    concurrency: 2,
  },
);
