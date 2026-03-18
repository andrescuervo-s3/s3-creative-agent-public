---
name: s3-creative-brief-media
description: |
  **S3 Creative Brief: Media**: Produces a project-specific creative brief for media planning, buying, or strategy projects. This is one of four S3 Creative Brief types used by Studio 3 Marketing.
  - MANDATORY TRIGGERS: media brief, media creative brief, S3 media brief, media planning brief, media strategy brief, media buying brief
  - Also trigger when: the s3-brief-selector router skill routes a user here after they select "Media" as their creative brief subtype
  - Do NOT trigger on: "foundational brief," "client brief," "onboarding brief," "S3 brief," "website brief," "paid ads brief," "social media brief," or ambiguous phrases like "brief," "creative brief," or "start a brief" — those are handled by other S3 skills
---

# S3 Creative Brief: Media

## Placeholder Notice

This skill is under active development. The full media creative brief workflow, templates, and section instructions are being designed.

## What This Skill Will Do

When complete, this skill will produce a project-specific creative brief for media work (planning, buying, or strategy). Unlike the Foundational Brief (which captures evergreen client facts), the Media Creative Brief is tied to a specific project and will cover areas such as:

- Campaign objectives and KPIs
- Target audience (referencing the Foundational Brief's audience profiles)
- Media channels and mix strategy
- Budget allocation and pacing
- Geographic and demographic targeting
- Competitive media landscape
- Flight dates and scheduling
- Measurement and reporting framework

## Current Behavior

Since this skill is still being developed, when triggered:

1. Acknowledge that the user wants a Media Creative Brief
2. Let them know the full skill is under development
3. Ask if they'd like to share any notes, requirements, or ideas for what this brief should contain — this input will help shape the final skill
4. If they have an existing Foundational Brief for the client, note that the creative brief will reference it

## Dependencies

This skill will reference the client's Foundational Brief (produced by the `s3-foundational-brief` skill) as a source of established facts about the client, audiences, competitors, and brand voice. The Foundational Brief should ideally exist before a Creative Brief is started, but it is not strictly required.
