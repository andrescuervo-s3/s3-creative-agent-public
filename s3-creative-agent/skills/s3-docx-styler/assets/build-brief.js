// build-brief.js — deterministic S3 brief renderer.
//
// Model composes by calling exported helpers. Every helper hardcodes the
// correct S3 visual system (warm B&W palette, HeadingLevel styles, dashed
// hyperlinks, source lines, pipe notes, shaded band via section-break trick,
// percentage-width AUTOFIT tables). Model cannot produce wrong-styled output.
//
// USAGE:
//   const B = require('./build-brief.js');
//   const doc = B.buildDoc({
//     cover: { client: 'Colombo Law', authored_by: 'Andrés Cuervo, CCO',
//              created: 'May 27, 2026', last_updated: 'Aug 5, 2026', mode: 'Update Draft' },
//     bands: [
//       { normal: [ B.h2('1.0 · Intro'), B.p('…'), B.h2('2.1 · Client Details'), … ] },
//       { shaded: [ B.h2('2.3 · Digital Snapshot'), … ] },
//       { normal: [ B.h2('3.1 · Brand Essentials'), … ] },
//     ],
//   });
//   await B.writeDoc(doc, '/path/to/output.docx');

const fs = require('fs');
const path = require('path');
const {
  Document, Packer, Paragraph, TextRun, ExternalHyperlink,
  HeadingLevel, AlignmentType, Table, TableRow, TableCell,
  WidthType, ShadingType, BorderStyle, SectionType, TableLayoutType,
  LevelFormat,
} = require('docx');

// ---------- palette ----------
const INK         = '2E2C27';
const PAPER       = 'FCFCFB';
const PAPER_BAND  = 'F9F9F7';
const MUTED       = '6B6A63';
const MICRO       = 'B4B3A8';
const RULE        = 'E4E3DC';
const RULE_STRONG = 'E1E1DF';

const FONT = 'Open Sans';
const NO_BORDER = { style: BorderStyle.NONE, size: 0, color: 'FFFFFF' };
const halfPt = pt => Math.round(pt * 2);
const dxa    = pt => Math.round(pt * 20);

// ---------- inline runs (used by p, bullets, sourceLine cells) ----------
// A "run" is either a string, {text, bold?, italics?, color?, size?, url?}, or an
// already-constructed ExternalHyperlink / TextRun.
function makeRun(r, defaults = {}) {
  if (r && typeof r === 'object' && (r instanceof TextRun || r instanceof ExternalHyperlink)) return r;
  const spec = typeof r === 'string' ? { text: r } : r;
  const size = spec.size ?? defaults.size ?? halfPt(10.5);
  const color = spec.color ?? defaults.color ?? INK;
  if (spec.url) {
    return new ExternalHyperlink({
      link: spec.url,
      children: [new TextRun({
        text: spec.text, font: FONT, size, color,
        bold: !!spec.bold, italics: !!spec.italics,
        underline: { type: 'dash', color: MICRO },
      })],
    });
  }
  return new TextRun({
    text: spec.text, font: FONT, size, color,
    bold: !!spec.bold, italics: !!spec.italics,
  });
}

// ---------- headings ----------
function h2(text, opts = {}) {
  return new Paragraph({
    heading: HeadingLevel.HEADING_1,
    spacing: { before: 480, after: 240, line: 300 },
    border: { bottom: { color: RULE, size: 6, space: 4, style: BorderStyle.SINGLE } },
    children: [new TextRun({
      text: String(text).toUpperCase(), font: FONT, size: halfPt(10.5),
      bold: true, color: INK, characterSpacing: 40,
    })],
  });
}

function h4(text, opts = {}) {
  return new Paragraph({
    heading: HeadingLevel.HEADING_2,
    spacing: { before: opts.before ?? 680, after: 200, line: 260 },
    children: [new TextRun({
      text: String(text).toUpperCase(), font: FONT, size: halfPt(11),
      bold: true, color: MUTED, characterSpacing: 60,
    })],
  });
}

function eyebrow(text, opts = {}) {
  return new Paragraph({
    spacing: { before: opts.before ?? 60, after: opts.after ?? 60 },
    children: [new TextRun({
      text: String(text).toUpperCase(), font: FONT, size: halfPt(9),
      bold: true, color: MUTED, characterSpacing: 40,
    })],
  });
}

// ---------- paragraphs ----------
function p(runs, opts = {}) {
  const arr = Array.isArray(runs) ? runs : [runs];
  return new Paragraph({
    children: arr.map(r => makeRun(r)),
    spacing: { after: opts.after ?? 240, line: opts.line ?? 320 },
  });
}

function muted(text, opts = {}) {
  return new Paragraph({
    spacing: { before: 40, after: 200, line: 300 },
    children: [new TextRun({
      text, font: FONT, size: halfPt(10), italics: true, color: MUTED,
    })],
  });
}

function note(text, opts = {}) {
  const children = Array.isArray(text)
    ? text.map(r => makeRun(r, { color: MUTED, size: halfPt(10) }))
    : [new TextRun({ text, font: FONT, size: halfPt(10), italics: true, color: MUTED })];
  return new Paragraph({
    spacing: { before: 180, after: 180, line: 300 },
    border: { left: { color: RULE, size: 12, space: 10, style: BorderStyle.SINGLE } },
    indent: { left: 120 },
    children,
  });
}

// ---------- lists ----------
// bullets([['Bold label.', ' description text', {text: 'link', url: '…'}], …])
function bullets(items) {
  return items.map(runs => new Paragraph({
    children: (Array.isArray(runs) ? runs : [runs]).map(r => makeRun(r)),
    numbering: { reference: 'bul', level: 0 },
    spacing: { before: 40, after: 60, line: 300 },
  }));
}

function ol(items) {
  return items.map(runs => new Paragraph({
    children: (Array.isArray(runs) ? runs : [runs]).map(r => makeRun(r, { color: MUTED, size: halfPt(9.5) })),
    numbering: { reference: 'refs', level: 0 },
    spacing: { before: 20, after: 100, line: 280 },
    border: { top: { color: RULE, size: 4, space: 6, style: BorderStyle.SINGLE } },
  }));
}

// ---------- source line ----------
// sourceLine([{text: 'Colombo About page', url: '…'}, {text: ' · '}, {text: 'Sales Turnover', url: '…'}])
function sourceLine(items) {
  const children = [
    new TextRun({ text: 'SOURCES  ', font: FONT, size: halfPt(8.5), bold: true, color: MUTED, characterSpacing: 40 }),
    ...items.flatMap((c, i) => {
      const runs = [];
      if (i > 0 && !c.noSeparator) runs.push(new TextRun({ text: ' · ', font: FONT, size: halfPt(9), color: MUTED }));
      runs.push(makeRun(c, { color: MUTED, size: halfPt(9) }));
      return runs;
    }),
  ];
  return new Paragraph({
    children,
    spacing: { before: 320, after: 400, line: 280 },
    border: { top: { color: RULE, size: 6, space: 8, style: BorderStyle.DASHED } },
  });
}

// ---------- tables ----------
// factsTable([{label:'Founded', value:'1999', big:true}, ...])
function factsTable(cells) {
  const colW = Math.floor(12240 / cells.length);
  const ruleBorder = { style: BorderStyle.SINGLE, size: 6, color: RULE };
  return new Table({
    width: { size: 5000, type: WidthType.PERCENTAGE },
    layout: TableLayoutType.AUTOFIT,
    columnWidths: cells.map(() => colW),
    borders: {
      top: ruleBorder, bottom: ruleBorder,
      left: NO_BORDER, right: NO_BORDER,
      insideHorizontal: NO_BORDER, insideVertical: NO_BORDER,
    },
    rows: [new TableRow({
      cantSplit: true,
      children: cells.map(c => new TableCell({
        width: { size: colW, type: WidthType.DXA },
        margins: { top: 240, bottom: 240, left: 120, right: 120 },
        children: [
          new Paragraph({ spacing: { after: 60 }, children: [new TextRun({
            text: String(c.label).toUpperCase(), font: FONT, size: halfPt(8.5),
            bold: true, color: MUTED, characterSpacing: 40,
          })]}),
          new Paragraph({ spacing: { after: c.note ? 60 : 0 }, children: [new TextRun({
            text: String(c.value), font: FONT,
            size: c.big ? halfPt(16) : halfPt(11),
            bold: true, color: INK,
          })]}),
          ...(c.note ? [new Paragraph({ children: [new TextRun({
            text: String(c.note), font: FONT, size: halfPt(9), color: MUTED,
          })]})] : []),
        ],
      })),
    })],
  });
}

// threeCol([{label, value, big?, note?}, ...]) — same as factsTable but with vertical dividers
function threeCol(cells) {
  const colW = Math.floor(12240 / cells.length);
  const ruleBorder = { style: BorderStyle.SINGLE, size: 6, color: RULE };
  return new Table({
    width: { size: 5000, type: WidthType.PERCENTAGE },
    layout: TableLayoutType.AUTOFIT,
    columnWidths: cells.map(() => colW),
    borders: {
      top: ruleBorder, bottom: ruleBorder,
      left: NO_BORDER, right: NO_BORDER,
      insideHorizontal: NO_BORDER,
      insideVertical: { style: BorderStyle.SINGLE, size: 4, color: RULE },
    },
    rows: [new TableRow({
      cantSplit: true,
      children: cells.map(c => new TableCell({
        width: { size: colW, type: WidthType.DXA },
        margins: { top: 240, bottom: 240, left: 200, right: 200 },
        children: [
          new Paragraph({ spacing: { after: 80 }, children: [new TextRun({
            text: String(c.label).toUpperCase(), font: FONT, size: halfPt(8.5),
            bold: true, color: MUTED, characterSpacing: 40,
          })]}),
          new Paragraph({ spacing: { after: 60 }, children: [new TextRun({
            text: String(c.value), font: FONT,
            size: c.big ? halfPt(16) : halfPt(11),
            bold: true, color: INK,
          })]}),
          ...(c.note ? [new Paragraph({ children: [new TextRun({
            text: String(c.note), font: FONT, size: halfPt(9.5), color: MUTED,
          })]})] : []),
        ],
      })),
    })],
  });
}

// dataTable(['Source', 'Columbus', 'WV', 'Read'], [ ['Google LSA', '824 → 24', '— → 15', 'Volume; ~8% wanted.'], ...])
// Each cell can be a string OR an array of run specs (for inline bold/emphasis).
function dataTable(headers, rows) {
  const colW = Math.floor(12240 / headers.length);
  const headBorder = { style: BorderStyle.SINGLE, size: 8, color: INK };
  const rowBorder  = { style: BorderStyle.SINGLE, size: 4, color: RULE };
  return new Table({
    width: { size: 5000, type: WidthType.PERCENTAGE },
    layout: TableLayoutType.AUTOFIT,
    columnWidths: headers.map(() => colW),
    borders: {
      top: NO_BORDER, left: NO_BORDER, right: NO_BORDER, bottom: NO_BORDER,
      insideHorizontal: rowBorder, insideVertical: NO_BORDER,
    },
    rows: [
      new TableRow({
        tableHeader: true,
        children: headers.map(h => new TableCell({
          width: { size: colW, type: WidthType.DXA },
          margins: { top: 120, bottom: 140, left: 0, right: 120 },
          borders: { top: NO_BORDER, left: NO_BORDER, right: NO_BORDER, bottom: headBorder },
          children: [new Paragraph({ children: [new TextRun({
            text: String(h).toUpperCase(), font: FONT, size: halfPt(8.5),
            bold: true, color: MUTED, characterSpacing: 40,
          })]})],
        })),
      }),
      ...rows.map(cells => new TableRow({
        children: cells.map((cell, i) => new TableCell({
          width: { size: colW, type: WidthType.DXA },
          margins: { top: 140, bottom: 140, left: 0, right: 120 },
          borders: { top: NO_BORDER, left: NO_BORDER, right: NO_BORDER, bottom: rowBorder },
          children: [new Paragraph({
            children: (Array.isArray(cell) ? cell : [{ text: String(cell) }]).map(s => new TextRun({
              text: String(s.text ?? s), font: FONT, size: halfPt(10),
              bold: i > 0 || s.bold, italics: s.italics, color: s.color ?? INK,
            })),
          })],
        })),
      })),
    ],
  });
}

// ---------- mission blockquote ----------
function mission(text, citation) {
  const out = [new Paragraph({
    spacing: { before: 100, after: 200, line: 320 },
    border: { left: { color: INK, size: 18, space: 12, style: BorderStyle.SINGLE } },
    indent: { left: 240 },
    shading: { type: ShadingType.CLEAR, color: 'auto', fill: PAPER_BAND },
    children: [new TextRun({
      text, font: FONT, size: halfPt(11), italics: true, color: INK,
    })],
  })];
  if (citation) out.push(eyebrow(citation));
  return out;
}

// ---------- shaded band wrapper ----------
// Used by buildDoc(bands) — never called directly by the model.
// Wraps content in a full-page-width single-cell shaded table.
function shadedBand(children) {
  const tw = 12240;
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

// ---------- cover ----------
// coverBlock({client, authored_by, created, last_updated, mode, finalized?, briefType})
function coverBlock(cover) {
  const isDraft = /draft/i.test(cover.mode || '');
  const briefType = (cover.briefType || 'FOUNDATIONAL BRIEF').toUpperCase();
  const out = [];

  if (isDraft) {
    out.push(new Paragraph({
      spacing: { after: 100 },
      border: { top: { color: INK, size: 6, space: 8, style: BorderStyle.SINGLE } },
      children: [new TextRun({
        text: 'DRAFT · NOT FOR EXTERNAL CIRCULATION', font: FONT, size: halfPt(9),
        bold: true, color: MUTED, characterSpacing: 40,
      })],
    }));
    out.push(new Paragraph({
      spacing: { after: 120 },
      children: [new TextRun({ text: briefType, font: FONT, size: halfPt(10), bold: true, color: MUTED, characterSpacing: 36 })],
    }));
  } else {
    // Finalize mode — no draft banner; kicker gets the top border
    out.push(new Paragraph({
      spacing: { after: 120 },
      border: { top: { color: INK, size: 6, space: 8, style: BorderStyle.SINGLE } },
      children: [new TextRun({ text: briefType, font: FONT, size: halfPt(10), bold: true, color: MUTED, characterSpacing: 36 })],
    }));
  }

  out.push(new Paragraph({
    spacing: { after: 300 },
    children: [new TextRun({ text: cover.client, font: FONT, size: halfPt(32), bold: true, color: INK })],
  }));

  const meta = [
    ['CLIENT', cover.client],
    ['AUTHORED BY', cover.authored_by || 'Andrés Cuervo, CCO'],
    ['CREATED', cover.created],
    ['LAST UPDATED', cover.last_updated || cover.created],
  ];
  if (cover.finalized) meta.push(['FINALIZED', cover.finalized]);

  const tw = 12240 - 2 * 1440; // content width
  const colW = Math.floor(tw / meta.length);
  out.push(new Table({
    width: { size: 5000, type: WidthType.PERCENTAGE },
    layout: TableLayoutType.AUTOFIT,
    columnWidths: meta.map(() => colW),
    borders: {
      top: NO_BORDER, bottom: { color: INK, size: 6, space: 8, style: BorderStyle.SINGLE },
      left: NO_BORDER, right: NO_BORDER,
      insideHorizontal: NO_BORDER, insideVertical: NO_BORDER,
    },
    rows: [new TableRow({
      children: meta.map(([label, val]) => new TableCell({
        width: { size: colW, type: WidthType.DXA },
        margins: { top: 100, bottom: 200, left: 0, right: 120 },
        children: [
          new Paragraph({ spacing: { after: 40 }, children: [new TextRun({
            text: label, font: FONT, size: halfPt(8), bold: true, color: MUTED, characterSpacing: 40,
          })]}),
          new Paragraph({ children: [new TextRun({
            text: String(val || ''), font: FONT, size: halfPt(10), color: INK,
          })]}),
        ],
      })),
    })],
  }));

  out.push(new Paragraph({ spacing: { after: 400 }, children: [new TextRun({ text: '' })] }));
  return out;
}

// ---------- buildDoc ----------
// spec = { cover: {...}, bands: [ {normal: [...]} | {shaded: [...]}, ... ] }
// Wraps cover in first normal band. Every band becomes its own docx Section.
function buildDoc(spec) {
  const sections = [];
  // Prepend cover into the first band (or create a leading normal band)
  const coverElements = coverBlock(spec.cover || {});
  let bands = spec.bands || [];
  if (bands.length === 0) {
    bands = [{ normal: coverElements }];
  } else {
    const first = bands[0];
    if (first.normal) first.normal = [...coverElements, ...first.normal];
    else bands = [{ normal: coverElements }, ...bands];
  }

  const normalMargin = { top: dxa(72), bottom: dxa(72), left: dxa(72), right: dxa(72) };
  const shadedMargin = { top: 0, bottom: 0, left: 0, right: 0 };
  const pageSize = { width: 12240, height: 15840 };

  bands.forEach((band, i) => {
    if (band.normal) {
      sections.push({
        properties: {
          type: i === 0 ? undefined : SectionType.CONTINUOUS,
          page: { size: pageSize, margin: normalMargin },
        },
        children: band.normal,
      });
    } else if (band.shaded) {
      sections.push({
        properties: {
          type: SectionType.CONTINUOUS,
          page: { size: pageSize, margin: shadedMargin },
        },
        children: [shadedBand(band.shaded)],
      });
    }
  });

  return new Document({
    numbering: {
      config: [
        { reference: 'bul', levels: [{ level: 0, format: LevelFormat.BULLET, text: '•', alignment: AlignmentType.LEFT,
          style: { paragraph: { indent: { left: 440, hanging: 320 } } } }] },
        { reference: 'refs', levels: [{ level: 0, format: LevelFormat.DECIMAL, text: '%1.', alignment: AlignmentType.LEFT,
          style: { paragraph: { indent: { left: 480, hanging: 360 } } } }] },
      ],
    },
    styles: {
      default: { document: { run: { font: FONT, size: halfPt(10.5), color: INK } } },
    },
    sections,
  });
}

async function writeDoc(doc, outPath) {
  const buf = await Packer.toBuffer(doc);
  fs.mkdirSync(path.dirname(outPath), { recursive: true });
  fs.writeFileSync(outPath, buf);
  return outPath;
}

module.exports = {
  // helpers
  h2, h4, eyebrow, p, muted, note, bullets, ol, sourceLine,
  factsTable, threeCol, dataTable, mission,
  // low-level (rarely needed by model)
  shadedBand, coverBlock, makeRun,
  // top-level
  buildDoc, writeDoc,
  // constants (for reference; not typically needed)
  INK, PAPER, PAPER_BAND, MUTED, MICRO, RULE, RULE_STRONG, FONT,
};
