# PDF Reading Protocol

Read this file whenever you encounter a PDF. Follow it exactly.

**Creative surveys**: Client creative surveys are available as structured data from the Content Snare API (via the `search_surveys` and `get_full_survey` MCP tools). Use Content Snare instead of reading the PDF export. This protocol is for all other document types (work agreements, proposals, etc.).

**Non-negotiable rule:** Never loop on a PDF. One fetch attempt. One extraction attempt. If either fails, ask the user to drop the file in chat and move on immediately. Do not explain, re-search, or try workarounds.

---

## Step 1: Get the File

**If the file was uploaded directly to the chat:** It is already in the local workspace. Find it with `ls` or Glob and skip to Step 2.

**If the file is on Google Drive:** Call `google_drive_fetch` with the file ID or full URL one time.
- Extract the file ID from the URL: for `https://drive.google.com/file/d/FILE_ID/view`, the ID is between `/d/` and `/view`
- If `google_drive_fetch` returns content, save it to a temp file and proceed to Step 2
- If `google_drive_fetch` fails for any reason, go to Step 1b immediately -- do not retry, do not search again

### Step 1b: Fetch Failed

Say exactly this, then wait:

```
I can see [filename] on Google Drive but couldn't pull it automatically. Drop the file into this chat and I'll read it right away.
```

Nothing else. No explanation of why it failed. No alternative suggestions. Wait for the user to drop the file, then go to Step 2.

---

## Step 2: Extract Text

Run pdfplumber first. If it returns text, use it and stop.

```python
import pdfplumber

with pdfplumber.open("document.pdf") as pdf:
    full_text = []
    all_tables = []
    for i, page in enumerate(pdf.pages):
        text = page.extract_text()
        if text:
            full_text.append(f"--- Page {i+1} ---\n{text}")
        tables = page.extract_tables()
        for table in tables:
            all_tables.append(table)
    print("\n".join(full_text))
    if all_tables:
        print("TABLES:", all_tables)
```

If pdfplumber returns nothing, run pdftotext:

```bash
pdftotext -layout document.pdf -
```

If pdftotext returns nothing, run pypdf:

```python
import pypdf
reader = pypdf.PdfReader("document.pdf")
for i, page in enumerate(reader.pages):
    text = page.extract_text()
    if text:
        print(f"--- Page {i+1} ---")
        print(text)
```

If all three return nothing, the PDF is likely scanned. Run OCR:

```bash
pdftoppm -r 300 document.pdf page_output
for img in page_output-*.ppm; do
    tesseract "$img" stdout
done
```

---

## Step 3: If Extraction Fails

If every method in Step 2 returns empty or unreadable output, say:

```
I couldn't extract text from [filename]. Could you paste the content into the chat?
```

Then continue. Do not block progress on a single file.

---

## What to Extract

Read every page. Extract all body text, headings, tables, bullet lists, dates, names, and line items. Note any status watermarks (DRAFT, FINAL, CONFIDENTIAL).
