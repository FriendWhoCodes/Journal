import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { prisma } from '@/lib/db';
import { authConfig } from '@/lib/auth';
import { verifyMagicLink, setSessionCookie, verifyRateLimiter, auditLog } from '@mow/auth';

export async function POST(request: NextRequest) {
  try {
    const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim()
      || request.headers.get('x-real-ip')
      || 'unknown';

    const rateCheck = verifyRateLimiter.check(ip);
    if (!rateCheck.allowed) {
      auditLog({ event: 'auth.rate_limited', ip, endpoint: 'verify' });
      return NextResponse.json(
        { error: 'Too many requests. Please try again later.' },
        {
          status: 429,
          headers: { 'Retry-After': String(Math.ceil((rateCheck.retryAfterMs || 0) / 1000)) },
        },
      );
    }

    const { token } = await request.json();

    if (!token || typeof token !== 'string') {
      return NextResponse.json(
        { error: 'Token is required' },
        { status: 400 }
      );
    }

    // Verify magic link
    const result = await verifyMagicLink(prisma, token, authConfig, ip);

    if (!result.success || !result.session) {
      return NextResponse.json(
        { error: result.error || 'Verification failed' },
        { status: 400 }
      );
    }

    // Set session cookie
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
