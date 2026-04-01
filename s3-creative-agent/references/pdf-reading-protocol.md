# PDF Reading Protocol

Shared protocol for reading PDF files. Read this file whenever you encounter a PDF.
Every skill that ingests documents must follow this protocol.

**Core rule:** Never say a PDF cannot be read and move on. Exhaust every method below. The only acceptable dead end is asking the user to paste the text -- never ask them to re-upload a file they already provided.

---

## Step 1: Locate the File

Before attempting to read, confirm you have the file. Check in this order:

1. **Already in session workspace:** Use `ls` or Glob to find it. Files uploaded to the conversation are available locally.
2. **On Google Drive:** Use `google_drive_fetch` with the file ID or URL to download it to the local workspace.
3. **Path unknown:** Ask the user where the file is -- do NOT skip it.

Once located, note the local file path and proceed to Step 2.

---

## Step 2: Extract Text (in order -- stop when you get output)

### Method 1: pdfplumber (handles text and tables)

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

If this produces any text output, use it. Proceed to Step 3.

### Method 2: pdftotext CLI

```bash
pdftotext -layout document.pdf -
```

The `-layout` flag preserves table-like spacing. If this produces text, use it. Proceed to Step 3.

### Method 3: pypdf

```python
import pypdf

reader = pypdf.PdfReader("document.pdf")
for i, page in enumerate(reader.pages):
    text = page.extract_text()
    if text:
        print(f"--- Page {i+1} ---")
        print(text)
```

If this produces text, use it. Proceed to Step 3.

### Method 4: Scanned PDF (image-based)

If all three methods above return empty or near-empty text (fewer than 50 characters per page), the PDF is likely scanned or image-based. Use pdftoppm to convert pages to images, then extract text via tesseract:

```bash
# Convert PDF pages to images
pdftoppm -r 300 document.pdf page_output

# Run OCR on each page image
for img in page_output-*.ppm; do
    tesseract "$img" stdout
done
```

If tesseract is unavailable, try the Python path:

```python
import subprocess
result = subprocess.run(
    ["python3", "-c",
     "from pdf2image import convert_from_path; imgs = convert_from_path('document.pdf'); [img.save(f'page_{i}.png') for i, img in enumerate(imgs)]"],
    capture_output=True
)
# Then OCR each saved image
```

If OCR produces readable text, use it. Proceed to Step 3.

---

## Step 3: Validate Extraction Quality

After extraction, do a quick quality check:

- **Looks good:** Recognizable sentences, headings, and structure present. Proceed to reading.
- **Garbled or partial:** Try the next method in Step 2 before proceeding. Compare outputs and use the cleaner one.
- **Tables missing:** pdfplumber is the best for tables. If a table-heavy document was read with pdftotext, re-run with pdfplumber specifically for table extraction.
- **Headers/footers repeated:** Strip boilerplate page headers and footers before extracting content. pdfplumber page regions can help (`page.crop()`) if needed.

---

## Step 4: If All Extraction Methods Fail

Only reach this step if every method above returned empty or completely unreadable output.

Ask the user:
```
I'm having trouble extracting text from [filename]. Could you paste the content directly into the chat, or share it in a different format (.docx, .txt)?
```

Do NOT say "the file can't be read" without this ask. Do NOT skip the document and proceed without it. Do NOT mark the document as unavailable and move on.

---

## File Format Notes

| Format | Approach |
|--------|----------|
| Text-based PDF | Methods 1-3 will work |
| Scanned/image PDF | Method 4 (OCR) required |
| Password-protected PDF | Ask the user to remove the password and re-share |
| Corrupted PDF | Ask the user for a fresh copy |
| PDF from Google Drive | Use google_drive_fetch first, then apply methods 1-4 to the downloaded file |

---

## What to Extract

When reading a document, extract:

- All body text, preserving section headings
- All tables (rows and columns)
- All bullet and numbered lists
- Dates, names, and line items (especially in Work Agreements and contracts)
- Any headers, footers, or watermarks that indicate document status (DRAFT, FINAL, CONFIDENTIAL)

Do not stop at page 1. Read every page.
