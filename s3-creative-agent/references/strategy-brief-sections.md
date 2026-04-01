# Strategy Brief: Section Templates

Purpose: Defines the structure, fields, and formatting for every section of the Strategy Brief. The orchestrator references this file when writing each section.

---

## Heading Level Mapping

| Skeleton Level | Heading | Example |
|---------------|---------|---------|
| 1.0, 2.0, 3.0, 4.0 | H1 | Brand Strategy |
| 1.1-1.7, 2.1-2.7, 3.1-3.2, 4.1-4.4 | H2 | Brand Positioning |
| 2.1.1, 2.1.2 | H3 | Creative Direction |
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

### General Pattern

Each channel section follows this structure unless noted otherwise:
- **Objectives** (2-4 bullets: what success looks like for this channel)
- **Strategic Direction** (1-2 paragraphs: the approach)
- **Key Tactics** (bulleted list: specific actions or initiatives)
- **Audience Alignment** (which audiences from 1.4 this channel serves)
- **Bright Idea Application** (how 1.7 manifests in this channel)
- **Scope callout** (if applicable: inline flag per s3-docx-styles.md scope callout style)

---

### 2.1 Website Strategy

**Heading:** H2

#### 2.1.1 Creative Direction

**Heading:** H3

**Fields:** Design language, UX priorities, content hierarchy, user experience goals, visual direction for the site specifically.

#### 2.1.2 Technical Direction

**Heading:** H3

**Data source:** `references/s3-tech-stack.md`, user input

**Fields:** Platform notes (Tresio baseline), CMS considerations (DatoCMS), integrations needed, performance requirements, development approach, any platform-specific constraints.

---

### 2.2 SEO Strategy

**Heading:** H2

**Data source:** Foundational Brief section 2.3 (Digital Snapshot), user input, on-demand research

**Fields:** Follow general channel pattern. Key Tactics should include keyword targeting priorities, content strategy for organic, technical SEO priorities, local vs national approach.

---

### 2.3 Paid Advertising Strategy

**Heading:** H2

**Fields:** Follow general channel pattern. Key Tactics should include platform selection, budget allocation direction, audience targeting approach, campaign structure.

---

### 2.4 Social Media Strategy

**Heading:** H2

**Fields:** Follow general channel pattern. Key Tactics should include platform prioritization, content pillars, posting cadence direction, community approach.

---

### 2.5 S3 Media Strategy

**Heading:** H2

**IMPORTANT:** This is the production brief for photo/video shoots, NOT earned/owned/paid media mix.

**Fields:**
- Shoot Objectives (what the shoot needs to produce and why)
- Creative Direction for Shoot (visual tone, mood, references, informs the mood board)
- Shot Types Needed (headshots, lifestyle, product, environmental, video, etc.)
- Talent and Location Notes (who appears, where, any constraints)
- Deliverables Expected (what S3 Media hands back: edited photos, raw video, etc.)

**Format:** This section plus a mood board becomes the S3 Media team handoff package.

---

### 2.6 Creative Direction

**Heading:** H2

**IMPORTANT:** This is the overall design system, NOT the website creative direction (2.1.1) or shoot direction (2.5).

**Fields:**
- Visual Tone (paragraph: the overarching look and feel)
- Photography Style (how photography should look across all uses)
- Color Application (how the brand colors are used in practice)
- Typography Expression (how type is used beyond just font choice)
- Design System Notes (patterns, components, or visual rules that apply across all channels)

**Format:** Prose paragraphs. This informs 2.5 (shoot should reflect design system) and 2.1.1 (website should express design system).

---

### 2.7 Content Strategy

**Heading:** H2

**Fields:** Follow general channel pattern. Key Tactics should include content pillars, editorial voice notes, content types and formats, blog/resource strategy.

---

## 3.0 Scope Alignment

### 3.1 Work Agreement Coverage

**Heading:** H2

**Data source:** Work Agreement line items (extracted and confirmed in Phase 1)

**Format:** Table with columns: Line Item | Addressed In | Status (Covered / Partial / Not Addressed)

---

### 3.2 Scope Expansion Opportunities

**Heading:** H2

**Data source:** Collected inline scope flags from sections 2.1-2.7

**Format:** Bulleted checklist. Each item includes the idea, which section it appeared in, and status (Pending Confirmation / Approved / Removed). This is the last thing read before moving to a creative brief.

---

## 4.0 Pressure Test Summary

### 4.1 Audience Coverage Check

**Heading:** H2

**Format:** Table with columns: Audience (from Foundational 3.2) | Communication Angle (1.4) | Channel Coverage (which 2.x sections address it) | Status (Complete / Gap)

---

### 4.2 Scope Coverage Check

**Heading:** H2

**Format:** Table with columns: Work Agreement Line Item | Strategy Section(s) | Status (Covered / Gap)

---

### 4.3 Strategic Coherence Check

**Heading:** H2

**Format:** Paragraph summary. States the Bright Idea(s) and how they thread. Notes any intentional divergence by channel with rationale. Flags any unexplained divergence that was resolved during the pressure test conversation.

---

### 4.4 Feasibility Notes

**Heading:** H2

**Format:** Bulleted list. Timeline, resource, or dependency observations. Not a blocker, awareness items only.

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
- Horizontal rules between major sections
- Bullet lists only where the section template calls for them
- Tables where the section template specifies them
- No em dashes; use commas, colons, or periods
- No code, HTML, or debug output in brief content
- Clean, modern, agency-grade, client-ready appearance
