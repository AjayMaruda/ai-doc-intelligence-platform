import pino from 'pino';
import { env } from './env';

export const logger = pino({
  level: env.NODE_ENV === 'production' ? 'info' : 'debug',
  transport:
    env.NODE_ENV !== 'production'
      ? {
          target: 'pino-pretty',
          options: { singleLine: true },
        }
      : undefined,
  base: {
    service: 'ai-doc-intelligence-api',
  },
  timestamp: pino.stdTimeFunctions.isoTime,
});
