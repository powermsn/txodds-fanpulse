import type { TxlineMatch, TxlineMatchEvent, TxlineOddsQuote, TxlineProofReceipt } from "../types/txline";

export type ReplayTick =
  | { offsetMs: number; kind: "event"; event: TxlineMatchEvent }
  | { offsetMs: number; kind: "odds"; quote: TxlineOddsQuote }
  | { offsetMs: number; kind: "proof"; receipt: TxlineProofReceipt };

export const replayMatch: TxlineMatch = {
  matchId: "synthetic-match-001",
  competitionId: "txline-demo-cup",
  competitionName: "International Football Demo",
  kickoffUtc: "2026-06-25T12:00:00Z",
  status: "live",
  homeTeam: "Northbridge",
  awayTeam: "Coast City",
  homeScore: 0,
  awayScore: 0,
  minute: 24,
  updatedAtUtc: "2026-06-25T12:24:00Z",
  sourceMode: "replay",
};

export const replayProof: TxlineProofReceipt = {
  receiptId: "proof-replay-001",
  matchId: "synthetic-match-001",
  statKey: "goal:home:27",
  statValue: "Northbridge goal at 27",
  merkleRoot: "replay-root-9f2d",
  merkleProof: ["replay-leaf-27", "replay-branch-goal"],
  txSignature: "replay_fixture_signature",
  slot: 262625,
  verified: true,
  verifiedAtUtc: "2026-06-25T12:27:18Z",
  verificationMode: "replay_fixture",
};

export const replayTimeline: ReplayTick[] = [
  {
    offsetMs: 500,
    kind: "event",
    event: {
      eventId: "evt-001-period-live",
      matchId: "synthetic-match-001",
      eventType: "period_start",
      minute: 24,
      payload: { phase: "first_half" },
      occurredAtUtc: "2026-06-25T12:24:00Z",
      receivedAtUtc: "2026-06-25T12:24:01Z",
    },
  },
  {
    offsetMs: 1_500,
    kind: "event",
    event: {
      eventId: "evt-002-home-goal",
      matchId: "synthetic-match-001",
      eventType: "goal",
      teamSide: "home",
      playerName: "Ari Lane",
      minute: 27,
      payload: { homeScore: 1, awayScore: 0, pressureIndex: 84 },
      occurredAtUtc: "2026-06-25T12:27:12Z",
      receivedAtUtc: "2026-06-25T12:27:14Z",
    },
  },
  {
    offsetMs: 1_800,
    kind: "proof",
    receipt: replayProof,
  },
  {
    offsetMs: 6_500,
    kind: "odds",
    quote: {
      quoteId: "odds-001-home-shock",
      matchId: "synthetic-match-001",
      marketType: "match_winner",
      selection: "Northbridge",
      decimalOdds: 1.74,
      impliedProbability: 0.5747,
      previousDecimalOdds: 2.28,
      movementBps: -2368,
      updatedAtUtc: "2026-06-25T12:27:20Z",
    },
  },
  {
    offsetMs: 14_000,
    kind: "event",
    event: {
      eventId: "evt-003-away-red",
      matchId: "synthetic-match-001",
      eventType: "red_card",
      teamSide: "away",
      playerName: "Milo Park",
      minute: 31,
      payload: { discipline: "second_yellow" },
      occurredAtUtc: "2026-06-25T12:31:03Z",
      receivedAtUtc: "2026-06-25T12:31:04Z",
    },
  },
  {
    offsetMs: 44_000,
    kind: "event",
    event: {
      eventId: "evt-004-late-goal",
      matchId: "synthetic-match-001",
      eventType: "goal",
      teamSide: "away",
      playerName: "Niko Vale",
      minute: 88,
      payload: { homeScore: 1, awayScore: 1, lateGoal: true },
      occurredAtUtc: "2026-06-25T13:48:44Z",
      receivedAtUtc: "2026-06-25T13:48:45Z",
    },
  },
];

export const secondaryReplayScenarios: TxlineMatch[] = [
  {
    matchId: "synthetic-match-002",
    competitionId: "txline-demo-cup",
    competitionName: "International Football Demo",
    kickoffUtc: "2026-06-25T14:00:00Z",
    status: "suspended",
    homeTeam: "Harbor Union",
    awayTeam: "Highlands",
    homeScore: 0,
    awayScore: 0,
    minute: 52,
    updatedAtUtc: "2026-06-25T15:07:00Z",
    sourceMode: "replay",
  },
  {
    matchId: "synthetic-match-003",
    competitionId: "txline-demo-cup",
    competitionName: "International Football Demo",
    kickoffUtc: "2026-06-25T16:00:00Z",
    status: "finished",
    homeTeam: "Metro South",
    awayTeam: "River Town",
    homeScore: 2,
    awayScore: 1,
    minute: 90,
    updatedAtUtc: "2026-06-25T17:55:00Z",
    sourceMode: "replay",
  },
];
