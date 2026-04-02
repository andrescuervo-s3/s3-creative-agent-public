---
name: skill-vs-global-reference
description: Before writing any rule into a SKILL.md, determine if it applies to multiple skills — if so, it belongs in references/ not inline
type: feedback
---

Before adding any instruction, rule, or standard to a SKILL.md, ask: does this apply to more than one skill?

**If yes → `references/` shared file.** Skills point to it; they never duplicate it.
**If no → inline in the specific SKILL.md.**

**Why:** Chat formatting was added directly to `s3-foundational-brief/SKILL.md` before the user correctly pointed out it applies to all skills. Had to move it to `references/chat-formatting.md` and update all skills. Avoids divergence and duplication across skills.

**How to apply:** Every time a new rule or standard is needed, classify it first:
- Global references (apply to all skills): `chat-formatting.md`, `pdf-reading-protocol.md`, `s3-docx-styles.md`, `confidence-scoring-spec.md`, `research-validation-rules.md`
- Skill-specific: section templates, routing logic, skill-specific gotchas, mode definitions
