# Official Plugin Examples

> Source: https://github.com/anthropics/claude-plugins-official
> A curated directory of high-quality plugins for Claude Code, maintained by Anthropic.

## Repository Structure

```
claude-plugins-official/
├── .claude-plugin/
│   └── marketplace.json         # Official marketplace catalog
├── plugins/                     # Internal plugins (developed by Anthropic)
│   ├── example-plugin/          # Reference implementation
│   ├── agent-sdk-dev/
│   ├── claude-code-setup/
│   ├── claude-md-management/
│   ├── code-review/
│   ├── code-simplifier/
│   ├── commit-commands/
│   ├── explanatory-output-style/
│   ├── feature-dev/
│   ├── frontend-design/
│   ├── hookify/
│   ├── learning-output-style/
│   ├── math-olympiad/
│   ├── mcp-server-dev/
│   ├── playground/
│   ├── plugin-dev/
│   ├── pr-review-toolkit/
│   ├── ralph-loop/
│   ├── security-guidance/
│   ├── skill-creator/
│   └── [LSP plugins]/           # clangd, csharp, gopls, jdtls, kotlin, lua, php, pyright, ruby, rust-analyzer, swift, typescript
├── external_plugins/            # Third-party plugins from partners
│   ├── asana/
│   ├── context7/
│   ├── discord/
│   ├── fakechat/
│   ├── firebase/
│   ├── github/
│   ├── gitlab/
│   ├── greptile/
│   ├── imessage/
│   ├── laravel-boost/
│   ├── linear/
│   ├── playwright/
│   ├── serena/
│   ├── slack/
│   └── ...
└── README.md
```

## Plugin Structure Standard

Each plugin follows this structure:

```
plugin-name/
├── .claude-plugin/
│   └── plugin.json      # Plugin metadata (required)
├── .mcp.json            # MCP server configuration (optional)
├── commands/            # Slash commands (optional, legacy)
├── agents/              # Agent definitions (optional)
├── skills/              # Skill definitions (optional)
└── README.md            # Documentation
```

## Example Plugin (Reference Implementation)

### plugin.json

```json
{
  "name": "example-plugin",
  "description": "A comprehensive example plugin demonstrating all Claude Code extension options including commands, agents, skills, hooks, and MCP servers",
  "author": {
    "name": "Anthropic",
    "email": "support@anthropic.com"
  }
}
```

### Directory structure

```
example-plugin/
├── .claude-plugin/
│   └── plugin.json            # Plugin metadata
├── .mcp.json                  # MCP server configuration
├── skills/
│   ├── example-skill/
│   │   └── SKILL.md           # Model-invoked skill (contextual guidance)
│   └── example-command/
│       └── SKILL.md           # User-invoked skill (slash command)
└── commands/
    └── example-command.md     # Legacy slash command format
```

### Example SKILL.md (model-invoked)

```yaml
---
name: example-skill
description: This skill should be used when the user asks to "demonstrate skills", "show skill format", "create a skill template", or discusses skill development patterns. Provides a reference template for creating Claude Code plugin skills.
version: 1.0.0
---

# Example Skill

This skill demonstrates the structure and format for Claude Code plugin skills.

## When This Skill Applies

This skill activates when the user's request involves:
- Creating or understanding plugin skills
- Skill template or reference needs
- Skill development patterns

## Skill Structure

### Required Files

skills/
└── skill-name/
    └── SKILL.md          # Main skill definition (required)

### Optional Supporting Files

skills/
└── skill-name/
    ├── SKILL.md          # Main skill definition
    ├── README.md         # Additional documentation
    ├── references/       # Reference materials
    │   └── patterns.md
    ├── examples/         # Example files
    │   └── sample.md
    └── scripts/          # Helper scripts
        └── helper.sh

## Frontmatter Options

- **name** (required): Skill identifier
- **description** (required): Trigger conditions
- **version** (optional): Semantic version number
- **license** (optional): License information

## Writing Effective Descriptions

The description field is crucial - it tells Claude when to invoke the skill.

Good description patterns:
description: This skill should be used when the user asks to "specific phrase", "another phrase", mentions "keyword", or discusses topic-area.

Include:
- Specific trigger phrases users might say
- Keywords that indicate relevance
- Topic areas the skill covers

## Best Practices

- Keep skills focused on a single domain
- Write descriptions that clearly indicate when to activate
- Include reference materials in subdirectories for complex skills
- Test that the skill activates for expected queries
- Avoid overlap with other skills' trigger conditions
```

## Key Pattern: Skills with References (claude-code-setup example)

This is the recommended pattern for complex skills that need supporting documentation:

### plugin.json

```json
{
  "name": "claude-code-setup",
  "description": "Analyze codebases and recommend tailored Claude Code automations such as hooks, skills, MCP servers, and subagents.",
  "version": "1.0.0",
  "author": {
    "name": "Anthropic",
    "email": "support@anthropic.com"
  }
}
```

### Directory structure

```
claude-code-setup/
├── .claude-plugin/
│   └── plugin.json
└── skills/
    └── claude-automation-recommender/
        ├── SKILL.md                              # Main skill (orchestrator)
        └── references/                            # Supporting docs (loaded on demand)
            ├── hooks-patterns.md
            ├── mcp-servers.md
            ├── plugins-reference.md
            ├── skills-reference.md
            └── subagent-templates.md
```

### SKILL.md pattern (abbreviated)

```yaml
---
name: claude-automation-recommender
description: Analyze a codebase and recommend Claude Code automations (hooks, subagents, skills, plugins, MCP servers). Use when user asks for automation recommendations...
tools: Read, Glob, Grep, Bash
---

# Claude Automation Recommender

Analyze codebase patterns to recommend tailored Claude Code automations.

## Workflow

### Phase 1: Codebase Analysis
[Gather project context using tools]

### Phase 2: Generate Recommendations
Based on analysis, generate recommendations across all categories.

#### A. MCP Server Recommendations
See [references/mcp-servers.md](references/mcp-servers.md) for detailed patterns.

#### B. Skills Recommendations
See [references/skills-reference.md](references/skills-reference.md) for details.

#### C. Hooks Recommendations
See [references/hooks-patterns.md](references/hooks-patterns.md) for configurations.

#### D. Subagent Recommendations
See [references/subagent-templates.md](references/subagent-templates.md) for templates.

### Phase 3: Output Recommendations Report
[Format and present findings]
```

**Key takeaway**: References live INSIDE the skill directory (next to SKILL.md), NOT at the plugin root. The skill references them with relative paths like `references/mcp-servers.md`. Because plugins are copied to a cache, files outside the skill directory are unreachable.

## Other Notable Plugin Patterns

### plugin-dev (multi-skill plugin)

```
plugin-dev/
├── .claude-plugin/plugin.json
├── agents/
│   ├── agent-creator.md
│   ├── plugin-validator.md
│   └── skill-reviewer.md
├── commands/
│   └── create-plugin.md
└── skills/
    ├── agent-development/
    │   ├── SKILL.md
    │   ├── examples/
    │   ├── references/
    │   └── scripts/
    ├── command-development/
    │   ├── SKILL.md
    │   ├── examples/
    │   └── references/
    ├── hook-development/
    │   ├── SKILL.md
    │   ├── examples/
    │   ├── references/
    │   └── scripts/
    ├── mcp-integration/
    │   ├── SKILL.md
    │   ├── examples/
    │   └── references/
    ├── plugin-settings/
    │   ├── SKILL.md
    │   ├── examples/
    │   ├── references/
    │   └── scripts/
    ├── plugin-structure/
    │   ├── SKILL.md
    │   ├── examples/
    │   └── references/
    └── skill-development/
        ├── SKILL.md
        └── references/
```

### math-olympiad (skill with scripts)

```
math-olympiad/
├── .claude-plugin/plugin.json
└── skills/
    └── math-olympiad/
        ├── SKILL.md
        ├── evals/
        │   └── trigger_eval.json
        ├── references/
        │   ├── adversarial_prompts.md
        │   ├── attempt_agent.md
        │   ├── known_constructions.md
        │   ├── model_tier_defaults.md
        │   ├── presentation_prompts.md
        │   ├── solver_heuristics.md
        │   └── verifier_patterns.md
        └── scripts/
            ├── check_latex.sh
            └── compile_pdf.sh
```

### hookify (hooks + skills + agents)

```
hookify/
├── .claude-plugin/plugin.json
├── agents/
│   └── conversation-analyzer.md
├── commands/
│   ├── configure.md
│   ├── help.md
│   ├── hookify.md
│   └── list.md
├── core/
│   ├── config_loader.py
│   └── rule_engine.py
├── hooks/
│   ├── hooks.json
│   ├── posttooluse.py
│   ├── pretooluse.py
│   ├── stop.py
│   └── userpromptsubmit.py
├── skills/
│   └── writing-rules/
│       └── SKILL.md
└── utils/
```

## Installation

Plugins from this marketplace can be installed via:

```shell
/plugin install {plugin-name}@claude-plugins-official
```

Or browse in `/plugin > Discover`.
