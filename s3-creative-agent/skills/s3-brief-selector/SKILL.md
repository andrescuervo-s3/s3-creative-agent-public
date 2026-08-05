---
name: s3-brief-selector
description: |
  Routes ambiguous brief requests to the correct S3 brief skill. Studio 3 has three types: Foundational (evergreen onboarding), Strategy (recommendations built on a foundational brief), and Creative (project-specific: Website, Media, Paid Ads, Social Media). Confirms which is needed, then hands off.
  TRIGGERS: brief, a brief, new brief, client brief, project brief, campaign brief, creative brief, create/build/start/do/work on a brief, help me with a brief.
  MUST be the entry point whenever the user says "brief" without a type qualifier. Even when context such as a turnover email or a new client implies a foundational brief, confirm the type with the user first.
  Do NOT trigger when the user names the type: "foundational brief" goes to s3-foundational-brief, "strategy brief" to s3-strategy-brief, "website/media/paid ads/social media brief" to the matching s3-creative-brief-* skill.
---

# S3 Brief Selector

## Purpose

Studio 3 Marketing has three distinct brief types, and team members often just say "brief" or "creative brief" without specifying which one they need. This skill catches those ambiguous requests, confirms the client, checks what already exists, and routes to the correct skill.

The selector is pipeline-aware. It checks what documents exist for the client and adapts the options to show where the client is in the pipeline, with a recommended next step. It never blocks a choice, just provides context.

## The Three Brief Types

**Foundational Brief** -- An evergreen, fact-based onboarding document created when a new client comes on board. It captures who the client is: their details, goals, pain points, brand essentials, audiences, competitors, and market differentiators. It is NOT a strategy document. It does not change per project.

**Strategy Brief** -- A collaborative document that synthesizes foundational facts and creative call outputs into strategic recommendations. It sits between the Foundational Brief and the Creative Briefs. Requires a completed Foundational Brief as input.

**Creative Brief** -- A project-specific brief created when work begins on a specific deliverable. Each subtype is its own skill:

- **Website** (`s3-creative-brief-website`) -- for website design, redesign, or development projects
- **Media** (`s3-creative-brief-media`) -- for media planning, buying, or strategy projects
- **Paid Ads** (`s3-creative-brief-paid-ads`) -- for paid advertising campaigns
- **Social Media** (`s3-creative-brief-social-media`) -- for social media strategy, content, or campaign projects

## Routing Logic

**CRITICAL: Each step must be its own separate AskUserQuestion call. Wait for the user's response before proceeding to the next step.**

### Step 1: Confirm the client name

Before anything else, determine the client name so we can check what already exists.

1. Check if the conversation has context that reveals the client name (e.g., a project name, workspace folder name, prior messages, or a foundational brief that was just generated in this session).
2. If context exists, use AskUserQuestion to confirm: "Are we working on a brief for [name]?"
3. If no context exists, use AskUserQuestion to ask: "What is the client name?"
4. Wait for the user's response.

### Step 2: Check for existing documents

Search two locations for existing briefs for this client:

1. **Local working folder** -- check the workspace/project folder for brief files
2. **Google Drive** -- search the client's main folder and Creative Strategy subfolder

Check for BOTH:
- A foundational brief (e.g., `{Client}_Foundational_Brief_DRAFT.docx` or `_FINAL.docx`)
- A strategy brief (e.g., `{Client}_Strategy_Brief_DRAFT.docx` or `_FINAL.docx`)

Record which exist. Do NOT present results to the user. This is an internal check that determines which options and labels to show.

### Step 3: Present options based on pipeline state

Use AskUserQuestion to ask: "What type of brief are you working on?"

The options depend on what exists:

**Scenario A: Neither foundational nor strategy brief exists**

Options (exactly two):
1. **Foundational Brief** -- recommended starting point for a new client
2. **Other**

Do not offer Strategy or Creative when no foundational brief exists. Strategy requires a foundational brief as input, and creative briefs benefit from one. If the user picks Other, handle in Step 4.

**Scenario B: Foundational brief exists, no strategy brief**

Options (exactly three):
1. **Foundational Brief** -- update or finalize the existing onboarding document
2. **Strategy Brief** -- recommended next step: strategic recommendations built on the foundational brief
3. **Creative Brief** -- strategy and execution for a specific channel

**Scenario C: Both foundational and strategy briefs exist**

Options (exactly three):
1. **Foundational Brief** -- update or finalize the existing onboarding document
2. **Strategy Brief** -- update the existing strategy document
3. **Creative Brief** -- recommended next step: execution brief for a specific channel

Wait for the user to respond.

### Step 4: Follow-up based on their answer

**If the user chose Foundational Brief:**

Use the document check from Step 2 to determine which modes to offer. Use AskUserQuestion to ask:

"What would you like to do with the Foundational Brief?"

**If no existing foundational brief was found in Step 2:**

Skip the mode question entirely. Tell the user: "No existing foundational brief found for [client name]. I'll start a new one." Then invoke the skill in New (Draft) mode.

Note: The selector's search is a quick check. The foundational brief skill does a deeper search and may discover an existing brief the selector missed. If it does, it will offer to use it as a starting point. This is expected behavior, not a conflict.

**If an existing DRAFT was found in Step 2:**

Options (exactly three):
1. **New (Draft)** -- Start fresh (replaces the existing draft)
2. **Update (Draft)** -- Update the existing draft with new info or corrections
3. **Finalize** -- Resolve open items and stamp the draft as final

**If an existing FINAL was found in Step 2:**

Options (exactly two):
1. **New (Draft)** -- Start a completely new brief from scratch
2. **Update (Draft)** -- Re-open the finalized brief for revisions (creates a new draft)

Wait for the user to respond.

Then invoke the `s3-foundational-brief` skill using the Skill tool. Pass BOTH the selected mode AND the confirmed client name in your message (e.g., "The user selected New (Draft) for client Big Auto Accident Attorneys"). Do not ask any further questions.

**If the user chose Strategy Brief:**

Invoke the `s3-strategy-brief` skill using the Skill tool. Pass the confirmed client name in your message (e.g., "The user wants to create a strategy brief for Big Auto Accident Attorneys"). Do not ask any further questions.

**If the user chose Creative Brief:**

Use AskUserQuestion to ask:

"What type of Creative Brief do you need?"

Options (exactly four, no more):
1. **Website** -- Website design, redesign, or development
2. **Media** -- Media planning, buying, or strategy
3. **Paid Ads** -- PPC, display, programmatic, or paid campaigns
4. **Social Media** -- Social media strategy, content, or campaigns

Wait for the user to respond, then invoke the matching skill:

| Subtype | Skill to invoke |
|---------|----------------|
| Website | `s3-creative-brief-website` |
| Media | `s3-creative-brief-media` |
| Paid Ads | `s3-creative-brief-paid-ads` |
| Social Media | `s3-creative-brief-social-media` |

Invoke the skill using the Skill tool. The creative brief skill will take over from here.

**If the user chose Other (Scenario A only):**

Use AskUserQuestion with a freeform text input: "What are you looking to create?" Then route based on the response. If they describe a strategy brief, invoke `s3-strategy-brief`. If they describe a recommendation document, invoke `s3-recommendation-doc`. If unclear, ask a follow-up.

## Important

- This skill is a router only. It does not produce any brief content itself.
- **Each step gets its own AskUserQuestion call.** Never combine steps.
- Do NOT add extra options beyond what is listed above for each step.
- The document check in Step 2 is silent. Do not tell the user whether you found documents or not. It only determines which option set and labels to show.
- The "recommended next step" label guides users through the pipeline without blocking. A user can always pick any available option regardless of the label.
- Even if context strongly suggests which brief type the user needs (e.g., a turnover email implies foundational), always ask the confirmation questions. The routing is a confirmation flow, not just a disambiguation flow.
- Never start generating brief content. Your only job is to route.
- Use the AskUserQuestion tool for all routing questions.
