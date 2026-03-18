# Confidence Scoring Specification

Purpose: Define how every factual claim in a Foundational Brief is scored for reliability. Scores are assigned per-claim, not per-section. Every scored claim must show its work.

---

## Confidence Levels

### Verified
A Tier 1 source was fetched during this session and directly supports the claim.
- **Requires**: URL fetched in the Research Log, data extracted from the page
- **Example**: "4.8 stars from 215 reviews on Avvo" with Avvo URL in the Research Log

### Corroborated
Two or more independent sources fetched during this session support the claim.
- **Requires**: 2+ URLs from different domains in the Research Log, each supporting the claim
- **Example**: Founding year confirmed by both the firm's About page and state business filings

### Client-Reported
The claim comes from client-provided documents only. No independent verification was performed or found.
- **Requires**: Specific document name and location within the document
- **Example**: "Serves 500+ clients annually" stated in the Creative Survey, page 2

### Unverified
Research was attempted but no confirming source was found.
- **Requires**: Description of what was searched and why it came back empty
- **Example**: "Searched for '{Firm Name} founding year' on firm website, Sunbiz.org, and LinkedIn. No founding year stated."

### Not Researched
Research was not performed for this claim.
- **Requires**: Reason research was skipped (tool unavailable, site blocked, out of scope, time constraint)
- **Example**: "SEO position data not researched. Client did not provide analytics access and no SEO tools are available."

---

## Show-Your-Work Format

Every claim that receives a confidence score must follow this structure:

```
Claim: [The specific factual statement]
Source: [URL fetched, document name, or "No source found"]
Reasoning: [Why this source supports (or fails to support) the claim]
Score: [Verified | Corroborated | Client-Reported | Unverified | Not Researched]
```

---

## Scoring Rules

1. **No score without evidence trail.** If you cannot point to a source or explain what you searched, the claim is "Not Researched."

2. **Client documents are not independent sources.** A claim from intake docs is always "Client-Reported" unless independently verified through web research.

3. **Fetching a URL is not the same as finding data.** If you fetch a page but the page does not contain the claimed data, the claim is "Unverified," not "Verified."

4. **Do not upgrade scores.** A claim supported by one source is "Verified," not "Corroborated." A claim from client docs alone is "Client-Reported," not "Verified."

5. **Do not downgrade scores to appear cautious.** If you fetched a source and it clearly supports the claim, score it "Verified." Artificial hedging wastes the reader's attention.

6. **Aggregate claims need per-component scoring.** "Founded in 2005 with 3 locations" is two claims. Score each independently.

7. **"Not Researched" is always acceptable.** It is better to mark something as not researched than to fabricate a source or score.

---

## Where Scores Appear in the Brief

Confidence scores appear in these sections:
- **2.1 Client Details**: Year Founded, Organizational Structure, Social Media verification labels
- **2.3 Digital Snapshot**: All SEO/performance metrics when sourced via fallback research
- **3.2 Audience Profiles**: Evidence supporting demographic and behavioral claims
- **3.3 Competitors**: Proof Signals
- **3.4 Market Differentiators**: Each differentiator claim

Sections 1.0, 1.1, and 2.2 do not use confidence scoring (they are document-sourced or boilerplate).

---

## Prohibited Vocabulary

Do NOT use any of these terms as confidence labels:
- "High" / "Medium" / "Low"
- "Strong" / "Weak"
- "Likely" / "Probable" (as confidence labels)
- "Confirmed" (use "Verified" instead)

The ONLY acceptable confidence labels are the five defined above: Verified, Corroborated, Client-Reported, Unverified, Not Researched. Using any other vocabulary creates ambiguity about what the score actually means.
