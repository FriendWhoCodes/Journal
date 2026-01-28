import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { prisma } from '@/lib/prisma';
import { authConfig } from '@/lib/auth';
import { deleteSession, deleteSessionCookie, getSessionTokenFromCookies } from '@mow/auth';

export async function POST() {
  try {
    const cookieStore = await cookies();
    const token = getSessionTokenFromCookies(cookieStore, authConfig);

    if (token) {
      await deleteSession(prisma, token);
    }

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
