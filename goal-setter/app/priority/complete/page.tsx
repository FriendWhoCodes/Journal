'use client';

import { useRouter } from 'next/navigation';
import { usePriorityMode } from '@/lib/context/PriorityModeContext';
import { isPriorityValid, isGoalValid, WisdomFeedback } from '@/lib/types/priority';
import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { pdf } from '@react-pdf/renderer';
import { PriorityPDF } from '@/lib/pdf/PriorityPDF';
import { useAuth } from '@mow/auth';

export default function CompletePage() {
  const router = useRouter();
  const { data, isLoaded } = usePriorityMode();
  const { user } = useAuth();

  const [downloadingPdf, setDownloadingPdf] = useState(false);
  const [downloadingWallpaper, setDownloadingWallpaper] = useState<string | null>(null);
  const [feedbackStatus, setFeedbackStatus] = useState<WisdomFeedback | null>(null);

  // Fetch wisdom feedback status if wisdom mode
  useEffect(() => {
    if (data.wisdomMode && data.finalizedAt) {
      fetch('/api/priority/feedback')
        .then(res => res.json())
        .then(result => {
          if (result.exists) {
            setFeedbackStatus(result.feedback);
          }
        })
        .catch(() => {});
    }
  }, [data.wisdomMode, data.finalizedAt]);

  const validPriorities = data.priorities.filter(isPriorityValid);
  const totalGoals = validPriorities.reduce(
    (sum, p) => sum + p.goals.filter(isGoalValid).length,
    0
  );

  const userName = user?.name || 'Goal Setter';

  const handleDownloadPdf = async () => {
    setDownloadingPdf(true);
    try {
      const blob = await pdf(<PriorityPDF name={userName} data={data} />).toBlob();
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `2026-Blueprint-${userName.replace(/\s+/g, '-')}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('PDF generation error:', error);
      alert('There was an error generating your PDF. Please try again.');
    } finally {
      setDownloadingPdf(false);
    }
  };

  const handleDownloadWallpaper = async (type: 'phone' | 'desktop') => {
    setDownloadingWallpaper(type);
    // TODO: Implement wallpaper generation
    await new Promise(resolve => setTimeout(resolve, 1000));
    setDownloadingWallpaper(null);
    alert(`${type === 'phone' ? 'Phone' : 'Desktop'} wallpaper coming soon!`);
  };

  const handleViewInJournal = () => {
    // Redirect to Journal app (with noopener/noreferrer for security)
    const newWindow = window.open('https://journal.manofwisdom.co', '_blank', 'noopener,noreferrer');
    if (newWindow) newWindow.opener = null;
  };

  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 flex items-center justify-center">
        <div className="animate-pulse text-indigo-600">Loading...</div>
      </div>
    );
  }

  // Check if actually finalized
  if (!data.finalizedAt) {
    router.push('/priority/review');
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 py-8 px-4">
      <div className="max-w-3xl mx-auto">
        {/* Success Header */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
            className="inline-block text-7xl mb-6"
          >
            🎉
          </motion.div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Your 2026 Blueprint is Ready!
          </h1>
          <p className="text-xl text-gray-600 max-w-xl mx-auto">
            You&apos;ve completed the most important hour of your year.
            Now it&apos;s time to live it.
          </p>
        </motion.div>

        {/* Wisdom Feedback Status */}
        {data.wisdomMode && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 }}
            className="bg-emerald-50 rounded-2xl shadow-xl p-6 md:p-8 mb-8 border border-emerald-200"
          >
            <div className="flex items-center gap-3 mb-4">
              <span className="text-3xl">🦉</span>
              <h2 className="text-xl font-bold text-emerald-900">
                {feedbackStatus?.status === 'reviewed'
                  ? 'Your Wisdom Feedback is Ready!'
                  : 'Wisdom Feedback Pending'}
              </h2>
            </div>
            {feedbackStatus?.status === 'reviewed' ? (
              <div>
                <p className="text-emerald-800 mb-4">
                  The Man of Wisdom has reviewed your blueprint and prepared personalized feedback for you.
                </p>
                <Link
                  href="/priority/feedback"
                  className="inline-block bg-emerald-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-emerald-700 transition-colors"
                >
                  View Your Feedback →
                </Link>
              </div>
            ) : (
              <div>
                <p className="text-emerald-800 mb-4">
                  Your blueprint has been submitted for personal review by the Man of Wisdom.
                  You&apos;ll receive an email notification when your personalized feedback is ready.
                </p>
                <div className="flex items-center gap-2 text-sm text-emerald-600">
                  <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>
                  Awaiting review
                </div>
              </div>
            )}
          </motion.div>
        )}

        {/* Summary Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="grid grid-cols-3 gap-4 mb-8"
        >
          <div className="bg-white rounded-xl p-5 text-center shadow-lg">
            <div className="text-4xl font-bold text-indigo-600">{validPriorities.length}</div>
            <div className="text-gray-600">Priorities</div>
          </div>
          <div className="bg-white rounded-xl p-5 text-center shadow-lg">
            <div className="text-4xl font-bold text-purple-600">{totalGoals}</div>
            <div className="text-gray-600">Goals</div>
          </div>
          <div className="bg-white rounded-xl p-5 text-center shadow-lg">
            <div className="text-4xl font-bold text-emerald-600">2026</div>
            <div className="text-gray-600">Your Year</div>
          </div>
        </motion.div>

        {/* Downloads Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white rounded-2xl shadow-xl p-6 md:p-8 mb-6"
        >
          <h2 className="text-xl font-bold text-gray-900 mb-6">📥 Your Downloads</h2>

          <div className="grid md:grid-cols-2 gap-4">
            {/* PDF Download */}
            <button
              onClick={handleDownloadPdf}
              disabled={downloadingPdf}
              className="flex items-center gap-4 p-4 bg-indigo-50 rounded-xl hover:bg-indigo-100 transition-colors text-left group"
            >
              <div className="w-12 h-12 bg-indigo-600 rounded-lg flex items-center justify-center text-white text-xl">
                📄
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900 group-hover:text-indigo-600">
                  {downloadingPdf ? 'Generating...' : 'Download PDF'}
                </h3>
                <p className="text-sm text-gray-500">Complete blueprint document</p>
              </div>
            </button>

            {/* Infographic Download */}
            <button
              onClick={() => alert('Infographic coming soon!')}
              className="flex items-center gap-4 p-4 bg-purple-50 rounded-xl hover:bg-purple-100 transition-colors text-left group"
            >
              <div className="w-12 h-12 bg-purple-600 rounded-lg flex items-center justify-center text-white text-xl">
                🖼️
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900 group-hover:text-purple-600">
                  Download Infographic
                </h3>
                <p className="text-sm text-gray-500">One-page visual summary</p>
              </div>
            </button>

            {/* Phone Wallpaper */}
            <button
              onClick={() => handleDownloadWallpaper('phone')}
              disabled={downloadingWallpaper === 'phone'}
              className="flex items-center gap-4 p-4 bg-emerald-50 rounded-xl hover:bg-emerald-100 transition-colors text-left group"
            >
              <div className="w-12 h-12 bg-emerald-600 rounded-lg flex items-center justify-center text-white text-xl">
                📱
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900 group-hover:text-emerald-600">
                  {downloadingWallpaper === 'phone' ? 'Generating...' : 'Phone Wallpaper'}
                </h3>
                <p className="text-sm text-gray-500">Your priorities, always visible</p>
              </div>
            </button>

            {/* Desktop Wallpaper */}
            <button
              onClick={() => handleDownloadWallpaper('desktop')}
              disabled={downloadingWallpaper === 'desktop'}
              className="flex items-center gap-4 p-4 bg-amber-50 rounded-xl hover:bg-amber-100 transition-colors text-left group"
            >
              <div className="w-12 h-12 bg-amber-600 rounded-lg flex items-center justify-center text-white text-xl">
                🖥️
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900 group-hover:text-amber-600">
                  {downloadingWallpaper === 'desktop' ? 'Generating...' : 'Desktop Wallpaper'}
                </h3>
                <p className="text-sm text-gray-500">Goals in sight while you work</p>
              </div>
            </button>
          </div>
        </motion.div>

        {/* Journal Integration */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl shadow-xl p-6 md:p-8 mb-6 text-white"
        >
          <h2 className="text-xl font-bold mb-4">📓 Continue in Man of Wisdom Journal</h2>
          <p className="text-indigo-100 mb-6">
            Your priorities and goals are now saved. Track your daily progress,
            reflect on your journey, and stay accountable with the Journal.
          </p>

          <div className="flex flex-col sm:flex-row gap-4">
            <button
              onClick={handleViewInJournal}
              className="flex-1 bg-white text-indigo-600 py-3 px-6 rounded-xl font-semibold hover:bg-indigo-50 transition-colors text-center"
            >
              Open Journal →
            </button>
            <a
              href="https://journal.manofwisdom.co"
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 bg-white/20 text-white py-3 px-6 rounded-xl font-semibold hover:bg-white/30 transition-colors text-center border border-white/30"
            >
              Learn More
            </a>
          </div>
        </motion.div>

        {/* Quick Summary Preview */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-white rounded-2xl shadow-xl p-6 md:p-8 mb-6"
        >
          <h2 className="text-xl font-bold text-gray-900 mb-4">Your Top Priorities</h2>

          <div className="space-y-3">
            {validPriorities.slice(0, 5).map((priority, index) => (
              <div
                key={priority.id}
                className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg"
              >
                <span className="flex-shrink-0 w-8 h-8 bg-indigo-600 text-white rounded-full flex items-center justify-center font-bold text-sm">
                  {index + 1}
                </span>
                <span className="font-medium text-gray-900">{priority.name}</span>
                <span className="text-sm text-gray-500 ml-auto">
                  {priority.goals.filter(isGoalValid).length} goal(s)
                </span>
              </div>
            ))}
          </div>

          {data.identity.iAmSomeoneWho && (
            <div className="mt-6 p-4 bg-indigo-50 rounded-xl border border-indigo-200">
              <h3 className="text-sm font-semibold text-indigo-600 mb-2">Your Identity Statement</h3>
              <p className="text-gray-800 italic">&ldquo;{data.identity.iAmSomeoneWho}&rdquo;</p>
            </div>
          )}
        </motion.div>

        {/* Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="flex flex-col sm:flex-row gap-4 justify-center"
        >
          <Link
            href="/priority/review"
            className="px-6 py-3 bg-gray-200 text-gray-700 rounded-xl font-semibold hover:bg-gray-300 transition-colors text-center"
          >
            ← Edit My Blueprint
          </Link>
          <Link
            href="/"
            className="px-6 py-3 bg-indigo-600 text-white rounded-xl font-semibold hover:bg-indigo-700 transition-colors text-center"
          >
            Back to Home
          </Link>
        </motion.div>

        {/* Footer Message */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="text-center mt-12"
        >
          <p className="text-gray-500">
            Remember: Goals don&apos;t achieve themselves. Show up every day.
          </p>
          <p className="text-gray-400 text-sm mt-2">
            Finalized on {new Date(data.finalizedAt!).toLocaleDateString('en-US', {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </p>
        </motion.div>
      </div>
    </div>
  );
}
