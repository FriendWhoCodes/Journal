import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { prisma } from '@/lib/prisma';
import { getSessionByToken } from '@mow/auth';
import { authConfig } from '@/lib/auth';

export async function GET() {
  try {
    const cookieStore = await cookies();
    const sessionToken = cookieStore.get(authConfig.cookieName || 'mow_session')?.value;

    if (!sessionToken) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    const session = await getSessionByToken(prisma, sessionToken, authConfig);
    if (!session) {
      return NextResponse.json({ error: 'Invalid session' }, { status: 401 });
    }

    // Fetch user's products
    const userProducts = await prisma.userProduct.findMany({
      where: { userId: session.userId },
      select: {
        product: true,
        accessType: true,
        grantedAt: true,
        expiresAt: true,
      },
    });

    // Convert to a map for easy lookup
    const productsMap: Record<string, { accessType: string; grantedAt: Date; expiresAt: Date | null }> = {};
    for (const up of userProducts) {
      productsMap[up.product] = {
        accessType: up.accessType,
        grantedAt: up.grantedAt,
        expiresAt: up.expiresAt,
      };
    }

    return NextResponse.json({ products: productsMap });
  } catch (error) {
    console.error('Error fetching user products:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
