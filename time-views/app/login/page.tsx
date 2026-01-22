'use client';

import { useSearchParams } from 'next/navigation';
import { useAuth } from '@mow/auth';
import { useState, useEffect, Suspense, type FormEvent } from 'react';
import { useRouter } from 'next/navigation';

function getSafeRedirect(url: string | null, defaultPath: string): string {
  if (!url) return defaultPath;
  // Only allow relative paths that start with / but not //
  if (url.startsWith('/') && !url.startsWith('//')) return url;
  return defaultPath;
}

function LoginContent() {
  const searchParams = useSearchParams();
  const redirect = getSafeRedirect(searchParams.get('redirect'), '/week');
  const { isAuthenticated, isLoading: authLoading, login } = useAuth();
  const router = useRouter();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (!authLoading && isAuthenticated) {
      router.push(redirect);
    }
  }, [isAuthenticated, authLoading, redirect, router]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const trimmedName = name.trim();
      const result = await login(email, trimmedName || undefined);
      if (result.success) {
        setSuccess(true);
      } else {
        setError(result.error || 'Something went wrong');
      }
    } catch {
      setError('Something went wrong');
    } finally {
      setIsLoading(false);
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (success) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 flex items-center justify-center px-4">
        <div className="max-w-md w-full">
          <div className="bg-white rounded-2xl shadow-2xl p-8 text-center">
            <div className="mb-6">
              <div className="w-16 h-16 mx-auto bg-green-100 rounded-full flex items-center justify-center">
                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 19v-8.93a2 2 0 01.89-1.664l7-4.666a2 2 0 012.22 0l7 4.666A2 2 0 0121 10.07V19M3 19a2 2 0 002 2h14a2 2 0 002-2M3 19l6.75-4.5M21 19l-6.75-4.5M3 10l6.75 4.5M21 10l-6.75 4.5m0 0l-1.14.76a2 2 0 01-2.22 0l-1.14-.76" />
                </svg>
              </div>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Check your email</h2>
            <p className="text-gray-600 mb-2">
              We sent a sign-in link to <strong className="text-gray-900">{email}</strong>
            </p>
            <p className="text-sm text-gray-500">
              The link will expire in 15 minutes.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 flex items-center justify-center px-4">
      <div className="max-w-md w-full">
        {/* Hero Section */}
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Time <span className="text-transparent bg-clip-text bg-gradient-to-r from-slate-700 to-blue-600">Views</span>
          </h1>
          <p className="text-lg text-gray-700">
            Track your time across life categories
          </p>
        </div>

        {/* Login Form */}
        <div className="bg-white rounded-2xl shadow-2xl p-6 md:p-8">
          <form onSubmit={handleSubmit}>
            <div className="mb-5">
              <label htmlFor="name" className="block text-lg font-semibold text-gray-800 mb-2">
                What&apos;s your name?
              </label>
              <input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your name"
                className="w-full px-4 py-3 text-lg text-gray-900 placeholder-gray-500 border-2 border-gray-300 rounded-xl focus:border-blue-500 focus:outline-none transition-colors"
                autoFocus
                required
                disabled={isLoading}
              />
            </div>

            <div className="mb-5">
              <label htmlFor="email" className="block text-lg font-semibold text-gray-800 mb-2">
                Your email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full px-4 py-3 text-lg text-gray-900 placeholder-gray-500 border-2 border-gray-300 rounded-xl focus:border-blue-500 focus:outline-none transition-colors"
                required
                disabled={isLoading}
              />
            </div>

            {error && (
              <div className="mb-5 p-3 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm">
                {error}
              </div>
            )}

            <p className="text-sm text-gray-600 mb-5 leading-relaxed">
              We&apos;ll send you a magic link to sign in. No password needed.
            </p>

            <button
              type="submit"
              disabled={isLoading || !email || !name.trim()}
              className="w-full bg-gradient-to-r from-slate-700 to-blue-600 text-white py-3 rounded-xl font-semibold text-lg hover:from-slate-800 hover:to-blue-700 transition-all transform hover:scale-[1.02] shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            >
              {isLoading ? 'Sending...' : 'Continue →'}
            </button>
          </form>
        </div>

        {/* Footer */}
        <div className="mt-8 text-center">
          <p className="text-sm text-gray-600">
            Part of the{' '}
            <a
              href="https://manofwisdom.co"
              className="text-blue-600 hover:underline font-medium"
              target="_blank"
              rel="noopener noreferrer"
            >
              Man of Wisdom
            </a>{' '}
            suite
          </p>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    }>
      <LoginContent />
    </Suspense>
  );
}
