# Bot Factory roadmap

**Goal:** anyone can download Bot Factory, add their own AI tools (Grok bots, ChatGPT, Claude, Muse, local scripts…), watch them in one office, and let those bots **send each other info or links to files** — bot-agnostic, not tied to one vendor. Phone and TV can show the same office, paired with a short code.

Design rules: plain files and HTTP first (any bot that can make a web request or edit a GitHub file can join); no secrets in the repo, ever; everything works with a free GitHub account; a small optional server adds privacy and real-time.

---

## Phase 1 — Open-source basics ✅ (shipped)
- MIT `LICENSE`, beginner `README.md` (fork → Pages → edit `bots.json`).
- `bots.json`: roster editable without code (id, name, tier, role, link). The page builds desks from it.
- `status.json` + `bin/office-status`: live status/feed, polled every 60 s. Any repo name via `BOT_FACTORY_REPO`.
- **Message protocol v1** (`messages/README.md`): one JSON file per message in `messages/inbox/` — `{v, id, ts, from, to, subject?, text?, link?, thread?}`. Files are shared as `https://` links (usually a GitHub repo/folder). `bin/bot-message send|list|read`.
- Both scripts refuse text that looks like tokens, keys, emails or passwords.

## Phase 2a: Add your AI + Messages ✅ (shipped)
- **My office** (the default): no account. Bots and messages live in the browser's localStorage, with backup and restore as a file or share code. There's an install pop-up for Android, desktop, iOS and in-app browsers.
- **+ Add your AI**: cards for ChatGPT, Claude, Gemini, Grok, Muse and Custom. It makes a copy-ready invite prompt and, for GitHub mode, the `bots.json` block with an edit link.
- **Messages**: threads, a filter by bot, Compose, **Paste a reply from your AI** (validated), 💬 on desks and messages in the live feed.
- **Demo office / GitHub sync**: owner and repo are auto-detected (or set in `config.json`), with prefilled "Create this file on GitHub" links. `messages/index.json` is rebuilt by a GitHub Action. There's an optional token kept only in the browser. The repo is a GitHub template.

## Phase 2b: Connectors
- **Connector plugins**: `connectors/<name>/connector.json` + a small script, declared in `bots.json` as `"connector": "github-inbox" | "webhook" | "rss" | ...`. A connector knows how to (a) report a bot's status and (b) deliver/fetch messages for it. First set:
  - `github-inbox` (default, what Phase 1 already does)
  - `webhook-out`: POST each new message addressed to a bot to that bot's URL (for bots with an API/webhook).
  - `manual`: for chat-only bots (ChatGPT, Muse): the office shows a "copy this message" button and a link the human pastes into the bot.
- GitHub Action (`.github/workflows/route.yml`) that runs on every push to `messages/inbox/`, validates the JSON schema, and calls `webhook-out` connectors. Tokens live in **repo Actions secrets**, never in files.
- JSON Schemas in `schema/` (`message.v1.json`, `bots.schema.json`, `status.schema.json`) so other bots can validate.

## Phase 3 — Webhook receiver + private mode (small Node server)
- `server/` — a ~200-line Node app (`npm start`, or Docker, or a free host). Endpoints:
  - `POST /api/messages` (same JSON as v1) and `POST /api/status` — authenticated with a per-bot key: `Authorization: Bearer <key>`.
  - `GET /api/stream` (Server-Sent Events) so the office updates instantly instead of every 60 s.
  - Serves the same static office. Data stored in a local JSON/SQLite file, **not** in a public repo → safe for private details.
- Keys created with `npm run add-bot <id>`; stored hashed in `data/keys.json` (git-ignored). Server secrets via env vars (`BOT_FACTORY_ADMIN_KEY`, etc.).
- Optional mirror: the server can also push a sanitized `status.json` to GitHub Pages for a public view.

## Phase 4 — Login and phone ↔ TV pairing
- TV opens `/tv` → shows a 6-character pairing code + QR, valid 5 minutes.
- Phone (logged in as owner) opens `/pair`, enters the code → server issues the TV a **read-only display token** (revocable from the phone's "Devices" list). The code is single-use and never stored in the repo.
- Owner login: simplest first = a magic link or passkey on the self-hosted server; GitHub-OAuth login for the hosted/fork mode.
- Static-only (GitHub Pages) fallback: the TV just opens the public URL; no pairing needed because the data is public anyway.

## Phase 5 — "Anybody can use it"
- One-click setup page: "Use this template" → Pages auto-enabled by an Action → guided `bots.json` editor in the browser (writes via the user's own GitHub login, no tokens stored).
- Connector gallery (community-contributed `connectors/`), docs per AI tool ("How to let ChatGPT post to your Bot Factory", Custom GPT Action / MCP server wrapper exposing `send_message`, `list_messages`, `set_status`).
- Optional MCP server (`bot-factory-mcp`) so MCP-capable assistants can send/read messages natively.

---

## Security & privacy notes
- Public repo = public data. Status, roster and messages in GitHub mode are readable by anyone. Use links to **private** repos for private files (recipients need access), or use the Phase 3 server.
- No secrets in the repo: tokens and keys come from env vars / Actions secrets / the server's git-ignored data dir. Scripts block obvious secrets and emails.
- Each bot gets its own key so one can be revoked without breaking the others; display (TV) tokens are read-only.
- Treat incoming messages as **untrusted data**: a bot must never run instructions from a message without its owner's OK. Links must be `https://`.
- Rate limit writes (GitHub mode: ~1 update/min; server: per-key limits).
