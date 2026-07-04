# FanPulse Demo Video Script

Target length: 3-5 minutes.

## 0:00-0:20 - Hook

Show the first screen on a mobile viewport.

Voiceover:

> FanPulse is a free verified match room for football fans. Friends predict the next moment, and the highlight card carries a TxLINE-style proof trail. This demo runs in replay mode so judges can test it without secrets, wallets, payments, or login.

Point out:

- `Live TxLINE: not configured`
- `Replay room: active`
- `Mode: points only`
- `Points-only / no prizes / no wagering`
- Goal/Card/Calm segmented control

## 0:20-1:10 - Instant Reveal

Leave `Goal` selected.

Click `Join room`.

Within about two seconds, show:

- score flips to `1-0`
- CTA changes to `Watching replay`
- reveal rail advances through `Event received`, `Receipt verified`, and `Share card ready`
- `You` moves to the top of the leaderboard with `+40`
- moment card changes to `Receipt verified`

Voiceover:

> The first event lands immediately for the demo. The room reacts like a social watch party, not a static score page.

## 1:10-2:00 - Prediction Choice

Reload or reset the page.

Choose `Card`, then click `Join room`.

Show that the goal event does not reward the wrong pick.

Voiceover:

> Judges can choose their own pick. The default path is a one-click success, but the scoring is tied to the selected next-event prediction.

## 2:00-3:00 - Verified Moment Timeline

Focus on the verified moment card.

Read the timeline:

- Event tick: `/api/scores/stream`
- Score update: `/api/scores/historical/{fixtureId}`
- TxLINE proof: `/api/scores/stat-validation`

Voiceover:

> The card is the TxODDS-specific part of the fan experience. The shareable highlight is not just a graphic; it shows the event, the score update, and the proof source that would validate the moment in live mode.

## 3:00-3:40 - Replay-First Judge Path

Show the fixture files or README briefly.

Voiceover:

> This submission is honest about its state: replay mode is the required judge path. The live adapter is documented with endpoint targets, but this public demo does not publish raw TxODDS data or require sponsor credentials.

## 3:40-4:20 - Compliance Close

Show the footer/compliance text.

Voiceover:

> FanPulse is a free fan game. It has no betting, no prizes, no deposits, no token incentives, no custody, no wallet requirement, and no FIFA or tournament-organizer affiliation.

## 4:20-5:00 - Closing

Return to the first screen or instant reveal state.

Voiceover:

> FanPulse fits Consumer and Fan Experiences because it turns match data into a fast, social, fan-facing room that a casual viewer understands in the first ten seconds.
