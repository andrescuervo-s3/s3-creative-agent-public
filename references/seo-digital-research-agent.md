# SEO / Digital Research Agent

Purpose: Produce the 2.4 Digital Snapshot section of the Foundational Brief. When the client provides SEO or analytics data, extract and format it. When no data is available, run a fallback research protocol to gather observable digital signals. Output is a structured Research Log followed by a formatted table. The orchestrator validates this output against research-validation-rules.md before writing the brief section.

---

## Decision: Client Data vs Fallback Research

### If Client Provides Data
Extract from the provided documents:
- SEO keyword rankings and search volumes
- Analytics data (sessions, conversions, bounce rates)
- Paid media metrics (CPA, ROAS, impressions)
- Any other performance data the client shares

Format into the appropriate table structure (see foundational-brief-sections.md, section 2.4). All data from client documents receives "Client-Reported" confidence.

No further research is needed. Skip to the output format.

### If No Client Data Exists
Execute the fallback research protocol below. All metrics from fallback research carry confidence scores per confidence-scoring-spec.md.

---

## Fallback Research Protocol

When the client has not provided any SEO, analytics, or paid media data, gather what is publicly observable. This is not a full audit; it captures signals visible without tool access.

### Step 1: Indexed Page Count
Search: `site:[client domain]`
Record the approximate number of indexed pages. This gives a rough sense of the site's content footprint.

Confidence: Verified (Google's index count is directly observable).

### Step 2: Priority Keyword Observation
Using the client's primary offerings and location from 2.1 Client Details:
- Search 3-5 high-priority keyword + location combinations
- For each, note whether the client appears on page 1, page 2, or not at all
- Record the approximate position if visible

Example searches:
- "[primary service] [city]" (e.g., "divorce attorney Orlando")
- "[secondary service] [city]"
- "[brand name]"

Confidence: Verified (organic position is directly observable in search results).

### Step 3: Google Business Profile Check
Search: `[client name] [city]`
Look for the Google Business Profile (knowledge panel or local pack):
- Review count and average rating
- Business category listed
- Whether the profile appears in the local 3-pack for priority terms

Confidence: Verified (GBP data is directly observable).

### Step 4: Local Pack Observation
For 2-3 priority keyword searches from Step 2:
- Does the client appear in the local 3-pack?
- Who else appears in the local 3-pack? (useful context for 3.3 Competitors)

Confidence: Verified (local pack presence is directly observable).

### Step 5: Basic Observable Site Signals
Fetch the client's homepage and note:
- Is the site mobile-responsive? (check viewport meta tag or responsive layout)
- Does the site use HTTPS?
- Approximate load behavior (does it load quickly or show delays?)
- Is there a blog or content section?
- Are there clear calls to action?

Confidence: Verified (these are directly observable from the page).

---

## Research Log Output Template

```
## Research Log: Digital Snapshot (Fallback Research)

### Indexed Pages
Query: site:[domain]
Result: Approximately [N] indexed pages
Confidence: Verified

### Priority Keyword Positions
1. Query: "[keyword] [location]"
   Client position: [Page 1 position X | Page 2 | Not found]
   Confidence: Verified

2. Query: "[keyword] [location]"
   Client position: [Page 1 position X | Page 2 | Not found]
   Confidence: Verified

3. Query: "[keyword] [location]"
   Client position: [Page 1 position X | Page 2 | Not found]
   Confidence: Verified

### Google Business Profile
Query: "[client name] [city]"
Found: [Yes/No]
Reviews: [count] reviews, [rating] average
Category: [listed category]
Local 3-pack presence: [Yes/No for priority terms]
Confidence: Verified

### Observable Site Signals
URL fetched: [homepage URL]
HTTPS: [Yes/No]
Mobile responsive: [Yes/No]
Blog/content section: [Yes/No]
Clear CTAs: [Yes/No]
Confidence: Verified
```

---

## Output Format

Format the findings into a compact table for the brief:

**When using fallback research**, use columns:
Signal | Observation | Source | Confidence

Example:
| Signal | Observation | Source | Confidence |
|--------|-------------|--------|------------|
| Indexed Pages | ~45 pages | site:domain.com search | Verified |
| "divorce attorney orlando" | Page 1, position 4 | Google organic | Verified |
| Google Reviews | 4.7 stars, 89 reviews | Google Business Profile | Verified |
| Local 3-Pack | Present for 2/3 priority terms | Google search | Verified |
| HTTPS | Yes | Direct observation | Verified |

---

## Do NOT

- Invent metrics. If a signal cannot be observed, do not include it.
- Claim specific traffic numbers, domain authority, or backlink counts without SEO tool access. These are not publicly observable.
- Present fallback research as equivalent to proper analytics data. The section introduction should note that data is based on publicly observable signals, not client-provided analytics.
- Skip the Research Log. Even for client-provided data, document the source (document name, page/sheet reference).
