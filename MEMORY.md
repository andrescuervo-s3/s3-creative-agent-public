# S3 Creative Agent — Memory

Persistent context for development of this plugin. This file lives in the repo so it's available anywhere.

## User

Andres Cuervo is the owner of Studio 3 Marketing. He builds and maintains this plugin and is also its primary end user in Cowork. He uses it to generate foundational briefs and creative briefs for real clients. He prefers direct communication and wants things to work as specified without extra options or over-engineering.

## Deployment Workflow

1. Make changes locally
2. Commit and push to `origin` (private repo) only — a GitHub Action automatically mirrors to the public repo
3. In Cowork, click "Update" to pull the newest version
4. Test in Cowork to verify

**Do NOT push to the `public` remote manually.** The mirror workflow handles that. Pushing directly to public triggers a redundant workflow run that fails.

Local changes have no effect in Cowork. Always push before testing.

**IMPORTANT**: Every push must also update this MEMORY.md file with what changed (details, lessons learned, test status), then commit and push that update too. This keeps the project portable across machines and sessions.

## Key Decisions

- Plugin must stay in `s3-creative-agent/` subdirectory: Cowork's source field requires it
- Google Analytics removed as dependency: not available as MCP connector
- DataForSEO integration deferred: Andres has an account but no MCP connector exists yet
- Section 2.4 renumbered to 2.3 (no gap)
- Two-step routing for brief selector: (1) Foundational or Creative, (2) mode or subtype as a separate question

## Lessons Learned

- **`google_drive_fetch` does NOT support uploaded PDFs.** It only works with native Google Docs/Sheets/Slides. A PDF uploaded to Drive (not created as a Google Doc) will fail silently or return an error. The agent must detect this and fall back to: (1) Chrome tool to render the Drive viewer, (2) curl download if the file is public, (3) ask user to upload directly to chat. (2026-04-01)


- **Skills must behave exactly as written.** When the brief selector said "two separate questions," the Cowork agent flattened it into one. Fix: use strong directive language (CRITICAL, Do NOT, ONLY these options) to prevent the agent from improvising. (2026-03-19)
- **Do not add options not in the spec.** The agent added a "Something else" option on its own. Skills need to explicitly say "no more" after listing options. (2026-03-19)
- **Cowork agents don't have Claude Code tools.** There is no Read/Edit/Write tool in Cowork. For PDFs, agents must use Python libraries (pdfplumber, pypdf) or CLI tools (pdftotext, pdftoppm). Referencing "the Read tool" caused agents to give up on PDFs entirely. (2026-03-19)
- **Agents will skip steps if given an escape hatch.** The brief selector had a line saying "skip if the brief type is obvious." The agent used this to bypass routing entirely after reading a turnover email. Remove all shortcut language from routing skills. (2026-03-19)

## Build History

- **2026-04-01 (follow-up)**: Created shared `references/pdf-reading-protocol.md` — never-fail PDF reading chain (pdfplumber → pdftotext → pypdf → OCR via pdftoppm+tesseract → ask user to paste). Updated Foundational Brief and Strategy Brief SKILL.md to reference it instead of inline blocks. Both skills now point to the protocol in their Gotchas and Reference Files sections. Pending Cowork test.


- **2026-04-01**: Strategy Brief skill (Stage 2) designed and built. Full design spec at `docs/superpowers/specs/2026-04-01-strategy-brief-design.md`. Implementation plan at `docs/superpowers/plans/2026-04-01-strategy-brief.md`. Four files created:
  - `s3-creative-agent/skills/s3-strategy-brief/SKILL.md` (272 lines, orchestrator)
  - `s3-creative-agent/references/strategy-brief-sections.md` (295 lines, section templates)
  - `s3-creative-agent/references/s3-tech-stack.md` (71 lines, Tresio/DatoCMS/Mux platform reference)
  - `s3-creative-agent/references/s3-docx-styles.md` updated with scope callout style
  Key decisions: Structured Top + Freeform Bottom interaction model, `context: fork` for research agents, `allowed-tools` in frontmatter, auto-activatable (not disable-model-invocation), S3 Media Strategy = photo/video shoot production brief (not earned/owned/paid media), Work Agreement as scope anchor with inline + collected flagging, per-client CLAUDE.md/MEMORY.md creation. Pending Cowork test.

## Test History

- **2026-03-18**: First live test with real client (TMP/Turnbull). Brief generated successfully but with formatting and structure issues. 13 feedback items logged in `.claude/session-log.md`.
- **2026-03-19**: Fixed brief selector two-step routing. Also fixed foundational brief self-activating by inferring from context (e.g., reading a turnover email and skipping the selector). Three-question flow is now mandatory: (1) Foundational or Creative, (2) New/Update/Finalize, (3) Guided or Auto. Pending Cowork test.

## Feedback Backlog

See `.claude/session-log.md` for the full list. Key items:
1. Research Logs: compact format with live links
2. Social Media Research Log: table only, no narrative
3. Competitor/audience citations: live links required
4. Confidence vocabulary: standardize (Verified, Corroborated, Client-Reported, Unverified, Contradicted)
5. Competitors organized B2B first, then B2C
6. Brand Values: table format (Value | Description)
7. Layout compliance: agent ignored s3-docx-styles.md
