# Grain Source Connector — Design Spec

**Date:** 2026-07-24
**Type:** Cross-skill data source (not a new skill)
**Connector:** Grain (MCP, already connected)
**Skills touched:** `s3-foundational-brief`, `s3-strategy-brief`, `s3-creative-brief-website`, `s3-recommendation-doc`

## Purpose

Wire Grain into the document-gathering phase of the S3 brief pipeline so that every brief is built with the client's recorded conversations as a source of truth. This covers **both** client-facing calls and internal S3 conversations, up to the date the brief is created.

Grain captures meeting transcripts and AI notes. Today it is not referenced anywhere in the plugin (`CONNECTORS.md`, no skill, no reference file). This spec adds it as a shared source consumed by the existing ingestion phases — it does **not** create a new skill.

**What "the client's conversations" means here:** any accessible Grain meeting where the client is relevant — not only meetings a given user attended, and not only meetings the client joined. A call where the client is merely *discussed* (mentioned in the transcript) counts.

## Core Model: Inherit + Delta

Grain fits the pipeline's existing inheritance model, where each downstream brief filters to material created since the previous brief's date and the Reference/Source Documents section is inherited and additive.

| Stage | Grain date window | Inheritance |
|-------|-------------------|-------------|
| Foundational Brief | Everything up to the brief's creation date (`before_datetime` = now; no lower bound, or client-relationship start if known) | None — this is the anchor pull |
| Strategy Brief | `after_datetime` = Foundational "Created" date, `before_datetime` = now | Inherits the Grain meetings the Foundational Brief already cited (via MEMORY.md + Reference section), then pulls only the delta |
| Website Creative Brief | `after_datetime` = Strategy "Created" date, `before_datetime` = now | Inherits from Strategy, pulls the delta |
| Recommendation Doc | Standalone pull relevant to its topic/date (no inheritance — sits outside the linear pipeline) | None |

**Why this works:** the skills already extract the prior brief's "Created" date to use as a time filter (Strategy reads it from Foundational section 1.1; Website reads it from Strategy). Grain reuses that exact date as its `after_datetime`. No re-scanning of already-cited calls.

Each stage records the Grain meetings it used in `MEMORY.md` and the brief's Reference/Source Documents section, so the next stage inherits them automatically.

## Retrieval Logic (the shared module)

Lives in a new reference file `references/grain-source.md`, duplicated into each in-scope skill's `references/` directory (per the plugin's Cowork path constraint — Cowork copies plugins to a cache and cannot resolve paths outside the skill directory).

**Principle: cast the widest accessible net, then dedupe and label.** Workspace-wide, never attended-only.

### Step 1 — Resolve the client
- `search_companies` with the client name (and variations) → capture the company ID(s).
- Read the client's email domain from `CLAUDE.md` if present (helps interpret internal vs external).

### Step 2 — Three discovery passes (run in parallel), all scoped to the stage's date window
1. **Transcript search (primary — the "mentioned anywhere" net):** `search_in_transcripts` with the client name plus brief-relevant topics. Runs across all accessible meetings and returns matching segments. This is the layer that catches calls the client didn't join, isn't a participant on, and isn't named in the title.
2. **Title reinforcement:** `list_meetings` with `title_search` = client name variations. Catches consistently-named client and internal calls.
3. **Participant reinforcement:** `list_meetings` filtered by the client's company ID. Catches client-facing calls reliably.

**Tool rule:** always use `list_meetings` (workspace access-scoped), never `list_attended_meetings` (attended-only would wrongly narrow the net).

### Step 3 — Dedupe and label
- Dedupe by `meeting_id` across all three passes.
- Tag each meeting **internal** vs **external** using `participant_scope` (internal = only S3-domain participants; external = some non-S3 participants).

### Step 4 — Content policy (token-safe)
- **Default:** `fetch_meeting_notes` (concise AI summary) per confirmed meeting.
- **Targeted:** `search_in_transcripts` segments for specific topics.
- **On demand only:** `fetch_meeting_transcript` (full transcript) when a single meeting needs a deep read. Never bulk-fetch full transcripts.

### Step 5 — Relevance triage (classify before including)
Not every meeting that surfaces is worth including. The transcript net is deliberately wide, so each candidate is classified into one of three tiers using its AI notes + transcript segment summaries (never the full transcript — the triage is cheap). The test: **is the client a *subject* of this meeting, or just *mentioned* in it?**

| Tier | Rule | Action | Signal |
|------|------|--------|--------|
| **Tier 1 — Always include** | The client is an actual participant on the call (any client-facing call) | Include, always | Deterministic: company/participant match. No judgment. |
| **Tier 2 — Include** | Internal meeting where the client is *substantively* discussed — an official strategy/media/creative call, or the subject of a real discussion segment | Include | Judgment: also surfaced via title or company pass, multiple matching segments, segment summaries that are *about* the client's work |
| **Tier 3 — Drop (noise)** | The client name appears in one stray segment of an otherwise-unrelated meeting (standup to-do list, tangential name-drop) | Exclude | Judgment: single shallow hit, no sustained discussion |

Every classification carries a one-line reason (e.g. "Tier 2 — dedicated media-strategy segment" or "Tier 3 — single passing mention in a daily standup").

### Step 6 — Confirm gate
Present the classified candidates in the existing ingestion/confirm step: title, date, internal/external, participants, **tier + one-line reason**. User confirms or overrides which to include. Overrides are the primary tuning mechanism (see Calibration).
- **Exception:** Foundational Brief **Auto mode** applies the classifier silently — includes Tier 1 + Tier 2, drops Tier 3, surfaces the included set ranked by tier as important context, and does not stop (consistent with Auto mode's no-user-gate rule).

### Calibration (expectation-setting)
The Tier 2 vs Tier 3 boundary is a heuristic, not a solved classifier. It will misjudge some calls at first. Two mechanisms tune it:
1. **Guided overrides** — every include/drop shows its reason, so the user corrects it live.
2. **Decision log** — the classifier's keep/drop decisions (with reasons) are written to `progress.json` during a run so patterns can be reviewed across a few real clients and the signals adjusted.

The first few real briefs are calibration runs, not proof the boundary is right.

## Where Grain Content Lands

### Foundational Brief (facts-only)
- **Client/external calls** → `Client-Reported` confidence, feeding 2.2 (Goals, Painpoints, Asks), Firm Backstory, Business Model Notes.
- **Internal S3 calls** → context only. Never elevated to "Verified" from a conversation alone.
- Confidence vocabulary unchanged (Verified, Corroborated, Client-Reported, Unverified, Not Researched). A conversation is never "Verified."

### Strategy Brief / Creative Briefs
- Internal + client conversations feed channel strategy, the Bright Idea, and creative-call outputs. This is the strongest fit — the Strategy Brief already scans conversations since the foundational date.

## Files Touched

| File | Change |
|------|--------|
| `s3-creative-agent/CONNECTORS.md` | Add Grain row to the connectors table + a short "how it's provided" section |
| `references/grain-source.md` (NEW) | The shared retrieval module. Copied into `s3-foundational-brief`, `s3-strategy-brief`, `s3-creative-brief-website`, `s3-recommendation-doc` `references/` dirs |
| `s3-foundational-brief/SKILL.md` | Add a Grain subsection to Phase 1 Document Collection (anchor pull, up to creation date) + list `grain-source.md` in Reference Files |
| `s3-strategy-brief/SKILL.md` | Add Grain to Phase 1 Ingestion as a delta-since-foundational source + inherit prior Grain refs |
| `s3-creative-brief-website/SKILL.md` | Add Grain to Phase 1 Ingestion as a delta-since-strategy source + inherit prior Grain refs |
| `s3-recommendation-doc/SKILL.md` | Add Grain as a standalone source for client-conversation backing |
| `s3-foundational-brief/references/document-sources.md` | Add Grain rows (conversation sources) to the source map |
| `references/per-client-context-files.md` (all in-scope skill dirs) | Note Grain meetings in the inherited Reference list + `CLAUDE.md` "Connectors Used" |
| `.claude-plugin/marketplace.json` + `s3-creative-agent/.claude-plugin/plugin.json` | Version bump (both files, per deploy rule) |

## Non-Goals / Out of Scope

- The three creative-brief stubs (Media, Paid Ads, Social Media) are not built out yet; Grain is not wired into them now. When they are built, they inherit the same `grain-source.md` module.
- `s3-brief-selector` is a router with no ingestion — untouched.
- No changes to the MCP connection itself (Grain is already connected). No new API keys.
- No change to the confidence-scoring vocabulary or the facts-only rule of the Foundational Brief.

## Deployment

Follow the standard workflow: bump both version files, `git push origin main`, mirror action updates the public repo (~1 min), then Update in both Cowork installs. Share the cache-clear command:

```
rm -rf ~/Library/Caches/cowork/plugins/s3-creative-agent
```

## Open Questions

None blocking. Retrieval strategy, scope, inheritance model, content policy, relevance triage, and confirm-gate behavior are all settled with the user.

The one thing that is settled in *design* but unproven in *practice* is the Tier 2 vs Tier 3 relevance boundary. It ships as a heuristic and is tuned through Guided overrides and the decision log (see Calibration). The first few real briefs are treated as calibration runs.
