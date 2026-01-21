// Get ISO week number (1-52)
export function getWeekNumber(date: Date): number {
  const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
  const dayNum = d.getUTCDay() || 7;
  d.setUTCDate(d.getUTCDate() + 4 - dayNum);
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  return Math.ceil((((d.getTime() - yearStart.getTime()) / 86400000) + 1) / 7);
}

// Get year for ISO week (handles year boundary)
export function getWeekYear(date: Date): number {
  const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
  const dayNum = d.getUTCDay() || 7;
  d.setUTCDate(d.getUTCDate() + 4 - dayNum);
  return d.getUTCFullYear();
}

// Get date range for a specific week
export function getWeekDateRange(year: number, week: number): { start: Date; end: Date } {
  // Find January 4th of the year (always in week 1)
  const jan4 = new Date(Date.UTC(year, 0, 4));
  const jan4DayOfWeek = jan4.getUTCDay() || 7;

  // Find Monday of week 1
  const week1Monday = new Date(jan4);
  week1Monday.setUTCDate(jan4.getUTCDate() - jan4DayOfWeek + 1);

  // Calculate Monday of the target week
  const start = new Date(week1Monday);
  start.setUTCDate(week1Monday.getUTCDate() + (week - 1) * 7);

  // Sunday of the target week
  const end = new Date(start);
  end.setUTCDate(start.getUTCDate() + 6);

  return { start, end };
}

// Format date for display
export function formatDate(date: Date): string {
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
  });
}

// Format week range for display
export function formatWeekRange(year: number, week: number): string {
  const { start, end } = getWeekDateRange(year, week);
  return `${formatDate(start)} - ${formatDate(end)}, ${year}`;
}

// Categories for time tracking
export const CATEGORIES = ['Code', 'Writing', 'Design', 'Business', 'Personal'] as const;
export type Category = typeof CATEGORIES[number];

// Category colors for visualization
export const CATEGORY_COLORS: Record<Category, string> = {
  Code: '#3B82F6',      // blue
  Writing: '#10B981',   // emerald
  Design: '#8B5CF6',    // violet
  Business: '#F59E0B',  // amber
  Personal: '#EC4899',  // pink
};

// Get total weeks in a year (52 or 53)
export function getWeeksInYear(year: number): number {
  const dec31 = new Date(Date.UTC(year, 11, 31));
  const week = getWeekNumber(dec31);
  // If Dec 31 is in week 1, then the year has 52 weeks
  return week === 1 ? 52 : week;
}
