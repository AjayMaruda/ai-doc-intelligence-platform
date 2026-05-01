import swaggerAutogen from 'swagger-autogen';
import { promises as fs } from 'fs';
import path from 'path';

const doc = {
  info: {
    title: 'AI Document Intelligence Platform',
    description:
      'Production-grade backend API for AI-powered document ingestion, async processing, and analytics.',
    version: '1.0.0',
  },
  host: 'localhost:3000',
  schemes: ['http'],
  components: {
    schemas: {
      RegisterSchema: {
        email: 'user@example.com',
        password: 'Password123!',
      },
      LoginSchema: {
        email: 'user@example.com',
        password: 'Password123!',
      },
    },
  },
};

/**
 * Generates Swagger docs using swagger‑autogen.
 * The library requires an output file, so we write to a temporary location inside
 * the project's `.generated` folder, create that folder if it does not exist,
 * then read the JSON back into memory and delete the temporary file.
 */
export const generateSwaggerDocs = async (): Promise<Record<
  string,
  unknown
> | null> => {
  const outputDir = path.resolve(__dirname, '../../.generated');
  const outputFile = path.join(outputDir, 'swagger-temp.json');
  const endpointsFiles = ['./src/app.ts'];

  try {
    // Ensure the output directory exists
    await fs.mkdir(outputDir, { recursive: true });
    // Generate the swagger JSON file
    await swaggerAutogen({ openapi: '3.0.0' })(outputFile, endpointsFiles, doc);
    const data = await fs.readFile(outputFile, 'utf-8');
    await fs.unlink(outputFile).catch(() => {});
    return JSON.parse(data);
  } catch (err) {
    console.error('Failed to generate Swagger docs:', err);
    return null;
  }
};
