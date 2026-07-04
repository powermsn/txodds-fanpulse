# FanPulse Submission

## Track

Consumer and Fan Experiences

## One-Line Pitch

FanPulse is a free, mobile-first verified match room where friends predict the next football moment and a TxLINE-style proof trail verifies the replay highlight card.

## Project Description

FanPulse turns live match data into a fan-facing social game: join a room, choose whether the next major moment is a goal, card, or calm spell, and watch the friend leaderboard move when the match event arrives.

The judge path is replay-first. It uses local synthetic fixtures that mirror the TxLINE match/event/odds/proof shape so the app can be evaluated without credentials, wallets, payment, deposits, or private data access. Live TxLINE integration is documented as the next adapter layer, not claimed as complete.

## What Judges Should Click

1. Open the app on mobile or desktop.
2. Leave the default `Goal` prediction selected, or choose `Card`/`Calm` to see scoring change.
3. Confirm the evidence strip shows `Live TxLINE: not configured`, `Replay room: active`, and `Mode: points only`.
4. Click `Join room`.
5. Within about two seconds, watch the score flip to `1-0`, the reveal rail advance to `Share card ready`, the leaderboard update, and the verified moment card reveal a proof timeline.

## Why TxODDS Matters

FanPulse is built around the value of match data that arrives quickly and can be tied back to a verifiable source. The app is not a generic score page: the room becomes fun because event ticks, score updates, odds shocks, and proof receipts drive the fan game and the shareable highlight card.

The visible proof timeline shows how the highlight card binds to:

- event tick
- score update
- TxLINE proof endpoint/source

## TxLINE Endpoint Targets

The current public demo uses replay fixtures only. The live adapter should map the shared interface to:

| FanPulse need | TxLINE endpoint target |
| --- | --- |
| Match list and selected match metadata | `GET /api/fixtures/snapshot` |
| Score/event stream | `GET /api/scores/stream` |
| Historical event catch-up | `GET /api/scores/historical/{fixtureId}` |
| Odds shock feed | `GET /api/odds/stream` |
| Latest odds snapshot | `GET /api/odds/snapshot/{fixtureId}` |
| Verified score/stat card proof | `GET /api/scores/stat-validation` |
| Verified odds-moment proof | `GET /api/odds/validation` |

Auth/token targets for future live mode:

- `POST /auth/guest/start`
- `POST /api/token/activate`

## Mock and Replay Fallback

Replay mode is the default judge path and works without secrets.

Fixture files:

- `fixtures/replay/matches.json`
- `fixtures/replay/events.jsonl`
- `fixtures/replay/odds.jsonl`
- `fixtures/replay/proofs.json`

Replay scenarios include a normal match, instant goal reveal, odds shock, card moment, late goal, suspended match, and score correction. The client uses typed replay ticks in `src/fixtures/replayTimeline.ts` for deterministic timing.

Fallback stance:

- Missing TxLINE token: stay in replay mode.
- TxLINE network/rate-limit issue: keep replay available.
- Proof/RPC unavailable: show replay proof status and do not block the fan room.

## Fan-Game Compliance

FanPulse is a free fan game demo. It does not include:

- real-money wagering
- deposits
- custody
- financial advice
- gambling services
- prizes
- token incentives
- wallet, KYC, or payment requirements
- FIFA marks, team crests, or tournament-organizer affiliation claims

The in-app compliance label is: `Free fan game. No betting. No prizes.`

## Known Limits

- Live TxLINE adapter is not implemented in this repo yet.
- Replay data is synthetic and public-safe, not raw TxODDS live data.
- Proof receipts are replay fixtures for judging.
- Room state is local browser state, not a multiplayer backend.
- Demo video URL must be inserted before final submission.
