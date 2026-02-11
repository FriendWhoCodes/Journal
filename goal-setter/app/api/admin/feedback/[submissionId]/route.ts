import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { requireAdmin } from '@/lib/admin';
import { sendWisdomFeedbackEmail } from '@/lib/email';

// GET - Fetch feedback and submission data for review
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ submissionId: string }> }
) {
  try {
    await requireAdmin();
    const { submissionId } = await params;

    const submission = await prisma.priorityModeSubmission.findUnique({
      where: { id: submissionId },
      include: {
        user: { select: { id: true, name: true, email: true } },
        wisdomFeedback: true,
      },
    });

    if (!submission) {
      return NextResponse.json({ error: 'Submission not found' }, { status: 404 });
    }

    return NextResponse.json({ submission });
  } catch (error: any) {
    if (error.message === 'Unauthorized') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    if (error.message === 'Forbidden') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }
    console.error('Error loading submission:', error);
    return NextResponse.json({ error: 'Failed to load submission' }, { status: 500 });
  }
}

// PUT - Update feedback and optionally mark as reviewed + notify
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ submissionId: string }> }
) {
  try {
    await requireAdmin();
    const { submissionId } = await params;
    const body = await request.json();
    const { priorityAnalysis, goalFeedback, suggestions, identityInsights, overallWisdom, markReviewed } = body;

    // Find or create feedback
    let feedback = await prisma.wisdomFeedback.findUnique({
      where: { submissionId },
    });

    if (!feedback) {
      feedback = await prisma.wisdomFeedback.create({
        data: { submissionId, status: 'in_progress' },
      });
    }

    const updateData: any = {};
    if (priorityAnalysis !== undefined) updateData.priorityAnalysis = priorityAnalysis;
    if (goalFeedback !== undefined) updateData.goalFeedback = goalFeedback;
    if (suggestions !== undefined) updateData.suggestions = suggestions;
    if (identityInsights !== undefined) updateData.identityInsights = identityInsights;
    if (overallWisdom !== undefined) updateData.overallWisdom = overallWisdom;

    if (markReviewed) {
      updateData.status = 'reviewed';
      updateData.reviewedAt = new Date();
    } else if (feedback.status === 'pending') {
      updateData.status = 'in_progress';
    }

    const updated = await prisma.wisdomFeedback.update({
      where: { id: feedback.id },
      data: updateData,
    });

    // Send email notification if marking as reviewed
    if (markReviewed) {
      const submission = await prisma.priorityModeSubmission.findUnique({
        where: { id: submissionId },
        include: { user: { select: { email: true, name: true } } },
      });

      if (submission?.user) {
        const emailResult = await sendWisdomFeedbackEmail(
          submission.user.email,
          submission.user.name,
        );

        if (emailResult.success) {
          await prisma.wisdomFeedback.update({
            where: { id: feedback.id },
            data: { notificationSentAt: new Date() },
          });
        }
      }
    }

    return NextResponse.json({ success: true, feedback: updated });
  } catch (error: any) {
    if (error.message === 'Unauthorized') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    if (error.message === 'Forbidden') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }
    console.error('Error updating feedback:', error);
    return NextResponse.json({ error: 'Failed to update feedback' }, { status: 500 });
  }
}
