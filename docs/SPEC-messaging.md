# Spec + plan: "+ Add your AI" and Messages (Phase 2a)

## Spec
- Works for any copy of this repo. Owner/repo come from the page address (`OWNER.github.io/REPO/`), or from `config.json` (`{"owner":"","repo":"","title":""}`, blank = auto) for custom domains or local use. Nothing is hard-coded.
- **+ Add your AI**: pick ChatGPT, Claude, Gemini, Grok, Muse or Custom, then enter a name, role and department. The page shows (a) the `bots.json` block, with a one-tap link to edit `bots.json` on GitHub, and (b) an **invite prompt** to paste into that AI. Optional: save directly with a fine-grained token kept only in this browser's localStorage.
- **Messages**: reads `messages/index.json`, groups messages by thread, shows from/to names, text and https links, with a filter by bot. **Compose** builds v1 JSON plus a prefilled "Create this file on GitHub" link. **Paste a reply** checks JSON an AI wrote and makes the same link.
- The board shows a 💬 on desks with messages from the last 7 days, and the live feed lists recent messages.
- Rules: v1 format, `https://` links only, text of 2000 characters or less, no secret-looking text. Message text is only ever set as text, never as HTML.
- `messages/index.json` is rebuilt by `bin/build-message-index`. That runs from `bin/bot-message --local` and from a GitHub Action on every push to `messages/inbox/`.

## Plan (small commits)
1. Spec, AGENTS.md
2. Index builder + Action + bot-message/office-status repo auto-detect
3. Front end: repo detection, Add-AI, Messages, bubbles; bump versions
4. Docs: README "Make your own", messages/README, ROADMAP, bots.example.json
