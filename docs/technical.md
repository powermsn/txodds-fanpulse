# FanPulse Technical Notes

## Architecture

FanPulse is a Vite + React single-page app. It is intentionally client-side for the first judgeable version so replay mode works without backend services, secrets, wallets, or a database.

Core units:

- `src/App.tsx`: renders the mobile-first room, join CTA, segmented next-event pick control, score pulse, leaderboard, verified moment card, AI pundit feed, and compliance copy.
- `src/domain/fanpulseRoom.ts`: pure room state transitions. It owns seeded guest join, replay tick application, next-event scoring, leaderboard movement, deterministic pundit copy, and moment-card proof timeline data.
- `src/fixtures/replayTimeline.ts`: typed synthetic replay data used by the app runtime.
- `fixtures/replay/*`: public replay fixtures matching the required JSON/JSONL handoff shape.
- `src/types/txline.ts`: local subset of the shared TxLINE type model.

## Data Flow

1. App starts in replay mode with `createInitialRoomState()`.
2. Judge selects goal, card, or calm. Goal remains selected by default for one-click demo flow.
3. Judge clicks `Join and reveal next moment`.
4. `createSeededGuest()` inserts `You` into room `PULSE-26` with the selected pick.
5. React schedules replay ticks with deterministic offsets.
6. `applyReplayTick()` receives events, odds, and proof ticks.
7. Major events update score, next-event streaks, leaderboard movement, AI pundit feed, and the verified moment card.

The first major moment is a synthetic home goal at `1_500ms`, so interaction feedback lands inside the first two seconds after join. Later replay ticks remain available for the rest of the demo.

## Replay and Fallback

Replay is the default and required judge path.

Live mode should only be enabled when `TXLINE_API_TOKEN` and sponsor access are available. If a token is missing, network access fails, rate limits are hit, Solana RPC is unavailable, or proof calls are unavailable, the app should keep the room available in replay mode and show `Replay demo mode`.

The current scaffold does not fetch live endpoints yet. It is ready for a live adapter behind the same domain shape.

## Room Model

The local room model is deliberately simple:

- one seeded room code: `PULSE-26`
- seeded friend list
- one local guest named `You`
- segmented next-event choices: goal, card, calm
- fake points only
- no prizes, deposits, token incentives, payments, custody, or wagering
- deterministic next-event picks

Leaderboard movement is computed from previous rank to current rank after each scoring replay tick.

## Verified Moment Card

The card shows:

- scoreline
- biggest latest event
- top streak
- receipt status
- event tick, score update, and TxLINE proof timeline
- share text

Receipt data comes from `fixtures/replay/proofs.json` and `src/fixtures/replayTimeline.ts`. It is marked as replay fixture verification, not a live production proof. The visible proof timeline binds the card to `/api/scores/stream`, `/api/scores/historical/{fixtureId}`, and `/api/scores/stat-validation`.

## AI Pundit Feed

The feed is template-first and deterministic:

- goals explain pressure and streak movement
- cards explain room momentum
- odds shocks explain price movement
- proofs explain receipt availability

No LLM call is required for replay mode.

## Known Limitations

- No backend room persistence.
- No cross-device synchronization.
- No live TxLINE adapter yet.
- No wallet flow.
- Live deployment, public repo, and demo video links are recorded in the root README and submission notes.
- Replay fixture content is synthetic and should remain synthetic unless TxODDS gives written approval for samples.
