import { Queue } from 'bullmq';
import { redisConnection } from '../config/redis';

export const documentQueue = new Queue('document-processing', {
  connection: redisConnection,
});

export const addDocumentJob = async (documentId: number) => {
  await documentQueue.add(
    'process-document',
    { documentId },
    {
      attempts: 3,
      backoff: {
        type: 'exponential',
        delay: 5000,
      },
      removeOnComplete: false,
      removeOnFail: false,
    },
  );
};
