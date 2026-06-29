Practice smarter tax planning. Simulate harvesting. See the savings before you make a move.

## 🚀 Live Demo
➜ **Try it live → [koinx-tax-harvesting-szcz.vercel.app](https://koinx-tax-harvesting-szcz.vercel.app/)**

No setup needed. Sign in with Google, and your portfolio simulation loads instantly.

## Demo Video

> https://github.com/user-attachments/assets/057b5411-94a6-4550-9ad4-c17529bc46c8

---

## The Problem That Started This

Most Indian crypto investors have no idea how much tax they're going to owe until the financial year ends. By then, it's too late to do anything about it.

Tax loss harvesting is a legal strategy — you sell assets sitting at a loss to offset your capital gains, reducing what you owe. But figuring out *which* assets to sell, *how much* to sell, and *what impact* it will have... that's not intuitive at all.

> **You can't optimise what you can't see. This dashboard makes the invisible visible.**

I built this to make that entire process interactive and real-time. Select a holding, and the tax impact updates immediately — before you touch anything on your actual exchange.

---

## What You Can Do With It

- **Real-Time Simulation** — Select holdings to simulate selling, and watch the "After Harvesting" panel update instantly without any page reload.
- **Side-by-Side Comparison** — Pre Harvesting vs After Harvesting, shown together so you can see exactly what each selection does to your net position.
- **Holdings Table** — 17 assets listed with current price, average buy, short-term gain/loss, long-term gain/loss, and units affected. Sortable by total gain.
- **Summary Cards** — Four top-level numbers at a glance: Current Realised Gain, After Harvesting, Potential Tax Savings, and STCG Profits.
- **Short-Term & Long-Term Breakdown** — Capital gains split by category (STCG and LTCG) both before and after simulation.
- **Google Sign-In** — One click. No separate account registration needed.
- **FY Selector** — Financial year picker in the navbar for multi-year support.
- **Secure & Encrypted** — Sessions are handled securely. No trade data is ever stored or shared.

---

## Screenshots

### Login Page
![Login](https://github.com/user-attachments/assets/e2adc033-b6a9-4077-86bc-f79ef651ffe8)

### Tax Loss Harvesting Dashboard
![Dashboard](https://github.com/user-attachments/assets/8b139987-7738-43f1-ba11-9e2c05b8071d)

### Holdings — Part 1
![Holdings 1](https://github.com/user-attachments/assets/c7c6eff8-8204-4b67-8d6c-57786fce8a0d)

### Holdings — Part 2
![Holdings 2](https://github.com/user-attachments/assets/4eaf6fb1-e2f1-4e7d-aaa3-bf5d4a311112)

---

## Tech Stack

### Frontend

| Technology | Purpose |
|---|---|
| React + Vite | UI framework with fast hot-module reloading |
| React Router | Client-side navigation without page reloads |
| Tailwind CSS | Utility-first styling for the dark dashboard UI |
| Axios | HTTP client for API calls |
| @react-oauth/google | Google Sign-In integration |

### Backend / Data

| Technology | Purpose |
|---|---|
| Node.js + Express | REST API server |
| MongoDB + Mongoose | Stores user sessions and portfolio data |
| JSON Web Tokens | Stateless authentication |
| CoinGecko / Exchange API | Live crypto prices and portfolio sync |

### Deployment

| Layer | Platform |
|---|---|
| Frontend | Vercel |
| Backend | Render / Railway |
| Database | MongoDB Atlas |

---

## Project Structure

```
koinx-tax-harvesting/
├── client/                        # React frontend
│   └── src/
│       ├── components/
│       │   ├── HarvestingTable/   # Pre vs After side-by-side panels
│       │   ├── HoldingsTable/     # Asset list with checkboxes
│       │   ├── SummaryCards/      # Top metric cards
│       │   └── Navbar/            # FY selector + user info
│       ├── context/               # Global state for selected holdings
│       ├── pages/
│       │   ├── Login.jsx          # Auth page
│       │   └── Dashboard.jsx      # Main harvesting view
│       ├── services/              # API call functions
│       └── utils/                 # Tax calculation helpers
│
└── server/                        # Express backend
    └── src/
        ├── controllers/           # Auth, portfolio, harvesting logic
        ├── models/                # User, Portfolio schemas
        ├── routes/                # API route definitions
        └── middleware/            # JWT auth guard, error handler
```

---

## Running It Locally

### Prerequisites
- Node.js v18+
- MongoDB Atlas account (free tier works)
- Google OAuth Client ID → [console.cloud.google.com](https://console.cloud.google.com)

### 1. Clone the repo
```bash
git clone https://github.com/your-username/koinx-tax-harvesting.git
cd koinx-tax-harvesting
```

### 2. Backend setup
```bash
cd server
npm install
```

Create a `.env` file inside `server/`:

```env
PORT=5000
CLIENT_URL=http://localhost:5173
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_here
JWT_EXPIRES_IN=7d
GOOGLE_CLIENT_ID=your_google_client_id
```

```bash
npm run dev
```

You should see:
```
MongoDB Connected: cluster0.xxxxx.mongodb.net
Server running on port 5000
```

### 3. Frontend setup
Open a new terminal:

```bash
cd client
npm install
```

Create a `.env` file inside `client/`:

```env
VITE_API_URL=http://localhost:5000/api
VITE_GOOGLE_CLIENT_ID=your_google_client_id
```

```bash
npm run dev
```

Visit `http://localhost:5173` — you're good to go.

---

## API Endpoints

All `/portfolio` and `/harvest` routes require `Authorization: Bearer <token>` in the request header.

### Authentication

| Method | Endpoint | What It Does |
|---|---|---|
| POST | `/api/auth/register` | Create account with email and password |
| POST | `/api/auth/login` | Login with email and password |
| POST | `/api/auth/google` | Login with Google credential |
| GET | `/api/auth/me` | Get current logged-in user |
| POST | `/api/auth/logout` | Logout |

### Portfolio

| Method | Endpoint | What It Does |
|---|---|---|
| GET | `/api/portfolio` | Fetch all holdings with live prices |
| GET | `/api/portfolio/gains` | Get current realised gain breakdown (STCG/LTCG) |

### Harvesting Simulation

| Method | Endpoint | Request Body |
|---|---|---|
| POST | `/api/harvest/simulate` | `{ selectedAssets: [...] }` — run simulation |
| GET | `/api/harvest/summary` | Get current simulated vs actual comparison |

---

## How the Simulation Actually Works

```
User signs in and portfolio loads with live prices
        ↓
Current realised gains calculated (STCG + LTCG)
        ↓
Holdings displayed sorted by total gain
        ↓
User selects a holding with an unrealised loss
        ↓
App simulates: sell the asset → immediately rebuy at current price
        ↓
The unrealised loss becomes a realised loss on paper
        ↓
That loss offsets existing capital gains
        ↓
"After Harvesting" panel updates in real-time
        ↓
User adjusts selections until tax savings are maximised
        ↓
Final simulated position saved for reference
```

> The actual trade is something you execute on your exchange. This tool is advisory — it shows you the impact before you act.

---

## Tax Calculation Logic

The dashboard tracks two types of capital gains under Indian tax law:

| Type | Holding Period | Tax Rate |
|---|---|---|
| Short-Term Capital Gain (STCG) | Less than 36 months | 15% (flat) |
| Long-Term Capital Gain (LTCG) | 36 months or more | 10% above ₹1 lakh exemption |

**Net Position Formula:**

```
Net Short-Term = STCG Profits − STCG Losses
Net Long-Term  = LTCG Profits − LTCG Losses
Tax Saved      = (Pre-harvest Net Gain − Post-harvest Net Gain) × applicable rate
```

The simulation runs this calculation live as you select assets — so the "Potential Tax Savings" number is always current.

---

## Architecture Overview

```
┌─────────────────────────────────────────────────────────────┐
│                      React Frontend                          │
│  ┌──────────┐  ┌───────────────┐  ┌──────────────────────┐ │
│  │  Login   │→ │   Dashboard   │→ │  Holdings Selector   │ │
│  │  Page    │  │  (Summary)    │  │  (Harvest Sim.)      │ │
│  └──────────┘  └───────────────┘  └──────────────────────┘ │
│                       ↓                                      │
│  ┌──────────────────────────────────────────────────────┐   │
│  │            Axios API Service Layer                    │   │
│  └──────────────────────────────────────────────────────┘   │
└──────────────────────────┬──────────────────────────────────┘
                           │ HTTP + JWT
┌──────────────────────────▼──────────────────────────────────┐
│                    Express Backend                           │
│  ┌──────────┐  ┌──────────┐  ┌──────────────────────────┐  │
│  │   Auth   │  │Portfolio │  │   Harvest Simulation      │  │
│  │  Routes  │  │  Routes  │  │   Routes + Tax Logic      │  │
│  └──────────┘  └──────────┘  └──────────────────────────┘  │
│                      ↓                                       │
│  ┌──────────────────────────────────────────────────────┐   │
│  │          Live Price Feed (CoinGecko API)              │   │
│  └──────────────────────────────────────────────────────┘   │
│                      ↓                                       │
│              ┌───────────────┐                              │
│              │    MongoDB    │                              │
│              └───────────────┘                              │
└─────────────────────────────────────────────────────────────┘
```

---

## Key Design Decisions

**Why simulate instead of execute trades?** This keeps the app non-custodial. The tool is advisory — showing impact before action. This also avoids any regulatory complexity around executing financial transactions.

**Why sort holdings by total gain?** The assets with the highest gains are the ones you'd want to offset first. Surfacing them at the top makes the workflow faster for users working under year-end deadlines.

**Why split into two panels side by side?** Showing Pre Harvesting and After Harvesting next to each other makes the impact of each checkbox selection obvious immediately — more intuitive than a single number updating somewhere on the page.

**Why real-time simulation instead of a calculate button?** Every extra click is friction. When you're evaluating 17 assets for the optimal combination, instant feedback is the difference between a tool people use and one they abandon.

---

## What I Want to Add Next

- Export simulation report to PDF for CA review
- Multi-year FY switching with historical gain/loss data
- Mobile-responsive layout for on-the-go planning
- Wash-sale equivalent alerts for high-frequency traders
- Exchange API integration to auto-sync portfolio (WazirX, CoinDCX, Binance)
- Optimal harvest suggestion — AI recommends the best combination automatically
- Dark/light theme toggle

---

## Author

Built by **Vidya Sagar Yandamuri**

If this project helped you or impressed you, drop a ⭐ — it genuinely means a lot.

[GitHub](https://github.com/your-username/koinx-tax-harvesting) • [Live Demo](https://koinx-tax-harvesting-szcz.vercel.app/)

> *"I didn't build this to show I know React. I built it because I actually wanted to understand tax loss harvesting — and realised the best way to learn something is to build a tool around it."*
