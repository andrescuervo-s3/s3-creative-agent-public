# Website Creative Brief: Section Templates

Purpose: Defines the structure, fields, and formatting for every section of the Website Creative Brief. The orchestrator references this file when writing each section.

---

## Heading Level Mapping

| Skeleton Level | Heading | Example |
|---------------|---------|---------|
| 1.0, 2.0, 3.0, 4.0, 5.0, 6.0, 7.0, 8.0 | H1 | Project Snapshot |
| Subsections (Who Is, Positioning, Audiences, etc.) | H2 | Positioning |
| Named blocks within sections | H3 | Photography, S3 Multi-Local Technology |

When cross-referencing other sections, use section names ("See Branding Status"), not numbers. Numbers shift and break.

---

## 1.0 Project Snapshot

**Heading:** H1

**Data source:** Work Agreement, Foundational Brief, Strategy Brief

**Fields:**
- Client Name
- Project Type (new build, redesign, development only, etc.)
- Current Website URL (if redesign)
- Platform (e.g., Tresio + DatoCMS)
- Scope Summary (2-3 sentences: what this project covers, derived from Work Agreement line items. Narrative, not a checklist.)

**Stakeholders:** Two separate tables.

**Client Team** (table: Name | Role | Notes)
**S3 Team** (table: Name | Role | Notes)

Do not mix client and S3 stakeholders in one table. The designer needs to know who's on which side at a glance.

---

## 2.0 Brand

**Heading:** H1

This section gives the designer the brand context they need before opening a design tool. It's a snapshot, not the full brand strategy.

### 2.1 Who Is [Client]

**Heading:** H2

**Data source:** Foundational Brief (2.1 Client Details), Strategy Brief (1.1)

1-2 paragraphs. Who is this firm/company, what's their identity, where do they operate. Pull from the foundational and strategy briefs. This is context, not strategy.

### 2.2 Positioning

**Heading:** H2

**Data source:** Strategy Brief (1.7 Bright Idea, 1.3 Value Proposition)

How we're positioning this brand on the website. This is the strategic move. 2-3 paragraphs max.

The positioning connects the Bright Idea to the web experience. It tells the designer what the site is *doing* strategically, not just what it looks like.

End with a direct design implication. Example: "Client testimonial content sits above attorney content on every page. That's the theme."

Do not write an architectural specification here. That belongs in Site Architecture.

### 2.3 Audiences

**Heading:** H2

**Data source:** Strategy Brief (1.4 Audiences)

One paragraph per audience. Bold the audience name. Include who they are, how they arrive, and the one design-relevant insight. Not full journey maps (those are in the strategy brief).

### 2.4 Value Proposition

**Heading:** H2

**Data source:** Strategy Brief (1.3)

The strategic positioning statement from the strategy brief. Presented as a blockquote. This is NOT messaging copy. It's the strategic frame.

### 2.5 Branding Status

**Heading:** H2

**Data source:** Work Agreement, creative call notes, Foundational Brief (3.1), branding playbook or live site scrape

**Fields:**
- **Status** (one of: New Brand Package (in agreement) | Existing Brand (not in agreement) | No Existing Brand)
- **What's Flexible** (bullets: which brand elements can be changed)
- **What's Not** (what's untouchable)

**Current Color Palette** (H3)
Table: Role | Color (with swatch) | Hex
Note source: "From branding playbook" or "From live [url]. Open to reinterpretation."

**Current Typography** (H3)
Table: Role | Font | Weights
Note source same as above.

**Available Brand Assets** (H3)
Table: Asset | Format | Location | Notes
Links in the Location column.

**Conditional handling:**
- If New Brand Package: note that branding decisions happen during this project. No palette/font tables.
- If Existing Brand with playbook: extract from playbook.
- If Existing Brand without playbook: use scraped values, note source.
- If No Existing Brand: note the gap prominently.

---

## 3.0 Messaging

**Heading:** H1

### 3.1 Messaging Framework

**Heading:** H2

**Data source:** Strategy Brief (1.6 Messaging Framework)

Three levels:
- **Brand level:** One sentence. The overarching brand message.
- **Conversion level:** The proof points that move someone to contact.
- **Page level:** Table (Page Type | Primary Message | Supporting Points). One row per key page type.

### 3.2 Voice & Tone

**Heading:** H2

**Data source:** Strategy Brief (1.5 Voice & Tone)

2-3 paragraphs. How the brand speaks. Include specific register notes (formal/informal, language considerations). Give the designer enough to understand the copy they'll be laying out.

### 3.3 Co-Brand Messaging

**Heading:** H2 (include ONLY if a co-brand exists. Omit entirely if not applicable.)

**Data source:** Strategy Brief, Foundational Brief

How the co-brand relationship appears on the site. Who leads visually. Where the partner brand appears and where it doesn't.

---

## 4.0 Creative Direction

**Heading:** H1

This is the section designers will read most closely.

### 4.1 Bright Idea

**Heading:** H2

**Data source:** Strategy Brief (1.7 Bright Idea)

**One paragraph.** The creative concept and how it applies to the website. Not an architectural essay. Not a tagging system spec. The Bright Idea in the context of a web build. That's it.

### 4.2 Visual Aesthetic

**Heading:** H2

**Data source:** Strategy Brief creative direction, creative call notes, user input

**Fields:**
- Overall feel (paragraph: the intangible direction)
- **Photography** (H3): What photography the site needs, where it goes, how it should feel. Reference asset locations (see Content & Assets) but do not scatter individual photo descriptions through this section. The attorneys are not the face of the firm unless explicitly stated otherwise.
- **Video** (H3): If applicable. Autoplay vs. click-to-play, hero backgrounds vs. featured content.
- **Color & Typography** (H3): Reference the Branding Status section by name for current palette and fonts. Note what's open to change. Creative team proposes during design phase.

### 4.3 Design Principles

**Heading:** H2

**Data source:** Derived from strategy brief and conversation

Table: Principle | What It Means for Design | What to Avoid

3-6 rows. Each principle has a positive direction and an explicit anti-pattern. These are client-specific, not templated. Do not reuse another client's principles.

### 4.4 Design References

**Heading:** H2

**Data source:** User-provided during conversation, creative call notes

Each reference gets its own H3 with:
- Name or URL (linked)
- What to take from it (specific: navigation pattern, photography treatment, layout approach, overall vibe)
- What NOT to take from it

If a reference was mentioned by the client (not S3), note that: "Referenced by [client name] in the creative call." If it's context only and not a design reference, say so explicitly.

This section is actively built during conversation. Prompt: "Do you have any design references to share? Websites you like, mood boards, UI examples?"

---

## 5.0 Site Architecture

**Heading:** H1

### 5.1 URL Structure

**Heading:** H2

**Data source:** Strategy Brief (2.1), sitemap document, user input

Bulleted list showing the URL hierarchy. Tier structure if Multi-Local is in scope.

### 5.2 What Gets Designed

**Heading:** H2

**Data source:** Sitemap, Work Agreement, user input

Two tables:

**Unique Builds** (H3)
Table: Page | Notes

**Dynamic Modules** (H3)
Table: Module | Behavior

Follow with a note linking to the full sitemap: "Everything else is template-generated. The full sitemap ([linked filename]) documents every page, but the design work is the unique builds and module system above."

Page inventory means what gets designed. Not every URL the sitemap generates.

### 5.3 Special Features

**Heading:** H2

One H3 per feature. Each feature gets:
- What it does (1-2 sentences)
- Design implication (how it affects layout or interaction)

Only features that affect design. Not backend integrations.

---

## 6.0 Content & Assets

**Heading:** H1

A single table: Asset | Description | Location

Location column must contain links. Every row is something that actually exists right now. Do not list things that don't exist yet. No wishlists. No "None yet" entries.

Common rows:
- Photography shoots (SmugMug link, Drive folder)
- Brand assets from client (Drive folder link)
- Content folder (Drive link)
- Team roster (current site link + sitemap)
- Video assets (Frame.io link, if found)

If asset mining found nothing for a category, do not include that category.

---

## 7.0 Open Decisions & Dependencies

**Heading:** H1

A single table: Decision | Options | Who Decides

**Only design-relevant decisions.** If a decision doesn't affect the designer starting work, it doesn't belong here. HubSpot reactivation: no. Color palette direction: yes. Video testimonial placeholder approach: yes.

Do not duplicate information already covered in other sections. If branding assets are pending, that's in the Brand section, not here.

---

## 8.0 Reference Documents

**Heading:** H1

Table: Document | Type | Location

Every Location cell is a link. No "pending" notes. No DRAFT/FINAL labels unless that's the actual filename. If something doesn't have a link, ask the user for one or omit it.

This section is inherited and additive. Read MEMORY.md first. Include every document from the full pipeline, not just what this skill produced.

---

## Formatting Standards

**Font:** Open Sans for all text. No exceptions. Run `embed-fonts.py` after generating.

**Section dividers:** Gray bottom border between every H2 subsection.

**Scope callouts:** When a feature or content item is outside the Work Agreement, use a bordered callout box with light gray background and left orange border. Italic text. "This item is outside the current scope."

**Tables:** Bold header row text on transparent background. Black borders (#000000). No colored header backgrounds. No alternating row shading. Left-aligned text. No merged cells.

**Links:** Hyperlinked text in the document. Display the URL only if the link text doesn't make the destination obvious.

**Cross-references:** Always by section name, never by number. "See Branding Status" not "See section 2.5."
