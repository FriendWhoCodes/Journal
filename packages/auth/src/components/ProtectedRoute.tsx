'use client';

import { useRequireAuth } from '../hooks';
import type { ReactNode } from 'react';

interface ProtectedRouteProps {
  children: ReactNode;
  redirectTo?: string;
  loadingComponent?: ReactNode;
}

export function ProtectedRoute({
  children,
  redirectTo = '/login',
  loadingComponent
}: ProtectedRouteProps) {
  const { isLoading, isAuthenticated } = useRequireAuth(redirectTo);

  if (isLoading) {
    return loadingComponent || (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-black"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return <>{children}</>;
}
