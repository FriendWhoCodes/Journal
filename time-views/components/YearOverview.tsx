'use client';

import Link from 'next/link';
import { CATEGORIES, CATEGORY_COLORS, type Category } from '@/lib/utils';

interface YearOverviewProps {
  year: number;
  currentWeek: number;
  data: Record<number, Record<string, number>>;
  weeksInYear: number;
}

export default function YearOverview({
  year,
  currentWeek,
  data,
  weeksInYear,
}: YearOverviewProps) {
  // Calculate max hours for scaling
  let maxHours = 0;
  for (const weekData of Object.values(data)) {
    const total = Object.values(weekData).reduce((sum, h) => sum + h, 0);
    if (total > maxHours) maxHours = total;
  }
  if (maxHours === 0) maxHours = 40; // Default scale

  const weeks = Array.from({ length: weeksInYear }, (_, i) => i + 1);

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-gray-900">{year} Overview</h3>
        <div className="flex items-center gap-3">
          {CATEGORIES.map(cat => (
            <div key={cat} className="flex items-center gap-1">
              <div
                className="w-2 h-2 rounded-full"
                style={{ backgroundColor: CATEGORY_COLORS[cat as Category] }}
              />
              <span className="text-xs text-gray-500">{cat}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="flex gap-0.5 overflow-x-auto pb-2">
        {weeks.map(week => {
          const weekData = data[week] || {};
          const total = Object.values(weekData).reduce((sum, h) => sum + h, 0);
          const isActive = week === currentWeek;

          return (
            <Link
              key={week}
              href={`/week/${year}/${week}`}
              className={`flex-shrink-0 w-4 h-16 rounded-sm flex flex-col-reverse overflow-hidden transition hover:opacity-80 ${
                isActive ? 'ring-2 ring-blue-500 ring-offset-1' : ''
              }`}
              title={`Week ${week}: ${total.toFixed(1)}h`}
            >
              {total === 0 ? (
                <div className="w-full h-full bg-gray-100" />
              ) : (
                CATEGORIES.map(cat => {
                  const hours = weekData[cat] || 0;
                  const height = (hours / maxHours) * 100;

                  return (
                    <div
                      key={cat}
                      className="w-full"
                      style={{
                        height: `${height}%`,
                        backgroundColor: CATEGORY_COLORS[cat as Category],
                      }}
                    />
                  );
                })
              )}
            </Link>
          );
        })}
      </div>

      <div className="flex justify-between mt-2 text-xs text-gray-400">
        <span>W1</span>
        <span>W{Math.floor(weeksInYear / 2)}</span>
        <span>W{weeksInYear}</span>
      </div>
    </div>
  );
}
