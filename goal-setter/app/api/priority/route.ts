import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getCurrentUser, ensureProductAccess } from '@/lib/auth';
import { PriorityModeData, Priority, Identity, WisdomType } from '@/lib/types/priority';
import { generateAIFeedback } from '@/lib/ai-feedback';

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
    const yearParam = searchParams.get('year');
    const year = yearParam ? parseInt(yearParam, 10) : 2026;

    if (isNaN(year)) {
      return NextResponse.json(
        { error: 'Invalid year parameter' },
        { status: 400 }
      );
    }

    // Find existing submission
    try {
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
            wisdomMode: submission.wisdomMode,
            wisdomType: submission.wisdomType,
            finalizedAt: submission.finalizedAt,
            editCount: submission.editCount,
            createdAt: submission.createdAt,
            updatedAt: submission.updatedAt,
          },
        },
        { status: 200 }
      );
    } catch (dbError: any) {
      // Handle case where table doesn't exist yet (migration not run)
      if (dbError?.code === 'P2021' || dbError?.message?.includes('does not exist')) {
        console.warn('PriorityModeSubmission table does not exist. Run migrations.');
        return NextResponse.json(
          { exists: false, data: null, warning: 'Database table not yet created' },
          { status: 200 }
        );
      }
      throw dbError;
    }
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
    const { priorities, identity, wisdomMode, wisdomType, finalize, year: yearInput = 2026 } = body;

    // Validate year
    const year = typeof yearInput === 'number' ? yearInput : parseInt(yearInput, 10);
    if (isNaN(year) || year < 2000 || year > 2100) {
      return NextResponse.json(
        { error: 'Invalid year parameter' },
        { status: 400 }
      );
    }

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
    try {
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
          wisdomMode: !!wisdomMode,
          wisdomType: wisdomType || null,
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
            wisdomMode: !!wisdomMode,
            wisdomType: wisdomType || null,
            finalizedAt: finalize ? new Date() : null,
          },
        });
      }

      // Create WisdomFeedback record if finalizing a wisdom mode submission
      if (finalize && submission.wisdomMode) {
        const existingFeedback = await prisma.wisdomFeedback.findUnique({
          where: { submissionId: submission.id },
        });

        if (!existingFeedback) {
          if (wisdomType === 'ai') {
            // AI mode: generate feedback immediately
            const aiFeedback = await generateAIFeedback(
              priorities as Priority[],
              identity as Identity
            );
            await prisma.wisdomFeedback.create({
              data: {
                submissionId: submission.id,
                status: 'reviewed',
                reviewedAt: new Date(),
                priorityAnalysis: aiFeedback.priorityAnalysis,
                goalFeedback: aiFeedback.goalFeedback,
                suggestions: aiFeedback.suggestions,
                identityInsights: aiFeedback.identityInsights,
                overallWisdom: aiFeedback.overallWisdom,
              },
            });
          } else {
            // Manual mode: create pending feedback for Man of Wisdom review
            await prisma.wisdomFeedback.create({
              data: {
                submissionId: submission.id,
                status: 'pending',
              },
            });
          }
        }
      }

      return NextResponse.json(
        {
          success: true,
          submissionId: submission.id,
          message: finalize
            ? `Your ${year} Blueprint has been finalized!`
            : 'Progress saved successfully',
          data: {
            id: submission.id,
            finalizedAt: submission.finalizedAt,
            editCount: submission.editCount,
          },
        },
        { status: existing ? 200 : 201 }
      );
    } catch (dbError: any) {
      // Handle case where table doesn't exist yet (migration not run)
      if (dbError?.code === 'P2021' || dbError?.message?.includes('does not exist')) {
        console.warn('PriorityModeSubmission table does not exist. Run migrations.');
        return NextResponse.json(
          {
            success: false,
            error: 'Database table not yet created. Please run migrations.',
            warning: 'Database migration required'
          },
          { status: 503 }
        );
      }
      throw dbError;
    }
  } catch (error) {
    console.error('Error saving Priority Mode submission:', error);
    return NextResponse.json(
      { error: 'Failed to save submission' },
      { status: 500 }
    );
  }
}
