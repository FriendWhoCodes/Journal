import { PrismaClient } from '@prisma/client';
import { initAuditLog } from '@mow/auth';

// PrismaClient singleton to avoid multiple instances in development
// This prevents "too many clients" errors during hot reload

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
  });

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;

// Initialize audit logging with the Prisma client
initAuditLog(prisma);
