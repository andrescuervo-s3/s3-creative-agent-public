---
name: s3-docx-styler
description: |
  Packs the final .docx file for every S3 brief. Handles all visual composition (warm B&W palette, three-band structure with shaded band around data-heavy sections, HeadingLevel-driven Outline, source lines, pipe-notes, hyperlinks, cover masthead, tables), enforces editorial discipline (extract-not-regurgitate, importance-not-count, no downstream leaks, no The Read section), and embeds Open Sans fonts. MANDATORY final step for every brief-writing skill.
  TRIGGERS: Invoked programmatically by s3-foundational-brief, s3-strategy-brief, s3-recommendation-doc, and s3-creative-brief-* skills at their final packing step. NOT for direct user invocation — if the user says "style my brief," the correct skill is whichever brief-writing skill applies; that skill will invoke this one as its last step.
---

# S3 Docx Styler — MANDATORY Final Step for Every S3 Brief

## Purpose

This skill exists because a reference file can be skipped by a writer model but a skill invocation cannot. When any S3 brief-writing skill has prepared its content, it hands off to THIS skill for the final .docx composition. That handoff loads the visual + editorial rules into full context, guaranteeing they're applied.

**You are the styler.** You do not extract content from client sources — the invoking skill already did that. You take prepared section content and produce a properly styled `.docx` file, then embed Open Sans, then save.

## Your workflow (do these in order, no skipping)

**You do not hand-write docx-js.** `assets/build-brief.js` is a deterministic renderer: every helper hardcodes the correct S3 style. Your job is to call the right helpers with the handed-off content. This is not optional and there is no faster path — writing raw docx-js is how the output regresses.

1. **Ingest the handoff message** from the invoking skill: client name, document type, mode (Draft/Finalize), absolute save path, and the structured section content.
2. **Set up a working directory.** Copy `assets/build-brief.js` there. Ensure the `docx` package resolves; if `node -e "require.resolve('docx')"` fails, run `npm install docx` in that directory.
3. **Write a short compose script** that requires `./build-brief.js` and calls its helpers (API below). The ONLY things you author are the content strings and which helper each block uses. Never set a color, font, size, border, or margin yourself — if you find yourself typing a hex code, you are doing it wrong.
4. **Run it** with `node`.
5. **Embed Open Sans**: `python3 assets/embed-fonts.py <path>`.
6. **Verify mechanically. This is not optional:**

   ```
   python3 assets/verify-docx.py <path>
   ```

   If it exits non-zero, the file is rejected. Fix the generator and regenerate. Do NOT deliver a file that fails, and do NOT report success. It catches the two defects that have actually shipped to clients: table grids sized to the paper instead of the text column (tables cut off on the right in Word, refuse to fill the width in Google Docs), and banned blue hyperlinks.
7. **Report the saved file path** back to the invoking skill.

**Never compute a table column width from the page width.** The text column is 9360 twips (6.5in); the paper is 12240 (8.5in). Only the single-column full-bleed shaded band may span 12240. The helpers in `build-brief.js` already do this correctly, which is another reason to compose through them.

Read `references/visual-system.md` when you need the rationale behind a pattern, a case the helpers do not cover, or the full editorial spec. The helpers are the implementation; that file is the reference.

## Renderer API (`assets/build-brief.js`)

```js
const B = require('./build-brief.js');

await B.writeDoc(B.buildDoc({
  cover: { client, authored_by, created, last_updated, mode, briefType, finalized? },
  bands: [ { normal: [...blocks] }, { shaded: [...blocks] }, { normal: [...blocks] } ],
}), '/absolute/save/path.docx');
```

`buildDoc` places the cover automatically and turns each band into its own docx section. Put the data-heavy section (§2.3 Digital Snapshot in a Foundational Brief) in the single `shaded` band; everything else goes in `normal` bands.

Block helpers:

| Helper | Use |
|---|---|
| `h2('2.1 · Client Details')` | Numbered section header. HEADING_1 → Google Docs Outline. |
| `h4('Subsection')` | Subsection header. |
| `eyebrow('LABEL')` | Small caps label / citation line. |
| `p(runs)` | Body paragraph. |
| `muted(text)` | De-emphasized italic line. |
| `note(text)` | Pipe-rule callout (the left-bar style). |
| `bullets([runs, ...])` | Returns an array — spread it: `...B.bullets([...])`. |
| `ol([runs, ...])` | Numbered reference list. Spread it. |
| `sourceLine([{text, url}, ...])` | Dashed-top SOURCES line. Ends every section. |
| `threeCol([{label, value, big, note}])` | Facts strip with dividers. |
| `factsTable([{label, value, big, note}])` | Facts strip without dividers. |
| `dataTable(headers, rows)` | Metrics table. Cells are strings or run arrays. |
| `mission(text, citation)` | Returns an array — spread it. |

A **run** is a string, or `{text, bold?, italics?, url?}`. Passing `url` makes it a correctly styled dashed hyperlink. Never build hyperlinks any other way.

```js
B.p(['Direct email is off-limits. See ', {text: 'the policy', url: 'https://…'}, '.'])
```

If the handoff gives you a citation with no URL, pass it as plain text. Never invent a URL and never use `#`.

## Hard rules

- **Never read the existing client brief on disk to use as a visual template.** The invoking skill's content is your input; `references/visual-system.md` is your style source. That's it. The existing file may share a filename with your output — that's coincidence, not a reason to open it.
- **Never blue hyperlinks** (`#0563C1` is banned). Always dashed-underline in MICRO color per the visual-system spec.
- **Never all-sides black table borders.** Tables use horizontal-only rules per the spec.
- **Never a "DRAFT" outline box or "FINAL" filled badge.** Draft banner in Draft mode is a subtle top-of-cover text line; Finalize omits it entirely.
- **Never a "The Read" section in a Foundational Brief.** That section is retired from FB — it belongs in the Strategy Brief only.
- **Never `href="#"` placeholder hyperlinks.** If the invoking skill didn't hand you a URL for a citation, render the citation as plain text.
- **Never invent an intake question.** If the invoking skill's handoff message doesn't specify the output format, output format is `.docx` (always, no exceptions). If it doesn't specify the save location, use the client's `01 Deliverables/` folder. Do not ask the user anything.

## What the invoking skill hands you

The invoking skill will pass, in its Skill invocation message:

- **Client name** (string, e.g. "Colombo Law")
- **Mode** (`New Draft` | `Update Draft` | `Finalize`)
- **File path** (absolute path where the .docx should be saved)
- **Section content** — either inline in the message or as a path to a temporary JSON/markdown file with the structured content. Each section is keyed by its number (1.0, 2.1, 2.2, 2.3, 3.1, 3.2, 3.3, 3.4, Reference) and contains an ordered list of blocks (paragraph, list, table, source line, note, etc.) with the actual text.

If any of the above is missing from the handoff, note it and use the defaults above — do not surface a question to the user.

## Five required patterns (final self-check)

Before you report success, verify:

1. Cover has a 4-column metadata strip (Client / Authored by / Created / Last updated), not bulleted labeled fields.
2. Every §-numbered section header uses `HeadingLevel.HEADING_1` so the Google Docs Outline sidebar populates.
3. §2.3 Digital Snapshot (in a Foundational Brief) is wrapped in a full-width shaded table inside a section with zero side margins.
4. Every section ends with a source line: dashed top border, `SOURCES` label, `·`-separated citations rendered as dashed-underline live hyperlinks.
5. Palette is warm B&W: INK `#2E2C27`, PAPER `#FCFCFB`, PAPER_BAND `#F9F9F7`, MUTED `#6B6A63`, MICRO `#B4B3A8`, RULE `#E4E3DC`. No blue. No all-sides black table borders.

If any check fails, correct the docx-js and regenerate before reporting success.

## Editorial rules (apply to content the invoking skill hands you)

The invoking skill is supposed to have already applied these — but as the last handler of the content before it becomes a file, sanity-check:

- **Extract, don't regurgitate.** Each source contributes 1–3 signals, not paragraphs of paraphrase.
- **Importance, not count.** No hard caps, no forced fills.
- **No downstream leaks.** No teasers, no name-drops of downstream research instruments (e.g., "Centiment findings will be in the Strategy Brief").
- **Descriptive vs. interpretive split (Foundational Brief only).** Epsilon customer profiles and Lead Docket attribution stay in FB. Commissioned market research (awareness surveys, brand-definition studies) belongs in Strategy Brief.
- **No em dashes.** Use commas, colons, or periods.

If you spot an editorial violation in the handed-off content, flag it in your report and either correct it inline (if minor) or ask the invoking skill to correct it (if structural).

## Reference files

- `assets/build-brief.js` — **the renderer. Always compose through it.** Every helper hardcodes the correct style.
- `references/visual-system.md` — full visual system spec and editorial rules. Read for rationale, for cases the helpers do not cover, and when a check fails.
- `assets/fonts/` — Open Sans TTFs to embed
- `assets/embed-fonts.py` — post-generation font-embedding script
