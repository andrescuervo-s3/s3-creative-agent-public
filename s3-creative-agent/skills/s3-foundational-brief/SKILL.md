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

## Phase 1: Document Collection

**Client name (ABSOLUTE FIRST STEP, BLOCKING)**: This is the very first action in the entire workflow. Do NOT read reference files, create todo lists, load tool schemas, or do any other setup before this step is complete.

1. Check if the conversation already has context that reveals the client name (e.g., a project name, folder name, or prior messages).
2. If context exists, use the AskUserQuestion tool to confirm: "Are we creating a foundational brief for [name]?" This MUST be a popup prompt, not inline text.
3. If no context exists, use the AskUserQuestion tool to ask: "What is the client name?"
4. Wait for the user's response. Do not proceed until the response is received. No parallel work.

Once the client name is confirmed, collect documents in the order below. Each source has its own subsection with full procedure.

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

---

## Phase 2: Build Mode Selection

After documents are collected, ask the user which build mode to use:

**Guided**: Approval gate after every section. Best for first-time clients or when the user wants close control.

**Auto**: No checkpoints. Generate all sections from 1.0 through 3.4 without stopping. Deliver the completed document. Best for experienced users who want speed.

**Auto mode critical rules:**
- Run ALL research protocols in full before writing each section. Do not defer research until after delivery.
- Do NOT offer to run additional research after delivering the document. If research is in the protocol, it runs before delivery, not after.
- If a research step fails, mark affected claims as Unverified and continue. Never hold up delivery.

---

## Phase 3: Section Writing

### Research Execution Contract

For every research-dependent section (2.1 social media, 2.3, 3.1 brand voice, 3.2, 3.3, 3.4), follow this contract:

1. Read the corresponding agent reference file
2. Execute every research step specified in the agent protocol
3. Output a structured Research Log (visible to the user)
4. Apply validation rules from `references/research-validation-rules.md`
5. Write the section using ONLY data from the validated Research Log
6. Assign confidence scores per `references/confidence-scoring-spec.md`

If you cannot produce a Research Log, write "RESEARCH NOT PERFORMED" and score every claim as "Not Researched."

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
Read `references/foundational-brief-sections.md` BEFORE creating or appending to the document. It defines the exact structure, field order, table formats, and heading hierarchy for every section. Do not improvise your own layout. Follow the templates exactly.

Apply: clean sans-serif font (Arial or Calibri), heading hierarchy per foundational-brief-sections.md, bold field labels, clickable hyperlinks (never raw URLs), horizontal rules between major sections, tables where specified (Brand Values, Brand Voice, Social Media, S3 Service Overview, Evidence, Proof Signals).

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
- `references/confidence-scoring-spec.md` -- Read at the start. Defines confidence levels and scoring rules.
- `references/research-validation-rules.md` -- Read before validating any Research Log. Five validation rules.
- `references/foundational-brief-sections.md` -- Read before writing each section. Full templates and field specs.
- `references/audience-research-agent.md` -- Read before 3.2 Audience Profiles. Research protocol and output template.
- `references/competitor-research-agent.md` -- Read before 3.3 Competitors. Research protocol and output template.
- `references/social-media-discovery-agent.md` -- Read before 2.1 Social Media discovery. 6-platform search protocol.
- `references/seo-digital-research-agent.md` -- Read before 2.3 Digital Snapshot. Fallback research protocol.
- `references/pdf-reading-protocol.md` -- Read before attempting any PDF. One attempt, no loops.
- `references/chat-formatting.md` -- Read at the start. Defines how all chat output must be formatted (bullets, headers, tables, status lines). Never write dense paragraphs in the chat.
