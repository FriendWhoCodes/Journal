import { cookies } from 'next/headers';
import { prisma } from './prisma';
import {
  getSessionByToken,
  getSessionTokenFromCookies,
  type AuthUser,
  type AuthConfig,
  DEFAULT_AUTH_CONFIG,
} from '@mow/auth';

const authConfig: AuthConfig = {
  ...DEFAULT_AUTH_CONFIG,
  baseUrl: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3004',
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
