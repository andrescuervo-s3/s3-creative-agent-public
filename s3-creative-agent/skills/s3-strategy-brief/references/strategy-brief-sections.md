# Strategy Brief: Section Templates

Purpose: Defines the structure, fields, and formatting for every section of the Strategy Brief. The orchestrator references this file when writing each section.

---

## Heading Level Mapping

| Skeleton Level | Heading | Example |
|---------------|---------|---------|
| 1.0, 2.0, 3.0, 4.0 | H1 | Brand Strategy |
| 1.1-1.7, 2.1-2.3, 3.1, 4.1+ | H2 | Brand Positioning |
| Named blocks within sections | H3 | Competitive Framing, English Track, Client-Facing |
| Sub-fields within sections | H4 | Demographics |

---

## 1.0 Brand Strategy

### 1.1 Brand Positioning

**Heading:** H2

**Data source:** Foundational Brief sections 3.1 (Brand Essentials) and 3.4 (Market Differentiators), plus user strategic input

**Fields:**
- Positioning Statement (1-2 paragraphs: who the brand is, what space it claims, how it differentiates)
- Competitive Differentiation (paragraph or short bullets: how this positioning responds to the competitive set identified in the Foundational Brief section 3.3)

**Format:** Prose paragraphs. No tables. The positioning statement should read as a single coherent narrative, not a fill-in-the-blank template.

---

### 1.2 Mission Statement

**Heading:** H2

**Data source:** Foundational Brief section 3.1 (if mission existed), user refinement

**Fields:**
- Finalized Mission Statement (1-3 sentences)

**Format:** Single block of text. If the Foundational Brief had an observed mission, this is the finalized/evolved version. If none existed, this is new.

---

### 1.3 Value Proposition

**Heading:** H2

**Data source:** Foundational Brief sections 2.1, 3.1, user input

**Fields:**
- Value Proposition Statement (1-2 sentences: what the brand offers, to whom, and why it matters)

**Format:** Single block of text. Distinct from the mission statement (mission equals purpose; value prop equals promise to the customer).

---

### 1.4 Target Audiences

**Heading:** H2

**Data source:** Foundational Brief section 3.2 (audiences), user strategic refinement

**Fields per audience:**
- Audience Name (H3)
- Communication Angle (paragraph: how we speak to this audience, what matters to them, what messaging resonates)
- Channel Priority (which channels reach this audience best)

**Format:** H3 per audience. Each audience gets a communication angle that goes beyond the foundational profile. This is strategic, not factual.

---

### 1.5 Brand Voice and Tone

**Heading:** H2

**Data source:** Foundational Brief section 3.1 Brand Voice (Observed) table, user strategic direction

**Fields:**
- Voice Attributes (table: Attribute | Description, finalized, not observed)
- Tone Guidelines (paragraph: how the voice adapts across contexts, formal for legal, approachable for social, etc.)

**Format:** Table for attributes (matches foundational format), paragraph for tone. This is the directive version: "this is how we will sound."

---

### 1.6 Messaging Framework

**Heading:** H2

**Data source:** User input, informed by 1.1-1.5

**Fields per audience (from 1.4):**
- Audience Name (H3)
- Key Messages (2-4 bullet points: primary messages for this audience)
- Proof Points (2-3 bullet points: evidence or claims that support the messages)
- Sample Headlines or Taglines (2-3 examples, clearly labeled as drafts)

**Format:** H3 per audience with bulleted sub-fields. Messages should feel actionable, not abstract.

---

### 1.7 The Bright Idea

**Heading:** H2

**Data source:** User creative direction, informed by everything above

**Fields:**
- Master Concept (paragraph: the creative throughline, if unified) OR Channel Concepts (H3 per channel with its own concept, if divergent)
- How It Threads (paragraph: narrative of how the idea connects across channels, even when channels diverge, explain the logic)

**Format:** Flexible. One paragraph for unified, H3 per channel for divergent. The "How It Threads" paragraph is always present.

---

## 2.0 Channel Strategies

**Section 2.0 contains only in-scope work.** Channels not covered by the Work Agreement do not appear here. They appear in 4.0 Recommendations.

### General Pattern

Each channel section follows this structure unless noted otherwise:
- **Objectives** (2-4 bullets: what success looks like for this channel)
- **Strategic Direction** (1-2 paragraphs: the approach)
- **Key Tactics** (bulleted list: specific actions or initiatives)
- **Audience Alignment** (which audiences from 1.4 this channel serves)
- **Bright Idea Application** (how 1.7 manifests in this channel)

---

### 2.1 Website Strategy

**Heading:** H2

**Section flow (top to bottom):**

1. **Objectives** (2-4 bullets: what success looks like)
2. **Strategic Direction** (1-2 paragraphs: the approach, what we're building and why)
3. **Creative Direction** (design language, UX priorities, content hierarchy, visual direction for the site. Stands alone as readable strategy, not a pointer to 1.5)
4. **Audience Alignment** (which audiences from 1.4, restated in context)
5. **Bright Idea Application** (how 1.7 manifests on the website)
6. **Technical Direction** (platform, integrations, dev approach. Comes LAST because it supports the strategy above, not the other way around)

**Technical Direction data source:** `references/s3-tech-stack.md`, user input

**Technical Direction fields:** Present as a bulleted list, not prose paragraphs. One bullet per component (Platform, CMS, Video, Integrations, Scope). Dense technical paragraphs are unreadable. The reader needs to see the stack at a glance, not parse it out of a paragraph.

---

### 2.2 SEO Strategy

**Heading:** H2

**Data source:** Foundational Brief section 2.3 (Digital Snapshot), user input, on-demand research

**Fields:** Follow general channel pattern. Key Tactics should include keyword targeting priorities, content strategy for organic, technical SEO priorities, local vs national approach.

---

### 2.3 S3 Media Strategy

**Heading:** H2

**IMPORTANT:** This is the production brief for photo/video shoots, NOT earned/owned/paid media mix. Paid Advertising and Social Media, if not in the Work Agreement, belong in 4.0 Recommendations.

**Fields:**
- Shoot Objectives (what the shoot needs to produce and why)
- Creative Direction for Shoot (visual tone, mood, references, informs the mood board)
- Shot Types Needed (headshots, lifestyle, product, environmental, video, etc.)
- Talent and Location Notes (who appears, where, any constraints)
- Deliverables Expected (what S3 Media hands back: edited photos, raw video, etc.)

**Format:** This section plus a mood board becomes the S3 Media team handoff package.

**Scope rule:** Only label deliverables as "in scope" if they map directly to a Work Agreement line item. Strategic recommendations that were discussed, even at length, are recommendations (4.0) unless the Work Agreement explicitly covers them.

---

---

## 3.0 Scope Alignment

### 3.1 Work Agreement Coverage

**Heading:** H2

**Data source:** Work Agreement line items (extracted and confirmed in Phase 1)

**Format:** Intro paragraph identifying the Work Agreement and execution date, followed by a table with columns: Line Item | Monthly Cost | Addressed In | Status (Covered / Partial / Not Addressed). After the table, a brief paragraph listing what the monthly services include.

---

## 4.0 Recommendations

**Heading:** H1

**Purpose:** This is where all out-of-scope strategic recommendations live. Ideas that emerged during the strategy conversation but are not covered by the Work Agreement. The reader finishes the document here, with the upsell.

**Intro paragraph:** One paragraph framing the section: "The following strategic recommendations emerged during the strategy development process. They are not included in the current Work Agreement but represent opportunities to extend the engagement based on the direction established in this brief."

### 4.x [Recommendation Name] (one subsection per recommendation)

**Heading:** H2

**Format per recommendation:**
1. Scope callout (styled per s3-docx-styles.md): "Outside current scope. Requires client approval and separate agreement."
2. **WHAT** (H4): One paragraph. What we are recommending.
3. **WHY** (H4): One paragraph. Why it matters to the strategy.
4. **HOW** (H4): One paragraph. What S3 would do if engaged.

Keep each block to 1-3 sentences. No restating context that already exists in the brief. No verbose rationale. The reader should be able to evaluate the recommendation in under 30 seconds.

**Example subsections:** 4.1 Paid Advertising Management, 4.2 Social Media Management, 4.3 Ongoing Video Production. The specific subsections depend on what emerged during the strategy conversation.

**Key rule:** Each recommendation must carry enough context for the client to evaluate it independently. Do not write "as discussed" or "per our conversation." State the case as if the reader is seeing it for the first time.

---

## Sections Marked Not Applicable

When a channel strategy does not apply to the engagement:
- Keep the H2 heading
- Single line: "Not applicable to this engagement."
- Do not omit the section from the document

---

## Formatting Standards

- Bold for field labels and key phrases within body text
- Clickable hyperlinks for all URLs (never raw URLs without link text)
- Section dividers (gray bottom border, #999999) between every subsection, not just between major sections. Each H2 section ends with a divider.
- Bullet lists only where the section template calls for them
- Tables where the section template specifies them
- No em dashes; use commas, colons, or periods
- No code, HTML, or debug output in brief content
- Clean, modern, agency-grade, client-ready appearance
- Font embedding: run `assets/embed-fonts.py` on every generated .docx to embed Open Sans

## Readability Rules

- **Each section stands alone.** A reader opening to any section should understand it without reading previous sections first. Restate relevant context rather than writing "as established in 1.1" or "refer to section X."
- **No redirect sections.** If a section's content is just "see [other section]," it should not exist.
- **Lead with strategy, end with technical detail.** Within any section, strategic direction comes first, creative direction next, technical supporting detail last.
- **Break up density.** No paragraph should run more than 5-6 lines. No sentence should list 10+ items separated by commas. Use tables for structured data, bullets for lists, prose for reasoning.
- **No cross-reference scavenger hunts.** If the brand voice matters to the SEO strategy, describe the relevant aspects in the SEO section. Do not send the reader elsewhere.
- **State it once.** If a concept (e.g., bilingual Spanish track, "usted" register, cultural authenticity) has been fully described in one section, do not redeclare it in subsequent sections. A brief mention ("Spanish track follows the same arc, transcreated") is sufficient. Repeating the same detail across multiple sections creates bloat.
- **No restating messaging examples.** If messaging copy (headlines, taglines, channel expressions) has been written in the Messaging Framework, do not repeat it in Channel Strategies or other sections. Reference it, do not restate it.
