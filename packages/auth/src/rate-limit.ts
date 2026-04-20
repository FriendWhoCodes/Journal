import type { PrismaClient } from '@prisma/client';

export interface RateLimitResult {
  allowed: boolean;
  retryAfterMs?: number;
}

export interface RateLimitConfig {
  maxRequests: number;
  windowMs: number;
}

const LOGIN_CONFIG: RateLimitConfig = { maxRequests: 5, windowMs: 15 * 60 * 1000 };
const VERIFY_CONFIG: RateLimitConfig = { maxRequests: 10, windowMs: 15 * 60 * 1000 };

async function checkRateLimit(
  prisma: PrismaClient,
  key: string,
  endpoint: string,
  config: RateLimitConfig,
): Promise<RateLimitResult> {
  const now = new Date();
  const windowEnd = new Date(now.getTime() + config.windowMs);

  try {
    const record = await (prisma as any).authRateLimit.findUnique({
      where: { key_endpoint: { key, endpoint } },
    });

    // No record or window expired — start a new window
    if (!record || record.windowEnd < now) {
      await (prisma as any).authRateLimit.upsert({
        where: { key_endpoint: { key, endpoint } },
        update: { count: 1, windowEnd },
        create: { key, endpoint, count: 1, windowEnd },
      });
      return { allowed: true };
    }

    // Within window but under limit
    if (record.count < config.maxRequests) {
      await (prisma as any).authRateLimit.update({
        where: { key_endpoint: { key, endpoint } },
        data: { count: record.count + 1 },
      });
      return { allowed: true };
    }

    // Over limit
    return {
      allowed: false,
      retryAfterMs: record.windowEnd.getTime() - now.getTime(),
    };
  } catch {
    // If DB fails, allow the request (fail-open) rather than locking out users
    return { allowed: true };
  }
}

export async function checkLoginRateLimit(
  prisma: PrismaClient,
  key: string,
): Promise<RateLimitResult> {
  return checkRateLimit(prisma, key, 'login', LOGIN_CONFIG);
}

export async function checkVerifyRateLimit(
  prisma: PrismaClient,
  key: string,
): Promise<RateLimitResult> {
  return checkRateLimit(prisma, key, 'verify', VERIFY_CONFIG);
}

// Cleanup expired rate limit records (call periodically)
export async function cleanupRateLimits(prisma: PrismaClient): Promise<void> {
  await (prisma as any).authRateLimit.deleteMany({
    where: { windowEnd: { lt: new Date() } },
  });
}
