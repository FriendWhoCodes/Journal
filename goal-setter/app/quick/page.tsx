'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useGoalSetter } from '@/lib/context/GoalSetterContext';

export default function QuickMode() {
  const router = useRouter();
  const { name, quickModeData, updateQuickModeData } = useGoalSetter();
  const [step, setStep] = useState(1);

  // Form state
  const [goal1, setGoal1] = useState(quickModeData.topGoals?.[0] || '');
  const [goal2, setGoal2] = useState(quickModeData.topGoals?.[1] || '');
  const [goal3, setGoal3] = useState(quickModeData.topGoals?.[2] || '');
  const [habitToBuild, setHabitToBuild] = useState(quickModeData.habitToBuild || '');
  const [habitToBreak, setHabitToBreak] = useState(quickModeData.habitToBreak || '');
  const [mainTheme, setMainTheme] = useState(quickModeData.mainTheme || '');

  const [placesToVisit, setPlacesToVisit] = useState(quickModeData.placesToVisit || '');
  const [booksToRead, setBooksToRead] = useState(quickModeData.booksToRead || '');
  const [experiencesToHave, setExperiencesToHave] = useState(quickModeData.experiencesToHave || '');

  if (!name) {
    router.push('/');
    return null;
  }

  const handleStep1Continue = (e: React.FormEvent) => {
    e.preventDefault();
    if (goal1 && goal2 && goal3 && habitToBuild && habitToBreak && mainTheme) {
      updateQuickModeData({
        topGoals: [goal1, goal2, goal3] as [string, string, string],
        habitToBuild,
        habitToBreak,
        mainTheme,
      });
      setStep(2);
    }
  };

  const handleStep2Continue = (e: React.FormEvent) => {
    e.preventDefault();
    updateQuickModeData({
      placesToVisit,
      booksToRead,
      experiencesToHave,
    });
    router.push('/summary');
  };

  const progressPercentage = step === 1 ? 50 : 100;

  if (step === 1) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 py-8 px-4">
        <div className="max-w-3xl mx-auto">
          {/* Progress Bar */}
          <div className="mb-8">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium text-gray-700">Step {step} of 2</span>
              <span className="text-sm font-medium text-indigo-600">{progressPercentage}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-gradient-to-r from-indigo-600 to-purple-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${progressPercentage}%` }}
              />
            </div>
          </div>

          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-3">
              Core Goals for 2026
            </h1>
            <p className="text-lg text-gray-600">
              Hey {name}, let&apos;s define what matters most to you this year
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleStep1Continue} className="bg-white rounded-2xl shadow-xl p-8 md:p-10">
            {/* Top 3 Goals */}
            <div className="mb-8">
              <label className="block text-xl font-bold text-gray-900 mb-4">
                🎯 What are the top 3 things you want to achieve in 2026?
              </label>
              <div className="space-y-4">
                <input
                  type="text"
                  value={goal1}
                  onChange={(e) => setGoal1(e.target.value)}
                  placeholder="Goal #1 (e.g., Launch my SaaS product)"
                  className="w-full px-5 py-3 text-lg border-2 border-gray-200 rounded-xl focus:border-indigo-500 focus:outline-none"
                  required
                />
                <input
                  type="text"
                  value={goal2}
                  onChange={(e) => setGoal2(e.target.value)}
                  placeholder="Goal #2 (e.g., Run a marathon)"
                  className="w-full px-5 py-3 text-lg border-2 border-gray-200 rounded-xl focus:border-indigo-500 focus:outline-none"
                  required
                />
                <input
                  type="text"
                  value={goal3}
                  onChange={(e) => setGoal3(e.target.value)}
                  placeholder="Goal #3 (e.g., Learn Spanish)"
                  className="w-full px-5 py-3 text-lg border-2 border-gray-200 rounded-xl focus:border-indigo-500 focus:outline-none"
                  required
                />
              </div>
            </div>

            {/* Habit to Build */}
            <div className="mb-8">
              <label className="block text-xl font-bold text-gray-900 mb-4">
                ✅ What&apos;s the #1 habit you want to BUILD in 2026?
              </label>
              <input
                type="text"
                value={habitToBuild}
                onChange={(e) => setHabitToBuild(e.target.value)}
                placeholder="e.g., Exercise 5x/week, Meditate daily, Read 30 min/day"
                className="w-full px-5 py-3 text-lg border-2 border-gray-200 rounded-xl focus:border-indigo-500 focus:outline-none"
                required
              />
            </div>

            {/* Habit to Break */}
            <div className="mb-8">
              <label className="block text-xl font-bold text-gray-900 mb-4">
                ❌ What&apos;s the #1 habit you want to BREAK in 2026?
              </label>
              <input
                type="text"
                value={habitToBreak}
                onChange={(e) => setHabitToBreak(e.target.value)}
                placeholder="e.g., Stop doomscrolling, Quit sugar, No phone in bed"
                className="w-full px-5 py-3 text-lg border-2 border-gray-200 rounded-xl focus:border-indigo-500 focus:outline-none"
                required
              />
            </div>

            {/* Main Theme */}
            <div className="mb-8">
              <label className="block text-xl font-bold text-gray-900 mb-4">
                💡 What&apos;s the main idea or theme you want to embody in 2026?
              </label>
              <input
                type="text"
                value={mainTheme}
                onChange={(e) => setMainTheme(e.target.value)}
                placeholder="e.g., Consistency over intensity, Less talk more action"
                className="w-full px-5 py-3 text-lg border-2 border-gray-200 rounded-xl focus:border-indigo-500 focus:outline-none"
                required
              />
              <p className="mt-2 text-sm text-gray-500">
                This will be your guiding principle for the year
              </p>
            </div>

            <button
              type="submit"
              className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-4 rounded-xl font-semibold text-lg hover:from-indigo-700 hover:to-purple-700 transition-all shadow-lg"
            >
              Continue to Life Balance →
            </button>
          </form>
        </div>
      </div>
    );
  }

  // Step 2: Life Balance
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 py-8 px-4">
      <div className="max-w-3xl mx-auto">
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium text-gray-700">Step {step} of 2</span>
            <span className="text-sm font-medium text-indigo-600">{progressPercentage}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-gradient-to-r from-indigo-600 to-purple-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${progressPercentage}%` }}
            />
          </div>
        </div>

        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-3">
            Life Balance & Fun Stuff
          </h1>
          <p className="text-lg text-gray-600">
            Life isn&apos;t just about work - what do you want to experience in 2026?
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleStep2Continue} className="bg-white rounded-2xl shadow-xl p-8 md:p-10">
          {/* Places to Visit */}
          <div className="mb-8">
            <label className="block text-xl font-bold text-gray-900 mb-4">
              🌍 Places I want to visit in 2026
            </label>
            <textarea
              value={placesToVisit}
              onChange={(e) => setPlacesToVisit(e.target.value)}
              placeholder="List the places you want to explore (one per line)&#10;e.g.,&#10;Bali, Indonesia&#10;Swiss Alps&#10;Local hill stations"
              className="w-full px-5 py-3 text-lg border-2 border-gray-200 rounded-xl focus:border-indigo-500 focus:outline-none h-32 resize-none"
            />
          </div>

          {/* Books to Read */}
          <div className="mb-8">
            <label className="block text-xl font-bold text-gray-900 mb-4">
              📚 Books I want to read in 2026
            </label>
            <textarea
              value={booksToRead}
              onChange={(e) => setBooksToRead(e.target.value)}
              placeholder="List the books you want to read (one per line)&#10;e.g.,&#10;Atomic Habits&#10;The Almanack of Naval Ravikant&#10;Deep Work"
              className="w-full px-5 py-3 text-lg border-2 border-gray-200 rounded-xl focus:border-indigo-500 focus:outline-none h-32 resize-none"
            />
          </div>

          {/* Experiences to Have */}
          <div className="mb-8">
            <label className="block text-xl font-bold text-gray-900 mb-4">
              ✨ Experiences I want to create in 2026
            </label>
            <textarea
              value={experiencesToHave}
              onChange={(e) => setExperiencesToHave(e.target.value)}
              placeholder="What experiences do you want to have? (one per line)&#10;e.g.,&#10;Learn to cook Italian cuisine&#10;Attend a music festival&#10;Volunteer at an NGO"
              className="w-full px-5 py-3 text-lg border-2 border-gray-200 rounded-xl focus:border-indigo-500 focus:outline-none h-32 resize-none"
            />
          </div>

          <div className="flex gap-4">
            <button
              type="button"
              onClick={() => setStep(1)}
              className="flex-1 bg-gray-200 text-gray-700 py-4 rounded-xl font-semibold text-lg hover:bg-gray-300 transition-all"
            >
              ← Back
            </button>
            <button
              type="submit"
              className="flex-1 bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-4 rounded-xl font-semibold text-lg hover:from-indigo-700 hover:to-purple-700 transition-all shadow-lg"
            >
              See My 2026 Blueprint →
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
