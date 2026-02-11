'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

interface Submission {
  id: string;
  userId: string;
  year: number;
  finalizedAt: string | null;
  createdAt: string;
  user: { id: string; name: string | null; email: string };
  wisdomFeedback: { id: string; status: string; reviewedAt: string | null } | null;
}

export default function AdminDashboard() {
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/admin/submissions')
      .then(res => res.json())
      .then(data => {
        setSubmissions(data.submissions || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const getStatusBadge = (feedback: Submission['wisdomFeedback']) => {
    if (!feedback) {
      return <span className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-xs font-medium">No Feedback</span>;
    }
    switch (feedback.status) {
      case 'reviewed':
        return <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">Reviewed</span>;
      case 'in_progress':
        return <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium">In Progress</span>;
      default:
        return <span className="px-3 py-1 bg-amber-100 text-amber-700 rounded-full text-xs font-medium">Pending</span>;
    }
  };

  if (loading) {
    return <div className="text-center py-12 text-gray-500">Loading submissions...</div>;
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Wisdom Mode Submissions</h1>
        <p className="text-gray-600 mt-1">
          {submissions.length} submission{submissions.length !== 1 ? 's' : ''} requiring review
        </p>
      </div>

      {submissions.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm p-12 text-center">
          <p className="text-gray-500 text-lg">No wisdom mode submissions yet.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {submissions.map(submission => (
            <div key={submission.id} className="bg-white rounded-xl shadow-sm p-6 flex items-center justify-between">
              <div className="flex items-center gap-6">
                <div>
                  <h3 className="font-semibold text-gray-900">
                    {submission.user.name || 'Unnamed User'}
                  </h3>
                  <p className="text-sm text-gray-500">{submission.user.email}</p>
                </div>
                <div className="text-sm text-gray-500">
                  {submission.finalizedAt
                    ? `Finalized ${new Date(submission.finalizedAt).toLocaleDateString()}`
                    : `Created ${new Date(submission.createdAt).toLocaleDateString()}`
                  }
                </div>
                {getStatusBadge(submission.wisdomFeedback)}
              </div>
              <Link
                href={`/admin/review/${submission.id}`}
                className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors"
              >
                Review
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
