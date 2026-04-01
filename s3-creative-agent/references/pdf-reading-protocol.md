# PDF Reading Protocol

Shared protocol for reading PDF files. Read this file whenever you encounter a PDF.
Every skill that ingests documents must follow this protocol.

**Core rule:** Never say a PDF cannot be read and move on. Exhaust every method below. The only acceptable dead end is asking the user to paste the text -- never ask them to re-upload a file they already provided.

---

## Step 1: Locate the File

Before attempting to extract text, you must have the file accessible. Check in this order:

1. **Already in session workspace:** Use `ls` or Glob to check. Files uploaded directly to the conversation are available locally. If found, skip to Step 2.
2. **Google Drive — native Google Doc:** Use `google_drive_fetch` with the file ID or URL. This works for Google Docs, Sheets, and Slides. Skip to Step 2.
3. **Google Drive — uploaded PDF (not a native Google Doc):** `google_drive_fetch` does NOT support uploaded binary files. Go to Step 1b below.
4. **Path unknown:** Ask the user where the file is. Do NOT skip it.

### Step 1b: Google Drive PDF (uploaded file)

`google_drive_fetch` cannot download uploaded PDFs. Use this fallback chain:

**Option A — Chrome (preferred):**
If the Claude in Chrome tool is available, navigate to the Google Drive URL and extract the text from the PDF viewer:
1. Use the `navigate` tool with the Drive share link
2. Use `get_page_text` or `read_page` to extract visible text from the rendered PDF
3. Scroll through all pages to capture the full document

**Option B — Curl with auth:**
If Chrome is not available, attempt a direct download using the file ID:
```bash
# Extract file ID from URL: https://drive.google.com/file/d/FILE_ID/view
curl -L "https://drive.google.com/uc?export=download&id=FILE_ID" -o document.pdf
```
Note: This only works for publicly accessible files. Private files will return an HTML auth page, not a PDF.

**Option C — Ask for direct upload:**
If neither Chrome nor curl works (private file, auth required), ask the user:
```
The file is in Google Drive but I can't download it directly — Drive's API only supports native Google Docs, not uploaded PDFs. Could you upload the file directly to this conversation? (Drag and drop into the chat works.)
```
Do NOT ask the user to "share" the file differently or change permissions unless they offer. Just ask for a direct upload to the chat.

Once you have the file locally (from any option above), proceed to Step 2.

---

## Step 2: Extract Text (in order -- stop when you get usable output)

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

If all three methods above return empty or near-empty text (fewer than 50 characters per page), the PDF is likely scanned or image-based. Use pdftoppm to convert pages to images, then OCR:

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
from pdf2image import convert_from_path
import pytesseract

images = convert_from_path("document.pdf", dpi=300)
for i, img in enumerate(images):
    text = pytesseract.image_to_string(img)
    print(f"--- Page {i+1} ---")
    print(text)
```

If OCR produces readable text, use it. Proceed to Step 3.

---

## Step 3: Validate Extraction Quality

After extraction, do a quick quality check:

- **Looks good:** Recognizable sentences, headings, and structure present. Proceed to reading.
- **Garbled or partial:** Try the next method in Step 2. Compare outputs and use the cleaner one.
- **Tables missing:** pdfplumber is best for tables. If a table-heavy document was read with pdftotext, re-run with pdfplumber specifically for table extraction.
- **Headers/footers repeated:** Strip boilerplate page headers and footers before extracting content. pdfplumber's `page.crop()` can isolate body regions if needed.

---

## Step 4: If All Methods Fail

Only reach this step if every method above returned empty or completely unreadable output.

Ask the user:
```
I'm having trouble extracting text from [filename]. Could you paste the content directly into the chat, or share it in a different format (.docx, .txt)?
```

Do NOT say "the file can't be read" without this ask. Do NOT skip the document and proceed without it. Do NOT mark the document as unavailable and move on.

---

## File Format Reference

| Situation | Approach |
|-----------|----------|
| PDF uploaded directly to chat | Already local -- go to Step 2 |
| PDF as native Google Doc (rare) | google_drive_fetch, then Step 2 |
| PDF uploaded to Google Drive | Step 1b (Chrome → curl → ask for upload) |
| Text-based PDF | Methods 1-3 will work |
| Scanned/image PDF | Method 4 (OCR) required |
| Password-protected PDF | Ask the user to remove the password and re-share |
| Corrupted PDF | Ask the user for a fresh copy |

---

## What to Extract

When reading a document, extract:

- All body text, preserving section headings
- All tables (rows and columns)
- All bullet and numbered lists
- Dates, names, and line items (especially in Work Agreements and contracts)
- Any headers, footers, or watermarks that indicate document status (DRAFT, FINAL, CONFIDENTIAL)

Do not stop at page 1. Read every page.
