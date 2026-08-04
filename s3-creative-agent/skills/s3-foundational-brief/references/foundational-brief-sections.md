# Foundational Brief: Section Templates

Defines the structure, editorial rules, and formatting for every section of the Foundational Brief. The orchestrator references this file when writing each section. Research agents reference it for output-structure expectations. Visual patterns (fonts, colors, tables, shaded bands, hyperlinks) live in [s3-docx-styles.md](s3-docx-styles.md); this file defines *what content goes in each section and how it's shaped*.

---

## Universal editorial rules

These rules apply to every section. Violating any of them is worse than under-filling a section.

### Extract, don't regurgitate

Every input source — surveys, sales turnovers, discovery meeting notes, Grain call transcripts, Notion AI notes, Content Snare responses — contributes **1 to 3 extracted signals**, not paragraphs of paraphrase. The reader could always read the source; the brief exists to say what mattered in it.

- Body of each subsection = the extracted signals.
- Every subsection ends the section with a **source line** citing every input consulted, with live URLs (see s3-docx-styles.md `sourceLine()`).
- If a source contributed nothing new, don't cite it defensively.

### Importance, not count

There are no hard caps ("top 3") and no forced fills. Include what matters. Cut what doesn't.

- If a section genuinely has 6 important signals, include 6.
- If it has 1, include 1.
- Never stretch to fill a template cell. Empty is honest. Padded is worse than empty.

### No downstream leaks

Write the Foundational Brief as if the Strategy Brief and Creative Briefs don't exist yet. **No teasers, no "captured later in the Strategy Brief", no name-dropping of downstream research instruments (specific survey names, specific analyses).** Generic architectural pointers like "targeting decisions belong in the Strategy Brief" or "positioning belongs in the Strategy Brief" are fine — those describe document responsibilities, not downstream content. What's not fine: "the Centiment survey findings are captured in the Strategy Brief" — that leaks Centiment by name and previews the finding.

The FB reader should experience it as a self-contained record of what was known at that stage of the engagement.

### Descriptive vs. interpretive: what belongs here

The Foundational Brief contains **descriptive facts** about the client, its book, and its operations:

- Sales Turnover, senior stakeholder surveys, discovery notes (client-reported facts)
- Epsilon customer profiles (descriptive of the current client book)
- Lead Docket / CRM attribution (descriptive of operations)
- Owned website content, competitor primary sources (public facts)
- Government/industry data (FMCSA, NHTSA, Census)

The Foundational Brief does NOT contain **interpretive market research** commissioned to test strategic hypotheses. Those findings (awareness surveys, brand-definition surveys, ad-recall studies) live in the Strategy Brief where they earn the strategy. Even if the research is complete by the time the Foundational Brief is finalized, its content stays out of the FB. The temporal-integrity arc — "here's who they are (FB) → here's what research showed (Strategy) → therefore this positioning (Strategy)" — depends on the split.

### No "The Read"

The Foundational Brief has no interpretive TL;DR / summary / "The Read" section. Any such synthesis is strategic reading of the facts, and it belongs in the Strategy Brief. The Foundational Brief opens with 1.0 Intro (the document's own purpose) and goes straight to facts.

### No em dashes

Use commas, colons, or periods. Never `—` in generated content.

---

## Section list

Every one of these renders as `HeadingLevel.HEADING_1` in docx so the Google Docs Outline sidebar populates with clickable navigation. Do not nest a "2.0 Client Overview" or "3.0 The Brand" group header — the numbered sections stand alone.

- **1.0 · Intro**
- **2.1 · Client Details**
- **2.2 · From the Client**
- **2.3 · Digital Snapshot** *(shaded band — see s3-docx-styles.md)*
- **3.1 · Brand Essentials**
- **3.2 · Audiences**
- **3.3 · Competitors**
- **3.4 · Market Differentiators**
- **§ · Reference & Source Documents**

Named sub-blocks inside each section (Organizational Structure, Demographics, Brand Values, etc.) render as `HeadingLevel.HEADING_2`.

---

## Cover masthead

Not a numbered section. Rendered above 1.0 Intro. Uses the cover masthead pattern from s3-docx-styles.md.

- **Kicker**: The brief type in all caps — "FOUNDATIONAL BRIEF" — in MUTED tracked-caps.
- **Title**: The client's primary brand name, exactly as it appears on their owned channels. If both a legal entity and a public-facing brand exist, use the public-facing brand; only include both if the client documents specify both.
- **Metadata strip (4-column table, MUTED labels, INK values, bottom rule)**:
  - CLIENT · client name
  - AUTHORED BY · "Andrés Cuervo, CCO" unless the client CLAUDE.md specifies a different author
  - CREATED · date the brief was first generated (Month Day, Year)
  - LAST UPDATED · date of the most recent edit or update session
  - *(Finalize mode only: 5th column)* FINALIZED · date the document was locked
- **Draft banner** (conditional): In New (Draft) or Update (Draft) modes, add a `DRAFT · NOT FOR EXTERNAL CIRCULATION` banner above the kicker with a top INK border. In Finalize mode, omit the banner entirely — do not put "FINAL" in its place, and do not add a status column beyond the FINALIZED date.

**Do not** include a verbose "update note" paragraph under the metadata strip listing what was folded in for this update. The `Last updated` date already carries that meaning.

---

## 1.0 Intro

Two to three short sentences.

- Define the brief as the evergreen, pre-initiation source of truth for the client
- State it captures facts about who the client is, who it serves, and what it's up against
- State that positioning, creative direction, and channel decisions live in the Strategy Brief and channel-specific Creative Briefs
- Tone: professional, neutral, agency-grade. No em dashes.

**Example (Colombo):** *"Evergreen, pre-initiation source of truth for Colombo Law: who the firm is, who it serves, and what it's up against. Facts only. Positioning, creative direction, and channel calls live in the Strategy Brief and channel-specific Creative Briefs."*

---

## 2.1 Client Details

Opens with a **facts strip** (top/bottom-ruled 3–4 column table — see s3-docx-styles.md `factsTable()`). Include the strongest scannable facts about the client:

- Founded (year)
- Offices (count, with note like "WV + OH")
- Intake (phone number or primary intake channel)
- Annual marketing spend (if known from Work Agreement / Sales Turnover)

Then the following h4 subsections in this exact order:

### Organizational Structure

One tight paragraph. Legal structure, ownership, brand architecture, succession or transition context (if any), rough scale. Extract from Sales Turnover / discovery / About page. No leadership bullets here — those live in the next block.

### Leadership and Attorneys

One prose paragraph listing senior practitioners separated by `·`. Format: **Name (Role, notable credential)**. Include only senior practitioners delivering the client's core service (attorneys, providers, principals). Administrative/operational staff go under Day-to-Day Contacts.

*Example:* "Dino Colombo (Founder, Senior Attorney, 2026 NTL President) · Nathan Colombo (Partner, Columbus face) · Travis T. Mohler (Attorney, Columbus face) · Jon R. Godwin · Kala Sowers · Richard Vaglienti · Nicholas Blevins."

If a leader has an authoritative profile URL (client bio page preferred, LinkedIn as fallback), don't wrap it inline in this list — that would clutter. Instead, cite the client's About/Attorneys page in the section's source line.

### Day-to-Day Contacts

Bullet list. For each contact: **Name** — role, one line of context (interim status, transition, etc.). Include:

- Fractional CMO / Interim marketing lead (if present)
- In-house marketing director / Marketing coordinator
- Fractional COO / Operations lead (if present)
- Billing contact
- Any specialized in-house resource marketed as part of the client's offering (e.g., a nurse consultant, an in-house data scientist)

Follow this with a **pipe-border note** (see s3-docx-styles.md `note()`) whenever the client has a communication constraint: *"Direct email is off-limits for Dino, Nathan, and Travis during day-to-day work. Route through Laura and Aaron."* Include only when there's a real constraint; don't invent one.

### Locations

Bullet list. Each bullet: **Address** (phone), optional short qualifier ("primary office", "Class A space"). Follow with a pipe-border note if there are non-staffed listing addresses (GMB-only pins), or other operational caveats.

### Targeting

Bullet list of targeting facts extracted from Sales Turnover / discovery / Work Agreement:

- **Primary geography** — with any relevant context (billboards, tenure)
- **Primary growth market** — with tenure, priority status
- **Discussed but unconfirmed expansions** — if any
- **Case-value focus** or product-tier focus — if the client distinguishes tiers of work (e.g., "Cases" vs "Claims", "high-ticket" vs "volume")

### Primary Offerings

One paragraph. What the client sells/represents, anchored by any trademarked positioning line (e.g., "Hurt by a Truck®"). List secondary practice areas / offerings if relevant. Note fee structure ("contingency", "flat-fee", "hourly", etc.) at the end.

### Website

One line: `Primary: <a href="...">domain</a>`.

### S3 Service Overview

Divided into **Phase 1 (Creative)** and **Phase 2 (Performance)** h4 subheads. Each phase gets a one-line muted intro (billing rhythm — "Execute-then-deliver, billed 50/50" for Phase 1; "Monthly retainers, billed in advance after website launch" for Phase 2) and a bullet list of line items:

- **Service name — price.** One line of what's included.

Do NOT use a table for the service overview. Bullet lists read better on a scan and match the rest of the section's rhythm.

Below the two phase lists, a muted-italic paragraph: *"Full terms in the signed [Work Agreement](URL) (Google Drive, executed by {signer} {date})."* — `Work Agreement` is a live hyperlink to the actual Drive URL captured during ingestion.

### Social Handles

Rendered as a **2-column grid** (see s3-docx-styles.md `socialGrid()`). Each cell:

- Platform name (bold, INK)
- Description (muted small) — e.g., "Brand page plus WV- and OH-market-specific pages", "Single brand handle", "Two channels: legacy + newer handle"
- One row of dashed-underline hyperlinks to the actual account URLs

**If a platform is not found**, include the cell with a "Not found" status pill instead of link handles. Never fake a link.

**Do NOT use** the old table format with "Verified / Probable / Not Found" status column. That was research-log formatting; the 2-col grid is the deliverable format.

### Source line for §2.1

Every section ends with a source line (see s3-docx-styles.md `sourceLine()`). Cite every input consulted with its actual URL. For §2.1 this typically includes: Colombo Law About page, attorney bios, NTL profile (if there's a national credential), Sales Turnover, Website Notes, Creative Download, Work Agreement, Content Snare intake, direct social platform inspection.

---

## 2.2 From the Client

Distilled synthesis of what the senior stakeholders and discovery meetings said. Each subsection is a bullet list where each bullet is a **compressed idea** (**Bold label. Descriptive sentence.**), not a paraphrase of a survey response.

Rules:

- Every bullet: **Bold label.** followed by a compressed statement in 1–2 sentences max.
- Prefer client quotes where they're memorable (Dino's *"99% of people will never need us..."* is worth quoting; a generic "we want to grow" is not).
- Never dump all the survey open-ends. Extract the signal, cite the source.
- Apply the importance-not-count rule: if a section has 15 real painpoints, include 15. If it has 3, include 3.

### Client Goals

Bullet list. Each bullet is an outcome statement, not a tactic. Rewrite for clarity without changing intent.

### Painpoints

Bullet list. Current-state friction, constraints, risks, past disappointments, gaps. Each bullet a compressed observation. If message-resonance or market-perception is invisible in current tooling, say so factually — do NOT teaser upcoming research.

### Asks

Bullet list. Must-haves, constraints, preferences, non-negotiables. Include specific blocks the client called out (language to avoid, colors to avoid, tools to keep, etc.). Include operational constraints ("route email through X").

### Firm Backstory

2 to 3 short paragraphs. Origin story, culture, how the current team came together. Community involvement / signature philanthropic programs if they're a real brand asset. Any single strongest national-authority credential (e.g., "Dino's 2026 NTL presidency is the firm's strongest single national-authority proof point").

Do not confuse this with the Business Model Notes section — Backstory is story; Business Model is operations.

### Source line for §2.2

Cite the Content Snare surveys (Dino/Nathan/Travis, or equivalent stakeholders), the discovery meeting Notion notes and Grain recordings, any bi-weekly meeting notes, the About page. All with live URLs.

---

## 2.3 Digital Snapshot

**Rendered inside the shaded band section** (see s3-docx-styles.md `shadedBand()`). This is the data-heavy section that visually stands out. The band extends edge-to-edge and uses PAPER_BAND shading.

Opens with a **muted-italic intro** naming the data sources and their verification status: which items were independently verified (S3 SEO audit) vs. client-reported (paid-media figures from Sales Turnover + vendor streaming reports).

Then a **3-column TL;DR grid** (see `threeCol()`) showing the top-line signal from Lead Docket attribution:

- **REFERRAL (WV)** — 52% wanted rate on Friend-of-Firm referrals — the best signal in the CRM.
- **DIGITAL (LSA/PPC)** — ~8% wanted rate on paid search. Volume engine, not a quality engine.
- **BILLBOARD** — — · Invisible in the CRM; builds recall self-report can't capture.

*(Values adapt to the client — but the pattern of "best channel / volume channel / invisible-in-CRM channel" is the frame.)*

Then h4 subsections:

- **Search rankings — {primary market} (verified)** — one paragraph, comma-separated positions with any depth gaps flagged in bold.
- **Search rankings — {state or feeder market}** — one paragraph, statewide rankings and feeder terms.
- **Site health** — DA vs. benchmark, backlink profile, unlinked media mentions, page counts, schema gaps.
- **Listings** — Avvo / Martindale / Justia / GBP status for each attorney; any inconsistent-info issues.
- **Paid media (client-reported, {reference month})** — 2-column grid split by market (see `threeCol()` with 2 cols). Include Total per market. Cite Network Affiliates streaming reports if available.
- **Lead flow** — CRM stack (Lead Docket, Smart Advocate, etc.), who's typically the caller.
- **Lead Docket attribution — {date range}** — data table (see `dataTable()`) with columns Source / Columbus (leads → signed) / WV (leads → signed) / Read. One-line "Read" column interprets each row.
- Optional: a final paragraph on organic-vs-paid conversion rate context.

### Editorial rules specific to §2.3

- This is operational, factual data — descriptive, not interpretive. Include it in the FB.
- Do NOT compute or state a client's market-share percentage, brand-awareness percentage, or "what percentage of prospects have heard of them" — those come from commissioned market research and go in the Strategy Brief.
- Do NOT include Google Analytics data — S3 doesn't have GA MCP connectivity (see project memory).
- If message-resonance is invisible in the CRM ("Lead Docket captures source but not motivation"), state that factually, don't teaser upcoming research.

### Source line for §2.3

Cite: S3 SEO audit (Lauren Shriver, SEMrush), Sales Turnover, Network Affiliates streaming reports (not S3-audited), Lead Docket attribution exports for each market — with live URLs where captured.

---

## 3.1 Brand Essentials

### Brand Values

**Bullet list** (not a table). Each bullet: **Value name.** — Description in 1 sentence, ideally citing a client quote or a concrete manifestation. Extract from client-provided values (Creative Survey "Your Brand" section) first; only derive from clear statements on owned channels if the client didn't provide values explicitly.

### Mission Statement

- If an official mission statement exists in the Creative Survey or on the client's website, use it **verbatim** in a `blockquote.mission` style block (see s3-docx-styles.md), with a cite line reading "Verbatim, client-approved (Creative Survey)" or equivalent.
- If none is on file, write a Draft mission strictly from available documents and owned website language, and label it "Mission Statement (Draft)" — no new claims or unverifiable superlatives.

### Brand Differentiators (Client-Reported)

Bullet list, same format as Brand Values (**Bold label. — Description with a client quote or concrete manifestation.**). Each must be a brand-vs-brand differentiator: something that distinguishes this brand from competing brands in the same market.

- Business structure details (entity type, ownership model) belong in Organizational Structure (2.1), not here.
- These are what the client claims. Independent verification happens in §3.4 Market Differentiators.

### Brand Voice (Observed)

A muted-italic one-liner: *"What the voice IS, not what it should become."*

Then **one prose paragraph** (not a table) describing the client's current communication style across owned channels. Cover: tone, formality, pronouns, emotional register, sentence structure, dominant CTA — but as flowing observation, not a labeled-cell breakdown. Do not use a table for Brand Voice.

If there's an observed gap between the client's stated brand aspiration and how their current site/content reads, present it as a **pipe-border note** (see s3-docx-styles.md `note()`). Do not use an orange-left-border/light-gray-background callout (that was legacy styling — it's gone). Do not bury the gap observation in body prose either — the pipe-border note is the correct pattern.

**Example:** *"Observed gap: the client's stated aspiration is 'subdued / quiet luxury / premier expertise' and clearly-different-from-the-category, but the current site still reads like a traditional regional PI firm. Travis: three back-to-back TV spots (including Colombo's) 'all felt the same.'"*

### Source line for §3.1

Cite: Content Snare senior-stakeholder surveys, Creative Survey (with the specific section noted, e.g., "Your Brand"), the client homepage + About page (with the scrape date). All live URLs.

---

## 3.2 Audiences

Opens with a **muted-italic intro** listing the data sources feeding the audience profiles (Epsilon customer profiles, Lead Docket attribution, government/industry data, partner surveys). **Do NOT mention specific downstream market research instruments by name** (Centiment, XYZ study). A brief architectural note is fine: *"Targeting decisions belong in the Strategy Brief."*

Then, one profile per audience. Every profile uses this structure:

**Audience label (eyebrow small caps)**: "Profile 1", "Profile 2", ..., "Profile N · Aspirational" (for aspirational segments).

**Profile name (h3-style, 15.5pt bold INK)**: Descriptive audience name (e.g., "Seriously Injured Truck/CMV Crash Victims — West Virginia").

For **aspirational-only** profiles (segments the client wants to reach but isn't currently serving), add a muted-italic intro under the name explaining that this is an aspirational target, not the current book. Name the partner(s) who flagged this segment. State the current book's actual composition per Epsilon in one sentence. Do NOT teaser what research will show about reachability.

Then five h4 subsections (in this exact order):

1. **Demographics** — One prose paragraph. Age band, family stage, gender skew, income tier, geography, life context. Extract from Epsilon customer profile + client's own intake data + partner surveys. Include specific index numbers (e.g., "Epsilon 35–44 indexes 211") — these are descriptive facts about the book, not interpretive research.
2. **Mindset** — 2–3 sentences on what they're protecting, seeking, fearing, or motivated by.
3. **Attitude** — 2–3 sentences on how they evaluate options, what they demand, what they reject.
4. **Perception** — 2–3 sentences on what must be true for trust to form; how they identify authority or safety.
5. **Evidence** — Bullet list. 1–5 factual claims relevant to this audience, each with an inline citation like *(FMCSA A&I)*, *(NHTSA)*, *(iLawyer PI Survey)* — the citation is a live hyperlink to the actual URL. **No table format for Evidence.** Bullets with inline muted-italic citations read cleaner and match the rest of the section.

### Editorial rules specific to §3.2

- **Descriptive vs. interpretive.** Epsilon data describes the current client book (descriptive → belongs here). Lead Docket attribution describes operations (descriptive → belongs here, but usually renders in §2.3). Commissioned market-research surveys that test strategic hypotheses (audience-awareness, brand-definition, ad-recall studies) are interpretive → belong in the Strategy Brief. If those instruments exist and have been fielded by the time you're writing the FB, their findings still stay out of the FB.
- **No downstream teasers.** Do NOT write bullets like *"[Findings from the {Centiment / XYZ} survey are captured in the Strategy Brief]"*. The FB reader shouldn't know research is coming.
- **No corrections/critique framing.** Don't write "Correction the first-party data forces: the firm's mental model is wrong about X." That's an interpretive critique. The raw fact ("Epsilon shows ages 35–54 in both markets") belongs in each profile's Demographics. Whether that contradicts the partners' expectations is a strategic observation, and it belongs in the Strategy Brief.
- **Importance, not count.** If a client only has 3 real audience profiles, don't stretch to 5. Reception attorneys / referral partners / aspirational segments only get their own profiles if there's real content to write about them.

### Source line for §3.2

Cite Epsilon customer profiles (each market's), Lead Docket attribution, Content Snare senior-stakeholder surveys, FMCSA + NHTSA (with live URLs), U.S. Census QuickFacts (live URL), and Attorney at Work / iLawyer PI Survey (live URL). No Centiment or other market-research-instrument names.

---

## 3.3 Competitors

Opens with a **muted-italic intro** stating the competitive organization principle: primary channel first, then secondary channel(s).

- **If the client is primarily B2C**: B2C competitors first (organized by geography — WV/OH/etc.), then any B2B / referral-channel competitors.
- **If the client is primarily B2B**: B2B first, then B2C.
- **If the client operates in only one channel**: no channel segmentation needed.

Determine primary channel from §2.1 Targeting and Sales Turnover.

Each geographic/channel group opens with a small-caps **geo header** (INK, bold-underline) and a one-sentence muted lead describing what "competing" means in that group (*"Firms competing for direct consumer truck-injury and personal-injury leads in North Central WV"* / *"Firms that compete not for consumer ads but for attorney referrals of catastrophic truck cases"*).

Then each competitor is a block:

- **Name** (h3-style, 17pt bold INK) with a status **tag** to its right — e.g., `[Client-Named]`, `[Independently Discovered]`, or a specific note like `[Client-Named · Travis's category-blur reference]`. Render the tag as a small caps pill with a hairline RULE border (see s3-docx-styles.md `.competitor .tag`).
- **Meta line** (muted small): channel + geography · [firm URL as a dashed-underline link].
- **Description** — one paragraph, 3–5 sentences. What they emphasize, their scale, self-reported claims (with signal-strength like "self-reported: X"), any specific marketing pattern.
- **Relevance** (pipe-border note) — 1–2 sentences on why this competitor matters strategically to the client. Italic, MUTED, with a left RULE border.

### Editorial rules specific to §3.3

- Do NOT list proof signals in a separate table. Fold them into the description paragraph. The old "Proof Signals" table format has been retired — the block treatment above is the current format.
- Include at least 1 independently discovered competitor per channel/geography (not just client-named ones). Real market intelligence comes from actual research.
- **Importance, not count.** If a market only has 3 real competitors that matter, include 3. Don't stretch to 6 by including firms nobody actually competes with.
- If there's a locally-present competitor that doesn't warrant a full block but is worth mentioning (e.g., Kurgis & Associates in Columbus), include it as a **pipe-border note** after the group instead of a full competitor block.

### Source line for §3.3

Cite: "Client-named + independently discovered. Live primary-source fetches ({date}): {domain1}, {domain2}, ..." (each domain a live hyperlink). If any national authority profiles were cited (e.g., NTL Top 100 for individual attorneys), cite those separately with links.

---

## 3.4 Market Differentiators

Opens with a **muted-italic intro**: *"Draws only on facts already stated in §2.1, §3.1, and §3.3. Competitive set: {list of competitors from §3.3}."*

Then 4 to 7 differentiators, each rendered as a block:

- **Numbered title** (h3-style, 17pt bold INK): "01  Single-Vertical Discipline", where "01" is a small MICRO-colored serial and the title is INK bold. Serial format `01`, `02`, ... `07`.
- **h4: Pattern Summary** — What the competitors do. Cite specific competitors from §3.3 by name.
- **h4: Client Difference** — How the client differs, stated as a fact. Bold the key phrase (e.g., "**The only advertised B2C brand in the set that limits its marketing voice to a single vertical.**").
- **h4: Evidence Trail** — Inline muted-italic references back to specific sections: `100% budget allocation *(§2.1)*. Schiff, KNR, Farmer Cline & Campbell all market broad PI menus *(§3.3)*.` Do NOT render Evidence Trail as a table.

### Editorial rules specific to §3.4

- **Allowed sources**: ONLY facts already stated in §2.1, §3.1, and §3.3. Do NOT introduce new competitors, new client facts, or new research citations in §3.4.
- **Importance, not count.** 4–7 is the reasonable range for a mature client. Fewer is fine if the market is genuinely narrow.
- **No recommendations.** These are factual differentiators, not strategic recommendations to lean into any particular one. The Strategy Brief decides which to lead with.

### Source line for §3.4

*"Facts drawn from §2.1, §3.1, §3.3 in this document. No new primary research."*

---

## § · Reference & Source Documents

The last section. A numbered list (see s3-docx-styles.md `ol()`) of every source consulted. Each entry:

- The source name (or descriptive title), with a live hyperlink pointing to the actual URL captured during ingestion.
- Additional context in plain text (dates, request IDs, versions, etc.).

Every entry that has a URL is a dashed-underline hyperlink; entries without URLs are plain text (never `#` placeholders). If a source was in scope but its URL wasn't captured, either: (a) go find it via the Drive/Notion/Grain search tools before finalizing, or (b) render it as plain text with a parenthetical note like `(Internal — URL not yet in Drive index)`.

Include, in this order:

1. Content Snare senior-stakeholder surveys (each stakeholder's request ID as a live link, plus original survey if it exists)
2. Creative-survey call transcripts (Grain recording URLs)
3. Marketing Strategy Discovery Meeting (Notion AI notes + Grain recording)
4. Bi-Weekly Check-Ins with the interim client contact
5. Sales Turnover doc
6. Epsilon customer profiles (both markets)
7. Lead Docket attribution exports (both markets)
8. Client / Audience Report (S3 pre-survey diagnostic)
9. Work Agreement
10. Website Notes and Creative Download
11. Site Audit (S3 SEO Tech)
12. Government/industry data (FMCSA, NHTSA, Census, iLawyer PI Survey)
13. National-authority profiles (NTL for named attorneys)
14. Competitor primary sources (grouped in one line with each domain as a live hyperlink)

Do NOT include commissioned market-research findings (Centiment, brand-awareness studies) — those live in the Strategy Brief's reference list, not the FB's.

---

## Section source lines vs. Reference section

Both exist and serve different purposes:

- **Section source line** (at the end of each §-numbered section): a compressed inline list of the specific sources that fed *that section*, so the reader can trace where a particular finding came from. Muted small text, dashed top border, `SOURCES` label, `·`-separated entries.
- **Reference section** (at the end of the brief): the exhaustive numbered list of every source consulted across the whole document. This is the audit trail.

The section source lines are the primary "which source produced this specific finding" pointer. The Reference section is completeness.

---

## Removed patterns

The following patterns from earlier versions of this template are **retired** — do not use them:

- ❌ "The Read" opening TL;DR section — belongs in Strategy Brief, not FB
- ❌ "DRAFT" and "FINAL" outline/fill badge pair — replaced by configurable draft banner (Draft mode only)
- ❌ Orange-left-border "styled callout" for observed gaps — replaced by pipe-border note
- ❌ Brand Voice as a labeled-cell table (Tone / Formality / Pronouns / ...) — replaced by one prose paragraph
- ❌ Brand Values as a table — replaced by bullet list
- ❌ S3 Service Overview as a table — replaced by Phase 1 + Phase 2 bullet groups
- ❌ Social Media as a research-log table with "Verified / Probable / Not Found" — replaced by 2-column social handles grid with live-link handles or "Not found" pill
- ❌ Evidence and Proof Signals as tables with Claim / Source / Confidence columns — replaced by bullet lists with inline muted-italic citations that are live hyperlinks
- ❌ Research Logs as visible sections in the output — research logs stay in agent working memory only, they are not part of the deliverable
- ❌ Verbose "what changed in this update" paragraph under the cover — the Last Updated date carries this meaning
- ❌ Google Analytics references — S3 doesn't have GA MCP connectivity (see project memory)
- ❌ Section 4.0 Brand Voice (standalone) — folded into 3.1 Brand Essentials
- ❌ Section 5.0 Bright Idea — moved to Strategy Brief

---

## Formatting standards (summary)

Refer to s3-docx-styles.md for exact code patterns. High-level rules:

- Bold for field labels at the start of bullets and for key phrases within body text worth catching on a scan
- All URLs are live hyperlinks — never raw URLs, never `#` placeholders
- Section separators are the h2's own bottom RULE border — no manual dividers between sections
- Bullet lists only where the section template calls for them
- Tables only where explicitly specified (facts strip, 3-col grid, Lead Docket attribution, streaming performance, social handles grid) — never as a generic content container
- No em dashes; use commas, colons, or periods
- No code, HTML, or debug output in brief content
- Clean, modern, agency-grade, client-ready appearance
