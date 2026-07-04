# FanPulse

FanPulse is a mobile-first verified match room where friends play a free next-event fan game powered by TxLINE-style match events and share verified highlight cards.

## Submission Snapshot

- Track: Consumer and Fan Experiences
- Pitch: a replay-first fan room where friends predict the next moment and TxLINE proof verifies the highlight card.
- Distinct from the other submissions: FanPulse is a mainstream fan engagement app, not a settlement engine and not a trading agent.
- Primary judge path: replay mode, no wallet, no token, no secrets

## Final Submission Links

- Live app URL: https://txodds-fanpulse.vercel.app
- Demo video URL: https://www.youtube.com/watch?v=-NAz2BtIXM4
- Public repo URL: https://github.com/powermsn/txodds-fanpulse

## Compliance

This is a hackathon demo using TxLINE World Cup data. It does not offer real-money betting, custody, financial advice, or gambling services. Any prediction, market, or agent flow is simulation/devnet/replay unless explicitly marked otherwise. The project is not affiliated with FIFA or any tournament organizer.

In-app label: `Free fan game. No betting. No prizes.`

FanPulse does not include real-money wagers, prizes, deposits, token incentives, team crests, protected tournament marks, or under-18 targeting.

## Run Locally

```bash
npm install
npm run dev
```

Open the local Vite URL, usually `http://localhost:5173`.

Replay mode is the default. The top evidence strip makes this explicit with `Live TxLINE: not configured`, `Replay room: active`, and `Mode: points only`. Click `Join room`; the seeded guest joins without typing a real room code. Within 2 seconds, the replay emits a goal, advances the reveal rail through `Event received` and `Receipt verified`, updates the leaderboard, adds an AI pundit item, and prepares the verified moment card.

## Verification

```bash
npm run test:run
npm run build
npm audit --audit-level=moderate
```

## Mock/Replay Mode

Replay fixtures are local synthetic files under `fixtures/replay/`:

- `matches.json`
- `events.jsonl`
- `odds.jsonl`
- `proofs.json`

The UI currently uses the equivalent typed replay timeline in `src/fixtures/replayTimeline.ts` so the app can run fully client-side without a backend. The JSON/JSONL files are kept in the shared contract shape for public repo review and future adapter work.

Replay coverage includes:

- normal live match
- first major goal inside 2 seconds for the contest demo reveal
- odds shock
- red-card moment
- late goal
- suspended scenario
- score-correction scenario

## TxLINE Endpoints

Current implementation is replay-first. The live adapter should map the shared interface to these official TxLINE endpoints:

| Shared method | Live endpoint target |
| --- | --- |
| `getMatches` | `GET /api/fixtures/snapshot` |
| `getMatch` | `GET /api/fixtures/snapshot` filtered by fixture, with fixture update hydration when needed |
| `getMatchEvents` | `GET /api/scores/historical/{fixtureId}` |
| `getOdds` | `GET /api/odds/snapshot/{fixtureId}` |
| `streamMatch` | `GET /api/scores/stream` and `GET /api/odds/stream` |
| `getProofReceipt` | `GET /api/scores/stat-validation`; odds moments can use `GET /api/odds/validation` |

Auth and token activation targets for live mode:

- `POST /auth/guest/start`
- `POST /api/token/activate`

Official references:

- https://txline-docs.txodds.com/api-reference/fixtures/get-the-latest-snapshot-of-fixtures-optionally-starting-at-or-within-30-days-after-a-given-epoch-day
- https://txline-docs.txodds.com/api-reference/scores/get-the-full-sequence-of-score-updates-for-a-single-fixture
- https://txline-docs.txodds.com/api-reference/scores/get-a-real-time-server-sent-events-stream-of-scores-updates
- https://txline-docs.txodds.com/api-reference/odds/get-snapshots-of-the-latest-odds-for-a-fixture
- https://txline-docs.txodds.com/api-reference/odds/get-a-real-time-server-sent-events-stream-of-odds-updates
- https://txline-docs.txodds.com/api-reference/scores/get-a-three-stage-merkle-proof-for-a-single-score-statistic

## Project Structure

```text
src/App.tsx                         mobile-first match room UI
src/domain/fanpulseRoom.ts          deterministic room state, scoring, and proof timeline logic
src/fixtures/replayTimeline.ts      client-side replay ticks
src/types/txline.ts                 shared TxLINE type subset
fixtures/replay/                    public synthetic replay fixtures
docs/technical.md                   architecture and data-flow notes
docs/txline-endpoints.md            endpoint mapping and live-mode notes
tests/                              Vitest domain and UI coverage
```

## Known Limits

- Live TxLINE adapter is not wired yet; missing tokens intentionally keep the judge path in replay mode.
- Verified receipts are synthetic replay fixtures, not sponsor-private live proof payloads.
- AI pundit output is deterministic template copy for demo reliability.
- Room state is local browser state; there is no multi-device backend in this initial scaffold.
