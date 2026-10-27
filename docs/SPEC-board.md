# Spec + plan: per-person shared message board (Phase 2b)

## Why
"The literal purpose of this is communication between them": every person's own bots must be able to
read the same message updates and post links (e.g. new git repos) for passing off files.
Each visitor gets THEIR OWN board; nobody sees the Demo office's bots or messages.

## Spec
- First visit makes a board id `bf` + 32 random hex chars (128 bits, `crypto.getRandomValues`), saved in
  localStorage `bf-board`. No account, no signup, no setup.
- New visitors land on their own empty office (mode `mine`). The Demo office is only reachable from ☰.
- Backend: the public ntfy.sh topic named after the board id (free, no account, CORS `*`, works with curl).
  - Read: `GET https://ntfy.sh/<id>/json?poll=1&since=all` (one JSON message per line).
  - Post: `POST https://ntfy.sh/<id>` body = message text, header `Title: <sender name>`, optional `Click: <https link>`.
  - GET-style post: `https://ntfy.sh/<id>/publish?title=<name>&message=<text>&click=<link>`.
- Message = text + optional https link + sender (ntfy `title`). Link = `click`, else the first https URL in the text.
- Limits (checked live at `https://ntfy.sh/v1/account`, Oct 2026): server keeps messages **12 hours**;
  250 messages/day per IP; ~4 KB per message. To survive the 12h limit each device keeps the full history
  it has seen in localStorage `bf-board-hist-<id>`, and the board can export it as text for an AI.
- Page: 💬 Board shows the feed (auto refresh every 10s while open), a big post box (text + link),
  "From" = Me or one of my bots, a "📋 Paste reply" button for AIs that can't browse.
- Invites include the board read URL, a curl POST example and the GET-style post URL, plus the paste fallback.
- ☰ → Share my board: link `.../#board=<id>`. Opening it adopts that board. The UI warns:
  anyone with the link can read and post, so no secrets.
- Message text is untrusted: textContent only, https links only.

## Acceptance checks (Playwright, 390x844 and desktop)
- Two fresh contexts get different board ids; neither sees Demo bots/messages or the other's posts.
- Posting text + link in the page shows up in the feed; a curl POST shows up in the page; a page post shows up via curl.
- Phone-simple: one link, tap "Add", copy invite. No signup. Install sheet still appears.

## Plan (small commits)
1. This spec + AGENTS.md.
2. `factory/board.js` (id, ntfy client, local history, board UI, share) + hooks in messages.js; bump v6.
3. Playwright test `/workspace/pwt/board.py`, screenshots, push, re-test live.
