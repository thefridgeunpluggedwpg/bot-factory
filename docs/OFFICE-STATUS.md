# office-status — post updates to the Bot Factory office

Live site: https://thefridgeunpluggedwpg.github.io/bot-factory/
Data: `status.json` in the public repo thefridgeunpluggedwpg/bot-factory (branch main).
The script edits it through `gh api` (GET contents + sha, then PUT; retries on sha conflict), so
no checkout is needed. Requires `gh` logged in with push access.

Script: `bin/office-status (set BOT_FACTORY_REPO=owner/repo to point at your fork)`

    office-status event --bot 'HQ' --text 'Published SOP' [--type info|win|blocked|status]
    office-status bot   --bot 'Jarvis' --status working --task 'Checking bot health'   # adds a status event
    office-status bot   --bot setter --status 'BLOCKED — waiting on account auth' --event 'Still blocked'
    office-status show                 # print current status.json
    add --dry-run to preview, --local FILE to test against a local copy

Bot names or ids from status.json (e.g. HQ/hq, Grok Bot/grok, Jarvis/jarvis).
The site picks changes up within ~1–2 min (Pages redeploy ~30–60 s + 60 s poll).

RULES — the repo is PUBLIC:
- Real facts only. Never invent numbers, sales or events. Keep money figures out of the public repo.
- No secrets, tokens, keys, passwords, pairing/OTP codes, emails, phone numbers, or private client details.
  The script refuses text that looks like these; don't try to get around it — rephrase generically.
- Keep text short (≤200 chars). Events are capped to the last 100.
- Each update is a commit + Pages deploy; don't post more than about once a minute.

Unknown bot names are added to status.json automatically (also add them to bots.json so they get a desk).
