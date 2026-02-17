export type AuditEvent =
  | 'auth.login_requested'
  | 'auth.login_verified'
  | 'auth.session_created'
  | 'auth.session_deleted'
  | 'auth.rate_limited';

export interface AuditPayload {
  event: AuditEvent;
  [key: string]: unknown;
}

export function auditLog(payload: AuditPayload): void {
  console.log(JSON.stringify({ ...payload, timestamp: new Date().toISOString() }));
}
