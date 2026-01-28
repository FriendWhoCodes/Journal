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

export async function ensureProductAccess(
  userId: string,
  product: string,
  accessType: string = 'free'
) {
  const existing = await prisma.userProduct.findUnique({
    where: {
      userId_product: { userId, product },
    },
  });

  if (existing) {
    return existing;
  }

  return prisma.userProduct.create({
    data: {
      userId,
      product,
      accessType,
    },
  });
}
