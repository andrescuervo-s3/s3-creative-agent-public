# Foundational Brief: Section Templates

Purpose: Defines the structure, fields, and formatting for every section of the Foundational Brief. The orchestrator references this file when writing each section. Research agents reference it for output structure expectations.

---

## 1.0 Intro

Write 2 to 4 sentences:
- Define the brief as the evergreen, pre-initiation source of truth for the client
- State it informs downstream strategy and execution
- State it is NOT the strategy document and does not define recommendations, positioning, creative direction, or messaging decisions
- Tone: professional, neutral, agency-grade

---

## 1.1 Cover

A simple cover block with these fields:

- **Status**: DRAFT (black outline badge) or FINAL (black fill badge)
- **Date Created**: The generation date (Month Day, Year)
- **Last Updated**: Same as Date Created initially; updated on subsequent edits
- **Client**: Use the primary brand name from intake documents. If both a legal entity name and a public-facing brand name exist, show both (only include both if explicitly provided)

---

## 2.1 Client Details

Output the following fields in this exact order:

**Name**: Primary brand name exactly as it appears in intake documents and on the client's owned channels.

**Year Founded**:
- Check intake documents first
- If missing, perform web research: client's owned website (About page, Our Story, footer). Only accept a year if the site explicitly states "Founded," "Established," or "Since"
- If the owned website does not state a founding year, check official state business filings (e.g., Sunbiz.org for Florida, Secretary of State databases)
- Do NOT use copyright dates, domain registration dates, page publish dates, "years of experience," or third-party directory listings
- Do NOT use a founding attorney's career start date or bar admission year unless documents explicitly state the firm was founded that year
- Output a single year with confidence score per confidence-scoring-spec.md
- If multiple sources conflict, output "Unconfirmed" and include in Missing Inputs Needed

**Organizational Structure**:
1. Extract from provided documents (ownership model, entity type, locations, brand architecture, leadership structure)
2. If unclear, check the client's owned website (About, Team, Our Story, Leadership, Locations, Careers, footer legal text)
3. If still unclear, run targeted web searches
4. Write a short paragraph describing ownership and operating model
5. If unconfirmed, state so and include in Missing Inputs Needed

**Leadership and Seniority**: Bullet list of key senior leaders only. For each leader:
- Full name
- Title
- 1 to 2 sentence role summary
- Link to authoritative profile page (prefer client's own website bio; use LinkedIn only as fallback)

Classification: If a person holds a title like Attorney, Managing Attorney, Senior Attorney, Partner, Lead Provider, or equivalent, they belong here. The test is whether they are a senior practitioner delivering the client's core service.

Do NOT include administrators, firm managers, intake staff, coordinators, or support staff. Those belong under Other Key Roles.

**Other Key Roles and Operational Leadership**: List roles that influence approvals, intake, scheduling, operations, customer experience, or delivery quality. If names are unknown, list the role and state "Name not provided."

**Locations**: List all known locations as bullets. If location-based does not apply, define the delivery model (virtual, service area, by appointment, nationwide shipping).

**Targeting**: Bullet list:
- Primary geography
- Secondary geography
- Key audience or segment focus (only if explicitly stated)

**Primary Offerings**: List what the client currently sells or provides, based on available documents.

**Current Website**: Canonical primary URL. If multiple sites exist, list Primary and Secondary with a one-line purpose for each.

**Social Media Accounts**: Output from the social-media-discovery-agent.md. All 6 platforms listed as a vertical stack:

```
Platform: URL (Verification Label)
```

Verification labels: Confirmed Official, Probable Official, Personal / Brand-Adjacent, Not found.

---

## 2.2 From the Client

Three subsections, derived ONLY from client documents:

**Client Goals**: Write goals as outcome statements, not tactics. Rewrite for clarity without changing intent. If none present: "Not provided in available documents."

**Painpoints**: Capture current-state friction, constraints, risks, or past disappointments, exactly as evidenced by documents. Rewrite for clarity without changing intent. If none present: "Not provided in available documents."

**Asks**: Capture must-haves, constraints, preferences, non-negotiables, and approval constraints, only when evidenced by documents. Rewrite for clarity without changing intent. If none present: "Not provided in available documents."

---

## 2.3 Digital Snapshot

A compact performance table from provided documents or fallback research.

**When client provides SEO/keyword data**: Use columns: Keyword or Topic | Current Position or Visibility Metric | Search Volume (if provided) | Associated URL (if provided)

**When client provides analytics or paid media data**: Adapt columns to reflect those metrics (sessions, conversions, CPA, ROAS, etc.).

**When no client data exists**: Execute the seo-digital-research-agent.md fallback protocol. All metrics from fallback research must carry confidence scores.

Do not invent metrics. If the client explicitly wants to deprioritize something that performs well, add one short note: "Client request: deprioritize despite performance."

---

## 3.1 Brand Essentials

**Brand Values**: Use client-provided values from documents first. If not explicitly provided, only derive from clear statements on owned channels. If unclear, request input at the approval gate.

**Mission Statement**:
- If an official mission statement exists in documents or on the client's website, use it as written and label exactly: "Mission Statement"
- If none found, write a mission statement based strictly on available documents and owned website language, and label exactly: "Mission Statement (Draft)"
- 1 to 2 sentences
- Do not introduce new claims, promises, outcomes, or unverifiable superlatives
- Tone: clear, factual, client-appropriate

**Brand Differentiators**: Each must be defensible and based on facts from documents or owned channels (credentials, capabilities, scope, proof signals, operating model, unique specialization). Write as: "Differentiator label: short explanation." Avoid subjective adjectives without support.

**Brand Voice (Observed)**: Observe the client's actual communication style across their website, social media, and any provided content samples. Write:
- One summary paragraph describing the observed voice and tone
- Bullet traits with boundaries, formatted as: "Trait: what it means, what it is not"
- One closing sentence with "avoid" guidance tuned to the industry context

This subsection captures what the brand voice IS based on observation, not what it SHOULD BE. Strategy comes later.

---

## 3.2 Audiences

### Step 1: Audience Selection

Output a list of potential audiences derived from documents and, if needed, reliable public sources aligned to the brand.

Source order:
1. Provided client documents
2. Client owned website language
3. Reliable third-party sources (only to round out obvious audiences in the category)

Output format: Each item includes Audience Name, one-sentence rationale, and evidence source type (Documents, Owned Website, Public Source).

The user selects up to 3 audiences to profile.

### Step 2: Audience Profiles

Execute the audience-research-agent.md for each selected audience. Each profile uses this structure:

1. **Demographics**: Geography, life stage, professional role, urgency context, relevant qualifiers
2. **Mindset**: What they are protecting, seeking, fearing, or motivated by
3. **Attitude**: How they evaluate options, what they demand, what they reject
4. **Perception**: What must be true for trust to form; how they identify authority or safety
5. **Evidence**: Claim-to-source mapping (not a vague list). Each significant claim maps to its source URL with a confidence score.

---

## 3.3 Competitors

Up to 6 competitor profiles from the competitor-research-agent.md. Segmented by audience channel:

### B2B Competitors (if applicable)
Competitors targeting the client's B2B audience channel (referral sources, partners, professional buyers).

### B2C Competitors (if applicable)
Competitors targeting the client's direct consumer audience channel.

For each competitor:
- **Name**: Official brand or firm name
- **Source of Identification**: How this competitor was found (client docs, SEO discovery, independent search)
- **Overview**: 2 to 4 sentences describing what they emphasize and how they present themselves
- **URL**: Most relevant page (non-ad URL)
- **Proof Signals**: 2 to 5 concrete credibility signals with confidence scores

Must include independently discovered competitors, not just client-named ones.

---

## 3.4 Market Differentiators

**Allowed Sources**: Use ONLY facts already stated in sections 2.1, 3.1, and 3.3.
**Competitive Set**: List the competitors from 3.3 that this analysis draws from.

4 to 6 differentiators written relative to the competitor set. Each must reference the competitor pattern established in 3.3. Do not introduce new facts. Do not make recommendations.

Structure each differentiator with show-your-work confidence:

- **Pattern Title**
- **Pattern Summary**: What the competitors do (cite specific competitors from 3.3)
- **Client Difference and Why It Matters**: How the client differs, with confidence score
- **Evidence Trail**: Claim, Source (section reference), Score

---

## Removed Sections

The following sections from earlier versions are no longer part of the Foundational Brief:

- **4.0 Brand Voice** (standalone): Folded into 3.1 Brand Essentials as "Brand Voice (Observed)" subsection
- **5.0 Bright Idea**: Moves to a future Strategy Brief skill

---

## Heading Hierarchy

- **H1**: Major section groups: 1.0 Intro, 2.0 Client Overview, 3.0 The Brand
- **H2**: Subsections: 2.1 Client Details, 2.2 From the Client, 2.3 Digital Snapshot, 3.1 Brand Essentials, 3.2 Audiences, 3.3 Competitors, 3.4 Market Differentiators
- **H3**: Named sub-blocks: competitor names, audience profile names, differentiator pattern titles, Brand Voice (Observed)
- **H4**: Profile sub-categories: Demographics, Mindset, Attitude, Perception

## Formatting Standards

- Bold for field labels and key phrases within body text
- Clickable hyperlinks for all URLs
- Horizontal rules between major sections
- Bullet lists only where the section template calls for them
- No em dashes; use commas, colons, or periods
- No code, HTML, or debug output in brief content
- Clean, modern, agency-grade, client-ready appearance
