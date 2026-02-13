import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { DEFAULT_AUTH_CONFIG, type AuthConfig } from './types';
import { validateOrigin } from './csrf';

const SESSION_TOKEN_REGEX = /^[a-f0-9]{64}$/;

export interface AuthMiddlewareConfig extends AuthConfig {
  protectedPaths?: string[];
  publicPaths?: string[];
  loginPath?: string;
  allowedOrigins?: string[];
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
    const { cookieName, publicPaths, loginPath, allowedOrigins } = mergedConfig;

    // CSRF: validate Origin header on mutating requests
    if (['POST', 'PUT', 'DELETE', 'PATCH'].includes(request.method)) {
      if (allowedOrigins && allowedOrigins.length > 0) {
        const origin = request.headers.get('origin');
        if (!validateOrigin(origin, allowedOrigins)) {
          return NextResponse.json(
            { error: 'Invalid origin' },
            { status: 403 },
          );
        }
      }
    }

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
      const loginUrl = new URL(loginPath!, request.url);
      loginUrl.searchParams.set('redirect', pathname);
      return NextResponse.redirect(loginUrl);
    }

    // Validate token format: must be exactly 64 hex characters
    if (!SESSION_TOKEN_REGEX.test(sessionToken)) {
      const loginUrl = new URL(loginPath!, request.url);
      loginUrl.searchParams.set('redirect', pathname);
      const response = NextResponse.redirect(loginUrl);
      response.cookies.delete(cookieName!);
      return response;
    }

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
