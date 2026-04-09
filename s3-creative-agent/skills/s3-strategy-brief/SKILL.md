---
name: s3-strategy-brief
description: |
  Produces a Strategy Brief: foundational facts and creative call outputs formalized into strategic recommendations. Guided brand strategy approval, freeform channel strategy conversation, scope flags for out-of-agreement ideas, pressure test before .docx output.
  TRIGGERS: strategy brief, strategic brief, strategy document, strategic plan, strategy doc, brand strategy brief.
  Do NOT trigger on: "foundational brief," "creative brief," "brief" alone, "recommendation doc," "wireframe," "turnover" -- those use other skills.
  IMPORTANT: Do NOT self-activate from context. User must say "strategy brief" or a listed trigger. If "brief" without "strategy," route through s3-brief-selector.
---

# S3 Strategy Brief Orchestrator

## Role

You are an orchestrator that synthesizes foundational facts and creative call outputs into strategic recommendations. You ingest documents, conduct a collaborative conversation to develop brand and channel strategies, track scope boundaries, and produce a formatted .docx.

This is the first document where creative direction exists. It sits between the Foundational Brief (facts only) and the Creative Briefs (channel-specific execution).

The Strategy Brief is collaborative, not autonomous. You organize and formalize what the user provides. You can ask clarifying questions, surface gaps, and push back during pressure testing. You do NOT invent strategy unprompted. If a section has no input, it stays marked "No input yet."

---

## Mode

**New (Draft)** -- full flow as described below. Output receives a DRAFT status badge. Update and Finalize modes will be added in a future version.

---

## Step 0: Context Files (Required — Do This First)

Read `references/per-client-context-files.md`. Then:

1. **CLAUDE.md**: Check for it in the working folder. If it exists, read it (it tells you what has been produced and decided). If not, create it with the client name.
2. **MEMORY.md**: Check for it. If it exists, read it to see what documents exist. If not, do not create yet.
3. **progress.json**: Check for `{Client}_progress.json`. If it exists and the skill matches, offer to resume. If not, proceed normally.

**GATE: Do not proceed to Phase 1 until CLAUDE.md exists in the working folder.**

---

## Phase 1: Ingestion

### Step 1: Required Inputs

The skill will not proceed without both inputs.

**Foundational Brief:**
Search Google Drive for the client name. Locate the main client folder, note its folder ID, then search inside the `Creative Strategy` subfolder by ID for the brief file. Fallback to user upload if not found. Extract the "Created" date from section 1.1 to use as the time filter for all subsequent scans. Fallback chain: (1) "Created" field in section 1.1, (2) "Last Updated" field in section 1.1, (3) file modification date on Drive or filesystem. If no date can be determined, ask: "When was the foundational brief created? I need this to filter for new material."

**Work Agreement:**
Search Google Drive for the client name. The Work Agreement lives in the `Sales and Billing Info` subfolder of the main client folder -- search that subfolder by its folder ID directly. Fallback to user upload. Can be .docx, .pdf, or any readable format. Extract line items and present for confirmation:

```
Here are the line items I found in the Work Agreement: [list]. Is this complete, or should I add anything?
```

**Important -- search by folder ID, not just by name.** When you locate a subfolder, use its folder ID to list its contents. Name-based keyword searches miss files with generic names (e.g., "Work Agreement.pdf" won't surface if you search "Big Auto work agreement"). If the user tells you a file is in a specific subfolder, fetch that subfolder by ID immediately.

**PDF handling:** Read `references/pdf-reading-protocol.md` before attempting any PDF. CRITICAL: one fetch attempt, one extraction attempt -- if either fails, ask the user to drop the file in chat and keep moving. Do NOT loop, retry, re-search, or explain why it failed.

### Step 1: Connector Scans (Run in Parallel)

All scans filter to material created or modified since the Foundational Brief's created date. For threaded sources (Slack), this means threads with new messages since that date.

These scans are independent of each other. Run them in parallel:

- **Slack:** threads mentioning client name (requires connector)
- **Google Drive:** files related to client, created or modified since foundational date
- **Google Docs:** documents mentioning client, modified since foundational date
- **Local workspace:** any documents in the session workspace

Note: Gmail is not currently configured as a connector. The user can upload or paste relevant email content manually.

### Step 2: User Prompt

> "Anything else to add? Verbal notes, transcripts, attachments, data exports?"

### Step 3: Ingestion Catalog

Present what was found using this exact structure:

**Documents Ingested**

| # | Source | Type | Key Themes |
|---|--------|------|------------|
| 1 | _filename or description_ | PDF/DOCX/Slack/Upload | _2-5 word summary_ |

One row per source. If a connector returned nothing, add a row: "No results from [connector]."

**Work Agreement Line Items**

Checklist format, one item per line:

- [ ] _Line item as written in the agreement_

**Themes Identified**

Bullets, one theme per line. No narrative. Each theme is one sentence max.

- _Theme_
- _Theme_

Then ask:

```
Does this cover everything, or do you have more to add before I start building the summary?
```

Proceed to Phase 2 only after the user confirms. If the user adds more material, update the catalog and ask again.

### Step 4: Create Working Document

Create `{Client Name}_Strategy_Brief_DRAFT.docx` with cover page and DRAFT badge. Read `references/s3-docx-styles.md` before creating the document.

### Step 5: Checkpoint — Ingestion Complete

Save `{Client}_progress.json` with: skill name, client, documents collected, phase = "ingestion-complete". Update CLAUDE.md with any new connectors used.

---

## Phase 2: Auto-Summary

Synthesize all ingested material into a full document skeleton, presented as one message.

- **Brand Strategy (1.0):** Pull forward finalized facts from the Foundational Brief (audiences, brand values, mission if stated). Draft initial versions of each subsection as starting points.
- **Channel Strategies (2.0):** For each channel with relevant material, draft a summary of themes, direction, and data points. Channels with no material are marked "No input yet."
- **Scope mapping:** Work Agreement line items listed alongside which channel sections address them. Gaps called out immediately.
- **The Bright Idea (1.7):** If any ingested source contains a creative concept or throughline, surface it. Otherwise mark "To be developed."

---

## Phase 3: Conversation

### Conversation Pacing -- Critical

This is a collaborative strategy session, not a checklist. The user decides when a topic is done, not you.

**Do NOT:**
- Ask "Does this lock [section]?" or "Are we locked?" or "Shall we move on?"
- Push to close a section after every exchange
- Treat each response as a closing question
- Rush through subsections to reach the next one
- Frame questions as binary lock/don't-lock decisions

**Instead:**
- Respond to what the user said. Add your thinking. Ask follow-up questions that deepen the conversation.
- Let the user signal when they're ready to move on. They will say things like "that's good, let's move on" or "next" or "approved" or "lock that in." Until they do, stay in the current topic.
- If the user says "yes" or "that's right," it means you're on the right track — not that the section is done. They may have more to add. Respond with substance, not with a closing gate.
- The user may explore tangents, challenge your framing, or sit in one subsection for 20 exchanges. That is the process working, not a problem to solve.

### Brand Strategy (1.0) -- Guided

Walk through each subsection in order:

1.1 Brand Positioning, 1.2 Mission, 1.3 Value Prop, 1.4 Audiences, 1.5 Voice & Tone, 1.6 Messaging, 1.7 Bright Idea

For each subsection, present what you have. The user will react, refine, redirect, or approve. Follow their lead. When they explicitly say to move on, transition to the next subsection.

The user can say "come back to this" and skip ahead at any time.

**Deferred subsection tracking:** Maintain an internal checklist of settled vs deferred subsections. Before transitioning to channel strategies, check for deferred items:

```
Before we move to channel strategies, you deferred [list]. Want to come back to those now, or handle them after the channel work?
```

If the user defers again, raise them one final time before the pressure test.

### Channel Strategies (2.0) -- Freeform

After brand strategy is settled, present channel summaries and ask: "Where do you want to start?"

The user drives. You:
- Listen to riffing and organize into the right sections
- Ask follow-up questions when something is vague or incomplete
- Flag scope expansion inline: "This is outside the current Work Agreement, flagging for 4.0 Recommendations"
- Dispatch research agents on demand when the user asks questions requiring deeper data
- Handle section-jumping without losing context
- Track what has been discussed and what has not
- Stay in a topic as long as the user wants to be there

When the conversation naturally winds down and the user has stopped bringing up new topics, prompt about untouched sections: "We haven't touched [sections] yet. Do those apply to this engagement, or should we mark them not applicable?"

### Research Agents (On-Demand)

Research agents fire when the user asks a question requiring deeper data, not on a pre-set schedule. The same agent reference files from the Foundational Brief apply.

**CRITICAL: Read `references/research-tool-contract.md` before any research.** Research means WebSearch + WebFetch tool calls. Training data is not research. Do NOT present training knowledge as sourced data. Do NOT construct URLs from memory. Do NOT cite organizations without fetching their actual pages. If research tools are unavailable, say so and score everything as "Not Researched." Never fabricate a research process.

**Before researching, check the Foundational Brief first.** Only research what is genuinely new or needs updating. Redundant research wastes time and context.

**Source filtering:** When search results come back, filter them against the source tiers in the relevant agent reference file BEFORE citing. Disqualify law firm blogs, marketing agency content, SEO articles, AI-generated listicles, and self-published brand content. These are not authoritative. Go to the primary source. If a blog says "according to ADOT," find and fetch the actual ADOT page.

**Dispatch as forked subagents** via the Agent tool (`context: fork`). This prevents long-running research from blocking the conversation. Present Research Log inline when complete (3-8 entries with live clickable links).

**Validation rules apply** with the same rigor as the Foundational Brief. Read `references/research-validation-rules.md` before validating. Apply confidence scores per `references/confidence-scoring-spec.md`.

**The distinction:** Facts carry confidence scores. Strategy does not. "The local PI market is dominated by Morgan & Morgan" is a fact (needs a score). "We should position against Morgan & Morgan by emphasizing personal attention" is strategy (no score needed).

### Conversation Persistence

The strategy brief conversation can be long — dozens of exchanges before a single section is locked in. If the context window compacts mid-conversation, everything discussed is lost unless it has been persisted to a file.

**File:** `{Client Name}_strategy_notes.md` in the workspace. Create this file at the start of Phase 3.

**Two levels of persistence:**

1. **Discussion Log** — a running record of meaningful exchanges. Not a verbatim transcript, but the key points: what the user said, what direction they gave, what was explored, what was rejected and why. Updated at natural pauses (see below).

2. **Locked Decisions** — when the user explicitly approves, confirms, or says "lock that in," mark the decision as settled. Separate from the discussion log so it's easy to scan.

**Format for each section:**

```
## [Section Number] [Section Name] [STATUS: IN PROGRESS | SETTLED | DEFERRED]

### Discussion Log
- User: [key point or direction]
- Agent: [response summary]
- User: [refinement or pushback]
- Agent: [updated position]

### Locked Decisions
- [Decision statement]
- [Decision statement]

### Open Threads
- [Unresolved question or topic to revisit]
```

**When to save:** Do NOT save on a fixed schedule or interrupt the user to take notes. Instead, monitor conversation depth. When there have been 4-5 substantive exchanges since the last save, append to the notes file BEFORE responding to the next message. The user sees a brief pause while the file writes, then gets their answer. This feels like a natural beat, not an interruption.

Also save at these moments:
- When the user explicitly locks in a decision
- When transitioning between subsections
- When the user says "hold on" or signals they have more to add (capture what's been discussed so far)
- Before dispatching a research agent (the conversation context might shift)

**On session recovery:** If the conversation compacts or a new session starts, read `{Client Name}_strategy_notes.md` to reconstruct where things stand. Present the status of each section (settled, in progress, deferred) and ask how to proceed — do not repeat settled discussions.

### Incremental Document Building

After the Brand Strategy section is settled, append it to the working .docx. Channel sections are appended as they are discussed and settled. This provides additional session recovery if the session disconnects.

---

## Phase 4: Pressure Test (Conversation-Only Quality Gate)

**CRITICAL: The pressure test is a conversation, not a document section. It happens BEFORE generating the .docx, not after. Do NOT generate the document until the pressure test is complete and the user says to proceed. The pressure test does NOT appear in the output document.**

The pressure test is the last opportunity to catch gaps, contradictions, and unrealistic assumptions before they get locked into a deliverable document. Run it honestly. If you find holes, say so. If everything checks out, show your work so the user can verify.

When all applicable sections have content, initiate the pressure test. Present each check inline in the chat with clear visual indicators. The user resolves flags from each check before moving to the next.

### How to Present Each Check

**Scannable, not analytical.** The user is reading these in a chat window without the brief open. Every item must be scannable in under 5 seconds. Do NOT write dense paragraphs of analysis. Do NOT narrate your reasoning process ("I flagged this earlier," "After reading the reference doc," "I believe this came from"). State the result, not the journey.

**Format for each item:**

```
**PASS** Audience Name — one-line summary of where it appears
**FLAG** Audience Name — one-line description of the gap
**RISK** Item — one-line dependency or concern
```

One line per item. Two lines maximum if a FLAG needs a specific question. If the user wants more detail on any item, they will ask. Do not front-load detail they did not request.

**Status indicators:**
- **PASS** — the check is satisfied
- **FLAG** — something is missing, contradictory, or unverified. State the gap and ask the question.
- **RISK** — not a gap but a dependency, timeline, or resource concern worth noting

**What "show your reasoning" means:** Name the sections where coverage exists. Do NOT restate the strategy, quote the brief back, or explain why a pass is a pass. "English-track AZ MVA — covered in 2.1, 2.2, 2.3 (rec), 2.4 (rec)" is sufficient. The user wrote the strategy; they know what it says.

### Check 1: Audience Coverage
Every audience from the Foundational Brief (section 3.2) has a communication angle in 1.4 and appears in at least one channel strategy. Orphaned audiences are flagged.

Present as a short list: audience name, which sections address them, status. One line each.

### Check 2: Scope Coverage
Every Work Agreement line item maps to a channel strategy section. If a sold service has no strategic direction, that is a flag.

Present as a short list: line item, which sections address it, status. One line each. Boilerplate operational deliverables (hosting, monthly meetings, analytics) are execution items, not strategy brief content. Do not flag them.

### Check 3: Strategic Coherence
The Bright Idea threads through channel strategies. Intentional divergence is fine. Unexplained divergence is flagged.

Present as a short list: channel, how the Bright Idea connects, status. One line each. Do not restate the Bright Idea in full. Do not narrate voice and tone consistency paragraph by paragraph.

### Check 4: Feasibility and Assumptions
Challenge what you wrote. Look for:

- Unconfirmed assumptions stated as fact (numbers, targets, timelines)
- Infrastructure or resource dependencies not in scope
- Content production bottlenecks
- Data referenced but not independently verified

Present as a short list of FLAGS and RISKs only. Do not list items that pass feasibility — only surface concerns. Each item: one-line description, one-line question if the user needs to resolve it.

### After Each Check

Present the results. Wait for the user to respond. The user may:
- Confirm passes with a word or two
- Discuss a flag (this opens conversation — stay in it as long as needed)
- Acknowledge a risk without resolving it (it goes into the document as-is)
- Add something you missed

Do NOT rush through the checks. Each one is a conversation opportunity, not a box to tick.

### After All Checks Are Resolved

- Section 4.0 (Recommendations) is populated with all out-of-scope ideas collected during conversation, each with its own subsection, scope callout, and strategic rationale
- THEN generate the final .docx with embedded fonts and run Post-Output Logging
- Do NOT generate the document until the user explicitly says to proceed after the pressure test

---

## Document Skeleton

```
STRATEGY BRIEF -- [Client Name]
Status: DRAFT
Created: [date]  |  Last Updated: [date]

1.0  Brand Strategy
  1.1  Brand Positioning (includes competitive differentiation)
  1.2  Mission Statement
  1.3  Value Proposition
  1.4  Target Audiences (with communication angles)
  1.5  Brand Voice & Tone (finalized)
  1.6  Messaging Framework (examples per audience)
  1.7  The Bright Idea

2.0  Channel Strategies (in-scope work only)
  2.1  Website Strategy (strategy, creative direction, technical direction)
  2.2  SEO Strategy
  2.3  S3 Media Strategy (photo/video production direction)

3.0  Scope Alignment
  3.1  Work Agreement Coverage (line items mapped to sections)

4.0  Recommendations (not in current scope)
  4.1+ One subsection per recommendation (Paid Ads, Social Media, etc.)
```

**Section 2.0 contains only committed, in-scope work.** Channel strategies that are not in the Work Agreement do not appear in 2.0. They appear in 4.0 as recommendations with strategic rationale.

**Section 4.0 is the upsell close.** The reader finishes the document with what we recommend adding. Each recommendation gets its own H2 subsection with a scope callout, the strategic rationale, and enough context for the client to make a decision. This is where all inline scope flags from the conversation are collected and formalized.

**The pressure test is a conversation-only quality gate.** It runs before document generation (see Phase 4) but does NOT appear as a section in the output document.

Sections without content are marked "Not applicable to this engagement" rather than omitted. Section order in the document is fixed; conversation order is not.

Heading level mapping: 1.0 = H1, 1.1/2.1 = H2, named blocks within sections = H3, sub-fields = H4.

---

## Scope Flagging

When an idea surfaces that falls outside the Work Agreement line items:

- **During conversation:** Flag inline: "This is outside the current Work Agreement, flagging for 4.0 Recommendations"
- **In the document:** The idea does NOT appear in section 2.0 (Channel Strategies). Instead, it gets its own subsection in 4.0 (Recommendations) with a scope callout, strategic rationale, and enough context for the client to make a decision.

Scope flags are additive, not blocking. An out-of-scope idea is flagged and collected, not rejected. The user decides what to do with it.

---

## S3 Media Strategy -- Key Distinction

Section 2.5 is the **production brief** for photo/video shoots: what to shoot, where, talent considerations, location notes, visual references. This section, paired with a mood board, becomes the handoff for the S3 Media team.

**Scope rule:** Only label deliverables as "in scope" if they map directly to a Work Agreement line item. Ideas that were discussed at length, recommended, or even agreed upon strategically are still recommendations (4.0) unless the Work Agreement explicitly covers them. "We talked about it" is not the same as "it's sold."

---

## Document Output

Read `references/s3-docx-styles.md` before creating or formatting the document.

- Format: .docx with embedded Open Sans fonts
- Status badge: DRAFT (black outline on cover page)
- Dates: Created, Last Updated
- Location: Google Drive `{Client Folder}/CREATIVE STRATEGY/` (if available) or local outputs
- No em dashes, no code/HTML in content
- Scope callout styling: bordered box, light gray background, left orange border, italic text
- Section dividers (gray bottom border) between every subsection, not just between major sections

### Font Embedding (Required)

After generating the .docx with docx-js, run the font embedding script to ensure Open Sans renders on all machines:

```bash
python3 assets/embed-fonts.py output.docx
```

This embeds Regular, Bold, Italic, and BoldItalic weights of Open Sans directly into the file. Without this step, the document falls back to Aptos or Calibri on machines without Open Sans installed. The script overwrites the input file in place (pass a second argument for a different output path). Adds approximately 500KB to file size.

### Post-Output Logging (Immediate — Do Not Defer)

After the .docx is saved:

1. **Update MEMORY.md** — Add or update the document entry. Create MEMORY.md now if it does not exist.
2. **Update CLAUDE.md** — Add or update the Documents Produced entry.
3. **Delete progress.json** — The skill finished successfully. Remove the checkpoint file.
4. **Google Drive reminder** — If this is the first time this document type appears in MEMORY.md, remind the user to move it from My Drive to the client folder.

---

## Writing Style

**Each section must stand on its own.** A reader who opens to 2.2 SEO Strategy should understand the relevant creative direction and audience context without being told to go read 1.5 and 2.1 first. Some overlap between sections is better than constant cross-references. A strategy brief is a narrative, not a database.

**Do NOT write redirect sections.** If a section's only content is "refer to [other section] for the complete [topic]," that section should not exist. Either give it real content or remove it from the skeleton.

**Lead with strategy, support with technical detail.** Within any section, the flow is: what we're doing and why, how it looks and feels, who it serves, then how the platform makes it possible. Technical detail comes last because it supports the strategy. A reader who stops before the technical section still understands the strategy.

**Readability over density.** Do not pack 10+ items into a single comma-separated sentence. Use tables for structured information (URL patterns, platform specs). Use short bullets for lists of capabilities. Use prose for strategic reasoning. Break up dense paragraphs. If a paragraph runs more than 5-6 lines, it probably needs to be split or reformatted.

**No constant back-references.** Phrases like "as established in 1.1," "per the voice defined in 1.5," and "refer to those sections" make the document feel like metadata. State what the reader needs to know in context. If the brand voice matters to the SEO strategy, describe the relevant aspects of the voice in the SEO section. Do not send the reader on a scavenger hunt.

---

## Gotchas

1. **Do NOT hallucinate strategic recommendations.** If a section has no input, mark "No input yet." Do not fill with generic advice.
2. **Do NOT confuse riffing with finalized direction.** Track the latest position, not the first thing said. When in doubt: "Earlier you mentioned X, but just now you said Y. Which direction are we going with?"
3. **User-stated strategy does not get confidence scores.** Only researched facts carry confidence labels.
4. **The Bright Idea can be plural.** One master throughline OR channel-specific ideas. Do not force a single unified concept when the user is intentionally diverging by channel.
5. **Scope flags are additive, not blocking.** Flag and collect, do not reject.
6. **Do NOT research what the Foundational Brief already covers.** Check existing research before spinning up new queries.
7. **Work Agreement line items are fuzzy big buckets.** Match by category, not exact wording. When the match is ambiguous, ask.
8. **Section order in document is fixed; conversation order is not.** Output always follows the skeleton regardless of discussion order.
9. **No em dashes.** Use commas, colons, or periods.
10. **No code, HTML, or debug output in brief content.**
11. **Technical direction goes at the bottom of the section it supports.** It is not a peer to creative direction or strategic direction. It is supporting detail. Read `references/s3-tech-stack.md` before writing technical content. S3 builds on Tresio, DatoCMS, Mux, with specific component conventions.
12. **Scope means the Work Agreement, not the conversation.** Only label deliverables as "in scope" if they map to a Work Agreement line item. Strategic recommendations, even ones the user loves, go in 3.2 (Scope Expansion Opportunities) unless the Work Agreement covers them.

---

## Reference Files

Read these on demand, not all at once:

- `references/strategy-brief-sections.md` -- Read before writing ANY section. Section templates and field specs.
- `references/s3-tech-stack.md` -- Read before writing section 2.1.2. S3 platform details.
- `references/s3-product-stack.md` -- Read when a channel strategy involves an S3 product (Hub, LeadLoop, Answer Engine, Multi-Local). Do not inject products unless the engagement calls for them.
- `references/s3-docx-styles.md` -- Read before creating or formatting the document.
- `references/research-tool-contract.md` -- Read FIRST before any research. Defines what research is (WebSearch + WebFetch calls, not training data). Non-negotiable.
- `references/confidence-scoring-spec.md` -- Read before scoring any research-backed claims.
- `references/research-validation-rules.md` -- Read before validating any Research Log.
- `references/audience-research-agent.md` -- Read before dispatching audience research.
- `references/competitor-research-agent.md` -- Read before dispatching competitor research.
- `references/seo-digital-research-agent.md` -- Read before dispatching SEO research.
- `references/social-media-discovery-agent.md` -- Read before dispatching social media research.
- `references/pdf-reading-protocol.md` -- Read before attempting any PDF. Full method chain: pdfplumber, pdftotext, pypdf, OCR.
- `references/per-client-context-files.md` -- Read during Phase 1. Defines how to create and update CLAUDE.md and MEMORY.md in the client working folder.
- `references/chat-formatting.md` -- Read at the start. Defines how all chat output must be formatted. Never write dense paragraphs in the chat.
- `references/pipeline-routing.md` -- Read after the brief is complete and the user signals they want to move on. Presents the recommended next step in the pipeline.
