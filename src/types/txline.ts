export type TxlineMode = "live" | "replay";

export type TrackId = "proofmarket" | "sharpedge" | "fanpulse";

export type MatchStatus =
  | "scheduled"
  | "live"
  | "halftime"
  | "finished"
  | "suspended"
  | "abandoned"
  | "cancelled";

export type TeamSide = "home" | "away";

export interface TxlineMatch {
  matchId: string;
  competitionId: string;
  competitionName: string;
  kickoffUtc: string;
  status: MatchStatus;
  homeTeam: string;
  awayTeam: string;
  homeScore: number;
  awayScore: number;
  minute?: number;
  updatedAtUtc: string;
  sourceMode: TxlineMode;
}

export interface TxlineMatchEvent {
  eventId: string;
  matchId: string;
  eventType:
    | "goal"
    | "yellow_card"
    | "red_card"
    | "substitution"
    | "period_start"
    | "period_end"
    | "odds_shift"
    | "score_correction"
    | "match_status_change";
  teamSide?: TeamSide;
  playerName?: string;
  minute?: number;
  payload: Record<string, unknown>;
  occurredAtUtc: string;
  receivedAtUtc: string;
}

export interface TxlineOddsQuote {
  quoteId: string;
  matchId: string;
  marketType:
    | "match_winner"
    | "draw_no_bet"
    | "total_goals"
    | "handicap"
    | "both_teams_to_score"
    | "custom";
  selection: string;
  decimalOdds: number;
  impliedProbability: number;
  previousDecimalOdds?: number;
  movementBps?: number;
  updatedAtUtc: string;
}

export interface TxlineProofReceipt {
  receiptId: string;
  matchId: string;
  statKey: string;
  statValue: string;
  merkleRoot?: string;
  merkleProof?: string[];
  txSignature?: string;
  slot?: number;
  verified: boolean;
  verifiedAtUtc?: string;
  verificationMode: "txline_proof" | "devnet_mock" | "replay_fixture";
}
