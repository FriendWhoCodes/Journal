'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useGoalSetter } from '@/lib/context/GoalSetterContext';
import { DeepModeCategory } from '@/lib/types';

const categories = [
  { id: 'health', name: 'Health & Fitness', icon: '💪', color: 'red' },
  { id: 'relationships', name: 'Relationships & Family', icon: '❤️', color: 'pink' },
  { id: 'wealth', name: 'Wealth & Finance', icon: '💰', color: 'green' },
  { id: 'career', name: 'Career & Work', icon: '💼', color: 'blue' },
  { id: 'growth', name: 'Personal Growth & Learning', icon: '📚', color: 'teal' },
  { id: 'impact', name: 'Contribution & Impact', icon: '🌟', color: 'yellow' },
];

export default function DeepMode() {
  const router = useRouter();
  const { name, deepModeData, updateDeepModeData } = useGoalSetter();
  const [step, setStep] = useState(1);
  const totalSteps = categories.length + 1; // 6 categories + life balance

  // Helper function to safely get category data
  const getCategoryData = (categoryId: string | null): DeepModeCategory | undefined => {
    if (!categoryId) return undefined;
    const data = deepModeData[categoryId as keyof typeof deepModeData];
    // Only return if it's a DeepModeCategory object (not a string)
    if (typeof data === 'object' && data !== null) {
      return data as DeepModeCategory;
    }
    return undefined;
  };

  // Current category data
  const currentCategoryId = step <= categories.length ? categories[step - 1].id : null;
  const currentData = getCategoryData(currentCategoryId);
  const [goal, setGoal] = useState(currentData?.goal || '');
  const [habitsBuild, setHabitsBuild] = useState(currentData?.habitsBuild || '');
  const [habitsBreak, setHabitsBreak] = useState(currentData?.habitsBreak || '');
  const [why, setWhy] = useState(currentData?.why || '');

  // Fun stuff data
  const [placesToVisit, setPlacesToVisit] = useState(deepModeData.placesToVisit || '');
  const [moviesToWatch, setMoviesToWatch] = useState(deepModeData.moviesToWatch || '');
  const [experiencesToHave, setExperiencesToHave] = useState(deepModeData.experiencesToHave || '');

  if (!name) {
    router.push('/');
    return null;
  }

  const handleCategorySubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Save current category data
    const categoryData: DeepModeCategory = {
      goal,
      habitsBuild,
      habitsBreak,
      why,
    };

    updateDeepModeData({
      [currentCategoryId as string]: categoryData,
    });

    // Move to next step
    if (step < totalSteps) {
      setStep(step + 1);
      // Load next category data if available
      if (step < categories.length) {
        const nextCategoryId = categories[step].id;
        const nextData = getCategoryData(nextCategoryId);
        setGoal(nextData?.goal || '');
        setHabitsBuild(nextData?.habitsBuild || '');
        setHabitsBreak(nextData?.habitsBreak || '');
        setWhy(nextData?.why || '');
      }
    }
  };

  const handleFunSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateDeepModeData({
      placesToVisit,
      moviesToWatch,
      experiencesToHave,
    });
    router.push('/summary');
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
      // Load previous category data
      if (step <= categories.length) {
        const prevCategoryId = categories[step - 2].id;
        const prevData = getCategoryData(prevCategoryId);
        setGoal(prevData?.goal || '');
        setHabitsBuild(prevData?.habitsBuild || '');
        setHabitsBreak(prevData?.habitsBreak || '');
        setWhy(prevData?.why || '');
      }
    }
  };

  const progressPercentage = Math.round((step / totalSteps) * 100);

  // Fun Stuff Page (Final Step)
  if (step === totalSteps) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-amber-50 py-8 px-4">
        <div className="max-w-3xl mx-auto">
          {/* Progress Bar */}
          <div className="mb-8">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium text-gray-700">Step {step} of {totalSteps}</span>
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
              Fun
            </h1>
            <p className="text-lg text-gray-600">
              Almost done! What do you want to experience in 2026?
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleFunSubmit} className="bg-white rounded-2xl shadow-xl p-8 md:p-10">
            {/* Places to Visit */}
            <div className="mb-8">
              <label className="block text-xl font-bold text-gray-900 mb-4">
                🌍 Places I want to visit in 2026
              </label>
              <textarea
                value={placesToVisit}
                onChange={(e) => setPlacesToVisit(e.target.value)}
                placeholder="List the places you want to explore (one per line)&#10;e.g.,&#10;Bali, Indonesia&#10;Swiss Alps&#10;Local hill stations"
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
                placeholder="List the movies or series you want to watch (one per line)&#10;e.g.,&#10;The Last of Us&#10;Oppenheimer&#10;Breaking Bad (rewatch)"
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
                placeholder="What experiences do you want to have? (one per line)&#10;e.g.,&#10;Learn to cook Italian cuisine&#10;Attend a music festival&#10;Volunteer at an NGO"
                className="w-full px-5 py-3 text-lg border-2 border-gray-200 rounded-xl focus:border-slate-500 focus:outline-none h-32 resize-none"
              />
            </div>

            <div className="flex gap-4">
              <button
                type="button"
                onClick={handleBack}
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

  // Category Pages (Steps 1-6)
  const currentCategory = categories[step - 1];
  const colorClasses = {
    red: { bg: 'bg-red-50', border: 'border-red-500', text: 'text-red-600', gradient: 'from-red-600 to-orange-600' },
    blue: { bg: 'bg-blue-50', border: 'border-blue-500', text: 'text-blue-600', gradient: 'from-blue-600 to-cyan-600' },
    green: { bg: 'bg-green-50', border: 'border-green-500', text: 'text-green-600', gradient: 'from-green-600 to-emerald-600' },
    pink: { bg: 'bg-pink-50', border: 'border-pink-500', text: 'text-pink-600', gradient: 'from-pink-600 to-rose-600' },
    teal: { bg: 'bg-teal-50', border: 'border-teal-500', text: 'text-teal-600', gradient: 'from-teal-600 to-cyan-600' },
    yellow: { bg: 'bg-yellow-50', border: 'border-yellow-500', text: 'text-yellow-600', gradient: 'from-yellow-600 to-orange-600' },
  };
  const colors = colorClasses[currentCategory.color as keyof typeof colorClasses];

  return (
    <div className={`min-h-screen bg-gradient-to-br ${colors.bg} via-white to-gray-50 py-8 px-4`}>
      <div className="max-w-3xl mx-auto">
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium text-gray-700">Category {step} of {categories.length}</span>
            <span className={`text-sm font-medium ${colors.text}`}>{progressPercentage}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className={`bg-gradient-to-r ${colors.gradient} h-2 rounded-full transition-all duration-300`}
              style={{ width: `${progressPercentage}%` }}
            />
          </div>
        </div>

        {/* Header */}
        <div className="text-center mb-8">
          <div className="text-6xl mb-4">{currentCategory.icon}</div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-3">
            {currentCategory.name}
          </h1>
          <p className="text-lg text-gray-600">
            Let&apos;s plan your {currentCategory.name.toLowerCase()} goals for 2026
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleCategorySubmit} className="bg-white rounded-2xl shadow-xl p-8 md:p-10">
          {/* Goal */}
          <div className="mb-8">
            <label className="block text-xl font-bold text-gray-900 mb-4">
              🎯 What&apos;s your #1 goal for {currentCategory.name.toLowerCase()} in 2026?
            </label>
            <textarea
              value={goal}
              onChange={(e) => setGoal(e.target.value)}
              placeholder={`e.g., ${
                currentCategory.id === 'health' ? 'Run a marathon, lose 10kg, or get stronger' :
                currentCategory.id === 'career' ? 'Get promoted, switch to dream job, or start business' :
                currentCategory.id === 'wealth' ? 'Save ₹5 lakhs, invest in stocks, or increase income' :
                currentCategory.id === 'relationships' ? 'Spend quality time with family, make new friends' :
                currentCategory.id === 'growth' ? 'Learn a new skill, read 50 books, master a language' :
                'Volunteer monthly, mentor someone, make positive impact'
              }`}
              className={`w-full px-5 py-3 text-lg border-2 border-gray-200 rounded-xl focus:${colors.border} focus:outline-none h-24 resize-none`}
              required
            />
          </div>

          {/* Habits to Build */}
          <div className="mb-8">
            <label className="block text-xl font-bold text-gray-900 mb-4">
              ✅ What habits will you BUILD to achieve this goal?
            </label>
            <textarea
              value={habitsBuild}
              onChange={(e) => setHabitsBuild(e.target.value)}
              placeholder="List the positive habits you'll develop (one per line)"
              className={`w-full px-5 py-3 text-lg border-2 border-gray-200 rounded-xl focus:${colors.border} focus:outline-none h-24 resize-none`}
              required
            />
          </div>

          {/* Habits to Break */}
          <div className="mb-8">
            <label className="block text-xl font-bold text-gray-900 mb-4">
              ❌ What habits will you BREAK to achieve this goal?
            </label>
            <textarea
              value={habitsBreak}
              onChange={(e) => setHabitsBreak(e.target.value)}
              placeholder="List the habits you need to eliminate (one per line)"
              className={`w-full px-5 py-3 text-lg border-2 border-gray-200 rounded-xl focus:${colors.border} focus:outline-none h-24 resize-none`}
              required
            />
          </div>

          {/* Why */}
          <div className="mb-8">
            <label className="block text-xl font-bold text-gray-900 mb-4">
              💡 Why is this important to you?
            </label>
            <textarea
              value={why}
              onChange={(e) => setWhy(e.target.value)}
              placeholder="Your deep reason for wanting this goal..."
              className={`w-full px-5 py-3 text-lg border-2 border-gray-200 rounded-xl focus:${colors.border} focus:outline-none h-32 resize-none`}
              required
            />
            <p className="mt-2 text-sm text-gray-500">
              This will keep you motivated when things get tough
            </p>
          </div>

          <div className="flex gap-4">
            {step > 1 && (
              <button
                type="button"
                onClick={handleBack}
                className="flex-1 bg-gray-200 text-gray-700 py-4 rounded-xl font-semibold text-lg hover:bg-gray-300 transition-all"
              >
                ← Back
              </button>
            )}
            <button
              type="submit"
              className={`flex-1 bg-gradient-to-r ${colors.gradient} text-white py-4 rounded-xl font-semibold text-lg hover:opacity-90 transition-all shadow-lg`}
            >
              {step < categories.length ? `Next: ${categories[step].name} →` : 'Continue to Fun →'}
            </button>
          </div>
        </form>

        {/* Category Progress Indicator */}
        <div className="mt-8 flex justify-center gap-2">
          {categories.map((cat, idx) => (
            <div
              key={cat.id}
              className={`w-3 h-3 rounded-full transition-all ${
                idx < step ? 'bg-gradient-to-r ' + colors.gradient : 'bg-gray-300'
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
