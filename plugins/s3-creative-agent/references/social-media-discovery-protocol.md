# Social Media Discovery Protocol (Studio 3 Marketing)

Purpose: Discover and verify all official and brand-adjacent social media accounts for a client across six platforms using a structured search-and-verify process.

---

## Step 1: Check the Client's Owned Website

Fetch the client's homepage and scan the header, footer, contact page, and about page for social media icons or links. This is the fastest way to find all accounts at once.

---

## Step 2: Search Each Platform

For EACH of the following six platforms, perform a targeted web search. All six searches are required — do not stop after finding a few. These searches may be performed in parallel to save time.

- "{Client Name} site:facebook.com"
- "{Client Name} site:instagram.com"
- "{Client Name} site:linkedin.com/company" (use /company to find the business page, not personal profiles)
- "{Client Name} site:youtube.com"
- "{Client Name} site:tiktok.com"
- "{Client Name} site:x.com" OR "{Client Name} site:twitter.com"

---

## Step 3: Alternate Queries Before Marking "Not Found"

If a platform search returns no results, try these variations before marking it "Not found":

- Try the brand name without legal suffixes (e.g., "O'Mara Law" instead of "O'Mara Law Group")
- Try the founder's name plus the platform (e.g., "Mark O'Mara facebook")
- Check intake documents for social media handles or URLs

---

## Verification Labels

Apply one label per account:

- **Confirmed Official**: The account is linked from the client's owned website, OR the social profile links back to the client's website
- **Probable Official**: The name and branding match but no cross-linking exists
- **Personal / Brand-Adjacent**: The account belongs to the founder or a key principal personally (not the business), but is used for professional content, industry commentary, or media presence relevant to the firm's brand. Common in industries where the founder IS the brand (law, medicine, consulting, personal services).

Do not mark any account "Confirmed Official" without a visible backlink.

---

## Output Format

Output ALL six platforms as a clean vertical stack, one per line:

```
Instagram: URL (Confirmed Official or Probable Official)
Facebook: URL (Confirmed Official or Probable Official)
LinkedIn: URL (Confirmed Official or Probable Official)
X (Twitter): URL (Confirmed Official or Probable Official)
YouTube: URL (Confirmed Official or Probable Official)
TikTok: URL (Confirmed Official or Probable Official)
```

If a platform was not found: `Platform: Not found`

If only a personal/founder account exists (no official business account), include it with the "Personal / Brand-Adjacent" label. Example: `X (Twitter): https://x.com/MarkOMara (Personal / Brand-Adjacent)`

Every line follows the same pattern: Platform name, colon, space, then either the URL with verification label in parentheses, or "Not found." No extra commentary, descriptions, or notes inline.

---

## Sources and Missing Inputs

If at least one account is found, include exactly one Sources line after the full stack with 1 to 3 direct profile URLs. Do not use the client homepage as Sources unless it is the specific page containing the outbound social links.

If any platform is "Not found," include Missing Inputs Needed items only for those platforms. Do not guess handles.
