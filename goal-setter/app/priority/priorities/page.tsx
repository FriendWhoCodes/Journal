'use client';

import { useRouter } from 'next/navigation';
import { usePriorityMode } from '@/lib/context/PriorityModeContext';
import {
  PRIORITY_MODE_STEPS,
  TOTAL_PRIORITY_MODE_STEPS,
  canAddMorePriorities,
  isPriorityValid,
} from '@/lib/types/priority';
import { motion, AnimatePresence, Reorder } from 'framer-motion';
import { useState } from 'react';

export default function PrioritiesPage() {
  const router = useRouter();
  const {
    data,
    setCurrentStep,
    addPriority,
    updatePriority,
    removePriority,
    reorderPriorities,
    isLoaded,
  } = usePriorityMode();

  const [dragEnabled, setDragEnabled] = useState(false);

  const currentStep = PRIORITY_MODE_STEPS.PRIORITIES;
  const progressPercentage = Math.round((currentStep / TOTAL_PRIORITY_MODE_STEPS) * 100);

  // Validation
  const validPriorities = data.priorities.filter(isPriorityValid);
  const canContinue = validPriorities.length >= 1;

  const handleContinue = () => {
    if (!canContinue) return;
    setCurrentStep(PRIORITY_MODE_STEPS.GOALS);
    router.push('/priority/goals');
  };

  const handleBack = () => {
    setCurrentStep(PRIORITY_MODE_STEPS.ONBOARDING);
    router.push('/priority');
  };

  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 flex items-center justify-center">
        <div className="animate-pulse text-indigo-600">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 py-8 px-4">
      <div className="max-w-3xl mx-auto">
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium text-gray-700">
              Step {currentStep} of {TOTAL_PRIORITY_MODE_STEPS}
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
        </div>

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
            Define Your Priorities
          </h1>
          <p className="text-lg text-gray-600 max-w-xl mx-auto">
            What matters most to you in 2026? List your priorities in order of importance.
            You can drag to reorder them.
          </p>
        </motion.div>

        {/* Auto-save indicator */}
        <div className="flex justify-center mb-6">
          <span className="inline-flex items-center gap-2 text-sm text-gray-500 bg-white px-3 py-1 rounded-full shadow-sm">
            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
            Auto-saved
          </span>
        </div>

        {/* Priorities List */}
        <div className="bg-white rounded-2xl shadow-xl p-6 md:p-8 mb-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900">
              Your Priorities ({data.priorities.length}/10)
            </h2>
            <button
              onClick={() => setDragEnabled(!dragEnabled)}
              className={`text-sm px-3 py-1 rounded-lg transition-colors ${
                dragEnabled
                  ? 'bg-indigo-100 text-indigo-700'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {dragEnabled ? '✓ Reorder Mode' : '↕ Reorder'}
            </button>
          </div>

          <Reorder.Group
            axis="y"
            values={data.priorities}
            onReorder={reorderPriorities}
            className="space-y-4"
          >
            <AnimatePresence>
              {data.priorities.map((priority, index) => (
                <Reorder.Item
                  key={priority.id}
                  value={priority}
                  dragListener={dragEnabled}
                  className={dragEnabled ? 'cursor-grab active:cursor-grabbing' : ''}
                >
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, x: -100 }}
                    transition={{ duration: 0.3 }}
                    className={`bg-gray-50 rounded-xl p-5 border-2 transition-colors ${
                      isPriorityValid(priority)
                        ? 'border-indigo-200'
                        : 'border-gray-200'
                    } ${dragEnabled ? 'hover:border-indigo-400' : ''}`}
                  >
                    {/* Priority Header */}
                    <div className="flex items-center gap-3 mb-4">
                      {dragEnabled && (
                        <div className="text-gray-400 cursor-grab">
                          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M7 2a2 2 0 1 0 .001 4.001A2 2 0 0 0 7 2zm0 6a2 2 0 1 0 .001 4.001A2 2 0 0 0 7 8zm0 6a2 2 0 1 0 .001 4.001A2 2 0 0 0 7 14zm6-8a2 2 0 1 0-.001-4.001A2 2 0 0 0 13 6zm0 2a2 2 0 1 0 .001 4.001A2 2 0 0 0 13 8zm0 6a2 2 0 1 0 .001 4.001A2 2 0 0 0 13 14z"/>
                          </svg>
                        </div>
                      )}
                      <div className="flex-shrink-0 w-8 h-8 bg-indigo-600 text-white rounded-full flex items-center justify-center font-bold text-sm">
                        {index + 1}
                      </div>
                      <input
                        type="text"
                        value={priority.name}
                        onChange={(e) => updatePriority(priority.id, { name: e.target.value })}
                        placeholder={`Priority ${index + 1} (e.g., "Family Health", "Career Growth")`}
                        className="flex-1 px-3 py-2 text-lg font-medium text-gray-900 placeholder-gray-400 border-0 bg-transparent focus:outline-none focus:ring-0"
                      />
                      {data.priorities.length > 1 && (
                        <button
                          onClick={() => removePriority(priority.id)}
                          className="text-gray-400 hover:text-red-500 transition-colors p-1"
                          title="Remove priority"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      )}
                    </div>

                    {/* Why textarea */}
                    <div className="ml-11">
                      <label className="block text-sm font-medium text-gray-600 mb-1">
                        Why does this matter to you?
                      </label>
                      <textarea
                        value={priority.why}
                        onChange={(e) => updatePriority(priority.id, { why: e.target.value })}
                        placeholder="What makes this priority important? What will change if you focus on this?"
                        className="w-full px-3 py-2 text-gray-700 placeholder-gray-400 border border-gray-200 rounded-lg focus:border-indigo-500 focus:outline-none resize-none h-20"
                      />
                    </div>
                  </motion.div>
                </Reorder.Item>
              ))}
            </AnimatePresence>
          </Reorder.Group>

          {/* Add Priority Button */}
          {canAddMorePriorities(data.priorities) && (
            <motion.button
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              onClick={addPriority}
              className="w-full mt-4 py-3 border-2 border-dashed border-gray-300 rounded-xl text-gray-500 hover:border-indigo-400 hover:text-indigo-600 transition-colors font-medium"
            >
              + Add Another Priority
            </motion.button>
          )}
        </div>

        {/* Tips Card */}
        <div className="bg-amber-50 rounded-xl p-5 mb-8 border border-amber-200">
          <h3 className="font-semibold text-gray-900 mb-2">💡 Tips for setting priorities</h3>
          <ul className="text-sm text-gray-700 space-y-1">
            <li>• Think about what you would regret NOT focusing on this year</li>
            <li>• Consider all areas: health, family, career, finances, personal growth</li>
            <li>• Order matters — put what&apos;s most important first</li>
            <li>• 3-5 priorities is often ideal; more than 10 dilutes focus</li>
          </ul>
        </div>

        {/* Navigation Buttons */}
        <div className="flex gap-4">
          <button
            onClick={handleBack}
            className="flex-1 bg-gray-200 text-gray-700 py-4 rounded-xl font-semibold text-lg hover:bg-gray-300 transition-all"
          >
            ← Back
          </button>
          <button
            onClick={handleContinue}
            disabled={!canContinue}
            className={`flex-1 py-4 rounded-xl font-semibold text-lg transition-all shadow-lg ${
              canContinue
                ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:opacity-90'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
          >
            Continue to Goals →
          </button>
        </div>

        {!canContinue && (
          <p className="text-center text-red-500 text-sm mt-4">
            Please add at least one priority to continue
          </p>
        )}
      </div>
    </div>
  );
}
