'use client';

import { useRouter } from 'next/navigation';
import { usePriorityMode } from '@/lib/context/PriorityModeContext';
import {
  PRIORITY_MODE_STEPS,
  TOTAL_PRIORITY_MODE_STEPS,
  isPriorityValid,
  isGoalValid,
} from '@/lib/types/priority';
import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';

const ALL_MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];

// Quarter-to-months mapping for backward compatibility with legacy "Q1 2026" values
const QUARTER_TO_MONTHS: Record<string, string[]> = {
  'Q1': ['January', 'February', 'March'],
  'Q2': ['January', 'February', 'March', 'April', 'May', 'June'],
  'Q3': ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September'],
  'Q4': ALL_MONTHS,
};

function getMonthsForGoal(byWhen: string): string[] {
  if (!byWhen || byWhen === 'Ongoing') return ALL_MONTHS;

  // Handle legacy quarter format: "Q1 2026", "Q2 2026", etc.
  const quarterMatch = byWhen.match(/^(Q[1-4])\s/);
  if (quarterMatch) {
    return QUARTER_TO_MONTHS[quarterMatch[1]] || ALL_MONTHS;
  }

  // Handle month format: "March 2026", "December 2026", etc.
  const monthName = byWhen.split(' ')[0];
  const monthIndex = ALL_MONTHS.indexOf(monthName);
  if (monthIndex !== -1) {
    return ALL_MONTHS.slice(0, monthIndex + 1);
  }

  return ALL_MONTHS;
}

export default function MilestonesPage() {
  const router = useRouter();
  const {
    data,
    setCurrentStep,
    addMilestone,
    updateMilestone,
    removeMilestone,
    addTask,
    removeTask,
    isLoaded,
  } = usePriorityMode();

  const [expandedGoals, setExpandedGoals] = useState<Set<string>>(new Set());
  const [newTasks, setNewTasks] = useState<Record<string, string>>({});

  const currentStep = PRIORITY_MODE_STEPS.MILESTONES;
  const progressPercentage = Math.round((currentStep / TOTAL_PRIORITY_MODE_STEPS) * 100);

  // Get all valid priorities and their valid goals
  const validPriorities = data.priorities.filter(isPriorityValid);
  const allGoals = validPriorities.flatMap(p =>
    p.goals.filter(isGoalValid).map(g => ({ ...g, priorityId: p.id, priorityName: p.name }))
  );

  const toggleGoalExpanded = (goalId: string) => {
    setExpandedGoals(prev => {
      const next = new Set(prev);
      if (next.has(goalId)) {
        next.delete(goalId);
      } else {
        next.add(goalId);
      }
      return next;
    });
  };

  const handleAddTask = (priorityId: string, goalId: string, milestoneId: string) => {
    const key = `${milestoneId}`;
    const task = newTasks[key]?.trim();
    if (task) {
      addTask(priorityId, goalId, milestoneId, task);
      setNewTasks(prev => ({ ...prev, [key]: '' }));
    }
  };

  const handleContinue = () => {
    setCurrentStep(PRIORITY_MODE_STEPS.IDENTITY);
    router.push('/priority/identity');
  };

  const handleBack = () => {
    setCurrentStep(PRIORITY_MODE_STEPS.GOALS);
    router.push('/priority/goals');
  };

  const handleSkip = () => {
    // Skip milestones and go directly to identity
    setCurrentStep(PRIORITY_MODE_STEPS.IDENTITY);
    router.push('/priority/identity');
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
            Break Down into Monthly Milestones
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Optional: Break your goals into monthly milestones based on your deadline. This makes big goals feel achievable.
            You can also do this later in the Journal.
          </p>
        </motion.div>

        {/* Skip Option */}
        <div className="flex justify-center mb-8">
          <button
            onClick={handleSkip}
            className="text-indigo-600 hover:text-indigo-800 text-sm font-medium underline"
          >
            Skip this step — I&apos;ll plan milestones in the Journal
          </button>
        </div>

        {/* Auto-save indicator */}
        <div className="flex justify-center mb-6">
          <span className="inline-flex items-center gap-2 text-sm text-gray-500 bg-white px-3 py-1 rounded-full shadow-sm">
            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
            Auto-saved
          </span>
        </div>

        {/* Goals with Milestones */}
        <div className="space-y-4 mb-8">
          {allGoals.map((goal) => {
            const isExpanded = expandedGoals.has(goal.id);
            const hasMilestones = goal.milestones.length > 0;
            const months = getMonthsForGoal(goal.byWhen);

            return (
              <motion.div
                key={goal.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-2xl shadow-lg overflow-hidden"
              >
                {/* Goal Header - Clickable */}
                <button
                  onClick={() => toggleGoalExpanded(goal.id)}
                  className="w-full p-5 flex items-center justify-between hover:bg-gray-50 transition-colors text-left"
                >
                  <div>
                    <span className="text-xs font-semibold text-indigo-600 uppercase tracking-wide">
                      {goal.priorityName}
                    </span>
                    <h3 className="text-lg font-semibold text-gray-900 mt-1">
                      {goal.what}
                    </h3>
                    <p className="text-sm text-gray-500 mt-1">
                      Target: {goal.byWhen} • {hasMilestones ? `${goal.milestones.length} milestone(s)` : 'No milestones yet'} • {months.length} month{months.length !== 1 ? 's' : ''}
                    </p>
                  </div>
                  <motion.div
                    animate={{ rotate: isExpanded ? 180 : 0 }}
                    transition={{ duration: 0.2 }}
                    className="text-gray-400"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </motion.div>
                </button>

                {/* Expanded Content */}
                <AnimatePresence>
                  {isExpanded && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="border-t border-gray-100"
                    >
                      <div className="p-5">
                        {/* Monthly Timeline */}
                        <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2 mb-4">
                          {months.map((month) => {
                            const milestone = goal.milestones.find(m => m.period === month);
                            const hasContent = milestone && (milestone.description || milestone.tasks.length > 0);

                            return (
                              <div
                                key={month}
                                className={`text-center p-2 rounded-lg text-xs font-medium transition-colors ${
                                  hasContent
                                    ? 'bg-indigo-100 text-indigo-700'
                                    : 'bg-gray-100 text-gray-500'
                                }`}
                              >
                                {month.substring(0, 3)}
                              </div>
                            );
                          })}
                        </div>

                        {/* Milestone Cards */}
                        <div className="space-y-4">
                          {months.map((month) => {
                            const milestone = goal.milestones.find(m => m.period === month);

                            // Create milestone if it doesn't exist when user starts typing
                            if (!milestone) {
                              return (
                                <div key={month} className="bg-gray-50 rounded-xl p-4">
                                  <div className="flex items-center gap-2 mb-3">
                                    <span className="text-sm font-semibold text-gray-700">{month} 2026</span>
                                  </div>
                                  <input
                                    type="text"
                                    placeholder={`What will you accomplish in ${month}?`}
                                    className="w-full px-3 py-2 text-gray-700 placeholder-gray-400 border border-gray-200 rounded-lg focus:border-indigo-500 focus:outline-none text-sm"
                                    onFocus={() => {
                                      // Create milestone when user focuses
                                      addMilestone(goal.priorityId, goal.id, month);
                                    }}
                                  />
                                </div>
                              );
                            }

                            return (
                              <div key={month} className="bg-gray-50 rounded-xl p-4">
                                <div className="flex items-center justify-between mb-3">
                                  <span className="text-sm font-semibold text-gray-700">{month} 2026</span>
                                  <button
                                    onClick={() => removeMilestone(goal.priorityId, goal.id, milestone.id)}
                                    className="text-gray-400 hover:text-red-500 text-xs"
                                  >
                                    Clear
                                  </button>
                                </div>

                                {/* Milestone Description */}
                                <input
                                  type="text"
                                  value={milestone.description}
                                  onChange={(e) =>
                                    updateMilestone(goal.priorityId, goal.id, milestone.id, {
                                      description: e.target.value,
                                    })
                                  }
                                  placeholder={`What will you accomplish in ${month}?`}
                                  className="w-full px-3 py-2 text-gray-700 placeholder-gray-400 border border-gray-200 rounded-lg focus:border-indigo-500 focus:outline-none text-sm mb-3"
                                />

                                {/* Tasks */}
                                {milestone.tasks.length > 0 && (
                                  <div className="space-y-2 mb-3">
                                    {milestone.tasks.map((task, taskIdx) => (
                                      <div
                                        key={taskIdx}
                                        className="flex items-center gap-2 text-sm text-gray-600"
                                      >
                                        <span className="text-indigo-500">•</span>
                                        <span className="flex-1">{task}</span>
                                        <button
                                          onClick={() =>
                                            removeTask(goal.priorityId, goal.id, milestone.id, taskIdx)
                                          }
                                          className="text-gray-400 hover:text-red-500"
                                        >
                                          ×
                                        </button>
                                      </div>
                                    ))}
                                  </div>
                                )}

                                {/* Add Task */}
                                <div className="flex gap-2">
                                  <input
                                    type="text"
                                    value={newTasks[milestone.id] || ''}
                                    onChange={(e) =>
                                      setNewTasks(prev => ({ ...prev, [milestone.id]: e.target.value }))
                                    }
                                    onKeyDown={(e) => {
                                      if (e.key === 'Enter') {
                                        e.preventDefault();
                                        handleAddTask(goal.priorityId, goal.id, milestone.id);
                                      }
                                    }}
                                    placeholder="Add a specific task..."
                                    className="flex-1 px-3 py-1.5 text-sm text-gray-700 placeholder-gray-400 border border-gray-200 rounded-lg focus:border-indigo-500 focus:outline-none"
                                  />
                                  <button
                                    onClick={() => handleAddTask(goal.priorityId, goal.id, milestone.id)}
                                    className="px-3 py-1.5 bg-indigo-100 text-indigo-700 rounded-lg hover:bg-indigo-200 text-sm font-medium"
                                  >
                                    +
                                  </button>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>

        {/* Tips Card */}
        <div className="bg-amber-50 rounded-xl p-5 mb-8 border border-amber-200">
          <h3 className="font-semibold text-gray-900 mb-2">Tips for milestones</h3>
          <ul className="text-sm text-gray-700 space-y-1">
            <li>• Break big goals into smaller, measurable monthly chunks</li>
            <li>• Each month should have a clear progress marker</li>
            <li>• Tasks are specific actions you can check off</li>
            <li>• Only months up to your deadline are shown</li>
            <li>• It&apos;s okay to skip this — you can plan details in the Journal</li>
          </ul>
        </div>

        {/* Navigation Buttons */}
        <div className="flex gap-4">
          <button
            onClick={handleBack}
            className="flex-1 bg-gray-200 text-gray-700 py-4 rounded-xl font-semibold text-lg hover:bg-gray-300 transition-all"
          >
            ← Back to Goals
          </button>
          <button
            onClick={handleContinue}
            className="flex-1 bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-4 rounded-xl font-semibold text-lg hover:opacity-90 transition-all shadow-lg"
          >
            Continue to Identity →
          </button>
        </div>
      </div>
    </div>
  );
}
