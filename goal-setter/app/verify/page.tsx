'use client';

import { useEffect, useState, useCallback, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';

function getSafeRedirect(url: string | null, defaultPath: string): string {
  if (!url) return defaultPath;
  // Only allow relative paths that start with / but not //
  if (url.startsWith('/') && !url.startsWith('//')) return url;
  return defaultPath;
}

function VerifyContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get('token');
  const redirect = getSafeRedirect(searchParams.get('redirect'), '/');

  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [error, setError] = useState<string | null>(null);

  const verifyToken = useCallback(async () => {
    if (!token) {
      setStatus('error');
      setError('Invalid verification link');
      return;
    }

    try {
      const response = await fetch('/api/auth/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token }),
      });

      const data = await response.json();

      if (!response.ok) {
        setStatus('error');
        setError(data.error || 'Verification failed');
        return;
      }

      setStatus('success');

      // Redirect after short delay
      setTimeout(() => {
        router.push(redirect);
      }, 1500);
    } catch (err) {
      setStatus('error');
      setError('Network error. Please try again.');
    }
  }, [token, redirect, router]);

  useEffect(() => {
    verifyToken();
  }, [verifyToken]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-black px-4">
      <div className="max-w-md w-full">
        <div className="bg-gray-900 rounded-2xl border border-gray-800 p-8 text-center">
          {status === 'loading' && (
            <>
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-400 mx-auto mb-4"></div>
              <h2 className="text-xl font-semibold text-white mb-2">Verifying your link...</h2>
              <p className="text-gray-400">Please wait a moment.</p>
            </>
          )}

          {status === 'success' && (
            <>
              <div className="w-12 h-12 bg-green-900/50 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h2 className="text-xl font-semibold text-white mb-2">You're signed in!</h2>
              <p className="text-gray-400">Redirecting you now...</p>
            </>
          )}

          {status === 'error' && (
            <>
              <div className="w-12 h-12 bg-red-900/50 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </div>
              <h2 className="text-xl font-semibold text-white mb-2">Verification failed</h2>
              <p className="text-gray-400 mb-4">{error}</p>
              <button
                onClick={() => router.push('/login')}
                className="bg-amber-500 text-black py-2 px-4 rounded-lg font-medium hover:bg-amber-400 transition"
              >
                Back to Login
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default function VerifyPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-black">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-amber-400"></div>
      </div>
    }>
      <VerifyContent />
    </Suspense>
  );
}
