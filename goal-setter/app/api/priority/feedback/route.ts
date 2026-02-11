import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getCurrentUser } from '@/lib/auth';

// GET - Load wisdom feedback for the current user
export async function GET(request: NextRequest) {
  try {
    const authUser = await getCurrentUser();

    if (!authUser) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const searchParams = request.nextUrl.searchParams;
    const year = parseInt(searchParams.get('year') || '2026', 10);

    const submission = await prisma.priorityModeSubmission.findUnique({
      where: {
        userId_year: {
          userId: authUser.id,
          year,
        },
      },
      include: {
        wisdomFeedback: true,
      },
    });

    if (!submission?.wisdomFeedback) {
      return NextResponse.json({ exists: false, feedback: null });
    }

    return NextResponse.json({
      exists: true,
      feedback: submission.wisdomFeedback,
    });
  } catch (error) {
    console.error('Error loading feedback:', error);
    return NextResponse.json(
      { error: 'Failed to load feedback' },
      { status: 500 }
    );
  }
}
