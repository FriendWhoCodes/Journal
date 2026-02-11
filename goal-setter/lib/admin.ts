import { getCurrentUser } from './auth';
import type { AuthUser } from '@mow/auth';

const ADMIN_EMAILS = (process.env.ADMIN_EMAIL || '').split(',').map(e => e.trim().toLowerCase()).filter(Boolean);

export function isAdmin(email: string): boolean {
  return ADMIN_EMAILS.includes(email.toLowerCase());
}

export async function requireAdmin(): Promise<AuthUser> {
  const user = await getCurrentUser();

  if (!user) {
    throw new Error('Unauthorized');
  }

  if (!isAdmin(user.email)) {
    throw new Error('Forbidden');
  }

  return user;
}
