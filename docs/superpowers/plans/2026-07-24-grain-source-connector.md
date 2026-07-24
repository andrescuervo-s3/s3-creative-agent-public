# Grain Source Connector Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Wire the already-connected Grain MCP into the document-gathering phase of the S3 brief pipeline so every brief is built with the client's recorded conversations (client-facing and internal) as a source of truth, scoped to the brief's date window.

**Architecture:** A single shared reference module (`references/grain-source.md`) defines all Grain retrieval, relevance triage, and inheritance logic. It is duplicated byte-for-byte into each in-scope skill's `references/` directory (Cowork copies plugins to a cache and cannot resolve paths outside the skill dir). Each `SKILL.md` gets a small hook in its existing ingestion phase that points to the module and passes its stage's date window. No new skill, no MCP/config changes.

**Tech Stack:** Markdown skill files (Agent Skills spec), Grain MCP tools (referenced by bare name), `skills-ref` validator (via `uv`), git.

## Global Constraints

- **No em dashes** in skill/brief content — use commas, colons, or periods. (The plan prose and this file may use them; the *skill files* must not.)
- **No code/HTML/debug output** in brief content.
- **Connector tools are referenced by bare name** (e.g. `list_meetings`, `search_in_transcripts`), matching the existing convention (`google_drive_search`, `search_surveys`). Never use the `mcp__<uuid>__` form — the UUID is session-specific and unstable.
- **Shared references must stay identical across skill dirs.** When `grain-source.md` changes, every copy changes. (CLAUDE.md rule.)
- **SKILL.md body target:** <500 lines, <5000 tokens. Keep hooks short; detail lives in `grain-source.md`.
- **Version bump touches BOTH** `.claude-plugin/marketplace.json` (root) and `s3-creative-agent/.claude-plugin/plugin.json`. Current: `3.25.0` → target `3.26.0`.
- **In-scope skills:** `s3-foundational-brief`, `s3-strategy-brief`, `s3-creative-brief-website`, `s3-recommendation-doc`. Out of scope: the three creative-brief stubs and `s3-brief-selector`.
- **Grain tool rule:** always `list_meetings` (workspace access-scoped), never `list_attended_meetings`.
- All paths below are relative to the repo root: `/Users/andrescuervo/Studio III Dropbox/Andres Cuervo/Claude Code/Plugins/s3-creative-agent`.

---

### Task 1: Author the shared `grain-source.md` module and place identical copies in all four skill reference dirs

**Files:**
- Create: `s3-creative-agent/skills/s3-foundational-brief/references/grain-source.md`
- Create: `s3-creative-agent/skills/s3-strategy-brief/references/grain-source.md`
- Create: `s3-creative-agent/skills/s3-creative-brief-website/references/grain-source.md`
- Create: `s3-creative-agent/skills/s3-recommendation-doc/references/grain-source.md`

**Interfaces:**
- Produces: the canonical Grain retrieval module. Every consuming `SKILL.md` (Tasks 3–6) references it as `references/grain-source.md` and passes a **date window** (`after_datetime`, `before_datetime`) plus an **inheritance** list.

- [ ] **Step 1: Write the module to the foundational skill dir**

Create `s3-creative-agent/skills/s3-foundational-brief/references/grain-source.md` with exactly this content:

```markdown
# Grain — Client & Internal Conversations (Source Module)

Grain captures meeting transcripts and AI notes for S3's calls. This module defines how any brief pulls the client's recorded conversations, both client-facing calls and internal S3 conversations, as a source of truth scoped to the brief's date window.

Grain is already connected as an MCP. Reference its tools by bare name: `search_companies`, `search_persons`, `list_meetings`, `search_in_transcripts`, `fetch_meeting_notes`, `fetch_meeting_transcript`, `get_dossier_for_company`.

## Tool rules

- Always use `list_meetings` (every meeting in the workspace you have access to). NEVER use `list_attended_meetings`. Attended-only wrongly narrows the net. Any accessible meeting where the client is mentioned counts, not just meetings you attended.
- Never bulk-fetch full transcripts. `fetch_meeting_notes` is the default. `fetch_meeting_transcript` is on-demand only, for a single meeting that needs a deep read.

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
```

- [ ] **Step 2: Copy the module to the other three skill dirs (byte-identical)**

Run:

```bash
cd "/Users/andrescuervo/Studio III Dropbox/Andres Cuervo/Claude Code/Plugins/s3-creative-agent"
SRC="s3-creative-agent/skills/s3-foundational-brief/references/grain-source.md"
for d in s3-strategy-brief s3-creative-brief-website s3-recommendation-doc; do
  cp "$SRC" "s3-creative-agent/skills/$d/references/grain-source.md"
done
```

- [ ] **Step 3: Verify all four copies exist and are identical**

Run:

```bash
cd "/Users/andrescuervo/Studio III Dropbox/Andres Cuervo/Claude Code/Plugins/s3-creative-agent"
md5 -q s3-creative-agent/skills/*/references/grain-source.md
```

Expected: four lines printed, all the same hash.

- [ ] **Step 4: Verify content anchors are present**

Run:

```bash
cd "/Users/andrescuervo/Studio III Dropbox/Andres Cuervo/Claude Code/Plugins/s3-creative-agent"
grep -c "list_attended_meetings\|Tier 1: Always include\|Inherit and delta\|Confirm gate" s3-creative-agent/skills/s3-foundational-brief/references/grain-source.md
```

Expected: `4` (all four anchor strings found).

- [ ] **Step 5: Commit**

```bash
cd "/Users/andrescuervo/Studio III Dropbox/Andres Cuervo/Claude Code/Plugins/s3-creative-agent"
git add s3-creative-agent/skills/*/references/grain-source.md
git commit -m "Add shared grain-source.md retrieval module to all in-scope skills"
```

---

### Task 2: Register Grain in CONNECTORS.md

**Files:**
- Modify: `s3-creative-agent/CONNECTORS.md`

**Interfaces:**
- Consumes: nothing.
- Produces: the plugin-level record that Grain is a configured source. No downstream task depends on its exact wording.

- [ ] **Step 1: Add the Grain row to the connectors table**

In `s3-creative-agent/CONNECTORS.md`, find this exact block:

```
| Category | Tool | Status |
|----------|------|--------|
| Chat | Slack | Configured |
| Design | Figma | Configured |
| Knowledge base | Google Docs, Google Drive | Configured |
| Client surveys | Content Snare (MCP) | Configured |
| Web research fallback | Firecrawl (MCP) | Configured at org level |
```

Replace it with (adds one row):

```
| Category | Tool | Status |
|----------|------|--------|
| Chat | Slack | Configured |
| Design | Figma | Configured |
| Knowledge base | Google Docs, Google Drive | Configured |
| Client surveys | Content Snare (MCP) | Configured |
| Meeting conversations | Grain (MCP) | Configured |
| Web research fallback | Firecrawl (MCP) | Configured at org level |
```

- [ ] **Step 2: Add a "Grain" section after the Firecrawl section**

At the end of `s3-creative-agent/CONNECTORS.md`, append:

```markdown

## Grain — Meeting Conversations

Grain captures transcripts and AI notes from S3's calls. It is the source of truth for client-facing and internal conversations during brief building. Each brief pulls the client's relevant recordings up to the brief's creation date; downstream briefs inherit prior citations and pull only the delta.

**How it is provided:** Grain is connected once as an MCP connector in Cowork. S3 creatives inherit access. No per-user setup or API key lives in this repo.

**Retrieval logic:** defined in each in-scope skill's `references/grain-source.md` (shared module). Skills that consume it: `s3-foundational-brief`, `s3-strategy-brief`, `s3-creative-brief-website`, `s3-recommendation-doc`.
```

- [ ] **Step 3: Verify**

Run:

```bash
cd "/Users/andrescuervo/Studio III Dropbox/Andres Cuervo/Claude Code/Plugins/s3-creative-agent"
grep -c "Grain" s3-creative-agent/CONNECTORS.md
```

Expected: `3` or more (table row + section heading + body mentions).

- [ ] **Step 4: Commit**

```bash
cd "/Users/andrescuervo/Studio III Dropbox/Andres Cuervo/Claude Code/Plugins/s3-creative-agent"
git add s3-creative-agent/CONNECTORS.md
git commit -m "Register Grain connector in CONNECTORS.md"
```

---

### Task 3: Wire Grain into the Foundational Brief (anchor pull)

**Files:**
- Modify: `s3-creative-agent/skills/s3-foundational-brief/SKILL.md`
- Modify: `s3-creative-agent/skills/s3-foundational-brief/references/document-sources.md`

**Interfaces:**
- Consumes: `references/grain-source.md` (Task 1), with an **empty `after_datetime`** (anchor pull) and `before_datetime` = brief creation date.
- Produces: the Foundational stage's Grain citations, inherited by the Strategy Brief (Task 4) via MEMORY.md / the Reference section.

- [ ] **Step 1: Insert the Grain collection subsection into Phase 1**

In `s3-creative-agent/skills/s3-foundational-brief/SKILL.md`, find this exact line (the heading that begins the compile step):

```
### 1c. Compile and Confirm
```

Insert BEFORE it (so a new 1c-grain subsection sits between "1b. Google Drive" and "1c. Compile and Confirm"):

```markdown
### 1b-2. Grain — Client & Internal Conversations (Anchor Pull)

Read `references/grain-source.md`. Run it as the **anchor pull**: `after_datetime` empty (all history), `before_datetime` = the brief's creation date. No inheritance (this is the first stage).

This produces a classified candidate list of the client's Grain meetings (client-facing and internal). Do not read full transcripts here. Pull `fetch_meeting_notes` for included meetings only. Carry the candidate list into 1c so it appears in the confirm gate.

```

- [ ] **Step 2: Add Grain to the compile/confirm list**

In the same file, find this exact block inside "### 1c. Compile and Confirm":

```
List every document collected from both sources:

- **Content Snare**: [survey name(s) and who completed them]
- **Google Drive**: [document names and locations]
```

Replace with:

```
List every document collected from all sources:

- **Content Snare**: [survey name(s) and who completed them]
- **Google Drive**: [document names and locations]
- **Grain**: [included meetings — title, date, internal/external, tier reason. Note any dropped as noise.]
```

- [ ] **Step 3: Add grain-source.md to the Reference Files list**

In the same file, find this exact line in the "## Reference Files" section:

```
- `references/document-sources.md` -- Source map: which document type lives where and which tool to use
```

Insert AFTER it:

```
- `references/grain-source.md` -- Read during Phase 1 (step 1b-2). Grain retrieval, relevance triage, and inheritance. Anchor pull for the foundational brief.
```

- [ ] **Step 4: Add Grain rows to document-sources.md**

In `s3-creative-agent/skills/s3-foundational-brief/references/document-sources.md`, find this exact block:

```
| Document | Source | Tool |
|----------|--------|------|
| Creative Survey (Client Intake Questionnaire) | Content Snare | `search_surveys` → `get_full_survey` |
```

Replace with (adds two Grain rows at the top of the conversation sources):

```
| Document | Source | Tool |
|----------|--------|------|
| Client-facing call recordings | Grain | `search_companies` → `list_meetings` / `search_in_transcripts` → `fetch_meeting_notes` |
| Internal conversations (client discussed) | Grain | `search_in_transcripts` → `fetch_meeting_notes` |
| Creative Survey (Client Intake Questionnaire) | Content Snare | `search_surveys` → `get_full_survey` |
```

- [ ] **Step 5: Verify the wiring**

Run:

```bash
cd "/Users/andrescuervo/Studio III Dropbox/Andres Cuervo/Claude Code/Plugins/s3-creative-agent"
grep -c "grain-source.md\|1b-2. Grain\|Grain**:" s3-creative-agent/skills/s3-foundational-brief/SKILL.md
grep -c "Grain" s3-creative-agent/skills/s3-foundational-brief/references/document-sources.md
```

Expected: first ≥ `3`, second ≥ `2`.

- [ ] **Step 6: Confirm no em dashes were introduced in the edited regions**

Run:

```bash
cd "/Users/andrescuervo/Studio III Dropbox/Andres Cuervo/Claude Code/Plugins/s3-creative-agent"
grep -n "—" s3-creative-agent/skills/s3-foundational-brief/SKILL.md | grep -i grain || echo "no em dashes in grain lines"
```

Expected: `no em dashes in grain lines`.

- [ ] **Step 7: Commit**

```bash
cd "/Users/andrescuervo/Studio III Dropbox/Andres Cuervo/Claude Code/Plugins/s3-creative-agent"
git add s3-creative-agent/skills/s3-foundational-brief/SKILL.md s3-creative-agent/skills/s3-foundational-brief/references/document-sources.md
git commit -m "Wire Grain anchor pull into Foundational Brief Phase 1"
```

---

### Task 4: Wire Grain into the Strategy Brief (delta since foundational)

**Files:**
- Modify: `s3-creative-agent/skills/s3-strategy-brief/SKILL.md`

**Interfaces:**
- Consumes: `references/grain-source.md` (Task 1), with `after_datetime` = Foundational "Created" date (the skill already extracts this in Step 1) and `before_datetime` = now. Inherits the Foundational Brief's Grain meetings.
- Produces: the Strategy stage's Grain citations, inherited by the Website Creative Brief (Task 5).

- [ ] **Step 1: Add a Grain bullet to the connector scans**

In `s3-creative-agent/skills/s3-strategy-brief/SKILL.md`, find this exact block in "### Step 2: Connector Scans (Run in Parallel)":

```
These scans are independent of each other. Run them in parallel:

- **Slack:** threads mentioning client name (requires connector)
- **Google Drive:** files related to client, created or modified since foundational date
- **Google Docs:** documents mentioning client, modified since foundational date
- **Local workspace:** any documents in the session workspace
```

Replace with:

```
These scans are independent of each other. Run them in parallel:

- **Grain:** client-facing and internal conversations since the foundational date. Read `references/grain-source.md`. Pass `after_datetime` = Foundational "Created" date, `before_datetime` = now. Inherit the foundational brief's Grain meetings (do not re-scan them). Present included meetings in the Ingestion Catalog with their tier reason.
- **Slack:** threads mentioning client name (requires connector)
- **Google Drive:** files related to client, created or modified since foundational date
- **Google Docs:** documents mentioning client, modified since foundational date
- **Local workspace:** any documents in the session workspace
```

- [ ] **Step 2: Add grain-source.md to the Strategy Brief Reference Files list**

In the same file, locate the reference-files list (the block of `- \`references/...\`` lines near the end of the file). Find the line for `per-client-context-files.md`:

```bash
cd "/Users/andrescuervo/Studio III Dropbox/Andres Cuervo/Claude Code/Plugins/s3-creative-agent"
grep -n "references/per-client-context-files.md" s3-creative-agent/skills/s3-strategy-brief/SKILL.md
```

Insert a new line immediately after that `per-client-context-files.md` entry:

```
- `references/grain-source.md` -- Read during Phase 1 Step 2. Grain retrieval, triage, and inheritance. Delta pull since the foundational date.
```

If the Strategy Brief has no reference-files list, add the same line inside "### Step 2: Connector Scans" is already covered by Step 1 above; skip this step and note it in the task log.

- [ ] **Step 3: Verify**

Run:

```bash
cd "/Users/andrescuervo/Studio III Dropbox/Andres Cuervo/Claude Code/Plugins/s3-creative-agent"
grep -c "grain-source.md\|**Grain:**" s3-creative-agent/skills/s3-strategy-brief/SKILL.md
```

Expected: ≥ `2`.

- [ ] **Step 4: Commit**

```bash
cd "/Users/andrescuervo/Studio III Dropbox/Andres Cuervo/Claude Code/Plugins/s3-creative-agent"
git add s3-creative-agent/skills/s3-strategy-brief/SKILL.md
git commit -m "Wire Grain delta pull into Strategy Brief ingestion"
```

---

### Task 5: Wire Grain into the Website Creative Brief (delta since strategy)

**Files:**
- Modify: `s3-creative-agent/skills/s3-creative-brief-website/SKILL.md`

**Interfaces:**
- Consumes: `references/grain-source.md` (Task 1), with `after_datetime` = Strategy "Created" date and `before_datetime` = now. Inherits the Strategy Brief's Grain meetings.
- Produces: the Website stage's Grain citations (inherited by future creative-brief stages when built).

- [ ] **Step 1: Add a Grain bullet to the connector scans**

In `s3-creative-agent/skills/s3-creative-brief-website/SKILL.md`, find this exact block:

```
**Step 4 — Connector Scans (Run in Parallel):**

Filter to material created or modified since the Strategy Brief's created date. These scans are independent — run them in parallel:

- **Slack:** threads mentioning client name (requires connector)
- **Google Drive:** files related to client, modified since strategy brief date
- **Local workspace:** any documents in the session workspace
```

Replace with:

```
**Step 4 — Connector Scans (Run in Parallel):**

Filter to material created or modified since the Strategy Brief's created date. These scans are independent — run them in parallel:

- **Grain:** client-facing and internal conversations since the strategy brief date. Read `references/grain-source.md`. Pass `after_datetime` = Strategy "Created" date, `before_datetime` = now. Inherit the strategy brief's Grain meetings (do not re-scan them). Present included meetings in the Ingestion Catalog with their tier reason.
- **Slack:** threads mentioning client name (requires connector)
- **Google Drive:** files related to client, modified since strategy brief date
- **Local workspace:** any documents in the session workspace
```

- [ ] **Step 2: Add grain-source.md to the Reference Files list**

In the same file, find this exact line (confirmed at the end of the file):

```
- `references/per-client-context-files.md` -- Read during Phase 1. Defines CLAUDE.md, MEMORY.md, and document output logging.
```

Insert AFTER it:

```
- `references/grain-source.md` -- Read during Phase 1 Step 4. Grain retrieval, triage, and inheritance. Delta pull since the strategy date.
```

- [ ] **Step 3: Verify**

Run:

```bash
cd "/Users/andrescuervo/Studio III Dropbox/Andres Cuervo/Claude Code/Plugins/s3-creative-agent"
grep -c "grain-source.md\|**Grain:**" s3-creative-agent/skills/s3-creative-brief-website/SKILL.md
```

Expected: ≥ `2`.

- [ ] **Step 4: Commit**

```bash
cd "/Users/andrescuervo/Studio III Dropbox/Andres Cuervo/Claude Code/Plugins/s3-creative-agent"
git add s3-creative-agent/skills/s3-creative-brief-website/SKILL.md
git commit -m "Wire Grain delta pull into Website Creative Brief ingestion"
```

---

### Task 6: Wire Grain into the Recommendation Doc (standalone pull)

**Files:**
- Modify: `s3-creative-agent/skills/s3-recommendation-doc/SKILL.md`

**Interfaces:**
- Consumes: `references/grain-source.md` (Task 1), standalone (no inheritance), pull relevant to the recommendation's topic/date.
- Produces: nothing downstream (rec doc is outside the linear pipeline).

- [ ] **Step 1: Add Grain to the "Search everything immediately" source list**

In `s3-creative-agent/skills/s3-recommendation-doc/SKILL.md`, find this exact block:

```
As soon as you have the client name, search **all** of the following sources for recent activity. Do not skip any:

- **Gmail** — recent emails mentioning the client name (last 2 weeks)
- **Google Drive** — documents, briefs, meeting notes, proposals for this client
- **Slack** — messages and threads mentioning the client name across all channels
- **Notion** — pages, databases, meeting notes referencing the client
- **Google Calendar** — upcoming meetings with the client name
```

Replace with:

```
As soon as you have the client name, search **all** of the following sources for recent activity. Do not skip any:

- **Grain** — client-facing and internal conversations. Read `references/grain-source.md`. Standalone pull (no inheritance): pull the client's relevant recordings up to now. Capture meeting title, date, and internal/external for the Reference Links section.
- **Gmail** — recent emails mentioning the client name (last 2 weeks)
- **Google Drive** — documents, briefs, meeting notes, proposals for this client
- **Slack** — messages and threads mentioning the client name across all channels
- **Notion** — pages, databases, meeting notes referencing the client
- **Google Calendar** — upcoming meetings with the client name
```

- [ ] **Step 2: Add grain-source.md to the Reference Files list**

In the same file, find this exact line:

```
- `references/per-client-context-files.md` -- Read at the start. Check for and update CLAUDE.md and MEMORY.md in the client working folder.
```

Insert AFTER it:

```
- `references/grain-source.md` -- Read during Gather Context (Step 2). Grain retrieval and relevance triage. Standalone pull, no inheritance.
```

- [ ] **Step 3: Verify**

Run:

```bash
cd "/Users/andrescuervo/Studio III Dropbox/Andres Cuervo/Claude Code/Plugins/s3-creative-agent"
grep -c "grain-source.md\|**Grain**" s3-creative-agent/skills/s3-recommendation-doc/SKILL.md
```

Expected: ≥ `2`.

- [ ] **Step 4: Commit**

```bash
cd "/Users/andrescuervo/Studio III Dropbox/Andres Cuervo/Claude Code/Plugins/s3-creative-agent"
git add s3-creative-agent/skills/s3-recommendation-doc/SKILL.md
git commit -m "Wire Grain standalone pull into Recommendation Doc"
```

---

### Task 7: Validate, review, version bump, deploy prep

**Files:**
- Modify: `.claude-plugin/marketplace.json`
- Modify: `s3-creative-agent/.claude-plugin/plugin.json`

**Interfaces:**
- Consumes: all prior tasks.
- Produces: a validated, version-bumped plugin ready to push and Update in Cowork.

- [ ] **Step 1: Run the skills validator on every modified skill**

Run (best-effort; the validator lives in the vendored reference repo):

```bash
cd "/Users/andrescuervo/Studio III Dropbox/Andres Cuervo/Claude Code/Plugins/s3-creative-agent/.reference/agentskills/skills-ref"
for s in s3-foundational-brief s3-strategy-brief s3-creative-brief-website s3-recommendation-doc; do
  echo "== $s =="
  uv run skills-ref validate "../../../s3-creative-agent/skills/$s" 2>&1 | tail -5
done
```

Expected: each skill validates with no schema errors. If `uv` is unavailable, note it and fall back to a manual frontmatter check (each `SKILL.md` still has valid `name` + `description` and body under limits).

- [ ] **Step 2: Code-review each modified SKILL.md**

Per the project's integrity-check practice, dispatch the `code-reviewer`/`Explore` agent (or run `/code-review`) over the four modified `SKILL.md` files plus `grain-source.md`. Confirm: no em dashes in new content, no code/HTML in brief content, bare-name tool references, hooks point at `references/grain-source.md`, and the inherit+delta date windows are stated correctly per stage. Fix any findings inline and re-commit.

- [ ] **Step 3: Bump the version in BOTH files**

In `.claude-plugin/marketplace.json`, change `"version": "3.25.0"` to `"version": "3.26.0"`.

In `s3-creative-agent/.claude-plugin/plugin.json`, change `"version": "3.25.0"` to `"version": "3.26.0"`.

- [ ] **Step 4: Verify both versions match**

Run:

```bash
cd "/Users/andrescuervo/Studio III Dropbox/Andres Cuervo/Claude Code/Plugins/s3-creative-agent"
grep -h '"version"' .claude-plugin/marketplace.json s3-creative-agent/.claude-plugin/plugin.json
```

Expected: both print `"version": "3.26.0"`.

- [ ] **Step 5: Commit the version bump**

```bash
cd "/Users/andrescuervo/Studio III Dropbox/Andres Cuervo/Claude Code/Plugins/s3-creative-agent"
git add .claude-plugin/marketplace.json s3-creative-agent/.claude-plugin/plugin.json
git commit -m "Bump to v3.26.0: Grain as a pipeline source of truth"
```

- [ ] **Step 6: Deploy (user-initiated)**

Do NOT push automatically. Present the deploy command to the user:

```bash
git push origin main
```

Then remind them: the mirror action updates the public repo (~1 min), and they Update both Cowork installs. Share the cache-clear command:

```
rm -rf ~/Library/Caches/cowork/plugins/s3-creative-agent
```

---

## Self-Review (completed during planning)

**Spec coverage:**
- Inherit + delta model → grain-source.md "Inherit and delta model" table + per-skill date windows (Tasks 3–6). ✓
- 3-layer workspace-wide retrieval → grain-source.md Step 2 (Task 1). ✓
- Relevance triage (3 tiers + reasons) → grain-source.md Step 4 (Task 1). ✓
- Notes-first content policy → grain-source.md Step 5 (Task 1). ✓
- Confirm gate + Auto exception → grain-source.md Step 6; Foundational compile step (Task 3). ✓
- Recording for inheritance → grain-source.md Step 7 (Task 1). Folded the spec's `per-client-context-files.md` edit into the module for DRY (documented deviation — module owns the recording instruction, so the shared context-file copies are not touched). ✓
- CONNECTORS.md → Task 2. ✓
- document-sources.md rows → Task 3. ✓
- Version bump both files → Task 7. ✓
- Scope (4 skills, stubs excluded) → Global Constraints + Tasks 3–6. ✓

**Placeholder scan:** No TBD/TODO. Every edit shows exact old/new strings and the full module content. Task 4 Step 2 has a conditional fallback (if no ref-files list exists) — this is a genuine branch, not a placeholder, because the Strategy Brief's ref-list location was not line-verified during planning; the grep locates it.

**Type/name consistency:** Grain tool names are bare and identical everywhere (`list_meetings`, `search_in_transcripts`, `search_companies`, `fetch_meeting_notes`, `fetch_meeting_transcript`, `get_dossier_for_company`). Date-window parameter names (`after_datetime`, `before_datetime`) match the Grain MCP schema and are used identically across Tasks 3–6. The module file is referenced as `references/grain-source.md` everywhere.
