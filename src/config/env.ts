import dotenv from 'dotenv';

dotenv.config();

function getEnv(key: string): string {
  const value = process.env[key];

  if (!value) {
    throw new Error(`Environment variable ${key} is not set`);
  }
  return value;
}
export const env = {
  PORT: Number(getEnv('PORT')),
  NODE_ENV: getEnv('NODE_ENV'),
  DATABASE_URL: getEnv('DATABASE_URL'),
  JWT_SECRET: getEnv('JWT_SECRET'),
  REDIS_HOST: getEnv('REDIS_HOST'),
  REDIS_PORT: getEnv('REDIS_PORT'),
};
