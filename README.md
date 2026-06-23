# DevBoard

GitHub productivity dashboard built with Next.js 16, NextAuth v5 and Recharts. Connect your GitHub account and get a visual overview of your commits, repositories, languages and recent activity — all in one place.

## Features

- **GitHub OAuth** — sign in with your GitHub account via NextAuth v5
- **Overview dashboard** — commit activity chart (last 30 days), language distribution donut chart, stat cards and recent activity feed
- **Repositories** — searchable and filterable list of your repos, separated by own and forks, with language pills filter
- **Activity feed** — full event history grouped by day with event type breakdown sidebar
- **Light / dark mode** — system preference detection with zero-FOUC, persisted in `localStorage`

## Tech stack

| Layer | Technology |
|---|---|
| Framework | Next.js 16 (App Router) |
| Auth | NextAuth v5 (Auth.js) with GitHub OAuth |
| Database | Neon (serverless PostgreSQL) |
| ORM | Prisma 5 |
| Charts | Recharts |
| Styling | Tailwind CSS |
| Language | TypeScript |

## Getting started

### 1. Clone and install

```bash
git clone https://github.com/your-username/devboard.git
cd devboard
npm install
```

### 2. Set up environment variables

```bash
cp .env.example .env
```

Fill in `.env`:

```env
DATABASE_URL=         # Neon connection string
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=      # openssl rand -base64 32
GITHUB_CLIENT_ID=     # GitHub OAuth App client ID
GITHUB_CLIENT_SECRET=
```

**Create a GitHub OAuth App:** GitHub → Settings → Developer settings → OAuth Apps → New OAuth App

- Homepage URL: `http://localhost:3000`
- Authorization callback URL: `http://localhost:3000/api/auth/callback/github`

### 3. Set up the database

```bash
npx prisma generate
npx prisma db push
```

### 4. Run

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Project structure

```
app/
  page.tsx                   # Landing page
  dashboard/
    page.tsx                 # Overview
    repos/page.tsx           # Repositories
    activity/page.tsx        # Activity feed
    layout.tsx               # Sidebar layout
  api/auth/[...nextauth]/    # NextAuth route handler
components/
  dashboard/                 # StatCard, RepoCard, ActivityItem, charts, RepoSearch
  ui/                        # ThemeToggle
lib/
  auth.ts                    # NextAuth config
  db.ts                      # Prisma client singleton
  github.ts                  # GitHub API client + data processors
actions/
  auth.ts                    # Server actions for sign in / sign out
prisma/
  schema.prisma              # NextAuth models (User, Account, Session)
```

## Scripts

```bash
npm run dev        # Start dev server
npm run build      # Production build
npm run db:push    # Push Prisma schema to database
npm run db:studio  # Open Prisma Studio
```
