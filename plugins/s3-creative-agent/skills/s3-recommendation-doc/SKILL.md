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

As soon as you have the client name, search **all** of the following sources for recent activity. Do not skip any:

- **Gmail** — recent emails mentioning the client name (last 2 weeks)
- **Google Drive** — documents, briefs, meeting notes, proposals for this client
- **Slack** — messages and threads mentioning the client name across all channels
- **Notion** — pages, databases, meeting notes referencing the client
- **Google Calendar** — upcoming meetings with the client name

Search every source in this list. Slack is especially important — many client discussions happen there first and may not exist anywhere else. If a connector is unavailable, note it and move on, but never skip a source that is connected.

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

#### Step 5: Ask about image references (when the topic is visual)

If the recommendation involves anything visual — a photoshoot, art direction, a location, a mood board, website design, campaign creative, or anything where the user or their sources reference images, links to visual platforms (Cosmos, Pinterest, Peerspace, Behance, etc.), or visual assets — ask:

> "Would you like to upload any image references for the document? For example, mood board screenshots, location photos, design mockups, or inspiration images. I can embed them directly in the recommendation."

If the user shares **links** to visual sources (mood boards, Peerspace listings, etc.) rather than uploading images, let them know:

> "I can't pull images directly from that link into the document. Could you download the key reference images and upload them here? I'll embed them in the right sections."

If the user uploads images (individual files or a zip), categorize them by looking at the content:
- **Location / venue photos** — images of a physical space (studio, office, event venue)
- **Mood board / inspiration** — styled reference shots, color palettes, tone examples
- **Design mockups / wireframes** — UI designs, layout concepts, visual comps
- **Existing brand assets** — logos, current website screenshots, campaign examples
- **Portraits / headshots** — reference shots of people, styling examples

Confirm with the user: "I see [N] location photos and [N] mood board references. I'll place the location shots in the venue section and the mood references alongside the creative direction. Sound right?"

If the recommendation isn't visual, skip this step entirely.

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

#### How to get images into the document

**The only reliable method is user uploads.** The sandbox environment blocks downloading images from external URLs (proxy restrictions, cross-origin security, base64 filtering). Do not attempt `curl`, `wget`, `fetch()`, or any other download approach — they will all fail.

When the user uploads images (individual files or a .zip), they land at `/mnt/uploads/` and can be read directly with `fs.readFileSync()`. Extract zips to the working directory first.

If the user shares links instead of files, ask them to download and upload the images. Be direct about why: "I can embed images directly in the document, but I need the actual image files — could you download them and upload here?"

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

#### How to embed images in docx-js

All image layouts below have been tested and verified. The critical requirements are:
- `TableLayoutType.FIXED` on every table that contains images
- `columnWidths` array on the table matching the cell widths
- Image `transformation` width must fit inside its table cell
- Page content area is 9360 DXA (6.5 inches) with 1-inch margins on Letter

**Image helper function:**

```javascript
const { ImageRun, Table, TableRow, TableCell, TableLayoutType, WidthType, BorderStyle, Paragraph, TextRun } = require("docx");

const NONE_BORDER = { style: BorderStyle.NONE, size: 0, color: "FFFFFF" };
const NO_BORDERS = { top: NONE_BORDER, bottom: NONE_BORDER, left: NONE_BORDER, right: NONE_BORDER };

function embedImage(filepath, widthPx) {
  const data = fs.readFileSync(filepath);
  const ext = filepath.endsWith('.png') ? 'png' : 'jpg';
  // Calculate height from source aspect ratio. Default to 0.65 for landscape photos.
  // Adjust ratio based on actual image dimensions if known.
  const ratio = 0.65;
  const heightPx = Math.round(widthPx * ratio);
  return new ImageRun({
    type: ext,
    data: data,
    transformation: { width: widthPx, height: heightPx },
    altText: { title: "Reference", description: filepath.split('/').pop(), name: filepath.split('/').pop().replace(/\s/g, '_') }
  });
}

function imageCaption(text) {
  return new Paragraph({
    spacing: { before: 80, after: 200 },
    children: [new TextRun({ text, italics: true, size: 18, font: "Open Sans", color: "666666" })]
  });
}
```

**Image sizing guidelines:**
- Full-width: 580px (fits within 9360 DXA page content area)
- Side-by-side pair: 290px each (in 4680 DXA columns)
- Three-up grid: 190px each (in 3120 DXA columns)
- Image + text: 260px image (in 4200 DXA column)
- Always calculate height from the source image's actual aspect ratio

#### Tested layout patterns

**1. Full-width image** — location overviews, hero mood references, key shots:

```javascript
new Paragraph({ children: [embedImage("venue_main.jpeg", 580)] }),
imageCaption("Daylight loft studio — natural light, floor-to-ceiling windows"),
```

**2. Side-by-side pair** — comparing two references, before/after, two angles:

```javascript
new Table({
  columnWidths: [4680, 4680],
  layout: TableLayoutType.FIXED,
  rows: [
    new TableRow({ children: [
      new TableCell({ borders: NO_BORDERS, width: { size: 4680, type: WidthType.DXA },
        children: [new Paragraph({ children: [embedImage("mood_bright.jpeg", 290)] })] }),
      new TableCell({ borders: NO_BORDERS, width: { size: 4680, type: WidthType.DXA },
        children: [new Paragraph({ children: [embedImage("mood_dark.jpeg", 290)] })] }),
    ]}),
    new TableRow({ children: [
      new TableCell({ borders: NO_BORDERS, width: { size: 4680, type: WidthType.DXA },
        children: [imageCaption("Bright editorial")] }),
      new TableCell({ borders: NO_BORDERS, width: { size: 4680, type: WidthType.DXA },
        children: [imageCaption("Dark cinematic")] }),
    ]}),
  ],
  width: { size: 9360, type: WidthType.DXA },
}),
```

**3. Three-up grid** — mood board compilations, multiple reference shots:

```javascript
new Table({
  columnWidths: [3120, 3120, 3120],
  layout: TableLayoutType.FIXED,
  rows: [
    new TableRow({ children: [
      new TableCell({ borders: NO_BORDERS, width: { size: 3120, type: WidthType.DXA },
        children: [new Paragraph({ children: [embedImage("ref_1.jpeg", 190)] })] }),
      new TableCell({ borders: NO_BORDERS, width: { size: 3120, type: WidthType.DXA },
        children: [new Paragraph({ children: [embedImage("ref_2.jpeg", 190)] })] }),
      new TableCell({ borders: NO_BORDERS, width: { size: 3120, type: WidthType.DXA },
        children: [new Paragraph({ children: [embedImage("ref_3.jpeg", 190)] })] }),
    ]}),
    new TableRow({ children: [
      new TableCell({ borders: NO_BORDERS, width: { size: 3120, type: WidthType.DXA }, children: [imageCaption("Caption A")] }),
      new TableCell({ borders: NO_BORDERS, width: { size: 3120, type: WidthType.DXA }, children: [imageCaption("Caption B")] }),
      new TableCell({ borders: NO_BORDERS, width: { size: 3120, type: WidthType.DXA }, children: [imageCaption("Caption C")] }),
    ]}),
  ],
  width: { size: 9360, type: WidthType.DXA },
}),
```

**4. Image + text side by side** — shot direction, location details with description:

```javascript
new Table({
  columnWidths: [4200, 5160],
  layout: TableLayoutType.FIXED,
  rows: [new TableRow({ children: [
    new TableCell({ borders: NO_BORDERS, width: { size: 4200, type: WidthType.DXA }, verticalAlign: "top",
      children: [new Paragraph({ children: [embedImage("location_kitchen.jpeg", 260)] })] }),
    new TableCell({ borders: NO_BORDERS, width: { size: 5160, type: WidthType.DXA }, verticalAlign: "top", margins: { left: 200 },
      children: [
        new Paragraph({ spacing: { after: 120 }, children: [new TextRun({ text: "Kitchen / Prep Area", bold: true, size: 24, font: "Open Sans" })] }),
        new Paragraph({ children: [new TextRun({ text: "Description of this area and how it will be used during the shoot.", size: 20, font: "Open Sans", color: "333333" })] }),
      ] }),
  ]})],
  width: { size: 9360, type: WidthType.DXA },
}),
```

#### Where to place images in the document

Place uploaded images based on their category and the document section they support:

| Image Category | Where It Goes | Layout Pattern |
|---|---|---|
| Location / venue photos | Context Section or Recommended Approach (venue subsection) | Full-width for hero shot, side-by-side or three-up for multiple angles |
| Mood board / inspiration | Recommended Approach (creative direction subsections) | Side-by-side for contrasting moods, three-up for mood compilations |
| Design mockups / wireframes | Our Position or Recommended Approach | Full-width for key mockup, image+text for annotated walkthroughs |
| Portraits / headshot refs | Recommended Approach (shot categories) | Image+text with direction notes alongside |
| Brand assets / screenshots | Current State or Context Section | Full-width or image+text with analysis |

When placing images, add them **inline with the relevant text** — right after the paragraph that describes what the image shows. Don't dump all images into a separate "Visual References" section at the end.

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
