'use client';

import { useSearchParams } from 'next/navigation';
import { LoginForm } from '@mow/auth/components';
import { useAuth } from '@mow/auth';
import { useEffect, Suspense } from 'react';
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
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      router.push(redirect);
    }
  }, [isAuthenticated, isLoading, redirect, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-black"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="max-w-md w-full">
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Time Views</h1>
            <p className="text-gray-600">Track your time across life categories</p>
          </div>

          <LoginForm />

          <div className="mt-6 text-center">
            <p className="text-xs text-gray-500">
              Part of the{' '}
              <a
                href="https://manofwisdom.co"
                className="text-blue-600 hover:underline"
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
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-black"></div>
      </div>
    }>
      <LoginContent />
    </Suspense>
  );
}
