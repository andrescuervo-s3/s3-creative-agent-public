# Research Validation Rules

Purpose: Five rules applied after every research phase, before any writing begins. If a Research Log fails validation, the writing phase must mark affected claims as "Not Researched" with the specific failure reason.

---

## Rule 1: Source Fetch Proof

Every cited URL must appear in the Research Log as fetched during this session.

**Pass**: The Research Log contains a "URLs Fetched" entry showing the URL was loaded and data was extracted.

**Fail**: A URL appears in the written section but not in the Research Log. This is a phantom citation.

---

## Rule 2: No Phantom Citations

You cannot name a specific organization (BLS, Pew, ABA, CDC, Avvo, Super Lawyers, etc.) as a source without fetching data from them in this session.

**Pass**: The Research Log shows the organization's URL was fetched and the specific data point was extracted from the page.

**Fail**: The section says "according to Pew Research" but the Research Log does not contain any Pew Research URL. Remove the citation and downgrade the confidence score to "Unverified" or "Not Researched."

**Why this matters**: Models frequently generate plausible-sounding citations to authoritative organizations without actually consulting them. This rule makes that shortcut visible and traceable.

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
