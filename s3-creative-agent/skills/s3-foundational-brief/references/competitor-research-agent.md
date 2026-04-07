# Competitor Research Agent

Purpose: Produce up to 6 evidence-based competitor profiles for the Foundational Brief, segmented by audience channel (B2B vs B2C). Every profile must trace to fetched sources. Output is a structured Research Log followed by profile content. The orchestrator validates this output against research-validation-rules.md before writing the brief section.

**PREREQUISITE: Read `references/research-tool-contract.md` before executing any research.** That contract defines what "research" means (WebSearch + WebFetch tool calls, never training data) and how to filter sources. Every rule in that contract applies here.

---

## Tool Mandate

Every search in the Mandatory Search Sequence must be executed as a **WebSearch** tool call. Every URL cited must be fetched via **WebFetch** to confirm the page exists and contains the claimed data. Training knowledge is not research. If you did not call the tool, you did not do the research.

---

## Source Eligibility

### Approved Source Types
- Directory listings and review platforms (see sector table below)
- Firm/company websites: only to confirm services, specialties, leadership, or awards
- Google organic listings: to establish local prominence or visibility
- News or media mentions: only from reputable, independent outlets

### Do Not Use
- Paid ads or sponsored placements
- Marketing agency blogs or vendor-published lists
- AI-generated lists or unverified directories
- Self-promotional claims unless validated externally

---

## Sourcing by Sector

| Sector | Approved Directories and Review Sources |
|--------|----------------------------------------|
| Legal | Avvo, Martindale-Hubbell, Super Lawyers, BBB |
| Medical / Aesthetics | RealSelf, Healthgrades, Vitals, WebMD, Yelp |
| Home Services | Angi, Houzz, BBB, Yelp, Google Reviews |
| B2B / Tech / SaaS | G2, Capterra, Clutch, TrustRadius, Gartner Peer Insights |
| Professional Services | Super Lawyers, Martindale, BBB, Google Reviews |

---

## Mandatory Search Sequence

Execute these steps in order for each client. Do not skip steps.

### Step 1: Identify Priority Service Area and Region
From client documents, intake notes, or SEO terms, establish:
- Geographic service area
- Core service category
- Sector type (match to the table above)

### Step 2: Check Client-Named Competitors
If client documents mention specific competitors, start with those. For each:
- Confirm they are a real, active business (fetch their website)
- Record "Source of Identification: Client documents"

### Step 3: Search Approved Directories for the Sector
For each approved directory in the sector table:
- Search "[primary service] [location]" on the directory
- Record the top 3-5 results with their ratings and review counts

### Step 4: Search Google Organic Results
- Search "[primary service] + [location]" in Google
- Click only organic (non-ad) results from page 1-2
- Select firms that appear consistently across multiple directories

### Step 5: Identify Independently Discovered Competitors
At least 2 competitors must come from independent research (Steps 3-4), not solely from client documents. This prevents blind spots in the competitive landscape.

---

## Channel Segmentation and Ordering

After identifying competitors, segment them by audience channel. The client's PRIMARY channel (determined from 2.1 Client Details and the targeting field) comes first.

**Determine primary channel from the brief:**
- If the client's primary revenue driver or stated marketing focus is B2B (referrals, partnerships, professional buyers), B2B competitors come first
- If the client's primary revenue driver or stated marketing focus is B2C (direct consumers, retail, DTC), B2C competitors come first
- If unclear, ask at the approval gate

**Label each group** with the audience channel and a one-sentence description of what "competing" means in that channel. For example:
- "B2B Competitors: Firms competing for attorney referrals nationally"
- "B2C Competitors: Firms competing for direct consumer leads in the Atlanta market"

If all competitors serve the same channel, note this and skip the segmentation. If the client only operates in one channel, segmentation is not needed.

---

## Research Log Output Template

```
## Research Log: Competitors

### Client-Named Competitors
- [Name]: [Confirmed/Not confirmed as active business]
  Source of Identification: Client documents

### Directory Searches
1. Directory: [Name]
   Query: "[search terms]"
   Results: [Names, ratings, review counts of top results]

2. Directory: [Name]
   Query: "[search terms]"
   Results: [Names, ratings, review counts of top results]

### Google Organic Search
Query: "[search terms]"
Page 1-2 organic results: [List of firms found]

### URLs Fetched
1. [URL] - [What was extracted: services, proof signals, positioning]
2. [URL] - [What was extracted]

### Competitor Shortlist
| Name | Source of Identification | Channel (B2B/B2C) |
|------|------------------------|-------------------|
| [Name] | Client docs | B2C |
| [Name] | Avvo search | B2C |
| [Name] | Google organic | B2B |
```

---

## Profile Structure

For each competitor:

- **Name**: Official brand or firm name. Tag as [Client-Named] or [Independently Discovered].
- **Channel**: Which audience channel this competitor competes in (B2B, B2C, or Both)
- **Overview**: 2 to 4 sentences: primary service category, geographic focus, scale, unique emphasis, stated value proposition
- **URL**: [Firm name](homepage URL) -- must be a clickable link, not a raw URL
- **Proof Signals**: 2 to 5 concrete credibility signals. Each must have a live clickable source link:

| Signal | Source | Confidence |
|--------|--------|------------|
| [Specific credibility claim] | [Source title](URL) | Verified |

- **Relevance to Client**: 1-2 sentences on why this competitor matters to the client's competitive position

---

## Do NOT

- Include only client-named competitors. At least 2 must be independently discovered.
- Use paid ad URLs as competitor URLs.
- Editorialize. Describe how competitors present themselves, not whether they are "good" or "bad."
- Write profiles before completing the Research Log.
- Cite directory ratings without fetching the actual directory page.
