import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getCurrentUser, ensureProductAccess } from '@/lib/auth';
import { Mode, QuickModeData, DeepModeData } from '@/lib/types';
import {
  validateName,
  validateMode,
  validateTextField,
  validateStringArray,
} from '@/lib/validation';

export async function POST(request: NextRequest) {
  try {
    const authUser = await getCurrentUser();

    if (!authUser) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Auto-grant free access to goal_setter product
    await ensureProductAccess(authUser.id, 'goal_setter');

    const body = await request.json();
    const { name, mode, quickModeData, deepModeData } = body;

    // Validate and sanitize name (still from body for display/PDF purposes)
    const nameValidation = validateName(name);
    if (!nameValidation.valid) {
      return NextResponse.json(
        { error: nameValidation.error },
        { status: 400 }
      );
    }

    // Validate mode
    if (!validateMode(mode)) {
      return NextResponse.json(
        { error: 'Invalid mode. Must be "quick" or "deep"' },
        { status: 400 }
      );
    }

    // Get data based on mode
    const data = (mode === 'quick' ? quickModeData : deepModeData) as QuickModeData | DeepModeData;

    if (!data) {
      return NextResponse.json(
        { error: `Missing ${mode} mode data` },
        { status: 400 }
      );
    }

    // Find or create GoalSetterUser using auth user's email
    let user = await prisma.goalSetterUser.findUnique({
      where: { email: authUser.email },
    });

    if (!user) {
      user = await prisma.goalSetterUser.create({
        data: {
          name: nameValidation.sanitized,
          email: authUser.email,
          authUserId: authUser.id,
        },
      });
    } else if (!user.authUserId) {
      // Link existing GoalSetterUser to AuthUser if not already linked
      user = await prisma.goalSetterUser.update({
        where: { id: user.id },
        data: { authUserId: authUser.id },
      });
    }

    // Validate and sanitize all text fields
    const goal1Validation = validateTextField(data.topGoals?.[0], 'Goal 1');
    const goal2Validation = validateTextField(data.topGoals?.[1], 'Goal 2');
    const goal3Validation = validateTextField(data.topGoals?.[2], 'Goal 3');
    const themeValidation = validateTextField(data.mainTheme, 'Theme');
    const placesValidation = validateTextField(data.placesToVisit, 'Places');
    const booksValidation = validateTextField(data.booksToRead, 'Books');
    const moviesValidation = validateTextField(data.moviesToWatch, 'Movies');
    const experiencesValidation = validateTextField(data.experiencesToHave, 'Experiences');

    // Validate arrays
    const habitsBuildValidation = validateStringArray(data.habitsToBuild, 50);
    const habitsBreakValidation = validateStringArray(data.habitsToBreak, 50);

    // Check if any validation failed
    const validations = [
      goal1Validation,
      goal2Validation,
      goal3Validation,
      themeValidation,
      placesValidation,
      booksValidation,
      moviesValidation,
      experiencesValidation,
      habitsBuildValidation,
      habitsBreakValidation,
    ];
    const failedValidation = validations.find(v => !v.valid);
    if (failedValidation && 'error' in failedValidation) {
      return NextResponse.json(
        { error: failedValidation.error },
        { status: 400 }
      );
    }

    // Prepare sanitized submission data
    const submissionData: any = {
      userId: user.id,
      mode,
      goal1: goal1Validation.sanitized || null,
      goal2: goal2Validation.sanitized || null,
      goal3: goal3Validation.sanitized || null,
      habitsToBuild: habitsBuildValidation.sanitized || null,
      habitsToBreak: habitsBreakValidation.sanitized || null,
      mainTheme: themeValidation.sanitized || null,
      placesToVisit: placesValidation.sanitized || null,
      booksToRead: booksValidation.sanitized || null,
      moviesToWatch: moviesValidation.sanitized || null,
      experiencesToHave: experiencesValidation.sanitized || null,
    };

    // Add deep mode data if applicable
    if (mode === 'deep') {
      const deepData = data as DeepModeData;
      submissionData.deepModeData = {
        health: deepData.health || null,
        relationships: deepData.relationships || null,
        wealth: deepData.wealth || null,
        career: deepData.career || null,
        growth: deepData.growth || null,
        impact: deepData.impact || null,
      };
    }

    // Create submission
    const submission = await prisma.goalSetterSubmission.create({
      data: submissionData,
    });

    return NextResponse.json(
      {
        success: true,
        submissionId: submission.id,
        userId: user.id,
        message: 'Goal submission saved successfully!',
      },
      { status: 201 }
    );
  } catch (error) {
    // Log error server-side but don't expose details to client (security)
    console.error('Error saving submission:', error);

    // Return generic error to prevent information leakage
    return NextResponse.json(
      {
        error: 'Failed to save submission',
        message: 'An error occurred while saving your goals. Please try again.',
      },
      { status: 500 }
    );
  }
}
