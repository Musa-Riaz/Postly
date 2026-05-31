import prisma from './client';
import logger from '../../shared/utils/logger';

async function testConnection() {
  try {
    await prisma.$connect();
    logger.info('✅ Database connection successful');
    
    const userCount = await prisma.user.count();
    logger.info({ userCount }, '📊 Current user count');
    
  } catch (error) {
    logger.error({ error }, '❌ Database connection failed');
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

testConnection();
