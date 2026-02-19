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

### Gather Context — Research First, Ask Second

The goal is to minimize what the user has to explain by doing the research upfront. Follow this sequence:

#### Step 1: Two questions only

Ask exactly two things:

1. **Existing or new client?** — Don't pre-populate client names. Let the user type it.
2. **Client name?** — Free text. Never offer a list of clients to pick from.

That's it. Do NOT ask about the topic, meeting details, position, audience, or anything else yet.

#### Step 2: Search everything immediately

As soon as you have the client name, search all available sources for recent activity:

- **Gmail** — recent emails mentioning the client name (last 2 weeks)
- **Google Drive** — documents, briefs, meeting notes, proposals for this client
- **Notion** — pages, databases, meeting notes referencing the client
- **Google Calendar** — upcoming meetings with the client name

Look for anything that suggests what this recommendation might be about — a recent email thread, a Slack discussion, a meeting note, a project update.

**Track every source URL.** As you search, save the URL/link for every email thread, Drive doc, Notion page, Calendar event, Slack message, and external link you access. You'll need these for the Reference Links section at the end of the document. Start a running list now — don't try to reconstruct it later.

#### Step 3: Surface what you found and confirm

If you find recent activity that looks like it could be the trigger for this recommendation (e.g., a recent email about building a gallery hub, meeting notes about a website redesign, a Slack thread about a campaign ask):

> "I found a recent email from [person] about [topic] for [client]. Is this recommendation about that?"

If you find multiple things, summarize the 2–3 most recent/relevant and ask which one.

If nothing recent or obvious turns up, ask: "What's this recommendation about?"

#### Step 4: Fill in the gaps

Once you know the topic, you may still need:
- **Who requested this?** — if not clear from the research
- **Is there a scheduled meeting or call?** — for the meta table date (if not, use today's date)
- **Who's the audience?** — internal (S3 team) or client-facing?
- **Does the team already have a position?** — or does this need to be figured out?

Only ask what you couldn't find in the research. If the email thread already tells you who asked and when, don't re-ask.

### Pull in Existing Briefs

For existing clients, also search Google Drive and Notion for the client's foundational brief and/or any active creative brief. These contain audience profiles, brand voice, goals, pain points, competitive landscape, and digital snapshot data.

- Use them as background context to inform the recommendation — not to reproduce, but to ensure the recommendation aligns with established facts about the client
- Reference specific data points when they strengthen the argument (e.g., site performance metrics, audience demographics, competitive positioning)

If no brief exists, that's fine — the document works without one.

### Research S3 Products and Technology

Any time the recommendation references an S3 product, proprietary system, or internal technology — the S3 Hub, a module system, a content registry, a gallery system, a locator, or any other S3-built tool — search Google Drive for existing documentation before writing the doc. This is not optional. S3 has product descriptions, architecture docs, pitch materials, and internal writeups for its products. Use them.

Search Drive for:
- The product name (e.g., "S3 Hub", "Gallery Hub", "Location Finder")
- Related terms (e.g., "content hub", "media hub", "module system")
- Product briefs, pitch decks, architecture docs, or internal descriptions

Use what the team has actually written to describe the product in the recommendation doc. If the Drive search returns nothing, flag it to the user and ask how they'd like the product described — or offer to write a draft for their review. Never describe an S3 product from assumption alone.

### Gather Visual Assets (When the Recommendation Is Visual)

Some recommendations are inherently visual — art direction for a photoshoot, creative direction for a campaign, location scouting, mood board reviews, website design direction. When the topic involves visual creative work, the document should **show** the direction, not just describe it.

#### When to embed images

Embed images in the document when:
- The user provides or references a **mood board** — capture key reference images
- The recommendation involves a **physical location** (Peerspace, venue, studio) — capture the space
- There are **design mockups, wireframes, or visual examples** that inform the direction
- The user explicitly asks for a "visually strong" or "client-facing" document with imagery

Do NOT embed images when:
- The recommendation is purely strategic (e.g., "should we build feature X?")
- The topic is technical (e.g., CMS architecture, module system)
- There's no visual component to the decision

#### How to gather images — sandbox constraints

The browser runs on the user's machine and the working environment is sandboxed separately. There is no direct file transfer path from browser to filesystem. This means many obvious approaches to downloading web images will fail. Follow this priority order:

**Priority 1: Ask the user to upload images directly.** This is the most reliable method. If the user references a mood board, location listing, or any visual source, ask them to download the key images themselves and upload them to the conversation. Be specific: "Can you download 4–6 key reference images from the Cosmos mood board and upload them here? I'll embed them directly in the document."

**Priority 2: User-uploaded files.** Read any uploaded images, PDFs, or decks and extract the visual assets. Images uploaded to the conversation are available at their upload path and can be read with `fs.readFileSync()`.

**Priority 3: WebFetch for supported domains.** Try `WebFetch` on image URLs before resorting to browser tools. Some domains work, many don't. If the fetch succeeds and returns image data, save it to the working directory.

**Priority 4: Browser screenshot capture.** As a last resort, open the page in the browser and use the `zoom` action to capture specific images as cropped screenshots. This produces lower-fidelity images (screen resolution, possible UI artifacts), but it works when nothing else does. Zoom into individual images tightly to minimize surrounding UI.

**What will NOT work** (do not waste time on these):
- `curl` / `wget` / Node.js `https.request` — the VM proxy blocks most image CDNs
- `fetch()` + canvas `toDataURL()` in the browser — cross-origin tainting blocks export
- `fetch()` + `FileReader` in the browser — base64 data gets blocked by the security layer when reading it back through tool responses
- Direct `document.querySelectorAll('img')` URL extraction — authenticated/tokenized platforms (Cosmos, some Google tools) return blocked URLs

Save all gathered images to the working directory with descriptive filenames (e.g., `moodboard_bright_portrait.png`, `venue_main_room.png`, `moodboard_dark_cinematic.png`).

#### Fallback: Image placeholder boxes

If images cannot be embedded (user didn't upload, all download methods failed), do NOT just skip them or leave plain text links. Create styled **placeholder boxes** in the document that visually indicate where an image belongs:

```javascript
// Image placeholder — shaded box with caption and link
new Table({
  rows: [new TableRow({
    children: [new TableCell({
      width: { size: 9000, type: WidthType.DXA },
      shading: { fill: "F2F2F2" },
      borders: {
        top: { style: BorderStyle.SINGLE, size: 1, color: "CCCCCC" },
        bottom: { style: BorderStyle.SINGLE, size: 1, color: "CCCCCC" },
        left: { style: BorderStyle.SINGLE, size: 1, color: "CCCCCC" },
        right: { style: BorderStyle.SINGLE, size: 1, color: "CCCCCC" },
      },
      children: [
        new Paragraph({
          alignment: AlignmentType.CENTER,
          spacing: { before: 400, after: 100 },
          children: [new TextRun({ text: "[ Mood Board Reference — Bright Editorial Portrait ]", font: "Open Sans", size: 20, color: "666666", italics: true })]
        }),
        new Paragraph({
          alignment: AlignmentType.CENTER,
          spacing: { before: 100, after: 400 },
          children: [new ExternalHyperlink({
            link: "https://cosmos.so/e/moodboard-link",
            children: [new TextRun({ text: "View on Cosmos →", font: "Open Sans", size: 18, color: "333333", underline: { type: UnderlineType.SINGLE } })]
          })]
        })
      ]
    })]
  })],
  width: { size: 9000, type: WidthType.DXA },
})
```

Use these placeholder boxes in every position where an image would have gone. The reader can click through to see the actual image. This is far better than a bullet point that says "see mood board."

#### How to embed in docx-js (when images are available)

Use `ImageRun` from the docx library:

```javascript
const { ImageRun } = require("docx");

// In a paragraph:
new Paragraph({
  children: [new ImageRun({
    type: "png",  // or "jpg" — match the file type
    data: fs.readFileSync("moodboard_bright_portrait.png"),
    transformation: { width: 580, height: 380 },  // adjust to fit page width
    altText: { title: "Mood Reference", description: "Bright editorial portrait from Cosmos mood board", name: "moodboard_bright" }
  })]
})
```

**Image sizing guidelines:**
- Full-width images: ~580px wide (fits within page margins)
- Side-by-side pair: ~280px each with a spacer column
- Thumbnail/reference: ~180px wide
- Always maintain aspect ratio — calculate height proportionally

#### Image layout patterns

**Full-width reference image** — for hero shots, location overviews, or key mood references. One image per paragraph, centered or left-aligned.

**Image grid** — for mood board compilations or multiple reference shots. Use a borderless table with 2–3 columns, images sized to fit evenly. Add a light caption below each image in MG (#666666) italic text.

**Image + text side by side** — for shot-by-shot direction where each image needs an accompanying description. Use a 2-column table: image on the left (~200px), direction text on the right.

#### Video references

Word documents can't play embedded video. Instead, use a **clickable video thumbnail**:

1. Capture a screenshot frame from the video (or use the video's thumbnail image)
2. Embed the screenshot as an `ImageRun` inside an `ExternalHyperlink` that links to the video URL
3. Add a small caption below: "▶ Click to view video" in MG italic

```javascript
const { ExternalHyperlink, ImageRun, TextRun } = require("docx");

new Paragraph({
  children: [new ExternalHyperlink({
    link: "https://www.youtube.com/watch?v=VIDEO_ID",
    children: [new ImageRun({
      type: "png",
      data: fs.readFileSync("video_thumbnail.png"),
      transformation: { width: 580, height: 326 },
      altText: { title: "Video", description: "Sizzle reel preview", name: "video_thumb" }
    })]
  })]
}),
new Paragraph({
  spacing: { before: 80 },
  children: [new TextRun({ text: "▶ Click to view video", font: "Open Sans", size: 18, italics: true, color: "666666" })]
})
```

This works in all Word viewers and lets the reader jump straight to the video from the document.

### Accept Additional Uploads

The user may upload screenshots, analytics reports, competitor examples, email threads, Slack messages, or other materials that inform the recommendation. Read everything provided. These are the raw ingredients.

## Document Structure

Every recommendation doc follows the same bones, but sections flex depending on the topic. Here's the standard structure:

### 1. Title Block
- Client name in large bold caps (22pt / size 44)
- Subtitle describing the topic in medium grey (18pt / size 36, color #666666)
- Heavy black rule underneath (4pt border)
- Meta table (borderless): Prepared for, Requested by, Prepared by, Date
- **Date handling:** If the recommendation is for a scheduled meeting or call, use that date and time. If it originated from a side chat, Slack thread, or informal request with no scheduled meeting, use the current date as the "Prepared" date. Never leave the date blank or vague like "TBD."

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
- A clear subheading (e.g., "1. Build the Gallery Hub")
- A short paragraph explaining the approach in plain language
- Bullet points for specifics
- **Visual references when relevant** — if a step involves creative direction (e.g., "Hero Portraits — Natural Light"), embed the mood board reference images inline so the reader sees exactly what you mean. Use image + text layouts for shot-by-shot direction.

Write this for the account manager. "Publish an episode and the page updates itself" — not technical jargon.

### 7. Explanatory Section (optional)
If the recommendation involves an S3 product, technology, or concept the reader might not know (like the S3 Hub, a specific module, or a proprietary system), add a brief explainer. Two paragraphs max. Think of it as the "here's the thing you'll need to be able to talk about on the call" section.

**Important:** Do NOT write S3 product explanations from memory or assumption. Always pull from the Drive research done in the "Research S3 Products and Technology" step above. Use what the team has actually written. If no documentation was found, flag this to the user and ask how they'd like to describe it — or offer to write a draft for their review.

### 8. Technical Reference (when needed)
A clearly labeled appendix at the bottom for the dev team. This is where module names, CMS architecture, data attributes, comparison tables, and implementation specs live. Introduce it with a note in lighter text: "The following details are for the development team."

Use data tables (header row + striped data rows) and 2-column comparison tables here. See the components reference for exact patterns.

### 9. Reference Links

Every recommendation doc should end with a **Reference Links** section that collects all sources used during research and writing. This gives the reader direct access to everything the recommendation draws from — no hunting through email or Drive.

Include links from every source type used:
- **Google Drive documents** — briefs, meeting notes, shot lists, mood boards, proposals (use the Google Docs/Drive sharing URL)
- **Gmail threads** — email conversations that triggered or informed the recommendation (use the Gmail thread URL, e.g., `https://mail.google.com/mail/u/0/#inbox/THREAD_ID`)
- **Slack messages** — conversations or threads referenced (use the Slack message permalink if available)
- **Notion pages** — meeting notes, project pages, databases referenced
- **Google Calendar events** — the meeting or call this recommendation is for (use the Calendar event URL)
- **External links** — mood boards (Cosmos, Pinterest), location listings (Peerspace), competitor sites, reference articles, video links

Format as a simple list with descriptive labels. Use `ExternalHyperlink` in docx-js so they're clickable:

```javascript
// Reference Links section
h1("REFERENCE LINKS"),
sectionDivider(),
new Paragraph({
  spacing: { before: 200, after: 100 },
  children: [
    new TextRun({ text: "•  ", font: "Open Sans", size: 20, color: "333333" }),
    new ExternalHyperlink({
      link: "https://docs.google.com/document/d/...",
      children: [new TextRun({ text: "Popok Creative Brief (Final, Feb 4)", font: "Open Sans", size: 20, color: "333333", underline: { type: UnderlineType.SINGLE } })]
    }),
    new TextRun({ text: " — Google Drive", font: "Open Sans", size: 20, color: "666666", italics: true })
  ]
}),
// ... repeat for each source
```

**Important:** Track sources as you go. During the Gather Context research phase, save every URL you access — every email thread, every Drive doc, every Slack link, every external URL. You'll need them for this section. Don't try to reconstruct the list after the fact.

### 10. Footer
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
- **No cross-client references** — never mention another client's project, name, or deliverable in the document unless the user explicitly asks for a comparison. Each recommendation doc stands on its own. If the approach is informed by work done for another client, describe the pattern or capability generically ("we've built this before," "this is a proven approach") — never "we did this for [Client X]"

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

`{Client_Name}_{Topic_Slug}.docx` — e.g., `Teitelbaum_S3_Gallery_Hub.docx`, `ClientName_Billboard_Strategy.docx`
