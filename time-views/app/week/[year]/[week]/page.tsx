import { getCurrentUser, ensureProductAccess } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { CATEGORIES, getWeeksInYear } from "@/lib/utils";
import WeekView from "@/components/WeekView";

interface PageProps {
  params: Promise<{
    year: string;
    week: string;
  }>;
}

export default async function WeekDetailPage({ params }: PageProps) {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login");
  }

  await ensureProductAccess(user.id, 'time_views');

  const { year: yearStr, week: weekStr } = await params;
  const year = parseInt(yearStr, 10);
  const week = parseInt(weekStr, 10);

  // Validate year and week
  const currentYear = new Date().getFullYear();
  if (isNaN(year) || year < 2020 || year > currentYear + 1) {
    redirect("/week");
  }

  const weeksInYear = getWeeksInYear(year);
  if (isNaN(week) || week < 1 || week > weeksInYear) {
    redirect("/week");
  }

  // Fetch entries for this week
  const entries = await prisma.timeViewsEntry.findMany({
    where: {
      userId: user.id,
      year,
      week,
    },
    include: {
      accomplishments: {
        orderBy: { createdAt: 'asc' },
      },
    },
  });

  // Convert to a map by category
  const entriesMap: Record<string, {
    id: string;
    hours: number;
    notes: string | null;
    accomplishments: { id: string; content: string; completed: boolean }[];
  }> = {};

  for (const entry of entries) {
    entriesMap[entry.category] = {
      id: entry.id,
      hours: entry.hours,
      notes: entry.notes,
      accomplishments: entry.accomplishments.map(a => ({
        id: a.id,
        content: a.content,
        completed: a.completed,
      })),
    };
  }

  // Ensure all categories have an entry (even if empty)
  const initialData = CATEGORIES.map(category => ({
    category,
    id: entriesMap[category]?.id || null,
    hours: entriesMap[category]?.hours || 0,
    notes: entriesMap[category]?.notes || '',
    accomplishments: entriesMap[category]?.accomplishments || [],
  }));

  // Fetch year overview data (hours per week per category)
  const yearEntries = await prisma.timeViewsEntry.findMany({
    where: {
      userId: user.id,
      year,
    },
    select: {
      week: true,
      category: true,
      hours: true,
    },
  });

  // Group by week
  const yearOverview: Record<number, Record<string, number>> = {};
  for (const entry of yearEntries) {
    if (!yearOverview[entry.week]) {
      yearOverview[entry.week] = {};
    }
    yearOverview[entry.week][entry.category] = entry.hours;
  }

  return (
    <WeekView
      user={user}
      year={year}
      week={week}
      initialData={initialData}
      yearOverview={yearOverview}
      weeksInYear={weeksInYear}
    />
  );
}
