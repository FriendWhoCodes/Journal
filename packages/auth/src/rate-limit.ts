export interface RateLimitResult {
  allowed: boolean;
  retryAfterMs?: number;
}

export interface RateLimitConfig {
  maxRequests: number;
  windowMs: number;
  maxEntries?: number;
}

export class RateLimiter {
  private map = new Map<string, { count: number; resetAt: number }>();
  private config: Required<RateLimitConfig>;

  constructor(config: RateLimitConfig) {
    this.config = {
      maxEntries: 10000,
      ...config,
    };
  }

  check(key: string): RateLimitResult {
    const now = Date.now();

    // Cleanup if too many entries
    if (this.map.size > this.config.maxEntries) {
      for (const [k, v] of this.map) {
        if (v.resetAt < now) this.map.delete(k);
      }
    }

    const record = this.map.get(key);

    if (!record || record.resetAt < now) {
      this.map.set(key, { count: 1, resetAt: now + this.config.windowMs });
      return { allowed: true };
    }

    if (record.count >= this.config.maxRequests) {
      return { allowed: false, retryAfterMs: record.resetAt - now };
    }

    record.count++;
    return { allowed: true };
  }
}

// Pre-configured instances for auth endpoints
// 5 login requests per IP per 15 minutes
export const loginRateLimiter = new RateLimiter({
  maxRequests: 5,
  windowMs: 15 * 60 * 1000,
});

// 10 verify requests per IP per 15 minutes
export const verifyRateLimiter = new RateLimiter({
  maxRequests: 10,
  windowMs: 15 * 60 * 1000,
});
