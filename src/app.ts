import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { requestLogger } from './middleware/requestLogger.middleware';
import { errorHandler } from './middleware/error.middleware';
import swaggerUi from 'swagger-ui-express';
import { generateSwaggerDocs } from './utils/swagger-generator';
import authRouter from './modules/auth/auth.route';
import { Request, Response, NextFunction } from 'express';

const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(requestLogger);

app.get('/health', (_req, res) => {
  res.status(200).json({
    success: true,
    message: 'API is runniing sucssessfully.',
  });
});

app.use('/auth', authRouter);

// Dynamic In-Memory Swagger setup
let swaggerDocument: any;
generateSwaggerDocs().then((doc) => {
  swaggerDocument = doc;
});

type SwaggerDoc = Record<string, unknown>;

app.use(
  '/api-docs',
  swaggerUi.serve,
  (req: Request, res: Response, next: NextFunction) => {
    if (!swaggerDocument) {
      return res
        .status(503)
        .send('Swagger documentation is still generating...');
    }
    swaggerUi.setup(swaggerDocument as SwaggerDoc)(req, res, next);
  },
);

// 404 JSON Handler
app.use((_req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found',
  });
});

app.use(errorHandler);

export default app;
