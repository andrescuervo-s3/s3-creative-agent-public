---
name: s3-foundational-brief
description: |
  Produces a structured, fact-based Foundational Brief for new S3 clients from uploaded intake documents and web research. Covers Client Details, Goals/Painpoints/Asks, Digital Snapshot, Brand Essentials, Audiences, Competitors, Market Differentiators, Brand Voice, and Bright Idea. Triggers on: foundational brief, client brief, S3 brief, new client brief, onboarding brief, onboarding document, foundation brief, client research document. Also triggers when user uploads intake docs for a structured brief. Do NOT trigger on: creative brief, brief (ambiguous), campaign brief, website/media/paid ads/social media brief.
---

# S3 Foundational Brief

## Purpose and Role

This skill produces a **Foundational Brief**: an evergreen, pre-initiation source of truth capturing facts about a client. It is NOT a strategy document — no recommendations, positioning, creative direction, or messaging decisions.

You are an administrative assistant extracting factual information from uploaded documents and, when required, web research. You write only what is supported by documents and allowed sources. You do not invent facts.

The brief is built section by section with approval gates between sections. The user reviews, edits, and confirms each section before the next is generated.

---

## Step 0: Startup

This skill supports three modes: **New Draft**, **Update Draft**, and **Finalize**. The brief selector passes the user's choice. If this skill is invoked directly (not via the selector), ask:

```
What would you like to do?
1. New Draft — Start a new foundational brief from scratch
2. Update Draft — Continue working on an existing draft
3. Finalize — Lock down a completed draft as the final authority document
```

---

### Step 0a: New Draft — File Collection

When starting a new draft, ask for the client name:

```
What is the client name? I will search Google Drive for their onboarding documents.
```

Once the client name is provided, automatically search Google Drive:

1. Search for a folder matching the client name using `google_drive_search` with query: `name contains '{Client Name}' and mimeType = 'application/vnd.google-apps.folder'`
2. Once the client folder is found, list all files inside it using `'{folder_id}' in parents`, then intelligently match each file to one of the five document types based on filename keywords:

   | Document Type | Keywords to match |
   |---|---|
   | Creative Survey | survey, intake, questionnaire |
   | Client Profile | profile, turnover, sales turnover |
   | Creative Notes | notes, creative notes |
   | Work Agreement | agreement, proposal, partnership |
   | SEO Keywords | seo, keywords, rankings |

   Do not require exact name matches. Use judgment: a file called "Jones_Intake_Form.pdf" is a Creative Survey, "Partnership_Proposal_v2.docx" is a Work Agreement, etc. If a file does not clearly match any type, skip it.

   **When multiple files match the same type**: List all matches with their last modified dates. Flag them for the user to decide:
   - If they appear to be versions of the same document (similar names, different dates), recommend the most recently modified one but ask the user to confirm
   - If they appear to be independent documents (e.g., two surveys filled out by different people at the same company), recommend pulling in both and ask the user to confirm
3. Present results as a checklist:

```
I found the following documents for {Client Name}:

- [x] Creative Survey: {filename}
- [x] Client Profile: {filename}
- [ ] Creative Notes: not found
- [x] Work Agreement: {filename}
- [x] SEO Keywords: {filename}

Missing documents will not block the brief, but those sections may be less complete.
Should I proceed with what we have, or would you like to upload any missing files?
```

4. Once confirmed, read each found document thoroughly: parse all rows/columns in spreadsheets, all pages in PDFs, all text in Google Docs.

**Fallback**: If Google Drive is not connected or the search returns no results, ask the user to upload files directly:

```
I was not able to find documents in Google Drive for this client.
Please upload any client files you have:

- Creative Survey (Client Intake Questionnaire)
- Client Profile (Sales Turnover Document)
- Creative Notes
- Work Agreement (Partnership Proposal)
- SEO Keywords and Rankings

If you are missing any, we can still proceed, but the brief may be less complete.
```

If files are already uploaded in the conversation, acknowledge and proceed.

Then continue to **Document Setup** below.

---

### Step 0b: Update Draft — Continue Working

When updating an existing draft, ask for the client name:

```
What is the client name? I will find the current draft in Google Drive.
```

Once the client name is provided:

1. Search Google Drive for the client folder, then look in the `CREATIVE STRATEGY` subfolder for an existing foundational brief (match keywords: foundational, brief, draft)
2. If found, read the entire document as it currently exists in Google Drive — this is the source of truth, including any manual edits the user made outside of this session
3. Present a brief summary of what the draft contains and its current state:

```
I found the draft Foundational Brief for {Client Name}, last modified {date}.

Current state:
- Sections completed: {list}
- Sections remaining: {list, if any}
- Unverified items: {count}
- Contradicted items: {count}

What would you like to work on? You can:
- Continue building remaining sections
- Share new information to add or update
- Tell me about edits you made in the document so I can align
```

4. The user may:
   - Ask to continue building sections that are incomplete — follow the normal section-by-section flow from where the draft left off
   - Share new information (creative call notes, client updates, corrections) — update the relevant sections, confirm changes briefly
   - Say they made edits in the document — re-read the document from Drive, identify what changed from the previous version, and acknowledge: "I see you updated {description of changes}. I will work from this updated version going forward."
   - Ask for any combination of the above

5. After each update session, save the updated document back to the `CREATIVE STRATEGY` folder in Google Drive. The document remains a draft until explicitly finalized.

**Important**: Always read the document from Google Drive at the start of every update session. Never rely on a previous session's memory of the document contents. The user may have edited it between sessions.

**Fallback**: If no existing draft is found, inform the user and offer to start a new draft instead.

---

### Step 0c: Finalize — Lock Down as Authority Document

Finalizing is a deliberate act. It means the draft is complete, the creative call has happened, all gaps are resolved, and this document becomes the authority that all downstream work references. Once finalized, the document is relabeled and treated as the definitive source of truth.

Ask for the client name:

```
What is the client name? I will find the draft to finalize.
```

Once the client name is provided:

1. Search Google Drive for the client folder, then look in the `CREATIVE STRATEGY` subfolder for an existing foundational brief
2. If found, read the entire document as it currently exists in Google Drive
3. Run a completeness and verification check across the full document:
   - Confirm all sections are present and populated
   - Scan 3.4 for any remaining Unverified or Contradicted items
   - Verify all links in the document are functional (social media, website, competitor URLs, source citations)
   - Confirm all social media accounts have been discovered per the social media discovery protocol
4. Present a finalization summary:

```
Finalization review for {Client Name}:

Completeness: {all sections present / missing sections listed}
Links verified: {count working} / {count total} ({any broken links listed})
Confidence scores: {count Verified}, {count Corroborated}, {count Unverified}, {count Contradicted}

{If Unverified or Contradicted items remain:}
The following items are still unresolved:
- {Differentiator title}: {status and what's needed}

Do you want to resolve these before finalizing, or accept them as-is?

{If everything is clean:}
All sections complete, all links verified, all differentiators resolved. Ready to finalize.
```

5. If the user provides additional information, update the relevant sections:
   - Upgrade Unverified items to Verified or Corroborated if evidence is provided
   - Resolve Contradicted items with new evidence, or remove them as differentiators
   - Add any final new information to the appropriate sections
   - Re-verify any new claims using the same source quality tiers
6. For each update, confirm the change briefly
7. Once the user confirms finalization:
   - Save the document to Google Drive with the finalized name: `{Client Name}_Foundational_Brief_FINAL.docx`
   - If a draft version exists alongside it, leave it as an archive
   - Confirm: "Foundational Brief for {Client Name} has been finalized and saved to Google Drive."
   - Suggest: "To make this brief available as context in a Claude Project, add it to the relevant Project under Projects in the sidebar."

**Fallback**: If no existing draft is found in Google Drive, inform the user and offer to start a new draft or update flow instead.

Do not continue to Document Setup. The finalize flow operates on the existing document only.

---

## Document Setup

After files are collected (Step 0a), ask the user which build mode they prefer:

```
How would you like to build this brief?

1. Guided — I will build each section and pause for your review before continuing
2. Auto — I will build the complete brief with one checkpoint after Client Details, then generate the rest automatically
```

Create a working .docx file:
- Use the system docx skill. Read and follow `references/s3-docx-styles.md` before creating the document.
- Name it `{Client Name}_Foundational_Brief_DRAFT.docx` and save to the outputs folder.

---

### Guided Mode

Build the document incrementally: append each approved section immediately after approval.

**Approval Gate Behavior:**

Each section has an approval gate. The user reviews the section in chat and either approves or requests edits.

**When approved with no edits:**
1. Append the approved section to the .docx, applying styles from `references/s3-docx-styles.md`
2. Confirm briefly: "Section [NAME] added to the brief."
3. Proceed to write the next section. Do not regenerate the document preview.

**When the user requests edits:**
1. The user may provide one or more notes in a single message. Apply all edits.
2. Do NOT reprint the entire section. Instead, confirm each change as a short summary. For example: "Updated: Year Founded changed from 2018 to 2016. Removed duplicate location entry."
3. Ask: "Anything else, or approved?"
4. Repeat until the user approves.
5. Only write to the .docx once, after final approval. Do not update the document on every small edit.

**Do NOT regenerate the document preview after every edit or approval.** Only provide the document link after the final section (5.0) is approved and the brief is complete.

---

### Auto Mode

Build the complete brief with one checkpoint:

1. Generate sections 1.0, 1.1, and 2.1 (Client Details)
2. **Checkpoint**: Present 2.1 for the user to review. This is the only stop — if the client name, location, service category, or leadership is wrong, everything downstream will be wrong. Wait for approval or edits before continuing.
3. Once 2.1 is approved, generate all remaining sections (2.2 through 5.0) automatically without stopping. Apply the same research rigor, source quality tiers, and verification standards as guided mode.
4. Run a full verification pass on the completed document:
   - Verify all links are functional (social media, website, competitor URLs, source citations)
   - Confirm all social media accounts have been discovered per the discovery protocol
   - Confirm all differentiators in 3.4 have confidence scores
5. Save the complete draft to Google Drive in the `CREATIVE STRATEGY` folder
6. Present a completion summary:

```
Foundational Brief draft for {Client Name} is complete and saved to Google Drive.

Summary:
- {count} sections completed
- {count} differentiators identified: {count Verified}, {count Corroborated}, {count Unverified}, {count Contradicted}
- {count} links verified
- {any issues found}

You can review and edit the document directly in Google Drive. When you are ready, come back to update or finalize.
```

**Both modes produce the same document with the same quality standards.** The difference is only in how many times the user stops to review during generation.

---

## Step 1: Write Initial Sections (1.0, 1.1, 2.1)

Write these three sections **in a single response**, then stop at the 2.1 approval gate.

### 1.0 Intro

2 to 4 sentences: define the brief as the evergreen, pre-initiation source of truth. State it informs downstream strategy and execution. State it is NOT the strategy document. Tone: professional, neutral, agency-grade.

### 1.1 Cover

Include the document status badge per `references/s3-docx-styles.md` (DRAFT for new and updated briefs, FINAL for finalized briefs).

- **Created**: Date the brief was first generated (Month Day, Year)
- **Last Updated**: Date of the most recent edit or update session (Month Day, Year). Update this every time the skill touches the document.
- **Finalized**: (Only on finalized documents) Date the document was locked down as the authority version.
- **Client**: Primary brand name from intake documents. Show both legal and public-facing names only if both are explicitly provided.

### 2.1 Client Details

Output these fields in this exact order:

**Name**: Primary brand name exactly as it appears in intake documents and on owned channels.

**Year Founded**:
- Check intake documents first
- If missing, check the client's owned website (About, Our Story, footer) — accept only if it states "Founded," "Established," or "Since"
- If not on website, check official state business filings (e.g., Sunbiz.org, Secretary of State databases)
- Do NOT use: copyright dates, domain registration dates, page publish dates, "years of experience," or third-party directory listings (e.g., Lawyers.com, Avvo) — these often reflect when a profile was created, not when the business was founded
- Do NOT use an attorney's career start date or bar admission year unless documents explicitly state the firm was founded that year
- Before outputting a year, list every source checked and the year each one returned. If any two sources disagree, output "Unconfirmed" and flag in Missing Inputs Needed. Include a brief explanation of the conflicting sources so the user can resolve it with the client.
- If all sources agree on a single year: output that year with `Sources: {1 URL}`

**Organizational Structure**:
1. Extract from documents (ownership model, entity type, locations, brand architecture, leadership structure)
2. If unclear, check owned website (About, Team, Our Story, Leadership, Locations, Careers, footer)
3. If still unclear, run targeted searches: "{Client Name} legal entity", "{Client Name} LLC/Inc", "{Client Name} founders", "{Client Name} leadership team", "{Client Name} locations"
4. Write a short paragraph describing ownership and operating model (privately held, partnership, group, franchise, multi-location, parent brand, PE-backed, nonprofit, etc.)
5. If unconfirmed: state so and include in Missing Inputs Needed

**Leadership and Seniority**: Bullet list of principals, partners, senior attorneys, lead practitioners, or equivalent senior roles who directly deliver core services. For each:
- Full name and title
- 1 to 2 sentence role summary (responsibilities, relevance to approvals, service delivery, operations, marketing)
- Link to authoritative profile page (prefer client's own website bio; use LinkedIn only if no owned profile exists). The link must be a full URL on its own line below the role summary.

**Completeness requirement**: Fetch the client's website team/attorneys page directly and list every person found there. Cross-reference with intake documents. If the website lists someone not mentioned in documents, include them. If documents mention someone not on the website, include them and note the discrepancy. Do not rely solely on names found in intake documents; the website team page is the authoritative roster.

Classification: if a person holds a title like Attorney, Managing Attorney, Senior Attorney, Partner, Lead Provider, or equivalent, they belong here even if they also handle operational tasks. Do NOT include administrators, firm managers, intake staff, coordinators, or support staff (those go under Other Key Roles).

**Other Key Roles and Operational Leadership**: Roles influencing approvals, intake, scheduling, operations, customer experience, or delivery quality. If names unknown, list role and state "Name not provided."

**Locations**: All known locations as bullets. Check intake documents first, then verify against the client's website (footer, contact page, locations page) for any additional addresses not mentioned in documents. If location-based does not apply, define the delivery model (virtual, service area, by appointment, nationwide shipping).

**Targeting**: Bullet list of primary geography, secondary geography, and key audience/segment focus (only if explicitly stated).

**Primary Offerings**: List what the client currently sells or provides based on available documents.

**Current Website**: Canonical primary URL. If multiple sites, list Primary and Secondary with a one-line purpose for each.

**Social Media Accounts**: Read and follow the **Social Media Discovery Protocol** in `references/social-media-discovery-protocol.md`. This protocol covers the complete search, verification, and output process for all six platforms (Facebook, Instagram, LinkedIn, YouTube, TikTok, X/Twitter).

**URL requirement**: Every platform in the output must have either a direct profile URL or "Not found." If a platform search returns no direct URL but the client's website footer links to that platform, fetch the website page to extract the actual destination URL. Never output a platform line without a URL unless the account genuinely does not exist.

**Approval Gate**:
```
Please review the 2.1 Client Details and share any edits, notes, or missing information.
If everything looks good, reply "Approved" to continue to the next section: 2.2 From the Client
```

---

## Step 2: Continue Section by Section

### Re-reading for Constrained Sections

Sections 3.4, 4.0, and 5.0 reference earlier approved sections as their only allowed sources. Before writing these, re-read the relevant sections from the working document — do not rely solely on conversation memory:
- Before 3.4: re-read 2.1, 3.1, and 3.3
- Before 4.0: re-read 2.1, 3.1, 3.2 Audiences Profiles, and 3.4
- Before 5.0: re-read 3.1, 3.2 Audiences Profiles, 3.3, and 3.4

---

### 2.2 From the Client

Three subsections derived ONLY from client documents:

**Client Goals**: Outcome statements (not tactics), rewritten for clarity. If none: "Not provided in available documents."

**Painpoints**: Current-state friction, constraints, risks, past disappointments. Rewritten for clarity. If none: "Not provided in available documents."

**Asks**: Must-haves, constraints, preferences, non-negotiables, approval constraints. Rewritten for clarity. If none: "Not provided in available documents."

**Approval Gate**:
```
Please review the 2.2 From the Client and share any edits, notes, or missing information.
If everything looks good, reply "Approved" to continue to the next section: 2.4 Digital Snapshot
```

### 2.4 Digital Snapshot

Compact performance data table from provided documents.

If SEO/keyword data: Keyword or Topic | Current Position | Search Volume (if provided) | Associated URL (if provided)

If analytics/paid media data: adapt columns (sessions, conversions, CPA, ROAS, etc.).

Do not invent metrics. If client wants to deprioritize something that performs well, note: "Client request: deprioritize despite performance."

**Approval Gate**:
```
Please review the 2.4 Digital Snapshot and share any edits, notes, or missing information.
If everything looks good, reply "Approved" to continue to the next section: 3.1 Brand Essentials
```

### 3.1 Brand Essentials

**Brand Values**: From client documents first. If not explicit, derive only from clear statements on owned channels. If unclear, request input at approval gate.

**Mission Statement**:
- Official version from documents or website: label "Mission Statement"
- If none found, draft from available documents and owned website language: label "Mission Statement (Draft)"
- 1 to 2 sentences, no new claims or unverifiable superlatives

**Brand Differentiators**: Defensible facts from documents or owned channels (credentials, capabilities, scope, proof signals, operating model, specialization). Format: "Label: short explanation." No subjective adjectives without support.

**Approval Gate**:
```
Please review the 3.1 Brand Essentials and share any edits, notes, or missing information.
If everything looks good, reply "Approved" to continue to the next section: 3.2 Audiences Selection
```

### 3.2 Audiences Selection (Step 1)

List potential audiences from documents and, if needed, reliable public sources aligned to the brand.

Source order: (1) client documents, (2) owned website, (3) reliable third-party sources.

Ground the list in what the client sells, who they serve, and market context from the brief. Do NOT write profiles yet.

Format: Audience Name | One-sentence rationale | Evidence source type (Documents, Owned Website, Public Source)

**Approval Gate**:
```
Please review the 3.2 Audiences Selection and share any edits, notes, or missing information.
If everything looks good, reply "Approved" to continue to the next section: 3.2 Audiences Profiles
```

### 3.2 Audiences Profiles (Step 2)

Create profiles only for user-approved audiences (up to 3).

Read and follow the **Audience Profile Research Protocol** in `references/audience-profile-protocol.md`.

**Parallelization**: When building multiple audience profiles, use subagents (Task tool) to research each audience in parallel. Each subagent should:
1. Read `references/audience-profile-protocol.md`
2. Perform the third-party research for its assigned audience
3. Return the structured profile

Compile all returned profiles into the section output.

Each profile structure:
1. **Demographics**: Geography, life stage, professional role, urgency context, qualifiers
2. **Mindset**: What they are protecting, seeking, fearing, or motivated by
3. **Attitude**: How they evaluate options, what they demand, what they reject
4. **Perception**: What must be true for trust; how they identify authority or safety
5. **Evidence**: 2-3 plain-text source URLs

**Approval Gate**:
```
Please review the 3.2 Audiences Profiles and share any edits, notes, or missing information.
If everything looks good, reply "Approved" to continue to the next section: 3.3 Competitors
```

### 3.3 Competitors

Up to 6 competitor profiles.

Read and follow the **Competitor Profile Research Protocol** in `references/competitor-profile-protocol.md`.

**Parallelization**: Use subagents (Task tool) to research competitors in parallel. For example, spawn 2 subagents each researching 3 competitors, or 3 subagents each researching 2. Each subagent should:
1. Read `references/competitor-profile-protocol.md`
2. Perform search and validation for its assigned competitors
3. Return the structured profiles

Compile all returned profiles into the section output.

Prefer competitor lists from client or SEO materials. If missing, identify competitors using search visibility for priority terms plus market prominence.

For each competitor:
- **Name**: Official brand or firm name
- **URL**: Most relevant page (non-ad)
- **Positioning**: 2 to 4 sentences on how they present themselves — their messaging, stated value proposition, and who they appear to target. This is what they claim, observed from their own channels.
- **Proof Signals**: 2 to 5 concrete credibility indicators verified through third-party sources only (review platforms, licensing boards, media coverage, professional associations). Never cite the competitor's own website as proof.

Do not editorialize. Maintain the distinction between positioning (what they say) and proof (what can be verified).

**Approval Gate**:
```
Please review the 3.3 Competitors and share any edits, notes, or missing information.
If everything looks good, reply "Approved" to continue to the next section: 3.4 Market Differentiators
```

### 3.4 Market Differentiators

**Allowed Sources**: ONLY facts from sections 2.1, 3.1, and 3.3.

4 to 6 differentiators relative to the competitor set. No new facts. No recommendations.

**Verification requirement**: Apply the same positioning-vs-proof standard to the client's claims as was applied to competitors in 3.3. A differentiator is only valid if the client's claim is verified AND competitors cannot make the same verified claim. Shared verified claims are table stakes, not differentiators.

**Confidence scoring**: Each differentiator must include a confidence level:
- **Verified** — confirmed via Tier 1 or multiple Tier 2 sources for the client, and confirmed absent across competitors
- **Corroborated** — supported by Tier 2 source for the client, not evidenced by competitors
- **Unverified** — client claims this but no third-party confirmation yet. Flag for the user to confirm with the client.
- **Contradicted** — evidence conflicts with the client's claim. State what was found and flag for resolution.

Structure:
- **Differentiator Title**
- **Confidence**: Verified | Corroborated | Unverified | Contradicted
- **Client Claim**: What the client states or implies
- **Client Verification**: Source confirming or contradicting the claim
- **Competitor Landscape**: What competitors claim and what is verified for them
- **Why It Matters**: The strategic significance of this difference (factual, not a recommendation)

**Approval Gate**:
```
Please review the 3.4 Market Differentiators and share any edits, notes, or missing information.
If everything looks good, reply "Approved" to continue to the next section: 4.0 Brand Voice
```

### 4.0 Brand Voice

**Allowed Sources**: ONLY facts from 2.1, 3.1, 3.2 Audiences Profiles, and 3.4.

Summary paragraph plus bullet traits. Voice must match the client's real-world posture and audience expectations.

Traits include boundaries: "Trait: what it means, what it is not."

One closing sentence with "avoid" guidance tuned to industry context.

**Approval Gate**:
```
Please review the 4.0 Brand Voice and share any edits, notes, or missing information.
If everything looks good, reply "Approved" to continue to the next section: 5.0 Bright Idea
```

### 5.0 Bright Idea

**Allowed Sources**: ONLY facts from 3.1, 3.2 Audiences Profiles, 3.3, and 3.4.

**Bright Idea Title** plus **Bright Idea Summary**.

A unifying throughline connecting audience reality, credibility and proof, and market differentiators. Must remain grounded in established facts. No new claims, offers, promises, or strategic recommendations. No generic slogans. End with one sentence framing it as an organizing principle for future strategy, not the strategy itself.

**Final Approval Gate**:
```
Please review the 5.0 Bright Idea and share any edits, notes, or missing information.
If everything looks good, reply "Approved" to confirm completion of the Foundational Brief.
```

---

## Final Output

The document is built incrementally, so no compilation step is needed. After 5.0 is approved:
1. Final review pass for formatting consistency per `references/s3-docx-styles.md`
2. Save the completed brief to Google Drive:
   - Use the same client folder found in Step 0
   - Look for a `CREATIVE STRATEGY` subfolder inside the client folder (match case-insensitively: "Creative Strategy", "CREATIVE STRATEGY", etc.)
   - If the subfolder exists, save the brief there
   - If the subfolder does not exist, create a folder named `CREATIVE STRATEGY` inside the client folder, then save the brief there
   - If the folder already contains an older version of the foundational brief, save alongside it (do not overwrite) with the current date appended: `{Client Name}_Foundational_Brief_{YYYY-MM-DD}.docx`
3. Confirm the Foundational Brief is complete
4. Provide the Google Drive link to the saved document
5. Suggest: "To make this brief available as context in a Claude Project, add it to the relevant Project under Projects in the sidebar."

---

## Operating Rules

These rules govern every section of the brief:

**Facts only** — no recommendations, positioning, or strategy.

**Source priority** — intake documents first. Use web research when a required fact is missing. Prioritize owned channels, then credible third-party sources. Do not guess.

**No invention** — if a fact cannot be found, request it at the next approval gate.

**Immediate web research** — if a required field is missing from documents, search immediately. Do not defer to a later prompt.

**Web research proof** — sources as a single line with 1 to 3 URLs, no commentary. Do not output "Search Attempts" unless the user requests them. If unavailable: "Web research unavailable or failed."

**Constrained sections** — when "Allowed Sources" is specified, use only information from those referenced sections. No new facts in constrained sections.

**Format control** — follow the exact section order and headings specified. No invented fields or headings.

**Output cleanliness** — no code, HTML, debug text, placeholder fragments, Unicode dividers, or em dashes (use commas, colons, periods). No internal process narration: output only required sections and approval gates.

**Approval gate presentation** — present each section at the approval gate with full detail, including all URLs, profile links, and source citations. The user must be able to review the complete content before approving. However, when the user requests edits after the initial presentation, do NOT reprint the entire section. Confirm changes as short summaries and only reprint if the user explicitly asks to see the full section again.

---

## Reference Files

- **`references/s3-docx-styles.md`** — Read before creating the document and when appending sections. Defines all formatting (fonts, headings, colors, spacing, tables, bullets, dividers, labeled fields).
- **`references/audience-profile-protocol.md`** — Read before writing 3.2 Audiences Profiles. Research protocol for evidence-based audience profiles using credible third-party sources.
- **`references/competitor-profile-protocol.md`** — Read before writing 3.3 Competitors. Research protocol for competitor profiles by industry vertical.
- **`references/social-media-discovery-protocol.md`** — Read when writing the Social Media Accounts field in 2.1. Search, verification, and output protocol for all six platforms.
