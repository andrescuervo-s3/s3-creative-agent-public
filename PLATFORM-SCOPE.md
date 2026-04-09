# S3 Creative Platform — Scope & Vision

## What Is This

A standalone SaaS platform powered by Anthropic's Managed Agents that runs the S3 Marketing methodology as a product. Replaces the Cowork plugin with a purpose-built environment where the brief pipeline is deterministic, persistent, and multi-user.

## Why Build It

- **Reliability**: Cowork agents skip steps (context files, checkpoints). Managed Agents execute what you define.
- **Persistence**: Client memory, conversation threads, and project state survive across sessions natively.
- **Multi-user**: Multiple team members work on the same client with shared context.
- **Dev workflow**: Direct access to agent threads, logs, and memory — no screenshot-and-paste testing loop.
- **Product potential**: The S3 methodology becomes a sellable platform, not an internal tool.

---

## Core Capabilities

### User Experience
- [ ] Authenticated login per team member
- [ ] Role-based access: Admin, Strategist, Designer (each sees what they need)
- [ ] Personal dashboard: assigned clients, active projects, recent activity
- [ ] Client workspace: all briefs, documents, and conversation history in one place
- [ ] Resume any conversation where it left off (persistent threads)
- [ ] Drag-and-drop file uploads
- [ ] Document previews with inline editing (no downloading .docx to read it)
- [ ] Download .docx as standard delivery when needed (client handoff, external sharing)
- [ ] Share or transfer a project to another user
- [ ] Light and dark mode
- [ ] Pipeline pizza tracker — visual progress indicator showing where each client is in the creative pipeline (Foundational → Creative Call → Strategy → Creative Brief → Turnover → Wireframe), what's complete, what's in progress, what's next

### Brief Pipeline (carried over from plugin)
- [ ] Brief Selector — routing to the right brief type and mode
- [ ] Foundational Brief — New, Update, Finalize modes
- [ ] Strategy Brief — collaborative conversation with pressure test gate
- [ ] Creative Brief: Website
- [ ] Creative Brief: Media
- [ ] Creative Brief: Paid Ads
- [ ] Creative Brief: Social Media
- [ ] Recommendation Document
- [ ] Creative Turnover
- [ ] Wireframe Brief

### Agent Architecture
- [ ] Orchestrator agent per brief type (replaces SKILL.md)
- [ ] Research subagents (social media, SEO, audiences, competitors) — true parallel execution
- [ ] Validation agent — checks research output before writing phase
- [ ] Brief selector agent — routes users to the right orchestrator

### Memory & State
- [ ] Per-client memory store (replaces CLAUDE.md + MEMORY.md context files)
  - Client name, industry, key people, decisions
  - Document inventory (what's been collected, where it lives)
  - Brief history (which briefs exist, their status, output locations)
  - Research findings (reusable across briefs)
- [ ] Shared standards memory (S3 formatting rules, docx styles, section templates)
- [ ] Session state (replaces progress.json) — handled natively by thread persistence

### Integrations (Connectors)
- [ ] Google Drive — read source documents, save output briefs to client folder, one-click save
- [ ] Gmail — send briefs, receive feedback, pull email threads into client context
- [ ] Slack — notifications, approvals, pull relevant channel conversations into client context
- [ ] Notion — sync project pages, pull meeting notes and planning docs
- [ ] Zoom — import meeting transcripts (creative calls, client meetings) directly into client knowledge base
- [ ] Google Calendar — schedule creative calls, set review deadlines, link meetings to clients
- [ ] Content Snare — pull client-submitted materials
- [ ] SmugMug — pull photography and image assets
- [ ] Frame.io — pull video assets and review comments
- [ ] Connector framework — standardized pattern so new integrations can be added without rearchitecting
- [ ] Auto-pull: connectors watch for updates related to a project (new email thread, Slack message, Drive file, Zoom transcript)
- [ ] Incoming items surface in an inbox/feed — user decides: incorporate into brief, dismiss, keep as a note, add to knowledge base
- [ ] Dismissed items are gone, not cluttering the workspace

### Information Gaps & Requests
- [ ] Platform identifies missing documents or data needed for the next pipeline step
- [ ] Generates a todo list of outstanding items (e.g., "Need logo files," "Missing competitor list," "No Google Analytics access")
- [ ] Routes the request to the right person — PM gets the action item, not the strategist or designer
- [ ] PM sees a unified view of all outstanding requests across their clients
- [ ] Manual requests: any user can flag a gap and request data — the request attaches a link to the current project state so the PM has full context on why it's needed and where it fits
- [ ] Status tracking: requested → received → ingested
- [ ] Notifications when items come in (Slack, email, or in-platform)
- [ ] Ties into pipeline tracker — a brief can't advance until its required inputs are fulfilled

### Wireframe Builder
- [ ] AI generates initial wireframes from the website creative brief — page layouts, component placement, content hierarchy
- [ ] Pulls from client knowledge base: brand assets, content inventory, competitor references, photography
- [ ] Interactive canvas for designers to edit, rearrange, and refine the AI-generated wireframes
- [ ] Drag-and-drop components (hero, nav, CTA, testimonials, footer, etc.)
- [ ] Real content populated from brief sections — not lorem ipsum
- [ ] Wireframes built as React components — structured, semantic, maps cleanly to Figma auto-layout
- [ ] Export to Figma (component structure preserved)
- [ ] Export as annotated PDF for client review
- [ ] Versioning — track iterations between internal review and client feedback
- [ ] Comments/annotations — strategist and designer collaborate on the same wireframe

### Search
- [ ] Global search across all clients, documents, briefs, conversations, and assets
- [ ] Scoped search within a single client workspace
- [ ] Full-text search inside document content (not just titles)
- [ ] Filter by type: brief, upload, conversation, asset, wireframe

### Client Assets
- [ ] Dedicated asset space per client — photos, logos, brand files, video, fonts
- [ ] Drag-and-drop upload
- [ ] Pull assets via API: SmugMug, Frame.io
- [ ] Asset tagging and organization (auto-categorize: photography, logo, icon, video, etc.)
- [ ] Assets feed into wireframe builder and brief content automatically
- [ ] Preview thumbnails for images and video
- [ ] Download individual assets or bulk download all client assets as .zip

### Client Sharing (External)
- [ ] Share specific deliverables with clients — wireframes, briefs, documents — without exposing the full pipeline
- [ ] Client sees only what's shared — no dashboard, no internal briefs, no strategy details
- [ ] Password-protected share links
- [ ] Granular control: share the wireframe but not the strategy brief, share the foundational brief but not the research
- [ ] Client can leave comments/feedback on shared items
- [ ] Feedback flows back into the platform as an action item for the assigned team member
- [ ] Revoke access at any time

### AI Chat
- [ ] Project-level chat — scoped to a client's sources, briefs, assets, and conversation history
- [ ] General-level chat — unscoped, full Claude capabilities for brainstorming, copywriting, general questions
- [ ] Toggle between scoped and general within the same conversation
- [ ] Chat lives in the client workspace alongside briefs and documents
- [ ] Chat history persists and is searchable

### Project Knowledge Base
- [ ] Central repository for everything known about a client — documents, briefs, research, notes, linked external sources
- [ ] Sources include: uploaded files, produced briefs, research findings, conversation history, connector imports (emails, Slack threads, Zoom transcripts, Drive docs)
- [ ] External sources can be linked (reference stays in knowledge base even if original lives elsewhere)
- [ ] Drag-and-drop new files directly into the knowledge base
- [ ] Delete items from the knowledge base
- [ ] Sort by most recent, filter by type
- [ ] Archive items — out of active view but retrievable
- [ ] Ask questions against the knowledge base — scoped to that client's sources (NotebookLM-style)
- [ ] Toggle scope on/off — expand to general knowledge or constrain to client sources only
- [ ] Available to all roles: strategist asks about brand positioning, designer asks about visual direction, admin asks about project status
- [ ] Answers cite which source document the information came from

### Quality & Governance
- [ ] Approval gates between phases (research → validate → write)
- [ ] Confidence scoring on research claims
- [ ] Source attribution — every fact links back to its document
- [ ] Audit trail — who ran what, when, with what inputs
- [ ] Brief versioning — track changes between Draft and Final

---

## Frontend (To Be Scoped)

### Pages
- [ ] Login / Auth
- [ ] Dashboard (my clients, recent activity, pipeline tracker)
- [ ] Client workspace (briefs, documents, conversations, knowledge base)
- [ ] Document view (inline preview with editing, download .docx option)
- [ ] Conversation view (active agent thread)
- [ ] Upload view (drag-and-drop, bulk upload)
- [ ] Admin (team members, roles, permissions, integrations)
- [ ] Settings (theme, notifications, default Drive folder)

### Design Direction — Linear meets Notion

**Principles:**
- Clean, minimal, fast — a creative tool, not project management software
- Content-rich pages that feel like documents, not data tables
- Subtle animations, nothing flashy
- Dark mode that looks intentional, not bolted on
- No visual clutter — the work is the interface

**Layout:**
- Left sidebar: clients list, starred/recent, inbox (connector updates), general chat
- Main area: whatever you clicked into — client workspace, brief, wireframe, knowledge base, conversation
- No top nav fighting with the sidebar
- Pipeline pizza tracker lives at the top of each client workspace — subtle, always visible, not a separate page

**Flexible views:**
- PM sees tables and status lists
- Designer sees cards and visual previews
- Strategist sees documents and conversations
- Each role gets the view that fits how they think, same underlying data

**What to avoid:**
- Monday.com / Asana energy — too much color, too many widgets
- Dashboard crammed with charts and metrics
- Anything that feels like software instead of a workspace

### Tech Stack (TBD)
- Frontend framework: TBD (React/Next.js likely)
- Auth: TBD
- Hosting: Vercel (frontend) + Cloudflare R2 (assets)
- Database: Supabase or PlanetScale
- API layer: Managed Agents API

---

## Migration Path

The Cowork plugin continues to run as-is while the platform is built. No disruption to current workflow.

1. **Phase 1**: Stand up the platform with Foundational Brief agent + Google Drive tool
2. **Phase 2**: Add Strategy Brief agent, Content Snare integration
3. **Phase 3**: Creative Brief agents (all 4 subtypes)
4. **Phase 4**: Recommendation Doc, Creative Turnover, Wireframe
5. **Phase 5**: Team features (multi-user, notifications, audit trail)

---

## Open Questions

- Pricing model: per-seat, per-client, per-brief?
- Client-facing access: do clients ever log in, or is this internal-only?
- White-labeling: does the platform need to run under a client's brand?
- Content Snare replacement: does the platform's upload feature replace Content Snare entirely?
- Figma integration: can the wireframe brief push directly to Figma?
