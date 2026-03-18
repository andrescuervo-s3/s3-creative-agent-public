# S3 Recommendation Document — Component Library

This file defines the components specific to recommendation documents. These build on top of the shared S3 document styles defined in `s3-docx-styles.md`. Always read the shared styles first — they define Open Sans, the heading hierarchy, page layout, table rules, and base formatting.

All components below use Open Sans and the monochrome palette. Do not introduce accent colors.

---

## Color Palette

Recommendation docs use a strict greyscale palette. These constants map to every element in the document.

```javascript
const BK  = "000000";  // Black — titles, H1 text, bold lead-ins, alert titles, table headers
const DG  = "333333";  // Dark Grey — H2/H3 text, body text, table data, bullet text
const MG  = "666666";  // Medium Grey — subtitle, meta labels, alert body, technical appendix intro
const LG  = "999999";  // Light Grey — header/footer text, footer byline, divider borders
const BDR = "CCCCCC";  // Border — table cell borders, alert box borders, footer rule
const SH  = "F2F2F2";  // Shade — alert box fill, table stripe fill, metric card fill
const W   = "FFFFFF";  // White — table header text (reversed), non-striped row fill
```

---

## Document Scaffold

The base document setup for every recommendation doc. This matches the shared page layout from `s3-docx-styles.md` and adds the header/footer pattern.

```javascript
const fs = require("fs");
const {
  Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell,
  Header, Footer, AlignmentType, LevelFormat,
  BorderStyle, WidthType, ShadingType, PageNumber
} = require("docx");

const doc = new Document({
  styles: {
    default: { document: { run: { font: "Open Sans", size: 22 } } },  // 11pt default
    paragraphStyles: [
      { id: "Heading1", name: "Heading 1", basedOn: "Normal", next: "Normal", quickFormat: true,
        run: { size: 40, bold: true, font: "Open Sans", color: BK },
        paragraph: { spacing: { before: 360, after: 200, line: 240, lineRule: "auto" } } },
      { id: "Heading2", name: "Heading 2", basedOn: "Normal", next: "Normal", quickFormat: true,
        run: { size: 32, bold: true, font: "Open Sans", color: DG },
        paragraph: { spacing: { before: 280, after: 160, line: 240, lineRule: "auto" } } },
      { id: "Heading3", name: "Heading 3", basedOn: "Normal", next: "Normal", quickFormat: true,
        run: { size: 26, bold: true, font: "Open Sans", color: DG },
        paragraph: { spacing: { before: 200, after: 120, line: 240, lineRule: "auto" } } },
    ]
  },
  numbering: { config: [
    { reference: "bullets", levels: [{ level: 0, format: LevelFormat.BULLET, text: "\u2022",
      alignment: AlignmentType.LEFT,
      style: { paragraph: { indent: { left: 720, hanging: 360 } } } }] },
    { reference: "numbers", levels: [{ level: 0, format: LevelFormat.DECIMAL, text: "%1.",
      alignment: AlignmentType.LEFT,
      style: { paragraph: { indent: { left: 720, hanging: 360 } } } }] },
  ]},
  sections: [{
    properties: {
      page: {
        size: { width: 12240, height: 15840 },           // US Letter
        margin: { top: 1440, right: 1440, bottom: 1440, left: 1440 }  // 1" all sides
      }
    },
    headers: { default: new Header({ children: [
      new Paragraph({ alignment: AlignmentType.RIGHT, spacing: { after: 0 }, children: [
        new TextRun({ text: "STUDIO 3 MARKETING", size: 16, font: "Open Sans", color: LG }),
        new TextRun({ text: "  |  ", size: 16, font: "Open Sans", color: BDR }),
        new TextRun({ text: "CONFIDENTIAL", size: 16, font: "Open Sans", color: MG })
      ]})
    ]})},
    footers: { default: new Footer({ children: [
      new Paragraph({ alignment: AlignmentType.CENTER, children: [
        new TextRun({ text: "Page ", size: 16, font: "Open Sans", color: LG }),
        new TextRun({ children: [PageNumber.CURRENT], size: 16, font: "Open Sans", color: LG })
      ]})
    ]})},
    children: [
      // Document content goes here
    ]
  }]
});

Packer.toBuffer(doc).then(b => {
  fs.writeFileSync("output.docx", b);
  console.log("Done");
});
```

---

## Border and Margin Shorthands

These shorthands keep component code clean.

```javascript
// No-border (for meta table cells)
const nb  = { style: BorderStyle.NONE, size: 0, color: W };
const nbs = { top: nb, bottom: nb, left: nb, right: nb };

// Standard table border
const tb  = { style: BorderStyle.SINGLE, size: 1, color: BDR };
const tbs = { top: tb, bottom: tb, left: tb, right: tb };

// Standard cell margins
const cm = { top: 80, bottom: 80, left: 120, right: 120 };
```

---

## Title Block

The title block appears at the top of every recommendation doc. It's not a heading — it's a custom layout element.

```javascript
// Top spacer
new Paragraph({ spacing: { before: 600, after: 0 }, children: [] }),

// Client name — large bold caps
new Paragraph({ spacing: { after: 0 }, children: [
  new TextRun({ text: "CLIENT NAME", bold: true, size: 44, font: "Open Sans", color: BK })
]}),

// Subtitle — topic description
new Paragraph({ spacing: { before: 60, after: 0 }, children: [
  new TextRun({ text: "Topic or Recommendation Title", size: 36, font: "Open Sans", color: MG })
]}),

// Heavy rule
new Paragraph({
  spacing: { before: 200, after: 0 },
  border: { bottom: { style: BorderStyle.SINGLE, size: 4, color: BK, space: 8 } },
  children: []
}),
```

---

## Meta Table

A borderless two-column table that sits below the title block. Contains meeting context.

```javascript
new Table({
  width: { size: 9360, type: WidthType.DXA },
  columnWidths: [2400, 6960],
  rows: [
    new TableRow({ children: [
      new TableCell({ borders: nbs, width: { size: 2400, type: WidthType.DXA }, margins: cm,
        children: [new Paragraph({ children: [
          new TextRun({ text: "Prepared for:", bold: true, size: 20, font: "Open Sans", color: MG })
        ]})]
      }),
      new TableCell({ borders: nbs, width: { size: 6960, type: WidthType.DXA }, margins: cm,
        children: [new Paragraph({ children: [
          new TextRun({ text: "Internal Discussion — Wed Feb 11, 2026 @ 10 AM PST", size: 20, font: "Open Sans", color: DG })
        ]})]
      })
    ]}),
    new TableRow({ children: [
      new TableCell({ borders: nbs, width: { size: 2400, type: WidthType.DXA }, margins: cm,
        children: [new Paragraph({ children: [
          new TextRun({ text: "Attendees:", bold: true, size: 20, font: "Open Sans", color: MG })
        ]})]
      }),
      new TableCell({ borders: nbs, width: { size: 6960, type: WidthType.DXA }, margins: cm,
        children: [new Paragraph({ children: [
          new TextRun({ text: "Andrés Cuervo, Edwin Minassian, Sydney Schneider", size: 20, font: "Open Sans", color: DG })
        ]})]
      })
    ]}),
  ]
}),
```

---

## Section Header with Divider

Major sections use H1 from the shared styles, rendered in UPPERCASE, with a divider rule immediately after. This is the recommendation doc's signature visual pattern.

```javascript
const sh = t => [
  new Paragraph({
    spacing: { before: 360, after: 0 },
    children: [new TextRun({ text: t.toUpperCase(), bold: true, size: 40, font: "Open Sans", color: BK })]
  }),
  new Paragraph({
    spacing: { before: 0, after: 200 },
    border: { bottom: { style: BorderStyle.SINGLE, size: 3, color: BK, space: 4 } },
    children: []
  })
];

// Usage:
...sh("The Ask"),
...sh("Our Position"),
```

---

## Subsection Header

Maps to H2 from the shared styles. Used for steps in the recommended approach and subsections within Current State.

```javascript
const sub = t => new Paragraph({
  spacing: { before: 280, after: 160 },
  children: [new TextRun({ text: t, bold: true, size: 32, font: "Open Sans", color: DG })]
});

// Usage:
sub("What's Already Working"),
sub("1. Build the Podcast Page"),
```

---

## Body Paragraph

Standard body text with optional spacing and color overrides.

```javascript
const bp = (t, o = {}) => new Paragraph({
  spacing: { before: o.sb || 80, after: o.sa || 80 },
  children: [new TextRun({ text: t, size: 22, font: "Open Sans", color: o.c || DG })]
});

// Multi-run variant for mixed formatting within a paragraph
const bpMulti = (runs, o = {}) => new Paragraph({
  spacing: { before: o.sb || 80, after: o.sa || 80 },
  children: runs
});

// Usage:
bp("The site is performing. Any changes should protect these numbers."),
bp("Technical note for the dev team.", { c: MG }),  // lighter text for appendix intro
bpMulti([
  new TextRun({ text: "Option A: ", bold: true, size: 22, font: "Open Sans", color: BK }),
  new TextRun({ text: "Build it as a standalone page.", size: 22, font: "Open Sans", color: DG }),
]),
```

---

## Bold-Intro Bullet

The workhorse bullet pattern for recommendation docs. Bold lead-in phrase in black, followed by explanation text in dark grey. Makes the document scannable — the reader can get the gist from just the bold text.

```javascript
const bi = (b, n) => new Paragraph({
  numbering: { reference: "bullets", level: 0 },
  spacing: { before: 60, after: 60 },
  children: [
    new TextRun({ text: b, bold: true, size: 22, font: "Open Sans", color: BK }),
    new TextRun({ text: n, size: 22, font: "Open Sans", color: DG })
  ]
});

// Usage:
bi("The homepage Media Hub carousel ", "automatically pulls in new content as it's published."),
bi("Powered by the S3 Hub ", "— our adaptive content system that manages assets in one place."),
```

---

## Plain Bullet

Standard bullet without bold lead-in. Used for lists of specifics within a step.

```javascript
const biPlain = t => new Paragraph({
  numbering: { reference: "bullets", level: 0 },
  spacing: { before: 60, after: 60 },
  children: [new TextRun({ text: t, size: 22, font: "Open Sans", color: DG })]
});

// Usage:
biPlain("Latest episode automatically appears at the top of the page."),
biPlain("Each episode includes an embedded player, description, and topic tags."),
```

---

## Alert Box

A shaded callout box with a heavy left border. Used for key takeaways, position statements, and important framing. The left border accent is black — no color.

```javascript
const alertBox = (title, body) => new Table({
  width: { size: 9360, type: WidthType.DXA },
  columnWidths: [9360],
  rows: [new TableRow({ children: [new TableCell({
    borders: {
      top:    { style: BorderStyle.SINGLE, size: 1, color: BDR },
      bottom: { style: BorderStyle.SINGLE, size: 1, color: BDR },
      left:   { style: BorderStyle.SINGLE, size: 6, color: BK },   // Heavy left accent
      right:  { style: BorderStyle.SINGLE, size: 1, color: BDR }
    },
    width: { size: 9360, type: WidthType.DXA },
    margins: { top: 160, bottom: 160, left: 240, right: 240 },
    shading: { fill: SH, type: ShadingType.CLEAR },
    children: [
      new Paragraph({ spacing: { before: 0, after: 80 }, children: [
        new TextRun({ text: title, bold: true, size: 22, font: "Open Sans", color: BK })
      ]}),
      new Paragraph({ spacing: { before: 0, after: 0 }, children: [
        new TextRun({ text: body, size: 20, font: "Open Sans", color: MG })
      ]})
    ]
  })]})
]});

// Usage:
alertBox(
  "We advise against inserting billboard graphics directly into the homepage layout.",
  "The site is generating 547 leads/month at a 91.3% quality rate. The brand and its digital presence are working."
),

alertBox(
  "Good news: we're not starting from scratch.",
  "The Goff site already has the same technology that powers the S3 Hub on our own site."
),
```

---

## Metric Card

A shaded cell with a large centered number and a small label below. Used for displaying standout performance data. Group 2–4 metric cards in a single-row table.

```javascript
const mc = (value, label) => new TableCell({
  borders: tbs,
  width: { size: 3120, type: WidthType.DXA },  // Adjust based on column count
  margins: { top: 160, bottom: 160, left: 120, right: 120 },
  shading: { fill: SH, type: ShadingType.CLEAR },
  children: [
    new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 40 }, children: [
      new TextRun({ text: value, bold: true, size: 32, font: "Open Sans", color: BK })
    ]}),
    new Paragraph({ alignment: AlignmentType.CENTER, spacing: { before: 0 }, children: [
      new TextRun({ text: label, size: 18, font: "Open Sans", color: MG })
    ]})
  ]
});

// Usage (3-card row):
new Table({
  width: { size: 9360, type: WidthType.DXA },
  columnWidths: [3120, 3120, 3120],
  rows: [new TableRow({ children: [
    mc("547", "Leads / Month"),
    mc("91.3%", "Lead Quality Rate"),
    mc("80%", "Page 1 Keywords")
  ]})]
}),
```

---

## Data Table (Header + Striped Rows)

Used in the Technical Reference section for structured data. Black header row with white text, alternating stripe on data rows.

```javascript
// Header row — black fill, white text
const hr = cols => new TableRow({ children: cols.map((t, i) => new TableCell({
  borders: tbs,
  width: { size: i === 0 ? 2340 : (9360 - 2340) / (cols.length - 1), type: WidthType.DXA },
  margins: cm,
  shading: { fill: BK, type: ShadingType.CLEAR },
  children: [new Paragraph({ children: [
    new TextRun({ text: t, bold: true, size: 20, font: "Open Sans", color: W })
  ]})]
}))});

// Data row — optional stripe
const dr = (cells, stripe) => new TableRow({ children: cells.map((t, i) => new TableCell({
  borders: tbs,
  width: { size: i === 0 ? 2340 : (9360 - 2340) / (cells.length - 1), type: WidthType.DXA },
  margins: cm,
  shading: { fill: stripe ? SH : W, type: ShadingType.CLEAR },
  children: [new Paragraph({ children: [
    new TextRun({ text: t, size: 20, font: "Open Sans", color: DG })
  ]})]
}))});

// Usage:
new Table({
  width: { size: 9360, type: WidthType.DXA },
  columnWidths: [2340, 3510, 3510],
  rows: [
    hr(["Page", "Modules in Use", "Status"]),
    dr(["Homepage", "mod_media_hub (carousel)", "Dynamic — working"], false),
    dr(["Brooke's Bites", "mod_hero + mod_latest_post", "Dynamic — working"], true),
    dr(["Billboards", "mod_image_slider (hardcoded)", "Static — needs migration"], false),
  ]
}),
```

---

## 2-Column Comparison Table

Used in the Technical Reference for side-by-side comparisons. Equal-width columns.

```javascript
// Comparison header row
const hr2 = (c1, c2) => new TableRow({ children: [
  new TableCell({ borders: tbs, width: { size: 4680, type: WidthType.DXA }, margins: cm,
    shading: { fill: BK, type: ShadingType.CLEAR },
    children: [new Paragraph({ children: [
      new TextRun({ text: c1, bold: true, size: 20, font: "Open Sans", color: W })
    ]})]
  }),
  new TableCell({ borders: tbs, width: { size: 4680, type: WidthType.DXA }, margins: cm,
    shading: { fill: BK, type: ShadingType.CLEAR },
    children: [new Paragraph({ children: [
      new TextRun({ text: c2, bold: true, size: 20, font: "Open Sans", color: W })
    ]})]
  })
]});

// Comparison data row
const dr2 = (c1, c2, stripe) => new TableRow({ children: [
  new TableCell({ borders: tbs, width: { size: 4680, type: WidthType.DXA }, margins: cm,
    shading: { fill: stripe ? SH : W, type: ShadingType.CLEAR },
    children: [new Paragraph({ children: [
      new TextRun({ text: c1, size: 20, font: "Open Sans", color: DG })
    ]})]
  }),
  new TableCell({ borders: tbs, width: { size: 4680, type: WidthType.DXA }, margins: cm,
    shading: { fill: stripe ? SH : W, type: ShadingType.CLEAR },
    children: [new Paragraph({ children: [
      new TextRun({ text: c2, size: 20, font: "Open Sans", color: DG })
    ]})]
  })
]});

// Usage:
new Table({
  width: { size: 9360, type: WidthType.DXA },
  columnWidths: [4680, 4680],
  rows: [
    hr2("S3 Hub (Full)", "Client (Current)"),
    dr2("3-axis tagging matrix", "1-axis tagging (categories only)", false),
    dr2("70 items across 3 types", "Blog posts with 4 categories", true),
    dr2("Client-side filtering + URL params", "Server-rendered category pages", false),
  ]
}),
```

---

## Document Footer

The closing element on every recommendation doc.

```javascript
// Top spacer
new Paragraph({ spacing: { before: 400, after: 0 }, children: [] }),

// Light rule
new Paragraph({
  border: { top: { style: BorderStyle.SINGLE, size: 1, color: BDR, space: 8 } },
  children: [
    new TextRun({ text: "Prepared by Studio 3 Marketing  \u00B7  February 2026", size: 18, font: "Open Sans", color: LG })
  ]
})
```

---

## Assembly Pattern

A complete recommendation doc assembles these components in order within the `children` array:

```javascript
children: [
  // 1. Title Block
  ...titleBlock("CLIENT NAME", "Recommendation Topic"),

  // 2. Meta Table
  metaTable("Internal Discussion — Date @ Time", "Attendee 1, Attendee 2"),
  spacer(),

  // 3. Context (optional)
  ...sh("Current Site Performance"),
  metricCards([...]),  // or alertBox(...)
  bp("Framing paragraph."),

  // 4. The Ask
  ...sh("The Ask"),
  bp("What the client asked for."),

  // 5. Current State (if needed)
  ...sh("Current State"),
  alertBox("Headline takeaway.", "Supporting context."),
  spacer(),
  sub("What's Already Working"),
  bi("Thing one ", "explanation."),
  bi("Thing two ", "explanation."),
  sub("What's Still Manual"),
  bi("Thing three ", "explanation."),

  // 6. Our Position
  ...sh("Our Position"),
  alertBox("Position statement.", "Supporting evidence."),
  bp("Additional reasoning."),

  // 7. Recommended Approach
  ...sh("Recommended Approach"),
  sub("1. First Step"),
  bp("What this step does."),
  biPlain("Specific detail."),
  sub("2. Second Step"),
  bp("What this step does."),

  // 8. Explanatory Section (optional)
  ...sh("What is [Concept]?"),
  bp("Plain-language explanation."),

  // 9. Technical Reference (optional)
  ...sh("Technical Reference"),
  bp("The following details are for the development team.", { c: MG }),
  // Data tables, comparison tables, build specs...

  // 10. Footer
  ...footer("February 2026"),
]
```

Sections are flexible — include only what the specific recommendation needs. A simple recommendation might skip Context, Current State, Explanatory, and Technical Reference entirely, producing a clean 2-page doc with just The Ask, Our Position, and Recommended Approach.
