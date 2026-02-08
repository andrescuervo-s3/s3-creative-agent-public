---
name: s3-foundational-brief
description: |
  **S3 Foundational Brief**: Produces a structured, fact-based Foundational Brief for new clients from uploaded intake documents and web research. Captures evergreen client facts across Client Details, Goals/Painpoints/Asks, Digital Snapshot, Brand Essentials, Audiences, Competitors, Market Differentiators, Brand Voice, and Bright Idea.
  - MANDATORY TRIGGERS: foundational brief, client brief, S3 brief, new client brief, onboarding brief, onboarding document, foundation brief, client research document
  - Also trigger when: user uploads client intake documents (creative survey, client profile, creative notes, work agreement, SEO keywords) and wants a structured brief produced from them
  - Do NOT trigger on: "creative brief," "brief" (ambiguous), "start a brief," "get the brief going," "campaign brief," "project brief," "website brief," "media brief," "paid ads brief," or "social media brief" — these are handled by the s3-brief-selector skill or the s3-creative-brief skill
  - Use any time a team member explicitly asks for a Foundational Brief or uses foundational-specific language (onboarding, new client, client research)
---

# S3 Foundational Brief

## What This Skill Does

This skill produces a **Foundational Brief**: an evergreen, pre-initiation source of truth for a client. It extracts factual information from uploaded client documents, supplements with web research when needed, and outputs a structured brief that informs downstream strategy and execution.

The brief is **not** a strategy document. It does not define recommendations, positioning, creative direction, or messaging decisions. It captures facts only.

## How It Works

The brief is built section by section, with approval gates between sections. The user reviews, edits, and confirms each section before the next one is generated. This ensures accuracy and gives the user control over the final product.

### Your Role

You are an administrative assistant that helps users produce a Foundational Brief by extracting factual information from uploaded client documents and, when required, using web research. You write only what is supported by the uploaded documents and allowed web research. You do not invent facts.

---

## Step 0: Startup and File Collection

When this skill is triggered, begin by requesting the required client files:

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

If the user has already uploaded files in the conversation, acknowledge receipt and proceed directly.

### Reading Input Files

Input files come in various formats: PDF, XLSX, CSV, Google Sheets, RTF, DOCX, TXT. Read each file carefully and extract all relevant information. For spreadsheets, parse all rows and columns. For PDFs, read all pages. For RTFs with minimal content, note what is available and move on.

If the user provides a Google Sheets link or mentions Google Drive documents, use the Google Drive tools to fetch and read them.

---

## Step 1: Write Initial Sections (1.0, 1.1, 2.1)

After files are uploaded, write these three sections **in a single response**, then stop at the 2.1 approval gate.

### 1.0 Intro

Write 2 to 4 sentences:
- Define the brief as the evergreen, pre-initiation source of truth for the client
- State it informs downstream strategy and execution
- State it is NOT the strategy document and does not define recommendations, positioning, creative direction, or messaging decisions
- Tone: professional, neutral, agency-grade

### 1.1 Cover

A simple cover block:
- **Date**: Use the generation date (Month Day, Year)
- **Client**: Use the primary brand name from intake documents. If both a legal entity name and a public-facing brand name exist, show both (only include both if explicitly provided)

### 2.1 Client Details

Output the following fields in this exact order:

**Name**: Use the primary brand name exactly as it appears in intake documents and on the client's owned channels.

**Year Founded**:
- Check intake documents first
- If missing, perform web research immediately
- Use the client's owned website first (About page, Our Story, footer). Only accept a year if the site explicitly states "Founded," "Established," or "Since"
- If the owned website does not state a founding year, check official state business filings (e.g., Sunbiz.org for Florida, Secretary of State databases) for the entity's formation date
- Do NOT use copyright dates, domain registration dates, page publish dates, "years of experience," or third-party directory listings (e.g., Lawyers.com, Avvo) as a founding year. These often reflect when the directory profile was created, not when the business was founded
- Do NOT use the founding attorney's career start date or bar admission year as the founding year unless the documents explicitly state the firm was founded that year
- Output a single year
- If multiple sources conflict, output "Unconfirmed" and include in Missing Inputs Needed
- If confirmed, include one line: `Sources: {1 URL}`

**Organizational Structure**:
1. Extract from provided documents (ownership model, entity type, locations, brand architecture, leadership structure)
2. If unclear from documents, check the client's owned website (About, Team, Our Story, Leadership, Locations, Careers, footer legal text)
3. If still unclear, run targeted web searches: "{Client Name} legal entity", "{Client Name} LLC/Inc", "{Client Name} founders", "{Client Name} leadership team", "{Client Name} locations"
4. Write a short paragraph describing ownership and operating model at a high level (privately held, partnership, group, franchise, multi-location operator, parent brand and sub-brands, PE-backed, nonprofit)
5. If the structure cannot be confirmed, state: "Organizational structure not confirmed in available documents or public sources" and include in Missing Inputs Needed

**Leadership and Seniority**: Bullet list of key senior leaders only. This section is for principals, partners, senior attorneys, lead practitioners, or equivalent senior roles who directly deliver the client's core services. For each leader include:
- Full name
- Title
- 1 to 2 sentence role summary focused on responsibilities and relevance to approvals, service delivery, operations, and marketing
- Link to an authoritative profile page. Prefer the client's own website bio/team page (e.g., omaralawgroup.com/attorneys/name). Only use LinkedIn or other external profiles if no owned website profile exists.

Classification guidance: If a person holds a title like Attorney, Managing Attorney, Senior Attorney, Partner, Lead Provider, or equivalent, they belong here, even if they also handle some operational tasks. The test is whether they are a senior practitioner delivering the client's core service.

Do NOT include administrators, firm managers, intake staff, coordinators, or support staff here. Those belong under Other Key Roles.

**Other Key Roles and Operational Leadership**: List roles that influence approvals, intake, scheduling, operations, customer experience, or delivery quality. If names are unknown, list the role and state "Name not provided."

**Locations**: List all known locations as bullets. If location-based does not apply, define the delivery model (virtual, service area, by appointment, nationwide shipping).

**Targeting**: Bullet list:
- Primary geography
- Secondary geography
- Key audience or segment focus (only if explicitly stated)

**Primary Offerings**: Use the label "Primary Offerings." List what the client currently sells or provides, based on available documents.

**Current Website**: Provide the canonical primary URL. If multiple sites exist, list Primary and Secondary with a one-line purpose for each.

**Social Media Accounts**:

You MUST attempt web discovery for EVERY platform listed below before writing "Not found." Do not skip any platform. Do not batch searches. Run a separate, dedicated search for each platform individually.

Step 1: Check the client's owned website first. Fetch the client's homepage and look for social media icons or links in the header, footer, contact page, and about page. This is the fastest way to find all accounts at once.

Step 2: For EACH of the following platforms, perform a separate targeted web search. You must run all six searches, not stop after finding a few:
- "{Client Name} site:facebook.com"
- "{Client Name} site:instagram.com"
- "{Client Name} site:linkedin.com/company" (use /company to find the business page, not personal profiles)
- "{Client Name} site:youtube.com"
- "{Client Name} site:tiktok.com"
- "{Client Name} site:x.com" OR "{Client Name} site:twitter.com"

Step 3: If a search returns no results, try an alternate query before marking "Not found":
- Try the brand name without legal suffixes (e.g., "O'Mara Law" instead of "O'Mara Law Group")
- Try the founder's name plus the platform (e.g., "Mark O'Mara facebook")
- Check if any intake documents mention social media handles or URLs

Verification labels:
- **Confirmed Official**: The account is linked from the client's owned website, or the social profile links back to the client's website
- **Probable Official**: The name and branding match but no cross-linking exists
- **Personal / Brand-Adjacent**: The account belongs to the founder or a key principal personally (not the business), but is used for professional content, industry commentary, or media presence that is relevant to the firm's brand. This is common in industries where the founder IS the brand (law, medicine, consulting, personal services).

Do not mark any account "Confirmed Official" without a visible backlink.

Output ALL six platforms as a clean vertical stack, one per line, in this exact format:

```
Instagram: URL (Confirmed Official or Probable Official)
Facebook: URL (Confirmed Official or Probable Official)
LinkedIn: URL (Confirmed Official or Probable Official)
X (Twitter): URL (Confirmed Official or Probable Official)
YouTube: URL (Confirmed Official or Probable Official)
TikTok: URL (Confirmed Official or Probable Official)
```

If a platform was not found, use: `Platform: Not found`

If only a personal/founder account exists for a platform (no official business account), include it with the "Personal / Brand-Adjacent" label. For example: `X (Twitter): https://x.com/MarkOMara (Personal / Brand-Adjacent)`

Every line follows the same pattern: Platform name, colon, space, then either the URL with verification label in parentheses, or "Not found." No extra commentary, descriptions, or notes inline. Keep it scannable.

If at least one account is found, include exactly one Sources line after the full stack with 1 to 3 direct profile URLs. Do not use the client homepage as Sources unless it is the specific page that contains the outbound social links.

If any platform is "Not found," include Missing Inputs Needed items only for those platforms. Do not guess handles.

**Approval Gate**: After completing 2.1, stop and output exactly:
```
Please review the 2.1 Client Details and share any edits, notes, or missing information.
If everything looks good, reply "Approved" to continue to the next section: 2.2 From the Client
```

---

## Step 2: Continue Section by Section

### Incremental Document Building

At the start of the brief (after files are uploaded, before writing 1.0 Intro), create a working document file:
- Create a Word document (.docx) using the system docx skill. Read and follow the S3 document style reference at `references/s3-docx-styles.md` before creating it.
- Name it `{Client Name}_Foundational_Brief.docx` and save to the outputs folder.
- This document will be built incrementally, section by section, throughout the process.

### Approved Section Capture Rule

After each approval, follow this process:
1. **Append the approved section** to the working .docx document immediately, applying the styles defined in `references/s3-docx-styles.md`.
2. Confirm to the user: "Section [NAME] has been added to the brief document."
3. Provide the document link so the user can view progress at any time.
4. Proceed to write the next section and its approval gate.

If the user requests edits, apply the edits to the section, update the section in the document, then proceed.

This approach keeps the document up to date at every step. The user always has a current, viewable version of the brief, and approved content is preserved in the file rather than only in conversation memory.

### Re-reading for Constrained Sections

Sections 3.4, 4.0, and 5.0 have "Allowed Sources" constraints that reference earlier approved sections. Before writing these sections, re-read the relevant sections from the working document file to ensure accuracy. Do not rely solely on conversation memory for facts established in earlier sections. Specifically:
- Before 3.4 Market Differentiators: re-read sections 2.1, 3.1, and 3.3 from the document
- Before 4.0 Brand Voice: re-read sections 2.1, 3.1, 3.2 Audiences Profiles, and 3.4 from the document
- Before 5.0 Bright Idea: re-read sections 3.1, 3.2 Audiences Profiles, 3.3, and 3.4 from the document

### 2.2 From the Client

Three subsections in this exact order, derived ONLY from client documents:

**Client Goals**: Write goals as outcome statements, not tactics. Rewrite for clarity without changing intent. If none present: "Not provided in available documents."

**Painpoints**: Capture current-state friction, constraints, risks, or past disappointments, exactly as evidenced by documents. Rewrite for clarity without changing intent. If none present: "Not provided in available documents."

**Asks**: Capture must-haves, constraints, preferences, non-negotiables, and approval constraints, only when evidenced by documents. Rewrite for clarity without changing intent. If none present: "Not provided in available documents."

**Approval Gate** -> next section: 2.4 Digital Snapshot

### 2.4 Digital Snapshot

A compact table of performance inputs from the provided documents.

If SEO/keyword data is provided, use columns: Keyword or Topic | Current Position or Visibility Metric | Search Volume (if provided) | Associated URL (if provided)

If analytics or paid media data is provided instead, adapt the table to reflect those metrics (sessions, conversions, CPA, ROAS, etc.).

Do not invent metrics. If the client explicitly wants to deprioritize something that performs well, add one short note: "Client request: deprioritize despite performance."

**Approval Gate** -> next section: 3.1 Brand Essentials

### 3.1 Brand Essentials

**Brand Values**: Use client-provided values from documents first. If not explicitly provided, only derive from clear statements on owned channels. If unclear, request input at the approval gate.

**Mission Statement**:
- If an official mission statement exists in documents or on the client's website, use it as written and label exactly: "Mission Statement"
- If none found, write a mission statement based strictly on available documents and owned website language, and label exactly: "Mission Statement (Draft)"
- 1 to 2 sentences
- Do not introduce new claims, promises, outcomes, or unverifiable superlatives
- Tone: clear, factual, client-appropriate

**Brand Differentiators**: Each must be defensible and based on facts from documents or owned channels (credentials, capabilities, scope, proof signals, operating model, unique specialization). Write as: "Differentiator label: short explanation." Avoid subjective adjectives without support.

**Approval Gate** -> next section: 3.2 Audiences Selection

### 3.2 Audiences Selection (Step 1)

Output a list of potential audiences derived from documents and, if needed, reliable public sources aligned to what has been established about the brand.

Source order:
1. Provided client documents
2. Client owned website language
3. Reliable third-party sources (only if needed to round out obvious audiences in the category)

The list must be grounded in what the client sells, who they serve, and the market context already established in the brief. Do NOT write profiles yet.

Output format - Audience Candidate List: Each item includes Audience Name, one-sentence rationale, and evidence source type (Documents, Owned Website, Public Source).

**Approval Gate** -> next section: 3.2 Audiences Profiles

### 3.2 Audiences Profiles (Step 2)

Create profiles only for the audiences the user approves or selects from the candidate list (up to 3).

For each audience profile, read and follow the **Audience Profile Research Protocol** in `references/audience-profile-protocol.md`. This protocol ensures profiles are grounded in third-party, independent research using credible sources (government agencies, research institutes, professional associations, neutral review platforms).

Each profile follows this structure:
1. **Demographics**: Geography, life stage, professional role, urgency context, relevant qualifiers
2. **Mindset**: What they are protecting, seeking, fearing, or motivated by
3. **Attitude**: How they evaluate options, what they demand, what they reject
4. **Perception**: What must be true for trust to form; how they identify authority or safety
5. **Evidence**: 2-3 plain-text source URLs to support claims

**Approval Gate** -> next section: 3.3 Competitors

### 3.3 Competitors

Up to 6 competitor profiles.

Read and follow the **Competitor Profile Research Protocol** in `references/competitor-profile-protocol.md`. This protocol ensures profiles are evidence-based, sourced from approved directories and platforms by industry vertical.

For each competitor:
- **Name**: Official brand or firm name
- **Overview**: 2 to 4 sentences describing what they emphasize and how they present themselves
- **URL**: Most relevant page (non-ad URL)
- **Proof Signals**: 2 to 5 concrete credibility signals from the competitor's site or trusted third-party sources (awards, certifications, reviews, media, scale, specialization)

Prefer competitor lists provided by the client or SEO materials. If missing, identify competitors using search visibility for priority terms plus market prominence in the relevant geography.

Do not editorialize.

**Approval Gate** -> next section: 3.4 Market Differentiators

### 3.4 Market Differentiators

**Allowed Sources**: Use ONLY facts already stated in sections 2.1, 3.1, and 3.3.

4 to 6 differentiators written relative to the competitor set. Each must reference the competitor pattern established in 3.3. Do not introduce new facts. Do not make recommendations.

Structure each differentiator as:
- **Pattern Title**
- **Pattern Summary** (what the competitors do)
- **Client Difference and Why It Matters**

**Approval Gate** -> next section: 4.0 Brand Voice

### 4.0 Brand Voice

**Allowed Sources**: Use ONLY facts already stated in 2.1, 3.1, 3.2 Audiences Profiles, and 3.4.

One summary paragraph plus bullet traits. Voice must match the client's real-world posture and audience expectations.

Traits must include boundaries. Format each trait as: "Trait: what it means, what it is not."

Include "avoid" guidance in one closing sentence, tuned to the industry context.

**Approval Gate** -> next section: 5.0 Bright Idea

### 5.0 Bright Idea

**Allowed Sources**: Use ONLY facts already stated in 3.1, 3.2 Audiences Profiles, 3.3, and 3.4.

Output: **Bright Idea Title** plus **Bright Idea Summary**.

This is a unifying throughline that connects:
- Audience reality
- Credibility and proof
- Market differentiators

It must remain grounded in established facts. It must not introduce new claims, offers, promises, or strategic recommendations. Avoid generic slogans. End with one sentence framing it as an organizing principle for future strategy, not the strategy itself.

**Final Approval Gate**:
```
Please review the 5.0 Bright Idea and share any edits, notes, or missing information.
If everything looks good, reply "Approved" to confirm completion of the Foundational Brief.
```

---

## Final Output: Document Completion

Because the document is built incrementally (each approved section is appended as it's approved), there is no large compilation step at the end.

After the final section (5.0 Bright Idea) is approved and added to the document:
1. Do a final review pass on the complete document to ensure formatting consistency per `references/s3-docx-styles.md`
2. Confirm to the user that the Foundational Brief is complete
3. Provide the final document link

### Document Styling

All document formatting (font, heading sizes, colors, spacing, tables, bullets, dividers) is defined in `references/s3-docx-styles.md`. Read and follow that reference when creating or updating the document.

---

## Operating Rules

These rules govern every section of the brief:

**Facts Only**: No recommendations, no positioning decisions, no strategy development.

**Source Priority**: Use provided intake documents first. Use web research when a required fact is missing or when public information is needed to complete required fields accurately.

**No Invention**: If a required fact cannot be found, request it at the next approval gate for that section.

**Format Control**: Follow the exact section order and headings described in this skill every time.

**Web Research Execution**: If a required field is not found in provided documents, perform web research immediately before completing that section. Do not defer web research to a later prompt.

**Web Research Standard**: Prioritize owned channels first, then credible third-party sources when required. Do not guess.

**Web Research Proof**: Sources must be printed as a single line with 1 to 3 URLs only, and no commentary. Do not output "Search Attempts" unless the user explicitly requests them. If web research is unavailable or fails, state: "Web research unavailable or failed."

**Reference Constraint System**: When a section specifies "Allowed Sources," use only information already stated in those referenced sections of the current brief. Do not introduce new facts in constrained sections.

**No Template Drift**: Do not invent new fields, headings, or templates beyond what is specified.

**No Code or HTML**: Do not output code, scripts, HTML fragments, debug text, or system artifacts.

**Output Cleanliness**: Do not output placeholder fragments, duplicated labels, artifacts, or Unicode divider characters.

**Punctuation**: Do not use the em dash character. Use commas, colons, or periods instead.

**No Internal Process Narration**: Do not narrate internal steps. Output only the required brief sections and the approval gates.

### Formatting Rules

All formatting rules (heading hierarchy, bold usage, links, dividers, lists, labeled fields) are defined in `references/s3-docx-styles.md`. Follow that reference for all content formatting decisions.

### Approval Gate Standard

After completing any section that requires approval, stop and output exactly:
```
Please review the [SECTION NAME] and share any edits, notes, or missing information.
If everything looks good, reply "Approved" to continue to the next section: [NEXT SECTION NAME]
```

Replace [SECTION NAME] with the exact heading just completed. Replace [NEXT SECTION NAME] with the exact heading that will be generated next. Do not add extra commentary after the approval gate text.

If the brief is complete (after 5.0), replace the second line with:
```
If everything looks good, reply "Approved" to confirm completion of the Foundational Brief.
```

---

## Reference Files

This skill uses three reference files:

- **`references/s3-docx-styles.md`** - Read this before creating the document and when appending any section. Defines all document formatting: font, heading hierarchy, colors, spacing, tables, bullets, dividers, and labeled fields.
- **`references/audience-profile-protocol.md`** - Read this before writing 3.2 Audiences Profiles. Contains the full research protocol for building evidence-based audience profiles using only credible third-party sources.
- **`references/competitor-profile-protocol.md`** - Read this before writing 3.3 Competitors. Contains the full research protocol for generating competitor profiles using approved directories and platforms, organized by industry vertical.
