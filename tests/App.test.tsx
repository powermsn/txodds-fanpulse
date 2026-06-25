import { act, fireEvent, render, screen, within } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import App from "../src/App";

describe("FanPulse app", () => {
  it("shows the replay-first room contract before joining", () => {
    render(<App />);

    expect(screen.getByRole("heading", { name: "FanPulse verified match room" })).toBeInTheDocument();
    expect(
      screen.getByText("Predict the next moment with friends. TxLINE proof verifies the highlight card."),
    ).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Join and reveal next moment" })).toBeInTheDocument();
    expect(screen.getByText("Replay demo mode")).toBeInTheDocument();
    expect(screen.getByText("Free fan game. No betting. No prizes.")).toBeInTheDocument();
    expect(screen.getAllByText("Replay proof ready").length).toBeGreaterThanOrEqual(1);
    expect(screen.getByText("PULSE-26")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Goal" })).toHaveAttribute("aria-pressed", "true");
    expect(screen.getByRole("button", { name: "Card" })).toHaveAttribute("aria-pressed", "false");
  });

  it("lets a judge choose a pick, join, and see the instant verified reveal", async () => {
    vi.useFakeTimers();
    render(<App />);

    fireEvent.click(screen.getByRole("button", { name: "Card" }));
    expect(screen.getByRole("button", { name: "Card" })).toHaveAttribute("aria-pressed", "true");

    fireEvent.click(screen.getByRole("button", { name: "Join and reveal next moment" }));
    expect(screen.getByText("Guest joined")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Watching replay" })).toBeDisabled();

    act(() => {
      vi.advanceTimersByTime(2_000);
    });

    const leaderboard = screen.getByLabelText("Friend leaderboard");
    expect(within(leaderboard).getByText("You")).toBeInTheDocument();
    expect(within(leaderboard).getByText("0")).toBeInTheDocument();
    expect(screen.getByText("Verified moment")).toBeInTheDocument();
    expect(screen.getByText(/Verified replay moment/)).toBeInTheDocument();
    expect(screen.getByText("Event tick")).toBeInTheDocument();
    expect(screen.getByText("Score update")).toBeInTheDocument();
    expect(screen.getByText("TxLINE proof")).toBeInTheDocument();
    expect(screen.getByText("/api/scores/stat-validation")).toBeInTheDocument();

    vi.useRealTimers();
  });
});
