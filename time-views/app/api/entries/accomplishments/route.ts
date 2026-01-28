import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser, ensureProductAccess } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { CATEGORIES } from '@/lib/utils';

// Add accomplishment
export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    await ensureProductAccess(user.id, 'time_views');

    const { year, week, category, content } = await request.json();

    // Validate input
    if (!year || !week || !category || !content) {
      return NextResponse.json(
        { error: 'Year, week, category, and content are required' },
        { status: 400 }
      );
    }

    if (!CATEGORIES.includes(category)) {
      return NextResponse.json(
        { error: 'Invalid category' },
        { status: 400 }
      );
    }

    // Get or create entry
    let entry = await prisma.timeViewsEntry.findUnique({
      where: {
        userId_year_week_category: {
          userId: user.id,
          year,
          week,
          category,
        },
      },
    });

    if (!entry) {
      entry = await prisma.timeViewsEntry.create({
        data: {
          userId: user.id,
          year,
          week,
          category,
          hours: 0,
        },
      });
    }

    // Create accomplishment
    const accomplishment = await prisma.timeViewsAccomplishment.create({
      data: {
        entryId: entry.id,
        content,
      },
    });

    return NextResponse.json({ accomplishment });
  } catch (error) {
    console.error('Add accomplishment error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Update accomplishment
export async function PATCH(request: NextRequest) {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    await ensureProductAccess(user.id, 'time_views');

    const { id, content, completed } = await request.json();

    if (!id) {
      return NextResponse.json(
        { error: 'Accomplishment ID is required' },
        { status: 400 }
      );
    }

    // Verify ownership
    const existing = await prisma.timeViewsAccomplishment.findUnique({
      where: { id },
      include: {
        entry: {
          select: { userId: true },
        },
      },
    });

    if (!existing || existing.entry.userId !== user.id) {
      return NextResponse.json(
        { error: 'Accomplishment not found' },
        { status: 404 }
      );
    }

    // Update
    const accomplishment = await prisma.timeViewsAccomplishment.update({
      where: { id },
      data: {
        ...(content !== undefined && { content }),
        ...(completed !== undefined && { completed }),
      },
    });

    return NextResponse.json({ accomplishment });
  } catch (error) {
    console.error('Update accomplishment error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Delete accomplishment
export async function DELETE(request: NextRequest) {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    await ensureProductAccess(user.id, 'time_views');

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { error: 'Accomplishment ID is required' },
        { status: 400 }
      );
    }

    // Verify ownership
    const existing = await prisma.timeViewsAccomplishment.findUnique({
      where: { id },
      include: {
        entry: {
          select: { userId: true },
        },
      },
    });

    if (!existing || existing.entry.userId !== user.id) {
      return NextResponse.json(
        { error: 'Accomplishment not found' },
        { status: 404 }
      );
    }

    // Delete
    await prisma.timeViewsAccomplishment.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Delete accomplishment error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
