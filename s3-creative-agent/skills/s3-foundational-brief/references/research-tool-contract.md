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

## Research Log Integrity

Every Research Log must be an honest record of tool usage in this session:

1. **Searches Performed**: Each entry must correspond to an actual WebSearch call you made. Include the exact query string.
2. **URLs Fetched**: Each entry must correspond to an actual WebFetch call you made. Include what you extracted from the page.
3. **Claims Extracted**: Each claim must trace to a specific fetched URL. The URL must contain the data you are claiming.

If you realize you are about to write a Research Log entry from memory rather than from a tool call, STOP. Either make the tool call or mark the claim as Not Researched.

---

## When You Cannot Research

If WebSearch or WebFetch tools are unavailable, blocked, or failing:
- Do NOT substitute training data and pretend it is research
- State clearly: "Research tools are unavailable. The following data is from training knowledge and is NOT independently verified."
- Score every claim as "Not Researched" with the reason "Research tools unavailable"
- Let the user decide whether to proceed with unverified data or wait

This is always preferable to fabricating a research process that did not occur.
