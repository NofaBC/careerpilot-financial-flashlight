# CareerPilot AI – Financial Flashlight

Internal financial tracking dashboard for CareerPilot AI. Tracks daily revenue, expenses, profit, and weekly/monthly totals.

## Tech Stack

- **Next.js 16** (App Router, TypeScript)
- **Tailwind CSS** with custom dark theme
- **Firebase Auth** (Google sign-in)
- **Firestore** (persistent financial entries)
- **OpenAI API** (optional insight layer, server-side only)
- **Vercel** (deployment)

## Architecture Principles

All financial calculations are **deterministic and code-based** (`src/lib/calculations.ts`). AI is only used as an optional commentary/insight layer and never computes revenue, cost, profit, or totals.

## Project Structure

```
src/
  app/
    page.tsx                    # Root redirect to /dashboard
    layout.tsx                  # Root layout
    login/page.tsx              # Google sign-in page
    dashboard/page.tsx          # Main dashboard (protected)
    api/insights/route.ts       # Secure OpenAI insight endpoint
  components/
    DashboardHero.tsx           # Hero section with title + badge
    MetricCard.tsx              # Reusable metric display card
    EntryForm.tsx               # Daily financial entry form
    MonthSnapshot.tsx           # Month metrics panel
    EntriesTable.tsx            # Saved entries table
    InsightPanel.tsx            # Optional AI insight panel
    ProtectedRoute.tsx          # Auth guard wrapper
  lib/
    firebase.ts                 # Firebase client initialization
    auth.ts                     # Auth hooks and sign-in/out
    firestore.ts                # Firestore CRUD operations
    calculations.ts             # Deterministic financial math
    format.ts                   # Currency and number formatting
    openai.ts                   # Server-only OpenAI helper
  types/
    financial.ts                # TypeScript interfaces
```

## Setup

### 1. Install dependencies

```bash
npm install
```

### 2. Configure environment variables

Copy `.env.local.example` to `.env.local` and fill in your values:

```bash
cp .env.local.example .env.local
```

### 3. Firebase setup

1. Create a Firebase project at [console.firebase.google.com](https://console.firebase.google.com)
2. Enable **Authentication** with **Google** sign-in provider
3. Enable **Cloud Firestore** in production mode
4. Deploy the Firestore rules from `firestore.rules`
5. Copy the Firebase config values into `.env.local`

### 4. Run locally

```bash
npm run dev
```

### 5. Deploy to Vercel

1. Push to GitHub
2. Import the repo in Vercel
3. Add all environment variables from `.env.local.example` to Vercel project settings
4. Deploy

## Environment Variables

- `NEXT_PUBLIC_FIREBASE_API_KEY` — Firebase API key (client)
- `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN` — Firebase auth domain (client)
- `NEXT_PUBLIC_FIREBASE_PROJECT_ID` — Firebase project ID (client)
- `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET` — Firebase storage bucket (client)
- `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID` — Firebase sender ID (client)
- `NEXT_PUBLIC_FIREBASE_APP_ID` — Firebase app ID (client)
- `OPENAI_API_KEY` — OpenAI API key (server only, never in browser)

## Security

- OpenAI API key is **never exposed** to the client
- Firebase admin credentials are **not used** (client SDK only)
- Dashboard is protected behind Firebase Auth
- Firestore rules ensure users can only access their own entries
- All environment variables follow the `NEXT_PUBLIC_` convention correctly

## Data Model

Each `financial_entries` document contains:

- `date` (YYYY-MM-DD)
- `newSubs`, `renewals` (integers)
- `revenue`, `refunds` (dollars)
- `aiCost`, `jobsCost`, `hostingCost`, `otherCost` (dollars)
- `notes` (text)
- `createdAt`, `updatedAt` (ISO timestamps)
- `createdBy` (Firebase UID)
