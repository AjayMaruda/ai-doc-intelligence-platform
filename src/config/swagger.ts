import { Express } from 'express';
import swaggerUi from 'swagger-ui-express';
import { generateSwaggerDocs } from '../utils/swagger-generator';

export const setupSwagger = async (app: Express): Promise<void> => {
  const swaggerDocument = await generateSwaggerDocs();

  if (!swaggerDocument) {
    console.error('Swagger document generation failed');
    return;
  }

  app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
};
