# Testing Infrastructure

This document describes the testing infrastructure for the Man of Wisdom monorepo. It covers testing strategies, tools, and best practices that all agents and developers should follow.

## Overview

We use a multi-layered testing approach to ensure reliability:

1. **Unit Tests** - Test individual components and functions
2. **Integration Tests** - Test API endpoints and component interactions
3. **Smoke Tests** - Verify critical paths work after deployment
4. **Health Checks** - Runtime monitoring of application health

## Quick Start

```bash
# Navigate to the app directory
cd homepage

# Install dependencies
npm install

# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run with coverage
npm run test:coverage

# Run smoke tests against local
npm run test:smoke

# Run smoke tests against production
npm run test:smoke:prod
```

## Test Tools

| Tool | Purpose |
|------|---------|
| [Vitest](https://vitest.dev/) | Fast, Vite-native test runner |
| [React Testing Library](https://testing-library.com/docs/react-testing-library/intro/) | Component testing utilities |
| [jsdom](https://github.com/jsdom/jsdom) | Browser environment for tests |

## Directory Structure

```
homepage/
├── tests/
│   ├── setup.ts           # Test configuration and mocks
│   ├── health.test.ts     # Health check API tests
│   ├── smoke.test.ts      # Smoke tests for deployments
│   └── components.test.tsx # Component unit tests
├── vitest.config.ts       # Vitest configuration
└── package.json           # Test scripts
```

## Test Types

### 1. Unit Tests

Test individual components in isolation.

```typescript
// tests/components.test.tsx
import { render, screen } from "@testing-library/react";
import Hero from "../app/components/Hero";

describe("Hero Component", () => {
  it("should render the main heading", () => {
    render(<Hero />);
    expect(screen.getByText(/Ancient Wisdom/i)).toBeInTheDocument();
  });
});
```

**Best Practices:**
- Test behavior, not implementation
- Use descriptive test names
- One assertion per test when possible
- Mock external dependencies

### 2. Health Check API

Every app should expose a `/api/health` endpoint for monitoring.

```typescript
// app/api/health/route.ts
export async function GET() {
  return NextResponse.json({
    status: "healthy",
    timestamp: new Date().toISOString(),
    checks: [
      { name: "runtime", status: "pass" },
      { name: "memory", status: "pass" },
    ],
  });
}
```

**Response Format:**
```json
{
  "status": "healthy" | "degraded" | "unhealthy",
  "timestamp": "2024-01-01T00:00:00.000Z",
  "version": "1.0.0",
  "uptime": 3600,
  "checks": [
    { "name": "runtime", "status": "pass", "message": "..." },
    { "name": "database", "status": "pass", "message": "..." }
  ]
}
```

### 3. Smoke Tests

Run against live deployments to verify critical functionality.

```typescript
// tests/smoke.test.ts
const BASE_URL = process.env.BASE_URL || "http://localhost:3003";

describe("Smoke Tests", () => {
  it("should return 200 for homepage", async () => {
    const response = await fetch(BASE_URL);
    expect(response.status).toBe(200);
  });

  it("should have healthy status", async () => {
    const response = await fetch(`${BASE_URL}/api/health`);
    const data = await response.json();
    expect(data.status).toBe("healthy");
  });
});
```

**Running against different environments:**
```bash
# Local development
BASE_URL=http://localhost:3003 npm run test:smoke

# Staging
BASE_URL=https://staging.manofwisdom.co npm run test:smoke

# Production
BASE_URL=https://manofwisdom.co npm run test:smoke
```

## CI/CD Integration

We use a multi-stage CI/CD pipeline that **blocks deployment if any test fails**.

### Pipeline Stages

```
┌─────────────────────────────────────────────────────────────────┐
│                        PR / Push to Main                        │
└─────────────────────────────────────────────────────────────────┘
                               │
                               ▼
┌─────────────────────────────────────────────────────────────────┐
│  STAGE 1: Lint & Type Check                                     │
│  - ESLint                                                       │
│  - TypeScript type checking                                     │
└─────────────────────────────────────────────────────────────────┘
                               │
                               ▼
┌─────────────────────────────────────────────────────────────────┐
│  STAGE 2: Unit & Integration Tests                              │
│  - Vitest unit tests                                            │
│  - Component tests                                              │
│  - Health check API tests                                       │
└─────────────────────────────────────────────────────────────────┘
                               │
                               ▼
┌─────────────────────────────────────────────────────────────────┐
│  STAGE 3: Build Verification                                    │
│  - Next.js production build                                     │
│  - Verify build output exists                                   │
└─────────────────────────────────────────────────────────────────┘
                               │
                    ┌──────────┴──────────┐
                    │                     │
              (Pull Request)        (Push to Main)
                    │                     │
                    ▼                     ▼
┌─────────────────────────┐  ┌────────────────────────────────────┐
│  PR Check Complete      │  │  STAGE 4: Deploy to Production     │
│  Ready for review       │  │  - SSH to Hetzner                  │
└─────────────────────────┘  │  - Zero-downtime deployment        │
                             │  - Health check verification       │
                             └────────────────────────────────────┘
                                          │
                                          ▼
                             ┌────────────────────────────────────┐
                             │  STAGE 5: Production Smoke Tests   │
                             │  - Verify homepage loads           │
                             │  - Verify /music page              │
                             │  - Verify /api/health              │
                             │  - Performance checks              │
                             └────────────────────────────────────┘
```

### On Pull Request
1. ✅ Lint & type check
2. ✅ Run unit tests
3. ✅ Build verification
4. ❌ **No deployment** (PRs don't deploy)

### On Push to Main
1. ✅ All PR checks run first
2. ✅ Deploy only if all tests pass
3. ✅ Post-deployment smoke tests
4. 🚨 Alert if smoke tests fail

### Workflow File
```yaml
# .github/workflows/homepage-ci.yml
# See full file in repository
```

## Branch Protection Rules (REQUIRED)

To prevent broken code from reaching production, configure branch protection on GitHub:

### Setup Instructions

1. Go to **Repository Settings** → **Branches**
2. Click **Add branch protection rule**
3. Set **Branch name pattern**: `main`
4. Enable these settings:

| Setting | Value |
|---------|-------|
| **Require a pull request before merging** | ✅ Enabled |
| **Require approvals** | 1 (recommended) |
| **Dismiss stale PR approvals** | ✅ Enabled |
| **Require status checks to pass** | ✅ Enabled |
| **Require branches to be up to date** | ✅ Enabled |
| **Status checks required** | `Lint & Type Check`, `Run Tests`, `Build Application`, `PR Check` |
| **Require conversation resolution** | ✅ Enabled |
| **Do not allow bypassing** | ✅ Enabled (even for admins) |

### Required Status Checks

Add these exact check names:
- `Lint & Type Check`
- `Run Tests`
- `Build Application`
- `PR Check`

### Why This Matters

Without branch protection:
- ❌ Anyone can push directly to main
- ❌ Broken code can reach production
- ❌ Tests can be skipped

With branch protection:
- ✅ All changes go through PRs
- ✅ Tests MUST pass before merge
- ✅ Code review required
- ✅ Production stays stable

## Deployment Verification

The deployment script includes automatic health checks:

```bash
# homepage/scripts/deploy.sh
# After deployment, verify the app is healthy
HEALTH_CHECK_URL="http://localhost:3003/api/health"
MAX_RETRIES=10

for i in $(seq 1 $MAX_RETRIES); do
  HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" "$HEALTH_CHECK_URL")
  if [ "$HTTP_CODE" = "200" ]; then
    echo "Health check passed!"
    break
  fi
  sleep 2
done
```

## Adding Tests to New Apps

When creating a new app in the monorepo:

1. **Install dependencies:**
   ```bash
   npm install -D vitest @testing-library/react @testing-library/jest-dom jsdom @vitejs/plugin-react
   ```

2. **Create vitest.config.ts:**
   ```typescript
   import { defineConfig } from "vitest/config";
   import react from "@vitejs/plugin-react";

   export default defineConfig({
     plugins: [react()],
     test: {
       environment: "jsdom",
       globals: true,
       setupFiles: ["./tests/setup.ts"],
     },
   });
   ```

3. **Create tests/setup.ts:**
   ```typescript
   import "@testing-library/jest-dom/vitest";
   // Add your mocks here
   ```

4. **Add health check endpoint:**
   ```typescript
   // app/api/health/route.ts
   // Copy from homepage implementation
   ```

5. **Add test scripts to package.json:**
   ```json
   {
     "scripts": {
       "test": "vitest run",
       "test:watch": "vitest",
       "test:smoke": "vitest run tests/smoke.test.ts"
     }
   }
   ```

6. **Create GitHub Actions workflow** (copy from test-homepage.yml)

## Monitoring

### Uptime Kuma

We use Uptime Kuma for external monitoring:
- URL: `http://94.130.97.253:3001`
- Monitors all production endpoints
- Alerts on downtime

### Health Check Endpoints

| App | Health Check URL |
|-----|------------------|
| Homepage | https://manofwisdom.co/api/health |
| Goal Setter | https://goals.manofwisdom.co/api/health |
| Time Views | https://time.manofwisdom.co/api/health |

## Troubleshooting

### Tests failing locally but passing in CI
- Clear node_modules and reinstall: `rm -rf node_modules && npm install`
- Check Node.js version matches CI (v20)

### Smoke tests timing out
- Increase timeout in vitest.config.ts
- Check if the target URL is accessible
- Verify firewall/security group rules

### Component tests failing with "act" warnings
- Wrap state changes in `act()`
- Use `waitFor()` for async operations
- Check for missing cleanup in useEffect

## Best Practices

1. **Write tests first** (TDD) for critical paths
2. **Keep tests fast** - mock external services
3. **Test the contract** - public API, not implementation
4. **Use meaningful assertions** - test what matters to users
5. **Maintain test data** - use factories/fixtures
6. **Review test coverage** - aim for 80%+ on critical code
7. **Run tests before committing** - use pre-commit hooks

## Related Documentation

- [Deployment Guide](./DEPLOYMENT.md) - Deployment procedures
- [Architecture](../.context/architecture.md) - System architecture
- [Contributing](../CONTRIBUTING.md) - How to contribute
