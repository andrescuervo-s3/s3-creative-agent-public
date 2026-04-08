# End-of-Skill Pipeline Routing

When a brief is completed and the user signals they want to move on, present the recommended next step from the pipeline. This applies to every brief-producing skill.

---

## Trigger Phrases

Recognize these as pipeline signals after a brief has been completed:

- "let's move on"
- "what's next"
- "next step"
- "next"
- "move on"
- "what should we do next"
- "ready for the next one"

Do NOT trigger on these phrases during the brief-building conversation. Only after the .docx has been generated and the user has reviewed/approved it.

---

## Pipeline Order

```
1. Foundational Brief (s3-foundational-brief)
2. Strategy Brief (s3-strategy-brief)
3. Creative Brief (s3-creative-brief-website, s3-creative-brief-media, etc.)
4. Creative Turnover (not yet built)
5. Wireframes (not yet built)
```

---

## Routing Logic

After the current skill completes, determine the recommended next step based on which skill just finished:

**After Foundational Brief:**
- Recommended: Strategy Brief
- Check MEMORY.md: if a strategy brief already exists, recommend Creative Brief instead

**After Strategy Brief:**
- Recommended: Website Creative Brief (most common next step)
- If the Work Agreement includes other channels (media, paid ads, social), mention those as alternatives

**After any Creative Brief:**
- Recommended: another Creative Brief subtype if multiple are in scope, OR Creative Turnover if all creative briefs are done
- Check MEMORY.md for which creative briefs have been produced vs. what's in the Work Agreement

**After Recommendation Doc:**
- No pipeline recommendation (standalone skill). Just ask what they'd like to do next.

---

## Presentation Format

Present the routing as a simple choice. Do not over-explain the pipeline.

```
Your [Brief Type] is complete.

Based on your pipeline, the recommended next step is:

→ [Recommended Brief Type]

Would you like to:
1. Start the [Recommended Brief Type]
2. Something else
```

If multiple next steps are valid (e.g., after a strategy brief when website AND media briefs are both in scope):

```
Your Strategy Brief is complete.

Recommended next steps based on your scope:

→ Website Creative Brief
→ Media Creative Brief

Would you like to:
1. Start the Website Creative Brief
2. Start the Media Creative Brief
3. Something else
```

---

## Rules

- **One message, not a lecture.** Present the choice and wait. Do not explain the full pipeline, justify the recommendation, or recap what was just completed.
- **"Something else" is always an option.** The user may want to make edits, switch clients, ask questions, or do non-brief work. Never force them into the next step.
- **Read MEMORY.md before recommending.** The pipeline position depends on what has already been produced for this client. Do not recommend a brief type that already exists unless the user explicitly wants to redo it.
- **If the next skill is not yet built** (e.g., Creative Turnover, Wireframes), say so: "The next step in the pipeline would be [skill], but that skill is still being developed. Is there something else you'd like to work on?"
- **Hand off cleanly.** If the user picks the next brief, invoke it by name. Do not restart the conversation from scratch. The next skill will read MEMORY.md and CLAUDE.md to pick up context.
