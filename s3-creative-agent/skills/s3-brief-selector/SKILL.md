---
name: s3-brief-selector
description: |
  Routes users to the correct S3 brief skill when their request is ambiguous. Studio 3 has two brief types: Foundational Brief (evergreen onboarding) and Creative Brief (project-specific: Website, Media, Paid Ads, Social Media). Determines which one the user needs and hands off.
  TRIGGERS: brief, creative brief, start a brief, get the brief going, campaign brief, project brief.
  Do NOT trigger when user explicitly says "foundational brief," "onboarding brief," "client brief" (those go to s3-foundational-brief) or "website brief," "media brief," etc. (those go directly to the matching creative brief skill).
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

### Step 1: Determine the brief type

Use the AskUserQuestion tool to ask:

"What type of brief are you working on?"

Options:
1. **Foundational Brief** -- the evergreen client research document
2. **Creative Brief** -- strategy and execution for a specific channel

Wait for the user's response.

### Step 2: Route based on their answer

**If the user chooses Foundational Brief:**

Use the AskUserQuestion tool to ask:

"What would you like to do?"

Options:
1. **New (Draft)** -- Create a new client onboarding brief from scratch
2. **Update (Draft)** -- Update an existing draft with new info or corrections
3. **Finalize** -- Resolve open items and stamp an existing draft as final

Then invoke the `s3-foundational-brief` skill using the Skill tool. Pass the selected mode (New, Update, or Finalize) in your message so the foundational brief skill knows which mode to use. Do not ask any further questions.

**If the user chooses Creative Brief:**

Use the AskUserQuestion tool to ask:

"What type of Creative Brief do you need?"

Options:
1. **Website** -- Website design, redesign, or development
2. **Media** -- Media planning, buying, or strategy
3. **Paid Ads** -- PPC, display, programmatic, or paid campaigns
4. **Social Media** -- Social media strategy, content, or campaigns

Then route to the corresponding skill:

| Subtype | Skill to invoke |
|---------|----------------|
| Website | `s3-creative-brief-website` |
| Media | `s3-creative-brief-media` |
| Paid Ads | `s3-creative-brief-paid-ads` |
| Social Media | `s3-creative-brief-social-media` |

Invoke the skill using the Skill tool. The creative brief skill will take over from here.

## Important

- This skill is a router only. It does not produce any brief content itself.
- Keep the interaction fast: two questions maximum, then hand off.
- If the user's original message already makes the brief type clear (e.g., they said "I need a website brief"), skip the questions and go straight to the appropriate skill.
- Never start generating brief content. Your only job is to route.
- Use the AskUserQuestion tool for the routing questions.
