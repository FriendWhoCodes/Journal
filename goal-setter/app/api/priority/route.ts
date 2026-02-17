import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getCurrentUser, checkProductAccess, grantProductAccess } from '@/lib/auth';
import { PriorityModeData, Priority, Identity, WisdomType } from '@/lib/types/priority';
import { generateAIFeedback } from '@/lib/ai-feedback';
import { sendBlueprintSummaryEmail } from '@/lib/email';

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
    // await checkProductAccess(authUser.id, 'priority_mode');

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

    // Input length validation
    if (priorities.length > 10) {
      return NextResponse.json({ error: 'Too many priorities (max 10)' }, { status: 400 });
    }
    for (const p of priorities) {
      if (typeof p.name === 'string' && p.name.length > 500) {
        return NextResponse.json({ error: 'Priority name too long (max 500 chars)' }, { status: 400 });
      }
      if (typeof p.why === 'string' && p.why.length > 500) {
        return NextResponse.json({ error: 'Priority "why" too long (max 500 chars)' }, { status: 400 });
      }
      if (Array.isArray(p.goals)) {
        if (p.goals.length > 20) {
          return NextResponse.json({ error: 'Too many goals per priority (max 20)' }, { status: 400 });
        }
        for (const g of p.goals) {
          if (typeof g.what === 'string' && g.what.length > 2000) {
            return NextResponse.json({ error: 'Goal description too long (max 2000 chars)' }, { status: 400 });
          }
          if (typeof g.byWhen === 'string' && g.byWhen.length > 500) {
            return NextResponse.json({ error: 'Goal deadline too long (max 500 chars)' }, { status: 400 });
          }
        }
      }
    }
    const id = identity as Record<string, unknown>;
    for (const key of ['iAmSomeoneWho', 'identityStatement']) {
      if (typeof id[key] === 'string' && (id[key] as string).length > 2000) {
        return NextResponse.json({ error: 'Identity field too long (max 2000 chars)' }, { status: 400 });
      }
    }
    for (const key of ['habitsToBuild', 'habitsToEliminate']) {
      if (Array.isArray(id[key]) && (id[key] as string[]).length > 20) {
        return NextResponse.json({ error: 'Too many habits (max 20)' }, { status: 400 });
      }
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

      // For manual wisdom finalization, check slot availability BEFORE saving (inside a transaction)
      if (finalize && wisdomMode && wisdomType === 'manual') {
        try {
          submission = await prisma.$transaction(async (tx: any) => {
            const now = new Date();
            const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
            const monthEnd = new Date(now.getFullYear(), now.getMonth() + 1, 1);

            const usedSlots = await tx.priorityModeSubmission.count({
              where: {
                wisdomType: 'manual',
                wisdomMode: true,
                finalizedAt: { gte: monthStart, lt: monthEnd },
                userId: { not: authUser.id },
              },
            });

            if (usedSlots >= 10) {
              throw new Error('SLOT_LIMIT_REACHED');
            }

            if (existing) {
              return tx.priorityModeSubmission.update({
                where: { id: existing.id },
                data: {
                  priorities,
                  identity,
                  wisdomMode: true,
                  wisdomType: 'manual',
                  finalizedAt: new Date(),
                  editCount: existing.finalizedAt ? existing.editCount + 1 : existing.editCount,
                },
              });
            } else {
              return tx.priorityModeSubmission.create({
                data: {
                  userId: authUser.id,
                  priorities,
                  identity,
                  year,
                  wisdomMode: true,
                  wisdomType: 'manual',
                  finalizedAt: new Date(),
                },
              });
            }
          });
        } catch (txError: any) {
          if (txError?.message === 'SLOT_LIMIT_REACHED') {
            return NextResponse.json(
              { error: 'All personal wisdom slots for this month are taken. Please try again next month or choose AI Wisdom.' },
              { status: 409 }
            );
          }
          throw txError;
        }
      } else if (existing) {
        // Update existing submission (non-manual-wisdom or non-finalize)
        const updateData: any = {
          priorities,
          identity,
          wisdomMode: !!wisdomMode,
          wisdomType: wisdomType || null,
        };

        if (finalize && !existing.finalizedAt) {
          updateData.finalizedAt = new Date();
        } else if (finalize && existing.finalizedAt) {
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

      // Populate normalized tracking tables on finalization
      if (finalize) {
        try {
          // Delete existing normalized records (in case of re-finalization)
          await prisma.priorityHabit.deleteMany({ where: { submissionId: submission.id } });
          await prisma.priorityGoal.deleteMany({ where: { submissionId: submission.id } });

          // Create PriorityGoal and PriorityMilestoneRecord records
          const typedPriorities = priorities as Priority[];
          for (const priority of typedPriorities) {
            if (!priority.name?.trim()) continue;
            for (const goal of priority.goals || []) {
              if (!goal.what?.trim()) continue;
              const createdGoal = await prisma.priorityGoal.create({
                data: {
                  submissionId: submission.id,
                  priorityName: priority.name,
                  priorityOrder: priority.order || 1,
                  what: goal.what,
                  byWhen: goal.byWhen || '',
                  successLooksLike: goal.successLooksLike || null,
                },
              });

              // Create milestone records
              for (const milestone of goal.milestones || []) {
                if (!milestone.description?.trim()) continue;
                await prisma.priorityMilestoneRecord.create({
                  data: {
                    goalId: createdGoal.id,
                    period: milestone.period,
                    description: milestone.description,
                  },
                });
              }
            }
          }

          // Create PriorityHabit records from identity
          // Use loose typing since request body may have old string or new string[] format
          const rawIdentity = identity as Record<string, unknown>;
          const habitsToBuild = Array.isArray(rawIdentity.habitsToBuild)
            ? rawIdentity.habitsToBuild as string[]
            : typeof rawIdentity.habitsToBuild === 'string' && (rawIdentity.habitsToBuild as string).trim()
              ? [rawIdentity.habitsToBuild as string]
              : [];
          const habitsToEliminate = Array.isArray(rawIdentity.habitsToEliminate)
            ? rawIdentity.habitsToEliminate as string[]
            : typeof rawIdentity.habitsToEliminate === 'string' && (rawIdentity.habitsToEliminate as string).trim()
              ? [rawIdentity.habitsToEliminate as string]
              : [];

          for (const habit of habitsToBuild) {
            if (!habit.trim()) continue;
            await prisma.priorityHabit.create({
              data: {
                submissionId: submission.id,
                habit: habit.trim(),
                type: 'build',
              },
            });
          }

          for (const habit of habitsToEliminate) {
            if (!habit.trim()) continue;
            await prisma.priorityHabit.create({
              data: {
                submissionId: submission.id,
                habit: habit.trim(),
                type: 'eliminate',
              },
            });
          }
        } catch (normError) {
          // Log but don't fail the request — JSONB data is already saved
          console.error('Error populating normalized tables:', normError);
        }
      }

      // Send blueprint summary email on first finalization (non-blocking)
      if (finalize && !existing?.finalizedAt) {
        const rawIdentity = identity as Record<string, unknown>;
        sendBlueprintSummaryEmail(
          authUser.email,
          authUser.name,
          priorities as Priority[],
          typeof rawIdentity.iAmSomeoneWho === 'string' ? rawIdentity.iAmSomeoneWho : null,
          year,
        ).catch(err => {
          console.error('Error sending blueprint summary email:', err);
        });
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
