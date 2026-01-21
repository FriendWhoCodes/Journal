import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { DEFAULT_AUTH_CONFIG, type AuthConfig } from './types';

export interface AuthMiddlewareConfig extends AuthConfig {
  protectedPaths?: string[];
  publicPaths?: string[];
  loginPath?: string;
}

const DEFAULT_MIDDLEWARE_CONFIG: AuthMiddlewareConfig = {
  ...DEFAULT_AUTH_CONFIG,
  protectedPaths: [],
  publicPaths: ['/login', '/verify', '/api/auth'],
  loginPath: '/login',
};

export function createAuthMiddleware(config: AuthMiddlewareConfig = {}) {
  const mergedConfig = { ...DEFAULT_MIDDLEWARE_CONFIG, ...config };

  return async function authMiddleware(request: NextRequest) {
    const { pathname } = request.nextUrl;
    const { cookieName, publicPaths, loginPath } = mergedConfig;

    // Check if path is public
    const isPublicPath = publicPaths?.some(path =>
      pathname === path || pathname.startsWith(path + '/')
    );

    if (isPublicPath) {
      return NextResponse.next();
    }

    // Check for session cookie
    const sessionToken = request.cookies.get(cookieName!)?.value;

    if (!sessionToken) {
      // Redirect to login
      const loginUrl = new URL(loginPath!, request.url);
      loginUrl.searchParams.set('redirect', pathname);
      return NextResponse.redirect(loginUrl);
    }

    // Session exists - let the request proceed
    // The actual session validation happens in the route handlers/server components
    return NextResponse.next();
  };
}

export function withAuth(handler: (request: NextRequest) => Promise<Response> | Response) {
  return async function(request: NextRequest) {
    const sessionToken = request.cookies.get(DEFAULT_AUTH_CONFIG.cookieName)?.value;

    if (!sessionToken) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    return handler(request);
  };
}
