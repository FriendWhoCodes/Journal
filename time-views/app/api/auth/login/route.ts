import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { authConfig } from '@/lib/auth';
import { createMagicLink, sendMagicLinkEmail } from '@mow/auth';

export async function POST(request: NextRequest) {
  try {
    const { email, name } = await request.json();

    if (!email || typeof email !== 'string') {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      );
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Invalid email address' },
        { status: 400 }
      );
    }

    // Create magic link
    const { token } = await createMagicLink(prisma, email, authConfig, name);

    // Send email - require explicit URL in production
    const baseUrl = authConfig.baseUrl || process.env.NEXT_PUBLIC_APP_URL;
    if (!baseUrl || (process.env.NODE_ENV === 'production' && baseUrl.includes('localhost'))) {
      console.error('NEXT_PUBLIC_APP_URL must be configured for production');
      return NextResponse.json(
        { error: 'Email service not configured' },
        { status: 500 }
      );
    }
    const result = await sendMagicLinkEmail(email, token, baseUrl);

    if (!result.success) {
      return NextResponse.json(
        { error: result.error || 'Failed to send email' },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
