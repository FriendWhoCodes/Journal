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

    // Validate required fields
    if (!sellerId || !saleId || !email || !productPermalink) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

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

    // Verify sale is real by calling Gumroad API (prevents webhook spoofing)
    const gumroadAccessToken = process.env.GUMROAD_ACCESS_TOKEN;
    if (gumroadAccessToken) {
      try {
        const verifyRes = await fetch(`https://api.gumroad.com/v2/sales/${saleId}`, {
          headers: { Authorization: `Bearer ${gumroadAccessToken}` },
        });
        if (!verifyRes.ok) {
          auditLog({ event: 'payment.webhook_rejected', reason: 'sale_verification_failed', saleId, status: verifyRes.status });
          return NextResponse.json({ error: 'Sale verification failed' }, { status: 403 });
        }
      } catch (verifyError) {
        // If Gumroad API is down, log and proceed (fail-open to avoid losing sales)
        console.error('Gumroad sale verification failed, proceeding:', verifyError);
      }
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

    // Convert price string (e.g. "29.99") to cents and validate minimum price
    const amountCents = Math.round(parseFloat(price || '0') * 100);
    const MIN_PRICE_CENTS: Record<string, number> = {
      priority_mode: 999,            // $9.99
      priority_ai_wisdom: 2999,      // $29.99
      priority_personal_wisdom: 9900, // $99.00
    };
    const minPrice = MIN_PRICE_CENTS[product] || 0;
    if (!isTest && amountCents < minPrice) {
      auditLog({ event: 'payment.webhook_rejected', reason: 'price_below_minimum', product, amountCents, minPrice, saleId });
      return NextResponse.json({ error: 'Invalid payment amount' }, { status: 400 });
    }

    // Atomic transaction: create payment + grant access together
    await prisma.$transaction(async (tx: any) => {
      await tx.payment.create({
        data: {
          userId: user!.id,
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
      await tx.userProduct.upsert({
        where: { userId_product: { userId: user!.id, product } },
        update: {},
        create: { userId: user!.id, product, accessType: 'purchased' },
      });

      // Wisdom products also grant base priority_mode access
      if (product === 'priority_ai_wisdom' || product === 'priority_personal_wisdom') {
        await tx.userProduct.upsert({
          where: { userId_product: { userId: user!.id, product: 'priority_mode' } },
          update: {},
          create: { userId: user!.id, product: 'priority_mode', accessType: 'purchased' },
        });
      }
    });

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
    // Return 500 so Gumroad retries (up to 3 hours)
    return NextResponse.json({ error: 'Internal error' }, { status: 500 });
  }
}
