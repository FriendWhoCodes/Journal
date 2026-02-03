'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useGoalSetter } from '@/lib/context/GoalSetterContext';
import { useAuth } from '@mow/auth';

export default function Home() {
  const router = useRouter();
  const { setName, setEmail, setMode } = useGoalSetter();
  const { user } = useAuth();

  // Populate GoalSetterContext with auth user data
  useEffect(() => {
    if (user) {
      setName(user.name || '');
      setEmail(user.email);
    }
  }, [user]);

  const handleModeSelection = (mode: 'quick' | 'deep') => {
    setMode(mode);
    router.push(mode === 'quick' ? '/quick' : '/deep');
  };

  const displayName = user?.name || 'there';

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-amber-50">
      <div className="container mx-auto px-4 py-16">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-4">
            Welcome, {displayName}!
          </h1>
          <p className="text-xl text-gray-700 max-w-2xl mx-auto">
            Let&apos;s plan your 2026. Choose your goal-setting journey:
          </p>
        </div>

        {/* Free Modes Section */}
        <div className="max-w-5xl mx-auto mb-12">
          <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-4 text-center">
            Free
          </h3>
          <div className="grid md:grid-cols-2 gap-8">
            {/* Quick Mode */}
            <div
              onClick={() => handleModeSelection('quick')}
              onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); handleModeSelection('quick'); } }}
              role="button"
              tabIndex={0}
              className="bg-white rounded-2xl shadow-lg p-8 cursor-pointer transform transition-all duration-300 hover:scale-105 hover:shadow-2xl border-2 border-transparent hover:border-amber-500"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-3xl font-bold text-slate-800">Quick Mode</h2>
                <div className="bg-amber-100 text-amber-800 px-4 py-2 rounded-full text-sm font-semibold">
                  ~5 minutes
                </div>
              </div>

              <p className="text-gray-700 mb-6 text-lg">
                Perfect for busy people who want to get started fast.
              </p>

              <ul className="space-y-3 mb-8">
                <li className="flex items-start">
                  <span className="text-amber-600 mr-2 text-xl">•</span>
                  <span className="text-gray-700">Set your top 3 goals for 2026</span>
                </li>
                <li className="flex items-start">
                  <span className="text-amber-600 mr-2 text-xl">•</span>
                  <span className="text-gray-700">Choose 1 habit to build & 1 to break</span>
                </li>
                <li className="flex items-start">
                  <span className="text-amber-600 mr-2 text-xl">•</span>
                  <span className="text-gray-700">Define your theme for the year</span>
                </li>
                <li className="flex items-start">
                  <span className="text-amber-600 mr-2 text-xl">•</span>
                  <span className="text-gray-700">Plan your travel, books & experiences</span>
                </li>
              </ul>

              <button className="w-full bg-amber-600 text-white py-4 rounded-xl font-semibold text-lg hover:bg-amber-700 transition-colors">
                Start Quick Setup →
              </button>
            </div>

            {/* Deep Mode */}
            <div
              onClick={() => handleModeSelection('deep')}
              onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); handleModeSelection('deep'); } }}
              role="button"
              tabIndex={0}
              className="bg-white rounded-2xl shadow-lg p-8 cursor-pointer transform transition-all duration-300 hover:scale-105 hover:shadow-2xl border-2 border-transparent hover:border-slate-500"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-3xl font-bold text-slate-800">Deep Mode</h2>
                <div className="bg-slate-100 text-slate-800 px-4 py-2 rounded-full text-sm font-semibold">
                  ~30 minutes
                </div>
              </div>

              <p className="text-gray-700 mb-6 text-lg">
                For those who want comprehensive life planning across all areas.
              </p>

              <ul className="space-y-3 mb-8">
                <li className="flex items-start">
                  <span className="text-slate-600 mr-2 text-xl">•</span>
                  <span className="text-gray-700">Deep dive into 6 life categories</span>
                </li>
                <li className="flex items-start">
                  <span className="text-slate-600 mr-2 text-xl">•</span>
                  <span className="text-gray-700">Health, Career, Wealth & Relationships</span>
                </li>
                <li className="flex items-start">
                  <span className="text-slate-600 mr-2 text-xl">•</span>
                  <span className="text-gray-700">Personal Growth & Impact goals</span>
                </li>
                <li className="flex items-start">
                  <span className="text-slate-600 mr-2 text-xl">•</span>
                  <span className="text-gray-700">Detailed habit planning for each area</span>
                </li>
              </ul>

              <button className="w-full bg-slate-700 text-white py-4 rounded-xl font-semibold text-lg hover:bg-slate-800 transition-colors">
                Start Deep Planning →
              </button>
            </div>
          </div>
        </div>

        {/* Premium Modes Section */}
        <div className="max-w-5xl mx-auto">
          <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-4 text-center">
            Premium
          </h3>
          <div className="grid md:grid-cols-2 gap-8">
            {/* Priority Mode - Coming Soon */}
            <div className="bg-white rounded-2xl shadow-lg p-8 border-2 border-gray-200 opacity-60 relative">
              <div className="absolute top-4 right-4">
                <span className="bg-indigo-100 text-indigo-700 px-3 py-1 rounded-full text-xs font-semibold">
                  Coming Soon
                </span>
              </div>

              <div className="flex items-center justify-between mb-6">
                <h2 className="text-3xl font-bold text-slate-800">Priority Mode</h2>
                <div className="bg-indigo-100 text-indigo-800 px-4 py-2 rounded-full text-sm font-semibold">
                  ~1 hour
                </div>
              </div>

              <p className="text-gray-700 mb-6 text-lg">
                Define your top priorities first. Goals become a natural extension.
              </p>

              <ul className="space-y-3 mb-8">
                <li className="flex items-start">
                  <span className="text-indigo-600 mr-2 text-xl">•</span>
                  <span className="text-gray-700">Define your top 3-10 life priorities</span>
                </li>
                <li className="flex items-start">
                  <span className="text-indigo-600 mr-2 text-xl">•</span>
                  <span className="text-gray-700">Set goals for each priority</span>
                </li>
                <li className="flex items-start">
                  <span className="text-indigo-600 mr-2 text-xl">•</span>
                  <span className="text-gray-700">Quarterly breakdown (Q1-Q4)</span>
                </li>
                <li className="flex items-start">
                  <span className="text-indigo-600 mr-2 text-xl">•</span>
                  <span className="text-gray-700">PDF + printable infographic + phone/desktop wallpaper</span>
                </li>
              </ul>

              <div className="w-full bg-gray-300 text-gray-500 py-4 rounded-xl font-semibold text-lg text-center cursor-not-allowed">
                $9.99 - Coming Soon
              </div>
            </div>

            {/* Priority + Personal Analysis Mode - Coming Soon */}
            <div className="bg-white rounded-2xl shadow-lg p-8 border-2 border-gray-200 opacity-60 relative">
              <div className="absolute top-4 right-4">
                <span className="bg-emerald-100 text-emerald-700 px-3 py-1 rounded-full text-xs font-semibold">
                  Coming Soon
                </span>
              </div>

              <div className="flex items-center justify-between mb-6">
                <h2 className="text-3xl font-bold text-slate-800">Priority + Wisdom</h2>
                <div className="bg-emerald-100 text-emerald-800 px-4 py-2 rounded-full text-sm font-semibold">
                  ~1 hour
                </div>
              </div>

              <p className="text-gray-700 mb-6 text-lg">
                Everything in Priority Mode, plus personalized guidance.
              </p>

              <ul className="space-y-3 mb-8">
                <li className="flex items-start">
                  <span className="text-emerald-600 mr-2 text-xl">•</span>
                  <span className="text-gray-700">All Priority Mode features included</span>
                </li>
                <li className="flex items-start">
                  <span className="text-emerald-600 mr-2 text-xl">•</span>
                  <span className="text-gray-700">Personal feedback from Man of Wisdom</span>
                </li>
                <li className="flex items-start">
                  <span className="text-emerald-600 mr-2 text-xl">•</span>
                  <span className="text-gray-700">Analysis of your priorities & goals</span>
                </li>
                <li className="flex items-start">
                  <span className="text-emerald-600 mr-2 text-xl">•</span>
                  <span className="text-gray-700">Suggestions to refine your direction</span>
                </li>
              </ul>

              <div className="w-full bg-gray-300 text-gray-500 py-4 rounded-xl font-semibold text-lg text-center cursor-not-allowed">
                $29.99 - Coming Soon
              </div>
            </div>
          </div>
        </div>

        {/* Footer Note */}
        <div className="text-center mt-12">
          <p className="text-gray-600 text-sm">
            Don&apos;t worry - you can always come back and change your goals anytime
          </p>
        </div>
      </div>
    </div>
  );
}
