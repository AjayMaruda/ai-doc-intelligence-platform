import { createApp } from './app';
import { env } from './config/env';
import { logger } from './config/logger';

const startServer = async () => {
  const app = await createApp();

  app.listen(env.PORT, () => {
    logger.info(`Server running on port ${env.PORT}`);
  });
};

startServer();
