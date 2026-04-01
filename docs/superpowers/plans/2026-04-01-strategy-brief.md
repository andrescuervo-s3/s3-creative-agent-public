# Strategy Brief Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build the `s3-strategy-brief` skill (Stage 2) that formalizes foundational facts and creative call outputs into a strategic .docx document through a structured-then-freeform conversational flow.

**Architecture:** SKILL.md orchestrates four phases (Ingestion, Auto-Summary, Conversation, Pressure Test). Brand Strategy section is guided with lightweight approval gates. Channel Strategies are freeform with the agent organizing user input. Research agents fire on-demand, reusing existing reference files. The .docx builds incrementally for session recovery. Reference files handle the tech stack and strategy-brief-specific section templates.

**Tech Stack:** Agent Skills spec (SKILL.md + references/), docx-js for .docx generation, existing research agent references, existing connector infrastructure (Slack, Google Drive, Google Docs).

**Spec:** `docs/superpowers/specs/2026-04-01-strategy-brief-design.md`

---

## File Map

| Action | Path | Responsibility |
|--------|------|----------------|
| Create | `s3-creative-agent/skills/s3-strategy-brief/SKILL.md` | Main orchestrator: 4 phases, mode selection, approval gates, research dispatch, .docx output |
| Create | `s3-creative-agent/references/strategy-brief-sections.md` | Section templates: field order, formatting specs, heading mapping for every section in the skeleton |
| Create | `s3-creative-agent/references/s3-tech-stack.md` | S3 platform reference: Tresio, DatoCMS, Mux, component conventions, integrations |
| Modify | `s3-creative-agent/references/s3-docx-styles.md` | Add scope callout style (bordered box, light gray bg, left orange border, italic text) |

---

### Task 1: Create S3 Tech Stack Reference

**Files:**
- Create: `s3-creative-agent/references/s3-tech-stack.md`

This is a dependency for the SKILL.md (section 2.1.2 Technical Direction references it). Build it first.

- [ ] **Step 1: Write the tech stack reference file**

Polish the raw tech stack document provided by Andres into a clean reference. Structure:

```markdown
# S3 Technology Stack Reference

Internal reference for the S3 Creative Agent plugin. Used by strategy brief
(section 2.1.2 Technical Direction) and future skills that need platform context.

## Core Platform: Tresio

S3's proprietary web platform. Not WordPress, not a static site generator,
not an off-the-shelf CMS. Custom-built framework with its own component
architecture, rendering engine, navigation system, and CDN infrastructure.

Key indicators across all S3 sites:
- Tresio Tracking Script: tracking.tresio.co
- Tresio CDN: js.tresiocdn.com
- Tresio Nav System: tresio-nav__* (BEM convention)
- Tresio Config Object: window.tresioConfig

## Content Management: DatoCMS

Headless CMS. All content across S3 and client sites managed through DatoCMS.
Images served from www.datocms-assets.com. Provides structured content modeling
(content types, fields, taxonomies, relationships). Exposes content via GraphQL API,
which Tresio consumes to render pages.

## Video Infrastructure: Mux

Video hosting and streaming via Mux. Handles encoding, delivery, and thumbnail
generation. Tresio CDN layer (videos.tresiocdn.com) may proxy or cache video assets.

## Component Architecture

Consistent naming convention across all sites:

| Prefix | Purpose | Examples |
|--------|---------|----------|
| mod_* | Content modules (page-level content blocks) | mod_home_hero, mod_featured_slider, mod_hub |
| partial_* | Reusable UI fragments (shared across pages/sites) | partial_nav_header, partial_footer, partial_socials |
| tresio-* | Platform-level components (BEM-style) | tresio-nav__main, tresio-nav__link, tresio-ada-toggle |
| block | Generic content wrapper | General-purpose container class |

## Shared Components (Core Framework)

These appear identically across all S3 sites:
- partial_nav_header, partial_nav, partial_nav_item
- partial_footer
- partial_socials
- partial_a11y_menu, partial_a11y_disclaimer
- partial_cta_sub
- partial_breadcrumb
- tresio-nav__* (full BEM system)
- tresio-accessibility-menu

## Common Third-Party Integrations

| Service | Purpose |
|---------|---------|
| Google Tag Manager | Tag management and analytics orchestration |
| IconNode (scripts.iconnode.com) | Tracking / analytics layer |
| Adobe Typekit | Web font delivery |
| Cloudflare | CDN, security, performance analytics |
| Swiper.js | Touch-enabled carousel / slider library |

Note: Individual client sites may have additional integrations (Hotjar, Ahrefs,
Constant Contact, etc.) configured per engagement.

## Architecture Layers

1. **Content (DatoCMS)** — Structured content models, tagging, media assets, GraphQL API
2. **Platform (Tresio)** — Rendering engine, component framework, nav system, build/deploy pipeline
3. **Media (Mux + Tresio CDN)** — Video encoding, streaming, thumbnails, asset caching
4. **Analytics & Integrations** — GTM orchestration, proprietary tracking, per-client tools
```

Write this to the file. Strip all client-specific entries (Karam, Teitelbaum references). Keep it as a clean platform reference.

- [ ] **Step 2: Verify file is under the reference directory**

Run: `ls -la "s3-creative-agent/references/s3-tech-stack.md"`
Expected: file exists, reasonable size (~80-100 lines)

- [ ] **Step 3: Commit**

```bash
git add s3-creative-agent/references/s3-tech-stack.md
git commit -m "Add S3 tech stack reference for strategy brief technical direction"
```

---

### Task 2: Add Scope Callout Style to docx-styles

**Files:**
- Modify: `s3-creative-agent/references/s3-docx-styles.md`

- [ ] **Step 1: Read the current docx styles file**

Read `s3-creative-agent/references/s3-docx-styles.md` to find the right insertion point. Add the new style after the Tables section and before the Status Badge section.

- [ ] **Step 2: Add scope callout style definition**

Insert after the Tables section. The style should define:

```markdown
## Scope Callout

Used in the Strategy Brief for flagging ideas outside the current Work Agreement scope.

**Visual spec:**
- Full content width (9360 DXA)
- Left border: 3pt solid, orange (#E67E22)
- Background: light gray (#F5F5F5) via shading
- Text: italic, 11pt Open Sans, black
- Padding: 115 DXA all sides (matches table cell margins)
- Margin: 6pt above and below (spacing before/after: 120)

**docx-js config:**
```javascript
// Scope callout as a styled paragraph with borders and shading
new Paragraph({
  children: [
    new TextRun({
      text: "Outside current scope — requires client approval",
      italics: true,
      font: "Open Sans",
      size: 22, // 11pt
    }),
  ],
  border: {
    left: { style: BorderStyle.SINGLE, size: 6, color: "E67E22" }, // 3pt orange
  },
  shading: { type: ShadingType.SOLID, color: "F5F5F5" },
  spacing: { before: 120, after: 120 },
  indent: { left: 230 }, // ~115 DXA padding from border
})
```
```

- [ ] **Step 3: Verify the edit**

Read the file back. Confirm the scope callout section exists between Tables and Status Badge. Confirm no other sections were disrupted.

- [ ] **Step 4: Commit**

```bash
git add s3-creative-agent/references/s3-docx-styles.md
git commit -m "Add scope callout style to docx-styles for strategy brief scope flags"
```

---

### Task 3: Create Strategy Brief Section Templates

**Files:**
- Create: `s3-creative-agent/references/strategy-brief-sections.md`

This reference file defines the exact field order, formatting, and output expectations for every section in the strategy brief. Read by the agent before writing each section. Follows the same pattern as `foundational-brief-sections.md`.

- [ ] **Step 1: Write the section templates reference**

The file should cover every section in the skeleton with:
- Heading level (H1/H2/H3/H4)
- Field order within the section
- Formatting expectations (paragraph, table, bulleted list, etc.)
- What "done" looks like for that section
- Where the data comes from (foundational brief, user input, research, Work Agreement)

Structure:

```markdown
# Strategy Brief — Section Templates

Reference for the s3-strategy-brief skill. Read before writing each section.
Defines field order, heading levels, formatting, and data sources.

## Heading Level Mapping

| Skeleton Level | Heading | Example |
|---------------|---------|---------|
| 1.0, 2.0, 3.0, 4.0 | H1 | Brand Strategy |
| 1.1–1.7, 2.1–2.7, 3.1–3.2, 4.1–4.4 | H2 | Brand Positioning |
| 2.1.1, 2.1.2 | H3 | Creative Direction |
| Sub-fields within sections | H4 | Demographics |

---

## 1.0 Brand Strategy

### 1.1 Brand Positioning
**Heading:** H2
**Data source:** Foundational Brief sections 3.1 (Brand Essentials) and 3.4 (Market Differentiators), plus user strategic input
**Fields:**
- Positioning Statement (1-2 paragraphs: who the brand is, what space it claims, how it differentiates)
- Competitive Differentiation (paragraph or short bullets: how this positioning responds to the competitive set identified in the Foundational Brief section 3.3)
**Format:** Prose paragraphs. No tables. The positioning statement should read as a single coherent narrative, not a fill-in-the-blank template.

### 1.2 Mission Statement
**Heading:** H2
**Data source:** Foundational Brief section 3.1 (if mission existed), user refinement
**Fields:**
- Finalized Mission Statement (1-3 sentences)
**Format:** Single block of text. If the Foundational Brief had an observed mission, this is the finalized/evolved version. If none existed, this is new.

### 1.3 Value Proposition
**Heading:** H2
**Data source:** Foundational Brief sections 2.1, 3.1, user input
**Fields:**
- Value Proposition Statement (1-2 sentences: what the brand offers, to whom, and why it matters)
**Format:** Single block of text. Distinct from the mission statement (mission = purpose, value prop = promise to the customer).

### 1.4 Target Audiences
**Heading:** H2
**Data source:** Foundational Brief section 3.2 (audiences), user strategic refinement
**Fields per audience:**
- Audience Name (H3)
- Communication Angle (paragraph: how we speak to this audience, what matters to them, what messaging resonates)
- Channel Priority (which channels reach this audience best)
**Format:** H3 per audience. Each audience gets a communication angle that goes beyond the foundational profile. This is strategic, not factual.

### 1.5 Brand Voice & Tone
**Heading:** H2
**Data source:** Foundational Brief section 3.1 Brand Voice (Observed) table, user strategic direction
**Fields:**
- Voice Attributes (table: Attribute | Description — finalized, not observed)
- Tone Guidelines (paragraph: how the voice adapts across contexts — formal for legal, approachable for social, etc.)
**Format:** Table for attributes (matches foundational format), paragraph for tone. This is the directive version: "this is how we will sound."

### 1.6 Messaging Framework
**Heading:** H2
**Data source:** User input, informed by 1.1–1.5
**Fields per audience (from 1.4):**
- Audience Name (H3)
- Key Messages (2-4 bullet points: primary messages for this audience)
- Proof Points (2-3 bullet points: evidence or claims that support the messages)
- Sample Headlines or Taglines (2-3 examples, clearly labeled as drafts)
**Format:** H3 per audience with bulleted sub-fields. Messages should feel actionable, not abstract.

### 1.7 The Bright Idea
**Heading:** H2
**Data source:** User creative direction, informed by everything above
**Fields:**
- Master Concept (paragraph: the creative throughline, if unified) OR Channel Concepts (H3 per channel with its own concept, if divergent)
- How It Threads (paragraph: narrative of how the idea connects across channels — even when channels diverge, explain the logic)
**Format:** Flexible. One paragraph for unified, H3-per-channel for divergent. The "How It Threads" paragraph is always present.

---

## 2.0 Channel Strategies

### General Pattern
Each channel section follows this structure unless noted otherwise:
- **Objectives** (2-4 bullets: what success looks like for this channel)
- **Strategic Direction** (1-2 paragraphs: the approach)
- **Key Tactics** (bulleted list: specific actions or initiatives)
- **Audience Alignment** (which audiences from 1.4 this channel serves)
- **Bright Idea Application** (how 1.7 manifests in this channel)
- **Scope callout** (if applicable: inline flag per s3-docx-styles.md scope callout style)

### 2.1 Website Strategy
**Heading:** H2

#### 2.1.1 Creative Direction
**Heading:** H3
**Fields:** Design language, UX priorities, content hierarchy, user experience goals, visual direction for the site specifically.

#### 2.1.2 Technical Direction
**Heading:** H3
**Data source:** `references/s3-tech-stack.md`, user input
**Fields:** Platform notes (Tresio baseline), CMS considerations (DatoCMS), integrations needed, performance requirements, development approach, any platform-specific constraints.

### 2.2 SEO Strategy
**Heading:** H2
**Data source:** Foundational Brief section 2.3 (Digital Snapshot), user input, on-demand research
**Fields:** Follow general channel pattern. Key Tactics should include keyword targeting priorities, content strategy for organic, technical SEO priorities, local vs national approach.

### 2.3 Paid Advertising Strategy
**Heading:** H2
**Fields:** Follow general channel pattern. Key Tactics should include platform selection, budget allocation direction, audience targeting approach, campaign structure.

### 2.4 Social Media Strategy
**Heading:** H2
**Fields:** Follow general channel pattern. Key Tactics should include platform prioritization, content pillars, posting cadence direction, community approach.

### 2.5 S3 Media Strategy
**Heading:** H2
**IMPORTANT:** This is the production brief for photo/video shoots, NOT earned/owned/paid media mix.
**Fields:**
- Shoot Objectives (what the shoot needs to produce and why)
- Creative Direction for Shoot (visual tone, mood, references — informs the mood board)
- Shot Types Needed (headshots, lifestyle, product, environmental, video, etc.)
- Talent & Location Notes (who appears, where, any constraints)
- Deliverables Expected (what S3 Media hands back: edited photos, raw video, etc.)
**Format:** This section + a mood board becomes the S3 Media team handoff package.

### 2.6 Creative Direction
**Heading:** H2
**IMPORTANT:** This is the overall design system, NOT the website creative direction (2.1.1) or shoot direction (2.5).
**Fields:**
- Visual Tone (paragraph: the overarching look and feel)
- Photography Style (how photography should look across all uses)
- Color Application (how the brand colors are used in practice)
- Typography Expression (how type is used beyond just font choice)
- Design System Notes (patterns, components, or visual rules that apply across all channels)
**Format:** Prose paragraphs. This informs 2.5 (shoot should reflect design system) and 2.1.1 (website should express design system).

### 2.7 Content Strategy
**Heading:** H2
**Fields:** Follow general channel pattern. Key Tactics should include content pillars, editorial voice notes, content types and formats, blog/resource strategy.

---

## 3.0 Scope Alignment

### 3.1 Work Agreement Coverage
**Heading:** H2
**Data source:** Work Agreement line items (extracted and confirmed in Phase 1)
**Format:** Table with columns: Line Item | Addressed In | Status (Covered / Partial / Not Addressed)

### 3.2 Scope Expansion Opportunities
**Heading:** H2
**Data source:** Collected inline scope flags from sections 2.1–2.7
**Format:** Bulleted checklist. Each item includes: the idea, which section it appeared in, and status (Pending Confirmation / Approved / Removed). This is the last thing read before moving to a creative brief.

---

## 4.0 Pressure Test Summary

### 4.1 Audience Coverage Check
**Heading:** H2
**Format:** Table with columns: Audience (from Foundational 3.2) | Communication Angle (1.4) | Channel Coverage (which 2.x sections address it) | Status (Complete / Gap)

### 4.2 Scope Coverage Check
**Heading:** H2
**Format:** Table with columns: Work Agreement Line Item | Strategy Section(s) | Status (Covered / Gap)

### 4.3 Strategic Coherence Check
**Heading:** H2
**Format:** Paragraph summary. States the Bright Idea(s) and how they thread. Notes any intentional divergence by channel with rationale. Flags any unexplained divergence that was resolved during the pressure test conversation.

### 4.4 Feasibility Notes
**Heading:** H2
**Format:** Bulleted list. Timeline, resource, or dependency observations. Not a blocker — awareness items only.

---

## Sections Marked Not Applicable

When a channel strategy does not apply to the engagement:
- Keep the H2 heading
- Single line: "Not applicable to this engagement."
- Do not omit the section from the document
```

- [ ] **Step 2: Verify line count is reasonable**

Run: `wc -l "s3-creative-agent/references/strategy-brief-sections.md"`
Expected: ~200-250 lines (comparable to foundational-brief-sections.md)

- [ ] **Step 3: Commit**

```bash
git add s3-creative-agent/references/strategy-brief-sections.md
git commit -m "Add strategy brief section templates reference"
```

---

### Task 4: Create the Strategy Brief SKILL.md

**Files:**
- Create: `s3-creative-agent/skills/s3-strategy-brief/SKILL.md`

This is the main deliverable. It follows the same pattern as `s3-foundational-brief/SKILL.md`: frontmatter + orchestration logic. Reference files are loaded on-demand, not inline.

- [ ] **Step 1: Read the foundational brief SKILL.md for pattern reference**

Read `s3-creative-agent/skills/s3-foundational-brief/SKILL.md` to confirm the exact patterns used for:
- Frontmatter format (name, description with TRIGGERS and negative triggers)
- Phase transition wording
- Approval gate wording
- Research agent dispatch format
- Document output instructions
- Reference file loading instructions

- [ ] **Step 2: Write the SKILL.md**

The file must stay under 500 lines (target: 250-300, matching the foundational brief). Structure:

```markdown
---
name: s3-strategy-brief
description: |
  Produces a Strategy Brief that formalizes foundational facts and creative call outputs into strategic recommendations. Conversational flow: structured brand strategy section with guided approval, then freeform channel strategy conversation. Scope flags track ideas outside the Work Agreement. Pressure test validates coverage before .docx output.
  TRIGGERS: strategy brief, strategic brief, strategy document, strategic plan, strategy doc, brand strategy brief.
  Do NOT trigger on: "foundational brief," "creative brief," "brief" alone, "recommendation doc," "wireframe," "turnover" -- those use other skills.
  IMPORTANT: Do NOT self-activate from context. The user must explicitly say "strategy brief" or a listed trigger phrase. If the user says "brief" without "strategy," route through s3-brief-selector.
---

# Strategy Brief

Stage 2 in the S3 pipeline. Requires a completed Foundational Brief (Stage 1).

Output: .docx (always DRAFT in v1). Styled per `references/s3-docx-styles.md`.

Before writing ANY section, read `references/strategy-brief-sections.md` for the exact field order, heading levels, and formatting spec.

## Phase 1: Ingestion

### Step 0: Required Inputs

Two documents are required. The skill cannot proceed without both.

**Foundational Brief:**
1. Search Google Drive for the client's foundational brief
2. If not found, ask the user to upload it
3. Extract the "Created" date from section 1.1 (cover page). Format: "Month Day, Year"
4. Fallback: (1) "Last Updated" field in 1.1, (2) file modification date, (3) ask user: "When was the foundational brief created? I need this to filter for new material."
5. This date becomes the TIME_FILTER for all subsequent scans

**Work Agreement:**
1. Search Google Drive for the client's work agreement / partnership proposal
2. If not found, ask the user to upload it
3. Extract service line items (e.g., "SEO retainer," "website build," "paid ads," "photo/video shoot")
4. Present extracted items to user: "Here are the line items I found in the Work Agreement: [list]. Is this complete, or should I add anything?"
5. Confirmed line items become the SCOPE_ANCHOR for the entire session

### Step 1: Connector Scans

Scan all available connectors for material created or modified since TIME_FILTER. For threaded sources, surface threads with new messages since TIME_FILTER.

- **Slack** (if connected): Search threads mentioning client name
- **Google Drive** (if connected): Search files related to client, created or modified since TIME_FILTER
- **Google Docs** (if connected): Search documents mentioning client, modified since TIME_FILTER
- **Local workspace**: Check the Cowork session folder or current working directory for any documents

Note: Gmail is not currently a configured connector. If the user has relevant emails, they can paste or upload them.

### Step 2: User Input Prompt

After scans complete, prompt:
> "Anything else to add? Verbal notes, transcripts, attachments, data exports?"

Accept any uploads, text dumps, or verbal notes. Add to the ingestion pool.

### Step 3: Ingestion Catalog

Present a catalog of everything collected:
- Sources organized by origin (Slack, Drive, Docs, uploads, workspace)
- Key themes flagged across sources
- Work Agreement line items (confirmed)

Then ask:
> "Does this cover everything, or do you have more to add before I start building the summary?"

Loop if user adds more. Proceed to Phase 2 only after user confirms.

### Step 4: Create Working Document

After ingestion confirmation:
1. Create the .docx file with cover page (client name, DRAFT badge, created date, last updated date)
2. Save to Google Drive if connected, otherwise local output
3. This document will be built incrementally — sections appended as they are settled

### Step 5: Per-Client Context Files

If CLAUDE.md does not exist in the current project folder, create it with:
- Client name
- Work Agreement line items
- Documents ingested (list with sources)
- Date of this session

If MEMORY.md does not exist, create it as an empty index.

Update both files if they already exist.

---

## Phase 2: Auto-Summary

Synthesize all ingested material into a first pass at the full document skeleton. Present as one message.

For each section in the skeleton:
1. **Brand Strategy (1.0):** Pull forward facts from the foundational brief. Draft initial versions of each subsection as starting points.
2. **Channel Strategies (2.0):** For each channel with relevant material, draft a summary of themes, direction, and data. Mark channels with no material as "No input yet."
3. **Scope mapping:** List each SCOPE_ANCHOR line item alongside which channel sections address it. Call out gaps.
4. **The Bright Idea (1.7):** Surface any creative concept found in sources. If none, mark "To be developed."

After presenting the summary:
> "Here's what I've assembled from everything we collected. Let's refine this, starting with the Brand Strategy section."

---

## Phase 3: Conversation

### Brand Strategy (1.0) — Guided

Walk through each subsection in order:
1.1 Brand Positioning → 1.2 Mission → 1.3 Value Prop → 1.4 Audiences → 1.5 Voice & Tone → 1.6 Messaging → 1.7 Bright Idea

For each subsection:
1. Present what you have (from the auto-summary)
2. Ask: "Does this capture it, or should we adjust?"
3. If user approves: mark settled, move to next
4. If user edits: apply changes, confirm, re-ask
5. If user defers: mark deferred ("come back to this"), move to next

After all subsections are addressed or deferred, check for deferred items:
> "Before we move to channel strategies, you deferred [list]. Want to come back to those now, or handle them after the channel work?"

After Brand Strategy is settled, append it to the working .docx.

### Channel Strategies (2.0) — Freeform

Present channel summaries and ask:
> "Where do you want to start?"

The user drives from here. Agent behavior:
- Listen to user input and organize into the correct section per `references/strategy-brief-sections.md`
- Ask follow-up questions when input is vague or incomplete
- Flag scope expansion inline when ideas fall outside SCOPE_ANCHOR: "This is outside the current Work Agreement. I'm flagging it for the Scope Expansion section."
- Dispatch research agents on demand (see Research Agents below)
- Handle section-jumping without losing context
- Track which sections have been discussed vs untouched

When conversation winds down, prompt about untouched sections:
> "We haven't discussed [list] yet. Do those apply to this engagement, or should we mark them not applicable?"

Append each channel section to the working .docx as it's settled.

### Research Agents (On-Demand)

When the user asks a question requiring deeper research:

1. **Check the Foundational Brief first.** If the data already exists in sections 2.1, 2.3, 3.2, or 3.3, reference it directly. Do not re-research.
2. If new research is needed, load the relevant agent reference file:
   - Audience questions: read `references/audience-research-agent.md`
   - Competitor questions: read `references/competitor-research-agent.md`
   - SEO/digital questions: read `references/seo-digital-research-agent.md`
   - Social media questions: read `references/social-media-discovery-agent.md`
3. Execute every step in the agent protocol
4. Present Research Log inline (3-8 entries with live clickable links)
5. Validate per `references/research-validation-rules.md`
6. Apply confidence scoring per `references/confidence-scoring-spec.md`

**Key distinction:** Facts carry confidence scores. Strategy does not.
- "The local PI market is dominated by Morgan & Morgan" → needs source and score
- "We should position against Morgan & Morgan by emphasizing personal attention" → strategic decision, no score

### Deferred Brand Strategy Subsections

Before starting the pressure test, check for any remaining deferred Brand Strategy subsections:
> "You still have [list] deferred. Let's settle those before the pressure test."

---

## Phase 4: Pressure Test + Output

### Pressure Test

Run four checks sequentially. Resolve flags from each before moving to the next.

**Check 1: Audience Coverage**
For each audience in the Foundational Brief (section 3.2):
- Does it have a communication angle in 1.4?
- Does it appear in at least one channel strategy?
- If not: flag as gap

**Check 2: Scope Coverage**
For each SCOPE_ANCHOR line item:
- Does it map to a channel strategy section?
- If not: flag as gap

**Check 3: Strategic Coherence**
- State the Bright Idea(s) from 1.7
- For each channel strategy, confirm the Bright Idea threads through it
- Intentional divergence is fine — the user explicitly chose different approaches per channel
- Unexplained divergence: flag and ask for clarification

**Check 4: Feasibility Notes**
- Collect timeline, resource, or dependency observations from the conversation
- Not a blocker — awareness items only

For each check:
- Clean pass: confirm and move to next check
- Flags: surface one at a time. User resolves, skips, or acknowledges each flag.

### Scope Expansion Summary

After pressure test, populate section 3.2 (Scope Expansion Opportunities) with all inline scope flags collected during the conversation. Present as a checklist:
> "These items were flagged as outside the current Work Agreement. Confirm or remove each before we finalize."

### Generate Output

After pressure test passes and scope expansion items are confirmed:
1. Append sections 3.0 and 4.0 to the working .docx
2. Apply all styles per `references/s3-docx-styles.md`
3. Verify the document is complete (all sections present, marked "Not applicable" where appropriate)
4. Update CLAUDE.md with the strategy brief completion
5. Present the document to the user

---

## Gotchas

1. Do NOT hallucinate strategic recommendations. Organize and formalize what the user provides. If a section has no input, mark "No input yet" — do not fill with generic advice.
2. Do NOT confuse riffing with finalized direction. Track the latest position. When changed: "Earlier you mentioned X, but now you said Y. Which direction?"
3. User-stated strategy does not get confidence scores. Only researched facts.
4. The Bright Idea can be plural. Do not force a single unified concept when the user intentionally diverges by channel.
5. Scope flags are additive, not blocking. Flag and collect, do not reject.
6. Do NOT research what the Foundational Brief already covers. Check it first.
7. Work Agreement line items are fuzzy big buckets. Match by category, ask when ambiguous.
8. Section order in the document is fixed. Conversation order is not.
9. No em dashes. Use commas, colons, or periods.
10. No code, HTML, or debug output in brief content.
11. For Technical Direction (2.1.2), read `references/s3-tech-stack.md` before writing. Recommendations must align with S3's actual platform (Tresio, DatoCMS, Mux).
```

Target: ~280 lines. Verify it stays under 500.

- [ ] **Step 3: Verify line count**

Run: `wc -l "s3-creative-agent/skills/s3-strategy-brief/SKILL.md"`
Expected: 250-300 lines (under 500 limit)

- [ ] **Step 4: Verify frontmatter is valid**

Check that the frontmatter has `name` (lowercase+hyphens, max 64 chars) and `description` (max 1024 chars) per Agent Skills spec.

- [ ] **Step 5: Commit**

```bash
git add s3-creative-agent/skills/s3-strategy-brief/SKILL.md
git commit -m "Add s3-strategy-brief skill — Stage 2 strategy document"
```

---

### Task 5: Push and Update MEMORY.md

**Files:**
- Modify: `MEMORY.md` (repo root, per push workflow rule)

- [ ] **Step 1: Update MEMORY.md**

Add entry documenting what was built in this session.

- [ ] **Step 2: Push to both remotes**

```bash
git push origin main
```

The GitHub Action mirrors to the public repo automatically.

- [ ] **Step 3: Verify push succeeded**

```bash
git log --oneline -5
```

Expected: All commits from this session visible, push confirmed.

---

## Post-Implementation Notes

After this plan is complete, the following are queued for future sessions:
- **Brief Selector update** — add Strategy Brief as a routing option (separate workstream)
- **Document Collection Protocol** — extract shared reference from the inline Phase 1 definition
- **Foundational Brief feedback fixes** — 13 items from the TMP live test
- **Strategy Brief modes** — Update and Finalize modes after v1 is proven
- **Remaining pipeline skills** — Creative Briefs (Stage 3), Creative Turnover (Stage 4), Wireframe Skill
