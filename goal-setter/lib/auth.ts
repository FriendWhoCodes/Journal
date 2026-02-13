import { cookies } from 'next/headers';
import { prisma } from './db';
import {
  getSessionByToken,
  getSessionTokenFromCookies,
  type AuthUser,
  type AuthConfig,
  DEFAULT_AUTH_CONFIG,
} from '@mow/auth';

const authConfig: AuthConfig = {
  ...DEFAULT_AUTH_CONFIG,
  baseUrl: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3002',
};

export { authConfig };

export async function getCurrentUser(): Promise<AuthUser | null> {
  const cookieStore = await cookies();
  const token = getSessionTokenFromCookies(cookieStore, authConfig);

  if (!token) {
    return null;
  }

  const session = await getSessionByToken(prisma, token);
  return session?.user || null;
}

export async function requireAuth(): Promise<AuthUser> {
  const user = await getCurrentUser();

  if (!user) {
    throw new Error('Unauthorized');
  }

  return user;
}

/**
 * Check if a user has access to a product. Read-only, never creates records.
 */
export async function checkProductAccess(userId: string, product: string) {
  return prisma.userProduct.findUnique({
    where: {
      userId_product: { userId, product },
    },
  });
}

/**
 * Grant a user access to a product. For use by admin routes, payment webhooks,
 * and free-tier auto-grant during the no-payment phase.
 */
export async function grantProductAccess(
  userId: string,
  product: string,
  accessType: string = 'free',
) {
  return prisma.userProduct.upsert({
    where: {
      userId_product: { userId, product },
    },
    update: {},
    create: {
      userId,
      product,
      accessType,
    },
  });
}
