'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { WISDOM_FEEDBACK_SECTIONS, isPriorityValid, isGoalValid } from '@/lib/types/priority';
import type { Priority, Identity, WisdomFeedback } from '@/lib/types/priority';

interface SubmissionData {
  id: string;
  priorities: Priority[];
  identity: Identity;
  year: number;
  finalizedAt: string | null;
  user: { id: string; name: string | null; email: string };
  wisdomFeedback: WisdomFeedback | null;
}

export default function AdminReviewPage() {
  const params = useParams();
  const router = useRouter();
  const submissionId = params.submissionId as string;

  const [submission, setSubmission] = useState<SubmissionData | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [feedback, setFeedback] = useState({
    priorityAnalysis: '',
    goalFeedback: '',
    suggestions: '',
    identityInsights: '',
    overallWisdom: '',
  });

  useEffect(() => {
    fetch(`/api/admin/feedback/${submissionId}`)
      .then(res => res.json())
      .then(data => {
        if (data.submission) {
          setSubmission(data.submission);
          if (data.submission.wisdomFeedback) {
            const fb = data.submission.wisdomFeedback;
            setFeedback({
              priorityAnalysis: fb.priorityAnalysis || '',
              goalFeedback: fb.goalFeedback || '',
              suggestions: fb.suggestions || '',
              identityInsights: fb.identityInsights || '',
              overallWisdom: fb.overallWisdom || '',
            });
          }
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [submissionId]);

  const handleSaveDraft = async () => {
    setSaving(true);
    try {
      await fetch(`/api/admin/feedback/${submissionId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...feedback, markReviewed: false }),
      });
      alert('Draft saved!');
    } catch {
      alert('Error saving draft');
    } finally {
      setSaving(false);
    }
  };

  const handleMarkReviewed = async () => {
    if (!confirm('This will mark the feedback as reviewed and send an email notification to the user. Continue?')) return;

    setSaving(true);
    try {
      const res = await fetch(`/api/admin/feedback/${submissionId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...feedback, markReviewed: true }),
      });
      const result = await res.json();
      if (result.success) {
        alert('Feedback marked as reviewed and notification sent!');
        router.push('/admin');
      }
    } catch {
      alert('Error marking as reviewed');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="text-center py-12 text-gray-500">Loading submission...</div>;
  }

  if (!submission) {
    return <div className="text-center py-12 text-gray-500">Submission not found.</div>;
  }

  const validPriorities = (submission.priorities || []).filter(isPriorityValid);
  const isReviewed = submission.wisdomFeedback?.status === 'reviewed';

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <Link href="/admin" className="text-sm text-indigo-600 hover:text-indigo-800 mb-2 inline-block">
            ← Back to Submissions
          </Link>
          <h1 className="text-2xl font-bold text-gray-900">
            Review: {submission.user.name || submission.user.email}
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            {submission.user.email} — Finalized {submission.finalizedAt
              ? new Date(submission.finalizedAt).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })
              : 'Not finalized'}
          </p>
        </div>
        {isReviewed && (
          <span className="px-4 py-2 bg-green-100 text-green-700 rounded-full text-sm font-medium">
            Reviewed
          </span>
        )}
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Left: User's Submission (Read-only) */}
        <div className="space-y-6">
          <h2 className="text-lg font-bold text-gray-900 border-b pb-2">User&apos;s Blueprint</h2>

          {/* Priorities & Goals */}
          {validPriorities.map((priority, pIndex) => (
            <div key={priority.id} className="bg-white rounded-xl shadow-sm p-5">
              <div className="flex items-start gap-3 mb-3">
                <span className="flex-shrink-0 w-7 h-7 bg-indigo-600 text-white rounded-full flex items-center justify-center text-xs font-bold">
                  {pIndex + 1}
                </span>
                <div>
                  <h3 className="font-semibold text-gray-900">{priority.name}</h3>
                  {priority.why && (
                    <p className="text-sm text-gray-500 italic mt-1">&ldquo;{priority.why}&rdquo;</p>
                  )}
                </div>
              </div>

              <div className="ml-10 space-y-2">
                {priority.goals.filter(isGoalValid).map((goal, gIndex) => (
                  <div key={goal.id} className="bg-gray-50 rounded-lg p-3">
                    <p className="text-xs text-indigo-600 font-medium">Goal {gIndex + 1}</p>
                    <p className="text-gray-800 text-sm">{goal.what}</p>
                    <p className="text-xs text-gray-500">Target: {goal.byWhen || 'Not set'}</p>
                    {goal.successLooksLike && (
                      <p className="text-xs text-gray-600 mt-1">Success: {goal.successLooksLike}</p>
                    )}
                    {goal.milestones.length > 0 && (
                      <div className="mt-2 flex gap-1">
                        {goal.milestones.map(m => (
                          <span key={m.id} className="text-xs bg-indigo-100 text-indigo-700 px-2 py-0.5 rounded">
                            {m.period}
                            {m.description && `: ${m.description.substring(0, 30)}...`}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}

          {/* Identity Section */}
          <div className="bg-white rounded-xl shadow-sm p-5">
            <h3 className="font-semibold text-gray-900 mb-3">Identity Transformation</h3>

            {submission.identity.iAmSomeoneWho && (
              <div className="bg-indigo-50 rounded-lg p-3 mb-3 border border-indigo-200">
                <p className="text-xs font-semibold text-indigo-600 mb-1">I Am Someone Who...</p>
                <p className="text-sm text-gray-800">{submission.identity.iAmSomeoneWho}</p>
              </div>
            )}

            <div className="grid grid-cols-2 gap-3">
              {submission.identity.habitsToBuild && (
                <div className="bg-green-50 rounded-lg p-3">
                  <p className="text-xs font-semibold text-green-700 mb-1">Habits to Build</p>
                  <p className="text-xs text-gray-700">{submission.identity.habitsToBuild}</p>
                </div>
              )}
              {submission.identity.habitsToEliminate && (
                <div className="bg-red-50 rounded-lg p-3">
                  <p className="text-xs font-semibold text-red-700 mb-1">Habits to Eliminate</p>
                  <p className="text-xs text-gray-700">{submission.identity.habitsToEliminate}</p>
                </div>
              )}
              {submission.identity.beliefsToHold && (
                <div className="bg-blue-50 rounded-lg p-3">
                  <p className="text-xs font-semibold text-blue-700 mb-1">Beliefs to Hold</p>
                  <p className="text-xs text-gray-700">{submission.identity.beliefsToHold}</p>
                </div>
              )}
              {submission.identity.personWhoAchieves && (
                <div className="bg-purple-50 rounded-lg p-3">
                  <p className="text-xs font-semibold text-purple-700 mb-1">Person Who Achieves</p>
                  <p className="text-xs text-gray-700">{submission.identity.personWhoAchieves}</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right: Feedback Form */}
        <div className="space-y-6">
          <h2 className="text-lg font-bold text-gray-900 border-b pb-2">Your Feedback</h2>

          {WISDOM_FEEDBACK_SECTIONS.map(section => (
            <div key={section.key} className="bg-white rounded-xl shadow-sm p-5">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xl">{section.icon}</span>
                <h3 className="font-semibold text-gray-900">{section.title}</h3>
              </div>
              <p className="text-xs text-gray-500 mb-3">{section.description}</p>
              <textarea
                value={feedback[section.key]}
                onChange={e => setFeedback(prev => ({ ...prev, [section.key]: e.target.value }))}
                placeholder={`Write your ${section.title.toLowerCase()} here...`}
                className="w-full h-32 border-2 border-gray-200 rounded-lg p-3 text-sm focus:border-indigo-500 focus:outline-none resize-y"
              />
              <p className="text-xs text-gray-400 mt-1 text-right">
                {feedback[section.key].length} characters
              </p>
            </div>
          ))}

          {/* Action Buttons */}
          <div className="sticky bottom-4 bg-white rounded-xl shadow-lg p-4 border border-gray-200 flex gap-4">
            <button
              onClick={handleSaveDraft}
              disabled={saving}
              className="flex-1 px-4 py-3 bg-gray-200 text-gray-700 rounded-lg font-medium hover:bg-gray-300 transition-colors disabled:opacity-50"
            >
              {saving ? 'Saving...' : 'Save Draft'}
            </button>
            <button
              onClick={handleMarkReviewed}
              disabled={saving}
              className="flex-1 px-4 py-3 bg-emerald-600 text-white rounded-lg font-medium hover:bg-emerald-700 transition-colors disabled:opacity-50"
            >
              {saving ? 'Saving...' : 'Mark Reviewed & Notify'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
