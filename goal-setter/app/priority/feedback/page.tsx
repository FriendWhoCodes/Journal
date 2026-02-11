'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { WISDOM_FEEDBACK_SECTIONS } from '@/lib/types/priority';
import type { WisdomFeedback } from '@/lib/types/priority';

export default function FeedbackPage() {
  const [feedback, setFeedback] = useState<WisdomFeedback | null>(null);
  const [loading, setLoading] = useState(true);
  const [exists, setExists] = useState(false);

  useEffect(() => {
    fetch('/api/priority/feedback')
      .then(res => res.json())
      .then(data => {
        setExists(data.exists);
        if (data.exists) {
          setFeedback(data.feedback);
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-teal-50 flex items-center justify-center">
        <div className="animate-pulse text-emerald-600">Loading feedback...</div>
      </div>
    );
  }

  if (!exists || !feedback) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-teal-50 py-12 px-4">
        <div className="max-w-2xl mx-auto text-center">
          <div className="text-6xl mb-6">🦉</div>
          <h1 className="text-3xl font-bold text-gray-900 mb-4">No Feedback Yet</h1>
          <p className="text-gray-600 mb-8">
            You haven&apos;t submitted a Priority + Wisdom Mode blueprint yet, or no feedback has been created.
          </p>
          <Link href="/" className="px-6 py-3 bg-emerald-600 text-white rounded-xl font-semibold hover:bg-emerald-700 transition-colors">
            Back to Home
          </Link>
        </div>
      </div>
    );
  }

  if (feedback.status !== 'reviewed') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-teal-50 py-12 px-4">
        <div className="max-w-2xl mx-auto text-center">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <div className="text-6xl mb-6">🦉</div>
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Your Review is In Progress</h1>
            <p className="text-gray-600 mb-4">
              The Man of Wisdom is reviewing your blueprint and preparing personalized feedback.
            </p>
            <div className="flex items-center justify-center gap-2 text-emerald-600 mb-8">
              <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>
              <span className="text-sm font-medium">You&apos;ll receive an email when it&apos;s ready</span>
            </div>
            <Link href="/priority/complete" className="px-6 py-3 bg-emerald-600 text-white rounded-xl font-semibold hover:bg-emerald-700 transition-colors">
              Back to Blueprint
            </Link>
          </motion.div>
        </div>
      </div>
    );
  }

  // Feedback is reviewed — show it
  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-teal-50 py-12 px-4">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="inline-block bg-emerald-100 text-emerald-700 px-4 py-2 rounded-full text-sm font-semibold mb-6">
            Personal Wisdom Feedback
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Your Personalized Guidance
          </h1>
          <p className="text-lg text-gray-600 max-w-xl mx-auto">
            The Man of Wisdom has reviewed your 2026 Blueprint and prepared these insights for you.
          </p>
        </motion.div>

        {/* Feedback Sections */}
        <div className="space-y-6">
          {WISDOM_FEEDBACK_SECTIONS.map((section, index) => {
            const content = feedback[section.key];
            if (!content) return null;

            return (
              <motion.div
                key={section.key}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-2xl shadow-lg p-6 md:p-8"
              >
                <div className="flex items-center gap-3 mb-4">
                  <span className="text-2xl">{section.icon}</span>
                  <h2 className="text-xl font-bold text-gray-900">{section.title}</h2>
                </div>
                <div className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                  {content}
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="text-center mt-12 space-y-4"
        >
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/priority/complete"
              className="px-6 py-3 bg-emerald-600 text-white rounded-xl font-semibold hover:bg-emerald-700 transition-colors"
            >
              Back to Blueprint
            </Link>
            <Link
              href="/"
              className="px-6 py-3 bg-gray-200 text-gray-700 rounded-xl font-semibold hover:bg-gray-300 transition-colors"
            >
              Back to Home
            </Link>
          </div>
          {feedback.reviewedAt && (
            <p className="text-gray-400 text-sm">
              Reviewed on {new Date(feedback.reviewedAt).toLocaleDateString('en-US', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </p>
          )}
        </motion.div>
      </div>
    </div>
  );
}
