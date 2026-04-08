---
name: s3-creative-brief-paid-ads
description: |
  **S3 Creative Brief: Paid Ads**: Produces a project-specific creative brief for paid advertising campaigns including PPC, display, programmatic, and paid social. This is one of four S3 Creative Brief types used by Studio 3 Marketing.
  - MANDATORY TRIGGERS: paid ads brief, paid advertising brief, S3 paid ads brief, PPC brief, display ads brief, programmatic brief, paid media brief, ad campaign brief
  - Also trigger when: the s3-brief-selector router skill routes a user here after they select "Paid Ads" as their creative brief subtype
  - Do NOT trigger on: "foundational brief," "client brief," "onboarding brief," "S3 brief," "website brief," "media brief," "social media brief," or ambiguous phrases like "brief," "creative brief," or "start a brief" — those are handled by other S3 skills
---

# S3 Creative Brief: Paid Ads

## Placeholder Notice

This skill is under active development. The full paid ads creative brief workflow, templates, and section instructions are being designed.

## What This Skill Will Do

When complete, this skill will produce a project-specific creative brief for paid advertising campaigns (PPC, display, programmatic, paid social). Unlike the Foundational Brief (which captures evergreen client facts), the Paid Ads Creative Brief is tied to a specific campaign and will cover areas such as:

- Campaign objectives and conversion goals
- Target audience and segmentation (referencing the Foundational Brief's audience profiles)
- Platform selection and rationale
- Ad format and creative requirements
- Budget, bidding strategy, and pacing
- Landing page and conversion path
- A/B testing plan
- Tracking, attribution, and reporting setup

## Current Behavior

Since this skill is still being developed, when triggered:

1. Acknowledge that the user wants a Paid Ads Creative Brief
2. Let them know the full skill is under development
3. Ask if they'd like to share any notes, requirements, or ideas for what this brief should contain — this input will help shape the final skill
4. If they have an existing Foundational Brief for the client, note that the creative brief will reference it

## Dependencies

This skill will reference the client's Foundational Brief (produced by the `s3-foundational-brief` skill) as a source of established facts about the client, audiences, competitors, and brand voice. The Foundational Brief should ideally exist before a Creative Brief is started, but it is not strictly required.

## Reference Files

- `references/per-client-context-files.md` -- Read at the start. Check for and update CLAUDE.md and MEMORY.md in the client working folder.
