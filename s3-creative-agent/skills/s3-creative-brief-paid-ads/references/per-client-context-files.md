# Per-Client Context Files

Every client project maintains three persistent files in the working folder. These files serve different purposes and are written at different times.

| File | Purpose | Created | Updated |
|------|---------|---------|---------|
| CLAUDE.md | Project guidance: who, what, decisions | Step 0 (before anything else) | When key people or decisions change |
| MEMORY.md | Document index: what was produced, when | After first document output | After every document output |
| `{Client}_progress.json` | Session checkpoint: in-flight state | When skill work begins | After every major step |

---

## Hard boundary: these files hold facts, NOT instructions

CLAUDE.md and MEMORY.md load automatically as folder instructions at the start of every session, before any skill runs. Anything written in them competes with the skills for control of the workflow, and folder instructions win. Treat that as a loaded gun.

**Never write into a per-client file:**

- **Workflow or sequencing instructions.** "Read MEMORY.md before doing anything else." "Start every session by..." "Always sweep email and Drive first." These preempt skill routing outright: the user asks for a brief, the model obeys the folder instruction, and the brief skill never runs. This exact line cost a full debugging day on Colombo Law.
- **Formatting, style, type scale, palette, or table rules.** Those live in `s3-docx-styler` and change whenever the visual system changes. A per-client copy goes stale silently, and the model follows the stale copy over the current skill.
- **Document architecture.** "Section 1.2 is The Read." "The 4-table rule." Retired conventions get resurrected this way long after the skills dropped them.

**Only write:** key people, decisions, work agreement line items, connectors used, and an index of documents produced with dates.

Reading a client's CLAUDE.md or MEMORY.md never replaces routing. If the user asks for a brief, `s3-brief-selector` still runs and still asks its questions, no matter how much context the folder supplied.

If you find banned content in an existing client file, remove it and tell the user what you removed and why. A per-client file that describes *how to work* is a bug, not context.

---

## CLAUDE.md

**Location:** Root of the client's working folder.

**Purpose:** Project-level instructions and context. This is the client's single source of truth for who the key people are, what has been decided, and what connectors are available.

**When to create:** Step 0 of every skill. Before document collection, before research, before anything. If CLAUDE.md already exists, read it. If not, create it with whatever you know (even if just the client name). Expand it as you learn more.

**Contents:**

```markdown
# {Client Name}

## Key People
- {Name} — {Role} (e.g., "Ashley — Office Manager, Big Auto Phoenix")

## Documents Produced
- {Document name} — {status: DRAFT/FINAL} — {date}

## Work Agreement
- {Line item} — {monthly cost if known}

## Connectors Used
- {Connector}: {what was found or "no results"}

## Key Decisions
- {Decision and date} (e.g., "Brand voice: guide energy, not fighter energy — 2026-04-07")
```

**Update rules:**
- Add new people as they appear in conversations, Slack threads, or documents
- Add new documents as they are produced (immediately, not batched at end)
- Add key decisions that affect downstream skills (brand direction, scope changes, approved strategies)
- Do not remove previous entries. Append.

---

## MEMORY.md

**Location:** Root of the client's working folder, alongside CLAUDE.md.

**Purpose:** An index of what has been produced and learned about this client. Structured as one-line entries. This is how downstream skills know what the pipeline has already done.

**When to create:** After the first document is produced. Not at the start of the skill (you have nothing to index yet), but immediately after producing output.

**Contents:**

```markdown
# {Client Name} — Project Memory

## Documents
- Foundational Brief: {filename}.docx (created {date}, updated {date})
- Strategy Brief: {filename}.docx (created {date})

## Key Context
- {One-line summary of something learned that future skills need}
- {One-line summary}

## Open Items
- {Unresolved question or deferred decision}
```

**Update rules:**
- Add document entries immediately when a brief is created or updated. Do not wait until the end.
- Add key context when something non-obvious is learned (e.g., "Popok audience does NOT interact with bigauto.com — separate domain and intake flow")
- Add open items when something is deferred or unresolved
- Mark open items as resolved when they are addressed
- Keep it scannable. One line per entry. No paragraphs.

---

## {Client}_progress.json

**Location:** Root of the client's working folder.

**Purpose:** In-session checkpoint. Tracks what the current skill has done so far. If the session dies, crashes, or runs out of context, the next session reads this file and picks up where it left off.

**When to create:** When the skill begins its work phase (after Step 0, after document collection starts).

**When to update:** After every major step. Not at the end. After each one.

**When to delete:** After the skill completes successfully and all outputs are saved. The progress file is transient — it exists only while work is in flight.

**Structure:**

```json
{
  "skill": "s3-foundational-brief",
  "client": "Big Auto",
  "mode": "new",
  "started": "2026-04-09T14:30:00Z",
  "last_checkpoint": "2026-04-09T15:12:00Z",
  "phase": "section-writing",
  "completed_steps": [
    "document-collection",
    "content-snare-survey",
    "google-drive-docs",
    "context-files-created",
    "section-1.0",
    "section-1.1",
    "social-media-research",
    "section-2.1"
  ],
  "current_step": "section-2.2",
  "documents_collected": [
    "Creative Survey (Content Snare)",
    "Sales Turnover (Google Drive)",
    "Work Agreement (Google Drive)",
    "Creative Call Notes (Google Drive)",
    "Creative Download (Google Drive)"
  ],
  "research_completed": {
    "social_media": true,
    "seo_digital": false,
    "audiences": false,
    "competitors": false
  },
  "output_file": "Big_Auto_Foundational_Brief_DRAFT.docx"
}
```

**Checkpoint triggers** (save progress.json after each):
- Document collection complete
- Each research protocol complete
- Each section written (in guided mode: after approval; in auto mode: after writing)
- Document output saved
- Context files updated

**Recovery:** When a skill starts and finds an existing progress.json for itself:
1. Read the file
2. Tell the user: "I found a previous session that stopped at {current_step}. Want me to pick up from there or start over?"
3. If picking up: skip completed steps, resume from current_step
4. If starting over: delete the progress file and begin fresh

---

## Document Output Logging

When a skill produces a .docx file:

### Immediately After Producing a .docx

1. **Update MEMORY.md** — Add or update the Documents section entry.
   - New document: `- Strategy Brief: TMP_Strategy_Brief.docx (created 2026-04-08)`
   - Updated document: Update the existing entry's date — `(created 2026-03-18, updated 2026-04-08)`

2. **Update CLAUDE.md** — Add or update the Documents Produced entry.

3. **Update progress.json** — Add the output to `output_file` and mark the step complete.

Do all three immediately. Do not batch these until the end of the session.

### Google Drive Upload Reminder

- **First completion** of a document type (no prior entry in MEMORY.md): Remind the user to save to the client's Google Drive folder.
  > "Your {document type} is ready. When you open it in Google Drive (from the dropdown above), it will land in My Drive. Remember to move it to the client's Google Drive folder."
- **Updates** to an existing document (MEMORY.md already has an entry): Log the updated date. No upload reminder.

### Reference Section in the .docx

Every brief includes a **Reference / Source Documents** section at the end. This section is inherited and additive across the pipeline:

- Read MEMORY.md to find all previously produced documents and source materials.
- Include every known document with its filename and date.
- Each pipeline stage adds its own references on top of what it inherits.
- At the creative brief stage, present the accumulated list to the user and ask: "Here's what I have. Anything missing?"

The reference section uses local filenames during the pipeline. Google Drive links get finalized at the turnover stage.

---

## Step 0: Context File Check (Required for Every Skill)

This is the FIRST thing every skill does. Before document collection, before research, before loading reference files.

1. Check if CLAUDE.md exists in the working folder.
   - If yes: read it. Use it to understand pipeline state.
   - If no: create it with the client name. Expand as you learn more.

2. Check if MEMORY.md exists in the working folder.
   - If yes: read it. Use it to see what has been produced.
   - If no: do not create yet. Create after first document output.

3. Check if a progress.json exists for this skill.
   - If yes: offer to resume from last checkpoint.
   - If no: proceed normally. Create it when work begins.

---

## What NOT to Put in These Files

- Full document content (that's what the briefs are for)
- Conversation transcripts
- Research logs or raw data (that goes in progress.json temporarily)
- Anything that belongs in the brief itself

CLAUDE.md and MEMORY.md are pointers and summaries. progress.json is transient session state. None of them are storage.
