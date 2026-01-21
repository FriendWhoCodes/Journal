import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { authConfig } from '@/lib/auth';
import { createMagicLink, sendMagicLinkEmail } from '@mow/auth';

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();

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
    const { token } = await createMagicLink(prisma, email, authConfig);

    // Send email
    const baseUrl = authConfig.baseUrl || process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3004';
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
