# S3 Creative Agent — Plugin Development Guide

## Deployment Workflow

This plugin is distributed through the Claude marketplace. The deployment cycle is:

1. Make changes locally in this repo
2. Commit and push to GitHub
3. In Cowork, click "Update" to pull the newest version of the plugin
4. Test in Cowork to verify changes work correctly

**Every change must be pushed to GitHub before it can be tested in Cowork.**

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
│   ├── references/
│   │   ├── audience-research-agent.md      <- Research agent for 3.2 Audience Profiles
│   │   ├── competitor-research-agent.md    <- Research agent for 3.3 Competitors
│   │   ├── confidence-scoring-spec.md      <- 5-level confidence scoring rules
│   │   ├── foundational-brief-sections.md  <- Section templates for the Foundational Brief
│   │   ├── research-validation-rules.md    <- 5 validation rules for Research Logs
│   │   ├── s3-docx-styles.md              <- Document styling spec for .docx output
│   │   ├── seo-digital-research-agent.md   <- Research agent for 2.3 Digital Snapshot
│   │   └── social-media-discovery-agent.md <- 6-platform social media discovery agent
│   └── skills/
│       ├── s3-brief-selector/SKILL.md      <- Two-step routing: brief type then mode
│       ├── s3-foundational-brief/SKILL.md  <- Orchestrator: Research, Validate, Write
│       ├── s3-creative-brief-website/SKILL.md
│       ├── s3-creative-brief-media/SKILL.md
│       ├── s3-creative-brief-paid-ads/SKILL.md
│       ├── s3-creative-brief-social-media/SKILL.md
│       └── s3-recommendation-doc/SKILL.md
├── CLAUDE.md                               <- This file
├── CONNECTORS.md
├── PLAN.md
└── README.md
```

## Skills Overview

### Brief Selector (router)
Entry point when user says "brief" without specifying type. Two-step routing:
1. Ask: Foundational Brief or Creative Brief (two options only, separate question)
2. Ask the follow-up based on answer (mode for foundational, subtype for creative)

### Foundational Brief
Evergreen client onboarding document. Three modes: New (Draft), Update (Draft), Finalize.
Full flow: Document Collection, Build Mode (Guided/Auto), then sections 1.0 through 3.4.
Research agents run for: social media (2.1), SEO/digital (2.3), audiences (3.2), competitors (3.3).

### Creative Briefs (4 subtypes)
Project-specific briefs: Website, Media, Paid Ads, Social Media.

### Recommendation Document
Short (2-6 page) internal B&W strategy doc for client meetings. Not a brief.

## Writing Conventions
- No em dashes: use commas, colons, or periods
- No code/HTML/debug output in brief content
- Approval gates use exact wording specified in skill
- Facts only in foundational briefs: no recommendations or strategy

## Known Issues / Feedback Backlog
See `.claude/session-log.md` for the full list of 13 feedback items from the first live test (TMP/Turnbull, 2026-03-18).
