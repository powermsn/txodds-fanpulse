import { Activity, BadgeCheck, Radio, Share2, Sparkles, Trophy, Users } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import "./styles.css";
import {
  applyReplayTick,
  buildVerifiedMomentCard,
  createInitialRoomState,
  createSeededGuest,
  type FanpulseRoomState,
  type NextEventPick,
} from "./domain/fanpulseRoom";
import { replayTimeline } from "./fixtures/replayTimeline";

const eventTicks = replayTimeline.filter((tick) => tick.offsetMs <= 30_000);
const pickOptions: Array<{ value: NextEventPick; label: string }> = [
  { value: "goal", label: "Goal" },
  { value: "card", label: "Card" },
  { value: "no_major_event", label: "Calm" },
];
const stageLabels = ["Joined", "Watching replay", "Event received", "Receipt verified", "Leaderboard updated", "Share card ready"];

export default function App() {
  const [room, setRoom] = useState<FanpulseRoomState>(() => createInitialRoomState());
  const [selectedPick, setSelectedPick] = useState<NextEventPick>("goal");
  const [flowStage, setFlowStage] = useState("Ready to join");
  const momentCard = useMemo(() => buildVerifiedMomentCard(room), [room]);

  useEffect(() => {
    if (!room.joined) return;

    const timers = [
      ...eventTicks.map((tick) =>
        window.setTimeout(() => {
          setRoom((current) => applyReplayTick(current, tick));
        }, tick.offsetMs),
      ),
      window.setTimeout(() => setFlowStage("Watching replay"), 600),
      window.setTimeout(() => setFlowStage("Event received"), 1_500),
      window.setTimeout(() => setFlowStage("Receipt verified"), 1_900),
      window.setTimeout(() => setFlowStage("Leaderboard updated"), 2_300),
      window.setTimeout(() => setFlowStage("Share card ready"), 2_500),
    ];

    return () => timers.forEach((timer) => window.clearTimeout(timer));
  }, [room.joined]);

  const joinRoom = () => {
    setFlowStage("Joined");
    setRoom((current) => createSeededGuest(current, selectedPick));
  };

  return (
    <main className="app-shell">
      <section className="room-panel" aria-label="FanPulse match room">
        <section className="evidence-strip" aria-label="Live evidence strip">
          <span>Live TxLINE: not configured</span>
          <span>Replay room: active</span>
          <span>Receipt: {room.latestReceipt?.verified ? "verified" : "replay proof ready"}</span>
          <span>Mode: points only</span>
        </section>

        <header className="topbar">
          <div>
            <p className="eyebrow">FanPulse</p>
            <h1>FanPulse verified match room</h1>
            <p className="subtitle">Predict the next moment with friends. TxLINE proof verifies the highlight card.</p>
            <div className="hero-badges">
              <span>Consumer and Fan Experiences</span>
              <span>Points-only / no prizes / no wagering</span>
            </div>
          </div>
          <div className="status-stack">
            <span className="mode-pill">
              <Radio size={14} />
              {room.modeLabel}
            </span>
            <span className="proof-pill">
              <BadgeCheck size={14} />
              {room.latestReceipt?.verified ? "Receipt verified" : "Replay proof ready"}
            </span>
          </div>
        </header>

        <div className="compliance-banner">
          <BadgeCheck size={16} />
          <span>{room.complianceLabel}</span>
        </div>

        <section className="score-strip" aria-label="Current match pulse">
          <div>
            <span className="label">Room</span>
            <strong>{room.roomCode}</strong>
            <small>4 friends watching</small>
          </div>
          <div className="score">
            <span>{room.match.homeTeam}</span>
            <strong>
              {room.match.homeScore}-{room.match.awayScore}
            </strong>
            <span>{room.match.awayTeam}</span>
          </div>
          <div>
            <span className="label">Minute</span>
            <strong>{room.match.minute}'</strong>
            <small>{room.match.status}</small>
          </div>
        </section>

        <section className="match-pulse" aria-label="Match pulse">
          <div>
            <p className="eyebrow">What happens next?</p>
            <h2>Goal, card, or calm spell?</h2>
            <p>Choose your next-event pick. The seeded default is goal, so one click still runs the demo.</p>
            <div className="segmented-control" aria-label="Choose next-event pick">
              {pickOptions.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  aria-pressed={selectedPick === option.value}
                  disabled={room.joined}
                  onClick={() => setSelectedPick(option.value)}
                >
                  {option.label}
                </button>
              ))}
            </div>
            <p className="selected-pick">Your pick: {pickOptions.find((option) => option.value === selectedPick)?.label}</p>
          </div>
          <button className="join-button" onClick={joinRoom} disabled={room.joined}>
            <Users size={18} />
            {room.joined ? "Watching replay" : "Join room"}
          </button>
          <div className="friend-room" aria-label="Friend room signal">
            <span>M</span>
            <span>O</span>
            <span>J</span>
            <span>You</span>
          </div>
          <div className="flow-rail" aria-label="Replay reveal progress">
            {stageLabels.map((label) => (
              <span key={label} className={flowStage === label ? "active" : ""}>
                {label}
              </span>
            ))}
          </div>
        </section>

        <section className="grid">
          <article className="leaderboard" aria-label="Friend leaderboard">
            <div className="section-title">
              <Trophy size={18} />
              <h2>Friend leaderboard</h2>
            </div>
            <ol>
              {room.leaderboard.map((entry) => (
                <li key={entry.id}>
                  <span className={`rank movement-${entry.movement}`}>{entry.rank}</span>
                  <span className="friend-name">{entry.displayName}</span>
                  <span className="streak">{entry.streak} streak</span>
                  <strong>{entry.lastDelta > 0 ? `+${entry.lastDelta}` : entry.points}</strong>
                </li>
              ))}
            </ol>
          </article>

          <article className="moment-card" aria-label="Verified moment card">
            <div className="section-title">
              <Share2 size={18} />
              <h2>{momentCard.title}</h2>
            </div>
            <p className="scoreline">{momentCard.scoreline}</p>
            <p>{momentCard.biggestEvent}</p>
            <p>{momentCard.topStreak}</p>
            <span className="receipt">
              {momentCard.receiptStatus === "verified" ? "Receipt verified" : "Replay proof ready"}
            </span>
            <ol className="moment-timeline" aria-label="Verified moment timeline">
              {momentCard.timeline.map((step) => (
                <li key={step.label}>
                  <span>{step.label}</span>
                  <strong>{step.status === "verified" ? "verified" : step.status.replace("_", " ")}</strong>
                  <p>{step.details}</p>
                  <code>{step.endpoint}</code>
                </li>
              ))}
            </ol>
            <blockquote>{momentCard.shareText}</blockquote>
          </article>
        </section>

        <section className="feed" aria-label="AI pundit template feed">
          <div className="section-title">
            <Sparkles size={18} />
            <h2>AI pundit feed</h2>
          </div>
          {room.feed.map((item) => (
            <article key={item.id}>
              <span>{item.minute ? `${item.minute}'` : "Now"}</span>
              <div>
                <h3>{item.title}</h3>
                <p>{item.body}</p>
              </div>
            </article>
          ))}
        </section>

        <footer>
          <Activity size={16} />
          Hackathon demo using synthetic replay fixtures. No real-money wagering, custody, financial advice, gambling
          service, prizes, deposits, token incentives, or tournament-organizer affiliation.
        </footer>
      </section>
    </main>
  );
}
