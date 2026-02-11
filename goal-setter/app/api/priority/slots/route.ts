import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

const MAX_MONTHLY_SLOTS = 10;

export async function GET() {
  try {
    const now = new Date();
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
    const monthEnd = new Date(now.getFullYear(), now.getMonth() + 1, 1);

    const usedSlots = await prisma.priorityModeSubmission.count({
      where: {
        wisdomType: 'manual',
        wisdomMode: true,
        finalizedAt: {
          gte: monthStart,
          lt: monthEnd,
        },
      },
    });

    const remaining = Math.max(0, MAX_MONTHLY_SLOTS - usedSlots);

    return NextResponse.json({
      total: MAX_MONTHLY_SLOTS,
      used: usedSlots,
      remaining,
    });
  } catch (error) {
    console.error('Error fetching slots:', error);
    return NextResponse.json({
      total: MAX_MONTHLY_SLOTS,
      used: 0,
      remaining: MAX_MONTHLY_SLOTS,
    });
  }
}
