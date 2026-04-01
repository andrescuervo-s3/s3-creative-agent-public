# Strategy Brief Skill — Design Spec

**Date:** 2026-04-01
**Skill:** `s3-strategy-brief`
**Stage:** Stage 2 in the S3 Creative Agent pipeline
**Output:** .docx document
**Location:** `s3-creative-agent/skills/s3-strategy-brief/SKILL.md`

## Purpose

The Strategy Brief formalizes foundational facts and creative call outputs into strategic recommendations. It is the first document where creative direction exists. It sits between the Foundational Brief (facts) and the Creative Briefs (channel-specific execution).

**Who it's for:** S3 internal team. Aligns everyone on direction before creative execution.

**When it's built:** After the creative call. After the Foundational Brief exists.

## Interaction Model: Structured Top, Freeform Bottom

The skill has four phases:

1. **Ingestion** — structured, mostly automatic
2. **Auto-Summary** — agent synthesizes into document skeleton
3. **Conversation** — brand strategy is guided, channel strategies are freeform
4. **Pressure Test + Output** — closing gate, then .docx generation

## Phase 1: Ingestion

### Required Inputs (skill won't proceed without these)

- **Foundational Brief** (.docx) — uploaded or found on Google Drive. The agent extracts the "Created" date from the cover section (1.1) to use as the time filter for all subsequent scans. Format is "Month Day, Year" (e.g., "March 15, 2026"). Fallback order: (1) "Created" field in section 1.1, (2) "Last Updated" field in section 1.1, (3) file modification date on Drive or filesystem. If no date can be determined, ask the user: "When was the foundational brief created? I need this to filter for new material."
- **Work Agreement** — uploaded or found on Google Drive. Can be .docx, .pdf, or any readable format. The agent extracts line items and presents them for user confirmation before using them as the scope reference. Work Agreements are boilerplate and typically list big buckets (e.g., "SEO retainer," "website build," "paid ads," "photo/video shoot"). The agent extracts what it finds and asks: "Here are the line items I found in the Work Agreement: [list]. Is this complete, or should I add anything?"

### Automatic Scans (connector-dependent)

All scans filter to material **created or modified since the Foundational Brief's created date**. For threaded sources (Slack), this means threads with **new messages** since that date. "Modified since" catches documents that existed before the foundational but were edited after it.

- **Slack:** threads mentioning client name (requires Slack connector)
- **Google Drive:** files related to client, created or modified since foundational date (requires Google Drive connector)
- **Google Docs:** documents mentioning client, modified since foundational date (requires Google Docs connector)
- **Local Cowork folder:** any documents in the session workspace

**Note on Gmail:** Gmail is not currently configured as a plugin connector. If Gmail becomes available, add it to the scan list. For now, the user can upload or paste relevant email content manually.

### User Prompt After Scans

> "Anything else to add? Verbal notes, transcripts, attachments, data exports?"

### Ingestion Output

Before moving to auto-summary, the agent presents a catalog:
- Sources found, organized by origin (Slack, Drive, Docs, uploads)
- Key themes flagged across sources
- Work Agreement line items extracted and confirmed

### Ingestion Completion

After presenting the catalog, the agent asks: "Does this cover everything, or do you have more to add before I start building the summary?" The agent proceeds to Phase 2 only after the user confirms. If the user adds more material, the agent updates the catalog and asks again.

## Phase 2: Auto-Summary

The agent synthesizes all ingested material into a first pass at the full document skeleton, presented as one message.

- **Brand Strategy (1.0):** Pulls forward finalized facts from the foundational brief (audiences, brand values, mission if stated). Drafts initial versions of each subsection as starting points.
- **Channel Strategies (2.0):** For each channel with relevant material in ingested sources, drafts a summary of themes, direction, and data points. Channels with no material are marked "No input yet."
- **Scope flags:** Work Agreement line items listed alongside which channel sections address them. Gaps called out immediately.
- **The Bright Idea (1.7):** If any ingested source contains a creative concept or throughline, the agent surfaces it. Otherwise marked "To be developed."

## Phase 3: Conversation

### Brand Strategy (1.0) — Guided

The agent walks through each subsection in order:

1.1 Brand Positioning → 1.2 Mission → 1.3 Value Prop → 1.4 Audiences → 1.5 Voice & Tone → 1.6 Messaging → 1.7 Bright Idea

For each subsection, the agent presents what it has, asks "Does this capture it?", and refines based on input. Lightweight approval per subsection, not a hard gate. The user can say "come back to this" and skip ahead.

**Deferred subsection tracking:** The agent maintains an internal checklist of which subsections are settled vs deferred. When the user skips a subsection, the agent notes it. Before transitioning to Channel Strategies, the agent checks for deferred items: "Before we move to channel strategies, you deferred Brand Positioning and Messaging Framework. Want to come back to those now, or handle them after the channel work?" If the user defers again, the agent raises them one final time before the pressure test.

### Channel Strategies (2.0) — Freeform

After brand strategy is settled, the agent presents channel summaries and asks: "Where do you want to start?"

The user drives. The agent:
- Listens to riffing and organizes into the right sections
- Asks follow-up questions when something is vague or incomplete
- Flags scope expansion inline as ideas surface (e.g., "This is outside the current Work Agreement — flagging for 3.2")
- Spins up research agents on demand when the user asks questions requiring deeper data (SEO keywords, audience data, competitor analysis)
- Handles section-jumping without losing context
- Tracks what has been discussed and what hasn't

When the conversation naturally winds down, the agent prompts about untouched sections: "We haven't touched SEO or Content Strategy yet — do those apply to this engagement, or should we mark them not applicable?"

### Research Agents (On-Demand)

Research agents are not pre-scheduled. They fire when the user asks a question that requires deeper research. The same research agent reference files from the Foundational Brief apply:
- `audience-research-agent.md`
- `competitor-research-agent.md`
- `seo-digital-research-agent.md`
- `social-media-discovery-agent.md`

**How research works in the freeform context:**

- **Before researching, check the Foundational Brief first.** The foundational brief already contains research on audiences, competitors, SEO, and social media. The agent should reference this existing research before spinning up new queries. Only research what's genuinely new or needs updating.
- **Research Logs are presented inline** as a compact summary when the research completes (same format as foundational brief Research Logs: 3-8 entries with live clickable links). The user sees the results immediately in the conversation and can react.
- **Validation rules apply** with the same rigor as the Foundational Brief (source fetch proof, no phantom citations, confidence score integrity). Research-backed claims in the strategy brief carry confidence scores. User-stated strategic direction does not get confidence scores — it's the user's decision, not a researched fact.
- **The distinction:** Facts carry confidence scores. Strategy does not. "The local PI market is dominated by Morgan & Morgan" is a fact (needs a score). "We should position against Morgan & Morgan by emphasizing personal attention" is strategy (no score needed).

## Phase 4: Pressure Test + Output

When all applicable sections have content, the agent initiates the pressure test.

### Four Checks

1. **Audience Coverage** — Every audience from the Foundational Brief (section 3.2) has a communication angle in 1.4 and appears in at least one channel strategy. Orphaned audiences are flagged.

2. **Scope Coverage** — Every Work Agreement line item maps to a channel strategy section. If a sold service has no strategic direction, that's a flag.

3. **Strategic Coherence** — The Bright Idea threads through channel strategies. Intentional divergence is fine (thought leadership overall, testimonials on social) — unexplained divergence is flagged for clarification.

4. **Feasibility Notes** — Timeline, resource, or dependency constraints surfaced during conversation are collected. Not a blocker — observations only (e.g., "Website build depends on photo shoot completing first").

### After Checks Run

- Checks run sequentially: Audience Coverage first, then Scope Coverage, then Strategic Coherence, then Feasibility Notes. The user resolves flags from each check before moving to the next.
- Clean passes get confirmation
- Flags within each check are surfaced one at a time for the user to resolve, skip, or acknowledge
- Section 3.2 (Scope Expansion Opportunities) is populated with all inline flags collected during conversation
- Once satisfied, the agent generates the .docx

## Document Skeleton

```
STRATEGY BRIEF — [Client Name]
Status: DRAFT / FINAL
Created: [date]  |  Last Updated: [date]

1.0  Brand Strategy
  1.1  Brand Positioning (includes competitive differentiation)
  1.2  Mission Statement
  1.3  Value Proposition
  1.4  Target Audiences (with communication angles)
  1.5  Brand Voice & Tone (finalized)
  1.6  Messaging Framework (examples per audience)
  1.7  The Bright Idea

2.0  Channel Strategies
  2.1  Website Strategy
    2.1.1  Creative Direction (design language, UX priorities, content hierarchy)
    2.1.2  Technical Direction (platform, integrations, dev approach — informed by S3 tech stack)
  2.2  SEO Strategy
  2.3  Paid Advertising Strategy
  2.4  Social Media Strategy
  2.5  S3 Media Strategy (photo/video shoot direction — turnover to S3 Media team)
  2.6  Creative Direction (overall visual tone, photography style, design system across all touchpoints)
  2.7  Content Strategy

3.0  Scope Alignment
  3.1  Work Agreement Coverage (line items mapped to sections that address them)
  3.2  Scope Expansion Opportunities (collected inline flags with status)

4.0  Pressure Test Summary
  4.1  Audience Coverage Check
  4.2  Scope Coverage Check
  4.3  Strategic Coherence Check
  4.4  Feasibility Notes
```

Sections without content are marked "Not applicable to this engagement" rather than omitted. The structure is always the same.

## Scope Flagging (Inline + Collected)

When an idea surfaces during conversation that falls outside the Work Agreement line items:

- **Inline:** The idea lives in the relevant channel section with a visual callout: "Outside current scope — requires client approval" (styled as a distinct callout in the .docx, per s3-docx-styles.md)
- **Collected:** Section 3.2 aggregates all flagged items as a checklist. This is the last thing someone reads before moving to a creative brief. Items must be confirmed or removed before proceeding to the next stage.

## S3 Media Strategy — Key Distinction

Section 2.5 is NOT about earned/owned/paid media mix, PR direction, or media placements. It is the **production brief** for photo shoots and/or video shoots: what to shoot, where, talent considerations, location notes, visual references. This section, paired with a mood board, becomes the handoff package for the S3 Media team.

Section 2.6 (Creative Direction) is the **design system**: how the brand shows up visually across all touchpoints. Photography style, color application, typography expression, visual tone. 2.6 informs 2.5 (the shoot should reflect the design system), but they are different scopes: 2.5 is production logistics and shot direction, 2.6 is the overarching visual language.

This is also why the creative brief (Stage 3) exists as a standalone document separate from the creative turnover (Stage 4) — the creative brief is used along with the mood board to send to the media team.

## Technical Direction — S3 Tech Stack Reference

Section 2.1.2 (Technical Direction) is informed by a shared reference file: `references/s3-tech-stack.md`. This documents S3's proprietary platform:

- **Tresio** — S3's custom web platform (not WordPress, not a static site generator)
- **DatoCMS** — headless CMS for all content management
- **Mux** — video hosting and streaming
- **Component conventions** — `mod_*` (content modules), `partial_*` (reusable UI), `tresio-*` (platform components)

The agent references this when making technical recommendations so they align with what S3 actually builds on.

## Per-Client Project Context

When the strategy brief skill (or any skill) runs for a client, it creates two files in the client's project folder.

### Folder Convention

- **Claude Code:** The client project folder is wherever the user is working. If a folder already exists with a CLAUDE.md, the skill updates it. If not, the skill creates CLAUDE.md and MEMORY.md in the current working directory.
- **Cowork:** The session workspace is the project folder. Files persist in the Cowork session. The skill checks for existing CLAUDE.md/MEMORY.md before creating new ones.

### CLAUDE.md
- Client name, key people
- Documents produced (foundational brief, strategy brief, etc.)
- Key decisions made during the brief process
- Work Agreement line items
- Connectors used and what was found
- Working conventions specific to this client

### MEMORY.md
- Running index of session-to-session learnings about the client
- Follows the same memory format as the plugin's own MEMORY.md (index with pointers to individual memory files)

These files persist across sessions so any future work on this client has full context.

## Document Output

- Format: .docx
- Styling: per `references/s3-docx-styles.md` (Open Sans, heading hierarchy, tables, hyperlinks)
- Status badge: **Always DRAFT in v1.** FINAL stamping will come with a future Finalize mode.
- Dates: Created, Last Updated
- Location: Google Drive (if available) or local outputs
- No em dashes, no code/HTML in content
- **Heading level mapping:** 1.0 = H1, 1.1/2.1 = H2, 2.1.1/2.1.2 = H3, sub-fields within sections = H4
- **Scope callout styling:** Scope expansion flags use a bordered callout box (light gray background, left orange border, italic text). This style needs to be added to `s3-docx-styles.md` during implementation.
- **Incremental building:** Like the Foundational Brief, the .docx is built incrementally. After the Brand Strategy section is settled, it is appended to the working document. Channel sections are appended as they are discussed. This provides session recovery — if the session disconnects, progress up to the last settled section is preserved in the .docx.

## Dependencies

- **Foundational Brief** — required input (Stage 1 must exist)
- **Work Agreement** — required input (scope anchor)
- **references/s3-tech-stack.md** — new shared reference file (needs creation from the raw tech stack doc provided by Andres; polish into a clean reference covering Tresio, DatoCMS, Mux, component conventions, and third-party integrations, with client-specific entries stripped)
- **references/s3-docx-styles.md** — existing, shared with Foundational Brief. Needs a scope callout style added (bordered box, light gray background, left orange border, italic text).
- **Research agent references** — existing, shared with Foundational Brief
- **references/document-collection-protocol.md** — the ingestion protocol is defined inline in this spec (Phase 1). For v1, use the inline definition. Extract the shared reference as a follow-up task so the Foundational Brief and future skills can share the same connector-aware intake pattern with their own filters.

## Modes

Unlike the Foundational Brief (which has New/Update/Finalize modes), the Strategy Brief starts with a single mode:

- **New (Draft)** — full flow as described above

Update and Finalize modes can be added later once the skill is proven. The conversational nature of the strategy brief makes update mechanics more complex than the foundational brief's section-by-section approach.

## Brief Selector Routing

The `s3-brief-selector` currently routes between Foundational Brief and Creative Brief (2-way fork). The Strategy Brief is a new document type. Routing options:

- **Direct invocation:** The user says "strategy brief" and the skill activates directly without going through the selector. This is the v1 approach.
- **Selector update (future):** When the brief selector is updated for the full pipeline, it should understand the sequential nature of the stages and suggest the appropriate next step based on what already exists for the client (e.g., "You have a foundational brief for this client. Ready to build the strategy brief?").

For v1, the strategy brief is triggered by the user explicitly requesting it. The selector update is a separate workstream.

## Gotchas

1. **Do NOT hallucinate strategic recommendations.** The agent organizes and formalizes what the user provides. It can ask clarifying questions, surface gaps, and push back during pressure testing. But it does not invent strategy unprompted. If a section has no input, it stays marked "No input yet" — not filled with generic advice.

2. **Do NOT confuse riffing with finalized direction.** During freeform conversation, the user may think out loud, change their mind, or explore options. The agent should track the latest position, not the first thing said. When in doubt, confirm: "Earlier you mentioned X, but just now you said Y. Which direction are we going with?"

3. **User-stated strategy does not get confidence scores.** Only researched facts carry confidence labels. "We should target millennials" is a strategic decision. "65% of the local market is millennials" is a claim that needs a source and a score.

4. **The Bright Idea can be plural.** One master throughline OR channel-specific ideas that serve different purposes. The agent must not force a single unified concept when the user is intentionally diverging by channel.

5. **Scope flags are additive, not blocking.** An out-of-scope idea is flagged and collected, not rejected. The user decides what to do with it. The agent's job is visibility, not gatekeeping.

6. **Do NOT research what the Foundational Brief already covers.** Before spinning up a research agent, check whether the foundational brief already has the data. Redundant research wastes time and context.

7. **Work Agreement line items are fuzzy.** They're big buckets like "SEO retainer" — not detailed specs. The agent matches them to channel sections by category, not by exact wording. When the match is ambiguous, ask.

8. **Section order in the document is fixed; conversation order is not.** The user can jump between sections freely during conversation. The document always outputs in skeleton order regardless of the order things were discussed.
