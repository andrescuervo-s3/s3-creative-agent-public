# S3 Document Style Reference

This file defines the enforceable document styles for all S3 briefs and deliverables produced as .docx files. Every skill that generates a Word document must follow these exact specifications. Do not deviate, interpret loosely, or substitute values.

Read the system docx skill before creating or updating any document.

---

## Font Family

**Open Sans** for all text. No exceptions. Do not use Calibri, Arial, Helvetica, Times New Roman, or any other font.

If Open Sans is not available in the document generation environment, embed it or install it before proceeding.

---

## Page Layout

| Property | Value |
|----------|-------|
| Paper size | US Letter (12240 x 15840 DXA) |
| Orientation | Portrait |
| Top margin | 1440 DXA (1 inch) |
| Bottom margin | 1440 DXA (1 inch) |
| Left margin | 1440 DXA (1 inch) |
| Right margin | 1440 DXA (1 inch) |
| Content width | 9360 DXA (6.5 inches) |

---

## Heading Hierarchy

All headings use Open Sans Bold. Colors and sizes are exact values in half-points (w:val) and hex.

| Level | Style ID | Size (pt) | w:val | Weight | Color | Spacing Before | Spacing After | Use |
|-------|----------|-----------|-------|--------|-------|----------------|---------------|-----|
| H1 | Heading1 | 20pt | 40 | Bold | #000000 | 360 | 200 | Major sections: 1.0 Intro, 2.0 Client Overview, 3.0 The Brand |
| H2 | Heading2 | 16pt | 32 | Bold | #333333 | 280 | 160 | Subsections: 2.1 Client Details, 2.2 From the Client, 3.1 Brand Essentials, 3.2 Audiences, 3.3 Competitors, 3.4 Market Differentiators |
| H3 | Heading3 | 13pt | 26 | Bold | #333333 | 200 | 120 | Named blocks: Brand Values, Mission Statement, Brand Differentiators, competitor names, audience profile names, differentiator pattern titles |
| H4 | Heading4 | 11pt | 22 | Bold | #000000 | 80 | 20 | Profile sub-categories: Demographics, Mindset, Attitude, Perception, Evidence |

All headings: line spacing 240 (single), left-aligned, no borders, no shading.

---

## Body Text

| Property | Value |
|----------|-------|
| Font | Open Sans Regular |
| Size | 11pt (w:val 22) |
| Color | #000000 (black) |
| Line spacing | 240 (single, lineRule auto) |
| Alignment | Left |

---

## Inline Formatting

**Bold (field labels):** Open Sans Bold, 11pt. Use for field labels (Name:, Year Founded:, Date:, Client:, Locations:, Overview:, URL:, Citations:) and key phrases within body text the reader should catch on a scan.

**Italic (notes/callouts):** Open Sans Italic, 11pt. Use for editorial notes, caveats, and non-primary commentary.

**Bold Italic:** Open Sans Bold Italic. Use sparingly, only for parenthetical subtitles on section headings (e.g., competitor section subtitle).

---

## Hyperlinks

| Property | Value |
|----------|-------|
| Color | #0563C1 |
| Underline | Single |
| Font | Open Sans Regular, 11pt |

All URLs must be clickable hyperlinks. For leadership profile links, place the link on its own line below the role summary.

---

## Bullet Lists

Use the docx numbering system with LevelFormat.BULLET. Never insert raw unicode bullet characters.

| Property | Value |
|----------|-------|
| Bullet character | bullet (standard dot, via numbering config) |
| Indent left | 720 DXA |
| Hanging indent | 360 DXA |
| Font | Open Sans Regular, 11pt |

Use bullet lists only when the section calls for them (Leadership, Locations, Targeting, Practice Areas, Proof Signals, Brand Values, audience profile traits, Brand Voice traits). Do not add blank lines between bullets unless the section explicitly requires spacing.

---

## Numbered Lists

Use the docx numbering system with LevelFormat.DECIMAL.

| Property | Value |
|----------|-------|
| Format | %1. |
| Indent left | 720 DXA |
| Hanging indent | 360 DXA |
| Font | Open Sans Regular, 11pt |

Use numbered lists for Client Goals and any other ordered content.

---

## Labeled Fields (No Bullets)

Competitor profiles and similar structured data use bold labels followed by content on the same line. No bullet prefix.

**Correct:**
```
Overview: Description text here.
URL: https://example.com
Citations: Source 1 | Source 2
```

**Incorrect:**
```
- Overview: Description text here.
- URL: https://example.com
```

---

## Section Dividers

Implemented as empty paragraphs with a bottom border.

| Property | Value |
|----------|-------|
| Border position | Bottom |
| Border style | Single |
| Border color | #999999 |
| Border size | 6 (3/4 pt line) |
| Border space | 1 |

Place a divider between each major section (after each x.0 group completes, between competitor profiles in 3.3, and between audience profiles in 3.2).

---

## Tables

| Property | Value |
|----------|-------|
| Width | 9360 DXA (full content width) or as appropriate |
| Width type | DXA (never use PERCENTAGE) |
| Border style | Single |
| Border color | #000000 |
| Border size | 4 |
| Borders | All sides + insideH + insideV |
| Cell margin top | 0 DXA |
| Cell margin bottom | 0 DXA |
| Cell margin left | 115 DXA |
| Cell margin right | 115 DXA |
| Header row font | Open Sans Bold, 11pt |
| Data row font | Open Sans Regular, 11pt |
| Shading type | CLEAR (never SOLID) |

Column widths must sum to table width. Set both columnWidths on the table AND width on each cell.

---

## Scope Callout

Used in the Strategy Brief for flagging ideas outside the current Work Agreement scope.

**Visual spec:**
- Full content width (9360 DXA)
- Left border: 3pt solid, orange (#E67E22)
- Background: light gray (#F5F5F5) via shading
- Text: italic, 11pt Open Sans, black
- Padding: 115 DXA all sides (matches table cell margins)
- Margin: 6pt above and below (spacing before/after: 120)

**docx-js config:**
```javascript
// Scope callout as a styled paragraph with borders and shading
new Paragraph({
  children: [
    new TextRun({
      text: "Outside current scope — requires client approval",
      italics: true,
      font: "Open Sans",
      size: 22, // 11pt
    }),
  ],
  border: {
    left: { style: BorderStyle.SINGLE, size: 6, color: "E67E22" }, // 3pt orange
  },
  shading: { type: ShadingType.SOLID, color: "F5F5F5" },
  spacing: { before: 120, after: 120 },
  indent: { left: 230 }, // ~115 DXA padding from border
})
```

---

## Document Default Styles (docx-js)

When creating new documents with docx-js, use this styles configuration:

```javascript
styles: {
  default: {
    document: {
      run: { font: "Open Sans", size: 22 }  // 11pt default
    }
  },
  paragraphStyles: [
    {
      id: "Heading1", name: "Heading 1", basedOn: "Normal", next: "Normal", quickFormat: true,
      run: { size: 40, bold: true, font: "Open Sans", color: "000000" },
      paragraph: { spacing: { before: 360, after: 200, line: 240, lineRule: "auto" } }
    },
    {
      id: "Heading2", name: "Heading 2", basedOn: "Normal", next: "Normal", quickFormat: true,
      run: { size: 32, bold: true, font: "Open Sans", color: "333333" },
      paragraph: { spacing: { before: 280, after: 160, line: 240, lineRule: "auto" } }
    },
    {
      id: "Heading3", name: "Heading 3", basedOn: "Normal", next: "Normal", quickFormat: true,
      run: { size: 26, bold: true, font: "Open Sans", color: "333333" },
      paragraph: { spacing: { before: 200, after: 120, line: 240, lineRule: "auto" } }
    },
    {
      id: "Heading4", name: "Heading 4", basedOn: "Normal", next: "Normal", quickFormat: true,
      run: { size: 22, bold: true, font: "Open Sans", color: "000000" },
      paragraph: { spacing: { before: 80, after: 20, line: 240, lineRule: "auto" } }
    }
  ]
}
```

---

## Document Status Badge

Every brief must include a status badge in the top right corner of the first page.

| Property | Draft | Final |
|----------|-------|-------|
| Position | Top right of first page, right-aligned | Same |
| Text | DRAFT | FINAL |
| Font | Open Sans Bold, 9pt, uppercase, letter-spacing 1.5px | Same |
| Background | Transparent (no fill) | #000000 (black) |
| Text color | #000000 (black) | #FFFFFF (white) |
| Border | 1.5pt solid #000000 | 1.5pt solid #000000 |
| Padding | 4px top/bottom, 14px left/right | Same |
| Border radius | 3px | Same |

Implementation: use a right-aligned text box or header element positioned at the top of the first page. The badge should sit above the 1.0 Intro heading.

---

## Cover Date Fields

Section 1.1 Cover must include the following date fields:

**Draft documents:**
- **Created**: The date the brief was first generated (Month Day, Year)
- **Last Updated**: The date of the most recent edit or update session (Month Day, Year)

**Finalized documents:**
- **Created**: The date the brief was first generated
- **Last Updated**: The date of the most recent edit before finalization
- **Finalized**: The date the document was locked down as the authority version

Every time the skill touches the document (update or finalize), the Last Updated date must be refreshed to the current date.

---

## Content Structure Rules

These rules govern how content is formatted, not what it says:

- **Heading assignments are fixed.** H1 for x.0 sections, H2 for x.x subsections, H3 for named blocks, H4 for profile categories. Do not reassign.
- **Competitor profiles use labeled fields, not bullets.** Bold label + colon + content. No bullet prefix.
- **Audience profiles are numbered** (Audience Profile 1, Audience Profile 2, etc.) with the audience name as a separate line below the profile label. Use H3 for the profile label and a bold paragraph for the audience name.
- **Audience profiles use H4 for category names** (Demographics, Mindset, Attitude, Perception, Evidence) with content under each. H4 is bold black, not italic blue.
- **Brand Voice traits use bullet lists** with bold trait name + description.
- **Dividers separate major sections**, not every subsection.
- **No blank lines between bullets** unless the section explicitly requires spacing.
- **No raw unicode characters** for bullets, dividers, or decorative elements.
- **No code, HTML, or debug artifacts** in the output document.
