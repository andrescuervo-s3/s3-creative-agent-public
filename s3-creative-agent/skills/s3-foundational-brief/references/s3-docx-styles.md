# S3 Document Style Reference

This spec defines the visual system for every S3 brief and deliverable produced as .docx. Every skill that generates a Word document MUST follow it. Do not deviate, interpret loosely, or substitute values.

The document generation stack is **Node.js + docx-js**. The model writes a fresh docx-js script per brief, following the code patterns in this file. After generation, run `python3 assets/embed-fonts.py output.docx` to embed Open Sans.

Validated 2026-08-04 against a full rebuild of the Colombo Law Foundational Brief. Andrés-approved.

---

## Read This Before Writing Any docx-js Code

**This document is the sole source of truth for the docx layout.** You compose the brief's docx-js by adapting the code snippets below — not by inventing new patterns, and not by copying anything from any existing brief on disk.

**Forbidden behaviors (never do these):**
- ❌ Reading an existing brief file (Drive, local disk, anywhere) to extract its layout, run-level formatting, table styling, cover pattern, or heading treatment. That file is a PREVIOUS version's output and using it as a template propagates old styling — the exact thing every version bump is designed to replace.
- ❌ Choosing a layout decision because it "matches the existing template" or is "consistent with what was there before". The prior brief's layout does not exist as a reference for you. Only this file does.
- ❌ Inventing your own palette, fonts, colors, or table borders. Every color hex, font size, and border weight is defined here. If it's not in this doc, don't add it.
- ❌ Skipping any pattern below because it's "not strictly required" — the three-band structure with shaded §2.3 band, the source lines at the end of each section, the pipe-border notes, the `HeadingLevel` styles, the dashed-underline hyperlink treatment, and the 4-column cover metadata strip are all REQUIRED, not optional.
- ❌ Producing a docx with pure black (`#000000`) text, pure white (`#FFFFFF`) background, blue (`#0563C1`) hyperlinks, or all-sides black table borders. Those are the old 3.26-era patterns and are retired.

**Required self-check before you pack the docx**: after composing all sections, verify each of these is true. If any is false, you have not followed this spec:
1. Cover has a 4-column metadata strip (Client / Authored by / Created / Last updated) — not bulleted labeled fields.
2. Every §-numbered section header uses `HeadingLevel.HEADING_1` (so the Google Docs Outline sidebar populates).
3. §2.3 Digital Snapshot is wrapped in a full-width shaded table inside a section with zero side margins (three-band structure).
4. Every section ends with a source line: dashed top border, `SOURCES` label, `·`-separated citations rendered as dashed-underline live hyperlinks.
5. Palette is warm B&W: INK `#2E2C27`, PAPER `#FCFCFB`, PAPER_BAND `#F9F9F7`, MUTED `#6B6A63`, MICRO `#B4B3A8`, RULE `#E4E3DC`. No blue hyperlinks. No all-sides black table borders.

If any check fails, correct it before writing the file. The user cannot re-run this cheaply — get it right the first time.

---

## Font

**Open Sans** for all text. No exceptions — never Calibri, Arial, Helvetica, Times New Roman, or any other font.

Google Docs has Open Sans natively, so it renders correctly on upload without embedding. **Font embedding is still required** for Word / Pages / other clients where Open Sans isn't installed. After docx-js generates the file, run:

```bash
python3 assets/embed-fonts.py output.docx
```

That embeds Regular, Bold, Italic, and BoldItalic weights (~500KB). Font files live in `assets/fonts/`.

---

## Palette — warm B&W

Every color used in the doc comes from this palette. No blue hyperlinks, no red accents, no other colors. The warmth (choosing `#2E2C27` over pure black, `#FCFCFB` over pure white) is deliberate — pure B&W reads as unconsidered.

| Token | Hex | Use |
|---|---|---|
| `INK` | `#2E2C27` | Primary text, section headings, strong emphasis |
| `PAPER` | `#FCFCFB` | Body-band background (default) |
| `PAPER_BAND` | `#F9F9F7` | Cover band + shaded-section (`band-alt`) background |
| `MUTED` | `#6B6A63` | Section labels, muted text, source-line text, italic notes |
| `MICRO` | `#B4B3A8` | Numbering, dashed underlines on hyperlinks, small tags |
| `RULE` | `#E4E3DC` | Hairline dividers, table borders, section separators |
| `RULE_STRONG` | `#E1E1DF` | Band boundary borders (top/bottom of `band-top` / `band-alt`) |

Declare as constants at the top of every script:

```js
const INK          = '2E2C27';
const PAPER        = 'FCFCFB';
const PAPER_BAND   = 'F9F9F7';
const MUTED        = '6B6A63';
const MICRO        = 'B4B3A8';
const RULE         = 'E4E3DC';
const RULE_STRONG  = 'E1E1DF';
```

---

## Page layout

US Letter, portrait. 1" margins on the default sections; the shaded-band section (see below) uses zero margins so the shading extends edge-to-edge.

| Property | Value |
|---|---|
| Paper size | US Letter — width 12240 DXA, height 15840 DXA |
| Orientation | Portrait |
| Default margins (top/bottom/left/right) | 1440 DXA (1 inch) each |
| Shaded band section margins | 0 DXA all four sides |

**1 inch = 1440 DXA. Half-points for font sizes: `size: 22` means 11pt.**

---

## Three-band document structure

Every brief is composed of three docx sections, in this order:

1. **Section 1** — cover + all content up to the first data-heavy shaded section. Normal 1" margins.
2. **Section 2** — the shaded section (e.g., Digital Snapshot in the Foundational Brief). Continuous break, zero margins on all sides, single full-width shaded table wraps the content.
3. **Section 3** — all remaining content. Continuous break, back to normal 1" margins.

If a brief has multiple shaded sections, repeat the pattern (section N shaded → section N+1 normal). The section-break trick is the ONLY way to get edge-to-edge shading in docx that survives Google Docs conversion.

```js
sections: [
  {
    properties: {
      page: {
        size: { width: 12240, height: 15840 },
        margin: { top: 1440, bottom: 1440, left: 1440, right: 1440 },
      },
    },
    children: contentBefore,
  },
  {
    properties: {
      type: SectionType.CONTINUOUS,
      page: {
        size: { width: 12240, height: 15840 },
        margin: { top: 0, bottom: 0, left: 0, right: 0 },
      },
    },
    children: [shadedBand(shadedContent)],
  },
  {
    properties: {
      type: SectionType.CONTINUOUS,
      page: {
        size: { width: 12240, height: 15840 },
        margin: { top: 1440, bottom: 1440, left: 1440, right: 1440 },
      },
    },
    children: contentAfter,
  },
],
```

---

## Cover masthead

Every brief opens with the same masthead pattern. In Draft mode, the status banner appears above the type kicker. In Finalize mode, the banner is omitted entirely — do not put "FINAL" in its place. The type kicker (e.g., "FOUNDATIONAL BRIEF") stays either way.

```js
// Draft only — omit in Finalize mode
new Paragraph({
  spacing: { after: 100 },
  border: { top: { color: INK, size: 6, space: 8, style: BorderStyle.SINGLE } },
  children: [new TextRun({
    text: 'DRAFT · NOT FOR EXTERNAL CIRCULATION',
    font: 'Open Sans', size: 18, bold: true, color: MUTED, characterSpacing: 40,
  })],
}),
// Type kicker — always
new Paragraph({
  spacing: { after: 120 },
  // If no Draft banner above, add the top border to this paragraph instead:
  // border: { top: { color: INK, size: 6, space: 8, style: BorderStyle.SINGLE } },
  children: [new TextRun({
    text: 'FOUNDATIONAL BRIEF',  // or STRATEGY BRIEF, CREATIVE BRIEF — WEBSITE, etc.
    font: 'Open Sans', size: 20, bold: true, color: MUTED, characterSpacing: 36,
  })],
}),
// Client name — always
new Paragraph({
  spacing: { after: 300 },
  children: [new TextRun({
    text: '<Client Name>', font: 'Open Sans', size: 64, bold: true, color: INK,
  })],
}),
```

**Below the client name, a 4-column metadata strip** with a bottom `INK` border (no top border — the client name provides visual separation):

```js
// 4-column meta: Client, Authored by, Created, Last updated
// (In Finalize mode add a 5th column: Finalized)
new Table({
  width: { size: 5000, type: WidthType.PERCENTAGE },
  layout: TableLayoutType.AUTOFIT,
  columnWidths: [colW, colW, colW, colW],
  borders: {
    top: NO_BORDER,
    bottom: { color: INK, size: 6, space: 8, style: BorderStyle.SINGLE },
    left: NO_BORDER, right: NO_BORDER,
    insideHorizontal: NO_BORDER, insideVertical: NO_BORDER,
  },
  rows: [new TableRow({
    children: [
      ['CLIENT', clientName],
      ['AUTHORED BY', 'Andrés Cuervo, CCO'],
      ['CREATED', 'May 27, 2026'],
      ['LAST UPDATED', 'August 4, 2026'],
    ].map(([label, val]) => new TableCell({
      width: { size: colW, type: WidthType.DXA },
      margins: { top: 100, bottom: 200, left: 0, right: 120 },
      children: [
        new Paragraph({
          spacing: { after: 40 },
          children: [new TextRun({
            text: label, font: 'Open Sans', size: 16, bold: true,
            color: MUTED, characterSpacing: 40,
          })],
        }),
        new Paragraph({
          children: [new TextRun({
            text: val, font: 'Open Sans', size: 20, color: INK,
          })],
        }),
      ],
    })),
  })],
}),
```

**Do NOT include a verbose "what changed" update note under the meta strip.** The `Last updated` date carries that meaning by itself. In prior versions we listed folded-in surveys and meetings under the cover — that's noise.

**Author defaults.** If the client CLAUDE.md doesn't specify an author, use "Andrés Cuervo, CCO". If the author is different per the CLAUDE.md, use that. Never invent.

---

## Status banner logic (Draft / Finalize)

The Draft banner is a first-page-only element. Rules:

- **New (Draft)** or **Update (Draft)**: include the `DRAFT · NOT FOR EXTERNAL CIRCULATION` banner as shown in the cover pattern.
- **Finalize**: omit the banner entirely. Add a `Finalized` column to the metadata strip with the finalize date.
- **File name**: append `_DRAFT` to the file name in Draft modes (e.g., `Colombo_Foundational_Brief_DRAFT.docx`); drop it on Finalize (`Colombo_Foundational_Brief.docx`).

**Do not** put a "FINAL" badge or watermark on finalized documents. The absence of the DRAFT banner is the signal.

---

## Heading hierarchy

Use `HeadingLevel.HEADING_1` / `HeadingLevel.HEADING_2` on the paragraph. This is what populates the Google Docs Outline sidebar with clickable jumps to every section. Custom run formatting (font, size, color, caps, letter-spacing) overrides the heading style's default look, so the visual matches this spec while navigation still works.

| Level | Where | Font | Size | Color | Case | Letter-spacing |
|---|---|---|---|---|---|---|
| H1 (H2 in docx-js `HEADING_1`) | Numbered sections (e.g., "1.0 · Intro", "2.3 · Digital Snapshot") | Open Sans Bold | 13pt (`size: 21`) | INK | ALL CAPS | `characterSpacing: 40` |
| H2 (`HEADING_2`) | Named subsections (Organizational Structure, Demographics, Brand Values, competitor names, etc.) | Open Sans Bold | 11pt (`size: 22`) | MUTED | ALL CAPS | `characterSpacing: 60` |
| Named block (H3-flavored, not `HeadingLevel`) | Audience profile names, differentiator titles, competitor names | Open Sans Bold | 15.5pt (`size: 31`) | INK | Title Case | — |

H1 paragraphs also carry a bottom `RULE` border (hairline separator under each numbered section header).

```js
function h2(text) {
  return new Paragraph({
    heading: HeadingLevel.HEADING_1,
    spacing: { before: 480, after: 240, line: 300 },
    border: { bottom: { color: RULE, size: 6, space: 4, style: BorderStyle.SINGLE } },
    children: [new TextRun({
      text: text.toUpperCase(), font: 'Open Sans', size: 21,
      bold: true, color: INK, characterSpacing: 40,
    })],
  });
}

function h4(text) {
  return new Paragraph({
    heading: HeadingLevel.HEADING_2,
    spacing: { before: 680, after: 200, line: 260 },  // generous space above subsections
    children: [new TextRun({
      text: text.toUpperCase(), font: 'Open Sans', size: 22,
      bold: true, color: MUTED, characterSpacing: 60,
    })],
  });
}
```

**Spacing note.** The gap above every H4 subsection should feel like the gap from the top of the Client Details facts strip to the "Organizational Structure" label — roughly 34pt / 680 DXA `before`. Inside clustered blocks (audience profiles, differentiators, competitors), h4 subsection margins tighten to ~18pt (`before: 360`) since those subsections are semantically related.

---

## Body text, muted italic, notes

**Body paragraph** — Open Sans Regular, 10.5pt (`size: 21`), INK color, line 1.55.

**Muted italic** — for section-intro leads (e.g., "Distilled from the three senior-stakeholder creative surveys..."). 10pt, italic, MUTED color. Use the `muted()` helper below.

**Note (pipe-border aside)** — for any procedural aside or caveat (e.g., "Direct email is off-limits for Dino, Nathan, and Travis...", "Additional GMB-only 'Google Location' listings in each market"). Left border, italic, MUTED, small left padding.

```js
function p(text) {
  return new Paragraph({
    spacing: { after: 240, line: 320 },
    children: [new TextRun({ text, font: 'Open Sans', size: 21, color: INK })],
  });
}

function muted(text) {
  return new Paragraph({
    spacing: { before: 40, after: 200, line: 300 },
    children: [new TextRun({
      text, font: 'Open Sans', size: 20, italics: true, color: MUTED,
    })],
  });
}

function note(text) {
  return new Paragraph({
    spacing: { before: 180, after: 180, line: 300 },
    border: { left: { color: RULE, size: 12, space: 10, style: BorderStyle.SINGLE } },
    indent: { left: 120 },
    children: [new TextRun({
      text, font: 'Open Sans', size: 20, italics: true, color: MUTED,
    })],
  });
}
```

**Use notes wherever an aside/caveat/procedural clarification appears.** They read as "worth knowing but not the main line." Don't wrap ordinary muted intros in note styling.

---

## Hyperlinks

Every external URL that the source-capture pipeline pulled MUST render as a live hyperlink. **No blue.** Dashed `MICRO` underline in the resting state, solid `INK` underline on hover.

- Inherit the surrounding text color (don't force blue).
- `underline: { type: 'dash', color: MICRO }` — the dashed underline is what signals clickability.

```js
new ExternalHyperlink({
  link: 'https://drive.google.com/file/d/.../view',
  children: [new TextRun({
    text: 'Work Agreement',
    font: 'Open Sans', size: 21, color: INK,
    underline: { type: 'dash', color: MICRO },
  })],
})
```

**Never emit `href="#"` placeholders.** If the skill didn't capture a URL for a source, render the source name as plain text — no fake link. See `research-tool-contract.md` for the URL-capture rules.

---

## Bulleted lists

Use `numbering` with `LevelFormat.BULLET`. Never insert raw `•` characters. Bullets carry the `MICRO` color for the marker; body text stays INK.

```js
// In the doc's numbering config:
numbering: {
  config: [
    {
      reference: 'bul',
      levels: [{
        level: 0, format: LevelFormat.BULLET, text: '•',
        alignment: AlignmentType.LEFT,
        style: { paragraph: { indent: { left: 440, hanging: 320 } } },
      }],
    },
    {
      reference: 'refs',
      levels: [{
        level: 0, format: LevelFormat.DECIMAL, text: '%1.',
        alignment: AlignmentType.LEFT,
        style: { paragraph: { indent: { left: 480, hanging: 360 } } },
      }],
    },
  ],
},

// Then to create a bullet paragraph:
new Paragraph({
  children: [...runs],
  numbering: { reference: 'bul', level: 0 },
  spacing: { before: 40, after: 60, line: 300 },
})
```

Never add blank lines between bullets. The `after: 60` DXA gives just enough breathing room.

---

## Numbered lists

Used only for the Reference / Source Documents section at the bottom of every brief. Each entry gets a top hairline `RULE` border so entries feel separated even when tightly stacked.

```js
new Paragraph({
  children: [...runs],
  numbering: { reference: 'refs', level: 0 },
  spacing: { before: 20, after: 100, line: 280 },
  border: { top: { color: RULE, size: 4, space: 6, style: BorderStyle.SINGLE } },
})
```

---

## Facts strip (top/bottom-ruled column grid)

Used at the top of §2.1 Client Details in the Foundational Brief (Founded / Offices / Intake / Annual marketing). Also usable in other briefs wherever key facts should sit above the section.

```js
function factsTable(cells) {
  const colW = Math.floor(12240 / cells.length);   // proportional DXA columns
  return new Table({
    width: { size: 5000, type: WidthType.PERCENTAGE },
    layout: TableLayoutType.AUTOFIT,
    columnWidths: cells.map(() => colW),
    borders: {
      top: { style: BorderStyle.SINGLE, size: 6, color: RULE },
      bottom: { style: BorderStyle.SINGLE, size: 6, color: RULE },
      left: NO_BORDER, right: NO_BORDER,
      insideHorizontal: NO_BORDER, insideVertical: NO_BORDER,
    },
    rows: [new TableRow({
      cantSplit: true,
      children: cells.map(c => new TableCell({
        width: { size: colW, type: WidthType.DXA },
        margins: { top: 240, bottom: 240, left: 120, right: 120 },
        children: [
          // Label — MUTED small caps
          new Paragraph({ spacing: { after: 60 }, children: [new TextRun({
            text: c.label.toUpperCase(), font: 'Open Sans', size: 17,
            bold: true, color: MUTED, characterSpacing: 40,
          })] }),
          // Value — big INK bold
          new Paragraph({ spacing: { after: c.note ? 60 : 0 }, children: [new TextRun({
            text: c.value, font: 'Open Sans',
            size: c.big ? 32 : 22, bold: true, color: INK,
          })] }),
          // Optional note — MUTED small
          ...(c.note ? [new Paragraph({ children: [new TextRun({
            text: c.note, font: 'Open Sans', size: 18, color: MUTED,
          })] })] : []),
        ],
      })),
    })],
  });
}
```

---

## Column strip (3-col or 4-col with vertical dividers)

The general-purpose parallel-comparison pattern. Used at the top of §3.2 Audiences (Book Reality / Market / Aspiration when helpful), at the top of §2.3 Digital Snapshot (Referral / Digital / Billboard TL;DR), for Paid Media split (WV / Columbus), or anywhere else the same kind of information deserves side-by-side treatment.

Difference from facts strip: **vertical `RULE` dividers between columns** (`insideVertical` set to hairline RULE).

```js
function threeCol(cols) {
  const colW = Math.floor(12240 / cols.length);
  return new Table({
    width: { size: 5000, type: WidthType.PERCENTAGE },
    layout: TableLayoutType.AUTOFIT,
    columnWidths: cols.map(() => colW),
    borders: {
      top: { style: BorderStyle.SINGLE, size: 6, color: RULE },
      bottom: { style: BorderStyle.SINGLE, size: 6, color: RULE },
      left: NO_BORDER, right: NO_BORDER,
      insideHorizontal: NO_BORDER,
      insideVertical: { style: BorderStyle.SINGLE, size: 4, color: RULE },
    },
    rows: [new TableRow({
      cantSplit: true,  // don't orphan cells across a page break
      children: cols.map(c => new TableCell({
        width: { size: colW, type: WidthType.DXA },
        margins: { top: 240, bottom: 240, left: 200, right: 200 },
        children: [
          new Paragraph({ spacing: { after: 80 }, children: [new TextRun({
            text: c.label.toUpperCase(), font: 'Open Sans', size: 17,
            bold: true, color: MUTED, characterSpacing: 40,
          })] }),
          new Paragraph({ spacing: { after: 60 }, children: [new TextRun({
            text: c.value, font: 'Open Sans',
            size: c.big ? 32 : 22, bold: true, color: INK,
          })] }),
          ...(c.note ? [new Paragraph({ children: [new TextRun({
            text: c.note, font: 'Open Sans', size: 19, color: MUTED,
          })] })] : []),
        ],
      })),
    })],
  });
}
```

Extend to 4-col by passing 4 items in `cols`. The pattern scales.

---

## Data table (Lead Docket, streaming performance, etc.)

For tabular data with a header row. Header row has a bottom `INK` rule; body rows have hairline `RULE` bottom borders. No left/right/top/vertical borders — the visual weight is on horizontal separators.

```js
function dataTable(headers, rows) {
  const colW = Math.floor(12240 / headers.length);
  return new Table({
    width: { size: 5000, type: WidthType.PERCENTAGE },
    layout: TableLayoutType.AUTOFIT,
    columnWidths: headers.map(() => colW),
    borders: {
      top: NO_BORDER, left: NO_BORDER, right: NO_BORDER, bottom: NO_BORDER,
      insideHorizontal: { style: BorderStyle.SINGLE, size: 4, color: RULE },
      insideVertical: NO_BORDER,
    },
    rows: [
      new TableRow({
        tableHeader: true,
        children: headers.map(h => new TableCell({
          width: { size: colW, type: WidthType.DXA },
          margins: { top: 120, bottom: 140, left: 0, right: 120 },
          borders: { top: NO_BORDER, left: NO_BORDER, right: NO_BORDER,
                     bottom: { style: BorderStyle.SINGLE, size: 8, color: INK } },
          children: [new Paragraph({ children: [new TextRun({
            text: h.toUpperCase(), font: 'Open Sans', size: 17,
            bold: true, color: MUTED, characterSpacing: 40,
          })] })],
        })),
      }),
      ...rows.map(cells => new TableRow({
        children: cells.map((cell, i) => new TableCell({
          width: { size: colW, type: WidthType.DXA },
          margins: { top: 140, bottom: 140, left: 0, right: 120 },
          borders: { top: NO_BORDER, left: NO_BORDER, right: NO_BORDER,
                     bottom: { style: BorderStyle.SINGLE, size: 4, color: RULE } },
          children: [new Paragraph({ children:
            (Array.isArray(cell) ? cell : [{ text: String(cell) }]).map(s => new TextRun({
              text: s.text, font: 'Open Sans', size: 20,
              bold: i > 0 || s.bold, italics: s.italics, color: s.color ?? INK,
            })),
          })],
        })),
      })),
    ],
  });
}
```

Data cells in columns 2+ are bold by default (they're the numeric/emphasis cells). Column 1 (the row label) is regular weight unless explicitly bolded via a span.

---

## Shaded band (edge-to-edge shaded section)

Used for data-heavy sections that should stand out. In the Foundational Brief, this is §2.3 Digital Snapshot. The band extends to the physical left and right page edges (achieved by putting the content in a section with zero side margins) and — because the section also has zero top/bottom margins — the shading continues visually across page breaks with no unshaded gap.

**Two-step recipe:**

1. Put the shaded section inside a `SectionType.CONTINUOUS` section with `margin: { top: 0, bottom: 0, left: 0, right: 0 }` (see three-band structure above).
2. Wrap the shaded content in a full-page-width single-cell table with `PAPER_BAND` shading and ~1" cell padding on left/right (so the content isn't jammed against the physical page edge).

```js
function shadedBand(children) {
  const tw = 12240;   // full Letter page width
  return new Table({
    width: { size: 5000, type: WidthType.PERCENTAGE },
    layout: TableLayoutType.AUTOFIT,
    columnWidths: [tw],
    borders: {
      top: NO_BORDER, bottom: NO_BORDER, left: NO_BORDER, right: NO_BORDER,
      insideHorizontal: NO_BORDER, insideVertical: NO_BORDER,
    },
    rows: [new TableRow({
      children: [new TableCell({
        width: { size: tw, type: WidthType.DXA },
        shading: { type: ShadingType.CLEAR, color: 'auto', fill: PAPER_BAND },
        margins: { top: 800, bottom: 800, left: 1440, right: 1440 },
        children,
      })],
    })],
  });
}
```

`ShadingType.CLEAR` with `fill: PAPER_BAND` is the correct cell shading. Never use `SOLID` — it renders black.

---

## Social handles grid (2-col name + description + live links)

Where the Foundational Brief lists social platforms, use a 2-column grid — never a prose sentence like "Facebook (brand + WV + OH pages), Instagram (...), ...".

```js
// CSS-side, if you want a CSS analog. In docx, use a two-column table with cell shading none.
// Each cell: bold platform name, muted description, then a row of dashed-underline hyperlink handles.
new Table({
  width: { size: 5000, type: WidthType.PERCENTAGE },
  layout: TableLayoutType.AUTOFIT,
  columnWidths: [colW, colW],   // colW = 12240 / 2 = 6120
  borders: {
    top: NO_BORDER, bottom: NO_BORDER, left: NO_BORDER, right: NO_BORDER,
    insideHorizontal: { style: BorderStyle.SINGLE, size: 4, color: RULE },
    insideVertical: NO_BORDER,
  },
  rows: platforms.map(row => new TableRow({
    children: row.map(platform => new TableCell({
      width: { size: colW, type: WidthType.DXA },
      margins: { top: 200, bottom: 200, left: 0, right: 200 },
      children: [
        new Paragraph({ children: [new TextRun({
          text: platform.name, font: 'Open Sans', size: 22, bold: true, color: INK,
        })] }),
        new Paragraph({ spacing: { before: 40, after: 80 }, children: [new TextRun({
          text: platform.description, font: 'Open Sans', size: 19, color: MUTED,
        })] }),
        // Links row: one paragraph containing all handles separated by " · "
        new Paragraph({ children: platform.links.flatMap((l, i) => [
          ...(i > 0 ? [new TextRun({ text: ' · ', font: 'Open Sans', size: 19, color: MUTED })] : []),
          new ExternalHyperlink({ link: l.url, children: [new TextRun({
            text: l.handle, font: 'Open Sans', size: 19, color: INK,
            underline: { type: 'dash', color: MICRO },
          })] }),
        ]) }),
      ],
    })),
  })),
})
```

**If a platform genuinely doesn't exist** (e.g., no TikTok account), include it with a small "Not found" pill instead of link handles. Don't fake a link.

---

## Source line

Every §-numbered section ends with a source line: dashed top border, `SOURCES` caps label in MUTED, then citation entries separated by ` · `. Each citation is a dashed-underline hyperlink pointing to the actual source URL captured during ingestion.

```js
function sourceLine(citations) {
  return new Paragraph({
    spacing: { before: 320, after: 400, line: 280 },
    border: { top: { color: RULE, size: 6, space: 8, style: BorderStyle.DASHED } },
    children: [
      new TextRun({
        text: 'SOURCES  ', font: 'Open Sans', size: 17,
        bold: true, color: MUTED, characterSpacing: 40,
      }),
      ...citations.flatMap((c, i) => [
        ...(i > 0 ? [new TextRun({ text: ' · ', font: 'Open Sans', size: 18, color: MUTED })] : []),
        c.url
          ? new ExternalHyperlink({ link: c.url, children: [new TextRun({
              text: c.text, font: 'Open Sans', size: 18, color: MUTED,
              underline: { type: 'dash', color: MICRO },
            })] })
          : new TextRun({ text: c.text, font: 'Open Sans', size: 18, color: MUTED }),
      ]),
    ],
  });
}
```

---

## Reference & Source Documents section

The last section of every brief is a numbered list of every source consulted. Uses the `refs` numbering config (decimal). Every entry that has a URL is a dashed-underline hyperlink; entries without URLs are plain text (never `#` placeholders).

Section heading:

```js
h2('§ · Reference & Source Documents'),
```

Then each entry:

```js
ol([
  { text: 'Colombo Law Sales Turnover, Sales-to-Creative / Accounts handoff', url: U.sales_turnover },
  { text: ' (Google Drive, May 2026).' },
])
```

where `ol()` produces a numbered paragraph using the `refs` config.

---

## Divider between sections

Do not use blank lines or manual dividers between sections. The `h2()` bottom border + spacing already provides visual separation. Use dividers ONLY when a specific pattern calls for it (e.g., the top+bottom rules on the facts strip). Never insert a table used as a horizontal rule — use a paragraph bottom border.

---

## Common constants and helpers

Every generator script should declare these once at the top:

```js
const NO_BORDER = { style: BorderStyle.NONE, size: 0, color: 'FFFFFF' };
const FONT = 'Open Sans';
```

Use `halfPt(pt) => pt * 2` if you prefer semantic sizing:

```js
const halfPt = pt => pt * 2;
// then size: halfPt(11) === size: 22
```

---

## Confidence vocabulary

When a section marks the confidence level of a claim (in Evidence lists, Research Logs, source citations), use one of these five terms — no synonyms, no ad-hoc alternatives:

| Term | Meaning |
|---|---|
| **Verified** | Confirmed by an independent primary source (government data, live competitor site, official profile). |
| **Corroborated** | Multiple independent sources agree, but no single primary source is authoritative. |
| **Client-Reported** | Stated by the client in surveys, discovery, or handoff docs. Not independently verified. |
| **Unverified** | Not yet confirmed by any source. Placeholder for future research. |
| **Contradicted** | Sources disagree; flag for follow-up. |

Format inline citations as: `... (Source Name — Verified)` or `... *(Client-Reported)*`.

---

## What NOT to do

- No blue hyperlinks (`#0563C1` is banned)
- No all-sides black table borders (old Word/legal-doc look)
- No pure black text (`#000000`) — use INK `#2E2C27`
- No pure white background (`#FFFFFF`) — use PAPER `#FCFCFB`
- No colored accents (no red, no orange, no green) — the client's own aversions plus the design system
- No `href="#"` placeholders for missing URLs — either link with a real URL or emit plain text
- No "FINAL" badge on finalized documents — omit the DRAFT banner instead
- No Contents / Table of Contents block — Google Docs Outline sidebar handles navigation
- No "what changed in this update" verbose paragraph under the cover — the Last updated date is enough
- No blank lines between bullets
- No raw `•` unicode characters — always via LevelFormat.BULLET
- No downstream teasers ("addressed in the Strategy Brief," "captured later in §X") — see `feedback_no_downstream_leaks` rule
- No code, HTML, or debug artifacts in the output document

---

## Document defaults (docx-js `Document` config)

```js
const doc = new Document({
  numbering: {
    config: [
      { reference: 'bul', levels: [{ level: 0, format: LevelFormat.BULLET, text: '•', alignment: AlignmentType.LEFT,
        style: { paragraph: { indent: { left: 440, hanging: 320 } } } }] },
      { reference: 'refs', levels: [{ level: 0, format: LevelFormat.DECIMAL, text: '%1.', alignment: AlignmentType.LEFT,
        style: { paragraph: { indent: { left: 480, hanging: 360 } } } }] },
    ],
  },
  styles: {
    default: {
      document: { run: { font: FONT, size: 21, color: INK } },  // 10.5pt body
    },
  },
  sections: [/* three-band structure */],
});
```

---

## Where the patterns came from

Every code snippet in this file was derived from a validated end-to-end docx generation on 2026-08-04 (Colombo Law Foundational Brief). That output is not preserved as a reference file the model can read — intentionally, per the anti-pattern rule at the top of this document. The snippets in this file ARE the reference. If you need to know how a pattern composes, adapt the snippet in this file; do not look for an example .docx to copy from.
