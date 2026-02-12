'use client';

import { useRouter } from 'next/navigation';
import { usePriorityMode } from '@/lib/context/PriorityModeContext';
import { PRIORITY_MODE_STEPS, TOTAL_PRIORITY_MODE_STEPS } from '@/lib/types/priority';
import { HABITS_TO_BUILD, HABITS_TO_BREAK, BELIEFS_TO_HOLD } from '@/lib/constants';
import { motion } from 'framer-motion';
import { useState } from 'react';

type ArrayField = 'habitsToBuild' | 'habitsToEliminate' | 'beliefsToHold';

const IDENTITY_QUESTIONS = [
  {
    key: 'habitsToBuild' as const,
    type: 'array' as const,
    title: 'What habits must you build?',
    description: 'To achieve your priorities, what new habits or routines do you need to adopt?',
    icon: '🌱',
    presets: HABITS_TO_BUILD,
  },
  {
    key: 'habitsToEliminate' as const,
    type: 'array' as const,
    title: 'What habits must you eliminate?',
    description: 'What behaviors or patterns are holding you back from your priorities?',
    icon: '🚫',
    presets: HABITS_TO_BREAK,
  },
  {
    key: 'beliefsToHold' as const,
    type: 'array' as const,
    title: 'What beliefs must you hold?',
    description: 'What mindset or beliefs will help you succeed? What truths do you need to embrace?',
    icon: '💭',
    presets: BELIEFS_TO_HOLD,
  },
  {
    key: 'personWhoAchieves' as const,
    type: 'text' as const,
    title: 'What kind of person achieves these priorities?',
    description: 'Describe the characteristics and traits of someone who successfully achieves what you want.',
    placeholder: 'e.g., A disciplined person who puts family first, who values deep work over busy work, who respects their time...',
    icon: '🦋',
  },
  {
    key: 'iAmSomeoneWho' as const,
    type: 'text' as const,
    title: 'Complete this statement: "I am someone who..."',
    description: 'This is your identity statement. Who are you becoming in 2026?',
    placeholder: 'I am someone who prioritizes my family\'s health above all else, who does deep work instead of busy work, who treats time as the most precious resource...',
    icon: '✨',
  },
];

export default function IdentityPage() {
  const router = useRouter();
  const { data, setCurrentStep, updateIdentity, addIdentityItem, removeIdentityItem, isLoaded } = usePriorityMode();

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [customInput, setCustomInput] = useState('');

  const currentStep = PRIORITY_MODE_STEPS.IDENTITY;
  const progressPercentage = Math.round((currentStep / TOTAL_PRIORITY_MODE_STEPS) * 100);

  const currentQuestion = IDENTITY_QUESTIONS[currentQuestionIndex];

  const isLastQuestion = currentQuestionIndex === IDENTITY_QUESTIONS.length - 1;
  const isFirstQuestion = currentQuestionIndex === 0;

  // Check if at least the final identity statement is filled
  const hasIdentityStatement = data.identity.iAmSomeoneWho?.trim().length > 0;

  const handleNextQuestion = () => {
    if (isLastQuestion) {
      setCurrentStep(PRIORITY_MODE_STEPS.REVIEW);
      router.push('/priority/review');
    } else {
      setCurrentQuestionIndex(prev => prev + 1);
      setCustomInput('');
    }
  };

  const handlePrevQuestion = () => {
    if (isFirstQuestion) {
      setCurrentStep(PRIORITY_MODE_STEPS.MILESTONES);
      router.push('/priority/milestones');
    } else {
      setCurrentQuestionIndex(prev => prev - 1);
      setCustomInput('');
    }
  };

  const handleAddCustom = () => {
    const trimmed = customInput.trim();
    if (trimmed && currentQuestion.type === 'array') {
      addIdentityItem(currentQuestion.key as ArrayField, trimmed);
      setCustomInput('');
    }
  };

  // Helper to get array value safely (backward compat with old string data from localStorage)
  const getArrayValue = (field: ArrayField): string[] => {
    const val: unknown = data.identity[field];
    if (Array.isArray(val)) return val;
    if (typeof val === 'string' && val.trim()) return [val];
    return [];
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
              Step {currentStep} of {TOTAL_PRIORITY_MODE_STEPS} — Question {currentQuestionIndex + 1} of {IDENTITY_QUESTIONS.length}
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
          {/* Question progress dots */}
          <div className="flex justify-center gap-2 mt-3">
            {IDENTITY_QUESTIONS.map((_, idx) => (
              <button
                key={idx}
                onClick={() => { setCurrentQuestionIndex(idx); setCustomInput(''); }}
                className={`w-2 h-2 rounded-full transition-colors ${
                  idx === currentQuestionIndex
                    ? 'bg-indigo-600'
                    : idx < currentQuestionIndex
                    ? 'bg-indigo-300'
                    : 'bg-gray-300'
                }`}
              />
            ))}
          </div>
        </div>

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <div className="inline-block bg-indigo-100 text-indigo-700 px-4 py-2 rounded-full text-sm font-semibold mb-4">
            Identity Transformation
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
            Who Do You Need to Become?
          </h1>
          <p className="text-lg text-gray-600 max-w-xl mx-auto">
            Your priorities require a certain version of you. Let&apos;s define who that person is.
          </p>
        </motion.div>

        {/* Auto-save indicator */}
        <div className="flex justify-center mb-6">
          <span className="inline-flex items-center gap-2 text-sm text-gray-500 bg-white px-3 py-1 rounded-full shadow-sm">
            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
            Auto-saved
          </span>
        </div>

        {/* Question Card */}
        <motion.div
          key={currentQuestion.key}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.3 }}
          className="bg-white rounded-2xl shadow-xl p-8 md:p-10 mb-8"
        >
          {/* Question Icon & Title */}
          <div className="text-center mb-6">
            <span className="text-5xl mb-4 block">{currentQuestion.icon}</span>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              {currentQuestion.title}
            </h2>
            <p className="text-gray-600">
              {currentQuestion.description}
            </p>
          </div>

          {currentQuestion.type === 'array' ? (
            <>
              {/* Preset Checkboxes */}
              {'presets' in currentQuestion && currentQuestion.presets && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
                  {currentQuestion.presets.map((preset) => {
                    const selected = getArrayValue(currentQuestion.key as ArrayField).includes(preset);
                    return (
                      <button
                        key={preset}
                        onClick={() => {
                          if (selected) {
                            const idx = getArrayValue(currentQuestion.key as ArrayField).indexOf(preset);
                            removeIdentityItem(currentQuestion.key as ArrayField, idx);
                          } else {
                            addIdentityItem(currentQuestion.key as ArrayField, preset);
                          }
                        }}
                        className={`flex items-center gap-3 px-4 py-3 rounded-xl border-2 text-left transition-all ${
                          selected
                            ? 'border-indigo-500 bg-indigo-50 text-indigo-800'
                            : 'border-gray-200 bg-white text-gray-700 hover:border-indigo-200'
                        }`}
                      >
                        <span className={`flex-shrink-0 w-5 h-5 rounded-md border-2 flex items-center justify-center ${
                          selected ? 'border-indigo-500 bg-indigo-500' : 'border-gray-300'
                        }`}>
                          {selected && (
                            <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                            </svg>
                          )}
                        </span>
                        <span className="text-sm font-medium">{preset}</span>
                      </button>
                    );
                  })}
                </div>
              )}

              {/* Custom Add Input */}
              <div className="flex gap-2 mb-4">
                <input
                  type="text"
                  value={customInput}
                  onChange={(e) => setCustomInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleAddCustom();
                    }
                  }}
                  placeholder="Add your own..."
                  className="flex-1 px-4 py-3 text-gray-900 placeholder-gray-400 border-2 border-gray-200 rounded-xl focus:border-indigo-500 focus:outline-none"
                />
                <button
                  onClick={handleAddCustom}
                  disabled={!customInput.trim()}
                  className="px-6 py-3 bg-indigo-600 text-white rounded-xl font-medium hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Add
                </button>
              </div>

              {/* Selected Items as Tags */}
              {getArrayValue(currentQuestion.key as ArrayField).length > 0 && (
                <div className="mt-4">
                  <p className="text-sm font-medium text-gray-600 mb-2">
                    Selected ({getArrayValue(currentQuestion.key as ArrayField).length}):
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {getArrayValue(currentQuestion.key as ArrayField).map((item, idx) => {
                      const isPreset = 'presets' in currentQuestion && currentQuestion.presets?.includes(item);
                      return (
                        <span
                          key={idx}
                          className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium ${
                            currentQuestion.key === 'habitsToBuild'
                              ? 'bg-green-100 text-green-800'
                              : currentQuestion.key === 'habitsToEliminate'
                              ? 'bg-red-100 text-red-800'
                              : 'bg-blue-100 text-blue-800'
                          }`}
                        >
                          {item}
                          {!isPreset && (
                            <span className="text-xs opacity-60 ml-0.5">custom</span>
                          )}
                          <button
                            onClick={() => removeIdentityItem(currentQuestion.key as ArrayField, idx)}
                            className="ml-1 hover:opacity-70"
                          >
                            ×
                          </button>
                        </span>
                      );
                    })}
                  </div>
                </div>
              )}
            </>
          ) : (
            <>
              {/* Text Area for prose questions */}
              <textarea
                value={(data.identity[currentQuestion.key as keyof typeof data.identity] as string) || ''}
                onChange={(e) => updateIdentity({ [currentQuestion.key]: e.target.value })}
                placeholder={currentQuestion.placeholder}
                className="w-full px-5 py-4 text-lg text-gray-900 placeholder-gray-400 border-2 border-gray-200 rounded-xl focus:border-indigo-500 focus:outline-none resize-none h-48 transition-colors"
                autoFocus
              />

              {/* Character hint */}
              <div className="flex justify-between items-center mt-2 text-sm text-gray-500">
                <span>Take your time. This is about self-discovery.</span>
                <span>{((data.identity[currentQuestion.key as keyof typeof data.identity] as string) || '').length} characters</span>
              </div>
            </>
          )}
        </motion.div>

        {/* Priority Reminder */}
        <div className="bg-indigo-50 rounded-xl p-5 mb-8 border border-indigo-200">
          <h3 className="font-semibold text-indigo-900 mb-2">Your Top Priorities</h3>
          <div className="flex flex-wrap gap-2">
            {data.priorities.slice(0, 5).map((priority, idx) => (
              priority.name && (
                <span
                  key={priority.id}
                  className="inline-block bg-white text-indigo-700 px-3 py-1 rounded-full text-sm border border-indigo-200"
                >
                  {idx + 1}. {priority.name}
                </span>
              )
            ))}
          </div>
          <p className="text-sm text-indigo-700 mt-3">
            Think about who you need to be to honor these priorities.
          </p>
        </div>

        {/* Navigation Buttons */}
        <div className="flex gap-4">
          <button
            onClick={handlePrevQuestion}
            className="flex-1 bg-gray-200 text-gray-700 py-4 rounded-xl font-semibold text-lg hover:bg-gray-300 transition-all"
          >
            ← {isFirstQuestion ? 'Back to Milestones' : 'Previous Question'}
          </button>
          <button
            onClick={handleNextQuestion}
            className="flex-1 bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-4 rounded-xl font-semibold text-lg hover:opacity-90 transition-all shadow-lg"
          >
            {isLastQuestion ? 'Review Your Blueprint →' : 'Next Question →'}
          </button>
        </div>

        {/* Skip hint for non-essential questions */}
        {!isLastQuestion && (
          <p className="text-center text-gray-500 text-sm mt-4">
            You can leave questions blank and come back to them
          </p>
        )}

        {isLastQuestion && !hasIdentityStatement && (
          <p className="text-center text-amber-600 text-sm mt-4">
            Try to complete your identity statement — it&apos;s the most important part!
          </p>
        )}
      </div>
    </div>
  );
}
