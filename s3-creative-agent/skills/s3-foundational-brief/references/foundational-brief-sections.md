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

**S3 Service Overview**: A table summarizing what Studio 3 provides for this client. Columns: Service | Details | Website. Derive from the work agreement, sales turnover document, or other intake docs. If no service details are available, state "S3 service details not provided in available documents."

**Social Media Accounts**: Output from the social-media-discovery-agent.md as a table:

| Platform | Handle/URL | Notes | Status |
|----------|-----------|-------|--------|
| Facebook | URL | Follower count, activity | Verified / Not Found |
| Instagram | URL | Follower count, post count | Verified / Not Found |
| LinkedIn | URL | Company page | Verified / Not Found |
| YouTube | URL | Content type | Verified / Not Found |
| TikTok | URL | | Verified / Not Found |
| X (Twitter) | URL | | Verified / Not Found |

Status values: Verified (backlink confirmed), Probable (name/branding match, no backlink), Personal/Brand-Adjacent, Not Found.

If a platform is found, the URL in the table IS the citation. If not found, "Not Found" is the answer. No separate narrative research log is needed for social media. The table is the log.

---

## 2.2 From the Client

Five subsections, derived ONLY from client documents:

**Client Goals**: Write goals as outcome statements, not tactics. Rewrite for clarity without changing intent. If none present: "Not provided in available documents."

**Painpoints**: Capture current-state friction, constraints, risks, or past disappointments, exactly as evidenced by documents. Rewrite for clarity without changing intent. If none present: "Not provided in available documents."

**Asks**: Capture must-haves, constraints, preferences, non-negotiables, and approval constraints, only when evidenced by documents. Rewrite for clarity without changing intent. If none present: "Not provided in available documents."

**Firm Backstory**: A short narrative (1-2 paragraphs) summarizing the client's origin story, culture, and how the current team came together. Derive only from client documents. If the client's documents do not include backstory, state: "Not provided in available documents."

**Business Model Notes**: Key operational details that inform strategy: how the client gets customers (referrals, advertising, organic, etc.), case management or CRM tools, revenue drivers, case/project volume, and any other structural details relevant to marketing. Derive only from client documents. If none present: "Not provided in available documents."

---

## 2.3 Digital Snapshot

A compact performance table from provided documents or fallback research.

**When client provides SEO/keyword data**: Use columns: Keyword or Topic | Current Position or Visibility Metric | Search Volume (if provided) | Associated URL (if provided)

**When client provides analytics or paid media data**: Adapt columns to reflect those metrics (sessions, conversions, CPA, ROAS, etc.).

**When no client data exists**: Execute the seo-digital-research-agent.md fallback protocol. All metrics from fallback research must carry confidence scores.

Do not invent metrics. If the client explicitly wants to deprioritize something that performs well, add one short note: "Client request: deprioritize despite performance."

**Research Log**: Do NOT include research logs in the output document. Research logs are internal working artifacts used during the research phase. The table above is the deliverable. The log stays in agent working memory only.

---

## 3.1 Brand Essentials

**Brand Values**: Present as a table. Each value gets its own row with a description.

| Value | Description |
|-------|-------------|
| [Value name] | What this means for the brand, how it shows up in their work |

Use client-provided values from documents first. If not explicitly provided, only derive from clear statements on owned channels. If unclear, request input at the approval gate.

**Mission Statement**:
- If an official mission statement exists in documents or on the client's website, use it as written and label exactly: "Mission Statement"
- If none found, write a mission statement based strictly on available documents and owned website language, and label exactly: "Mission Statement (Draft)"
- 1 to 2 sentences
- Do not introduce new claims, promises, outcomes, or unverifiable superlatives
- Tone: clear, factual, client-appropriate

**Brand Differentiators (Client-Reported)**: Each must be a brand-vs-brand differentiator: something that distinguishes this brand from competing brands in the same market. The test is: "Would this help us market against competitors?" Business structure details (entity type, ownership model, capital structure) belong in Organizational Structure (2.1), not here. If a fact does not help position the brand against competing brands, it is context, not a differentiator.

Each must be defensible and based on facts from documents or owned channels. Write as: "Differentiator label: short explanation." Avoid subjective adjectives without support. These are what the client claims, not independently verified. Verification happens in Market Differentiators.

**Brand Voice (Observed)**: Observe the client's actual communication style across their website, social media, and any provided content samples. Present as a table:

| Dimension | Observation |
|-----------|-------------|
| Tone | Description of how the brand sounds |
| Formality | Level of formality and when it shifts |
| Pronouns | How the brand refers to itself and the audience |
| Emotional Register | The emotional anchors and appeals used |
| Sentence Structure | How language is constructed (short/long, active/passive) |
| CTAs | How the brand asks people to take action |

If there is a gap between the observed voice and the client's stated brand attributes, present it as a styled callout (orange left border, light gray background, italic text). Label it clearly. Do not bury gap observations in body paragraphs where they get lost.

This subsection captures what the brand voice IS based on observation, not what it SHOULD BE. Strategy comes later.

---

## 3.2 Audiences

### Step 1: Audience Identification

Identify all relevant audiences from these sources, in this order:
1. Provided client documents (primary)
2. Client owned website language
3. Reliable third-party sources (only to round out obvious audiences in the category)

Output format: Each item includes Audience Name, one-sentence rationale, and evidence source type (Documents, Owned Website, Public Source).

Profile every relevant audience identified. Do not cap the number or ask the user to select. If the research is sound, the count will be naturally reasonable (typically 3-6). Audience targeting decisions belong in the Strategy Brief, not here.

### Step 2: Audience Profiles

Execute the audience-research-agent.md for each selected audience. Each profile uses this structure:

1. **Demographics**: Present as a bulleted list with bold labels, not a prose paragraph. Fields: Age, Gender split, Location, Context/life stage. One bullet per field. Dense demographic stats buried in paragraphs are unreadable.
2. **Mindset**: What they are protecting, seeking, fearing, or motivated by. 2-3 sentences max.
3. **Attitude**: How they evaluate options, what they demand, what they reject. 2-3 sentences max.
4. **Perception**: What must be true for trust to form; how they identify authority or safety. 2-3 sentences max.
5. **Sources**: A single source line at the end of the profile, not a table. Format is the styler's standard dashed `SOURCES` line: citations separated by `·`, each a live hyperlink.

**Do NOT put a Claim / Source / Confidence table inside the profile.** One evidence table per profile is what turned this brief into 36 pages. Every claim's provenance goes in the Evidence Register appendix, where it can be checked without interrupting the read.

**Research Log**: Do NOT include research logs in the output document. Research logs are internal working artifacts.

---

## 3.3 Competitors

Up to 6 competitor profiles from the competitor-research-agent.md.

### Channel Organization

Competitors MUST be organized by the client's audience channels. Determine from 2.1 which channel is the client's primary focus (B2B or B2C), and present that group first.

**If the client is primarily B2B**: B2B competitors first, then B2C.
**If the client is primarily B2C**: B2C competitors first, then B2B.
**If the client operates in only one channel**: No segmentation needed.

Label each group clearly with the audience channel and a one-sentence description of what "competing" means in that channel (e.g., "Firms competing for attorney referrals nationally" or "Firms competing for direct consumer leads in Atlanta").

### Profile Structure

For each competitor:
- **Name**: Official brand or firm name. Include [Client-Named] or [Independently Discovered] tag.
- **Channel**: Which audience channel this competitor competes in
- **Overview**: 2 to 4 sentences describing what they emphasize, their scale, and how they present themselves
- **URL**: [Firm homepage](URL) -- clickable link
- **Proof Signals**: 2 to 4 concrete credibility signals as bold-label bullets, not a table. One line each.
- **Relevance to Client**: 1-2 sentences on why this competitor matters to the client's competitive position
- **Sources**: One dashed `SOURCES` line at the end of the profile.

**Do NOT put a Signal / Source / Confidence table inside each competitor.** Provenance belongs in the Evidence Register appendix.

Must include independently discovered competitors, not just client-named ones. At least 2 from independent research.

**Research Log**: Do NOT include research logs in the output document. Research logs are internal working artifacts.

---

## 3.4 Market Differentiators

**Allowed Sources**: Use ONLY facts already stated in sections 2.1, 3.1, and 3.3.
**Competitive Set**: List the competitors from 3.3 that this analysis draws from.

4 to 6 differentiators written relative to the competitor set. Each must reference the competitor pattern established in 3.3. Do not introduce new facts. Do not make recommendations.

Structure each differentiator:

- **Pattern Title**: Short, descriptive name for the differentiator
- **Pattern Summary**: What the competitors do (cite specific competitors from 3.3 by name)
- **Client Difference and Why It Matters**: How the client differs, stated as fact
- **Sources**: One dashed `SOURCES` line naming the sections this draws from (e.g. `2.1 · 3.1 · 3.3`).

**Do NOT put an Evidence Trail table under each differentiator.** These claims are already stated and sourced in 2.1, 3.1, and 3.3. Repeating them in a table per differentiator is pure duplication.

---

## Appendix · Evidence Register

One table at the end of the document, after the Reference section. This is the only place a Claim / Source / Confidence table appears in a Foundational Brief.

| Section | Claim | Source | Confidence |
|---------|-------|--------|------------|
| 3.2 | [Claim as used in the body] | [Source title](URL) | Verified / Client-Reported |

Rules:

- **One table, not one per profile.** Rows are grouped by section number in document order.
- Include only claims that actually appear in the body. If a claim was researched but not used, it does not get a row.
- Confidence vocabulary is fixed: `Verified` or `Client-Reported`. No other values.
- If a claim has no URL, put the document name as plain text. Never `#`.
- The body must read completely without this appendix. It is for checking provenance, not for carrying meaning.

---

## Source Lines: One Per Numbered Section

A `SOURCES` line closes each **§-numbered section** (1.0, 2.1, 2.2, 2.3, 3.1, 3.2, 3.3, 3.4). Collect that section's citations into one line at its end.

**Never put a source line under an individual subsection, competitor, audience profile, or differentiator.** Each source line carries a dashed rule above it. One per named item produced 23 rules in a document that should have 8, chopping the page into strips. The approved design had 7.

Target: 8 to 10 source lines in the whole document. Above 12 means they are being attached to subsections.

## Heading Levels

| Level | Use |
|-------|-----|
| H1 | §-numbered sections only |
| H4 | Subsection labels (Demographics, Client Goals, Painpoints) |
| H3 | **Named items**: competitor names, audience profile names, differentiator pattern titles |

Named items must use H3. Rendering them at subsection or body weight flattens the hierarchy and the reader loses the structure.

## Length Discipline

The Foundational Brief targets **12 to 18 pages**, roughly **38,000 characters of body text**. The approved reference build was 37,800. A draft at 56,000 is half again too long even with the evidence tables removed.

The prior 32-to-36-page versions were caused by per-item evidence tables, not by having too much to say.

If the draft runs long, cut in this order:

1. Evidence tables in the body (there should be none, they belong in the appendix)
2. Paraphrase of source material that restates rather than extracts
3. Any profile sub-section running past its stated sentence cap

Never cut a decision, a fact the client gave you, or a source line.

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
- Clickable hyperlinks for all URLs (never raw URLs without link text)
- Horizontal rules between major sections
- Bullet lists only where the section template calls for them
- Tables ONLY where the section template specifies them: Brand Values, Brand Voice, Social Media, S3 Service Overview, the 2.3 Digital Snapshot, and the single Evidence Register appendix. Nowhere else. Per-profile, per-competitor, and per-differentiator evidence tables are prohibited in the body.
- No em dashes; use commas, colons, or periods
- No code, HTML, or debug output in brief content
- Clean, modern, agency-grade, client-ready appearance
