// Types
export type {
  AuthUser,
  AuthSession,
  AuthMagicLink,
  AuthConfig,
  SendMagicLinkResult,
  VerifyMagicLinkResult,
  AuthContextValue,
} from './types';
export { DEFAULT_AUTH_CONFIG } from './types';

// Magic Link
export {
  generateToken,
  createMagicLink,
  verifyMagicLink,
  sendMagicLinkEmail,
} from './magic-link';

// Session
export {
  generateSessionToken,
  createSession,
  getSessionByToken,
  deleteSession,
  deleteAllUserSessions,
  setSessionCookie,
  deleteSessionCookie,
  getSessionTokenFromCookies,
} from './session';

// Middleware
export {
  createAuthMiddleware,
  withAuth,
  type AuthMiddlewareConfig,
} from './middleware';

// Hooks
export {
  useAuth,
  useUser,
  useIsAuthenticated,
  useRequireAuth,
} from './hooks';

// Components
export {
  AuthProvider,
  AuthContext,
  LoginForm,
  ProtectedRoute,
} from './components';
