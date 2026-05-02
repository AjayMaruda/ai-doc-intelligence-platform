import IORedis from 'ioredis';
import { env } from './env';
import { AUTH_MESSAGES } from '../constants/messages';
import { logger } from './logger';

export const redisConnection = new IORedis({
  host: env.REDIS_HOST,
  port: Number(env.REDIS_PORT),
  maxRetriesPerRequest: null,
});

redisConnection.on('connect', () => {
  logger.info(`Redis ${AUTH_MESSAGES.CONNECTED}`);
});

redisConnection.on('error', () => {
  logger.error(`Redis ${AUTH_MESSAGES.ERROR_OCCURRED}`);
});
