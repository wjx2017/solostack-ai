# Solostack AI — AI Tool Stack Configurator for Solopreneurs

Find your perfect AI tool stack in 5 minutes.

## Tech Stack

- Next.js 14 (App Router)
- Tailwind CSS
- Zustand (State Management)
- TypeScript
- Vercel (Deployment)

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the app.

## Project Structure

```
solostack-ai/
├── app/                 # Next.js App Router pages
│   ├── layout.tsx       # Root layout
│   ├── page.tsx         # Home page
│   ├── quiz/page.tsx    # Quiz page
│   └── results/page.tsx # Results page
├── components/
│   ├── shared/          # Header, Footer, CTAButton
│   ├── quiz/            # ProgressBar, QuizWizard
│   └── results/         # StackCard, CostCalculator
├── lib/
│   ├── store.ts         # Zustand store
│   └── engine.ts        # Recommendation engine
└── data/
    ├── tools.json       # Tool database
    └── questions.json   # Quiz questions config
```

## Deploy

Deploy to Vercel:

```bash
vercel
```

## License

MIT
