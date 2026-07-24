# Connectors

## S3 Creative Agent — Tool Configuration

This plugin has been customized for Studio 3 Marketing.

## Connectors for this plugin

| Category | Tool | Status |
|----------|------|--------|
| Chat | Slack | Configured |
| Design | Figma | Configured |
| Knowledge base | Google Docs, Google Drive | Configured |
| Client surveys | Content Snare (MCP) | Configured |
| Meeting conversations | Grain (MCP) | Configured |
| Web research fallback | Firecrawl (MCP) | Configured at org level |

## Firecrawl — Research Fallback

Firecrawl is the designated fallback for WebFetch when research agents encounter pages WebFetch handles poorly (government sites with tables, JS-rendered pages, YouTube metadata, and similar). The fallback rule is defined in each built skill's `references/research-tool-contract.md` under "Firecrawl Fallback".

**How it is provided:** Firecrawl is added once as an org-level custom Web connector in Cowork (Organization settings → Connectors → Add → Custom → Web) using Firecrawl's hosted MCP endpoint. S3 creatives inherit access automatically — no per-user setup is required.

**Endpoint format:** `https://mcp.firecrawl.dev/{FIRECRAWL_API_KEY}/v2/mcp`

**API key management:** Keys are generated at https://www.firecrawl.dev/app/api-keys. The key is embedded in the connector URL, so rotate it in both places when rotating.

## Grain — Meeting Conversations

Grain captures transcripts and AI notes from S3's calls. It is the source of truth for client-facing and internal conversations during brief building. Each brief pulls the client's relevant recordings up to the brief's creation date; downstream briefs inherit prior citations and pull only the delta.

**How it is provided:** Grain is connected once as an MCP connector in Cowork. S3 creatives inherit access. No per-user setup or API key lives in this repo.

**Retrieval logic:** defined in each in-scope skill's `references/grain-source.md` (shared module). Skills that consume it: `s3-foundational-brief`, `s3-strategy-brief`, `s3-creative-brief-website`, `s3-recommendation-doc`.
