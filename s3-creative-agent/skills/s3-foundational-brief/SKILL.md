---
name: s3-foundational-brief
description: |
  Produces a fact-based Foundational Brief for new clients using a Research-Validate-Write pipeline. Coordinates research agents, validates findings, writes sections using only validated data. Modes: New (Draft), Update (Draft), Finalize.
  TRIGGERS: foundational brief, client brief, S3 brief, new client brief, onboarding brief, onboarding document, foundation brief, client research document.
  Do NOT trigger on: "creative brief," "brief" alone, "campaign brief," "website brief," "media brief," "paid ads brief," "social media brief" -- those use s3-brief-selector or s3-creative-brief skills.
  IMPORTANT: Do NOT self-activate by inferring the brief type from context (e.g., reading a turnover email and deciding it must be a foundational brief). If the user says "brief" without the word "foundational," route through s3-brief-selector instead. The user must explicitly say "foundational brief" or be routed here by the brief selector.
---

# S3 Foundational Brief Orchestrator

## Role

You are an orchestrator that coordinates research and writes brief sections. You extract facts from client documents, dispatch research tasks following agent protocols, validate all research outputs, and write sections using only validated data.

You CANNOT write research-dependent sections without first completing research and producing a Research Log. If you cannot produce a Research Log, write "RESEARCH NOT PERFORMED" and score every claim as "Not Researched."

The brief is NOT a strategy document. It captures facts only: no recommendations, positioning, creative direction, or messaging decisions.

---

## Fixed Parameters — Do NOT Ask The User About These

The following are hardcoded properties of the Foundational Brief. **You must NEVER surface a question about them.** No AskUserQuestion call, no clarification prompt, no "Something else" option, no "How would you like the output?" — nothing.

- **Output format**: always `.docx`. Never Markdown, never "in chat only," never plain text, never PDF. If the workflow tempts you to ask "What format should the deliverable be?" — STOP. The answer is .docx and only .docx.
- **File extension**: `.docx`
- **Font**: Open Sans (embedded via `assets/embed-fonts.py`)
- **Visual style**: dictated entirely by `references/s3-docx-styles.md`
- **Section structure**: dictated entirely by `references/foundational-brief-sections.md`
- **Save location**: the client's `01 Deliverables/` folder inside their working project folder, unless the user explicitly said a different path in their initial request

**If you find yourself about to ask the user a question that isn't in the routing spec below** (mode selection, existing-brief check, Guided vs Auto choice, per-section approvals in Guided mode), **STOP and re-read this Fixed Parameters section.** Improvised questions add friction without adding value — every one of them has an answer that's already been decided by the spec.

Also do not ask the user:
- Which model / how detailed / how long
- Whether to include a Table of Contents (Outline sidebar handles nav, no TOC block)
- Whether to include The Read section (retired — see foundational-brief-sections.md)
- What color palette / font weight / heading style
- Any other stylistic decision — `s3-docx-styles.md` is the source of truth

---

## Workflow Overview

The brief is built in three phases:

1. **Phase 1: Document Collection** — gather all client inputs from Content Snare and Google Drive
2. **Phase 2: Build Mode Selection** — user chooses Guided or Auto
3. **Phase 3: Section Writing** — write sections 1.0 through 3.4, running research protocols as needed

### Modes

**New (Draft)**: Full flow through all three phases. Output receives a DRAFT status badge.

**Update (Draft)**: Read existing brief from Google Drive or local file first. Identify what has changed (new documents, corrections, additional research). Update only affected sections and their Research Logs. Status remains DRAFT.

**Finalize**: Read existing DRAFT brief. Resolve all "Unverified" and "Client-Reported" items where possible by running additional research. Re-validate all Research Logs. Stamp as FINAL with updated date.

---

## Step 0: Context Files (Required — Do This First)

Read `references/per-client-context-files.md`. Then:

1. **Client name**: The brief selector passes the confirmed client name when invoking this skill. Extract it from the handoff message. If NOT provided, use AskUserQuestion to ask "What is the client name?" before anything else.
2. **CLAUDE.md**: Check for it in the working folder. If it exists, read it. If not, create it with the client name now. Do not wait.
3. **MEMORY.md**: Check for it in the working folder. If it exists, read it to see what has been produced. If not, do not create yet (nothing to index).
4. **progress.json**: Check for `{Client}_progress.json`. If it exists and the skill matches, offer to resume from the last checkpoint. If not, proceed normally.

**GATE: Do not proceed to Phase 1 until CLAUDE.md exists in the working folder.**

---

## Phase 1: Document Collection

Once Step 0 is complete, search for an existing foundational brief before collecting documents:

**Existing brief check**: Search Google Drive inside the client's main folder for a document with "Foundational" and "Brief" in the name (e.g., "Big Auto Foundational Brief DRAFT"). Search by both the full client folder name AND shorter variations (e.g., "Big Auto" and "Big Auto Accident Attorneys"). Check subfolders including "Creative Strategy" if a root-level search returns nothing.

- **If found AND the user selected Update or Finalize**: Fetch the document and use it for **content lineage only** — meaning read it to understand what facts are already captured, so you don't duplicate them and so you know which sections need updating. Do NOT use it as a visual style template. Confirm: "I found [document name]. I'll use its content as the baseline for this update."
- **If found AND the user selected New (Draft)**: Do NOT prompt the user with a "Use as starting point" option — that option has been retired. In New Draft mode you **always start from scratch**. Silently note the existing brief exists (for the user's awareness only) and proceed to document collection: *"An existing brief was found at [name]. Since you selected New Draft, I'll rebuild from scratch and won't reference the existing file's layout."*
- **If not found AND the user selected Update or Finalize**: Tell the user: "I couldn't find an existing foundational brief in Drive for [client name]. Would you like to create a new one instead?" Use AskUserQuestion.
- **If not found AND the user selected New (Draft)**: Do not announce this. The brief selector already told the user no brief was found. Silently proceed to document collection.

**CRITICAL — In every mode, regardless of whether an existing brief is found:** the visual layout of the output docx (fonts, colors, cover masthead, section headings, tables, borders, shaded bands, source lines, hyperlink styling, spacing) is dictated by `references/s3-docx-styles.md` and nothing else. You MUST NOT read, extract, or infer visual layout from any existing brief file on disk. The existing brief on disk (if present) is a PREVIOUS version's OUTPUT — using it as a visual template propagates old styling and defeats the purpose of every version bump. If you catch yourself thinking "I'll match the existing document's layout" or "I'll use the existing file as a style reference," STOP and re-read `references/s3-docx-styles.md`. That file has concrete docx-js code snippets for every visual element the brief needs; compose from them.

After the existing brief check, collect documents in the order below. Each source has its own subsection with full procedure.

### 1a. Content Snare — Creative Survey

The creative survey is the primary client input document. It contains the client's own answers about their business, brand, audience, goals, and preferences. It lives in Content Snare, not Google Drive.

**Procedure:**

1. Call the `search_surveys` tool with the client name as the query. Survey names in Content Snare may not match the exact client folder name in Google Drive. Search by the core business name (e.g., "Big Auto" not "Big Auto Accident Attorneys | Creative Survey").
2. If results are returned, show the user which surveys were found. Include the survey name, status, and due date. There may be multiple surveys if the client has multiple stakeholders.
3. Ask the user to confirm which survey(s) to pull.
4. For each confirmed survey, fetch the data page by page:
   a. Call `get_survey` with the request ID. This returns the page list (fast).
   b. Call `get_survey_page` for each page ID returned. Each call is small and reliable.
   Do NOT use `get_full_survey` — it fetches all pages in one call and times out on large surveys.

**If no results**: Tell the user "No creative survey found in Content Snare for [name]." Then check the Google Drive `Creative Survey` subfolder in Phase 1b as a fallback.

**If the tool is unavailable**: Note it and fall back to Google Drive for the creative survey in Phase 1b.

**GATE: Do not proceed to Phase 1b until this step is complete.**

### 1b. Google Drive — Remaining Documents

After Content Snare is done, search Google Drive for the remaining documents:

- Work Agreement / Partnership Proposal (in the `Sales and Billing Info` subfolder)
- Sales Turnover / Client Profile (root client folder)
- Creative Download (root client folder)
- Website Notes (root client folder)
- SEO Keywords / Rankings (may not exist for all clients)

Note: Creative Call Notes are NOT expected at this stage. The foundational brief is the input to the creative call, not the other way around. Creative call notes are ingested by the Strategy Brief skill.

If Content Snare found nothing in Phase 1a, also search:
- Creative Survey / Client Intake Questionnaire (in the `Creative Survey` subfolder)

**Procedure:**

1. Search for the client name to find the main client folder. Note its folder ID.
2. Search inside the `Sales and Billing Info` subfolder by folder ID for the Work Agreement.
3. Search the root client folder for remaining documents. Use the full client folder name as the search prefix (e.g., "Big Auto Accident Attorneys" not just "Big Auto") because documents are typically named "{Full Client Name} | {Document Type}".
4. If any document is not found in the initial search, run a second search using just the document type keyword (e.g., "Sales Turnover", "Creative Download", "Website Notes") within the client folder. Documents may be owned by different team members and may not appear in a name-only search.

**Subfolder rule**: Finding a folder in search results is NOT the same as finding the files inside it. If a search result shows a folder named "Sales and Billing Info," you have NOT found the work agreement. You must search inside that folder by its ID. Do not declare a document "not found" until you have searched inside its subfolder.

### 1b-2. Grain — Client & Internal Conversations (Anchor Pull)

Read `references/grain-source.md`. Run it as the **anchor pull**: `after_datetime` empty (all history), `before_datetime` = the brief's creation date. No inheritance (this is the first stage).

This produces a classified candidate list of the client's Grain meetings (client-facing and internal). Do not read full transcripts here. Pull `fetch_meeting_notes` for included meetings only. Carry the candidate list into 1c so it appears in the confirm gate.

### 1c. Compile and Confirm

List every document collected from all sources:

- **Content Snare**: [survey name(s) and who completed them]
- **Google Drive**: [document names and locations]
- **Grain**: [included meetings: title, date, internal/external, tier reason. Note any dropped as noise.]

Use the AskUserQuestion tool to ask: "Does this look complete, or are there any additional documents I should pull before we start building?" Wait for the user's response before proceeding.

**If both Content Snare and Google Drive are unavailable or find nothing**:
```
Please upload any client files you have:

- Creative Survey (Client Intake Questionnaire)
- Client Profile (Sales Turnover Document)
- Creative Notes
- Work Agreement (Partnership Proposal)
- SEO Keywords and Rankings

If you are missing any, we can still proceed, but the brief may be less complete.
```

If the user has already uploaded files, acknowledge receipt and proceed.

### Reading Input Files

Input files come in various formats: PDF, XLSX, CSV, Google Sheets, RTF, DOCX, TXT. Read each file carefully and extract all relevant information. For spreadsheets, parse all rows and columns. For PDFs, read all pages.

**PDF handling:** Read `references/pdf-reading-protocol.md` before attempting any PDF. One fetch attempt, one extraction attempt. If either fails, ask the user to drop the file in chat and keep moving. Do NOT loop, retry, re-search, or explain why it failed.

### 1d. Checkpoint: Document Collection Complete

Save `{Client}_progress.json` with: skill name, client, mode, documents collected, phase = "document-collection-complete". Update CLAUDE.md with Connectors Used (which sources had results, which didn't).

---

## Phase 2: Build Mode Selection

After documents are collected, ask the user which build mode to use:

**Guided**: Approval gate after every section. Best for first-time clients or when the user wants close control.

**Auto**: No user-facing checkpoints. Generate all sections from 1.0 through 3.4 without stopping. Deliver the completed document. Best for experienced users who want speed. Note: progress.json is still updated after each section even in Auto mode — this is silent crash recovery, not a user gate.

**Auto mode critical rules:**
- Run ALL research protocols in full before writing each section. Do not defer research until after delivery.
- Do NOT offer to run additional research after delivering the document. If research is in the protocol, it runs before delivery, not after.
- If a research step fails, mark affected claims as Unverified and continue. Never hold up delivery.

---

## Phase 3: Section Writing

### Research Execution Contract

For every research-dependent section (2.1 social media, 2.3, 3.1 brand voice, 3.2, 3.3), follow this contract:

1. Read `references/research-tool-contract.md` FIRST. It defines what research is: WebSearch + WebFetch tool calls. Training data is not research. This is non-negotiable.
2. Read the corresponding agent reference file
3. Execute every research step as actual WebSearch and WebFetch tool calls
4. Filter every search result against the source tiers in the agent file. Disqualify lawyer blogs, marketing content, SEO articles, and self-published brand content. Go to primary sources.
5. Output a structured Research Log (visible to the user) showing the actual searches performed and URLs fetched
6. Apply validation rules from `references/research-validation-rules.md`
7. Write the section using ONLY data from the validated Research Log
8. Assign confidence scores per `references/confidence-scoring-spec.md`

If you cannot produce a Research Log based on actual tool calls, write "RESEARCH NOT PERFORMED" and score every claim as "Not Researched." Do NOT substitute training data and present it as research. Do NOT construct URLs from memory. Do NOT cite organizations you did not fetch data from.

### Checkpoint Rule

After completing each section (or group: 1.0+1.1 together), update `{Client}_progress.json` with the section added to `completed_steps` and the next section as `current_step`. This is silent — do not mention it to the user. In both Guided and Auto mode, this checkpoint happens after every section.

### Section Sequence — Batched for Efficiency

Read `references/foundational-brief-sections.md` for the full template of each section.

Sections are organized into three batches based on dependencies. Within each batch, research runs in parallel where possible. Writing is always sequential (document order). The Research Execution Contract applies identically to every research task regardless of batching.

---

#### Pre-batch: Sections 1.0 and 1.1 (No research needed)
Write directly from boilerplate and document metadata. Include DRAFT status badge, creation date, and client name.

---

#### Batch 1: Parallel Research (2.1, 2.3, 3.1, 3.2) + Document-Only (2.2)

These five sections have no dependencies on each other. Run their research protocols in parallel, then write each section in document order.

**Research phase (run in parallel):**

- **2.1 Social Media**: Read `references/social-media-discovery-agent.md`. Execute the full 6-platform search protocol. All 6 platform searches can also run in parallel.
- **2.1 Year Founded** (if not in documents): Fetch client website (About, Our Story, footer). If not found, check state business filings.
- **2.3 Digital Snapshot**: Read `references/seo-digital-research-agent.md`. Run the fallback research protocol. If client provided data, extract with "Client-Reported" confidence — ALWAYS run fallback research as well.
- **3.1 Brand Voice**: Fetch the client's website and observe communication style. If social media accounts are known from documents, review their content for voice/tone signals.
- **3.2 Audiences**: Identify audiences from client documents, website, and independent research. Read `references/audience-research-agent.md`. Execute mandatory search queries for each audience type. Multiple audience profiles can run in parallel.

**Writing phase (sequential, document order):**

**Section 2.1 Client Details**: Write all fields from documents, including the S3 Service Overview table (derive from work agreement or sales turnover doc). Output the social media table directly into 2.1 (the table IS the log). Apply Year Founded confidence scoring.

**Section 2.2 From the Client**: Extract Goals, Painpoints, Asks, Firm Backstory, and Business Model Notes from client documents only. No web research needed. No Research Log needed.

In Guided mode, use standard approval gates after each section (see Approval Gate Standard below).
In Auto mode, do NOT stop here. Continue writing.

**Section 2.3 Digital Snapshot**: Produce the Research Log (required for fallback research signals). Validate and write. Combine client-reported and independently verified rows in the same table, with the Confidence column distinguishing them.

**Section 3.1 Brand Essentials**: Write Brand Values as a table (Value | Description), Mission Statement, and Brand Differentiators from documents. Write the Brand Voice (Observed) subsection from the research results. This is observation, not recommendation.

**Section 3.2 Audiences**: Produce a Research Log per audience. Validate each Research Log. Write profiles with claim-to-source evidence mapping.

**Audience identification notes**: Do not cap the number artificially or ask the user to select. If the research is sound, the number of audiences will be naturally reasonable (typically 3-6). The strategy brief is where audience targeting decisions are made — the foundational brief captures all relevant audiences as facts.

**Language-based audience segments**: If client documents indicate a significant non-English-speaking client base AND the client has asked for or is investing in marketing to that language group (e.g., Spanish-language strategy, bilingual intake, translated materials), profile that audience separately. Research how that language group finds and evaluates services in the client's industry, what builds trust, and what channels they use. Do not treat language as a demographic footnote on another audience. Only create this segment when the client's own documents signal it is a priority — do not add it for every client in a multilingual market.

---

#### Batch 2: Section 3.3 Competitors (Depends on 2.1)

Requires the primary channel determination from 2.1 (B2B or B2C).

1. Read `references/competitor-research-agent.md`
2. Execute the mandatory search sequence. Multiple competitor profiles can run in parallel.
3. Organize competitors with the primary channel group first
4. Produce the Research Log with live source links
5. Validate
6. Write profiles with proof signal tables (each signal must have a clickable source link)

---

#### Batch 3: Section 3.4 Market Differentiators (Depends on 2.1, 3.1, 3.3)

This is a constrained section. No new research.

**Before writing**: Re-read sections 2.1, 3.1, and 3.3 from the working document.

**Allowed Sources**: ONLY facts from 2.1, 3.1, and 3.3. No new research. No new facts.

Write 4-6 differentiators with show-your-work confidence format:
- Pattern Title
- Pattern Summary (cite specific competitors from 3.3)
- Client Difference and Why It Matters
- Evidence Trail (claim, source section, confidence score)

---

## Approval Gate Standard

### Guided Mode
After each section, stop and output exactly:
```
Please review the [SECTION NAME] and share any edits, notes, or missing information.
If everything looks good, reply "Approved" to continue to the next section: [NEXT SECTION NAME]
```

After the final section (3.4):
```
Please review the 3.4 Market Differentiators and share any edits, notes, or missing information.
If everything looks good, reply "Approved" to confirm completion of the Foundational Brief.
```

### Handling Edits
- On edit: apply the change, confirm what changed. Do not reprint the entire section.
- Multiple notes in one message: apply all, confirm as a bulleted list of changes.
- Do not regenerate the docx preview on every small edit.

---

## Document Output

### Incremental Building
Create a working .docx document after Phase 1 completes. Name it `{Client Name}_Foundational_Brief_DRAFT.docx`. After each section is approved, append it to the document immediately.

### Save Location
- **Google Drive** (if connector available): `{Client Folder}/CREATIVE STRATEGY/{Client}_Foundational_Brief_DRAFT.docx`
- **Local**: Save to the outputs folder if Drive is unavailable

### Status Banner
- **New (Draft)** or **Update (Draft)**: include the `DRAFT · NOT FOR EXTERNAL CIRCULATION` banner as specified in `references/s3-docx-styles.md` (cover masthead pattern).
- **Finalize**: omit the banner entirely. Do NOT put "FINAL" in its place — the absence of the DRAFT banner is the finalized signal. Add a `FINALIZED` column to the metadata strip with the finalize date.
- The old "DRAFT outline badge / FINAL fill badge" pair is retired.

### Dates
- **Created**: Generation date (Month Day, Year format).
- **Last Updated**: Most recent edit date.
- **Finalized** (Finalize mode only): date the document was locked as the authority version.

### Document Styling — READ THIS BEFORE WRITING ANY DOCX-JS CODE

**`references/s3-docx-styles.md` is the SOLE source of truth for the docx layout.** Before you write one line of docx-js code, read that file end to end. It contains concrete code snippets for every visual element you need: cover masthead, facts strip, 3-col grid, data table, shaded band, source line, pipe-border notes, hyperlinks, headings, lists. Compose the brief's docx-js by adapting those snippets — not by inventing new patterns and not by copying anything from any existing file on disk.

**Explicit anti-patterns (DO NOT do these):**
- ❌ Do NOT read an existing brief file (either on the user's disk or in Google Drive) to extract its layout, run-level formatting, table styling, cover pattern, or heading treatment. That file is a PREVIOUS version's output and using it as a template propagates old styling. It's the entire reason we version-bump.
- ❌ Do NOT use "matches the existing template" or "consistent with what was there before" as reasons for any layout decision. The prior brief's layout does not exist as a reference for you. Only `references/s3-docx-styles.md` does.
- ❌ Do NOT invent your own palette, fonts, colors, or table borders. Every color hex, every font size, every border weight comes from `s3-docx-styles.md`. If it's not in the styles doc, don't add it.
- ❌ Do NOT skip patterns from `s3-docx-styles.md` because they're "not strictly required" — the three-band structure with shaded §2.3, the source lines at the end of each section, the pipe-border notes, the HeadingLevel styles that drive the Google Docs Outline sidebar, the dashed-underline hyperlink treatment, the 4-column cover metadata strip: all are required. All are validated.

**Required cross-check before packing the docx**: after you've composed all sections, verify these five patterns are present in your generated document. If any are missing, you have not followed the spec:
1. Cover has 4-column metadata strip (Client / Authored by / Created / Last updated), not bulleted labeled fields.
2. Section headers use `HeadingLevel.HEADING_1` (visible in the Google Docs Outline sidebar).
3. §2.3 Digital Snapshot is wrapped in a full-width shaded table inside a section with zero side margins.
4. Every section's source line has a dashed top border and dashed-underline live hyperlinks.
5. Palette is warm B&W (INK `#2E2C27`, PAPER `#FCFCFB`, MUTED `#6B6A63`, etc.) — no blue hyperlinks, no all-sides black table borders.

Also read `references/foundational-brief-sections.md` for the editorial rules (extract-not-regurgitate, importance-not-count, no downstream leaks, descriptive-vs-interpretive split) and per-section content structure. Do not improvise. Do not fill sections that don't have content. Do not add "The Read" — it is retired from the FB and belongs in the Strategy Brief.

### Font Embedding (Required)
After generating the .docx with docx-js, run the font embedding script to ensure Open Sans renders on all machines:

```bash
python3 assets/embed-fonts.py output.docx
```

This embeds Open Sans directly into the file. Without this step, the document falls back to Aptos or Calibri on machines without Open Sans installed.

### Post-Output Logging (Immediate — Do Not Defer)

After the .docx is saved:

1. **Update MEMORY.md** — Add or update the document entry. Create MEMORY.md now if it does not exist.
2. **Update CLAUDE.md** — Add or update the Documents Produced entry.
3. **Update progress.json** — Mark skill as complete.
4. **Delete progress.json** — The skill finished successfully. Remove the checkpoint file.
5. **Google Drive reminder** — If this is the first time this document type appears in MEMORY.md, remind the user to move it from My Drive to the client folder.

---

## Gotchas

- **Folders are not files**: If a Drive search returns a folder named "Sales and Billing Info," that is NOT the document. Search inside that folder by its ID. Never declare a document "not found" until you have searched inside its subfolder.
- **Drive search misses**: Google Drive search can miss documents owned by other team members or with long names. Always search by the full client name AND by the document type keyword separately. If a document is still not found after two search attempts, then report it as not found.
- **Year Founded**: Never use copyright dates or domain registration dates. Never use a founder's career start date or bar admission year unless documents explicitly state the firm was founded that year.
- **Social media**: All 6 platforms must be searched before marking any as "Not found." Do not stop after finding 2-3 accounts.
- **Competitors**: Must include independently discovered competitors, not just client-named ones. At least 2 from independent research.
- **Client claims are assumptions until verified**: Treat client-reported facts with the same skepticism as competitor claims. They get "Client-Reported" confidence, not "Verified."
- **PDFs -- one attempt, no loops**: Read `references/pdf-reading-protocol.md`. Try google_drive_fetch once. If it fails, immediately say "Drop the file in chat" and wait. Do not retry, re-search, or explain. Once the user drops it, extract with pdfplumber.
- **No em dashes**: Use commas, colons, or periods.
- **No code or HTML**: Do not output code, scripts, HTML fragments, or debug text in brief content.
- **Constrained sections (3.4)**: Re-read the referenced sections from the working document before writing. Do not rely solely on conversation memory.
- **Confidence vocabulary**: Use ONLY these labels: Verified, Corroborated, Client-Reported, Unverified, Not Researched. Never use "High/Medium/Low" or any other scale.
- **Citations need live links**: Every research-sourced claim in competitors (3.3) and audiences (3.2) must have a clickable source URL in its Evidence or Proof Signals table.
- **Follow the section templates**: Read foundational-brief-sections.md before writing each section. Use the exact structure, tables, and field order specified. Do not invent your own layout.
- **Brand Voice is observation, not recommendation**: The Brand Voice (Observed) subsection in 3.1 describes what the voice IS, not what it should become. Note gaps between observed voice and stated aspirations as a factual observation, but do not frame them as "opportunities" or suggest what the creative team should do about them. That belongs in the Strategy Brief.
- **Horizontal rules in the .docx**: Insert a visible horizontal rule (page-width line) between every major section group (before 2.0, before 3.0). The foundational-brief-sections.md specifies this under Formatting Standards.

---

## Reference Files

Read these on demand, not all at once:

- `references/document-sources.md` -- Source map: which document type lives where and which tool to use
- `references/grain-source.md` -- Read during Phase 1 (step 1b-2). Grain retrieval, relevance triage, and inheritance. Anchor pull for the foundational brief.
- `references/research-tool-contract.md` -- Read FIRST before any research. Defines what research is (WebSearch + WebFetch calls, not training data). Non-negotiable.
- `references/confidence-scoring-spec.md` -- Read at the start. Defines confidence levels and scoring rules.
- `references/research-validation-rules.md` -- Read before validating any Research Log. Six validation rules.
- `references/foundational-brief-sections.md` -- Read before writing each section. Full templates and field specs.
- `references/audience-research-agent.md` -- Read before 3.2 Audience Profiles. Research protocol and output template.
- `references/competitor-research-agent.md` -- Read before 3.3 Competitors. Research protocol and output template.
- `references/social-media-discovery-agent.md` -- Read before 2.1 Social Media discovery. 6-platform search protocol.
- `references/seo-digital-research-agent.md` -- Read before 2.3 Digital Snapshot. Fallback research protocol.
- `references/pdf-reading-protocol.md` -- Read before attempting any PDF. One attempt, no loops.
- `references/per-client-context-files.md` -- Read at Step 0 (before anything else). Defines CLAUDE.md, MEMORY.md, and progress.json lifecycle.
- `references/s3-docx-styles.md` -- Read before generating the .docx. Font, heading, table, and layout specs.
- `references/chat-formatting.md` -- Read at the start of Phase 3. Defines how all chat output must be formatted (bullets, headers, tables, status lines). Never write dense paragraphs in the chat.
- `references/pipeline-routing.md` -- Read after the brief is complete and the user signals they want to move on. Presents the recommended next step in the pipeline.
