'use client';

import { useRouter } from 'next/navigation';
import { useAuth } from '@mow/auth';
import { usePriorityMode } from '@/lib/context/PriorityModeContext';
import { PRIORITY_MODE_STEPS } from '@/lib/types/priority';
import { motion } from 'framer-motion';

export default function PriorityOnboarding() {
  const router = useRouter();
  const { user } = useAuth();
  const { data, setCurrentStep, isLoaded } = usePriorityMode();

  const displayName = user?.name?.split(' ')[0] || 'there';

  // Check if user has existing progress
  const hasExistingProgress = data.priorities.some(p => p.name.trim() !== '');

  const handleStart = () => {
    setCurrentStep(PRIORITY_MODE_STEPS.PRIORITIES);
    router.push('/priority/priorities');
  };

  const handleContinue = () => {
    // Resume from where they left off
    if (data.currentStep === PRIORITY_MODE_STEPS.ONBOARDING) {
      setCurrentStep(PRIORITY_MODE_STEPS.PRIORITIES);
      router.push('/priority/priorities');
    } else {
      // Navigate to the appropriate step
      const stepRoutes: Record<number, string> = {
        [PRIORITY_MODE_STEPS.PRIORITIES]: '/priority/priorities',
        [PRIORITY_MODE_STEPS.GOALS]: '/priority/goals',
        [PRIORITY_MODE_STEPS.MILESTONES]: '/priority/milestones',
        [PRIORITY_MODE_STEPS.IDENTITY]: '/priority/identity',
        [PRIORITY_MODE_STEPS.REVIEW]: '/priority/review',
        [PRIORITY_MODE_STEPS.COMPLETE]: '/priority/complete',
      };
      router.push(stepRoutes[data.currentStep] || '/priority/priorities');
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
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 py-12 px-4">
      <div className="max-w-3xl mx-auto">
        {/* Welcome Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <div className="inline-block bg-indigo-100 text-indigo-700 px-4 py-2 rounded-full text-sm font-semibold mb-6">
            Priority Mode
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Welcome, {displayName}
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            You&apos;re about to embark on a meaningful journey of self-discovery and intentional planning.
          </p>
        </motion.div>

        {/* Philosophy Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="bg-white rounded-2xl shadow-xl p-8 md:p-10 mb-8"
        >
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
            Why Priority Mode Works
          </h2>

          <div className="space-y-6 text-gray-700">
            <p className="text-lg leading-relaxed">
              Most people fail at goals because they don&apos;t know <strong className="text-indigo-700">why</strong> those goals matter.
              They set goals that feel mechanical, disconnected from what truly matters to them.
            </p>

            <div className="bg-indigo-50 rounded-xl p-6 border-l-4 border-indigo-500">
              <p className="text-lg font-medium text-indigo-900 italic">
                &ldquo;If you set your priorities first, goals become a natural extension.&rdquo;
              </p>
            </div>

            <p className="text-lg leading-relaxed">
              In this exercise, we start with what matters most to you. Your priorities.
              Once you know your priorities, setting goals for them is simple —
              they&apos;re just the <em>how</em> behind your <em>why</em>.
            </p>
          </div>
        </motion.div>

        {/* What You'll Do Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="bg-white rounded-2xl shadow-xl p-8 md:p-10 mb-8"
        >
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            What You&apos;ll Do
          </h2>

          <div className="space-y-4">
            {[
              { step: 1, title: 'Define Your Priorities', desc: 'What matters most to you in 2026?', icon: '🎯' },
              { step: 2, title: 'Set Goals for Each Priority', desc: 'Turn priorities into concrete, time-bound goals', icon: '📝' },
              { step: 3, title: 'Break Down into Milestones', desc: 'Quarterly/monthly steps to achieve your goals (optional)', icon: '📅' },
              { step: 4, title: 'Define Who You Need to Become', desc: 'The identity shift that makes success inevitable', icon: '🦋' },
              { step: 5, title: 'Review & Finalize', desc: 'See your complete 2026 blueprint', icon: '✨' },
            ].map((item, index) => (
              <motion.div
                key={item.step}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4, delay: 0.4 + index * 0.1 }}
                className="flex items-start gap-4 p-4 rounded-xl hover:bg-gray-50 transition-colors"
              >
                <div className="flex-shrink-0 w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center text-xl">
                  {item.icon}
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">{item.title}</h3>
                  <p className="text-gray-600 text-sm">{item.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* What You'll Get Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl shadow-xl p-8 md:p-10 mb-8 text-white"
        >
          <h2 className="text-2xl font-bold mb-6">
            What You&apos;ll Receive
          </h2>

          <div className="grid md:grid-cols-2 gap-4">
            {[
              { title: 'Comprehensive PDF', desc: 'Your complete 2026 blueprint, beautifully formatted' },
              { title: 'Printable Infographic', desc: 'One-page visual summary of your priorities' },
              { title: 'Phone Wallpaper', desc: 'Your priorities visible every day' },
              { title: 'Desktop Wallpaper', desc: 'Keep your goals in sight while you work' },
              { title: 'Email Summary', desc: 'Everything sent to your inbox' },
              { title: 'Journal Integration', desc: 'Auto-populated in Man of Wisdom Journal' },
            ].map((item) => (
              <div key={item.title} className="flex items-start gap-3">
                <span className="text-indigo-200 text-lg">✓</span>
                <div>
                  <h3 className="font-semibold">{item.title}</h3>
                  <p className="text-indigo-100 text-sm">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Time & Tips Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="bg-amber-50 rounded-2xl p-6 md:p-8 mb-8 border border-amber-200"
        >
          <div className="flex items-start gap-4">
            <span className="text-3xl">⏱️</span>
            <div>
              <h3 className="font-bold text-gray-900 mb-2">This takes about 1 hour</h3>
              <p className="text-gray-700 mb-3">
                This is a deep reflection exercise. Take your time. Your progress is auto-saved,
                so you can pause and return anytime.
              </p>
              <p className="text-gray-600 text-sm">
                <strong>Tip:</strong> Find a quiet space. Maybe make some tea. This hour could shape your entire year.
              </p>
            </div>
          </div>
        </motion.div>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.7 }}
          className="text-center"
        >
          {hasExistingProgress ? (
            <div className="space-y-4">
              <p className="text-gray-600 mb-4">
                You have progress saved. Would you like to continue?
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button
                  onClick={handleContinue}
                  className="px-8 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-semibold text-lg hover:opacity-90 transition-all shadow-lg"
                >
                  Continue Where I Left Off →
                </button>
                <button
                  onClick={handleStart}
                  className="px-8 py-4 bg-white text-indigo-600 border-2 border-indigo-200 rounded-xl font-semibold text-lg hover:bg-indigo-50 transition-all"
                >
                  Start Fresh
                </button>
              </div>
            </div>
          ) : (
            <button
              onClick={handleStart}
              className="px-12 py-5 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-bold text-xl hover:opacity-90 transition-all shadow-xl transform hover:scale-105"
            >
              Begin Your 2026 Blueprint →
            </button>
          )}
        </motion.div>

        {/* Footer Note */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="text-center text-gray-500 text-sm mt-8"
        >
          Your data is private and secure. Only you can see your priorities and goals.
        </motion.p>
      </div>
    </div>
  );
}
