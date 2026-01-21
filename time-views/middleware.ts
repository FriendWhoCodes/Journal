import { createAuthMiddleware } from '@mow/auth';

export const middleware = createAuthMiddleware({
  publicPaths: ['/login', '/verify', '/api/auth'],
  loginPath: '/login',
});

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|apple-touch-icon.png|.*\\.svg$).*)',
  ],
};
