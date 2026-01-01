'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useGoalSetter } from '@/lib/context/GoalSetterContext';
import { DeepModeCategory } from '@/lib/types';
import { HABITS_TO_BUILD, HABITS_TO_BREAK } from '@/lib/constants';

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
  const totalSteps = 1 + categories.length + 1; // Overall + 6 categories + Fun

  // Panel 1: Overall Goals & Habits state
  const [goal1, setGoal1] = useState(deepModeData.topGoals?.[0] || '');
  const [goal2, setGoal2] = useState(deepModeData.topGoals?.[1] || '');
  const [goal3, setGoal3] = useState(deepModeData.topGoals?.[2] || '');
  const [habitsToBuildSelected, setHabitsToBuildSelected] = useState<string[]>(deepModeData.habitsToBuild || []);
  const [habitsToBreakSelected, setHabitsToBreakSelected] = useState<string[]>(deepModeData.habitsToBreak || []);
  const [customHabitBuild, setCustomHabitBuild] = useState('');
  const [customHabitBreak, setCustomHabitBreak] = useState('');
  const [mainTheme, setMainTheme] = useState(deepModeData.mainTheme || '');

  // Helper function to get category data
  const getCategoryData = (categoryId: string): DeepModeCategory | undefined => {
    const data = deepModeData[categoryId as keyof typeof deepModeData];
    if (typeof data === 'object' && data !== null && 'goal' in data) {
      return data as DeepModeCategory;
    }
    return undefined;
  };

  // Category state (for steps 2-7)
  const currentCategoryIndex = step - 2; // -2 because step 1 is overall
  const currentCategory = currentCategoryIndex >= 0 && currentCategoryIndex < categories.length
    ? categories[currentCategoryIndex]
    : null;
  const currentCategoryData = currentCategory ? getCategoryData(currentCategory.id) : undefined;
  const [categoryGoal, setCategoryGoal] = useState(currentCategoryData?.goal || '');
  const [categoryWhy, setCategoryWhy] = useState(currentCategoryData?.why || '');

  // Fun state (step 8)
  const [placesToVisit, setPlacesToVisit] = useState(deepModeData.placesToVisit || '');
  const [booksToRead, setBooksToRead] = useState(deepModeData.booksToRead || '');
  const [moviesToWatch, setMoviesToWatch] = useState(deepModeData.moviesToWatch || '');
  const [experiencesToHave, setExperiencesToHave] = useState(deepModeData.experiencesToHave || '');

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

  // Panel 1: Overall Goals & Habits submit
  const handleOverallSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateDeepModeData({
      topGoals: [goal1, goal2, goal3] as [string, string, string],
      habitsToBuild: habitsToBuildSelected,
      habitsToBreak: habitsToBreakSelected,
      mainTheme,
    });
    setStep(2);
  };

  // Category submit (steps 2-7)
  const handleCategorySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentCategory) return;

    const categoryData: DeepModeCategory = {
      goal: categoryGoal,
      why: categoryWhy,
    };

    updateDeepModeData({
      [currentCategory.id]: categoryData,
    });

    // Move to next step
    if (step < totalSteps) {
      setStep(step + 1);
      // Load next category data if moving to another category
      if (step < 1 + categories.length) {
        const nextCategory = categories[step - 1];
        const nextData = getCategoryData(nextCategory.id);
        setCategoryGoal(nextData?.goal || '');
        setCategoryWhy(nextData?.why || '');
      }
    }
  };

  // Fun submit (step 8)
  const handleFunSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateDeepModeData({
      placesToVisit,
      booksToRead,
      moviesToWatch,
      experiencesToHave,
    });
    router.push('/summary');
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
      // Load previous category data if going back to a category
      if (step > 2 && step <= 1 + categories.length) {
        const prevCategory = categories[step - 3];
        const prevData = getCategoryData(prevCategory.id);
        setCategoryGoal(prevData?.goal || '');
        setCategoryWhy(prevData?.why || '');
      }
    }
  };

  const progressPercentage = Math.round((step / totalSteps) * 100);

  // Panel 1: Overall Goals & Habits
  if (step === 1) {
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
              Your 2026 Goals & Habits
            </h1>
            <p className="text-lg text-gray-600">
              Let's start with your top goals and the habits that will help you achieve them
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleOverallSubmit} className="bg-white rounded-2xl shadow-xl p-8 md:p-10">
            {/* Top 3 Goals */}
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                🎯 Your Top 3 Goals for 2026
              </h2>
              <div className="space-y-4">
                <input
                  type="text"
                  value={goal1}
                  onChange={(e) => setGoal1(e.target.value)}
                  placeholder="1. Example: Run a marathon"
                  className="w-full px-5 py-3 text-lg border-2 border-gray-200 rounded-xl focus:border-slate-500 focus:outline-none"
                  required
                />
                <input
                  type="text"
                  value={goal2}
                  onChange={(e) => setGoal2(e.target.value)}
                  placeholder="2. Example: Launch my side project"
                  className="w-full px-5 py-3 text-lg border-2 border-gray-200 rounded-xl focus:border-slate-500 focus:outline-none"
                  required
                />
                <input
                  type="text"
                  value={goal3}
                  onChange={(e) => setGoal3(e.target.value)}
                  placeholder="3. Example: Read 24 books"
                  className="w-full px-5 py-3 text-lg border-2 border-gray-200 rounded-xl focus:border-slate-500 focus:outline-none"
                  required
                />
              </div>
            </div>

            {/* Habits to Build */}
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                ✅ Habits to Build
              </h2>
              <div className="space-y-3 mb-4">
                {HABITS_TO_BUILD.map((habit) => (
                  <label key={habit} className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={habitsToBuildSelected.includes(habit)}
                      onChange={() => toggleHabitBuild(habit)}
                      className="w-5 h-5 text-slate-600 rounded focus:ring-slate-500"
                    />
                    <span className="text-gray-800">{habit}</span>
                  </label>
                ))}
                {/* Custom habits */}
                {habitsToBuildSelected.filter(h => !HABITS_TO_BUILD.includes(h)).map((habit, i) => (
                  <label key={`custom-${i}`} className="flex items-center space-x-3 p-3 rounded-lg bg-amber-50">
                    <input
                      type="checkbox"
                      checked={true}
                      onChange={() => setHabitsToBuildSelected(habitsToBuildSelected.filter(h => h !== habit))}
                      className="w-5 h-5 text-slate-600 rounded focus:ring-slate-500"
                    />
                    <span className="text-gray-800">{habit}</span>
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
                  className="flex-1 px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-slate-500 focus:outline-none"
                />
                <button
                  type="button"
                  onClick={addCustomHabitBuild}
                  className="px-6 py-2 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 font-medium"
                >
                  + Add
                </button>
              </div>
            </div>

            {/* Habits to Break */}
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                ❌ Habits to Break
              </h2>
              <div className="space-y-3 mb-4">
                {HABITS_TO_BREAK.map((habit) => (
                  <label key={habit} className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={habitsToBreakSelected.includes(habit)}
                      onChange={() => toggleHabitBreak(habit)}
                      className="w-5 h-5 text-slate-600 rounded focus:ring-slate-500"
                    />
                    <span className="text-gray-800">{habit}</span>
                  </label>
                ))}
                {/* Custom habits */}
                {habitsToBreakSelected.filter(h => !HABITS_TO_BREAK.includes(h)).map((habit, i) => (
                  <label key={`custom-${i}`} className="flex items-center space-x-3 p-3 rounded-lg bg-red-50">
                    <input
                      type="checkbox"
                      checked={true}
                      onChange={() => setHabitsToBreakSelected(habitsToBreakSelected.filter(h => h !== habit))}
                      className="w-5 h-5 text-slate-600 rounded focus:ring-slate-500"
                    />
                    <span className="text-gray-800">{habit}</span>
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
                  className="flex-1 px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-slate-500 focus:outline-none"
                />
                <button
                  type="button"
                  onClick={addCustomHabitBreak}
                  className="px-6 py-2 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 font-medium"
                >
                  + Add
                </button>
              </div>
            </div>

            {/* Theme */}
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                💡 Your Theme for 2026
              </h2>
              <input
                type="text"
                value={mainTheme}
                onChange={(e) => setMainTheme(e.target.value)}
                placeholder='Example: "Year of Health" or "Year of Growth"'
                className="w-full px-5 py-3 text-lg border-2 border-gray-200 rounded-xl focus:border-slate-500 focus:outline-none"
                required
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full bg-gradient-to-r from-slate-700 to-amber-600 text-white py-4 rounded-xl font-semibold text-lg hover:opacity-90 transition-all shadow-lg"
            >
              Continue to Category Deep Dives →
            </button>
          </form>
        </div>
      </div>
    );
  }

  // Steps 2-7: Category Deep Dives (Goal + Why only, NO habits)
  if (step >= 2 && step <= 1 + categories.length) {
    if (!currentCategory) return null;

    const colorClasses = {
      red: { bg: 'bg-red-50', border: 'border-red-500', text: 'text-red-600', gradient: 'from-red-600 to-rose-600' },
      blue: { bg: 'bg-blue-50', border: 'border-blue-500', text: 'text-blue-600', gradient: 'from-blue-600 to-cyan-600' },
      green: { bg: 'bg-green-50', border: 'border-green-500', text: 'text-green-600', gradient: 'from-green-600 to-emerald-600' },
      pink: { bg: 'bg-pink-50', border: 'border-pink-500', text: 'text-pink-600', gradient: 'from-pink-600 to-rose-600' },
      teal: { bg: 'bg-teal-50', border: 'border-teal-500', text: 'text-teal-600', gradient: 'from-teal-600 to-cyan-600' },
      yellow: { bg: 'bg-yellow-50', border: 'border-yellow-500', text: 'text-yellow-600', gradient: 'from-yellow-600 to-orange-600' },
    };

    const colors = colorClasses[currentCategory.color as keyof typeof colorClasses];

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
            <div className={`inline-block ${colors.bg} ${colors.border} border-2 rounded-full px-6 py-3 mb-4`}>
              <span className="text-4xl mr-2">{currentCategory.icon}</span>
              <span className={`text-xl font-bold ${colors.text}`}>{currentCategory.name}</span>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
              Deep Dive: {currentCategory.name}
            </h1>
            <p className="text-lg text-gray-600">
              What do you want to achieve in this area, and why does it matter?
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleCategorySubmit} className="bg-white rounded-2xl shadow-xl p-8 md:p-10">
            {/* Goal */}
            <div className="mb-8">
              <label className="block text-xl font-bold text-gray-900 mb-4">
                🎯 Your Goal for {currentCategory.name}
              </label>
              <textarea
                value={categoryGoal}
                onChange={(e) => setCategoryGoal(e.target.value)}
                placeholder={`What do you want to achieve in ${currentCategory.name.toLowerCase()}?`}
                className="w-full px-5 py-3 text-lg border-2 border-gray-200 rounded-xl focus:border-slate-500 focus:outline-none h-24 resize-none"
                required
              />
            </div>

            {/* Why */}
            <div className="mb-8">
              <label className="block text-xl font-bold text-gray-900 mb-4">
                💡 Why This Matters to You
              </label>
              <textarea
                value={categoryWhy}
                onChange={(e) => setCategoryWhy(e.target.value)}
                placeholder="Why is this important? What will achieving this mean to you?"
                className="w-full px-5 py-3 text-lg border-2 border-gray-200 rounded-xl focus:border-slate-500 focus:outline-none h-32 resize-none"
                required
              />
            </div>

            {/* Buttons */}
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
                className={`flex-1 bg-gradient-to-r ${colors.gradient} text-white py-4 rounded-xl font-semibold text-lg hover:opacity-90 transition-all shadow-lg`}
              >
                {step < 1 + categories.length ? `Next: ${categories[step - 1].name} →` : 'Continue to Fun →'}
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }

  // Step 8: Fun
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

            {/* Books to Read */}
            <div className="mb-8">
              <label className="block text-xl font-bold text-gray-900 mb-4">
                📚 Books I want to read in 2026
              </label>
              <textarea
                value={booksToRead}
                onChange={(e) => setBooksToRead(e.target.value)}
                placeholder="List the books you want to read (one per line)&#10;e.g.,&#10;Atomic Habits&#10;The Almanack of Naval Ravikant&#10;Deep Work"
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
                className="flex-1 bg-gradient-to-r from-emerald-600 to-teal-600 text-white py-4 rounded-xl font-semibold text-lg hover:opacity-90 transition-all shadow-lg"
              >
                Complete & View Summary →
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }

  return null;
}
