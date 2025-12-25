'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useGoalSetter } from '@/lib/context/GoalSetterContext';
import { DeepModeCategory } from '@/lib/types';

export default function Summary() {
  const router = useRouter();
  const { name, mode, quickModeData, deepModeData, email, setEmail } = useGoalSetter();
  const [localEmail, setLocalEmail] = useState(email || '');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  if (!name || !mode) {
    router.push('/');
    return null;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate API call - in production, this would save to database
    setTimeout(() => {
      setEmail(localEmail);
      setSubmitted(true);
      setIsSubmitting(false);
    }, 1000);
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-emerald-50 flex items-center justify-center px-4">
        <div className="max-w-2xl w-full text-center">
          <div className="bg-white rounded-2xl shadow-2xl p-12">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>

            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Your 2026 Goals Are Saved! 🎉
            </h1>

            <p className="text-lg text-gray-600 mb-8">
              We&apos;ve sent a confirmation email to <strong>{localEmail}</strong>
            </p>

            <div className="bg-indigo-50 rounded-xl p-6 mb-8">
              <h2 className="text-xl font-bold text-indigo-900 mb-3">
                What happens next?
              </h2>
              <ul className="text-left space-y-2 text-gray-700">
                <li className="flex items-start">
                  <span className="text-indigo-500 mr-2">✓</span>
                  <span>Your goals are securely saved</span>
                </li>
                <li className="flex items-start">
                  <span className="text-indigo-500 mr-2">✓</span>
                  <span>We&apos;ll email you on <strong>January 1st</strong> when the journal launches</span>
                </li>
                <li className="flex items-start">
                  <span className="text-indigo-500 mr-2">✓</span>
                  <span>You&apos;ll get <strong>1 month FREE</strong> Pro access</span>
                </li>
                <li className="flex items-start">
                  <span className="text-indigo-500 mr-2">✓</span>
                  <span>All your goals will be pre-loaded in the journal</span>
                </li>
              </ul>
            </div>

            <div className="space-y-3">
              <button
                onClick={() => window.print()}
                className="w-full bg-indigo-600 text-white py-4 rounded-xl font-semibold text-lg hover:bg-indigo-700 transition-all"
              >
                📄 Print My Goals
              </button>

              <button
                onClick={() => {
                  setSubmitted(false);
                  router.push('/');
                }}
                className="w-full bg-gray-200 text-gray-700 py-4 rounded-xl font-semibold text-lg hover:bg-gray-300 transition-all"
              >
                Edit My Goals
              </button>
            </div>

            <p className="mt-8 text-sm text-gray-500">
              Didn&apos;t receive the email? Check your spam folder or contact us.
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Parse life balance data
  const data = mode === 'quick' ? quickModeData : deepModeData;
  const placesArray = data.placesToVisit?.split('\n').filter(p => p.trim()) || [];
  const booksArray = data.booksToRead?.split('\n').filter(b => b.trim()) || [];
  const experiencesArray = data.experiencesToHave?.split('\n').filter(e => e.trim()) || [];

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-4">
            Your 2026 Blueprint
          </h1>
          <p className="text-xl text-gray-600">
            Here&apos;s everything you want to achieve this year, {name}!
          </p>
          <p className="text-sm text-gray-500 mt-2">
            Mode: <span className="font-semibold capitalize">{mode}</span>
          </p>
        </div>

        {/* Goals Summary */}
        <div className="bg-white rounded-2xl shadow-2xl p-8 md:p-12 mb-8">
          {mode === 'quick' ? (
            // Quick Mode Display
            <>
              {/* Top 3 Goals */}
              <section className="mb-10">
                <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
                  <span className="text-3xl mr-3">🎯</span> TOP 3 GOALS
                </h2>
                <ul className="space-y-3">
                  {quickModeData.topGoals?.map((goal, i) => (
                    <li key={i} className="flex items-start">
                      <span className="bg-indigo-100 text-indigo-700 rounded-full w-8 h-8 flex items-center justify-center font-bold mr-3 flex-shrink-0">
                        {i + 1}
                      </span>
                      <span className="text-lg text-gray-800 pt-1">{goal}</span>
                    </li>
                  ))}
                </ul>
              </section>

              {/* Habits */}
              <div className="grid md:grid-cols-2 gap-8 mb-10">
                <section>
                  <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
                    <span className="text-3xl mr-3">✅</span> HABIT TO BUILD
                  </h2>
                  <p className="text-lg text-gray-800 bg-green-50 p-4 rounded-xl">
                    {quickModeData.habitToBuild}
                  </p>
                </section>

                <section>
                  <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
                    <span className="text-3xl mr-3">❌</span> HABIT TO BREAK
                  </h2>
                  <p className="text-lg text-gray-800 bg-red-50 p-4 rounded-xl">
                    {quickModeData.habitToBreak}
                  </p>
                </section>
              </div>

              {/* Theme */}
              <section className="mb-10">
                <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
                  <span className="text-3xl mr-3">💡</span> THEME FOR 2026
                </h2>
                <div className="bg-gradient-to-r from-indigo-50 to-purple-50 p-6 rounded-xl">
                  <p className="text-2xl font-semibold text-center text-indigo-900">
                    &quot;{quickModeData.mainTheme}&quot;
                  </p>
                </div>
              </section>
            </>
          ) : (
            // Deep Mode Display
            <div className="space-y-8">
              {[
                { id: 'health', name: 'Health & Fitness', icon: '💪', color: 'red' },
                { id: 'career', name: 'Career & Work', icon: '💼', color: 'blue' },
                { id: 'wealth', name: 'Wealth & Finance', icon: '💰', color: 'green' },
                { id: 'relationships', name: 'Relationships & Family', icon: '❤️', color: 'pink' },
                { id: 'growth', name: 'Personal Growth & Learning', icon: '📚', color: 'purple' },
                { id: 'impact', name: 'Contribution & Impact', icon: '🌟', color: 'yellow' },
              ].map((category) => {
                const categoryData = deepModeData[category.id as keyof typeof deepModeData] as DeepModeCategory | undefined;
                if (!categoryData?.goal) return null;

                return (
                  <section key={category.id} className="border-b pb-8 last:border-b-0">
                    <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
                      <span className="text-3xl mr-3">{category.icon}</span> {category.name}
                    </h2>

                    <div className="space-y-4 ml-12">
                      <div>
                        <h3 className="font-semibold text-gray-700 mb-2">🎯 Goal:</h3>
                        <p className="text-gray-800 bg-gray-50 p-3 rounded-lg">{categoryData.goal}</p>
                      </div>

                      <div>
                        <h3 className="font-semibold text-gray-700 mb-2">✅ Habits to Build:</h3>
                        <p className="text-gray-800 bg-green-50 p-3 rounded-lg whitespace-pre-line">{categoryData.habitsBuild}</p>
                      </div>

                      <div>
                        <h3 className="font-semibold text-gray-700 mb-2">❌ Habits to Break:</h3>
                        <p className="text-gray-800 bg-red-50 p-3 rounded-lg whitespace-pre-line">{categoryData.habitsBreak}</p>
                      </div>

                      <div>
                        <h3 className="font-semibold text-gray-700 mb-2">💡 Why This Matters:</h3>
                        <p className="text-gray-800 bg-blue-50 p-3 rounded-lg italic">{categoryData.why}</p>
                      </div>
                    </div>
                  </section>
                );
              })}
            </div>
          )}

          {/* Life Balance (Both Modes) */}
          {(placesArray.length > 0 || booksArray.length > 0 || experiencesArray.length > 0) && (
            <section className="border-t pt-10 mt-10">
              <h2 className="text-3xl font-bold text-gray-900 mb-6 text-center">
                Life Balance & Fun Stuff
              </h2>

              <div className="grid md:grid-cols-3 gap-6">
                {placesArray.length > 0 && (
                  <div>
                    <h3 className="font-bold text-lg text-gray-900 mb-3 flex items-center">
                      <span className="mr-2">🌍</span> Places to Visit
                    </h3>
                    <ul className="space-y-2">
                      {placesArray.map((place, i) => (
                        <li key={i} className="text-gray-700">• {place}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {booksArray.length > 0 && (
                  <div>
                    <h3 className="font-bold text-lg text-gray-900 mb-3 flex items-center">
                      <span className="mr-2">📚</span> Books to Read
                    </h3>
                    <ul className="space-y-2">
                      {booksArray.map((book, i) => (
                        <li key={i} className="text-gray-700">• {book}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {experiencesArray.length > 0 && (
                  <div>
                    <h3 className="font-bold text-lg text-gray-900 mb-3 flex items-center">
                      <span className="mr-2">✨</span> Experiences
                    </h3>
                    <ul className="space-y-2">
                      {experiencesArray.map((exp, i) => (
                        <li key={i} className="text-gray-700">• {exp}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </section>
          )}
        </div>

        {/* Email Capture */}
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl shadow-2xl p-8 md:p-12 text-white">
          <div className="text-center mb-8">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Unlock Your Free Journal Access
            </h2>
            <p className="text-xl text-indigo-100">
              Track these goals daily starting January 1st with <strong>1 month FREE</strong> Pro access
            </p>
          </div>

          <form onSubmit={handleSubmit} className="max-w-md mx-auto">
            <label htmlFor="email" className="block text-lg font-semibold mb-3">
              Enter your email to claim your free access:
            </label>
            <input
              id="email"
              type="email"
              value={localEmail}
              onChange={(e) => setLocalEmail(e.target.value)}
              placeholder="your@email.com"
              className="w-full px-6 py-4 text-lg text-gray-900 rounded-xl focus:outline-none focus:ring-4 focus:ring-white/50 mb-4"
              required
            />
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-white text-indigo-600 py-4 rounded-xl font-bold text-lg hover:bg-indigo-50 transition-all shadow-lg disabled:opacity-50"
            >
              {isSubmitting ? 'Saving...' : 'Claim My Free Journal Access →'}
            </button>
          </form>

          <div className="mt-8 text-center text-indigo-100 text-sm">
            <p>✓ No credit card required • ✓ Cancel anytime • ✓ Your data is safe</p>
          </div>
        </div>

        {/* Back Button */}
        <div className="text-center mt-8">
          <button
            onClick={() => router.back()}
            className="text-gray-600 hover:text-gray-900 underline"
          >
            ← Go back and edit
          </button>
        </div>
      </div>
    </div>
  );
}
