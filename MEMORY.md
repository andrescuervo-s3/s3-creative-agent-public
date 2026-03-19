# S3 Creative Agent — Memory

Persistent context for development of this plugin. This file lives in the repo so it's available anywhere.

## User

Andres Cuervo is the owner of Studio 3 Marketing. He builds and maintains this plugin and is also its primary end user in Cowork. He uses it to generate foundational briefs and creative briefs for real clients. He prefers direct communication and wants things to work as specified without extra options or over-engineering.

## Deployment Workflow

1. Make changes locally
2. Commit and push to GitHub
3. In Cowork, click "Update" to pull the newest version
4. Test in Cowork to verify

Local changes have no effect in Cowork. Always push before testing.

## Key Decisions

- Plugin must stay in `s3-creative-agent/` subdirectory: Cowork's source field requires it
- Google Analytics removed as dependency: not available as MCP connector
- DataForSEO integration deferred: Andres has an account but no MCP connector exists yet
- Section 2.4 renumbered to 2.3 (no gap)
- Two-step routing for brief selector: (1) Foundational or Creative, (2) mode or subtype as a separate question

## Lessons Learned

- **Skills must behave exactly as written.** When the brief selector said "two separate questions," the Cowork agent flattened it into one. Fix: use strong directive language (CRITICAL, Do NOT, ONLY these options) to prevent the agent from improvising. (2026-03-19)
- **Do not add options not in the spec.** The agent added a "Something else" option on its own. Skills need to explicitly say "no more" after listing options. (2026-03-19)

## Test History

- **2026-03-18**: First live test with real client (TMP/Turnbull). Brief generated successfully but with formatting and structure issues. 13 feedback items logged in `.claude/session-log.md`.
- **2026-03-19**: Fixed brief selector two-step routing. Pending Cowork test.

## Feedback Backlog

See `.claude/session-log.md` for the full list. Key items:
1. Research Logs: compact format with live links
2. Social Media Research Log: table only, no narrative
3. Competitor/audience citations: live links required
4. Confidence vocabulary: standardize (Verified, Corroborated, Client-Reported, Unverified, Contradicted)
5. Competitors organized B2B first, then B2C
6. Brand Values: table format (Value | Description)
7. Layout compliance: agent ignored s3-docx-styles.md
