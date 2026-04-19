-- Migration: Consolidate GoalSetterUser → AuthUser on GoalSetterSubmission
-- Run on server: psql $DATABASE_URL -f scripts/consolidate-user-migration.sql
--
-- This migration:
-- 1. Adds auth_user_id column to goal_setter_submissions
-- 2. Backfills it from the goal_setter_users.auth_user_id join
-- 3. Adds an index for query performance
--
-- Rollback: ALTER TABLE goal_setter_submissions DROP COLUMN IF EXISTS auth_user_id;

BEGIN;

-- Step 1: Add the column (nullable, no FK constraint yet)
ALTER TABLE goal_setter_submissions
  ADD COLUMN IF NOT EXISTS auth_user_id TEXT;

-- Step 2: Backfill from goal_setter_users join
UPDATE goal_setter_submissions s
SET auth_user_id = u.auth_user_id
FROM goal_setter_users u
WHERE s.user_id = u.id
  AND u.auth_user_id IS NOT NULL
  AND s.auth_user_id IS NULL;

-- Step 3: Add FK constraint
ALTER TABLE goal_setter_submissions
  ADD CONSTRAINT goal_setter_submissions_auth_user_id_fkey
  FOREIGN KEY (auth_user_id) REFERENCES auth_users(id) ON DELETE SET NULL;

-- Step 4: Add index
CREATE INDEX IF NOT EXISTS goal_setter_submissions_auth_user_id_idx
  ON goal_setter_submissions(auth_user_id);

-- Report results
SELECT
  COUNT(*) AS total_submissions,
  COUNT(auth_user_id) AS backfilled,
  COUNT(*) - COUNT(auth_user_id) AS orphaned
FROM goal_setter_submissions;

COMMIT;
