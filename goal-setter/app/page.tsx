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
        <div className="text-center mb-16">
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-4">
            Welcome, {displayName}!
          </h1>
          <p className="text-xl text-gray-700 max-w-2xl mx-auto">
            Let&apos;s plan your 2026. Choose your goal-setting journey:
          </p>
        </div>

        {/* Mode Selection Cards */}
        <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-8">
          {/* Quick Mode */}
          <div
            onClick={() => handleModeSelection('quick')}
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

        {/* Footer Note */}
        <div className="text-center mt-12">
          <p className="text-gray-600 text-sm">
            Don&apos;t worry - you can always come back and change your goals before January 1st
          </p>
        </div>
      </div>
    </div>
  );
}
