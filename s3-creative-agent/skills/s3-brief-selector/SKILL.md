---
name: s3-brief-selector
description: |
  Routes users to the correct S3 brief skill when their request is ambiguous. Studio 3 has two brief types: Foundational Brief (evergreen onboarding) and Creative Brief (project-specific: Website, Media, Paid Ads, Social Media). Determines which one the user needs and hands off.
  TRIGGERS: brief, creative brief, start a brief, get the brief going, campaign brief, project brief, create a brief, help me with a brief, do a brief, build a brief, work on a brief, new brief, client brief.
  This skill MUST be the entry point whenever the user says "brief" without a specific type qualifier like "foundational" or "website." Even if context (like a turnover email or new client) suggests a foundational brief, the user must be asked to confirm the brief type first.
  Do NOT trigger when user explicitly says "foundational brief" or "onboarding brief" (those go to s3-foundational-brief) or "website brief," "media brief," etc. (those go directly to the matching creative brief skill).
---

# S3 Brief Selector

## Purpose

Studio 3 Marketing has two distinct brief types, and team members often just say "brief" or "creative brief" without specifying which one they need. This skill catches those ambiguous requests, asks two clarifying questions maximum, and routes to the correct skill.

## The Two Brief Types

**Foundational Brief** -- An evergreen, fact-based onboarding document created when a new client comes on board. It captures who the client is: their details, goals, pain points, brand essentials, audiences, competitors, and market differentiators. It is NOT a strategy document. It does not change per project.

**Creative Brief** -- A project-specific brief created when work begins on a specific deliverable. Each subtype is its own skill:

- **Website** (`s3-creative-brief-website`) -- for website design, redesign, or development projects
- **Media** (`s3-creative-brief-media`) -- for media planning, buying, or strategy projects
- **Paid Ads** (`s3-creative-brief-paid-ads`) -- for paid advertising campaigns
- **Social Media** (`s3-creative-brief-social-media`) -- for social media strategy, content, or campaign projects

## Routing Logic

**CRITICAL: This is a strict two-step process. Do NOT combine steps or flatten options into a single question. Each step must be its own separate AskUserQuestion call. Wait for the user's response before proceeding to the next step.**

### Step 1: Determine the brief type

Use the AskUserQuestion tool to ask ONLY this question with ONLY these two options:

"What type of brief are you working on?"

Options (exactly two, no more):
1. **Foundational Brief** -- the evergreen client research document
2. **Creative Brief** -- strategy and execution for a specific channel

Stop here. Wait for the user to respond. Do NOT add foundational sub-options (New, Update, Finalize) or creative sub-options (Website, Media, etc.) to this question. Do NOT add a "Something else" option.

### Step 2: Ask the follow-up based on their Step 1 answer

**If the user chose Foundational Brief in Step 1:**

Use a SECOND AskUserQuestion tool call to ask:

"What would you like to do?"

Options (exactly three, no more):
1. **New (Draft)** -- Create a new client onboarding brief from scratch
2. **Update (Draft)** -- Update an existing draft with new info or corrections
3. **Finalize** -- Resolve open items and stamp an existing draft as final

Wait for the user to respond.

### Step 3 (Foundational Brief only): Confirm the client name

Before invoking the foundational brief skill, determine the client name:

1. Check if the conversation has context that reveals the client name (e.g., a project name, workspace folder name, or prior messages).
2. If context exists, use a THIRD AskUserQuestion call to confirm: "Are we creating a foundational brief for [name]?"
3. If no context exists, use a THIRD AskUserQuestion call to ask: "What is the client name?"
4. Wait for the user's response.

Then invoke the `s3-foundational-brief` skill using the Skill tool. Pass BOTH the selected mode AND the confirmed client name in your message (e.g., "The user selected New (Draft) for client Big Auto Accident Attorneys"). Do not ask any further questions.

**If the user chose Creative Brief in Step 1:**

Use a SECOND AskUserQuestion tool call to ask:

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

## Important

- This skill is a router only. It does not produce any brief content itself.
- **Two separate questions, two separate AskUserQuestion calls.** Never combine them.
- Do NOT add extra options like "Something else" or "Skip." Present only the options listed above.
- Even if context strongly suggests which brief type the user needs (e.g., a turnover email implies foundational), always ask both confirmation questions. The two-step routing is a confirmation flow, not just a disambiguation flow.
- Never start generating brief content. Your only job is to route.
- Use the AskUserQuestion tool for the routing questions.
