import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { grantProductAccess } from '@/lib/auth';
import { auditLog } from '@mow/auth';

const PRODUCT_MAP: Record<string, string> = {
  [process.env.GUMROAD_PRIORITY_MODE_PERMALINK || 'priority-mode']: 'priority_mode',
  [process.env.GUMROAD_AI_WISDOM_PERMALINK || 'ai-wisdom']: 'priority_ai_wisdom',
  [process.env.GUMROAD_PERSONAL_WISDOM_PERMALINK || 'personal-wisdom']: 'priority_personal_wisdom',
};

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();

    const sellerId = formData.get('seller_id') as string;
    const saleId = formData.get('sale_id') as string;
    const email = (formData.get('email') as string)?.toLowerCase();
    const price = formData.get('price') as string;
    const currency = (formData.get('currency') as string) || 'usd';
    const productPermalink = formData.get('product_permalink') as string;
    const isTest = formData.get('test') === 'true';
    const customUserId = formData.get('user_id') as string | null;

    // Verify seller_id
    if (!process.env.GUMROAD_SELLER_ID || sellerId !== process.env.GUMROAD_SELLER_ID) {
      auditLog({ event: 'payment.webhook_rejected', reason: 'invalid_seller', sellerId });
      return NextResponse.json({ error: 'Invalid seller' }, { status: 403 });
    }

    // Map product permalink to internal product name
    const product = PRODUCT_MAP[productPermalink];
    if (!product) {
      console.error('Unknown Gumroad product permalink:', productPermalink);
      auditLog({ event: 'payment.webhook_rejected', reason: 'unknown_product', productPermalink });
      return NextResponse.json({ error: 'Unknown product' }, { status: 400 });
    }

    // Deduplicate by sale_id
    const existing = await prisma.payment.findFirst({
      where: { provider: 'gumroad', providerPaymentId: saleId },
    });
    if (existing) {
      return NextResponse.json({ ok: true, message: 'Already processed' });
    }

    // Find user by custom user_id field or by email
    let user = customUserId
      ? await prisma.authUser.findUnique({ where: { id: customUserId } })
      : null;
    if (!user && email) {
      user = await prisma.authUser.findUnique({ where: { email } });
    }

    if (!user) {
      // Log for manual reconciliation — return 200 so Gumroad doesn't retry
      console.error('Gumroad webhook: no user found for email:', email, 'sale_id:', saleId);
      auditLog({
        event: 'payment.webhook_rejected',
        reason: 'user_not_found',
        email,
        saleId,
        product,
      });
      return NextResponse.json({ ok: true, message: 'User not found, logged for reconciliation' });
    }

    // Convert price string (e.g. "29.99") to cents
    const amountCents = Math.round(parseFloat(price || '0') * 100);

    // Create Payment record
    await prisma.payment.create({
      data: {
        userId: user.id,
        product,
        amount: amountCents,
        currency: currency.toUpperCase(),
        provider: 'gumroad',
        providerPaymentId: saleId,
        providerOrderId: productPermalink,
        status: 'completed',
        completedAt: new Date(),
        metadata: {
          email,
          isTest,
          productPermalink,
          rawPrice: price,
          ...(customUserId && { customUserId }),
        },
      },
    });

    // Grant product access
    await grantProductAccess(user.id, product, 'purchased');

    auditLog({
      event: 'payment.completed',
      userId: user.id,
      product,
      amount: amountCents,
      currency: currency.toUpperCase(),
      provider: 'gumroad',
      saleId,
      isTest,
    });

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error('Gumroad webhook error:', error);
    // Return 200 to prevent Gumroad retries on internal errors
    // The error is logged for investigation
    return NextResponse.json({ ok: true, message: 'Error logged' });
  }
}
