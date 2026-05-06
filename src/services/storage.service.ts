import { storageClient } from '../config/storage';
import { env } from '../config/env';

export const uploadFileToStorage = async (
  fileBuffer: Buffer,
  originalName: string,
  mimeType: string,
) => {
  const objectKey = `uploads/${Date.now()}-${originalName}`;

  await storageClient.putObject(
    env.MINIO_BUCKET,
    objectKey,
    fileBuffer,
    fileBuffer.length,
    {
      'Content-Type': mimeType,
    },
  );

  return objectKey;
};

export const downloadFileFromStorage = async (objectKey: string) => {
  const stream = await storageClient.getObject(env.MINIO_BUCKET, objectKey);

  const chunks: Uint8Array[] = [];

  return new Promise<Buffer>((resolve, reject) => {
    stream.on('data', (chunk) => chunks.push(chunk));
    stream.on('end', () => resolve(Buffer.concat(chunks)));
    stream.on('error', reject);
  });
};
