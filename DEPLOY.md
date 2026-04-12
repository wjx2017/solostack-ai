# Solostack AI Deployment Guide

## Prerequisites

- Node.js 18+ installed
- Git installed
- Vercel account (free tier works)

## Method 1: GitHub + Vercel (Recommended)

### Step 1: Push to GitHub

```bash
git init
git remote add origin git@github.com:<your-username>/solostack-ai.git
git add .
git commit -m "Initial commit"
git push -u origin main
```

### Step 2: Deploy on Vercel

1. Log in to [vercel.com](https://vercel.com)
2. Click "Add New Project"
3. Select the `solostack-ai` repository
4. Keep default config (Next.js auto-detected)
5. Click "Deploy"
6. Wait 1-2 minutes for the preview link

## Method 2: Vercel CLI

```bash
vercel login        # Browser login
vercel --yes        # First deployment
vercel --prod       # Production deploy
```

## Environment Variables (Optional)

No env vars required to run. Can be extended later:

| Variable | Description |
|----------|-------------|
| `NEXT_PUBLIC_ANALYTICS_ID` | Plausible/Umami analytics ID |
| `AFFILIATE_TAG` | Affiliate tracking tag |

## Local Development

```bash
npm install
npm run dev        # Dev server
npm run build      # Production build
npm run start      # Production server
```

## Project Structure

```
solostack-ai/
├── app/                 # Next.js pages
│   ├── layout.tsx       # Root layout
│   ├── page.tsx         # Home page
│   ├── quiz/page.tsx    # Quiz page
│   └── results/page.tsx # Results page
├── components/
│   ├── shared/          # Header, Footer, CTAButton
│   ├── quiz/            # ProgressBar, QuizWizard
│   └── results/         # StackCard, CostCalculator
├── lib/
│   ├── store.ts         # Zustand state management
│   └── engine.ts        # Recommendation engine
├── data/
│   ├── tools.json       # Tool database (10 tools)
│   └── questions.json   # Quiz config (5 questions)
├── DEPLOY.md
└── README.md
```

## Build Output

All pages are statically generated — Vercel free tier is fully sufficient.
