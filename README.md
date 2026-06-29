# KoinX — Tax Loss Harvesting Tool

A production-grade React + TypeScript application for simulating tax loss harvesting on crypto portfolios.

## Live Demo

> Deploy to Vercel: `npx vercel --prod` from the project root.

## Screenshots

| Login | Dashboard | After Harvesting |
|-------|-----------|-----------------|
| Auth with Google OAuth flow | Real-time capital gains cards | Savings badge appears on selection |

## Tech Stack

- **React 18** with functional components & hooks
- **TypeScript** — fully typed throughout
- **Context API** — AuthContext + HarvestingContext for global state
- **CSS Variables** — dark-mode-first design system, no external UI lib
- **Mock API** — promise-based with realistic delays (no server needed)

## Setup Instructions

```bash
# 1. Install dependencies
npm install

# 2. Start development server
npm start

# 3. Build for production
npm run build
```

Open [http://localhost:3000](http://localhost:3000).

## Features

- **Auth flow** — Sign up, log in, Google OAuth (mocked), password strength meter, session persistence via localStorage
- **Capital Gains cards** — Pre & After Harvesting, real-time updates on selection
- **Holdings table** — 17 assets, sortable, select/deselect all, View All toggle
- **Tax savings badge** — appears only when after-harvesting gains < pre-harvesting gains
- **Skeleton loaders** — on both cards and table
- **Fully responsive** — mobile-first layout, collapsing grid
- **Zero third-party UI libraries** — custom checkbox, spinner, badge components

## Architecture

```
src/
├── components/
│   ├── Auth/          # LoginPage, SignupPage
│   ├── Dashboard/     # CapitalGainsCard, Dashboard
│   ├── Holdings/      # HoldingsTable
│   └── Layout/        # Navbar
├── context/
│   ├── AuthContext    # User authentication state
│   └── HarvestingContext  # Holdings, selections, gain computation
├── services/
│   └── api.ts         # Mock API with simulated network delay
├── types/             # TypeScript interfaces
├── utils/
│   └── format.ts      # Currency, number, validation utilities
└── index.css          # Global design system (CSS variables)
```

## Business Logic

**Capital Gains Computation:**
- Net STCG = `stcg.profits - stcg.losses`
- Net LTCG = `ltcg.profits - ltcg.losses`
- Realised Capital Gains = Net STCG + Net LTCG

**After Harvesting (per selected asset):**
- If `stcg.gain > 0` → add to `stcg.profits`
- If `stcg.gain < 0` → add `|gain|` to `stcg.losses`
- Same logic for `ltcg.gain`

**Savings displayed** only when `realisedBefore > realisedAfter`.

## Assumptions

1. Mock APIs return static data — in production these would be REST/GraphQL endpoints.
2. Google OAuth is simulated; a real integration would use Firebase Auth or Auth0.
3. Session is stored in `localStorage`; production would use httpOnly cookies + refresh tokens.
4. All amounts are in INR (₹).
