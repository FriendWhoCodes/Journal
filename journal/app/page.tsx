import { redirect } from 'next/navigation';
import { getCurrentUser } from '@/lib/auth';
import Link from 'next/link';
import { formatDate, getToday } from '@/lib/utils';

export default async function HomePage() {
  const user = await getCurrentUser();

  if (!user) {
    redirect('/login');
  }

  const today = getToday();
  const greeting = getGreeting();

  return (
    <div className="min-h-screen bg-[var(--bg-primary)]">
      {/* Header */}
      <header className="border-b border-gray-200 bg-white">
        <div className="max-w-3xl mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-xl font-semibold text-gray-900">Journal</h1>
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-500">{user.name || user.email}</span>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-3xl mx-auto px-4 py-8">
        {/* Greeting */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            {greeting}, {user.name?.split(' ')[0] || 'there'}
          </h2>
          <p className="text-gray-500">{formatDate(today)}</p>
        </div>

        {/* Quick Actions */}
        <div className="grid gap-4 mb-8">
          <Link
            href="/today"
            className="block p-6 bg-white rounded-xl border border-gray-200 hover:border-blue-300 hover:shadow-sm transition-all"
          >
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-1">
                  Today's Entry
                </h3>
                <p className="text-gray-500 text-sm">
                  Reflect on your day, track habits, update goals
                </p>
              </div>
              <div className="text-3xl">
                <span role="img" aria-label="Write">
                  &#9998;
                </span>
              </div>
            </div>
          </Link>
        </div>

        {/* Coming Soon */}
        <div className="bg-blue-50 rounded-xl p-6 border border-blue-100">
          <h3 className="font-semibold text-blue-900 mb-2">Building something great</h3>
          <p className="text-blue-700 text-sm">
            Weekly reviews, habit streaks, goal tracking, and more coming soon.
          </p>
        </div>
      </main>
    </div>
  );
}

function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good morning';
  if (hour < 17) return 'Good afternoon';
  return 'Good evening';
}
