# TxLINE Endpoint Mapping

FanPulse currently runs replay mode only. This file records the live endpoint targets for the future adapter while keeping public fixtures synthetic.

## Runtime Mode

- Default: `TXLINE_MODE=replay`
- Public judge path: replay
- Live mode: enhancement only, requires sponsor access and tokens
- Missing token fallback: replay

## Endpoint Targets

| Shared interface | TxLINE endpoint | FanPulse use |
| --- | --- | --- |
| `getMatches` | `GET https://txline.txodds.com/api/fixtures/snapshot` | Populate match room candidates and selected match metadata. |
| `getMatch` | `GET https://txline.txodds.com/api/fixtures/snapshot` | Filter by fixture ID, then hydrate with latest score state if needed. |
| `getMatchEvents` | `GET https://txline.txodds.com/api/scores/historical/{fixtureId}` | Build match event history for replay catch-up and room feed. |
| `getOdds` | `GET https://txline.txodds.com/api/odds/snapshot/{fixtureId}` | Detect odds shocks for the AI pundit feed. |
| `streamMatch` | `GET https://txline.txodds.com/api/scores/stream` | Live score and match-event updates. |
| `streamMatch` | `GET https://txline.txodds.com/api/odds/stream` | Live odds movement updates. |
| `getProofReceipt` | `GET https://txline.txodds.com/api/scores/stat-validation` | Verified moment card for score/stat moments. |
| `getProofReceipt` | `GET https://txline.txodds.com/api/odds/validation` | Verified moment card for odds-shock moments. |

## Auth Targets

- `POST https://txline.txodds.com/auth/guest/start`
- `POST https://txline.txodds.com/api/token/activate`

## Required Headers In Live Mode

- `Authorization: Bearer <token>`
- `X-Api-Token: <api-key>`
- Optional SSE resume: `Last-Event-ID`

## Fallback Rules

- `TXLINE_TOKEN_MISSING`: switch to replay and show `Replay demo mode`.
- `TXLINE_NETWORK_ERROR`: retry once, then replay.
- `TXLINE_RATE_LIMITED`: replay.
- `TXLINE_SCHEMA_MISMATCH`: fail closed for live data, keep replay available.
- `SOLANA_RPC_UNAVAILABLE` or `PROOF_UNAVAILABLE`: keep room running and mark proof as replay/devnet only.
