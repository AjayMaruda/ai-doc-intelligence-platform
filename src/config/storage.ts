import { Client } from 'minio';
import { env } from './env';

export const storageClient = new Client({
  endPoint: env.MINIO_ENDPOINT,
  port: env.MINIO_PORT ? Number(env.MINIO_PORT) : undefined,
  accessKey: env.MINIO_ACCESS_KEY,
  secretKey: env.MINIO_SECRET_KEY,
  useSSL: false,
});
