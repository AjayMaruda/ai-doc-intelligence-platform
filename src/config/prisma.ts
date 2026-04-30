import { PrismaClient } from '../generated/prisma/client';
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';
import { logger } from './logger';
import { env } from './env';

const pool = new Pool({ connectionString: env.DATABASE_URL });
const adapter = new PrismaPg(pool);

export const prisma = new PrismaClient({
  adapter,
  log: ['query', 'info', 'warn', 'error'],
});

async function connectPrisma() {
  try {
    await prisma.$connect();
    logger.info('Prisma connected to Postgres database.');
  } catch (error) {
    logger.error({ error }, 'Prisma failed to connect to the database.');
    process.exit(1);
  }
}

connectPrisma();
