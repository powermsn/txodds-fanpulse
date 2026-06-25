# FanPulse Deployment

FanPulse is a static Vite app. It does not require a backend, wallet, login, paid subscription, or private TxLINE credential for the replay judge path.

## Environment

Copy `.env.example` if your host supports environment variables:

```bash
TXLINE_API_BASE=https://txline.txodds.com
TXLINE_API_TOKEN=
TXLINE_MODE=replay
SOLANA_RPC_URL=https://api.devnet.solana.com
NEXT_PUBLIC_APP_MODE=replay
NEXT_PUBLIC_TRACK_ID=fanpulse
FANPULSE_ROOM_SEED=PULSE-26
```

Do not set real secrets in a public frontend deployment.

## Build

```bash
npm install
npm run build
```

Build output is written to `dist/`.

## Vercel

1. Import the public GitHub repo into Vercel.
2. Framework preset: Vite.
3. Build command: `npm run build`.
4. Output directory: `dist`.
5. Environment: leave `TXLINE_MODE=replay`; do not add private TxLINE tokens to a public client app.
6. Deploy and copy the public URL into `README.md` and `SUBMISSION.md`.

## Netlify

1. Import the public GitHub repo into Netlify.
2. Build command: `npm run build`.
3. Publish directory: `dist`.
4. Environment: replay mode only for public judging.
5. Deploy and copy the public URL into `README.md` and `SUBMISSION.md`.

## GitHub Pages

This project can be deployed as a static site. If deploying under a repo subpath, configure Vite `base` before building.

Basic flow:

```bash
npm install
npm run build
```

Then publish `dist/` using a GitHub Pages action or another static hosting workflow.

## Judge Access Checklist

- The URL opens without login.
- Replay mode works without TxLINE token.
- No wallet, KYC, payment, deposit, or subscription is required.
- No raw TxODDS live data is published.
- Compliance copy is visible in the app and README.

## Post-Deploy Smoke Test

Open the deployed URL and confirm:

1. `Replay demo mode` is visible.
2. `Free fan game. No betting. No prizes.` is visible.
3. Click `Join and reveal next moment`.
4. Score changes to `1-0` within about two seconds.
5. Leaderboard updates.
6. Verified moment timeline shows the event, score, and proof source.
