# Chat Output Formatting

Applies to all S3 skills. Read this file at the start of every skill session.

All text output in the chat must be easy to scan. Never write dense paragraphs. Break everything into labeled sections, bullets, and whitespace.

---

## Document / File Checklists

Use a checklist with source labels. Never list files as a sentence.

```
**Documents found:**
- ✓ Sales Turnover (Google Drive)
- ✓ Creative Call Notes (Google Drive)
- ✓ Creative Survey (Google Drive)
- ✗ SEO Keywords — not found
- ✗ Work Agreement — not found
```

---

## Section Completion Summaries

Use a bold header, then bullets grouped by topic. Never write a section summary as a paragraph.

```
**2.1 Client Details — Complete**

- **Firm:** Big Auto Accident Attorneys, Phoenix AZ, founded 2023
- **Structure:** ABS model, co-counsel referral network in 45+ states
- **Key contacts:** Ashley Lee (CMO), Nic Edgson (CEO), Evan Bortz (Ops)
- **Services sold:** Website Tier ($22,500), SEO ($10,000/mo)
- **Social media:** Instagram ✓ Facebook ✓ LinkedIn ✓ YouTube (unverified) TikTok ✗ X ✗
```

---

## Research Logs

Use a table. Never inline a research log as a paragraph.

| Claim | Source | Confidence |
|-------|--------|------------|
| Founded 2023 | Sales Turnover doc | Client-Reported |
| Instagram: @bigautoaccidentattorneys | Live search | Verified |
| TikTok: Not found | 3 search attempts | Unverified |

---

## Status Lines

One line per step. Bold label, plain description.

```
**Searching Google Drive for client documents...**
**Running social media discovery — 6 platforms...**
**Building Section 3.2 Audiences — fetching audience research...**
**Writing Section 3.3 Competitors...**
```

Do not narrate every sub-step. One status line per major action.

---

## Approval Gates (Guided Mode)

Clean, scannable. Separate the instruction from the question.

```
**Section 2.1 Client Details is ready for review.**

Key items to check:
- Year Founded: 2023 (Client-Reported — confirm with client)
- Social media: YouTube account unverified
- Services table: derived from Work Agreement

Reply "Approved" to continue to 2.2 From the Client, or share any edits.
```

---

## Rules

- If it would take more than two lines to say, break it into bullets
- Never combine multiple topics into one paragraph
- Always add a blank line between sections
- Use **bold** for labels, plain text for values
- Checkmarks (✓ ✗) for presence/absence checks
