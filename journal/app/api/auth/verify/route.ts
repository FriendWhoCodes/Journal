import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { prisma } from '@/lib/prisma';
import { authConfig } from '@/lib/auth';
import { verifyMagicLink, setSessionCookie } from '@mow/auth';

export async function POST(request: NextRequest) {
  try {
    const { token } = await request.json();

    if (!token || typeof token !== 'string') {
      return NextResponse.json(
        { error: 'Token is required' },
        { status: 400 }
      );
    }

    const result = await verifyMagicLink(prisma, token, authConfig);

    if (!result.success || !result.session) {
      return NextResponse.json(
        { error: result.error || 'Verification failed' },
        { status: 400 }
      );
    }

    const cookieStore = await cookies();
    setSessionCookie(cookieStore, result.session.token, authConfig);

    return NextResponse.json({
      success: true,
      user: result.session.user,
    });
  } catch (error) {
    console.error('Verify error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
