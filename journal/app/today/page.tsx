import { redirect } from 'next/navigation';
import { getCurrentUser, ensureProductAccess } from '@/lib/auth';
import { formatDate, getToday } from '@/lib/utils';
import Link from 'next/link';

export default async function TodayPage() {
  const user = await getCurrentUser();

  if (!user) {
    redirect('/login');
  }

  // Auto-grant journal access
  await ensureProductAccess(user.id, 'journal');

  const today = getToday();

  return (
    <div className="min-h-screen bg-[var(--bg-primary)]">
      {/* Header */}
      <header className="border-b border-gray-200 bg-white sticky top-0 z-10">
        <div className="max-w-2xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="text-gray-500 hover:text-gray-900">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </Link>
          <span className="font-medium text-gray-900">{formatDate(today)}</span>
          <div className="w-5"></div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-2xl mx-auto px-4 py-6">
        {/* Mood Picker */}
        <section className="mb-8">
          <h2 className="text-sm font-medium text-gray-500 uppercase tracking-wide mb-3">
            How are you feeling?
          </h2>
          <div className="flex gap-3 justify-center">
            {['1', '2', '3', '4', '5'].map((mood) => (
              <button
                key={mood}
                className="w-14 h-14 rounded-full bg-white border-2 border-gray-200 hover:border-blue-400 flex items-center justify-center text-2xl transition-colors"
              >
                {getMoodEmoji(parseInt(mood))}
              </button>
            ))}
          </div>
        </section>

        {/* Prompts */}
        <section className="space-y-6">
          <PromptCard
            title="Gratitude"
            placeholder="What are you grateful for today?"
            icon="&#128591;"
          />
          <PromptCard
            title="Wins"
            placeholder="What went well today? What are you proud of?"
            icon="&#127942;"
          />
          <PromptCard
            title="Lessons"
            placeholder="What did you learn today? What could be better?"
            icon="&#128161;"
          />
          <PromptCard
            title="Free Writing"
            placeholder="Anything else on your mind..."
            icon="&#9998;"
          />
        </section>

        {/* Save Button */}
        <div className="mt-8 pb-8">
          <button className="w-full bg-blue-600 text-white py-3 rounded-xl font-semibold hover:bg-blue-700 transition-colors">
            Save Entry
          </button>
          <p className="text-center text-sm text-gray-400 mt-3">
            Entries auto-save as you type (coming soon)
          </p>
        </div>
      </main>
    </div>
  );
}

function PromptCard({ title, placeholder, icon }: { title: string; placeholder: string; icon: string }) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-4">
      <label className="block">
        <span className="text-sm font-medium text-gray-700 flex items-center gap-2 mb-2">
          <span dangerouslySetInnerHTML={{ __html: icon }} />
          {title}
        </span>
        <textarea
          placeholder={placeholder}
          rows={3}
          className="w-full px-0 py-2 text-gray-900 placeholder-gray-400 border-0 focus:ring-0 focus:outline-none resize-none"
        />
      </label>
    </div>
  );
}

function getMoodEmoji(mood: number): string {
  const emojis: Record<number, string> = {
    1: '\u{1F614}', // Pensive
    2: '\u{1F615}', // Confused
    3: '\u{1F610}', // Neutral
    4: '\u{1F60A}', // Smiling
    5: '\u{1F604}', // Grinning
  };
  return emojis[mood] || '\u{1F610}';
}
