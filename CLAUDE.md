# S3 Creative Agent — Plugin Development Guide

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

### Key Patterns from Reference Skills

**Research Log pattern**: Structured intermediate output that must exist before any writing step. Format: searches performed → URLs fetched → claims extracted with confidence scores. Makes shortcuts visible and fabrication impossible.

**Validation rules**: Plan-validate-execute. Research agents produce structured output → validation rules check that output → writing phase uses only validated data.

**3-stage workflow** (from doc-coauthoring): Gather context → Refine/structure → Verify output. Applied here as: Research → Validate → Write.

**Gotchas format**: Specific corrections, not general advice. "Do NOT use copyright dates as founding year" not "be careful with dates."

### Validation
Run `skills-ref validate` after creating/modifying any SKILL.md to catch schema issues.

## Project Structure

```
s3-creative-agent/
├── references/
│   ├── audience-research-agent.md       ← Research protocol for 3.2 Audience Profiles
│   ├── competitor-research-agent.md     ← Research protocol for 3.3 Competitors
│   ├── confidence-scoring-spec.md       ← 5-level confidence scoring rules
│   ├── foundational-brief-sections.md   ← Section templates for the Foundational Brief
│   ├── research-validation-rules.md     ← 5 validation rules for Research Logs
│   ├── seo-digital-research-agent.md    ← Research protocol for 2.4 Digital Snapshot
│   └── social-media-discovery-agent.md  ← 6-platform social media discovery protocol
├── skills/
│   ├── s3-brief-selector/SKILL.md       ← Routes ambiguous "brief" requests
│   ├── s3-foundational-brief/SKILL.md   ← Orchestrator: Research → Validate → Write
│   ├── s3-creative-brief-website/SKILL.md
│   ├── s3-creative-brief-media/SKILL.md
│   ├── s3-creative-brief-paid-ads/SKILL.md
│   └── s3-creative-brief-social-media/SKILL.md
├── CLAUDE.md            ← This file
├── CONNECTORS.md
├── PLAN.md
└── README.md
```

## Writing Conventions
- No em dashes — use commas, colons, or periods
- No code/HTML/debug output in brief content
- Approval gates use exact wording specified in skill
- Facts only in foundational briefs — no recommendations or strategy
