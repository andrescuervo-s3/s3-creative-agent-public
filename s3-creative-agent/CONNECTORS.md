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
| Web research fallback | Firecrawl (MCP) | Configured at org level |

## Firecrawl — Research Fallback

Firecrawl is the designated fallback for WebFetch when research agents encounter pages WebFetch handles poorly (government sites with tables, JS-rendered pages, YouTube metadata, and similar). The fallback rule is defined in each built skill's `references/research-tool-contract.md` under "Firecrawl Fallback".

**How it is provided:** Firecrawl is added once as an org-level custom Web connector in Cowork (Organization settings → Connectors → Add → Custom → Web) using Firecrawl's hosted MCP endpoint. S3 creatives inherit access automatically — no per-user setup is required.

**Endpoint format:** `https://mcp.firecrawl.dev/{FIRECRAWL_API_KEY}/v2/mcp`

**API key management:** Keys are generated at https://www.firecrawl.dev/app/api-keys. The key is embedded in the connector URL, so rotate it in both places when rotating.
