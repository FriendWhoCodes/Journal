'use client';

import { useRouter } from 'next/navigation';
import { usePriorityMode } from '@/lib/context/PriorityModeContext';
import {
  PRIORITY_MODE_STEPS,
  TOTAL_PRIORITY_MODE_STEPS,
  isPriorityValid,
  isGoalValid,
} from '@/lib/types/priority';
import { motion } from 'framer-motion';
import { useState } from 'react';

// Helper for backward compat: handle both string and string[] identity fields
function toArray(val: unknown): string[] {
  if (Array.isArray(val)) return val;
  if (typeof val === 'string' && val.trim()) return [val];
  return [];
}

export default function ReviewPage() {
  const router = useRouter();
  const { data, setCurrentStep, finalize, isLoaded } = usePriorityMode();

  const [isSubmitting, setIsSubmitting] = useState(false);

  const currentStep = PRIORITY_MODE_STEPS.REVIEW;
  const progressPercentage = Math.round((currentStep / TOTAL_PRIORITY_MODE_STEPS) * 100);

  const validPriorities = data.priorities.filter(isPriorityValid);
  const totalGoals = validPriorities.reduce(
    (sum, p) => sum + p.goals.filter(isGoalValid).length,
    0
  );

  const handleFinalize = async () => {
    setIsSubmitting(true);

    try {
      // Save to database
      const response = await fetch('/api/priority', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          priorities: data.priorities,
          identity: data.identity,
          wisdomMode: data.wisdomMode,
          wisdomType: data.wisdomType,
          finalize: true,
          year: 2026,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to save');
      }

      // Update local state
      finalize();

      // Navigate to complete page
      setCurrentStep(PRIORITY_MODE_STEPS.COMPLETE);
      router.push('/priority/complete');
    } catch (error) {
      console.error('Error finalizing:', error);
      alert('There was an error saving your blueprint. Please try again.');
      setIsSubmitting(false);
    }
  };

  const handleEdit = (section: string) => {
    switch (section) {
      case 'priorities':
        setCurrentStep(PRIORITY_MODE_STEPS.PRIORITIES);
        router.push('/priority/priorities');
        break;
      case 'goals':
        setCurrentStep(PRIORITY_MODE_STEPS.GOALS);
        router.push('/priority/goals');
        break;
      case 'milestones':
        setCurrentStep(PRIORITY_MODE_STEPS.MILESTONES);
        router.push('/priority/milestones');
        break;
      case 'identity':
        setCurrentStep(PRIORITY_MODE_STEPS.IDENTITY);
        router.push('/priority/identity');
        break;
    }
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
      <div className="max-w-4xl mx-auto">
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
            Your 2026 Blueprint
          </h1>
          <p className="text-lg text-gray-600 max-w-xl mx-auto">
            Review everything you&apos;ve created. Click any section to make changes.
          </p>
        </motion.div>

        {/* Summary Stats */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          <div className="bg-white rounded-xl p-4 text-center shadow-md">
            <div className="text-3xl font-bold text-indigo-600">{validPriorities.length}</div>
            <div className="text-sm text-gray-600">Priorities</div>
          </div>
          <div className="bg-white rounded-xl p-4 text-center shadow-md">
            <div className="text-3xl font-bold text-purple-600">{totalGoals}</div>
            <div className="text-sm text-gray-600">Goals</div>
          </div>
          <div className="bg-white rounded-xl p-4 text-center shadow-md">
            <div className="text-3xl font-bold text-emerald-600">
              {validPriorities.reduce(
                (sum, p) => sum + p.goals.reduce((gSum, g) => gSum + g.milestones.length, 0),
                0
              )}
            </div>
            <div className="text-sm text-gray-600">Milestones</div>
          </div>
        </div>

        {/* Priorities & Goals Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-2xl shadow-xl p-6 md:p-8 mb-6"
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900">🎯 Priorities & Goals</h2>
            <button
              onClick={() => handleEdit('priorities')}
              className="text-indigo-600 hover:text-indigo-800 text-sm font-medium"
            >
              Edit
            </button>
          </div>

          <div className="space-y-6">
            {validPriorities.map((priority, pIndex) => (
              <div key={priority.id} className="border-l-4 border-indigo-500 pl-4">
                <div className="flex items-start gap-3 mb-2">
                  <span className="flex-shrink-0 w-6 h-6 bg-indigo-600 text-white rounded-full flex items-center justify-center text-xs font-bold">
                    {pIndex + 1}
                  </span>
                  <div>
                    <h3 className="font-semibold text-gray-900">{priority.name}</h3>
                    {priority.why && (
                      <p className="text-sm text-gray-500 italic mt-1">&ldquo;{priority.why}&rdquo;</p>
                    )}
                  </div>
                </div>

                {/* Goals under this priority */}
                <div className="ml-9 mt-3 space-y-2">
                  {priority.goals.filter(isGoalValid).map((goal, gIndex) => (
                    <div key={goal.id} className="bg-gray-50 rounded-lg p-3">
                      <div className="flex items-start justify-between">
                        <div>
                          <span className="text-xs text-indigo-600 font-medium">Goal {gIndex + 1}</span>
                          <p className="text-gray-800">{goal.what}</p>
                          <p className="text-sm text-gray-500">
                            Target: {goal.byWhen || 'Not set'}
                          </p>
                        </div>
                      </div>
                      {goal.successLooksLike && (
                        <p className="text-sm text-gray-600 mt-2 border-t border-gray-200 pt-2">
                          <span className="font-medium">Success:</span> {goal.successLooksLike}
                        </p>
                      )}
                      {goal.milestones.length > 0 && (
                        <div className="mt-2 flex gap-2">
                          {goal.milestones.map((m) => (
                            <span
                              key={m.id}
                              className="text-xs bg-indigo-100 text-indigo-700 px-2 py-1 rounded"
                            >
                              {m.period}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Identity Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-2xl shadow-xl p-6 md:p-8 mb-6"
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900">🦋 Identity Transformation</h2>
            <button
              onClick={() => handleEdit('identity')}
              className="text-indigo-600 hover:text-indigo-800 text-sm font-medium"
            >
              Edit
            </button>
          </div>

          <div className="space-y-4">
            {data.identity.iAmSomeoneWho && (
              <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl p-5 border border-indigo-200">
                <h3 className="text-sm font-semibold text-indigo-600 mb-2">I Am Someone Who...</h3>
                <p className="text-gray-800 text-lg leading-relaxed">{data.identity.iAmSomeoneWho}</p>
              </div>
            )}

            <div className="grid md:grid-cols-2 gap-4">
              {toArray(data.identity.habitsToBuild).length > 0 && (
                <div className="bg-green-50 rounded-lg p-4">
                  <h3 className="text-sm font-semibold text-green-700 mb-2">Habits to Build</h3>
                  <div className="flex flex-wrap gap-1.5">
                    {toArray(data.identity.habitsToBuild).map((item, i) => (
                      <span key={i} className="inline-block bg-green-100 text-green-800 px-2.5 py-1 rounded-full text-xs font-medium">
                        {item}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {toArray(data.identity.habitsToEliminate).length > 0 && (
                <div className="bg-red-50 rounded-lg p-4">
                  <h3 className="text-sm font-semibold text-red-700 mb-2">Habits to Eliminate</h3>
                  <div className="flex flex-wrap gap-1.5">
                    {toArray(data.identity.habitsToEliminate).map((item, i) => (
                      <span key={i} className="inline-block bg-red-100 text-red-800 px-2.5 py-1 rounded-full text-xs font-medium">
                        {item}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {toArray(data.identity.beliefsToHold).length > 0 && (
                <div className="bg-blue-50 rounded-lg p-4">
                  <h3 className="text-sm font-semibold text-blue-700 mb-2">Beliefs to Hold</h3>
                  <div className="flex flex-wrap gap-1.5">
                    {toArray(data.identity.beliefsToHold).map((item, i) => (
                      <span key={i} className="inline-block bg-blue-100 text-blue-800 px-2.5 py-1 rounded-full text-xs font-medium">
                        {item}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {data.identity.personWhoAchieves && (
                <div className="bg-purple-50 rounded-lg p-4">
                  <h3 className="text-sm font-semibold text-purple-700 mb-2">Person Who Achieves</h3>
                  <p className="text-gray-700 text-sm">{data.identity.personWhoAchieves}</p>
                </div>
              )}
            </div>

            {!data.identity.iAmSomeoneWho &&
              toArray(data.identity.habitsToBuild).length === 0 &&
              toArray(data.identity.habitsToEliminate).length === 0 &&
              toArray(data.identity.beliefsToHold).length === 0 &&
              !data.identity.personWhoAchieves && (
                <p className="text-gray-500 text-center py-4">
                  No identity statements added yet.{' '}
                  <button
                    onClick={() => handleEdit('identity')}
                    className="text-indigo-600 hover:underline"
                  >
                    Add some now
                  </button>
                </p>
              )}
          </div>
        </motion.div>

        {/* Finalize Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl shadow-xl p-6 md:p-8 text-white mb-6"
        >
          <h2 className="text-2xl font-bold mb-4 text-center">Ready to Finalize?</h2>
          <p className="text-indigo-100 text-center mb-6">
            Once finalized, you&apos;ll receive your PDF, wallpapers, and email summary.
            Your goals will also be saved to Man of Wisdom Journal.
          </p>

          <div className="flex flex-col items-center gap-4">
            <button
              onClick={handleFinalize}
              disabled={isSubmitting || validPriorities.length === 0}
              className={`px-12 py-4 rounded-xl font-bold text-lg transition-all ${
                isSubmitting || validPriorities.length === 0
                  ? 'bg-white/30 cursor-not-allowed'
                  : 'bg-white text-indigo-600 hover:bg-indigo-50 shadow-lg transform hover:scale-105'
              }`}
            >
              {isSubmitting ? 'Finalizing...' : 'Finalize My 2026 Blueprint ✨'}
            </button>

            <p className="text-indigo-200 text-sm">
              You can still edit after finalizing
            </p>
          </div>
        </motion.div>

        {/* Back Button */}
        <div className="text-center">
          <button
            onClick={() => handleEdit('identity')}
            className="text-gray-600 hover:text-gray-800 text-sm font-medium"
          >
            ← Back to Identity
          </button>
        </div>
      </div>
    </div>
  );
}
