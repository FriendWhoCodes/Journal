import { randomBytes } from 'crypto';
import type { PrismaClient } from '@prisma/client';
import { DEFAULT_AUTH_CONFIG, type AuthConfig, type SendMagicLinkResult, type VerifyMagicLinkResult } from './types';
import { createSession } from './session';

export function generateToken(): string {
  return randomBytes(32).toString('hex');
}

export async function createMagicLink(
  prisma: PrismaClient,
  email: string,
  config: AuthConfig = {},
  name?: string
): Promise<{ token: string; userId: string }> {
  const { magicLinkExpiryMinutes } = { ...DEFAULT_AUTH_CONFIG, ...config };

  // Find or create user
  let user = await (prisma as any).authUser.findUnique({
    where: { email: email.toLowerCase() },
  });

  if (!user) {
    user = await (prisma as any).authUser.create({
      data: {
        email: email.toLowerCase(),
        name: name || null,
      },
    });
  } else if (name && !user.name) {
    // Update name if provided and user doesn't have one
    user = await (prisma as any).authUser.update({
      where: { id: user.id },
      data: { name },
    });
  }

  // Generate magic link token
  const token = generateToken();
  const expiresAt = new Date(Date.now() + magicLinkExpiryMinutes * 60 * 1000);

  // Create magic link record
  await (prisma as any).authMagicLink.create({
    data: {
      userId: user.id,
      token,
      expiresAt,
    },
  });

  return { token, userId: user.id };
}

export async function verifyMagicLink(
  prisma: PrismaClient,
  token: string,
  config: AuthConfig = {}
): Promise<VerifyMagicLinkResult> {
  // Find magic link
  const magicLink = await (prisma as any).authMagicLink.findUnique({
    where: { token },
    include: { user: true },
  });

  if (!magicLink) {
    return { success: false, error: 'Invalid or expired link' };
  }

  // Check if already used
  if (magicLink.usedAt) {
    return { success: false, error: 'Link has already been used' };
  }

  // Check expiration
  if (new Date() > magicLink.expiresAt) {
    return { success: false, error: 'Link has expired' };
  }

  // Mark as used
  await (prisma as any).authMagicLink.update({
    where: { id: magicLink.id },
    data: { usedAt: new Date() },
  });

  // Update emailVerified if not already set
  if (!magicLink.user.emailVerified) {
    await (prisma as any).authUser.update({
      where: { id: magicLink.userId },
      data: { emailVerified: new Date() },
    });
  }

  // Create session
  const session = await createSession(prisma, magicLink.userId, config);

  return {
    success: true,
    session: {
      ...session,
      user: magicLink.user,
    },
  };
}

export async function sendMagicLinkEmail(
  email: string,
  token: string,
  baseUrl: string
): Promise<SendMagicLinkResult> {
  const verifyUrl = `${baseUrl}/verify?token=${token}`;

  // Use Resend API
  const resendApiKey = process.env.RESEND_API_KEY;

  if (!resendApiKey) {
    console.error('RESEND_API_KEY not configured');
    return { success: false, error: 'Email service not configured' };
  }

  try {
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${resendApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: 'Man of Wisdom <noreply@manofwisdom.co>',
        to: email,
        subject: 'Sign in to Man of Wisdom',
        html: `
          <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto; padding: 40px 20px;">
            <h1 style="color: #1a1a1a; font-size: 24px; margin-bottom: 24px;">Sign in to Man of Wisdom</h1>
            <p style="color: #4a4a4a; font-size: 16px; line-height: 1.5; margin-bottom: 24px;">
              Click the button below to sign in. This link will expire in 15 minutes.
            </p>
            <a href="${verifyUrl}" style="display: inline-block; background-color: #1a1a1a; color: #ffffff; font-size: 16px; font-weight: 500; text-decoration: none; padding: 12px 24px; border-radius: 6px; margin-bottom: 24px;">
              Sign In
            </a>
            <p style="color: #6a6a6a; font-size: 14px; line-height: 1.5; margin-top: 24px;">
              If you didn't request this email, you can safely ignore it.
            </p>
            <hr style="border: none; border-top: 1px solid #e5e5e5; margin: 32px 0;" />
            <p style="color: #9a9a9a; font-size: 12px;">
              Man of Wisdom - Goal Setter, Time Views, Journal
            </p>
          </div>
        `,
        text: `Sign in to Man of Wisdom\n\nClick this link to sign in: ${verifyUrl}\n\nThis link will expire in 15 minutes.\n\nIf you didn't request this email, you can safely ignore it.`,
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      console.error('Resend API error:', error);
      return { success: false, error: 'Failed to send email' };
    }

    return { success: true };
  } catch (error) {
    console.error('Error sending magic link email:', error);
    return { success: false, error: 'Failed to send email' };
  }
}
