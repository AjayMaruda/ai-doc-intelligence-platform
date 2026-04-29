import { Express } from 'express';
import swaggerUI from 'swagger-ui-express';
import { generateOpenAPIDocument } from './generateOpenApi';

export function setupSwagger(app: Express) {
  const swaggerDocument = generateOpenAPIDocument();

  app.use(
    '/api-docs',
    swaggerUI.serve,
    swaggerUI.setup(swaggerDocument, {
      explorer: true,
    }),
  );
}
