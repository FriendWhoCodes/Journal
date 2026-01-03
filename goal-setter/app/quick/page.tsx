'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useGoalSetter } from '@/lib/context/GoalSetterContext';
import { HABITS_TO_BUILD, HABITS_TO_BREAK } from '@/lib/constants';

export default function QuickMode() {
  const router = useRouter();
  const { name, quickModeData, updateQuickModeData } = useGoalSetter();
  const [step, setStep] = useState(1);

  // Form state
  const [goal1, setGoal1] = useState(quickModeData.topGoals?.[0] || '');
  const [goal2, setGoal2] = useState(quickModeData.topGoals?.[1] || '');
  const [goal3, setGoal3] = useState(quickModeData.topGoals?.[2] || '');
  const [habitsToBuildSelected, setHabitsToBuildSelected] = useState<string[]>(quickModeData.habitsToBuild || []);
  const [habitsToBreakSelected, setHabitsToBreakSelected] = useState<string[]>(quickModeData.habitsToBreak || []);
  const [customHabitBuild, setCustomHabitBuild] = useState('');
  const [customHabitBreak, setCustomHabitBreak] = useState('');
  const [mainTheme, setMainTheme] = useState(quickModeData.mainTheme || '');

  const [placesToVisit, setPlacesToVisit] = useState(quickModeData.placesToVisit || '');
  const [booksToRead, setBooksToRead] = useState(quickModeData.booksToRead || '');
  const [moviesToWatch, setMoviesToWatch] = useState(quickModeData.moviesToWatch || '');
  const [experiencesToHave, setExperiencesToHave] = useState(quickModeData.experiencesToHave || '');

  if (!name) {
    router.push('/');
    return null;
  }

  // Handle habit checkbox toggle
  const toggleHabitBuild = (habit: string) => {
    setHabitsToBuildSelected(prev =>
      prev.includes(habit) ? prev.filter(h => h !== habit) : [...prev, habit]
    );
  };

  const toggleHabitBreak = (habit: string) => {
    setHabitsToBreakSelected(prev =>
      prev.includes(habit) ? prev.filter(h => h !== habit) : [...prev, habit]
    );
  };

  // Add custom habit
  const addCustomHabitBuild = () => {
    if (customHabitBuild.trim()) {
      setHabitsToBuildSelected([...habitsToBuildSelected, customHabitBuild.trim()]);
      setCustomHabitBuild('');
    }
  };

  const addCustomHabitBreak = () => {
    if (customHabitBreak.trim()) {
      setHabitsToBreakSelected([...habitsToBreakSelected, customHabitBreak.trim()]);
      setCustomHabitBreak('');
    }
  };

  const handleStep1Continue = (e: React.FormEvent) => {
    e.preventDefault();
    if (goal1 && goal2 && goal3 && habitsToBuildSelected.length > 0 && habitsToBreakSelected.length > 0 && mainTheme) {
      updateQuickModeData({
        topGoals: [goal1, goal2, goal3] as [string, string, string],
        habitsToBuild: habitsToBuildSelected,
        habitsToBreak: habitsToBreakSelected,
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
      moviesToWatch,
      experiencesToHave,
    });
    router.push('/summary');
  };

  const progressPercentage = step === 1 ? 50 : 100;

  if (step === 1) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-amber-50 py-8 px-4">
        <div className="max-w-3xl mx-auto">
          {/* Progress Bar */}
          <div className="mb-8">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium text-gray-700">Step {step} of 2</span>
              <span className="text-sm font-medium text-slate-700">{progressPercentage}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-gradient-to-r from-slate-700 to-amber-600 h-2 rounded-full transition-all duration-300"
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
                  className="w-full px-5 py-3 text-lg border-2 border-gray-200 rounded-xl focus:border-slate-500 focus:outline-none"
                  required
                />
                <input
                  type="text"
                  value={goal2}
                  onChange={(e) => setGoal2(e.target.value)}
                  placeholder="Goal #2 (e.g., Run a marathon)"
                  className="w-full px-5 py-3 text-lg border-2 border-gray-200 rounded-xl focus:border-slate-500 focus:outline-none"
                  required
                />
                <input
                  type="text"
                  value={goal3}
                  onChange={(e) => setGoal3(e.target.value)}
                  placeholder="Goal #3 (e.g., Learn Spanish)"
                  className="w-full px-5 py-3 text-lg border-2 border-gray-200 rounded-xl focus:border-slate-500 focus:outline-none"
                  required
                />
              </div>
            </div>

            {/* Habits to Build */}
            <div className="mb-8">
              <h2 className="text-xl font-bold text-gray-900 mb-1">
                ✅ Keystone Habits to Build
              </h2>
              <p className="text-sm text-gray-600 mb-3">
                Habits that improve multiple aspects of your life (like sleep, exercise, nutrition, meditation)
              </p>
              <div className="space-y-2 mb-3">
                {HABITS_TO_BUILD.map((habit) => (
                  <label key={habit} className="flex items-center space-x-2.5 p-2 rounded-lg hover:bg-gray-50 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={habitsToBuildSelected.includes(habit)}
                      onChange={() => toggleHabitBuild(habit)}
                      className="w-4 h-4 text-slate-600 rounded focus:ring-slate-500"
                    />
                    <span className="text-sm text-gray-800">{habit}</span>
                  </label>
                ))}
                {/* Custom habits */}
                {habitsToBuildSelected.filter(h => !HABITS_TO_BUILD.includes(h)).map((habit, i) => (
                  <label key={`custom-${i}`} className="flex items-center space-x-2.5 p-2 rounded-lg bg-amber-50">
                    <input
                      type="checkbox"
                      checked={true}
                      onChange={() => setHabitsToBuildSelected(habitsToBuildSelected.filter(h => h !== habit))}
                      className="w-4 h-4 text-slate-600 rounded focus:ring-slate-500"
                    />
                    <span className="text-sm text-gray-800">{habit}</span>
                  </label>
                ))}
              </div>
              {/* Add custom habit */}
              <div className="flex gap-2">
                <input
                  type="text"
                  value={customHabitBuild}
                  onChange={(e) => setCustomHabitBuild(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addCustomHabitBuild())}
                  placeholder="Add your own habit..."
                  className="flex-1 px-3 py-2 text-sm border-2 border-gray-200 rounded-lg focus:border-slate-500 focus:outline-none"
                />
                <button
                  type="button"
                  onClick={addCustomHabitBuild}
                  className="px-3 py-2 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 text-sm font-medium"
                >
                  + Add
                </button>
              </div>
            </div>

            {/* Habits to Break */}
            <div className="mb-8">
              <h2 className="text-xl font-bold text-gray-900 mb-3">
                ❌ Habits to Break
              </h2>
              <div className="space-y-2 mb-3">
                {HABITS_TO_BREAK.map((habit) => (
                  <label key={habit} className="flex items-center space-x-2.5 p-2 rounded-lg hover:bg-gray-50 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={habitsToBreakSelected.includes(habit)}
                      onChange={() => toggleHabitBreak(habit)}
                      className="w-4 h-4 text-slate-600 rounded focus:ring-slate-500"
                    />
                    <span className="text-sm text-gray-800">{habit}</span>
                  </label>
                ))}
                {/* Custom habits */}
                {habitsToBreakSelected.filter(h => !HABITS_TO_BREAK.includes(h)).map((habit, i) => (
                  <label key={`custom-${i}`} className="flex items-center space-x-2.5 p-2 rounded-lg bg-red-50">
                    <input
                      type="checkbox"
                      checked={true}
                      onChange={() => setHabitsToBreakSelected(habitsToBreakSelected.filter(h => h !== habit))}
                      className="w-4 h-4 text-slate-600 rounded focus:ring-slate-500"
                    />
                    <span className="text-sm text-gray-800">{habit}</span>
                  </label>
                ))}
              </div>
              {/* Add custom habit */}
              <div className="flex gap-2">
                <input
                  type="text"
                  value={customHabitBreak}
                  onChange={(e) => setCustomHabitBreak(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addCustomHabitBreak())}
                  placeholder="Add your own habit to break..."
                  className="flex-1 px-3 py-2 text-sm border-2 border-gray-200 rounded-lg focus:border-slate-500 focus:outline-none"
                />
                <button
                  type="button"
                  onClick={addCustomHabitBreak}
                  className="px-3 py-2 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 text-sm font-medium"
                >
                  + Add
                </button>
              </div>
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
              className="w-full bg-gradient-to-r from-slate-700 to-amber-600 text-white py-4 rounded-xl font-semibold text-lg hover:from-slate-800 hover:to-amber-700 transition-all shadow-lg"
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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-amber-50 py-8 px-4">
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
            Fun
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
              placeholder="• Bali, Indonesia&#10;• Swiss Alps&#10;• Local hill stations"
              className="w-full px-5 py-3 text-lg border-2 border-gray-200 rounded-xl focus:border-slate-500 focus:outline-none h-32 resize-none"
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
              placeholder="• Atomic Habits&#10;• The Almanack of Naval Ravikant&#10;• Deep Work"
              className="w-full px-5 py-3 text-lg border-2 border-gray-200 rounded-xl focus:border-slate-500 focus:outline-none h-32 resize-none"
            />
          </div>

          {/* Movies/Series to Watch */}
          <div className="mb-8">
            <label className="block text-xl font-bold text-gray-900 mb-4">
              🎬 Movies/Series I want to watch in 2026
            </label>
            <textarea
              value={moviesToWatch}
              onChange={(e) => setMoviesToWatch(e.target.value)}
              placeholder="• The Last of Us&#10;• Oppenheimer&#10;• Breaking Bad (rewatch)"
              className="w-full px-5 py-3 text-lg border-2 border-gray-200 rounded-xl focus:border-slate-500 focus:outline-none h-32 resize-none"
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
              placeholder="• Learn to cook Italian cuisine&#10;• Attend a music festival&#10;• Volunteer at an NGO"
              className="w-full px-5 py-3 text-lg border-2 border-gray-200 rounded-xl focus:border-slate-500 focus:outline-none h-32 resize-none"
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
              className="flex-1 bg-gradient-to-r from-slate-700 to-amber-600 text-white py-4 rounded-xl font-semibold text-lg hover:from-slate-800 hover:to-amber-700 transition-all shadow-lg"
            >
              See My 2026 Blueprint →
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
