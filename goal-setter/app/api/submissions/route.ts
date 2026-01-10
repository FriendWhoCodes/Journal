import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { Mode, QuickModeData, DeepModeData } from '@/lib/types';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, mode, quickModeData, deepModeData } = body;

    // Validate required fields
    if (!name || !email || !mode) {
      return NextResponse.json(
        { error: 'Missing required fields: name, email, mode' },
        { status: 400 }
      );
    }

    // Validate mode
    if (mode !== 'quick' && mode !== 'deep') {
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

    // Find or create user
    let user = await prisma.goalSetterUser.findUnique({
      where: { email },
    });

    if (!user) {
      user = await prisma.goalSetterUser.create({
        data: { name, email },
      });
    }

    // Prepare submission data
    const submissionData: any = {
      userId: user.id,
      mode,
      goal1: data.topGoals?.[0] || null,
      goal2: data.topGoals?.[1] || null,
      goal3: data.topGoals?.[2] || null,
      habitsToBuild: data.habitsToBuild || null,
      habitsToBreak: data.habitsToBreak || null,
      mainTheme: data.mainTheme || null,
      placesToVisit: data.placesToVisit || null,
      booksToRead: data.booksToRead || null,
      moviesToWatch: data.moviesToWatch || null,
      experiencesToHave: data.experiencesToHave || null,
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
    console.error('Error saving submission:', error);
    return NextResponse.json(
      {
        error: 'Failed to save submission',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
