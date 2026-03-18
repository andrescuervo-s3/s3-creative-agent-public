# Plan: Restructure S3 Foundational Brief Skill

## Context

The foundational brief skill produces an evergreen client document for Studio 3 Marketing. In live testing, it shortcuts research — citing sources it never fetched, fabricating statistics, and assigning false confidence scores. The core problem: a single monolithic skill tries to research AND write, so the model skips research and goes straight to plausible-sounding prose.

This restructure separates research from writing using specialized research agents with mandatory structured outputs, making shortcuts visible and fabrication impossible.

## Architecture: Research → Validate → Write

```
Orchestrator (SKILL.md)
  │
  ├── Step 0: Collect client documents from Google Drive
  │
  ├── Step 1: Build sections 1.0, 1.1, 2.1, 2.2 (document-sourced, minimal research)
  │     └── Dispatch: Social Media Discovery Agent (parallel)
  │
  ├── Step 2: Checkpoint — user reviews 2.1 Client Details
  │
  ├── Step 3: Dispatch research agents (parallel)
  │     ├── Audience Research Agent → structured findings
  │     ├── Competitor Research Agent → structured findings
  │     └── SEO/Digital Research Agent → structured findings
  │
  ├── Step 4: Validate all research outputs (inline validation rules)
  │
  └── Step 5: Write sections 2.4, 3.1, 3.2, 3.3, 3.4 using ONLY validated research
```

**Key rule**: The writing phase can ONLY use data that appears in a Research Log. No Research Log = no section content. Missing research = "Not Researched" confidence score visible in the output.

## New Directory Structure

```
plugins/s3-creative-agent/
├── references/
│   ├── audience-research-agent.md         ← REWRITE (replaces audience-profile-protocol.md)
│   ├── competitor-research-agent.md       ← REWRITE (replaces competitor-profile-protocol.md)
│   ├── social-media-discovery-agent.md    ← REWRITE (replaces social-media-discovery-protocol.md)
│   ├── seo-digital-research-agent.md      ← NEW
│   ├── research-validation-rules.md       ← NEW
│   ├── confidence-scoring-spec.md         ← NEW
│   ├── foundational-brief-sections.md     ← NEW (section templates extracted from SKILL.md)
│   └── s3-docx-styles.md                 ← UNCHANGED
└── skills/
    ├── s3-brief-selector/SKILL.md         ← MODIFY (add New/Update/Finalize routing)
    └── s3-foundational-brief/SKILL.md     ← REWRITE (orchestrator, ~400 lines)
```

Delete after confirming replacements work: `audience-profile-protocol.md`, `competitor-profile-protocol.md`, `social-media-discovery-protocol.md`

## Files to Create/Modify

### 1. `references/confidence-scoring-spec.md` (~70 lines) — NEW
Defines the five confidence levels with strict rules:
- **Verified**: Tier 1 source fetched in this session. URL required.
- **Corroborated**: 2+ independent sources fetched in this session.
- **Client-Reported**: From client documents only. No independent verification.
- **Unverified**: Research attempted, no confirming source found. Must state what was searched.
- **Not Researched**: Research not performed. Must state why (tool unavailable, site blocked, etc.)

Show-your-work format for each scored claim: Claim → Source → Reasoning → Score.

### 2. `references/research-validation-rules.md` (~80 lines) — NEW
Five rules applied after every research phase:
1. **Source Fetch Proof**: Every cited URL must appear in the Research Log as fetched
2. **No Phantom Citations**: Cannot name BLS, Pew, ABA etc. without fetching data from them
3. **Confidence Score Integrity**: Scores must match evidence per scoring spec
4. **Social Media Verification**: "Confirmed Official" requires observed backlink verification
5. **Completeness Gate**: Research Log must exist before writing begins

### 3. `references/foundational-brief-sections.md` (~200 lines) — NEW
All section templates, field specs, formatting — extracted from the current SKILL.md to keep the orchestrator lean. Covers:
- 1.0 Intro, 1.1 Cover (with status badge: DRAFT/FINAL, dates)
- 2.1 Client Details, 2.2 From the Client
- 2.4 Digital Snapshot (with SEO fallback)
- 3.1 Brand Essentials (includes Brand Voice Observed subsection)
- 3.2 Audiences Selection + Profiles (evidence as claim-to-source mapping)
- 3.3 Competitors (segmented by B2B vs B2C channel)
- 3.4 Market Differentiators (confidence scoring with show-your-work)
- **Removed**: 4.0 Brand Voice (standalone) and 5.0 Bright Idea

### 4. `references/audience-research-agent.md` (~120 lines) — REWRITE
Replaces `audience-profile-protocol.md`. Additions:
- Mandatory search queries per audience type (legal, medical, B2B, etc.)
- Structured Research Log output template (searches performed, URLs fetched, claims extracted with confidence)
- Evidence as claim-to-source mapping, not vague list
- Explicit "Do NOT" list: no fabricated statistics, no "studies show" without a specific study
- Source tiers remain, moved higher for prominence

### 5. `references/competitor-research-agent.md` (~120 lines) — REWRITE
Replaces `competitor-profile-protocol.md`. Additions:
- B2B vs B2C channel segmentation
- Mandatory search sequence: search each approved directory for the sector
- "Source of competitor identification" field: client docs, SEO discovery, or independent search
- Structured Research Log output template
- Sector-specific directory table remains

### 6. `references/social-media-discovery-agent.md` (~100 lines) — REWRITE
Replaces `social-media-discovery-protocol.md`. Additions:
- Explicit verification steps: fetch client website, check if social icons match discovered URLs
- 6-platform mandatory search checklist with pass/fail
- Verification method recording: "Checked website footer → link matches" vs "Name/branding match only"
- Structured output: platform, URL, verification method, result, confidence label

### 7. `references/seo-digital-research-agent.md` (~100 lines) — NEW
For section 2.4 Digital Snapshot:
- When client provides data: extract and format
- When no data available (the gap that failed in testing): fallback research protocol
  - `site:[domain]` search for indexed page count
  - Priority keywords + location searches to observe organic position
  - Google Business Profile check (review count, rating)
  - Local pack observation
  - Basic observable site signals
- Structured output with confidence scoring

### 8. `skills/s3-foundational-brief/SKILL.md` (~400 lines) — REWRITE
The orchestrator. Core structure:

```
YAML frontmatter (triggers, description)

## Role
You are an orchestrator that coordinates research and writes brief sections.
You CANNOT write research-dependent sections without first completing research.

## Modes
- New (Draft): Full flow
- Update (Draft): Read existing from Drive, update affected sections only
- Finalize: Resolve all Unverified/Client-Reported items, stamp as FINAL

## Step 0: Document Collection
- Ask client name
- Search Google Drive (fuzzy keyword matching)
- Present checklist, confirm before proceeding

## Build Mode Selection
- Guided: Approval gate after every section
- Auto: One checkpoint after 2.1, then generate all remaining sections

## Research Execution Contract
For every research-dependent section:
1. Read the corresponding agent reference file
2. Execute every research step
3. Output a structured Research Log (visible to user)
4. Apply validation rules from research-validation-rules.md
5. Write the section using ONLY data from the validated Research Log
6. Assign confidence scores per confidence-scoring-spec.md

If you cannot produce a Research Log, write "RESEARCH NOT PERFORMED"
and score every claim as "Not Researched."

## Section Sequence
[References foundational-brief-sections.md for templates]
- 1.0, 1.1: Direct write (no research needed)
- 2.1: Document-sourced + social media discovery agent
- 2.2: Document-sourced only
- CHECKPOINT (Auto mode stops here for user review)
- 2.4: SEO/digital research agent
- 3.1: Document-sourced + brand voice observation from web
- 3.2: Audience research agent (parallel per audience)
- 3.3: Competitor research agent
- 3.4: Synthesis from 2.1 + 3.1 + 3.3 (constrained section)

## Approval Gate Standard
- Guided: Stop after each section, ask for review
- On edit: Confirm what changed, don't reprint entire section
- Multiple notes in one message: Apply all, confirm as list
- Don't regenerate docx preview on every small edit

## Document Output
- Save to Google Drive: {Client Folder}/CREATIVE STRATEGY/{Client}_Foundational_Brief_DRAFT.docx
- Or save to local Drive sync folder if connector unavailable
- Status badge: DRAFT (black outline) or FINAL (black fill)
- Dates: Created + Last Updated

## Gotchas
- Year Founded: Never use copyright dates or domain registration dates
- Social media: All 6 platforms must be searched before marking "Not found"
- Competitors: Must include independently discovered competitors, not just client-named ones
- Client claims are assumptions until verified — treat with same skepticism as competitor claims
- PDF files in Google Drive cannot be read — ask user to upload PDFs directly
```

### 9. `skills/s3-brief-selector/SKILL.md` — MODIFY
- Rename Foundational Brief options: **New (Draft)**, **Update (Draft)**, **Finalize**
- Pass mode context to foundational brief skill via conversation

## Section Changes Summary

| Change | Detail |
|--------|--------|
| Remove 4.0 Brand Voice | Fold "Brand Voice (Observed)" into 3.1 Brand Essentials as subsection |
| Remove 5.0 Bright Idea | Moves to future Strategy Brief |
| Restructure 3.3 | Segment competitors by audience channel (B2B vs B2C) |
| Restructure 3.4 | Show-your-work confidence format with Competitive Set field |
| Rework Evidence | Claim-to-source mapping, not vague list |
| Add SEO fallback | 2.4 attempts its own research when no client data exists |
| Add status badge | DRAFT/FINAL on cover page |
| Add date tracking | Created + Last Updated on 1.1 Cover |

## Build Order

1. `confidence-scoring-spec.md` — everything references it
2. `research-validation-rules.md` — agents must produce validatable output
3. `foundational-brief-sections.md` — orchestrator and agents need output structure
4. `audience-research-agent.md` — rewrite
5. `competitor-research-agent.md` — rewrite
6. `social-media-discovery-agent.md` — rewrite
7. `seo-digital-research-agent.md` — new
8. `s3-foundational-brief/SKILL.md` — rewrite as orchestrator
9. `s3-brief-selector/SKILL.md` — update routing
10. Delete old reference files
11. Commit, push, sync plugin
12. Live test in Cowork

## Verification

1. **Research execution test**: Run New Draft for Turnbull. Verify Research Logs appear before each section. Every cited URL must be in the log.
2. **Fabrication test**: Run for a fictional company with minimal docs. Watch for phantom citations.
3. **Mode test**: Create draft → Update with new info → Finalize. Verify each mode works correctly.
4. **SEO fallback test**: Client with no analytics data. Verify fallback research runs.
5. **Social media test**: Verify all 6 platforms searched, verification labels match evidence.
6. **Section structure test**: Confirm 4.0 and 5.0 removed, Brand Voice Observed in 3.1, competitors segmented.
7. **Auto vs Guided test**: Auto has one checkpoint at 2.1. Guided has per-section gates.

## Pre-Implementation Setup (Step 0)

**0a. Verify reference repos exist in `.reference/` folder of this project:**
```
.reference/anthropic-skills/   — https://github.com/anthropics/skills.git
.reference/agentskills/        — https://github.com/agentskills/agentskills.git
```
If missing, clone them:
```bash
mkdir -p .reference
git clone https://github.com/anthropics/skills.git .reference/anthropic-skills
git clone https://github.com/agentskills/agentskills.git .reference/agentskills
```

**0b. Read the Agent Skills specification and best practices:**
- https://agentskills.io/home — Full spec, best practices, evaluation patterns, progressive disclosure, description optimization
- Read every page on that site before writing any files

**0d. Read these reference skills before writing any files:**
- `.reference/anthropic-skills/skills/doc-coauthoring/SKILL.md` — 3-stage workflow with context closure (the pattern we're following)
- `.reference/anthropic-skills/skills/skill-creator/SKILL.md` — evaluation framework with grader agents
- `.reference/anthropic-skills/skills/docx/SKILL.md` — production docx generation patterns

**0e. Create `CLAUDE.md` at the plugin repo root** with a summary of the Agent Skills spec. This ensures the spec is always in context during implementation. Covers:
- SKILL.md frontmatter requirements (name, description limits, allowed fields)
- Progressive disclosure (3 tiers: metadata → instructions → resources)
- SKILL.md body target: <500 lines, <5000 tokens
- Reference file patterns (when to load, how to link)
- Gotchas format (specific corrections, not general advice)
- Research Log pattern (structured intermediate output before writing)
- Validation rules (plan-validate-execute)
- Key patterns from doc-coauthoring (3-stage: gather → refine → test)

**0f. Use `skills-ref validate` after each skill file** to catch schema issues early. Install from `.reference/agentskills/` if needed.

## Open Items (Address After Core Restructure)

- **PDF reading strategy**: Google Drive can't read PDFs. Need a workaround.
- **CONNECTORS.md update**: Document bundled vs required connectors with setup instructions.
- **Strategy Brief skill**: New skill to build after foundational brief is solid (sits between foundation and creative briefs).
- **Creative brief skills**: Still placeholders, build after strategy brief exists.
