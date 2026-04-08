# Research Validation Rules

Purpose: Five rules applied after every research phase, before any writing begins. If a Research Log fails validation, the writing phase must mark affected claims as "Not Researched" with the specific failure reason.

---

## Rule 0: Tool Call Proof

Research means WebSearch + WebFetch tool calls. Training data is not research.

**Pass**: The Research Log entries correspond to actual WebSearch and WebFetch tool calls made during this session. Search queries were sent to WebSearch. Result URLs were loaded via WebFetch. Data was extracted from fetched page content.

**Fail**: The Research Log contains searches, URLs, or data points that were produced from training knowledge without corresponding tool calls. This includes: URLs constructed from memory ("I expect this data lives at..."), statistics recalled from training, or citations to organizations whose websites were not actually fetched. This is fabrication, not research. The entire Research Log is invalid.

---

## Rule 1: Source Fetch Proof

Every cited URL must appear in the Research Log as fetched during this session via a WebFetch tool call.

**Pass**: The Research Log contains a "URLs Fetched" entry showing the URL was loaded via WebFetch and data was extracted from the actual page content.

**Fail**: A URL appears in the written section but was not fetched via WebFetch during this session. This is a phantom citation.

---

## Rule 2: No Phantom Citations

You cannot name a specific organization (BLS, Pew, ABA, CDC, Avvo, Super Lawyers, etc.) as a source without fetching data from them in this session.

**Pass**: The Research Log shows the organization's URL was fetched and the specific data point was extracted from the page.

**Fail**: The section says "according to Pew Research" but the Research Log does not contain any Pew Research URL. Remove the citation and downgrade the confidence score to "Unverified" or "Not Researched."

**Why this matters**: Models frequently generate plausible-sounding citations to authoritative organizations without actually consulting them. This rule makes that shortcut visible and traceable.

**Source tier check**: Even when a URL was fetched, check whether the source is eligible. Disqualified sources (law firm blogs, marketing agency content, SEO articles, AI-generated listicles) must not appear as citations. If the data originated at a primary source (e.g., ADOT, Census Bureau), cite the primary source, not a blog that repackaged it.

---

## Rule 3: Confidence Score Integrity

Every confidence score must match the evidence trail per the confidence-scoring-spec.md.

Checks:
- "Verified" requires a URL in the Research Log that was fetched and contains the claimed data
- "Corroborated" requires 2+ URLs from different domains, both fetched, both supporting the claim
- "Client-Reported" requires a specific document name and location
- "Unverified" requires a description of what was searched
- "Not Researched" requires a reason research was skipped

**Fail**: A claim scored "Verified" but the URL in the Research Log was not actually fetched, or was fetched but did not contain the claimed data.

---

## Rule 4: Social Media Verification

"Confirmed Official" status requires observed backlink verification: either the client's website links to the social account, or the social profile links back to the client's website.

**Pass**: Research Log shows the client's website was fetched, social icon URLs were extracted, and they match the discovered profile URL.

**Fail**: A social account is marked "Confirmed Official" but the Research Log shows only a name/branding match with no cross-link check. Downgrade to "Probable Official."

---

## Rule 5: Completeness Gate

A Research Log must exist before writing begins for any research-dependent section.

**Pass**: The Research Log for the section contains at minimum:
1. Search queries performed (with results summary)
2. URLs fetched (with extraction summary)
3. Claims extracted with confidence scores

**Fail**: No Research Log exists for a section that requires research. The writing phase must output "RESEARCH NOT PERFORMED" and score every claim as "Not Researched."

---

## Applying These Rules

After each research agent completes its work:

1. Review the Research Log against all five rules
2. Flag any violations
3. For each violation, either:
   - Re-run the specific research step to fix it, or
   - Downgrade the affected claim's confidence score and note the reason
4. Only proceed to writing when the Research Log passes all five rules

The user should see the Research Log before the written section. This makes the research process transparent and auditable.

---

## Compact Research Log Format

Research Logs appear in the brief document itself. They must be compact and useful, not exhaustive. The format is a short list of the sources that produced data actually used in the section. Each entry is a live link the reader can click to verify the claim at its original source.

```
**Research Log**
- [Source title](URL) -- what was found
- [Source title](URL) -- what was found
- [Document name, page/section] -- what was extracted (for client docs)
```

**Rules for Research Logs in the brief:**
1. Only include sources that produced data used in the written section. Do not list every URL searched.
2. Every entry must have a live, clickable link (or document reference for client files).
3. Keep it to 3-8 entries. If you need more than 8, you are including too much detail.
4. The log goes at the end of the section it supports, not in a separate appendix.
5. Social media accounts do NOT need a Research Log. The social media table with Verified/Not Found status IS the log.

**The Research Log is NOT:**
- A narrative description of search methodology
- A list of every search query attempted
- A place to explain why searches failed (put that in confidence scores instead)
- A duplicate of the Evidence table in the section above it
