import { OpenApiGeneratorV3 } from '@asteasolutions/zod-to-openapi';
import { openApiRegistry } from './openapi.registry';

export const generateOpenAPIDocument = () => {
  const generate = new OpenApiGeneratorV3(openApiRegistry.definitions);

  return generate.generateDocument({
    openapi: '3.0.0',
    info: {
      title: 'AI Document Intelligence Platform',
      version: '1.0.0',
      description:
        'Production-grade backend API for AI-powered document ingestion, async processing, analytics, and cloud deployment.',
    },
    servers: [
      {
        url: `http://localhost:${process.env.PORT}`,
        description: 'Local development server',
      },
    ],
  });
};
