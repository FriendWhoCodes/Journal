# Time Views

Track your time across life categories - part of the Man of Wisdom suite.

## Features

- **5 Categories**: Code, Writing, Design, Business, Personal
- **Hours Tracking**: Input hours per category per week
- **Accomplishments**: List what was done in each category
- **Week Navigation**: Previous/Next week buttons
- **Year Overview**: Mini grid showing all 52 weeks
- **Current Week Highlight**: Auto-navigate to current week

## Development

```bash
# Install dependencies
npm install

# Copy environment variables
cp .env.example .env

# Generate Prisma client
npx prisma generate

# Run database migrations (first time only)
npx prisma db push

# Start development server
npm run dev
```

The app runs on port 3004 by default.

## Environment Variables

- `DATABASE_URL` - PostgreSQL connection string
- `NEXT_PUBLIC_APP_URL` - App URL for magic links (e.g., http://localhost:3004)
- `RESEND_API_KEY` - Resend API key for sending magic link emails

## Tech Stack

- Next.js 16.1.1
- React 19
- Prisma 6.x
- Tailwind 4
- Shared auth package (@mow/auth)

## Production

The app is deployed to time.manofwisdom.co on Hetzner using PM2 (port 3004).

```bash
# Start in production
pm2 start ecosystem.config.js
```
