#!/usr/bin/env python3
"""Hard verification of a generated S3 brief .docx.

Run this on every brief before reporting success:

    python3 assets/verify-docx.py /path/to/Brief.docx

Exits non-zero and prints what is wrong if the file violates the visual system.
A failure means regenerate, not ship.

The check that matters most: tables MUST be percentage-width. Absolute (dxa)
widths are authored against paper width, not the text area, so they run off the
right edge in Word and refuse to fill the column in Google Docs.
"""
import re
import sys
import zipfile

PALETTE = {"INK": "2E2C27", "PAPER_BAND": "F9F9F7", "MUTED": "6B6A63", "RULE": "E4E3DC"}
BANNED_BLUE = "0563C1"


def check(path):
    errors, warnings = [], []
    with zipfile.ZipFile(path) as z:
        doc = z.read("word/document.xml").decode("utf-8")

    tables = re.findall(r"<w:tbl>.*?</w:tbl>", doc, re.S)
    if not tables:
        warnings.append("no tables found")

    bad_width, bad_layout = [], []
    for i, t in enumerate(tables, 1):
        # docx-js emits w:type before w:w, so never assume attribute order.
        tag = re.search(r"<w:tblW\b[^>]*/?>", t)
        if not tag:
            bad_width.append(f"table {i}: no <w:tblW> element at all")
        else:
            wtype = re.search(r'w:type="(\w+)"', tag.group(0))
            if not wtype or wtype.group(1) != "pct":
                bad_width.append(
                    f"table {i}: width type is "
                    f"'{wtype.group(1) if wtype else 'unset'}', must be 'pct'"
                )
        if not re.search(r'<w:tblLayout w:type="autofit"', t):
            bad_layout.append(str(i))

    if bad_width:
        errors.append(
            "Tables are not percentage-width (they will cut off on the right in Word "
            "and not fill the column in Google Docs):\n    "
            + "\n    ".join(bad_width[:12])
            + (f"\n    ... and {len(bad_width) - 12} more" if len(bad_width) > 12 else "")
        )
    if bad_layout:
        warnings.append(f"tables without autofit layout: {', '.join(bad_layout[:12])}")

    # Column grid width. This is the check that catches tables running off the
    # right edge: a grid summing to 12240 is sized to the PAPER, but the text
    # column is only 9360. <w:tblGrid> never nests, so parse it directly rather
    # than trying to match whole <w:tbl> elements.
    CONTENT_W, FULL_BLEED = 9360, 12240
    bad_grid = []
    for i, grid in enumerate(re.findall(r"<w:tblGrid>.*?</w:tblGrid>", doc, re.S), 1):
        cols = [int(x) for x in re.findall(r'<w:gridCol w:w="(\d+)"', grid)]
        total = sum(cols)
        # The full-bleed shaded band is a single-column wrapper and may be 12240.
        # Any multi-column table at that width is sized to the paper by mistake.
        if total == FULL_BLEED and len(cols) == 1:
            continue
        if total > CONTENT_W:
            bad_grid.append(f"table {i}: {len(cols)} cols, grid is {total} twips "
                            f"({total/1440:.2f}in), text column is only "
                            f"{CONTENT_W} ({CONTENT_W/1440:.2f}in)")
    if bad_grid:
        errors.append(
            "Table column grids are sized to the paper, not the text column. They "
            "will cut off on the right in Word and not fill the width in Google Docs:\n    "
            + "\n    ".join(bad_grid[:12])
            + (f"\n    ... and {len(bad_grid) - 12} more" if len(bad_grid) > 12 else "")
            + f"\n    Fix: compute column widths from CONTENT_W ({CONTENT_W}), not "
              f"PAGE_W ({FULL_BLEED}). Only the full-bleed shaded band may use {FULL_BLEED}."
        )

    if BANNED_BLUE in doc.upper():
        errors.append(f"banned blue hyperlink colour {BANNED_BLUE} present")
    if 'w:val="Heading1"' not in doc:
        errors.append("no Heading1 styles: the Google Docs Outline sidebar will be empty")
    for name, hexv in PALETTE.items():
        if hexv not in doc.upper():
            warnings.append(f"palette colour {name} ({hexv}) not found")
    if "Open Sans" not in doc:
        errors.append("Open Sans not referenced")

    return errors, warnings, len(tables)


def main():
    if len(sys.argv) < 2:
        print("usage: verify-docx.py <file.docx>")
        return 2
    path = sys.argv[1]
    try:
        errors, warnings, ntables = check(path)
    except Exception as exc:
        print(f"FAIL  could not read {path}: {exc}")
        return 2

    print(f"verifying {path}  ({ntables} tables)")
    for w in warnings:
        print(f"  warn  {w}")
    for e in errors:
        print(f"  FAIL  {e}")
    if errors:
        print("\nDOCX REJECTED. Fix the generator and regenerate. Do not deliver this file.")
        return 1
    print("\nPASS")
    return 0


if __name__ == "__main__":
    sys.exit(main())
