import express, { Express } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import swaggerUi from 'swagger-ui-express';

import { requestLogger } from './middleware/requestLogger.middleware';
import { errorHandler } from './middleware/error.middleware';
import { generateSwaggerDocs } from './utils/swagger-generator';
import router from './routes';

export const createApp = async (): Promise<Express> => {
  const app = express();

  app.use(helmet());
  app.use(cors());
  app.use(express.json());
  app.use(requestLogger);

  app.get('/health', (_req, res) => {
    res.status(200).json({
      success: true,
      statusCode: 200,
      message: 'API is running successfully.',
      data: null,
    });
  });

  app.use('/api', router);

  const swaggerDocument = await generateSwaggerDocs();

  if (swaggerDocument) {
    app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
  }

  app.use((_req, res) => {
    res.status(404).json({
      success: false,
      statusCode: 404,
      message: 'Route not found',
      data: null,
    });
  });

  app.use(errorHandler);

  return app;
};
