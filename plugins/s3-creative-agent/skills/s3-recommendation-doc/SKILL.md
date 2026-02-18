---
name: s3-recommendation-doc
description: |
  **S3 Recommendation Document**: Produces polished B&W internal recommendation documents (.docx) for client strategy discussions. These are short (2–6 page), account-manager-friendly documents that present a clear position on a client request — what we recommend, why, and what the approach looks like. Uses the shared S3 document style system (Open Sans, B&W palette).
  - MANDATORY TRIGGERS: recommendation doc, recommendation document, strategy recommendation, internal recommendation, client recommendation, rec doc, write a recommendation, position paper, strategy doc for client
  - Also trigger when: the user describes a client ask and wants to prepare a formal internal position or recommendation for a meeting, call, or presentation
  - Also trigger when: the user says things like "write up a recommendation for [client]", "prepare a doc for the call about [topic]", "put together our position on [topic]"
  - Do NOT trigger on: "foundational brief," "creative brief," "brief" (any kind), "proposal," "SOW," "contract," "invoice" — those are handled by other S3 skills or different workflows entirely
  - When in doubt, if someone at Studio 3 is preparing for a client call and needs a document that says "here's what we think and why," this is the skill to use
---

# S3 Recommendation Document

## What This Document Is

A recommendation doc is an internal strategy document that Studio 3 prepares before a client meeting or call. It presents a clear position on something the client has asked for — whether that's a website change, a new feature, a campaign approach, or a technical decision.

The document is written primarily for account managers and client-facing team members. It should be immediately understandable by someone who doesn't know module names, CMS architecture, or code. If there are technical details worth capturing, they go in a clearly labeled appendix at the bottom.

The visual identity is intentionally monochrome — black, white, and greys only. No accent colors, no logos, no decoration. The document's authority comes from the clarity of its thinking. This also makes the docs fast to produce and universally readable.

## Before You Start

### Required Reading

1. Read the system `docx` skill for the docx-js API reference and validation workflow
2. Read the shared S3 document style system at the plugin's `references/s3-docx-styles.md` (one level up from this skill's directory) — this defines Open Sans, the heading hierarchy, table formatting, and all base styles
3. Read this skill's own `references/s3-rec-doc-components.md` for recommendation-specific components: alert boxes, metric cards, meta tables, bold-intro bullets, comparison tables, and the title block pattern

The shared style system is the foundation. This skill's reference file adds the components unique to recommendation docs.

### Gather Context

Before writing, you need to understand the situation. If the user hasn't already provided these, ask:

1. **Client name** — who is this for?
2. **The ask** — what did the client request? (ideally with attribution: who asked, when)
3. **Meeting details** — when is the call/meeting, who's attending?
4. **Your position** — does the team have a clear recommendation, or does this need to be figured out?

### Pull in Existing Briefs (When Available)

For existing clients, the foundational brief and/or any active creative brief contain critical context — audience profiles, brand voice, goals, pain points, competitive landscape, and digital snapshot data. If either exists:

- Ask the user to upload them, or search Google Drive / Notion for the client's foundational brief
- Use them as background context to inform the recommendation — not to reproduce, but to ensure the recommendation aligns with established facts about the client
- Reference specific data points when they strengthen the argument (e.g., site performance metrics, audience demographics, competitive positioning)

If no brief exists, that's fine — the document works without one. The user may provide context through conversation, uploaded files, or research you do together.

### Accept Additional Uploads

The user may upload screenshots, analytics reports, competitor examples, email threads, Slack messages, or other materials that inform the recommendation. Read everything provided. These are the raw ingredients.

## Document Structure

Every recommendation doc follows the same bones, but sections flex depending on the topic. Here's the standard structure:

### 1. Title Block
- Client name in large bold caps (22pt / size 44)
- Subtitle describing the topic in medium grey (18pt / size 36, color #666666)
- Heavy black rule underneath (4pt border)
- Meta table (borderless): Prepared for (event + date/time), Attendees

### 2. Context Section (optional)
If there's important background data that frames the recommendation — site performance metrics, current state of something, recent changes — it goes here. Use metric cards for standout numbers, or an alert box for a key framing statement.

Not every doc needs this. If the context is simple enough to state in "The Ask," skip it.

### 3. The Ask
One or two paragraphs: what the client asked for, who asked, when, and any relevant context. This grounds the document. The reader should understand exactly what triggered this recommendation.

### 4. Current State (when the situation is nuanced)
When the recommendation depends on understanding what already exists — what's working, what's not, what's partially done — break it down here. Use an alert box for the headline takeaway, then subsections:

- **What's Already Working** — plain-language bullets (bold lead-in + explanation)
- **What's Still Manual / What's Missing** — same format

This section builds understanding before presenting the position. If the situation is straightforward, fold it into The Ask or skip it entirely.

### 5. Our Position
The core of the document. State the recommendation clearly. Two patterns work well:

**Direct position:** An alert box with the position statement, followed by supporting paragraphs that explain the reasoning.

**Option framing:** When there are genuinely two paths, present Option A vs Option B (recommended). Make the recommended option clear. Explain why one is better. Keep it to two options — three feels indecisive.

### 6. Recommended Approach
The what-we'd-actually-do section. Break it into numbered steps with H2 subheadings. Each step gets:
- A clear subheading (e.g., "1. Build the Legally Goff Podcast Page")
- A short paragraph explaining the approach in plain language
- Bullet points for specifics

Write this for the account manager. "Publish an episode and the page updates itself" — not technical jargon.

### 7. Explanatory Section (optional)
If the recommendation involves a concept the reader might not know (like "What is the S3 Hub?"), add a brief explainer. Two paragraphs max. Think of it as the "here's the thing you'll need to be able to talk about on the call" section.

### 8. Technical Reference (when needed)
A clearly labeled appendix at the bottom for the dev team. This is where module names, CMS architecture, data attributes, comparison tables, and implementation specs live. Introduce it with a note in lighter text: "The following details are for the development team."

Use data tables (header row + striped data rows) and 2-column comparison tables here. See the components reference for exact patterns.

### 9. Footer
A light rule (#CCCCCC top border), then "Prepared by Studio 3 Marketing · [Month Year]" in light grey (#999999).

## Heading Mapping

The recommendation doc maps its sections to the shared S3 heading hierarchy from `s3-docx-styles.md`:

| Recommendation Section | Heading Level | Example |
|----------------------|---------------|---------|
| Major sections | H1 (20pt, Bold, Black) | THE ASK, CURRENT STATE, OUR POSITION |
| Subsections / Steps | H2 (16pt, Bold, #333333) | What's Already Working, 1. Build the Podcast Page |
| Named items | H3 (13pt, Bold, #333333) | Rarely used in rec docs |

Note: Section headers in recommendation docs are rendered in UPPERCASE. This is a stylistic convention for this document type — apply `.toUpperCase()` to the heading text. Add a section divider (bottom border per s3-docx-styles.md) immediately after each H1.

## Writing Voice

The audience is an account manager who needs to walk into a client call feeling confident. Write accordingly:

- **Lead with what matters to the client relationship**, not the technical implementation
- **Use plain English** in the main body. No module names, no CMS jargon, no data attributes
- **Bold lead-ins on bullets** to make the doc scannable — the reader should get the gist from just the bold text
- **Be direct about the position** — "We advise against..." or "We recommend..." not "It might be worth considering..."
- **Frame benefits in client terms** — "the page updates itself" not "content is dynamically rendered"
- **Keep it tight** — 2–6 pages is the sweet spot. If you're past 6, you're overexplaining

## Building the Document

### Generation Workflow

1. Write the content first — get alignment on the position and structure before touching code
2. Build the docx-js script using the shared styles from `s3-docx-styles.md` and the components from `references/s3-rec-doc-components.md`
3. Run it: `node script.js`
4. Validate: `python scripts/office/validate.py output.docx`
5. Convert to PDF for preview: `python scripts/office/soffice.py --headless --convert-to pdf output.docx`
6. Preview pages: `pdftoppm -jpeg -r 150 output.pdf preview`
7. Save the final .docx to the outputs folder

### Naming Convention

`{Client_Name}_{Topic_Slug}.docx` — e.g., `Goff_Billboard_Strategy.docx`, `Goff_Podcast_Hub_Integration.docx`
