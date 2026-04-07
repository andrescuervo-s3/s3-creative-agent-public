---
name: s3-brief-selector
description: |
  Routes users to the correct S3 brief skill when their request is ambiguous. Studio 3 has three brief types: Foundational Brief (evergreen onboarding), Strategy Brief (strategic recommendations built on a foundational brief), and Creative Brief (project-specific: Website, Media, Paid Ads, Social Media). Determines which one the user needs and hands off.
  TRIGGERS: brief, creative brief, start a brief, get the brief going, campaign brief, project brief, create a brief, help me with a brief, do a brief, build a brief, work on a brief, new brief, client brief.
  This skill MUST be the entry point whenever the user says "brief" without a specific type qualifier like "foundational," "strategy," or "website." Even if context (like a turnover email or new client) suggests a foundational brief, the user must be asked to confirm the brief type first.
  Do NOT trigger when user explicitly says "foundational brief" or "onboarding brief" (those go to s3-foundational-brief), "strategy brief" (goes to s3-strategy-brief), or "website brief," "media brief," etc. (those go directly to the matching creative brief skill).
---

# S3 Brief Selector

## Purpose

Studio 3 Marketing has three distinct brief types, and team members often just say "brief" or "creative brief" without specifying which one they need. This skill catches those ambiguous requests, confirms the client, checks what already exists, and routes to the correct skill.

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

### Step 2: Check for an existing foundational brief

Search two locations for a foundational brief for this client:

1. **Local working folder** -- check the workspace/project folder for a foundational brief file (e.g., `{Client Name}_Foundational_Brief_DRAFT.docx` or similar)
2. **Google Drive** -- search the client's main folder for a document with "Foundational" and "Brief" in the name

If either location has a foundational brief, proceed to Step 3A. If neither has one, proceed to Step 3B.

Do NOT present results to the user. This is an internal check that determines which options to show.

### Step 3A: Foundational brief EXISTS — show three options

Use AskUserQuestion to ask:

"What type of brief are you working on?"

Options (exactly three, no more):
1. **Foundational Brief** -- update or finalize the existing onboarding document
2. **Strategy Brief** -- strategic recommendations built on the foundational brief
3. **Creative Brief** -- strategy and execution for a specific channel

Wait for the user to respond.

### Step 3B: No foundational brief found — show three options

Use AskUserQuestion to ask:

"What type of brief are you working on?"

Options (exactly three, no more):
1. **Foundational Brief** -- the evergreen client research document
2. **Creative Brief** -- strategy and execution for a specific channel
3. **Other**

Wait for the user to respond.

### Step 4: Follow-up based on their answer

**If the user chose Foundational Brief (from either 3A or 3B):**

Use AskUserQuestion to ask:

"What would you like to do?"

Options (exactly three, no more):
1. **New (Draft)** -- Create a new client onboarding brief from scratch
2. **Update (Draft)** -- Update an existing draft with new info or corrections
3. **Finalize** -- Resolve open items and stamp an existing draft as final

Wait for the user to respond.

Then invoke the `s3-foundational-brief` skill using the Skill tool. Pass BOTH the selected mode AND the confirmed client name in your message (e.g., "The user selected New (Draft) for client Big Auto Accident Attorneys"). Do not ask any further questions.

**If the user chose Strategy Brief (from 3A only):**

Invoke the `s3-strategy-brief` skill using the Skill tool. Pass the confirmed client name in your message (e.g., "The user wants to create a strategy brief for Big Auto Accident Attorneys"). Do not ask any further questions.

**If the user chose Creative Brief (from either 3A or 3B):**

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

**If the user chose Other (from 3B only):**

Use AskUserQuestion with a freeform text input: "What are you looking to create?" Then route based on the response. If they describe a strategy brief, invoke `s3-strategy-brief`. If they describe a recommendation document, invoke `s3-recommendation-doc`. If unclear, ask a follow-up.

## Important

- This skill is a router only. It does not produce any brief content itself.
- **Each step gets its own AskUserQuestion call.** Never combine steps.
- Do NOT add extra options beyond what is listed above for each step.
- The foundational brief check in Step 2 is silent. Do not tell the user whether you found one or not. It only determines which option set to show.
- Even if context strongly suggests which brief type the user needs (e.g., a turnover email implies foundational), always ask the confirmation questions. The routing is a confirmation flow, not just a disambiguation flow.
- Never start generating brief content. Your only job is to route.
- Use the AskUserQuestion tool for all routing questions.
