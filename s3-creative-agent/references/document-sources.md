# Document Sources

Quick-reference map of where each client document lives and which tool retrieves it.

| Document | Source | Tool |
|----------|--------|------|
| Creative Survey (Client Intake Questionnaire) | Content Snare | `search_surveys` → `get_full_survey` |
| Work Agreement / Partnership Proposal | Google Drive | `google_drive_search` → `google_drive_fetch` |
| Sales Turnover / Client Profile | Google Drive | `google_drive_search` → `google_drive_fetch` |
| Creative Call Notes | Google Drive | `google_drive_search` → `google_drive_fetch` |
| Creative Download | Google Drive | `google_drive_search` → `google_drive_fetch` |
| Website Notes | Google Drive | `google_drive_search` → `google_drive_fetch` |
| SEO Keywords / Rankings | Google Drive | `google_drive_search` → `google_drive_fetch` |

## Content Snare Tools

| Tool | Input | Returns |
|------|-------|---------|
| `search_surveys` | `{ query: "client name" }` | Matching surveys with name, status, due date, request ID |
| `get_full_survey` | `{ request_id: "req_..." }` | All pages with questions and answers |
| `get_survey` | `{ request_id: "req_..." }` | Survey metadata and page list (no answers) |
| `get_survey_page` | `{ page_id: "pag_..." }` | Single page with questions and answers |

## Google Drive Folder Structure

```
{Client Name}/
├── Creative Survey/         ← PDF export (archival only, use Content Snare instead)
├── Sales and Billing Info/  ← Work Agreement lives here
├── CREATIVE STRATEGY/       ← Brief output goes here
└── [root files]             ← Sales Turnover, Creative Notes, Website Notes, etc.
```
