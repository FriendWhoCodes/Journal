import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { CATEGORIES } from '@/lib/utils';

export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { year, week, category, hours, notes } = await request.json();

    // Validate input
    if (!year || !week || !category) {
      return NextResponse.json(
        { error: 'Year, week, and category are required' },
        { status: 400 }
      );
    }

    if (!CATEGORIES.includes(category)) {
      return NextResponse.json(
        { error: 'Invalid category' },
        { status: 400 }
      );
    }

    if (typeof hours !== 'number' || hours < 0 || hours > 168) {
      return NextResponse.json(
        { error: 'Hours must be between 0 and 168' },
        { status: 400 }
      );
    }

    // Upsert entry
    const entry = await prisma.timeViewsEntry.upsert({
      where: {
        userId_year_week_category: {
          userId: user.id,
          year,
          week,
          category,
        },
      },
      update: {
        hours,
        notes: notes || null,
      },
      create: {
        userId: user.id,
        year,
        week,
        category,
        hours,
        notes: notes || null,
      },
      include: {
        accomplishments: true,
      },
    });

    return NextResponse.json({ entry });
  } catch (error) {
    console.error('Entry error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
