import { replayMatch, replayProof, type ReplayTick } from "../fixtures/replayTimeline";
import type { TxlineMatch, TxlineMatchEvent, TxlineOddsQuote, TxlineProofReceipt } from "../types/txline";

export type NextEventPick = "goal" | "card" | "no_major_event";

export interface RoomGuest {
  id: string;
  displayName: string;
  points: number;
  streak: number;
  lastDelta: number;
  nextPick: NextEventPick;
  joinedAsSeededGuest?: boolean;
}

export interface LeaderboardEntry extends RoomGuest {
  rank: number;
  movement: "up" | "down" | "same";
}

export interface FeedItem {
  id: string;
  title: string;
  body: string;
  minute?: number;
}

export interface FanpulseRoomState {
  roomCode: string;
  modeLabel: "Replay demo mode" | "Live TxLINE mode";
  complianceLabel: string;
  match: TxlineMatch;
  guests: RoomGuest[];
  leaderboard: LeaderboardEntry[];
  latestEvent?: TxlineMatchEvent;
  latestOdds?: TxlineOddsQuote;
  latestReceipt?: TxlineProofReceipt;
  feed: FeedItem[];
  joined: boolean;
  joinStatus: string;
}

export interface VerifiedMomentCard {
  title: string;
  scoreline: string;
  topStreak: string;
  biggestEvent: string;
  receiptStatus: "verified" | "replay_only";
  timeline: VerifiedMomentStep[];
  shareText: string;
}

export interface VerifiedMomentStep {
  label: string;
  details: string;
  status: "verified" | "pending" | "replay_only";
  endpoint?: string;
  source?: string;
}

const complianceLabel = "Free fan game. No betting. No prizes.";

const seededFriends: RoomGuest[] = [
  { id: "guest-maya", displayName: "Maya", points: 25, streak: 1, lastDelta: 0, nextPick: "card" },
  { id: "guest-omar", displayName: "Omar", points: 18, streak: 0, lastDelta: 0, nextPick: "no_major_event" },
  { id: "guest-jules", displayName: "Jules", points: 12, streak: 0, lastDelta: 0, nextPick: "no_major_event" },
];

export function createInitialRoomState(): FanpulseRoomState {
  const guests = seededFriends.map((guest) => ({ ...guest }));

  return {
    roomCode: "PULSE-26",
    modeLabel: "Replay demo mode",
    complianceLabel,
    match: { ...replayMatch },
    guests,
    leaderboard: buildLeaderboard(guests),
    feed: [
      {
        id: "feed-welcome",
        title: "Room pulse",
        body: "Replay is armed. Pick the next moment before the room reacts.",
        minute: replayMatch.minute,
      },
    ],
    joined: false,
    joinStatus: "Ready to join",
  };
}

export function createSeededGuest(
  room: FanpulseRoomState,
  nextPick: NextEventPick = "goal",
): FanpulseRoomState {
  if (room.guests.some((guest) => guest.id === "guest-you")) {
    return room;
  }

  const guests: RoomGuest[] = [
    {
      id: "guest-you",
      displayName: "You",
      points: 0,
      streak: 0,
      lastDelta: 0,
      nextPick,
      joinedAsSeededGuest: true,
    },
    ...room.guests,
  ];

  return {
    ...room,
    guests,
    leaderboard: buildLeaderboard(guests, rankMap(room.leaderboard)),
    joined: true,
    joinStatus: "Guest joined",
  };
}

export function applyReplayTick(room: FanpulseRoomState, tick: ReplayTick): FanpulseRoomState {
  if (tick.kind === "proof") {
    return {
      ...room,
      latestReceipt: tick.receipt,
      feed: prependFeed(room.feed, {
        id: `feed-${tick.receipt.receiptId}`,
        title: "Receipt verified",
        body: "Replay fixture proof is attached to the moment card.",
      }),
    };
  }

  if (tick.kind === "odds") {
    return {
      ...room,
      latestOdds: tick.quote,
      feed: prependFeed(room.feed, {
        id: `feed-${tick.quote.quoteId}`,
        title: "AI pundit",
        body: getPunditCopy(tick),
      }),
    };
  }

  const previousRanks = rankMap(room.leaderboard);
  const nextMatch = applyEventToMatch(room.match, tick.event);
  const guests = scoreGuests(room.guests, tick.event);

  return {
    ...room,
    match: nextMatch,
    guests,
    leaderboard: buildLeaderboard(guests, previousRanks),
    latestEvent: tick.event,
    latestReceipt: tick.event.eventType === "goal" ? replayProof : room.latestReceipt,
    feed: prependFeed(room.feed, {
      id: `feed-${tick.event.eventId}`,
      title: tick.event.eventType === "goal" ? "Goal pulse" : "AI pundit",
      body: getPunditCopy(tick),
      minute: tick.event.minute,
    }),
  };
}

export function buildVerifiedMomentCard(room: FanpulseRoomState): VerifiedMomentCard {
  const leader = room.leaderboard[0];
  const receipt = room.latestReceipt;
  const biggestEvent = describeEvent(room.latestEvent);

  return {
    title: "Verified moment",
    scoreline: `${room.match.homeTeam} ${room.match.homeScore}-${room.match.awayScore} ${room.match.awayTeam}`,
    topStreak: leader ? `${leader.displayName}: ${leader.streak} streak` : "No streak yet",
    biggestEvent,
    receiptStatus: receipt?.verified ? "verified" : "replay_only",
    timeline: buildMomentTimeline(room, receipt),
    shareText: `Verified replay moment: ${biggestEvent} | ${room.match.homeTeam} ${room.match.homeScore}-${room.match.awayScore} ${room.match.awayTeam}`,
  };
}

export function getPunditCopy(tick: ReplayTick): string {
  if (tick.kind === "odds") {
    return `AI pundit: odds shock detected as ${tick.quote.selection} moves from ${tick.quote.previousDecimalOdds?.toFixed(2)} to ${tick.quote.decimalOdds.toFixed(2)}. The room should expect faster guesses now.`;
  }

  if (tick.kind === "proof") {
    return "AI pundit: the verified receipt is ready for the share card.";
  }

  if (tick.event.eventType === "goal") {
    return `AI pundit: pressure finally turns into a goal at ${tick.event.minute}'. Streak hunters who picked goal jump immediately.`;
  }

  if (tick.event.eventType === "red_card" || tick.event.eventType === "yellow_card") {
    return `AI pundit: a card changes the room temperature at ${tick.event.minute}'. Conservative picks lose momentum.`;
  }

  if (tick.event.eventType === "score_correction") {
    return "AI pundit: score correction received, so the room locks the verified card until the proof catches up.";
  }

  return "AI pundit: the replay clock advanced without a major fan-game moment.";
}

function applyEventToMatch(match: TxlineMatch, event: TxlineMatchEvent): TxlineMatch {
  const homeScore = Number(event.payload.homeScore ?? match.homeScore);
  const awayScore = Number(event.payload.awayScore ?? match.awayScore);
  const status = typeof event.payload.status === "string" ? event.payload.status : match.status;

  return {
    ...match,
    homeScore,
    awayScore,
    minute: event.minute ?? match.minute,
    status: status as TxlineMatch["status"],
    updatedAtUtc: event.receivedAtUtc,
  };
}

function scoreGuests(guests: RoomGuest[], event: TxlineMatchEvent): RoomGuest[] {
  const result = eventToPick(event);

  return guests.map((guest) => {
    const matched = result !== undefined && guest.nextPick === result;
    const delta = matched ? 40 : result ? -5 : 3;

    return {
      ...guest,
      points: Math.max(0, guest.points + delta),
      streak: matched ? guest.streak + 1 : guest.streak,
      lastDelta: delta,
      nextPick: matched ? nextPickAfter(result) : guest.nextPick,
    };
  });
}

function eventToPick(event: TxlineMatchEvent): NextEventPick | undefined {
  if (event.eventType === "goal") return "goal";
  if (event.eventType === "red_card" || event.eventType === "yellow_card") return "card";
  return undefined;
}

function nextPickAfter(pick: NextEventPick): NextEventPick {
  if (pick === "goal") return "card";
  if (pick === "card") return "no_major_event";
  return "goal";
}

function buildLeaderboard(guests: RoomGuest[], previousRanks = new Map<string, number>()): LeaderboardEntry[] {
  return guests
    .map((guest) => ({ ...guest }))
    .sort((a, b) => b.points - a.points || b.streak - a.streak || a.displayName.localeCompare(b.displayName))
    .map((guest, index) => {
      const rank = index + 1;
      const previousRank = previousRanks.get(guest.id) ?? rank;
      const movement = previousRank > rank ? "up" : previousRank < rank ? "down" : "same";

      return { ...guest, rank, movement };
    });
}

function rankMap(entries: LeaderboardEntry[]): Map<string, number> {
  return new Map(entries.map((entry) => [entry.id, entry.rank]));
}

function prependFeed(feed: FeedItem[], item: FeedItem): FeedItem[] {
  return [item, ...feed].slice(0, 5);
}

function describeEvent(event?: TxlineMatchEvent): string {
  if (!event) return "Room opened in replay mode";
  if (event.eventType === "goal") {
    const side = event.teamSide === "home" ? "home" : "away";
    return `${side} goal at ${event.minute}'`;
  }
  if (event.eventType === "red_card") return `red card at ${event.minute}'`;
  if (event.eventType === "yellow_card") return `yellow card at ${event.minute}'`;
  return event.eventType.replaceAll("_", " ");
}

function buildMomentTimeline(room: FanpulseRoomState, receipt?: TxlineProofReceipt): VerifiedMomentStep[] {
  const scoreline = `${room.match.homeTeam} ${room.match.homeScore}-${room.match.awayScore} ${room.match.awayTeam}`;

  return [
    {
      label: "Event tick",
      details: room.latestEvent
        ? `${room.latestEvent.eventType.replaceAll("_", " ")} received at ${room.latestEvent.receivedAtUtc}`
        : "Replay room waiting for the next event tick",
      status: room.latestEvent ? "verified" : "pending",
      endpoint: "/api/scores/stream",
      source: "replay_fixture",
    },
    {
      label: "Score update",
      details: scoreline,
      status: room.latestEvent ? "verified" : "pending",
      endpoint: "/api/scores/historical/{fixtureId}",
      source: "replay_fixture",
    },
    {
      label: "TxLINE proof",
      details: receipt
        ? `${receipt.receiptId} validates ${receipt.statKey}`
        : "Replay proof fixture ready; receipt appears after the highlight event",
      status: receipt?.verified ? "verified" : "replay_only",
      endpoint: "/api/scores/stat-validation",
      source: receipt?.verificationMode ?? "replay_fixture",
    },
  ];
}
