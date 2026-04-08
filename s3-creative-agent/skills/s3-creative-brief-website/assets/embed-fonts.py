#!/usr/bin/env python3
"""
Embed Open Sans fonts into a .docx file.

Usage:
    python3 embed-fonts.py input.docx output.docx

Embeds Regular, Bold, Italic, and BoldItalic weights of Open Sans
so the document renders correctly on machines without the font installed.
"""

import sys
import os
import shutil
import zipfile
import tempfile
from pathlib import Path

SCRIPT_DIR = Path(__file__).parent
FONTS_DIR = SCRIPT_DIR / "fonts"

FONT_FILES = {
    "regular": "OpenSans-Regular.ttf",
    "bold": "OpenSans-Bold.ttf",
    "italic": "OpenSans-Italic.ttf",
    "boldItalic": "OpenSans-BoldItalic.ttf",
}

CONTENT_TYPE_ENTRY = '<Default Extension="ttf" ContentType="application/x-font-ttf"/>'

FONT_TABLE_ENTRIES = """
  <w:font w:name="Open Sans">
    <w:altName w:val="Arial"/>
    <w:panose1 w:val="020B0606030504020204"/>
    <w:charset w:val="00"/>
    <w:family w:val="swiss"/>
    <w:pitch w:val="variable"/>
    <w:sig w:usb0="E00002FF" w:usb1="4000ACFF" w:usb2="00000001" w:usb3="00000000" w:csb0="0000019F" w:csb1="00000000"/>
    <w:embedRegular r:id="rIdFontRegular"/>
    <w:embedBold r:id="rIdFontBold"/>
    <w:embedItalic r:id="rIdFontItalic"/>
    <w:embedBoldItalic r:id="rIdFontBoldItalic"/>
  </w:font>
"""

FONT_RELS = [
    ('rIdFontRegular', 'fonts/OpenSans-Regular.ttf'),
    ('rIdFontBold', 'fonts/OpenSans-Bold.ttf'),
    ('rIdFontItalic', 'fonts/OpenSans-Italic.ttf'),
    ('rIdFontBoldItalic', 'fonts/OpenSans-BoldItalic.ttf'),
]


def embed_fonts(input_path, output_path):
    """Embed Open Sans fonts into a docx file."""
    input_path = Path(input_path)
    output_path = Path(output_path)

    # Verify font files exist
    for name, filename in FONT_FILES.items():
        font_path = FONTS_DIR / filename
        if not font_path.exists():
            print(f"ERROR: Font file not found: {font_path}")
            sys.exit(1)

    # Work in a temp directory
    with tempfile.TemporaryDirectory() as tmp:
        tmp_path = Path(tmp)
        extract_dir = tmp_path / "unpacked"

        # Extract docx
        with zipfile.ZipFile(input_path, 'r') as zf:
            zf.extractall(extract_dir)

        # 1. Copy font files into word/fonts/
        fonts_dest = extract_dir / "word" / "fonts"
        fonts_dest.mkdir(parents=True, exist_ok=True)
        for name, filename in FONT_FILES.items():
            shutil.copy2(FONTS_DIR / filename, fonts_dest / filename)

        # 2. Update [Content_Types].xml - add ttf content type
        content_types_path = extract_dir / "[Content_Types].xml"
        ct_content = content_types_path.read_text(encoding='utf-8')
        if 'Extension="ttf"' not in ct_content:
            ct_content = ct_content.replace(
                '</Types>',
                f'  {CONTENT_TYPE_ENTRY}\n</Types>'
            )
            content_types_path.write_text(ct_content, encoding='utf-8')

        # 3. Update or create word/fontTable.xml
        font_table_path = extract_dir / "word" / "fontTable.xml"
        import re
        if font_table_path.exists():
            ft_content = font_table_path.read_text(encoding='utf-8')
            # Remove any existing Open Sans entry (we'll replace it)
            ft_content = re.sub(
                r'<w:font w:name="Open Sans">.*?</w:font>',
                '',
                ft_content,
                flags=re.DOTALL
            )
            # Handle both self-closing and open/close tag forms
            if '</w:fonts>' in ft_content:
                ft_content = ft_content.replace(
                    '</w:fonts>',
                    f'{FONT_TABLE_ENTRIES}</w:fonts>'
                )
            else:
                # Self-closing tag: convert to open/close with our entry
                ft_content = re.sub(
                    r'/>\s*\Z',
                    f'>{FONT_TABLE_ENTRIES}</w:fonts>',
                    ft_content
                )
            font_table_path.write_text(ft_content, encoding='utf-8')
        else:
            ft_content = f'''<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<w:fonts xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships" xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main">
{FONT_TABLE_ENTRIES}
</w:fonts>'''
            font_table_path.write_text(ft_content, encoding='utf-8')

            # Also add fontTable.xml to content types if it was newly created
            ct_content = content_types_path.read_text(encoding='utf-8')
            if 'fontTable.xml' not in ct_content:
                ct_content = ct_content.replace(
                    '</Types>',
                    '  <Override PartName="/word/fontTable.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.fontTable+xml"/>\n</Types>'
                )
                content_types_path.write_text(ct_content, encoding='utf-8')

        # 4. Update or create word/_rels/fontTable.xml.rels
        rels_dir = extract_dir / "word" / "_rels"
        rels_dir.mkdir(parents=True, exist_ok=True)
        ft_rels_path = rels_dir / "fontTable.xml.rels"

        rels_entries = []
        for rel_id, target in FONT_RELS:
            rels_entries.append(
                f'  <Relationship Id="{rel_id}" '
                f'Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/font" '
                f'Target="{target}"/>'
            )

        if ft_rels_path.exists():
            rels_content = ft_rels_path.read_text(encoding='utf-8')
            # Remove existing font relationships
            rels_content = re.sub(
                r'<Relationship[^>]*relationships/font[^>]*/>\s*',
                '',
                rels_content
            )
            rels_content = rels_content.replace(
                '</Relationships>',
                '\n'.join(rels_entries) + '\n</Relationships>'
            )
            ft_rels_path.write_text(rels_content, encoding='utf-8')
        else:
            rels_content = f'''<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
{chr(10).join(rels_entries)}
</Relationships>'''
            ft_rels_path.write_text(rels_content, encoding='utf-8')

        # 5. Ensure fontTable is referenced in word/_rels/document.xml.rels
        doc_rels_path = rels_dir / "document.xml.rels"
        if doc_rels_path.exists():
            doc_rels_content = doc_rels_path.read_text(encoding='utf-8')
            if 'fontTable.xml' not in doc_rels_content:
                doc_rels_content = doc_rels_content.replace(
                    '</Relationships>',
                    '  <Relationship Id="rIdFontTable" '
                    'Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/fontTable" '
                    'Target="fontTable.xml"/>\n</Relationships>'
                )
                doc_rels_path.write_text(doc_rels_content, encoding='utf-8')

        # 6. Set embedTrueTypeFonts in document settings
        settings_path = extract_dir / "word" / "settings.xml"
        if settings_path.exists():
            settings_content = settings_path.read_text(encoding='utf-8')
            if '<w:embedTrueTypeFonts/>' not in settings_content and '<w:embedTrueTypeFonts' not in settings_content:
                settings_content = settings_content.replace(
                    '</w:settings>',
                    '  <w:embedTrueTypeFonts/>\n  <w:saveSubsetFonts/>\n</w:settings>'
                )
                settings_path.write_text(settings_content, encoding='utf-8')

        # 7. Repack as docx
        if output_path.exists():
            output_path.unlink()

        with zipfile.ZipFile(output_path, 'w', zipfile.ZIP_DEFLATED) as zf:
            for root, dirs, files in os.walk(extract_dir):
                for file in files:
                    file_path = Path(root) / file
                    arcname = file_path.relative_to(extract_dir)
                    zf.write(file_path, arcname)

    print(f"Embedded Open Sans fonts into: {output_path}")
    file_size = output_path.stat().st_size
    print(f"Output size: {file_size / 1024:.0f} KB")


if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Usage: python3 embed-fonts.py input.docx [output.docx]")
        print("  If output is omitted, overwrites input file.")
        sys.exit(1)

    input_file = sys.argv[1]
    output_file = sys.argv[2] if len(sys.argv) > 2 else input_file

    if not os.path.exists(input_file):
        print(f"ERROR: Input file not found: {input_file}")
        sys.exit(1)

    embed_fonts(input_file, output_file)
