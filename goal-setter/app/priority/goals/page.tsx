'use client';

import { useRouter } from 'next/navigation';
import { usePriorityMode } from '@/lib/context/PriorityModeContext';
import {
  PRIORITY_MODE_STEPS,
  TOTAL_PRIORITY_MODE_STEPS,
  canAddMoreGoals,
  isGoalValid,
  isPriorityValid,
  createEmptyGoal,
} from '@/lib/types/priority';
import { motion, AnimatePresence } from 'framer-motion';
import { useEffect } from 'react';

const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];

const DEADLINE_OPTIONS = [
  ...MONTHS.map(month => ({ value: `${month} 2026`, label: `${month} 2026` })),
  { value: 'Ongoing', label: 'Ongoing (No specific deadline)' },
];

export default function GoalsPage() {
  const router = useRouter();
  const {
    data,
    setCurrentStep,
    setCurrentPriorityIndex,
    addGoal,
    updateGoal,
    removeGoal,
    isLoaded,
  } = usePriorityMode();

  // Get only valid priorities
  const validPriorities = data.priorities.filter(isPriorityValid);
  const currentPriority = validPriorities[data.currentPriorityIndex];
  const isLastPriority = data.currentPriorityIndex >= validPriorities.length - 1;

  const currentStep = PRIORITY_MODE_STEPS.GOALS;
  // Progress includes sub-steps for each priority
  const baseProgress = (currentStep / TOTAL_PRIORITY_MODE_STEPS) * 100;
  const priorityProgress = validPriorities.length
    ? ((data.currentPriorityIndex + 1) / validPriorities.length) * (100 / TOTAL_PRIORITY_MODE_STEPS)
    : 0;
  const progressPercentage = Math.round(baseProgress + priorityProgress * 0.5);

  // Validation - at least one valid goal for current priority
  const hasValidGoal = currentPriority?.goals.some(isGoalValid) ?? false;

  const handleAddGoal = () => {
    if (currentPriority && canAddMoreGoals(currentPriority.goals)) {
      addGoal(currentPriority.id);
    }
  };

  const handleNextPriority = () => {
    if (!hasValidGoal) return;

    if (isLastPriority) {
      // Move to milestones step
      setCurrentStep(PRIORITY_MODE_STEPS.MILESTONES);
      setCurrentPriorityIndex(0);
      router.push('/priority/milestones');
    } else {
      // Move to next priority
      setCurrentPriorityIndex(data.currentPriorityIndex + 1);
    }
  };

  const handlePrevPriority = () => {
    if (data.currentPriorityIndex > 0) {
      setCurrentPriorityIndex(data.currentPriorityIndex - 1);
    } else {
      // Go back to priorities page
      setCurrentStep(PRIORITY_MODE_STEPS.PRIORITIES);
      router.push('/priority/priorities');
    }
  };

  // Ensure there's at least one goal (in useEffect to avoid Strict Mode duplicates)
  // Must be before early returns to comply with React Rules of Hooks
  useEffect(() => {
    if (currentPriority && currentPriority.goals.length === 0) {
      addGoal(currentPriority.id);
    }
  }, [addGoal, currentPriority]);

  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 flex items-center justify-center">
        <div className="animate-pulse text-indigo-600">Loading...</div>
      </div>
    );
  }

  if (!currentPriority) {
    router.push('/priority/priorities');
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 py-8 px-4">
      <div className="max-w-3xl mx-auto">
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium text-gray-700">
              Step {currentStep} of {TOTAL_PRIORITY_MODE_STEPS} — Priority {data.currentPriorityIndex + 1} of {validPriorities.length}
            </span>
            <span className="text-sm font-medium text-indigo-700">{progressPercentage}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${progressPercentage}%` }}
              transition={{ duration: 0.5 }}
              className="bg-gradient-to-r from-indigo-600 to-purple-600 h-2 rounded-full"
            />
          </div>
          {/* Priority progress dots */}
          <div className="flex justify-center gap-2 mt-3">
            {validPriorities.map((_, idx) => (
              <div
                key={idx}
                className={`w-2 h-2 rounded-full transition-colors ${
                  idx === data.currentPriorityIndex
                    ? 'bg-indigo-600'
                    : idx < data.currentPriorityIndex
                    ? 'bg-indigo-300'
                    : 'bg-gray-300'
                }`}
              />
            ))}
          </div>
        </div>

        {/* Header */}
        <motion.div
          key={currentPriority.id}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="text-center mb-8"
        >
          <div className="inline-block bg-indigo-100 text-indigo-700 px-4 py-2 rounded-full text-sm font-semibold mb-4">
            Priority #{data.currentPriorityIndex + 1}
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
            {currentPriority.name}
          </h1>
          {currentPriority.why && (
            <p className="text-lg text-gray-600 max-w-xl mx-auto italic">
              &ldquo;{currentPriority.why}&rdquo;
            </p>
          )}
        </motion.div>

        {/* Auto-save indicator */}
        <div className="flex justify-center mb-6">
          <span className="inline-flex items-center gap-2 text-sm text-gray-500 bg-white px-3 py-1 rounded-full shadow-sm">
            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
            Auto-saved
          </span>
        </div>

        {/* Goals Section */}
        <div className="bg-white rounded-2xl shadow-xl p-6 md:p-8 mb-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900">
              Goals for this Priority ({currentPriority.goals.length}/5)
            </h2>
          </div>

          <p className="text-gray-600 mb-6">
            What specific goals will help you achieve this priority? Be concrete and time-bound.
          </p>

          <AnimatePresence>
            {currentPriority.goals.map((goal, index) => (
              <motion.div
                key={goal.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: -100 }}
                className="bg-gray-50 rounded-xl p-5 mb-4 border-2 border-gray-200 hover:border-indigo-200 transition-colors"
              >
                {/* Goal Header */}
                <div className="flex items-center justify-between mb-4">
                  <span className="text-sm font-semibold text-indigo-600">
                    Goal {index + 1}
                  </span>
                  {currentPriority.goals.length > 1 && (
                    <button
                      onClick={() => removeGoal(currentPriority.id, goal.id)}
                      className="text-gray-400 hover:text-red-500 transition-colors p-1"
                      title="Remove goal"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  )}
                </div>

                {/* What */}
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    What do you want to achieve?
                  </label>
                  <input
                    type="text"
                    value={goal.what}
                    onChange={(e) => updateGoal(currentPriority.id, goal.id, { what: e.target.value })}
                    placeholder="e.g., Lose 10kg, Launch my side project, Read 24 books"
                    className="w-full px-4 py-3 text-gray-900 placeholder-gray-400 border border-gray-200 rounded-lg focus:border-indigo-500 focus:outline-none"
                  />
                </div>

                {/* By When */}
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    By when?
                  </label>
                  <select
                    value={goal.byWhen}
                    onChange={(e) => updateGoal(currentPriority.id, goal.id, { byWhen: e.target.value })}
                    className="w-full px-4 py-3 text-gray-900 border border-gray-200 rounded-lg focus:border-indigo-500 focus:outline-none bg-white"
                  >
                    <option value="">Select a deadline</option>
                    {DEADLINE_OPTIONS.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Success Looks Like */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    How will you know you&apos;ve achieved it?
                  </label>
                  <textarea
                    value={goal.successLooksLike}
                    onChange={(e) => updateGoal(currentPriority.id, goal.id, { successLooksLike: e.target.value })}
                    placeholder="Describe what success looks like. Be specific."
                    className="w-full px-4 py-3 text-gray-900 placeholder-gray-400 border border-gray-200 rounded-lg focus:border-indigo-500 focus:outline-none resize-none h-20"
                  />
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {/* Add Goal Button */}
          {canAddMoreGoals(currentPriority.goals) && (
            <motion.button
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              onClick={handleAddGoal}
              className="w-full py-3 border-2 border-dashed border-gray-300 rounded-xl text-gray-500 hover:border-indigo-400 hover:text-indigo-600 transition-colors font-medium"
            >
              + Add Another Goal
            </motion.button>
          )}
        </div>

        {/* Example Card */}
        <div className="bg-indigo-50 rounded-xl p-5 mb-8 border border-indigo-200">
          <h3 className="font-semibold text-indigo-900 mb-2">💡 Example</h3>
          <div className="text-sm text-indigo-800 space-y-1">
            <p><strong>Priority:</strong> Family Health</p>
            <p><strong>Goal:</strong> Ensure wife recovers fully postpartum</p>
            <p><strong>By When:</strong> March 2026</p>
            <p><strong>Success:</strong> She&apos;s back to full energy, cleared by doctor, feeling confident</p>
          </div>
        </div>

        {/* Navigation Buttons */}
        <div className="flex gap-4">
          <button
            onClick={handlePrevPriority}
            className="flex-1 bg-gray-200 text-gray-700 py-4 rounded-xl font-semibold text-lg hover:bg-gray-300 transition-all"
          >
            ← {data.currentPriorityIndex > 0 ? 'Previous Priority' : 'Back to Priorities'}
          </button>
          <button
            onClick={handleNextPriority}
            disabled={!hasValidGoal}
            className={`flex-1 py-4 rounded-xl font-semibold text-lg transition-all shadow-lg ${
              hasValidGoal
                ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:opacity-90'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
          >
            {isLastPriority ? 'Continue to Milestones →' : 'Next Priority →'}
          </button>
        </div>

        {!hasValidGoal && (
          <p className="text-center text-red-500 text-sm mt-4">
            Please add at least one goal with a description to continue
          </p>
        )}
      </div>
    </div>
  );
}
