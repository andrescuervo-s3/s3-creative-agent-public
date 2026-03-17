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

## Step 0: Startup and File Collection

When triggered, request client files:

```
Please upload any client files you have from this list:

- Creative Survey (Client Intake Questionnaire)
- Client Profile (Sales Turnover Document)
- Creative Notes
- Work Agreement (Partnership Proposal)
- SEO Keywords and Rankings

If you are missing any, we can still proceed, but the brief may be less complete.
Please let me know when you are ready to proceed and we will begin writing 1.0 Intro and 1.1 Cover.
```

If files are already uploaded, acknowledge and proceed. Read each file thoroughly: parse all rows/columns in spreadsheets, all pages in PDFs. Use Google Drive tools for shared links.

---

## Document Setup

After files are uploaded, before writing 1.0 Intro, create a working .docx file:
- Use the system docx skill. Read and follow `references/s3-docx-styles.md` before creating the document.
- Name it `{Client Name}_Foundational_Brief.docx` and save to the outputs folder.
- Build the document incrementally: append each approved section immediately after approval.

### After Each Approval

1. Append the approved section to the .docx, applying styles from `references/s3-docx-styles.md`
2. Confirm: "Section [NAME] has been added to the brief document."
3. Provide the document link
4. Proceed to write the next section

If the user requests edits, apply them, update the document, then proceed.

---

## Step 1: Write Initial Sections (1.0, 1.1, 2.1)

Write these three sections **in a single response**, then stop at the 2.1 approval gate.

### 1.0 Intro

2 to 4 sentences: define the brief as the evergreen, pre-initiation source of truth. State it informs downstream strategy and execution. State it is NOT the strategy document. Tone: professional, neutral, agency-grade.

### 1.1 Cover

- **Date**: Generation date (Month Day, Year)
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
- **Overview**: 2 to 4 sentences on emphasis and self-presentation
- **URL**: Most relevant page (non-ad)
- **Proof Signals**: 2 to 5 concrete credibility signals from competitor's site or trusted third-party sources

Do not editorialize.

**Approval Gate**:
```
Please review the 3.3 Competitors and share any edits, notes, or missing information.
If everything looks good, reply "Approved" to continue to the next section: 3.4 Market Differentiators
```

### 3.4 Market Differentiators

**Allowed Sources**: ONLY facts from sections 2.1, 3.1, and 3.3.

4 to 6 differentiators relative to the competitor set. Each must reference competitor patterns from 3.3. No new facts. No recommendations.

Structure:
- **Pattern Title**
- **Pattern Summary** (what competitors do)
- **Client Difference and Why It Matters**

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
2. Confirm the Foundational Brief is complete
3. Provide the final document link

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

**Approval gate presentation** — present each section at the approval gate exactly as it will appear in the final document, including all URLs, profile links, and source citations. Do not summarize, abbreviate, or strip detail from the chat presentation. The user must be able to review the complete content before approving.

---

## Reference Files

- **`references/s3-docx-styles.md`** — Read before creating the document and when appending sections. Defines all formatting (fonts, headings, colors, spacing, tables, bullets, dividers, labeled fields).
- **`references/audience-profile-protocol.md`** — Read before writing 3.2 Audiences Profiles. Research protocol for evidence-based audience profiles using credible third-party sources.
- **`references/competitor-profile-protocol.md`** — Read before writing 3.3 Competitors. Research protocol for competitor profiles by industry vertical.
- **`references/social-media-discovery-protocol.md`** — Read when writing the Social Media Accounts field in 2.1. Search, verification, and output protocol for all six platforms.
