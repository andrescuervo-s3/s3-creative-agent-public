# Website Creative Brief: Section Templates

Purpose: Defines the structure, fields, and formatting for every section of the Website Creative Brief. The orchestrator references this file when writing each section.

---

## Heading Level Mapping

| Skeleton Level | Heading | Example |
|---------------|---------|---------|
| 1.0, 2.0, 3.0, 4.0, 5.0, 6.0, 7.0, 8.0, 9.0 | H1 | Project Overview |
| 1.1-1.4, 2.1-2.4, 3.1+, 4.1-4.4, etc. | H2 | Client & Project Summary |
| Named blocks within sections | H3 | Homepage, Practice Area Template |
| Sub-fields | H4 | Demographics, Hover State |

---

## 1.0 Project Overview

### 1.1 Client & Project Summary

**Heading:** H2

**Data source:** Foundational Brief section 2.1, Strategy Brief, Work Agreement

**Fields:**
- Client Name
- Project Type (new build, redesign, development only, etc.)
- Scope Summary (1-2 paragraphs: what this project covers, derived from Work Agreement line items)
- Current Website URL (if redesign)
- Key Stakeholders (who approves creative, who reviews, who manages assets)

**Format:** Mix of key-value pairs and short prose. The scope summary should read as a narrative, not a checklist.

---

### 1.2 Project Objectives

**Heading:** H2

**Data source:** Strategy Brief sections 1.1, 2.1; Work Agreement; user input

**Fields:**
- Primary Objectives (numbered list, 3-5 items: what the website must accomplish)
- Secondary Objectives (numbered list, if applicable: nice-to-haves or longer-term goals)

**Format:** Numbered lists. Each objective is one sentence. Specific and measurable where possible ("increase case intake conversion rate" not "improve the website").

---

### 1.3 Success Metrics

**Heading:** H2

**Data source:** Strategy Brief, user input

**Fields:**
- KPIs (table: Metric | Target | Current Baseline | Measurement Method)

**Format:** Table. If baselines are unknown, mark "TBD" rather than omitting.

---

### 1.4 Branding Status

**Heading:** H2

**Data source:** Work Agreement, creative call notes, Foundational Brief section 3.1

**Fields:**
- Scope (one of: New Brand Package (in agreement) | Existing Brand (not in agreement) | No Existing Brand)
- Leniency Notes (what can be touched: logo, colors, typography, photography direction. Pull from creative call notes or user conversation.)
- Available Brand Assets (table: Asset | Format | Location | Notes)

**Format:** The scope line is a single bold statement at the top. Leniency notes are bullets. Assets are a table.

This is one of the first things a designer reads. Be specific. "Existing brand, typography and color palette are flexible, logo must remain as-is" is useful. "Using current branding" is not.

---

## 2.0 Creative Direction

### 2.1 Guiding Principle / Bright Idea Application

**Heading:** H2

**Data source:** Strategy Brief section 1.7 (Bright Idea), user refinement for web context

**Fields:**
- Bright Idea (restated from Strategy Brief)
- Web Application (1-2 paragraphs: how the Bright Idea translates to the website specifically. What should the user feel? What should the site communicate within 5 seconds?)

**Format:** Prose. The Bright Idea is quoted or restated. The web application is original writing that bridges strategy to design.

---

### 2.2 Visual Aesthetic

**Heading:** H2

**Data source:** Strategy Brief creative direction, user input, design references

**Fields:**
- Overall Feel (paragraph: the intangible direction. "Magazine-profile aesthetic," "editorial, not corporate," "warm authority without stiffness")
- Photography Direction (what photography the site needs, where it goes, how it should be shot or selected. Reference shoot assets if available.)
- Video Direction (if applicable: moving portraits, b-roll usage, hero backgrounds, embedded content)
- Color Application (how the brand palette applies to the web context: dark sections, light sections, accent usage, gradients)
- Typography Direction (headline treatment, body readability, accent fonts, hierarchy on screen)

**Format:** Prose paragraphs per field. This is the section designers will read most closely. Be vivid and specific. "Cool tones, bluish palette, mix of bright natural light and dark moody setups" is useful. "Clean and modern" is not.

---

### 2.3 Design Principles

**Heading:** H2

**Data source:** User input, derived from brand strategy

**Fields:**
- Principles (table: Principle | What It Means for Design | What to Avoid)

**Format:** Table, 3-6 rows. Each principle has a positive direction and an explicit anti-pattern.

Example:
| Principle | What It Means for Design | What to Avoid |
|-----------|-------------------------|---------------|
| Authority without stiffness | Serif headlines, generous whitespace, strong visual hierarchy | Corporate stock photography, rigid grid layouts |

---

### 2.4 Design References

**Heading:** H2

**Data source:** User-provided links, mood boards, uploaded documents

**Fields per reference:**
- Reference Name or URL
- What to Take From It (specific elements: navigation pattern, photography treatment, layout approach, animation style, overall vibe)
- What NOT to Take From It (if the user called out elements they dislike)

**Format:** Each reference gets its own H3 block with the fields above. Include links. If the user uploaded a mood board, describe its contents and note the filename.

This section is actively built during conversation. The skill prompts: "Do you have any design references to share? Mood boards, websites you like, UI examples, interaction patterns, anything that captures the direction."

---

## 3.0 Audiences & User Journeys

### 3.1+ (One subsection per audience)

**Heading:** H2 per audience (e.g., "3.1 Media Followers Who Become Case-Eligible")

**Data source:** Strategy Brief section 1.4 (audiences with communication angles), user refinement

**Fields per audience:**
- Audience Summary (1-2 sentences: who they are, pulled from strategy brief)
- How They Arrive (branded search, referral, social link, ad click, direct)
- What They Need to See First (the first impression that builds trust or meets their need)
- Path Through the Site (the journey from landing to conversion or goal completion)
- Design Implications (what builds trust for this specific audience: credibility signals, content depth, ease of contact, specific visual treatment)

**Format:** Prose per field, under the audience H2. The design implications field is the most important for the designer. Be specific: "This audience needs to see trial record and credentials within 3 seconds" not "needs to feel professional."

---

## 4.0 Site Architecture

### 4.1 Current Site Audit (if redesign)

**Heading:** H2

**Data source:** Foundational Brief section 2.3, user input, web research

**Fields:**
- Current URL
- Current Platform
- Key Observations (bullets: what works, what doesn't, what's missing)
- Traffic/Performance Notes (if available from foundational brief or analytics)

**Format:** URL and platform as key-value. Observations as bullets. Keep it factual, not evaluative.

---

### 4.2 Proposed Sitemap

**Heading:** H2

**Data source:** Strategy Brief section 2.1, user input, sitemap documents

**Fields:**
- Top-Level Pages (hierarchical list with page names and URL slugs)
- Sub-Pages (nested under parent pages)
- Notes per page (new build vs. existing, priority level)

**Format:** Hierarchical bulleted list. If a sitemap spreadsheet exists, link to it and summarize the structure here. Include page count.

---

### 4.3 Page Inventory

**Heading:** H2

**Data source:** Sitemap, user input

**Fields:**
- Unique Builds (table: Page | Description | Priority | Notes)
- Template Pages (table: Template Name | Pages Using It | Key Variations)

**Format:** Two tables. Unique builds are pages that need their own design (homepage, media hub, contact). Template pages are repeatable (practice area pages, attorney bios, blog posts).

---

### 4.4 Special Features

**Heading:** H2

**Data source:** Strategy Brief, Work Agreement, user input

**Fields per feature:**
- Feature Name (H3)
- Description (what it does)
- User Interaction (how the user engages with it)
- Design Considerations (layout, placement, behavior)
- Technical Dependencies (APIs, third-party services, data sources)

**Format:** H3 per feature. Examples: media hub, chatbot, case intake form, attorney filtering, content filtering, calculators, embedded video players.

---

## 5.0 Content Strategy

### 5.1 Messaging Priorities

**Heading:** H2

**Data source:** Strategy Brief section 1.6 (messaging framework), user input

**Fields:**
- Global Messaging (the overarching message hierarchy for the site)
- Per-Page Messaging (table: Page/Section | Primary Message | Supporting Points | CTA)

**Format:** Short prose for global, table for per-page. Each page row should give the designer enough context to understand the intent of that page.

---

### 5.2 Content Types & Requirements

**Heading:** H2

**Data source:** User input, strategy brief, content audit

**Fields:**
- Content Types Needed (table: Type | Where It Appears | Volume | Source | Status)

**Format:** Table. Types include: hero copy, page body copy, case results, testimonials (video and written), attorney bios, blog/resource content, FAQ, form labels, CTA copy, meta descriptions, alt text.

Status column: Exists (link to source) | Needs Writing | Needs Editing | Client to Provide

---

### 5.3 Content Inventory

**Heading:** H2

**Data source:** Foundational Brief, client website, Google Drive, Slack, user input

This is the "raw material" section. What actual content exists that the designer and copywriter can work with.

**Fields:**

**Case Results** (if applicable)
Table: Case Title | Amount | Case Type | Societal Impact | Source

**Testimonials** (if applicable)
Table: Name/Initial | Quote (excerpt) | Case Type | Format (written/video) | Source

**Awards & Credentials** (if applicable)
Table: Award | Year | Recipient | Badge Available | Source

**Attorney/Team Profiles** (if applicable)
Table: Name | Title | Specialties | Notable Achievement | Headshot Available

**Photography & Video Assets**
Table: Asset Type | Description | Location | Link

Common locations:
- SmugMug (shoot photography galleries)
- Frame.io (video/b-roll string-outs)
- Google Drive (brand assets, miscellaneous)
- Client website (existing content to pull forward)

**Media Appearances** (if applicable)
Table: Publication/Show | Type | Link | Notes

**Format:** Tables per content type. Only include categories that are relevant to this client. Each table should give the designer a clear picture of what's available to work with. Link to sources (SmugMug galleries, Frame.io, Google Drive folders, current website pages) rather than duplicating content.

---

### 5.4 SEO Content Requirements

**Heading:** H2

**Data source:** Strategy Brief section 2.2 (if SEO is in scope), Foundational Brief section 2.3

**Fields:**
- Target Keywords (table: Keyword | Search Volume | Current Ranking | Target Page)
- Content Requirements (bullets: word counts, heading structure, internal linking strategy)
- Local SEO Notes (if applicable: locations, Google Business Profile, local landing pages)

**Format:** Table for keywords, bullets for requirements. Only include if SEO is in the Work Agreement scope.

---

## 6.0 Brand Application

### 6.1 Logo & Identity Usage

**Heading:** H2

**Data source:** Foundational Brief section 3.1, brand assets, branding status from 1.4

**Fields:**
- Primary Mark (description, format, location/link)
- Usage Rules (where the logo appears on the site, minimum size, clear space)
- Variations (dark background, light background, favicon, mobile)
- Co-Branding (if applicable: how partner logos appear relative to the primary mark)

**Format:** Prose with asset links. Reference branding status from 1.4 for leniency.

---

### 6.2 Color Palette Application

**Heading:** H2

**Data source:** Foundational Brief section 3.1, strategy brief, user input

**Fields:**
- Palette (table: Swatch | Name | Hex | Usage on Site)

**Format:** Table. Be specific about web usage: "Hero section backgrounds," "CTA buttons," "Section dividers."

---

### 6.3 Typography Direction

**Heading:** H2

**Data source:** Foundational Brief, strategy brief, user input

**Fields:**
- Headline Font (name, weight, licensing status, web availability)
- Body Font (name, weight, licensing status, web availability)
- Accent/Display Font (if applicable)
- Hierarchy Notes (how type sizes and weights establish information hierarchy)

**Format:** Key-value pairs with notes. Flag any licensing concerns (e.g., "Causten Medium: licensing status unknown, may need alternative").

---

### 6.4 Photography & Video Direction

**Heading:** H2

**Data source:** Strategy Brief, shoot reports, creative direction docs, user input

**Fields:**
- Photography Style (paragraph: what the photography should feel like on the site)
- Hero Imagery (what pages need hero photography, what the heroes should show)
- Section-Specific Photography (table: Page/Section | Photography Needed | Notes)
- Video Usage (where video appears, autoplay vs. click-to-play, background vs. featured)
- Asset Sources (SmugMug gallery link, Frame.io link, Google Drive folder)

**Format:** Prose for style direction, table for section-specific needs, links for asset sources.

---

### 6.5 Co-Branding Rules

**Heading:** H2 (include only if applicable)

**Data source:** Foundational Brief, strategy brief, user input

**Fields:**
- Partner/Co-Brand Name
- Relationship (how the brands relate: parent-subsidiary, partnership, affiliate)
- Visual Hierarchy (who leads visually, size ratios, placement rules)
- Usage Rules (where co-branding appears, where it does not)

**Format:** Prose. Reference the Popok/Big Auto pattern as an example: "Big Auto appears as the operational partner behind Popok, never co-branded at the same level."

---

## 7.0 Technical Requirements

### 7.1 Platform & CMS

**Heading:** H2

**Data source:** Strategy Brief section 2.1, Work Agreement, user input

**Fields:**
- Platform (e.g., Tresio, WordPress, custom)
- CMS (e.g., DatoCMS, WordPress CMS, Contentful)
- Hosting (e.g., Netlify, Vercel, WP Engine)
- Migration Notes (if moving from another platform: what carries over, what doesn't)

**Format:** Key-value pairs with notes. Read `references/s3-tech-stack.md` for S3 platform details.

---

### 7.2 Integrations

**Heading:** H2

**Data source:** Strategy Brief, Work Agreement, user input

**Fields:**
- Integrations (table: Integration | Purpose | Provider | Notes)

**Format:** Table. Common integrations: form handling (Filevine, HubSpot, Gravity Forms), call tracking (CallRail), analytics (GA4, GTM), chat (Juvo Leads, Drift), CRM, email marketing, social feeds.

---

### 7.3 Performance & Accessibility

**Heading:** H2

**Data source:** User input, industry standards

**Fields:**
- Performance Targets (Core Web Vitals targets, page load time goals)
- Accessibility Requirements (WCAG level, specific considerations)
- Browser/Device Support (minimum supported browsers, mobile-first or responsive)

**Format:** Bullets. Only include what's relevant and specified. Do not pad with generic best practices.

---

### 7.4 Third-Party Services

**Heading:** H2

**Data source:** Strategy Brief, user input

**Fields:**
- Services (table: Service | Purpose | API/Embed | Auth Required | Notes)

**Format:** Table. Examples: YouTube Data API, Substack RSS, Instagram embeds, Google Maps, review aggregators.

---

## 8.0 Timeline & Action Items

### 8.1 Milestones

**Heading:** H2

**Data source:** Work Agreement, user input

**Fields:**
- Milestones (table: Milestone | Target Date | Status | Dependencies)

**Format:** Table. Include major phases: wireframes, design, development, content, launch.

---

### 8.2 Ownership Matrix

**Heading:** H2

**Data source:** User input

**Fields:**
- Owners (table: Responsibility | Owner | Notes)

**Format:** Table. Who designs, who develops, who writes content, who reviews, who approves, who provides assets.

---

### 8.3 Open Decisions

**Heading:** H2

**Data source:** Conversation, deferred items

**Fields:**
- Decisions (table: Decision | Options | Who Decides | Deadline)

**Format:** Table. These are unresolved questions that need answers before or during design. Each row should be specific enough to act on.

---

### 8.4 Dependencies & Blockers

**Heading:** H2

**Data source:** Conversation, ingestion phase

**Fields:**
- Dependencies/Blockers (table: Item | Depends On | Status | Impact if Delayed)

**Format:** Table. Examples: "Photography selection depends on SmugMug gallery review by Sydney," "Media hub architecture depends on content index completion."

---

## 9.0 Reference / Source Documents

**Heading:** H1

**Data source:** MEMORY.md (accumulated across pipeline), conversation

**Fields:**
- Documents (table: Document | Type | Location | Date | Notes)

**Format:** Table. Include every document from the full pipeline:
- Work Agreement
- Creative Survey
- Foundational Brief (filename, date)
- Strategy Brief (filename, date)
- This Creative Brief (filename, date)
- Sitemap (if exists)
- Shoot Reports / Creative Direction docs
- Brand Asset files / folders
- Photography galleries (SmugMug links)
- Video assets (Frame.io links)
- Meeting recordings
- Any other source documents ingested by any skill

Location column should specify: Google Drive, Local, SmugMug, Frame.io, Slack, etc.

This section is inherited and additive. Read MEMORY.md first. Present the accumulated list to the user and ask: "Here's what I have for the reference section. Anything missing?"

---

## Formatting Standards

**Section dividers:** Gray bottom border between every H2 subsection (same as strategy brief).

**Scope callouts:** When a feature or content item is outside the Work Agreement, use a bordered callout box with light gray background and left orange border. Italic text. "This item is outside the current scope."

**Tables:** Black header row, white background, alternating row shading optional. Left-aligned text. No merged cells.

**Links:** Hyperlinked text in the document. Display the URL only if the link text doesn't make the destination obvious.

**Status indicators in tables:** Use consistent labels: Exists | Needs Creation | Client to Provide | TBD | Not Applicable.
