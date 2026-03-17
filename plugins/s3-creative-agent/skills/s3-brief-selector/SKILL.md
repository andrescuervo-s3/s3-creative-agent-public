---
name: s3-brief-selector
description: |
  Routes users to the correct S3 brief skill when ambiguous. S3 has two brief types: Foundational Brief (evergreen client onboarding) and Creative Brief (project-specific for Website, Media, Paid Ads, or Social Media). Triggers on: brief, creative brief, start a brief, get the brief going, campaign brief, project brief. Do NOT trigger on: foundational brief, client brief, onboarding brief, website brief, media brief, paid ads brief, social media brief — those route directly to their specific skills.
---

# S3 Brief Selector

## Purpose

Studio 3 Marketing has two distinct brief types, and team members often just say "brief" or "creative brief" without specifying which one they need. This skill exists to catch those ambiguous requests, ask one clarifying question, and route to the correct skill — saving time and preventing the wrong brief from being generated.

## The Two Brief Types

**Foundational Brief** — An evergreen, fact-based onboarding document created when a new client comes on board. It captures who the client is: their details, goals, pain points, brand essentials, audiences, competitors, market differentiators, brand voice, and a bright idea. It is NOT a strategy document. It does not change per project.

**Creative Brief** — A project-specific brief created when work begins on a specific deliverable. Each subtype is its own skill:

- **Website** (`s3-creative-brief-website`) — for website design, redesign, or development projects
- **Media** (`s3-creative-brief-media`) — for media planning, buying, or strategy projects
- **Paid Ads** (`s3-creative-brief-paid-ads`) — for paid advertising campaigns
- **Social Media** (`s3-creative-brief-social-media`) — for social media strategy, content, or campaign projects

## Routing Logic

When this skill is triggered, follow this decision tree:

### Step 1: Determine the brief type

Use the AskUserQuestion tool to ask:

"Which type of brief are you working on?"

Options:
1. **Foundational Brief** — New client onboarding (evergreen facts about the client)
2. **Creative Brief** — Project-specific (Website, Media, Paid Ads, or Social Media)

Wait for the user's response.

### Step 2: Route based on their answer

**If the user chooses Foundational Brief:**

Invoke the `s3-foundational-brief` skill using the Skill tool. The foundational brief skill will take over from here. Do not ask any further questions — let the foundational brief skill handle its own startup workflow.

**If the user chooses Creative Brief:**

Use the AskUserQuestion tool to ask the follow-up:

"What type of Creative Brief do you need?"

Options:
1. **Website** — Website design, redesign, or development
2. **Media** — Media planning, buying, or strategy
3. **Paid Ads** — PPC, display, programmatic, or paid campaigns
4. **Social Media** — Social media strategy, content, or campaigns

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
- Keep the interaction fast — one or two questions maximum, then hand off.
- If the user's original message already makes the brief type clear (e.g., they said "I need a website brief"), skip the questions and go straight to the appropriate skill.
- Never start generating brief content. Your only job is to route.
- Use the AskUserQuestion tool for the routing questions — it gives users clean clickable options rather than making them type their answer.
