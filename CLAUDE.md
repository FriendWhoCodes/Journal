# CLAUDE.md

## Workflow Rules
- **Never push directly to main.** Always create a feature branch and go through a PR, even for small changes. The only exception is a production emergency (site down, auth broken, etc).
- Always run `git pull origin main` before creating a new branch.
- Deploy scripts are in each app's `scripts/deploy.sh`. Always pull latest on the server before deploying: `ssh hetzner "cd /var/www/Journal && git fetch origin && git reset --hard origin/main"`

## Deployment
- SSH to Hetzner server: `ssh hetzner`
- Goal Setter: `ssh hetzner "cd /var/www/Journal/goal-setter && bash scripts/deploy.sh"`
- Homepage: `ssh hetzner "cd /var/www/Journal/homepage && bash scripts/deploy.sh"`
- Deploy scripts validate required env vars before proceeding — if any are missing, the deploy aborts and the old version keeps running.
- Apps run via PM2 on the server.

## Repo Structure
- Monorepo at `L:\Code\Journal`
- Apps: `homepage/`, `goal-setter/`, `time-views/`
- Shared packages: `packages/auth/`, `packages/database/`
- GitHub: `FriendWhoCodes/Journal`

## Branch Protection
- Required status checks on main: Lint & Type Check, Run Tests, Build Application, PR Check
- No required reviews (solo developer)
- `homepage-ci.yml` is path-filtered to `homepage/**` only
- No CI workflow exists for `goal-setter/` or `time-views/` yet

## Known Warnings (pre-existing, safe to ignore)
- `crypto` module in Edge Runtime warning from `packages/auth/src/magic-link.ts` and `session.ts`
- Next.js middleware deprecation warning (use "proxy" instead)
- Multiple lockfile warnings (workspace root detection)
