import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient({
  log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
});

// Handle connection errors gracefully
prisma.$on('error' as never, (e: any) => {
  console.error('Prisma error:', e);
});

export default prisma;

