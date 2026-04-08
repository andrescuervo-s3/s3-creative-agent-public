---
name: s3-creative-brief-social-media
description: |
  **S3 Creative Brief: Social Media**: Produces a project-specific creative brief for social media strategy, content planning, or campaign projects. This is one of four S3 Creative Brief types used by Studio 3 Marketing.
  - MANDATORY TRIGGERS: social media brief, social creative brief, S3 social media brief, social strategy brief, social content brief, social campaign brief
  - Also trigger when: the s3-brief-selector router skill routes a user here after they select "Social Media" as their creative brief subtype
  - Do NOT trigger on: "foundational brief," "client brief," "onboarding brief," "S3 brief," "website brief," "media brief," "paid ads brief," or ambiguous phrases like "brief," "creative brief," or "start a brief" — those are handled by other S3 skills
---

# S3 Creative Brief: Social Media

## Placeholder Notice

This skill is under active development. The full social media creative brief workflow, templates, and section instructions are being designed.

## What This Skill Will Do

When complete, this skill will produce a project-specific creative brief for social media work (strategy, content planning, or campaigns). Unlike the Foundational Brief (which captures evergreen client facts), the Social Media Creative Brief is tied to a specific project and will cover areas such as:

- Social media objectives and goals
- Target audience and platform-audience alignment (referencing the Foundational Brief's audience profiles)
- Platform strategy and prioritization
- Content pillars and themes
- Posting cadence and calendar framework
- Visual and copy style guidelines
- Community management and engagement approach
- Influencer or partnership considerations
- Metrics, reporting, and success benchmarks

## Current Behavior

Since this skill is still being developed, when triggered:

1. Acknowledge that the user wants a Social Media Creative Brief
2. Let them know the full skill is under development
3. Ask if they'd like to share any notes, requirements, or ideas for what this brief should contain — this input will help shape the final skill
4. If they have an existing Foundational Brief for the client, note that the creative brief will reference it

## Dependencies

This skill will reference the client's Foundational Brief (produced by the `s3-foundational-brief` skill) as a source of established facts about the client, audiences, competitors, and brand voice. The Foundational Brief should ideally exist before a Creative Brief is started, but it is not strictly required.

## Reference Files

- `references/per-client-context-files.md` -- Read at the start. Check for and update CLAUDE.md and MEMORY.md in the client working folder.
