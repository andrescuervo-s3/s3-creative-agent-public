# Research Tool Contract

This contract defines what "research" means in every S3 skill. It applies to every research agent, every Research Log, and every claim scored as Verified or Corroborated.

---

## What Research Is

Research means calling the **WebSearch** tool to find sources, then calling the **WebFetch** tool to load those sources and extract data from the actual page content.

A Research Log entry is valid ONLY when:
1. A WebSearch call was made with a specific query
2. A result URL was obtained from that search
3. A WebFetch call was made to load that URL
4. Data was extracted from the fetched page content
5. The extracted data was used to support a specific claim

---

## What Research Is Not

**Training data is not research.** You have knowledge from training. That knowledge may be accurate, outdated, or wrong. It is never sourced research. You must NEVER:

- Present training knowledge as researched data
- Construct URLs based on where you expect data to live without actually fetching those URLs
- Cite an organization (ADOT, Census Bureau, Pew, ABA, NHTSA) without fetching data from their actual website in this session
- Produce statistics, percentages, or data points from memory and label them as Verified
- Generate a Research Log from memory without having called WebSearch and WebFetch

If you recognize data from training, you may use it to guide what to search for. But the data that goes into the Research Log and the brief must come from a fetched page, not from your memory.

---

## Source Filtering at the Point of Search

When WebSearch returns results, you must filter them BEFORE fetching. Check every result URL against the source tier rules in the relevant research agent file.

**Disqualify immediately:**
- Law firm websites, attorney blogs, or legal marketing content (these are SEO content designed to attract clients, not authoritative data sources)
- Agency blogs or marketing firm content
- Corporate thought leadership or whitepapers
- AI-generated listicles or SEO-first articles with unclear methodology
- Self-published brand content
- Aggregator sites that repackage data without original sourcing

**When a search returns only disqualified sources:**
- Do NOT use them because "they're all that's available"
- Reformulate the search query to target primary sources directly (add `site:gov`, `site:edu`, or the specific authoritative domain)
- If no primary source can be found after 3 search attempts, mark the claim as Unverified with the reason "Primary source not found; available sources were disqualified (law firm blogs, marketing content)"

**Go to the primary source.** If a law firm blog says "according to ADOT, there were 121,107 crashes," do NOT cite the law firm blog. Search for and fetch the ADOT page directly. If you cannot find the ADOT page, the claim is Unverified.

---

## Source URL Capture

**Every source pulled by any ingestion tool MUST have its URL captured alongside the content, and that URL MUST flow through to the brief as a live hyperlink on the citation.**

This applies universally: WebFetch on public data, Drive file reads, Notion page fetches, Grain meeting fetches, Content Snare survey pulls, Airtable record fetches — all of them. If the tool call succeeded, the URL exists in the tool response; capture it.

**Why:** the reader of the finished brief should be able to click any source citation and land on the actual document / recording / dataset. `href="#"` placeholders and plain "(Sales Turnover)" text with no link both fail this contract. See project memory `project_source_url_capture.md`.

**Per-tool URL field mapping:**

| Source | Tool | URL field to capture | URL format example |
|---|---|---|---|
| Google Drive (any file) | `get_file_metadata` / `read_file_content` | `viewUrl` (returned by `get_file_metadata`; can also be constructed from `id`) | `https://docs.google.com/document/d/{id}/edit` or `https://drive.google.com/file/d/{id}/view` |
| Notion page | `notion-search`, `notion-fetch` | `url` field on each search result | `https://app.notion.com/p/{page-id}` |
| Grain meeting | `list_meetings`, `fetch_meeting_notes`, `fetch_meeting_transcript` | `recording_url` field on each meeting object | `https://grain.com/share/recording/{meeting-id}/{token}` |
| Content Snare survey | `search_surveys`, `get_full_survey`, `get_survey`, `get_survey_page` | Request ID (`req_...`) — full portal URL follows the `https://app.contentsnare.com/requests/{req_id}` pattern; verify with the client's actual Content Snare workspace | `https://app.contentsnare.com/requests/req_...` |
| Airtable record | `get_record`, `list_records` | Construct from base ID + table ID + record ID | `https://airtable.com/{base}/{table}/{view}/{record}` |
| Public web (govt/industry data) | WebSearch → WebFetch | The URL you fetched | any authoritative URL like `https://ai.fmcsa.dot.gov/` |

**Never invent a URL.** If the tool response didn't contain a URL field and you can't construct one from documented ID fields, the source is uncited-with-URL. In that case: (a) go find the URL via a follow-up search (Drive `search_files`, Notion `notion-search`, Grain `list_meetings`, etc.), or (b) render the source as plain text in the brief with a parenthetical `(Internal — URL not yet in Drive index)`. Never emit `href="#"`.

**Carry URLs through the pipeline.** When a research agent hands its findings to the orchestrator (or the orchestrator hands validated content to the write phase), source URLs travel with the content. Every claim in the Research Log records the URL that produced it. Every citation in the final brief renders that URL as a live hyperlink.

---

## Research Log Integrity

Every Research Log must be an honest record of tool usage in this session:

1. **Searches Performed**: Each entry must correspond to an actual WebSearch call you made. Include the exact query string.
2. **URLs Fetched**: Each entry must correspond to an actual WebFetch call you made. Include what you extracted from the page.
3. **Claims Extracted**: Each claim must trace to a specific fetched URL. The URL must contain the data you are claiming.

If you realize you are about to write a Research Log entry from memory rather than from a tool call, STOP. Either make the tool call or mark the claim as Not Researched.

---

## Firecrawl Fallback

WebFetch is the primary tool for loading source pages. When WebFetch underperforms, fall back to the Firecrawl scrape tool (available in the Cowork environment as a connector).

**Fall back to Firecrawl when WebFetch:**
1. Returns an error or fails to load the URL
2. Returns an empty body or fewer than 500 characters of extracted content
3. Does not contain the specific fact the agent was sent to find (for example, the agent was looking for a population statistic and the fetched text has no numbers)

**Why Firecrawl.** Its scrape output preserves tables, JS-rendered content, and structured data more reliably than WebFetch's text extraction. This makes it the designated fallback for pages where WebFetch commonly loses information, such as government sites with data tables, pages that require JS rendering, and YouTube video pages.

**Research Log treatment.** A Firecrawl scrape call counts as a fetch for Research Log purposes. Record both attempts:
- The original WebFetch call and why it was thin, empty, or errored
- The Firecrawl retry and what it returned

**If Firecrawl also fails or returns nothing usable:** Mark the claim Unverified. Do NOT substitute training data. The rules in "When You Cannot Research" below apply.

---

## When You Cannot Research

If WebSearch or WebFetch tools are unavailable, blocked, or failing:
- Do NOT substitute training data and pretend it is research
- State clearly: "Research tools are unavailable. The following data is from training knowledge and is NOT independently verified."
- Score every claim as "Not Researched" with the reason "Research tools unavailable"
- Let the user decide whether to proceed with unverified data or wait

This is always preferable to fabricating a research process that did not occur.
