import { act, fireEvent, render, screen, within } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import App from "../src/App";

describe("FanPulse app", () => {
  it("shows the replay-first room contract before joining", () => {
    render(<App />);

    expect(screen.getByRole("heading", { name: "FanPulse verified match room" })).toBeInTheDocument();
    expect(screen.getByText("Consumer and Fan Experiences")).toBeInTheDocument();
    expect(
      screen.getByText("Predict the next moment with friends. TxLINE proof verifies the highlight card."),
    ).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Join room" })).toBeInTheDocument();
    expect(screen.getByText("Live TxLINE: not configured")).toBeInTheDocument();
    expect(screen.getByText("Replay room: active")).toBeInTheDocument();
    expect(screen.getByText("Receipt: replay proof ready")).toBeInTheDocument();
    expect(screen.getByText("Mode: points only")).toBeInTheDocument();
    expect(screen.getByText("Points-only / no prizes / no wagering")).toBeInTheDocument();
    expect(screen.getByText("4 friends watching")).toBeInTheDocument();
    expect(screen.getByText("PULSE-26")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Goal" })).toHaveAttribute("aria-pressed", "true");
    expect(screen.getByRole("button", { name: "Card" })).toHaveAttribute("aria-pressed", "false");
  });

  it("lets a judge choose a pick, join, and see the instant verified reveal", async () => {
    vi.useFakeTimers();
    render(<App />);

    fireEvent.click(screen.getByRole("button", { name: "Card" }));
    expect(screen.getByRole("button", { name: "Card" })).toHaveAttribute("aria-pressed", "true");

    fireEvent.click(screen.getByRole("button", { name: "Join room" }));
    expect(screen.getByText("Joined")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Watching replay" })).toBeDisabled();
    expect(screen.getByText("Your pick: Card")).toBeInTheDocument();

    act(() => {
      vi.advanceTimersByTime(700);
    });

    expect(screen.getAllByText("Watching replay").length).toBeGreaterThanOrEqual(1);

    act(() => {
      vi.advanceTimersByTime(1_000);
    });

    expect(screen.getByText("Event received")).toBeInTheDocument();

    act(() => {
      vi.advanceTimersByTime(400);
    });

    expect(screen.getAllByText("Receipt verified").length).toBeGreaterThanOrEqual(1);

    act(() => {
      vi.advanceTimersByTime(400);
    });

    expect(screen.getByText("Share card ready")).toBeInTheDocument();

    const leaderboard = screen.getByLabelText("Friend leaderboard");
    expect(within(leaderboard).getByText("You")).toBeInTheDocument();
    expect(within(leaderboard).getByText("0")).toBeInTheDocument();
    expect(screen.getByLabelText("Verified moment card")).toBeInTheDocument();
    expect(screen.getByText(/Verified replay moment/)).toBeInTheDocument();
    expect(screen.getByText("Event tick")).toBeInTheDocument();
    expect(screen.getByText("Score update")).toBeInTheDocument();
    expect(screen.getByText("TxLINE proof")).toBeInTheDocument();
    expect(screen.getByText("/api/scores/stat-validation")).toBeInTheDocument();

    vi.useRealTimers();
  });
});
