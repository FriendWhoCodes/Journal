'use client';

import { useSearchParams } from 'next/navigation';
import { LoginForm } from '@mow/auth/components';
import { useAuth } from '@mow/auth';
import { useEffect, Suspense } from 'react';
import { useRouter } from 'next/navigation';

function LoginContent() {
  const searchParams = useSearchParams();
  const redirect = searchParams.get('redirect') || '/';
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      router.push(redirect);
    }
  }, [isAuthenticated, isLoading, redirect, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-amber-400"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-black px-4">
      <div className="max-w-md w-full">
        <div className="bg-gray-900 rounded-2xl border border-gray-800 p-8">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-white mb-2">Goal Setter</h1>
            <p className="text-gray-400">Sign in to save your goals</p>
          </div>

          <div className="[&_input]:bg-gray-800 [&_input]:border-gray-700 [&_input]:text-white [&_input]:placeholder-gray-500 [&_label]:text-gray-300 [&_button]:bg-amber-500 [&_button]:hover:bg-amber-600 [&_p]:text-gray-400">
            <LoginForm />
          </div>

          <div className="mt-6 text-center">
            <p className="text-xs text-gray-500">
              Part of the{' '}
              <a
                href="https://manofwisdom.co"
                className="text-amber-400 hover:underline"
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
      <div className="min-h-screen flex items-center justify-center bg-black">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-amber-400"></div>
      </div>
    }>
      <LoginContent />
    </Suspense>
  );
}
