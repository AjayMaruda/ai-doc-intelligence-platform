import swaggerAutogen from 'swagger-autogen';

const doc = {
  info: {
    title: 'AI Document Intelligence Platform',
    description:
      'Production-grade backend API for AI-powered document ingestion, async processing, and analytics.',
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

const outputFile = './src/swagger-output.json';
const endpointsFiles = ['./src/app.ts'];

swaggerAutogen({ openapi: '3.0.0' })(outputFile, endpointsFiles, doc);
