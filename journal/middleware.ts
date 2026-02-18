import { createAuthMiddleware } from '@mow/auth';

export const middleware = createAuthMiddleware({
  publicPaths: ['/login', '/verify', '/api/auth'],
  loginPath: '/login',
  allowedOrigins: [
    process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3005',
    'https://journal.manofwisdom.co',
  ],
});

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|apple-touch-icon.png|\\.well-known|.*\\.svg$).*)',
  ],
};
