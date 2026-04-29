import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { requestLogger } from './middleware/requestLogger.middleware';
import { errorHandler } from './middleware/error.middleware';
import { setupSwagger } from './docs/swagger';

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

setupSwagger(app);

app.use(errorHandler);

export default app;
