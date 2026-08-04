# Document Sources

Quick-reference map of where each client document lives and which tool retrieves it. **Every fetched document's URL must be captured for citation** — see the Source URL Capture section in `research-tool-contract.md`. The `viewUrl` field on Drive responses and the Content Snare portal URL for surveys are what render as live hyperlinks in the finished brief.

| Document | Source | Tool |
|----------|--------|------|
| Client-facing call recordings | Grain | `search_companies` → `list_meetings` / `search_in_transcripts` → `fetch_meeting_notes` |
| Internal conversations (client discussed) | Grain | `search_in_transcripts` → `fetch_meeting_notes` |
| Creative Survey (Client Intake Questionnaire) | Content Snare | `search_surveys` → `get_full_survey` |
| Work Agreement / Partnership Proposal | Google Drive | `google_drive_search` → `google_drive_fetch` |
| Sales Turnover / Client Profile | Google Drive | `google_drive_search` → `google_drive_fetch` |
| Creative Call Notes | Google Drive | `google_drive_search` → `google_drive_fetch` |
| Creative Download | Google Drive | `google_drive_search` → `google_drive_fetch` |
| Website Notes | Google Drive | `google_drive_search` → `google_drive_fetch` |
| SEO Keywords / Rankings | Google Drive | `google_drive_search` → `google_drive_fetch` |

## Content Snare Tools

| Tool | Input | Returns | Capture for citation |
|------|-------|---------|----------------------|
| `search_surveys` | `{ query: "client name" }` | Matching surveys with name, status, due date, request ID | Request ID (`req_...`); the citable URL is `https://app.contentsnare.com/requests/{req_id}` |
| `get_full_survey` | `{ request_id: "req_..." }` | All pages with questions and answers | Same request ID as above |
| `get_survey` | `{ request_id: "req_..." }` | Survey metadata and page list (no answers) | Same request ID as above |
| `get_survey_page` | `{ page_id: "pag_..." }` | Single page with questions and answers | The parent survey's request ID |

## Google Drive Tools

Every Drive fetch response includes a `viewUrl` field. Capture and pass it through to the brief. Example URL patterns:
- Docs: `https://docs.google.com/document/d/{fileId}/edit`
- Sheets: `https://docs.google.com/spreadsheets/d/{fileId}/edit`
- Slides: `https://docs.google.com/presentation/d/{fileId}/edit`
- Other files (PDFs, images, etc.): `https://drive.google.com/file/d/{fileId}/view`

If a document was referenced by name only (e.g., a source you know exists but didn't fetch), call `search_files` with the title first, capture the `viewUrl` from the result, THEN cite it. Do not skip the URL just because you didn't originally fetch the file.

## Google Drive Folder Structure

```
{Client Name}/
├── Creative Survey/         ← PDF export (archival only, use Content Snare instead)
├── Sales and Billing Info/  ← Work Agreement lives here
├── CREATIVE STRATEGY/       ← Brief output goes here
└── [root files]             ← Sales Turnover, Creative Notes, Website Notes, etc.
```
