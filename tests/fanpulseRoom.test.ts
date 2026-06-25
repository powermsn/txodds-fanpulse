import { describe, expect, it } from "vitest";
import {
  applyReplayTick,
  buildVerifiedMomentCard,
  createInitialRoomState,
  createSeededGuest,
  getPunditCopy,
  type NextEventPick,
} from "../src/domain/fanpulseRoom";
import { replayTimeline } from "../src/fixtures/replayTimeline";

describe("FanPulse replay room", () => {
  it("joins a seeded guest room without requiring a real room code", () => {
    const room = createInitialRoomState();
    const joined = createSeededGuest(room);

    expect(joined.roomCode).toBe("PULSE-26");
    expect(joined.modeLabel).toBe("Replay demo mode");
    expect(joined.complianceLabel).toBe("Free fan game. No betting. No prizes.");
    expect(joined.guests[0]).toMatchObject({
      id: "guest-you",
      displayName: "You",
      joinedAsSeededGuest: true,
    });
  });

  it("reveals a verified goal moment within two seconds after join", () => {
    const pick: NextEventPick = "goal";
    const room = createSeededGuest(createInitialRoomState(), pick);
    const firstMajorMoment = replayTimeline.find((tick) => tick.kind === "event" && tick.event.eventType === "goal");

    expect(firstMajorMoment?.offsetMs).toBeLessThanOrEqual(2_000);

    const updated = applyReplayTick(room, firstMajorMoment!);
    const card = buildVerifiedMomentCard(updated);

    expect(updated.match.homeScore).toBe(1);
    expect(updated.match.awayScore).toBe(0);
    expect(updated.guests.find((guest) => guest.id === "guest-you")).toMatchObject({
      streak: 1,
      points: 40,
    });
    expect(updated.leaderboard[0]).toMatchObject({
      displayName: "You",
      movement: "up",
    });
    expect(card.receiptStatus).toBe("verified");
    expect(card.shareText).toContain("Verified replay moment");
    expect(card.timeline).toEqual([
      expect.objectContaining({ label: "Event tick", status: "verified" }),
      expect.objectContaining({ label: "Score update", details: "Northbridge 1-0 Coast City" }),
      expect.objectContaining({
        label: "TxLINE proof",
        endpoint: "/api/scores/stat-validation",
        source: "replay_fixture",
      }),
    ]);
  });

  it("scores the seeded guest against their selected next-event pick", () => {
    const room = createSeededGuest(createInitialRoomState(), "card");
    const firstMajorMoment = replayTimeline.find((tick) => tick.kind === "event" && tick.event.eventType === "goal")!;

    const updated = applyReplayTick(room, firstMajorMoment);

    expect(updated.guests.find((guest) => guest.id === "guest-you")).toMatchObject({
      nextPick: "card",
      lastDelta: -5,
      points: 0,
    });
  });

  it("generates deterministic AI pundit copy for major replay moments", () => {
    const goal = replayTimeline.find((tick) => tick.kind === "event" && tick.event.eventType === "goal")!;
    const shock = replayTimeline.find((tick) => tick.kind === "odds")!;

    expect(getPunditCopy(goal)).toContain("pressure finally turns into a goal");
    expect(getPunditCopy(shock)).toContain("odds shock");
  });
});
