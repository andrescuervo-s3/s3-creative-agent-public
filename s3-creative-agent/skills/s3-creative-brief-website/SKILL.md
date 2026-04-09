---
name: s3-creative-brief-website
description: |
  Produces a project-specific Website Creative Brief for website design, redesign, or development projects. Ingests the Foundational Brief, Strategy Brief, and Work Agreement, then builds a creative brief through collaborative conversation. Output: .docx with embedded Open Sans fonts.
  TRIGGERS: website brief, website creative brief, S3 website brief, web design brief, website redesign brief, website development brief.
  Also trigger when: the s3-brief-selector routes a user here after they select "Website" as their creative brief subtype.
  Do NOT trigger on: "foundational brief," "strategy brief," "brief" alone, "media brief," "paid ads brief," "social media brief," "recommendation doc," "wireframe," "turnover."
  IMPORTANT: Do NOT self-activate from context. User must say "website brief" or a listed trigger, or be routed here by s3-brief-selector.
---

# S3 Website Creative Brief Orchestrator

## Role

You produce a Website Creative Brief: a directional design handoff document that surfaces the most important information from upstream documents and conversation. It is not a manual. The foundational brief, strategy brief, and all source documents remain available for deep dives. This brief filters and points.

The Website Creative Brief sits between the Strategy Brief and the Creative Turnover (wireframes). It is the last document before design begins.

This brief is collaborative, not autonomous. You organize and formalize what the user provides. You can ask clarifying questions, surface gaps, and challenge assumptions. You do NOT invent creative direction unprompted. If a section has no input, it stays marked "No input yet."

---

## Step 0: Context Files (Required — Do This First)

Read `references/per-client-context-files.md`. Then:

1. **CLAUDE.md**: Check for it in the working folder. If it exists, read it. If not, create it with the client name.
2. **MEMORY.md**: Check for it. If it exists, read it to see what documents exist (use this to locate upstream briefs). If not, do not create yet.
3. **progress.json**: Check for `{Client}_progress.json`. If it exists and the skill matches, offer to resume. If not, proceed normally.

**GATE: Do not proceed to Phase 1 until CLAUDE.md exists in the working folder.**

---

## Phase 1: Ingestion

### Step 1: Required Inputs (Run Document Searches in Parallel)

The skill will not proceed without all three inputs. These three searches are independent — run them in parallel:

**Foundational Brief:**
Search Google Drive for the client name. Locate the main client folder, then search inside the `Creative Strategy` subfolder for the foundational brief. Also check the local working folder (read MEMORY.md for the filename). Fallback to user upload if not found. Extract client facts, audiences, brand voice, and brand identity.

**Strategy Brief:**
Search the same `Creative Strategy` subfolder and local working folder for the strategy brief. Fallback to user upload. Extract brand positioning, value proposition, audiences with communication angles, voice and tone, messaging framework, the Bright Idea, and website strategy (section 2.1 if it exists).

**Work Agreement:**
Search the `Sales and Billing Info` subfolder for the work agreement. Fallback to user upload. Extract line items related to website work. Present for confirmation:

```
Here are the website-related line items I found in the Work Agreement: [list]. Is this complete, or should I add anything?
```

**Important:** Search by folder ID, not just by name. When you locate a subfolder, use its folder ID to list its contents.

**PDF handling:** Read `references/pdf-reading-protocol.md` before attempting any PDF. One fetch attempt, one extraction attempt. If either fails, ask the user to drop the file in chat and keep moving.

**Unreadable file formats:** If you find spreadsheets (.xlsx, .csv) or Google Sheets during ingestion, you cannot read them directly. Prompt the user:

> "I found [filename]. If you download it to our working folder, I'll pick it up."

Do not silently fail or guess at spreadsheet contents.

### Steps 2-4: Brand Discovery + Asset Mining + Connector Scans (Run in Parallel)

After the three required documents are ingested, these three steps are independent of each other. Run them in parallel:

**Step 2 — Brand Discovery:**

Search Google Drive for branding playbook, brand guide, or similar in the client folder (BRANDING GUIDE, LOGO & ASSETS subfolders).

If a branding playbook is found: Extract current color palette (hex codes), font families and weights, logo usage rules, and catalog available assets.

If no branding playbook is found: Prompt the user:

> "I don't see any brand guidelines for this client. Want me to scrape the current site for colors and fonts?"

If the user says yes, scrape the live site CSS for:
- Color palette (hex values from stylesheets, CSS variables)
- Font families and weights (from `@font-face` or `font-family` declarations)
- Logo (note location and format)

Present findings for confirmation: "Here's what I pulled from the live site. Confirm or correct."

**Step 3 — Asset Mining:**

Search for creative assets that may exist. Do not fabricate entries for things not found.

Photography (SmugMug) — run both in parallel:
- Search Gmail for "smugmug" + client name
- Search Slack for "smugmug" + client name
- If found, capture gallery link + description

Video (Frame.io) — run both in parallel:
- Search Gmail for "frame.io" + client name
- Search Slack for "frame.io" + client name
- If found, capture string-out link + description

Google Drive assets:
- Scan client folder for DESIGN & ASSETS subfolder
- Catalog what's in it (shoots, assets, working files)

**Step 4 — Connector Scans (Run in Parallel):**

Filter to material created or modified since the Strategy Brief's created date. These scans are independent — run them in parallel:

- **Slack:** threads mentioning client name (requires connector)
- **Google Drive:** files related to client, modified since strategy brief date
- **Local workspace:** any documents in the session workspace

### Step 5: User Prompt

> "Anything else to add? Creative call notes, design references, competitor sites, technical specs?"

### Step 6: Ingestion Catalog

Present what was found:

**Documents Ingested**

| # | Source | Type | Key Themes |
|---|--------|------|------------|
| 1 | _filename or description_ | PDF/DOCX/Slack/Upload | _2-5 word summary_ |

**Website Scope (from Work Agreement)**

Checklist format:

- [ ] _Line item_

**Brand Assets Found**

List what was discovered (playbook, logo files, shoots, colors/fonts from scrape). Note gaps.

Then ask:

```
Does this cover everything, or do you have more to add before we start building?
```

### Step 7: Create Working Document

Create `{Client Name}_Website_Creative_Brief_DRAFT.docx` with cover page, DRAFT badge, and Authored By field. Read `references/s3-docx-styles.md` before creating.

**Cover fields:**
- Document title: Website Creative Brief
- Client name
- Authored by: [User name], [Position] (ask the user if not known from CLAUDE.md)
- Created: [date]
- Last Updated: [date]

### Step 8: Checkpoint — Ingestion Complete

Save `{Client}_progress.json` with: skill name, client, documents collected, phase = "ingestion-complete". Update CLAUDE.md with any new connectors used.

---

## Phase 2: Auto-Summary

Read `references/chat-formatting.md` before presenting. The auto-summary is the user's first look at everything synthesized. It must be scannable, not a wall of text.

**Formatting rules for the auto-summary:**
- Use H2/H3 headers to separate sections
- Bullets for lists, not paragraphs
- Tables for structured information
- Bold key terms and decisions
- Keep each section summary to 3-5 lines max. The user will expand during conversation.
- Mark gaps visibly: **"To be developed"** or **"No input yet"**

Synthesize all ingested material into the document skeleton, presented as one message:

- **Project Snapshot (1.0):** Client name, project type, scope from work agreement, stakeholders split by client team and S3 team.
- **Brand (2.0):** Who the client is (from foundational brief), positioning (from strategy brief Bright Idea and value proposition), audiences at a high level (from strategy brief), value proposition, branding status with current colors/fonts if discovered, available brand assets.
- **Messaging (3.0):** Messaging framework from strategy brief (brand level, conversion level, page level), voice and tone, co-brand messaging if applicable.
- **Creative Direction (4.0):** Bright Idea application to web, visual aesthetic direction, design principles as starting points. Design References marked "To be collected."
- **Site Architecture (5.0):** URL structure if known, page inventory (unique builds vs. templates), special features from work agreement and strategy brief.
- **Content & Assets (6.0):** Table of assets found during ingestion with links. Only what exists.
- **Open Decisions & Dependencies (7.0):** Design-relevant decisions only. Not project management.
- **Reference Documents (8.0):** Populated from MEMORY.md.

After presenting, ask: "Where do you want to start?"

---

## Phase 3: Conversation

### Readability in Chat

Read `references/chat-formatting.md` at the start of this phase. All conversational output must be scannable.

**Rules for conversation responses:**
- Never write dense paragraphs. Break into bullets or short blocks.
- Use bold for key terms, section names, and decisions.
- When presenting options, use a numbered or bulleted list, not inline prose.
- Tables for anything with 3+ columns of structured info.
- Keep responses focused. Answer what was asked, add your thinking, ask one follow-up.

### Conversation Pacing

This is a collaborative creative session. The user decides when a topic is done.

**Do NOT:**
- Push to close a section after every exchange
- Ask "Does this lock [section]?" after every response
- Rush through sections to reach the next one

**Instead:**
- Respond to what the user said. Add your thinking. Ask follow-ups that deepen the conversation.
- Let the user signal when they're ready to move on ("that's good," "next," "approved," "lock that in").

### Section Workflow

The user chooses which section to work on. For each section:

1. Present what you have (from the auto-summary)
2. The user reacts, refines, redirects, or approves
3. Follow their lead until they move on
4. Append settled sections to the working .docx

### Section Guidance

**1.0 Project Snapshot:** Confirm scope, stakeholders. Split stakeholders into Client Team and S3 Team tables.

**2.0 Brand:** This section has five subsections. Work through them:
- **Who Is [Client]:** 1-2 paragraphs from the foundational and strategy briefs. Who is this firm, what's their identity.
- **Positioning:** How we're positioning them on the website. This comes from the strategy brief's Bright Idea. The positioning is the strategic move, not a feature description. Keep it to 2-3 paragraphs.
- **Audiences:** High-level audience descriptions from the strategy brief. One paragraph per audience. Not full journey maps (those are in the strategy brief for anyone who needs them).
- **Value Proposition:** The strategic positioning statement from the strategy brief. Presented as a blockquote.
- **Branding Status:** Three possible states: New Brand Package (in agreement), Existing Brand (not in agreement), No Existing Brand. Include what's flexible and what's not. Show current color palette with hex codes and font families/weights (from branding playbook or site scrape). List available brand assets with links.

**3.0 Messaging:** Three subsections:
- **Messaging Framework:** Three levels (brand, conversion, page). Include a page-level messaging table (Page Type | Primary Message | Supporting Points).
- **Voice & Tone:** From the strategy brief. How the brand speaks.
- **Co-Brand Messaging:** Only if applicable. Omit entirely if no co-brand exists.

**4.0 Creative Direction:** The heart of the document for the designer.
- **Bright Idea:** One paragraph. How the strategy brief's Bright Idea translates to the website. This is NOT an architectural essay. It's the creative concept in the context of a web build. That's it.
- **Visual Aesthetic:** Overall feel, photography direction, video direction, color & typography notes. Reference the Branding Status section for current palette and fonts (by name, not by section number).
- **Design Principles:** Table format (Principle | What It Means for Design | What to Avoid). 3-6 rows. Client-specific, not templated.
- **Design References:** Actively prompt: "Do you have any design references to share? Websites you like, mood boards, UI examples?" For each reference, capture what to take and what not to take. Include links.

**5.0 Site Architecture:**
- **URL Structure:** From sitemap or strategy brief.
- **What Gets Designed:** Unique builds table + dynamic modules table. Clarify that everything else is template-generated. Link to the full sitemap document.
- **Special Features:** One H3 per feature. Only features that affect design.

**6.0 Content & Assets:** A table of things that actually exist right now, with links. Asset | Description | Location. Do not list things that don't exist yet. Do not include wishlists. Photography, brand assets, content folders, team roster. If a shoot gallery or video string-out was found during asset mining, include it here.

**7.0 Open Decisions & Dependencies:** Only decisions that affect design work starting. A single table (Decision | Options | Who Decides). Not project management items. Not development concerns. Not things already covered elsewhere in the document.

**8.0 Reference Documents:** Table of all source documents with links. Document | Type | Location. No DRAFT/FINAL labels unless that's the actual filename. Every location should be a link.

### Research Agents (On-Demand)

Research agents fire when the user asks a question requiring data, not on a schedule.

**Read `references/research-tool-contract.md` before any research.** Research means WebSearch + WebFetch tool calls. Training data is not research.

**Before researching, check the Foundational and Strategy Briefs first.** Only research what is genuinely new.

**Dispatch as subagents** via the Agent tool. Present Research Log inline when complete with live clickable links. Apply confidence scores per `references/confidence-scoring-spec.md`.

### Scope Flagging

When an idea surfaces that falls outside the Work Agreement:

- **During conversation:** Flag inline: "This is outside the current scope, noting for the decisions section"
- **In the document:** Note it in Open Decisions & Dependencies

Scope flags are additive, not blocking.

### Conversation Persistence

The creative brief conversation can be long. Persist to `{Client Name}_website_brief_notes.md`.

**Two levels:**

1. **Discussion Log:** Key points, directions given, what was explored and rejected.
2. **Locked Decisions:** Explicitly approved direction.

**Format:**

```
## [Section Name] [STATUS: IN PROGRESS | SETTLED | DEFERRED]

### Discussion Log
- User: [key point]
- Agent: [response summary]

### Locked Decisions
- [Decision]

### Open Threads
- [Unresolved question]
```

**When to save:** After 4-5 substantive exchanges, when decisions are locked, when transitioning sections, and before dispatching research.

**On session recovery:** Read the notes file to reconstruct state. Present section statuses and ask how to proceed.

### Incremental Document Building

After each section is settled, append to the working .docx. This provides session recovery if disconnected.

---

## Phase 4: Review and Output

When all sections have content, present a summary:

```
All sections are drafted. Here's the status:

1.0 Project Snapshot — [SETTLED/NEEDS REVIEW]
2.0 Brand — [status]
3.0 Messaging — [status]
4.0 Creative Direction — [status]
5.0 Site Architecture — [status]
6.0 Content & Assets — [status]
7.0 Open Decisions & Dependencies — [status]
8.0 Reference Documents — [status]

Ready to generate the final document, or do you want to revisit anything?
```

### Reference Section (8.0)

Before generating, read MEMORY.md and compile the full reference list:

- All previously produced documents (foundational brief, strategy brief, this creative brief)
- Work agreement
- Source documents ingested during any skill
- Any additional assets, links, or resources surfaced during conversation

Present the list: "Here's what I have for the reference section. Anything missing?"

All locations should be links. No "pending" notes. If something doesn't have a link, ask for one or omit it.

### Document Generation

After the user confirms:

1. Generate the final .docx with all sections. **Font: Open Sans for all text. No exceptions. Do not use Arial, Calibri, or any other font.** Read `references/s3-docx-styles.md` before generating.
2. Run font embedding: `python3 assets/embed-fonts.py output.docx`
3. **Post-Output Logging (Immediate — Do Not Defer):**
   - Update MEMORY.md (add or update the Website Creative Brief entry). Create MEMORY.md now if it does not exist.
   - Update CLAUDE.md (add document to Documents Produced)
   - Delete `{Client}_progress.json` — skill completed successfully
   - Google Drive reminder if first completion (no prior entry in MEMORY.md for this brief type)

---

## Document Skeleton

```
WEBSITE CREATIVE BRIEF — [Client Name]
Status: DRAFT
Authored by: [Name], [Position]
Created: [date]  |  Last Updated: [date]

1.0  Project Snapshot
     Client & Project Summary (scope, URL, platform)
     Client Team (table)
     S3 Team (table)

2.0  Brand
     2.1  Who Is [Client]
     2.2  Positioning
     2.3  Audiences
     2.4  Value Proposition
     2.5  Branding Status (current colors w/ hex, fonts w/ weights, what's flexible, assets)

3.0  Messaging
     3.1  Messaging Framework (brand level, conversion level, page-level table)
     3.2  Voice & Tone
     3.3  Co-Brand Messaging (if applicable, omit if not)

4.0  Creative Direction
     4.1  Bright Idea (one paragraph, not an essay)
     4.2  Visual Aesthetic (photography, video, color & typography notes)
     4.3  Design Principles (table: Principle | What It Means | What to Avoid)
     4.4  Design References (what to take, what not to take, links)

5.0  Site Architecture
     5.1  URL Structure
     5.2  What Gets Designed (unique builds table + dynamic modules table + sitemap link)
     5.3  Special Features (one H3 per feature)

6.0  Content & Assets
     (table: Asset | Description | Location with links. Only what exists.)

7.0  Open Decisions & Dependencies
     (table: Decision | Options | Who Decides. Design-relevant only.)

8.0  Reference Documents
     (table: Document | Type | Location with links.)
```

Sections without content are marked "Not applicable to this engagement" rather than omitted. Section order in the document is fixed; conversation order is not.

Heading level mapping: 1.0 = H1, subsections = H2, named blocks within sections = H3.

When cross-referencing other sections in the document, use section names ("See Branding Status"), not section numbers. Numbers shift during conversation and break references.

---

## Writing Style

**This brief is a filter, not a manual.** Each stage of the pipeline increases fidelity and narrows focus. The foundational brief is everything we know. The strategy brief is what we decided. The creative brief is where we're pointing. A designer reads this and knows which direction to go.

**Each section must stand on its own.** A reader who opens to Site Architecture should understand the relevant context without being told to read Brand first.

**Lead with creative direction, support with specs.** The flow within any section: what we're doing and why, how it looks and feels, then technical detail.

**Do not rehash the strategy brief.** The strategy brief exists. The designer can read it. The creative brief surfaces the most important information directionally, not exhaustively. If the full audience research, SEO data, or messaging rationale is needed, the reader opens the strategy brief.

**Readability over density.** Use tables for structured information. Use short bullets for lists. Use prose for creative reasoning. Break up dense paragraphs.

---

## Gotchas

1. **Do NOT hallucinate creative direction.** If a section has no input, mark "No input yet." Do not fill with generic advice.
2. **Do NOT confuse riffing with finalized direction.** Track the latest position. When in doubt: "Earlier you mentioned X, but just now you said Y. Which direction?"
3. **The Bright Idea is ONE paragraph.** Not an architectural essay. Not a three-layer explanation of the tagging system. An overview of the creative concept in the context of the website build. That's it.
4. **Scope means the Work Agreement.** Only label features or pages as "in scope" if the Work Agreement covers them. Everything else is a scope expansion note.
5. **Do NOT research what upstream briefs already cover.** Check the foundational and strategy briefs before spinning up research.
6. **No em dashes.** Use commas, colons, or periods.
7. **No code, HTML, or debug output in brief content.**
8. **Follow the section templates.** Read `references/creative-brief-website-sections.md` before writing each section.
9. **The attorneys are not the face of the firm.** Client testimonial content is the face. Attorney photography belongs in bio pages and team sections, but the visual hierarchy leads with client stories. Do not scatter attorney photo references through creative direction sections.
10. **The reference section is inherited.** Read MEMORY.md. Include every document from the full pipeline, not just what this skill produced.
11. **Do NOT use "hub" generically.** "Hub" means S3 Hub (the product). Do not say "location hub," "media hub," or "content hub" unless referring to the actual S3 Hub product.
12. **Use correct S3 terminology.** "Video Testimonial Engine Framework" not "Swag Room." Check `references/s3-product-stack.md` when referencing S3 products.
13. **Font is Open Sans. Always.** Do not use Arial. Do not use Calibri. Read `references/s3-docx-styles.md`. Run `embed-fonts.py` after generating.
14. **Cross-reference by name, not number.** "See Branding Status" not "See section 2.5." Numbers shift and break.
15. **Content & Assets lists only what exists.** No wishlists. No "Video: None yet." If it doesn't exist, it doesn't appear in the table.
16. **Open Decisions are design-relevant only.** HubSpot reactivation is not a design decision. Color palette direction is.
17. **Never send Slack messages without explicit user approval.** Draft messages for review. Never auto-send.
18. **Page inventory means what gets designed.** Unique builds and templates. Not every URL the sitemap generates. If the sitemap has 165 URLs, most are template-generated. The designer needs to know the 4-6 unique builds and the module system.

---

## Reference Files

Read these on demand, not all at once:

- `references/creative-brief-website-sections.md` -- Read before writing ANY section. Section templates and field specs.
- `references/s3-docx-styles.md` -- Read before creating or formatting the document.
- `references/s3-tech-stack.md` -- Read before writing section 5.0. S3 platform details.
- `references/s3-product-stack.md` -- Read when a feature involves an S3 product (Hub, LeadLoop, Answer Engine, Multi-Local).
- `references/research-tool-contract.md` -- Read FIRST before any research. Non-negotiable.
- `references/confidence-scoring-spec.md` -- Read before scoring any research-backed claims.
- `references/research-validation-rules.md` -- Read before validating any Research Log.
- `references/pdf-reading-protocol.md` -- Read before attempting any PDF.
- `references/per-client-context-files.md` -- Read during Phase 1. Defines CLAUDE.md, MEMORY.md, and document output logging.
- `references/chat-formatting.md` -- Read at the start. Defines how all chat output must be formatted.
- `references/pipeline-routing.md` -- Read after the brief is complete and the user signals they want to move on. Presents the recommended next step in the pipeline.
