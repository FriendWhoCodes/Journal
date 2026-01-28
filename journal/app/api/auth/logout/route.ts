import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { prisma } from '@/lib/prisma';
import { authConfig } from '@/lib/auth';
import { deleteSession, deleteSessionCookie, getSessionTokenFromCookies } from '@mow/auth';

export async function POST() {
  const cookieStore = await cookies();

  try {
    const token = getSessionTokenFromCookies(cookieStore, authConfig);

    if (token) {
      await deleteSession(prisma, token);
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Logout error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  } finally {
    // Always clear the cookie, even if session deletion fails
    deleteSessionCookie(cookieStore, authConfig);
  }
}
