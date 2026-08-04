# S3 Creative Agent — Plugin Development Guide

## Deployment Workflow

This plugin is distributed through the Claude marketplace. The deployment cycle is:

1. Make changes locally in this repo
2. Commit and push to GitHub
3. In Cowork, click "Update" to pull the newest version of the plugin
4. Test in Cowork to verify changes work correctly

**Every change must be pushed to GitHub before it can be tested in Cowork.**

### Version Bumping

When bumping the plugin version, update BOTH files:
- `.claude-plugin/marketplace.json` (root level)
- `s3-creative-agent/.claude-plugin/plugin.json` (plugin subdirectory — this is what Cowork displays)

### When Update Won't Update

The happy path is: push to GitHub, wait ~1 min for the mirror, click **Update** in the Claude Desktop plugin manager. Greyed-out Update usually means "already latest" — but not always. Sometimes it means the Electron UI state is stuck at the old version and doesn't know a newer one exists.

Layers involved (in order of stickiness):

| Layer | Location | Fix |
|---|---|---|
| Marketplace metadata (git clone) | `~/.claude/plugins/marketplaces/s3-creative-agent-marketplace/` | Deletes on marketplace remove |
| Installed-plugin registry | `~/.claude/plugins/installed_plugins.json` | Deletes on plugin uninstall |
| Old on-disk cache (legacy) | `~/.claude/plugins/cache/s3-creative-agent-marketplace/` | `rm -rf` the directory |
| **Electron UI state (sticky)** | `~/Library/Application Support/Claude/{Local Storage,Session Storage,IndexedDB}/` | Survives Cmd+Q and reboot; nuking signs you out |

Recovery ladder — try in order, stop when it works:

1. Click the **⋯** menu on the plugin card, look for Reset / Reload / Check for updates.
2. Repeatedly click **Update** — sometimes the UI eventually catches up (observed after ~7 clicks on 2026-08-04).
3. Verify disk state matches expectations:
   ```bash
   cat ~/.claude/plugins/marketplaces/s3-creative-agent-marketplace/.claude-plugin/marketplace.json
   ```
   If that shows the new version but the UI shows the old one, the problem is Electron state, not disk.
4. Nuke Electron state (last resort — signs you out, resets UI prefs):
   ```bash
   rm -rf ~/Library/Application\ Support/Claude/Local\ Storage
   rm -rf ~/Library/Application\ Support/Claude/Session\ Storage
   rm -rf ~/Library/Application\ Support/Claude/IndexedDB
   ```
   Then relaunch Claude Desktop, sign in, re-add the marketplace.

**Do not recommend** `rm -rf ~/Library/Caches/cowork/plugins/…` — that path doesn't exist on the current Desktop app; it was from an older Cowork build.

### GitHub Repo Setup (Private + Public Mirror)

Two GitHub repos, auto-synced via a GitHub Action. Both Cowork installs (Andrés's personal Max account and the S3 Teams account) end up tracking the same code because of this mirror.

| Repo | Visibility | Purpose |
|---|---|---|
| `andrescuervo-s3/s3-creative-agent` | PRIVATE | Working repo. All `git push` goes here. Personal Max Cowork pulls from here. |
| `andrescuervo-s3/s3-creative-agent-public` | PUBLIC | Auto-mirror. S3 Teams Cowork pulls from here (Teams can't access the private repo). |

The mirror lives at `.github/workflows/mirror-to-public.yml`: every push to `main` force-pushes `main` to the public repo (~1 min lag). Uses secret `PUBLIC_REPO_TOKEN`.

**Deployment is one push, two Update clicks:**
1. `git push origin main` — private repo updates immediately
2. Mirror action runs — public repo updates ~1 min later
3. In Cowork, click **Update** separately on the Personal install AND the S3 Teams install (Cowork does not auto-pull)
4. Greyed-out **Update** button = already on the latest version (this is what you want to see)

If the two installs ever show different versions, the issue is Cowork-side caching, not GitHub. Verify with `git show origin/main:.claude-plugin/marketplace.json` vs `git show public/main:.claude-plugin/marketplace.json`. If those match, the repos are fine and Cowork just needs Update clicked (or the cache cleared).

## Reference Material — READ BEFORE BUILDING

The `.reference/` directory contains two repos that must be consulted before creating or modifying any skill:

- **`.reference/anthropic-skills/`** — Anthropic's official example skills. Study the `skills/` examples, `spec/`, and `template/` before building. Match their patterns, structure, and conventions.
- **`.reference/agentskills/`** — The Agent Skills spec repo. Contains the full specification in `docs/` and the `skills-ref` CLI validator.

**When creating a new skill or modifying an existing one, always check the Anthropic examples first.** Do not guess at conventions or invent structure. Follow what Anthropic demonstrates.

## Agent Skills Spec Summary

This plugin follows the [Agent Skills specification](https://github.com/agentskills/agentskills). Key constraints:

### SKILL.md Requirements
- **Frontmatter fields**: `name` (required, max 64 chars, lowercase+hyphens, must match directory name), `description` (required, max 1024 chars)
- **Optional fields**: `license`, `compatibility`, `metadata`, `allowed-tools`
- **Body target**: <500 lines, <5000 tokens. Move detailed content to `references/` files.

### Progressive Disclosure (3 tiers)
1. **Metadata** (~100 tokens): `name` + `description` loaded at startup for all skills
2. **Instructions** (<5000 tokens): Full `SKILL.md` body loaded when skill activates
3. **Resources** (as needed): `references/`, `scripts/`, `assets/` loaded on demand

### Reference File Patterns
- Keep references one level deep from SKILL.md
- Each file should be focused and self-contained
- Agent loads these on demand — smaller files = less context waste
- Use relative paths from skill root: `references/filename.md`

### Skill vs. Shared Reference — Decide Before Writing
Before adding any instruction, rule, or standard to a SKILL.md, ask: does this apply to more than one skill? If yes, it belongs in a reference file. Shared references are duplicated into each skill's `references/` directory (not at the plugin root) because Cowork copies plugins to a cache and cannot resolve paths outside the skill directory.

When updating a shared reference, update it in ALL skill directories that contain it.

Examples of shared references: `chat-formatting.md`, `pdf-reading-protocol.md`, `s3-docx-styles.md`, `confidence-scoring-spec.md`.
Examples of skill-specific content: section templates, routing logic, skill-specific gotchas.

### Key Patterns

**Research Log pattern**: Structured intermediate output that must exist before any writing step. Format: searches performed, URLs fetched, claims extracted with confidence scores. Makes shortcuts visible and fabrication impossible.

**Validation rules**: Plan-validate-execute. Research agents produce structured output, validation rules check that output, writing phase uses only validated data.

**3-stage workflow**: Research, Validate, Write.

**Gotchas format**: Specific corrections, not general advice. "Do NOT use copyright dates as founding year" not "be careful with dates."

### Validation
Run `skills-ref validate` after creating/modifying any SKILL.md to catch schema issues.

## Project Structure

```
s3-creative-agent/                          <- GitHub repo root
├── .claude/
│   └── session-log.md                      <- Session notes and feedback backlog
├── .claude-plugin/
│   ├── marketplace.json                    <- Plugin manifest
│   └── plugin.json
├── s3-creative-agent/                      <- Plugin root (Cowork reads from here)
│   ├── .claude-plugin/plugin.json
│   ├── CONNECTORS.md
│   └── skills/
│       ├── s3-brief-selector/SKILL.md      <- Two-step routing: brief type then mode
│       ├── s3-foundational-brief/
│       │   ├── SKILL.md                    <- Orchestrator: Research, Validate, Write
│       │   └── references/                 <- 10 files (research agents, validation, sections, etc.)
│       ├── s3-strategy-brief/
│       │   ├── SKILL.md                    <- Strategy orchestrator
│       │   ├── assets/                     <- Font files + embed-fonts.py script
│       │   └── references/                 <- 11 files (strategy sections, tech stack, shared refs)
│       ├── s3-recommendation-doc/
│       │   ├── SKILL.md                    <- B&W recommendation doc builder
│       │   └── references/                 <- 3 files (rec-doc components, docx styles, formatting)
│       ├── s3-creative-brief-website/SKILL.md
│       ├── s3-creative-brief-media/SKILL.md
│       ├── s3-creative-brief-paid-ads/SKILL.md
│       └── s3-creative-brief-social-media/SKILL.md
├── CLAUDE.md                               <- This file
├── CONNECTORS.md
├── PLAN.md
└── README.md
```

## Skills Overview

### Brief Selector (router)
Entry point when user says "brief" without specifying type. Two-step routing:
1. Ask: Foundational Brief, Strategy Brief, or Creative Brief
2. Ask the follow-up based on answer (mode for foundational, subtype for creative)

### Foundational Brief
Evergreen client onboarding document. Three modes: New (Draft), Update (Draft), Finalize.
Full flow: Document Collection, Build Mode (Guided/Auto), then sections 1.0 through 3.4.
Research agents run for: social media (2.1), SEO/digital (2.3), audiences (3.2), competitors (3.3).

### Strategy Brief
Formalizes foundational facts + creative call outputs into strategic recommendations. Collaborative conversation. Document structure: 1.0 Brand Strategy, 2.0 Channel Strategies (in-scope only), 3.0 Scope Alignment, 4.0 Recommendations (out-of-scope upsell). Pressure test is a conversation-only quality gate. Output: .docx with embedded Open Sans fonts.

### Creative Briefs (4 subtypes)
Project-specific briefs: Website, Media, Paid Ads, Social Media. These are next to be built.

### Recommendation Document
Short (2-6 page) internal B&W strategy doc for client meetings. Not a brief.

## Writing Conventions
- No em dashes: use commas, colons, or periods
- No code/HTML/debug output in brief content
- Approval gates use exact wording specified in skill
- Facts only in foundational briefs: no recommendations or strategy

## Known Issues / Feedback Backlog
See `.claude/session-log.md` for the full list of 13 feedback items from the first live test (TMP/Turnbull, 2026-03-18).

<!-- claude-max-s3:history-pointer -->
## Project History

Prior Claude Code session summaries for this project live at:
`~/claude-max-s3/projects/s3-creative-agent/`

Each dated entry has a `.md` summary (read these first) and a `.jsonl` raw transcript (dig in only if you need the full transcript).

When asked about past decisions or prior work on this project, read the recent `.md` files there before answering.
