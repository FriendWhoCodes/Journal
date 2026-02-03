import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getCurrentUser, ensureProductAccess } from '@/lib/auth';
import { PriorityModeData } from '@/lib/types/priority';

// GET - Load existing Priority Mode submission
export async function GET(request: NextRequest) {
  try {
    const authUser = await getCurrentUser();

    if (!authUser) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Get year from query params (default to current year)
    const searchParams = request.nextUrl.searchParams;
    const year = parseInt(searchParams.get('year') || '2026', 10);

    // Find existing submission
    const submission = await prisma.priorityModeSubmission.findUnique({
      where: {
        userId_year: {
          userId: authUser.id,
          year,
        },
      },
    });

    if (!submission) {
      return NextResponse.json(
        { exists: false, data: null },
        { status: 200 }
      );
    }

    return NextResponse.json(
      {
        exists: true,
        data: {
          id: submission.id,
          priorities: submission.priorities,
          identity: submission.identity,
          year: submission.year,
          finalizedAt: submission.finalizedAt,
          editCount: submission.editCount,
          createdAt: submission.createdAt,
          updatedAt: submission.updatedAt,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error loading Priority Mode submission:', error);
    return NextResponse.json(
      { error: 'Failed to load submission' },
      { status: 500 }
    );
  }
}

// POST - Create or update Priority Mode submission
export async function POST(request: NextRequest) {
  try {
    const authUser = await getCurrentUser();

    if (!authUser) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // For now, allow access without payment check (will add payment gate later)
    // TODO: Check if user has purchased priority_mode product
    // await ensureProductAccess(authUser.id, 'priority_mode');

    const body = await request.json();
    const { priorities, identity, finalize, year = 2026 } = body;

    if (!priorities || !Array.isArray(priorities)) {
      return NextResponse.json(
        { error: 'Invalid priorities data' },
        { status: 400 }
      );
    }

    if (!identity || typeof identity !== 'object') {
      return NextResponse.json(
        { error: 'Invalid identity data' },
        { status: 400 }
      );
    }

    // Check for existing submission
    const existing = await prisma.priorityModeSubmission.findUnique({
      where: {
        userId_year: {
          userId: authUser.id,
          year,
        },
      },
    });

    let submission;

    if (existing) {
      // Update existing submission
      const updateData: any = {
        priorities,
        identity,
      };

      // If finalizing, set the timestamp
      if (finalize && !existing.finalizedAt) {
        updateData.finalizedAt = new Date();
      } else if (finalize && existing.finalizedAt) {
        // Re-finalizing (editing after finalize)
        updateData.editCount = existing.editCount + 1;
        updateData.finalizedAt = new Date();
      }

      submission = await prisma.priorityModeSubmission.update({
        where: { id: existing.id },
        data: updateData,
      });
    } else {
      // Create new submission
      submission = await prisma.priorityModeSubmission.create({
        data: {
          userId: authUser.id,
          priorities,
          identity,
          year,
          finalizedAt: finalize ? new Date() : null,
        },
      });
    }

    return NextResponse.json(
      {
        success: true,
        submissionId: submission.id,
        message: finalize
          ? 'Your 2026 Blueprint has been finalized!'
          : 'Progress saved successfully',
        data: {
          id: submission.id,
          finalizedAt: submission.finalizedAt,
          editCount: submission.editCount,
        },
      },
      { status: existing ? 200 : 201 }
    );
  } catch (error) {
    console.error('Error saving Priority Mode submission:', error);
    return NextResponse.json(
      { error: 'Failed to save submission' },
      { status: 500 }
    );
  }
}
