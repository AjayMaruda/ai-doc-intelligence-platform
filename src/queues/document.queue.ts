import { Queue } from 'bullmq';
import { redisConnection } from '../config/redis';

export const documentQueue = new Queue('document-processing', {
  connection: redisConnection,
});
