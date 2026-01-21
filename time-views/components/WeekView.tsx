'use client';

import { useState } from 'react';
import type { AuthUser } from '@mow/auth';
import { CATEGORIES, type Category, formatWeekRange } from '@/lib/utils';
import CategoryRow from './CategoryRow';
import WeekNavigation from './WeekNavigation';
import YearOverview from './YearOverview';
import Header from './Header';

interface EntryData {
  category: string;
  id: string | null;
  hours: number;
  notes: string;
  accomplishments: { id: string; content: string; completed: boolean }[];
}

interface WeekViewProps {
  user: AuthUser;
  year: number;
  week: number;
  initialData: EntryData[];
  yearOverview: Record<number, Record<string, number>>;
  weeksInYear: number;
}

export default function WeekView({
  user,
  year,
  week,
  initialData,
  yearOverview,
  weeksInYear,
}: WeekViewProps) {
  const [entries, setEntries] = useState<EntryData[]>(initialData);

  const totalHours = entries.reduce((sum, entry) => sum + entry.hours, 0);

  const updateEntry = (category: string, updates: Partial<EntryData>) => {
    setEntries(prev =>
      prev.map(entry =>
        entry.category === category
          ? { ...entry, ...updates }
          : entry
      )
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header user={user} />

      <main className="max-w-5xl mx-auto px-4 py-8">
        <WeekNavigation
          year={year}
          week={week}
          weeksInYear={weeksInYear}
        />

        <div className="mb-2 text-center">
          <p className="text-gray-500 text-sm">{formatWeekRange(year, week)}</p>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden mb-8">
          <div className="p-4 border-b border-gray-100 flex items-center justify-between">
            <h2 className="font-semibold text-gray-900">Time Tracked</h2>
            <div className="text-sm text-gray-500">
              Total: <span className="font-medium text-gray-900">{totalHours.toFixed(1)}h</span>
            </div>
          </div>

          <div className="divide-y divide-gray-100">
            {CATEGORIES.map(category => {
              const entry = entries.find(e => e.category === category);
              return (
                <CategoryRow
                  key={category}
                  category={category as Category}
                  year={year}
                  week={week}
                  hours={entry?.hours || 0}
                  notes={entry?.notes || ''}
                  accomplishments={entry?.accomplishments || []}
                  onUpdate={(updates) => updateEntry(category, updates)}
                />
              );
            })}
          </div>
        </div>

        <YearOverview
          year={year}
          currentWeek={week}
          data={yearOverview}
          weeksInYear={weeksInYear}
        />
      </main>
    </div>
  );
}
