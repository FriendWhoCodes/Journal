import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser, checkProductAccess } from '@/lib/auth';

export async function GET(request: NextRequest) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const product = request.nextUrl.searchParams.get('product');
  if (!product) {
    return NextResponse.json({ error: 'Missing product parameter' }, { status: 400 });
  }

  const access = await checkProductAccess(user.id, product);

  return NextResponse.json({
    hasAccess: !!access,
    accessType: access?.accessType ?? null,
    grantedAt: access?.grantedAt ?? null,
    expiresAt: access?.expiresAt ?? null,
  });
}
