'use client';

import Link from 'next/link';
import { getWeekNumber, getWeekYear, getWeeksInYear } from '@/lib/utils';

interface WeekNavigationProps {
  year: number;
  week: number;
  weeksInYear: number;
}

export default function WeekNavigation({ year, week, weeksInYear }: WeekNavigationProps) {
  // Calculate previous week
  let prevYear = year;
  let prevWeek = week - 1;
  if (prevWeek < 1) {
    prevYear = year - 1;
    prevWeek = getWeeksInYear(prevYear);
  }

  // Calculate next week
  let nextYear = year;
  let nextWeek = week + 1;
  if (nextWeek > weeksInYear) {
    nextYear = year + 1;
    nextWeek = 1;
  }

  // Check if this is the current week
  const now = new Date();
  const currentYear = getWeekYear(now);
  const currentWeek = getWeekNumber(now);
  const isCurrentWeek = year === currentYear && week === currentWeek;

  // Limit navigation (don't go too far into the future)
  const maxYear = currentYear + 1;
  const canGoNext = nextYear <= maxYear;

  return (
    <div className="flex items-center justify-between mb-6">
      <Link
        href={`/week/${prevYear}/${prevWeek}`}
        className="flex items-center gap-1 text-gray-600 hover:text-gray-900 transition"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        <span className="text-sm hidden sm:inline">Previous</span>
      </Link>

      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900">
          Week {week}, {year}
        </h2>
        {isCurrentWeek && (
          <span className="text-xs text-blue-600 font-medium">Current Week</span>
        )}
      </div>

      {canGoNext ? (
        <Link
          href={`/week/${nextYear}/${nextWeek}`}
          className="flex items-center gap-1 text-gray-600 hover:text-gray-900 transition"
        >
          <span className="text-sm hidden sm:inline">Next</span>
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </Link>
      ) : (
        <div className="w-20" />
      )}
    </div>
  );
}
