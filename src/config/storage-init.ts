import { env } from 'node:process';
import { storageClient } from './storage';
import { logger } from './logger';

export const initializeStorageBucket = async () => {
  const exists = await storageClient.bucketExists(env.MINIO_BUCKET!);

  if (!exists) {
    await storageClient.makeBucket(env.MINIO_BUCKET!);
    logger.info(`Bucket "${env.MINIO_BUCKET}" created`);
  } else {
    logger.info(`Bucket "${env.MINIO_BUCKET}" already exists`);
  }
};
