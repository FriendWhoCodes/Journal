'use client';

import { useContext, useCallback, useEffect, useState } from 'react';
import type { AuthUser, SendMagicLinkResult } from './types';
import { AuthContext } from './components/AuthProvider';

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }

  return context;
}

export function useUser(): AuthUser | null {
  const { user } = useAuth();
  return user;
}

export function useIsAuthenticated(): boolean {
  const { isAuthenticated } = useAuth();
  return isAuthenticated;
}

export function useRequireAuth(redirectTo: string = '/login') {
  const { user, isLoading, isAuthenticated } = useAuth();
  const [shouldRedirect, setShouldRedirect] = useState(false);

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      setShouldRedirect(true);
    }
  }, [isLoading, isAuthenticated]);

  useEffect(() => {
    if (shouldRedirect && typeof window !== 'undefined') {
      const currentPath = window.location.pathname;
      window.location.href = `${redirectTo}?redirect=${encodeURIComponent(currentPath)}`;
    }
  }, [shouldRedirect, redirectTo]);

  return { user, isLoading, isAuthenticated };
}
