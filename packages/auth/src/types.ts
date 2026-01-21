export interface AuthUser {
  id: string;
  email: string;
  name: string | null;
  emailVerified: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface AuthSession {
  id: string;
  userId: string;
  token: string;
  expiresAt: Date;
  createdAt: Date;
  user?: AuthUser;
}

export interface AuthMagicLink {
  id: string;
  userId: string;
  token: string;
  expiresAt: Date;
  usedAt: Date | null;
  createdAt: Date;
}

export interface AuthConfig {
  cookieName?: string;
  cookieDomain?: string;
  sessionExpiryDays?: number;
  magicLinkExpiryMinutes?: number;
  baseUrl?: string;
}

export const DEFAULT_AUTH_CONFIG: Required<AuthConfig> = {
  cookieName: 'mow_session',
  cookieDomain: '.manofwisdom.co',
  sessionExpiryDays: 30,
  magicLinkExpiryMinutes: 15,
  baseUrl: '',
};

export interface SendMagicLinkResult {
  success: boolean;
  error?: string;
}

export interface VerifyMagicLinkResult {
  success: boolean;
  session?: AuthSession;
  error?: string;
}

export interface AuthContextValue {
  user: AuthUser | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string) => Promise<SendMagicLinkResult>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
}
