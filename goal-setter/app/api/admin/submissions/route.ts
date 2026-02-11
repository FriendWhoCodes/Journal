import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { requireAdmin } from '@/lib/admin';

// GET - List all wisdom mode submissions
export async function GET() {
  try {
    await requireAdmin();

    const submissions = await prisma.priorityModeSubmission.findMany({
      where: { wisdomMode: true },
      include: {
        user: { select: { id: true, name: true, email: true } },
        wisdomFeedback: { select: { id: true, status: true, reviewedAt: true } },
      },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({ submissions });
  } catch (error: any) {
    if (error.message === 'Unauthorized') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    if (error.message === 'Forbidden') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }
    console.error('Error loading submissions:', error);
    return NextResponse.json({ error: 'Failed to load submissions' }, { status: 500 });
  }
}
