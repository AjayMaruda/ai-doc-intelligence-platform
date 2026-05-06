import { createApp } from './app';
import { env } from './config/env';
import { logger } from './config/logger';
import { initializeStorageBucket } from './config/storage-init';

const startServer = async () => {
  try {
    await initializeStorageBucket();

    const app = await createApp();

    app.listen(env.PORT, () => {
      logger.info(`Server running on port ${env.PORT}`);
    });
  } catch (error) {
    logger.error(`Failed to start server: ${(error as Error).message}`);
    process.exit(1);
  }
};

startServer();
