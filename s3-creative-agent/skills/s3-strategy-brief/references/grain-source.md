# Grain — Client & Internal Conversations (Source Module)

Grain captures meeting transcripts and AI notes for S3's calls. This module defines how any brief pulls the client's recorded conversations, both client-facing calls and internal S3 conversations, as a source of truth scoped to the brief's date window.

Grain is already connected as an MCP. Reference its tools by bare name: `search_companies`, `list_meetings`, `search_in_transcripts`, `fetch_meeting_notes`, `fetch_meeting_transcript`.

## Tool rules

- Always use `list_meetings` (every meeting in the workspace you have access to). NEVER use `list_attended_meetings`. Attended-only wrongly narrows the net. Any accessible meeting where the client is mentioned counts, not just meetings you attended.
- Never bulk-fetch full transcripts. `fetch_meeting_notes` is the default. `fetch_meeting_transcript` is on-demand only, for a single meeting that needs a deep read.
- **Capture the `recording_url` field on every meeting object** — that's the citable URL for the brief. Format: `https://grain.com/share/recording/{meeting-id}/{token}`. Do not cite a Grain meeting without its `recording_url`. See "Source URL Capture" in `research-tool-contract.md`.

## What each consuming skill passes in

- **Date window.** `before_datetime` is the brief's creation date (usually now). `after_datetime` is the previous brief's "Created" date, or empty for the anchor pull (Foundational).
- **Inheritance.** The Grain meetings already cited by upstream briefs (from MEMORY.md and the prior brief's Reference section). These are NOT re-scanned. They carry forward into this brief's Reference section.

## Inherit and delta model

| Stage | after_datetime | Inherits |
|-------|----------------|----------|
| Foundational Brief | empty (anchor pull, up to now) | nothing |
| Strategy Brief | Foundational "Created" date | Foundational's Grain meetings |
| Website / downstream | prior brief "Created" date | prior brief's Grain meetings |
| Recommendation Doc | empty (standalone, pull relevant to the topic/date) | nothing |

The date window makes the delta automatic: `after_datetime` excludes already-cited calls, and inheritance carries them forward without re-reading them.

## Step 1: Resolve the client

1. Call `search_companies` with the client name and common variations. Capture the company ID(s).
2. Read the client's email domain from CLAUDE.md if present. It helps interpret internal vs external.

## Step 2: Three discovery passes (run in parallel), all scoped to the date window

Cast the widest accessible net, workspace-wide.

1. **Transcript search (PRIMARY, the "mentioned anywhere" net):** `search_in_transcripts` with the client name plus brief-relevant topics. Returns matching segments across all accessible meetings. This catches calls the client did not join, is not a participant on, and is not named in the title.
2. **Title reinforcement:** `list_meetings` with `title_search` set to client name variations.
3. **Participant reinforcement:** `list_meetings` with `filters.companies` set to the client's company ID.

Apply the date window (`after_datetime` and `before_datetime`) to every pass.

## Step 3: Dedupe and label

- Dedupe by `meeting_id` across all three passes.
- Label each meeting internal vs external using `participant_scope` (internal = only S3-domain participants, external = some non-S3 participants).

## Step 4: Relevance triage

The net is deliberately wide, so classify each candidate off its AI notes plus transcript segment summaries, NOT the full transcript. The test: is the client a SUBJECT of this meeting, or just MENTIONED in it?

| Tier | Rule | Action | Signal |
|------|------|--------|--------|
| Tier 1: Always include | The client is a participant on the call (any client-facing call) | Include, always | Deterministic: company or participant match. No judgment. |
| Tier 2: Include | Internal meeting where the client is substantively discussed (official strategy, media, or creative call, or the subject of a real discussion segment) | Include | Also surfaced via the title or company pass, multiple matching segments, segment summaries that are about the client's work |
| Tier 3: Drop (noise) | The client name appears in one stray segment of an otherwise-unrelated meeting (a standup to-do list, a tangential name-drop) | Exclude | Single shallow hit, no sustained discussion |

Attach a one-line reason to every decision. For example: "Tier 2, dedicated media-strategy segment" or "Tier 3, single passing mention in a standup."

## Step 5: Content pull (token-safe)

For each INCLUDED meeting:

- `fetch_meeting_notes` (concise AI summary). This is the default.
- `search_in_transcripts` segments for specific topics as needed.
- `fetch_meeting_transcript` (full) only when a single meeting needs a deep read.

## Step 6: Confirm gate

Surface the classified candidates in the skill's existing ingestion or confirm step, one row per meeting: title, date, internal or external, participants, tier and reason.

- **Guided / default:** ask the user to confirm or override which to include. Overrides are the primary tuning signal.
- **Auto (Foundational Auto mode only):** apply the classifier silently. Include Tier 1 and Tier 2, drop Tier 3, and surface the kept set ranked by tier as important context. Do not stop.

## Step 7: Record for inheritance

For every INCLUDED meeting, record it in the client's context files immediately:

- **MEMORY.md:** one line per meeting under Key Context, with title, date, meeting_id, and internal or external.
- **Brief Reference / Source Documents section:** add each meeting (title and date) so the next pipeline stage inherits it.
- **progress.json decision log:** keep and drop decisions with tier and reason. This is calibration data and is transient.
- **CLAUDE.md Connectors Used:** "Grain: N meetings included (M dropped as noise)."

## Where Grain lands per brief

- **Foundational (facts only):** external and client calls become Client-Reported facts feeding 2.2 (Goals, Painpoints, Asks), Firm Backstory, and Business Model Notes. Internal calls are context only. A conversation is NEVER "Verified."
- **Strategy and Creative briefs:** internal and client conversations feed channel strategy, the Bright Idea, and creative-call outputs.
- **Recommendation Doc:** client-conversation backing for the position. Capture source detail for the Reference Links section.

## Calibration

The Tier 2 versus Tier 3 boundary is a heuristic, not a solved classifier. Guided overrides and the progress.json decision log are how it gets tuned. Treat the first few briefs per client as calibration runs.
