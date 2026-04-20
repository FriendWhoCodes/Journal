import type { PrismaClient } from '@prisma/client';

export type AuditEvent =
  | 'auth.login_requested'
  | 'auth.login_verified'
  | 'auth.session_created'
  | 'auth.session_deleted'
  | 'auth.rate_limited'
  | 'payment.webhook_rejected'
  | 'payment.completed';

export interface AuditPayload {
  event: AuditEvent;
  userId?: string;
  ip?: string;
  [key: string]: unknown;
}

let _prisma: PrismaClient | null = null;

/**
 * Initialize the audit logger with a Prisma client.
 * Call once at app startup. Without init, falls back to console.log.
 */
export function initAuditLog(prisma: PrismaClient): void {
  _prisma = prisma;
}

/**
 * Write an audit event to the database (and console as backup).
 * Non-blocking — never throws.
 */
export function auditLog(payload: AuditPayload): void {
  const { event, userId, ip, ...rest } = payload;
  const timestamp = new Date().toISOString();

  // Always log to console as backup
  console.log(JSON.stringify({ ...payload, timestamp }));

  // Write to DB if initialized
  if (_prisma) {
    (_prisma as any).authAuditLog.create({
      data: {
        event,
        userId: userId ?? null,
        ip: ip ?? null,
        metadata: Object.keys(rest).length > 0 ? rest : undefined,
      },
    }).catch(() => {
      // Silently fail — audit should never break the request
    });
  }
}
