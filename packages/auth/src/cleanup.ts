import type { PrismaClient } from '@prisma/client';

export async function cleanupExpiredAuthRecords(
  prisma: PrismaClient
): Promise<{ sessions: number; magicLinks: number }> {
  const now = new Date();

  const [sessions, magicLinks] = await Promise.all([
    (prisma as any).authSession.deleteMany({
      where: { expiresAt: { lt: now } },
    }),
    (prisma as any).authMagicLink.deleteMany({
      where: {
        OR: [
          { expiresAt: { lt: now } },
          { usedAt: { not: null } },
        ],
      },
    }),
  ]);

  return { sessions: sessions.count, magicLinks: magicLinks.count };
}
