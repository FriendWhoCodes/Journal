import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { prisma } from '@/lib/prisma';
import { authConfig } from '@/lib/auth';
import {
  getSessionTokenFromCookies,
  deleteSession,
  deleteSessionCookie,
} from '@mow/auth';

export async function POST() {
  try {
    const cookieStore = await cookies();
    const token = getSessionTokenFromCookies(cookieStore, authConfig);

    if (token) {
      // Delete session from database
      await deleteSession(prisma, token);
    }

    // Delete session cookie
    deleteSessionCookie(cookieStore, authConfig);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Logout error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
