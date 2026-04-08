# Per-Client Context Files

Every client project maintains two persistent files in the working folder. These files provide continuity across skills and sessions. Whichever skill runs first creates them. Every subsequent skill reads them, uses them, and updates them.

---

## CLAUDE.md

**Location:** Root of the client's working folder (the Cowork project directory).

**Purpose:** Project-level instructions and context that any skill or session can reference. This is the client's single source of truth for what has been produced, who the key people are, and what decisions have been made.

**Created by:** The first skill to run for this client. If CLAUDE.md already exists, read it and update it. Do not overwrite.

**Contents (initialize with what you know, expand over time):**

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
- Add new documents as they are produced
- Add key decisions that affect downstream skills (brand direction, scope changes, approved strategies)
- Do not remove previous entries. Append.

---

## MEMORY.md

**Location:** Root of the client's working folder, alongside CLAUDE.md.

**Purpose:** An index of what has been learned about this client across all skills and sessions. Structured the same way as the agent memory system: one-line entries pointing to context, not full content.

**Created by:** The first skill to run for this client. If MEMORY.md already exists, read it and update it. Do not overwrite.

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
- Add document entries as briefs are created or updated
- Add key context when something non-obvious is learned (e.g., "Popok audience does NOT interact with bigauto.com — separate domain and intake flow")
- Add open items when something is deferred or unresolved
- Mark open items as resolved when they are addressed
- Keep it scannable. One line per entry. No paragraphs.

---

## Document Output Logging

When a skill produces a .docx file, follow these rules:

### After Producing a .docx

1. **Log to MEMORY.md** — Add or update the entry in the Documents section with the filename and date.
   - New document: `- Strategy Brief: TMP_Strategy_Brief.docx (created 2026-04-08)`
   - Updated document: Update the existing entry's date — `(created 2026-03-18, updated 2026-04-08)`

2. **Log to CLAUDE.md** — Add or update the entry in the Documents Produced section with the filename, status, and date.

### Google Drive Upload Reminder

- **First completion** of a document type (no prior entry in MEMORY.md for this brief type): Remind the user to save to the client's Google Drive folder.
  > "Your {document type} is ready. When you open it in Google Drive (from the dropdown above), it will land in My Drive. Remember to move it to the client's Google Drive folder."
- **Updates** to an existing document (MEMORY.md already has an entry for this brief type): Log the updated date. No upload reminder.

### Reference Section in the .docx

Every brief includes a **Reference / Source Documents** section at the end of the document. This section is inherited and additive across the pipeline:

- Read MEMORY.md to find all previously produced documents and source materials.
- Include every known document with its filename and date.
- Each pipeline stage adds its own references on top of what it inherits.
- At the creative brief stage, present the accumulated list to the user and ask: "Here's what I have. Anything missing?"

The reference section uses local filenames during the pipeline. Google Drive links get finalized at the turnover stage.

---

## When to Read These Files

At the start of every skill activation, before doing anything else:

1. Check if CLAUDE.md exists in the working folder. If yes, read it.
2. Check if MEMORY.md exists in the working folder. If yes, read it.
3. Use both to understand where the client stands in the pipeline, what has been produced, and what decisions carry forward.

If neither exists, create both after completing the ingestion/document collection phase of the current skill (not before — you need the client name and initial context first).

---

## What NOT to Put in These Files

- Full document content (that's what the briefs are for)
- Conversation transcripts
- Research logs or raw data
- Anything that belongs in the brief itself

These files are pointers and summaries, not storage. They help the next skill pick up where the last one left off.
