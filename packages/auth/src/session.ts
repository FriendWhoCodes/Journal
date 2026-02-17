import { randomBytes } from 'crypto';
import type { PrismaClient } from '@prisma/client';
import type { ReadonlyRequestCookies } from 'next/dist/server/web/spec-extension/adapters/request-cookies';
import { DEFAULT_AUTH_CONFIG, type AuthConfig, type AuthSession, type AuthUser } from './types';
import { hashToken } from './crypto';
import { cleanupExpiredAuthRecords } from './cleanup';

export function generateSessionToken(): string {
  return randomBytes(32).toString('hex');
}

export async function createSession(
  prisma: PrismaClient,
  userId: string,
  config: AuthConfig = {}
): Promise<AuthSession> {
  const { sessionExpiryDays } = { ...DEFAULT_AUTH_CONFIG, ...config };

  const token = generateSessionToken();
  const expiresAt = new Date(Date.now() + sessionExpiryDays * 24 * 60 * 60 * 1000);

  const session = await (prisma as any).authSession.create({
    data: {
      userId,
      tokenHash: hashToken(token),
      expiresAt,
    },
  });

  // Return with raw token (not hash) for cookie setting
  return { ...session, token };
}

export async function getSessionByToken(
  prisma: PrismaClient,
  token: string
): Promise<(AuthSession & { user: AuthUser }) | null> {
  const session = await (prisma as any).authSession.findUnique({
    where: { tokenHash: hashToken(token) },
    include: { user: true },
  });

  if (!session) {
    return null;
  }

  // Check if session has expired
  if (new Date() > session.expiresAt) {
    // Delete expired session
    await (prisma as any).authSession.delete({
      where: { id: session.id },
    });
    return null;
  }

  // 1% chance: clean up expired sessions and magic links
  if (Math.random() < 0.01) {
    cleanupExpiredAuthRecords(prisma).catch(() => {});
  }

  return session;
}

export async function deleteSession(
  prisma: PrismaClient,
  token: string
): Promise<void> {
  await (prisma as any).authSession.deleteMany({
    where: { tokenHash: hashToken(token) },
  });
}

export async function deleteAllUserSessions(
  prisma: PrismaClient,
  userId: string
): Promise<void> {
  await (prisma as any).authSession.deleteMany({
    where: { userId },
  });
}

export function setSessionCookie(
  cookies: ReadonlyRequestCookies | { set: (name: string, value: string, options: any) => void },
  token: string,
  config: AuthConfig = {}
): void {
  const { cookieName, cookieDomain, sessionExpiryDays } = { ...DEFAULT_AUTH_CONFIG, ...config };

  const maxAge = sessionExpiryDays * 24 * 60 * 60;
  const isProduction = process.env.NODE_ENV === 'production';

  (cookies as any).set(cookieName, token, {
    httpOnly: true,
    secure: isProduction,
    sameSite: 'lax',
    domain: isProduction ? cookieDomain : undefined,
    path: '/',
    maxAge,
  });
}

export function deleteSessionCookie(
  cookies: ReadonlyRequestCookies | { set: (name: string, value: string, options: any) => void },
  config: AuthConfig = {}
): void {
  const { cookieName, cookieDomain } = { ...DEFAULT_AUTH_CONFIG, ...config };
  const isProduction = process.env.NODE_ENV === 'production';

  (cookies as any).set(cookieName, '', {
    httpOnly: true,
    secure: isProduction,
    sameSite: 'lax',
    domain: isProduction ? cookieDomain : undefined,
    path: '/',
    maxAge: 0,
  });
}

export function getSessionTokenFromCookies(
  cookies: ReadonlyRequestCookies | { get: (name: string) => { value: string } | undefined },
  config: AuthConfig = {}
): string | null {
  const { cookieName } = { ...DEFAULT_AUTH_CONFIG, ...config };
  const cookie = (cookies as any).get(cookieName);
  return cookie?.value || null;
}
