import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { requestLogger } from './middleware/requestLogger.middleware';
import { errorHandler } from './middleware/error.middleware';
import swaggerUi from 'swagger-ui-express';
import swaggerDocument from './swagger-output.json';
import authRouter from './modules/auth/auth.route';

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
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// 404 JSON Handler
app.use((_req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found',
  });
});

app.use(errorHandler);

export default app;
