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

- **If found AND the user selected Update or Finalize**: Fetch the document and use it as the starting point. Confirm: "I found [document name]. I'll use this as the base."
- **If found AND the user selected New (Draft)**: Tell the user: "I found an existing foundational brief: [document name] (created [date]). Want me to use this as a starting point, or start completely fresh?" Use AskUserQuestion with options: "Use as starting point" / "Start fresh". Either way, proceed without re-asking the mode.
- **If not found AND the user selected Update or Finalize**: Tell the user: "I couldn't find an existing foundational brief in Drive for [client name]. Would you like to create a new one instead?" Use AskUserQuestion.
- **If not found AND the user selected New (Draft)**: Do not announce this. The brief selector already told the user no brief was found. Silently proceed to document collection.

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
- Creative Call Notes (root client folder)
- Creative Download (root client folder)
- Website Notes (root client folder)
- SEO Keywords / Rankings (may not exist for all clients)

If Content Snare found nothing in Phase 1a, also search:
- Creative Survey / Client Intake Questionnaire (in the `Creative Survey` subfolder)

**Procedure:**

1. Search for the client name to find the main client folder. Note its folder ID.
2. Search inside the `Sales and Billing Info` subfolder by folder ID for the Work Agreement.
3. Search the root client folder for remaining documents. Use the full client folder name as the search prefix (e.g., "Big Auto Accident Attorneys" not just "Big Auto") because documents are typically named "{Full Client Name} | {Document Type}".
4. If any document is not found in the initial search, run a second search using just the document type keyword (e.g., "Creative Call Notes", "Sales Turnover", "Creative Download") within the client folder. Documents may be owned by different team members and may not appear in a name-only search.

**Subfolder rule**: Finding a folder in search results is NOT the same as finding the files inside it. If a search result shows a folder named "Sales and Billing Info," you have NOT found the work agreement. You must search inside that folder by its ID. Do not declare a document "not found" until you have searched inside its subfolder.

### 1c. Compile and Confirm

List every document collected from both sources:

- **Content Snare**: [survey name(s) and who completed them]
- **Google Drive**: [document names and locations]

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

For every research-dependent section (2.1 social media, 2.3, 3.1 brand voice, 3.2, 3.3, 3.4), follow this contract:

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

### Section Sequence

Read `references/foundational-brief-sections.md` for the full template of each section.

#### Sections 1.0 and 1.1 (No research needed)
Write directly from boilerplate and document metadata. Include DRAFT status badge, creation date, and client name.

#### Section 2.1 Client Details (Document-sourced + social media research)
Write all fields from documents, including the S3 Service Overview table (derive from work agreement or sales turnover doc).

For Social Media Accounts:
1. Read `references/social-media-discovery-agent.md`
2. Execute the full 6-platform search protocol
3. Output the social media table directly into 2.1. The table IS the log. No separate narrative Research Log needed for social media.

For Year Founded, if not in documents:
1. Fetch client website (About, Our Story, footer)
2. If not found, check state business filings
3. Apply confidence scoring

#### Section 2.2 From the Client (Document-sourced only)
Extract Goals, Painpoints, Asks, Firm Backstory, and Business Model Notes from client documents only. No web research needed. No Research Log needed.

In Guided mode, use standard approval gates after each section (see Approval Gate Standard below).
In Auto mode, do NOT stop here. Continue directly to 2.3 without pausing.

#### Section 2.3 Digital Snapshot (SEO/digital research)
1. Read `references/seo-digital-research-agent.md`
2. If client provided data: extract and format with "Client-Reported" confidence
3. ALWAYS run the fallback research protocol as well, even when client data exists. Client-reported metrics are supplemented by independently verified signals (indexed pages, observable keyword positions, GBP check, site signals). This produces a richer snapshot and cross-checks client claims.
4. Produce the Research Log (required for fallback research signals)
5. Validate and write. Combine client-reported and independently verified rows in the same table, with the Confidence column distinguishing them.

#### Section 3.1 Brand Essentials (Document-sourced + brand voice observation)
Write Brand Values as a table (Value | Description), Mission Statement, and Brand Differentiators from documents.

For Brand Voice (Observed) subsection:
1. Fetch the client's website and observe communication style
2. If social media accounts were found in 2.1, review their content for voice/tone signals
3. Write the observed voice analysis
4. This is observation, not recommendation

#### Section 3.2 Audiences (Research-intensive)

**Audience Identification**: Identify all relevant audiences from client documents, the client's website, and independent research. Do not cap the number artificially or ask the user to select. If the research is sound, the number of audiences will be naturally reasonable (typically 3-6). The strategy brief is where audience targeting decisions are made — the foundational brief captures all relevant audiences as facts.

**Language-based audience segments**: If client documents indicate a significant non-English-speaking client base AND the client has asked for or is investing in marketing to that language group (e.g., Spanish-language strategy, bilingual intake, translated materials), profile that audience separately. Research how that language group finds and evaluates services in the client's industry, what builds trust, and what channels they use. Do not treat language as a demographic footnote on another audience. Only create this segment when the client's own documents signal it is a priority — do not add it for every client in a multilingual market.

**Audience Profiles** (for each identified audience):
1. Read `references/audience-research-agent.md`
2. Execute mandatory search queries for the audience type
3. Produce a Research Log per audience
4. Validate each Research Log
5. Write profiles with claim-to-source evidence mapping

#### Section 3.3 Competitors (Research-intensive)
1. Read `references/competitor-research-agent.md`
2. Execute the mandatory search sequence
3. Determine the client's primary channel from 2.1 (B2B or B2C) and organize competitors with that group first
4. Produce the Research Log with live source links
5. Validate
6. Write profiles with proof signal tables (each signal must have a clickable source link)

#### Section 3.4 Market Differentiators (Constrained section)
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

### Status Badge
- DRAFT: Black outline badge on cover page
- FINAL: Black fill badge on cover page

### Dates
- Created: Generation date
- Last Updated: Most recent edit date

### Document Styling
Read `references/s3-docx-styles.md` for font, heading, table, and layout specifications. Read `references/foundational-brief-sections.md` for the exact structure, field order, table formats, and heading hierarchy for every section. Do not improvise your own layout. Follow the templates exactly.

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
- `references/research-tool-contract.md` -- Read FIRST before any research. Defines what research is (WebSearch + WebFetch calls, not training data). Non-negotiable.
- `references/confidence-scoring-spec.md` -- Read at the start. Defines confidence levels and scoring rules.
- `references/research-validation-rules.md` -- Read before validating any Research Log. Six validation rules.
- `references/foundational-brief-sections.md` -- Read before writing each section. Full templates and field specs.
- `references/audience-research-agent.md` -- Read before 3.2 Audience Profiles. Research protocol and output template.
- `references/competitor-research-agent.md` -- Read before 3.3 Competitors. Research protocol and output template.
- `references/social-media-discovery-agent.md` -- Read before 2.1 Social Media discovery. 6-platform search protocol.
- `references/seo-digital-research-agent.md` -- Read before 2.3 Digital Snapshot. Fallback research protocol.
- `references/pdf-reading-protocol.md` -- Read before attempting any PDF. One attempt, no loops.
- `references/per-client-context-files.md` -- Read after document collection. Defines how to create and update CLAUDE.md and MEMORY.md in the client working folder.
- `references/chat-formatting.md` -- Read at the start. Defines how all chat output must be formatted (bullets, headers, tables, status lines). Never write dense paragraphs in the chat.
- `references/pipeline-routing.md` -- Read after the brief is complete and the user signals they want to move on. Presents the recommended next step in the pipeline.
