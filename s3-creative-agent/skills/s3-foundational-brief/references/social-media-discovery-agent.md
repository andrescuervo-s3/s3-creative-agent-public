# Social Media Discovery Agent

Purpose: Discover and verify all social media accounts for a client across 6 mandatory platforms. Output is a structured Research Log with verification evidence for each platform. The orchestrator validates this output against research-validation-rules.md before writing the Social Media Accounts field in 2.1 Client Details.

---

## 6-Platform Mandatory Search Checklist

You MUST search for ALL 6 platforms. Do not stop after finding a few. Do not batch searches. Run a separate, dedicated search for each platform individually.

| # | Platform | Search Complete | Result |
|---|----------|----------------|--------|
| 1 | Instagram | [ ] | |
| 2 | Facebook | [ ] | |
| 3 | LinkedIn | [ ] | |
| 4 | X (Twitter) | [ ] | |
| 5 | YouTube | [ ] | |
| 6 | TikTok | [ ] | |

---

## Search Protocol

### Step 1: Check Client Website First
Fetch the client's homepage and look for social media icons or links in:
- Header
- Footer
- Contact page
- About page

Record every social URL found on the client's website. This is the fastest way to find accounts and the strongest verification evidence.

### Step 2: Search Each Platform Individually
For EACH platform, run a targeted web search:

1. `"{Client Name}" site:instagram.com`
2. `"{Client Name}" site:facebook.com`
3. `"{Client Name}" site:linkedin.com/company` (use /company to find the business page)
4. `"{Client Name}" site:x.com` OR `"{Client Name}" site:twitter.com`
5. `"{Client Name}" site:youtube.com`
6. `"{Client Name}" site:tiktok.com`

### Step 3: Alternate Queries
If a platform search returns no results, try these before marking "Not found":
- Brand name without legal suffixes (e.g., "O'Mara Law" instead of "O'Mara Law Group")
- Founder's name plus the platform (e.g., "Mark O'Mara facebook")
- Check intake documents for mentioned social handles or URLs

---

## Verification Steps

For each discovered account, determine its verification status:

### Confirmed Official
Requires BOTH of these observed:
1. The client's website was fetched
2. One of: the website links to this social account, OR the social profile links back to the client's website

Record: "Checked website [URL] footer/header. Social icon links to [social URL]. Match confirmed."

### Probable Official
The name, branding, and content match the client, but no cross-linking was observed.

Record: "Name and branding match. No backlink verification found on website or social profile."

### Personal / Brand-Adjacent
The account belongs to a founder or key principal personally, not the business. The content is professional and relevant to the firm's brand.

Record: "Account belongs to [person name/title]. Professional content relevant to the firm. Not an official business account."

---

## Output Format

Output a table for the brief. The table IS the research log. No separate narrative log is needed.

| Platform | Handle/URL | Notes | Status |
|----------|-----------|-------|--------|
| Facebook | [Handle](URL) | Follower count if visible. Content themes. Recent activity. | Verified |
| Instagram | [Handle](URL) | Follower count, post count. Content themes. Approximate recency (e.g., "last post ~2 weeks ago" or "posts 2-3x/week"). | Verified |
| LinkedIn | [Company name](URL) | Company page. Content themes if visible. | Verified |
| YouTube | [Channel name](URL) | Key content type (e.g., "Master Class series"). Approximate recency. | Verified |
| TikTok | Not found | | Not Found |
| X (Twitter) | Not found | | Not Found |

For every found account, note in the Notes column:
1. **Content themes**: What are the recent posts about? (e.g., "attorney spotlights, case results, community events")
2. **Recency**: Approximate last post date or posting frequency based on what is visible in search results
3. **Follower/post counts**: If visible in search result snippets

**Status values:**
- **Verified**: Client website links to this account, or the account links back to the client's website
- **Probable**: Name and branding match, but no cross-link verification
- **Personal/Brand-Adjacent**: Belongs to a founder or principal, not the business
- **Not Found**: All search queries returned no results for this platform

If a personal or brand-adjacent account is relevant (e.g., a principal's professional Instagram), include it as an additional row below the main account with the Personal/Brand-Adjacent label.

Add any important notes below the table (e.g., "Phil Pendergrass also maintains a separate Instagram account for the Georgia practice"). Keep notes to 1-2 sentences maximum.

---

## Do NOT

- Mark an account "Confirmed Official" without observed backlink evidence. A name match alone is "Probable Official."
- Skip any of the 6 platforms. All must be searched.
- Stop searching after finding accounts on 2-3 platforms.
- Guess social media handles. Every URL must come from a search result or website link.
- Use the client homepage as a "Source" URL unless it is the specific page containing outbound social links.
