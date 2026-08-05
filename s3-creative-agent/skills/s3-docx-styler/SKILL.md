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

1. **Read `references/visual-system.md` in full.** Every code snippet, every palette hex, every anti-pattern rule. You cannot skip this — the invoking skill deliberately handed off to you so that this file becomes active context. Read it now.
2. **Ingest the handoff message** from the invoking skill. It will name the client, the file path, the mode (Draft/Finalize), and provide structured section content.
3. **Compose the docx-js script** using ONLY the code patterns in `references/visual-system.md`. Do not extract layout from any existing file on disk. Do not invent your own patterns. If a section calls for a facts strip, use the `factsTable()` snippet. If it's the shaded band section, use the `shadedBand()` + section-break trick.
4. **Run the docx-js script** to produce the initial .docx.
5. **Embed Open Sans** by running `python3 assets/embed-fonts.py <path>` on the produced file.
6. **Verify five required patterns are present** in the generated docx (per the self-check list in visual-system.md).
7. **Report the file path** back to the invoking skill.

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

- `references/visual-system.md` — full visual system spec with every code snippet. **MANDATORY read at start of your workflow.**
- `assets/fonts/` — Open Sans TTFs to embed
- `assets/embed-fonts.py` — post-generation font-embedding script
