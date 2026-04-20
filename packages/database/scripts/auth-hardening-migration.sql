-- Migration: Auth security hardening
-- Run on server: psql $DATABASE_URL -f packages/database/scripts/auth-hardening-migration.sql
--
-- Creates:
-- 1. auth_rate_limits table (DB-backed rate limiting)
-- 2. auth_audit_logs table (persistent audit trail)
--
-- Rollback:
--   DROP TABLE IF EXISTS auth_rate_limits;
--   DROP TABLE IF EXISTS auth_audit_logs;

BEGIN;

-- Rate limiting table
CREATE TABLE IF NOT EXISTS auth_rate_limits (
  id TEXT PRIMARY KEY,
  key TEXT NOT NULL,
  endpoint TEXT NOT NULL,
  count INTEGER NOT NULL DEFAULT 1,
  window_end TIMESTAMPTZ NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(key, endpoint)
);

CREATE INDEX IF NOT EXISTS auth_rate_limits_window_end_idx
  ON auth_rate_limits(window_end);

-- Audit log table
CREATE TABLE IF NOT EXISTS auth_audit_logs (
  id TEXT PRIMARY KEY,
  event TEXT NOT NULL,
  user_id TEXT,
  ip TEXT,
  metadata JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS auth_audit_logs_event_idx ON auth_audit_logs(event);
CREATE INDEX IF NOT EXISTS auth_audit_logs_user_id_idx ON auth_audit_logs(user_id);
CREATE INDEX IF NOT EXISTS auth_audit_logs_created_at_idx ON auth_audit_logs(created_at);

COMMIT;
