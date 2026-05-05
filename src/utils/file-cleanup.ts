import { logger } from '../config/logger';
import fs from 'node:fs/promises';

export const deleteLocalFile = async (filePath: string) => {
  try {
    await fs.unlink(filePath);
    logger.info(`Delete local temp file: ${filePath}`);
  } catch (error) {
    logger.error(
      `Failed to delete local file ${filePath}: ${(error as Error).message}`,
    );
  }
};
