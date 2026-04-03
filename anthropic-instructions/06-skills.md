# Extend Claude with Skills

> Source: https://code.claude.com/docs/en/skills
> Create, manage, and share skills to extend Claude's capabilities in Claude Code.

Skills extend what Claude can do. Create a `SKILL.md` file with instructions, and Claude adds it to its toolkit. Claude uses skills when relevant, or you can invoke one directly with `/skill-name`.

**Custom commands have been merged into skills.** A file at `.claude/commands/deploy.md` and a skill at `.claude/skills/deploy/SKILL.md` both create `/deploy` and work the same way. Your existing `.claude/commands/` files keep working. Skills add optional features: a directory for supporting files, frontmatter to control whether you or Claude invokes them, and the ability for Claude to load them automatically when relevant.

Claude Code skills follow the Agent Skills open standard (agentskills.io), which works across multiple AI tools. Claude Code extends the standard with additional features like invocation control, subagent execution, and dynamic context injection.

## Bundled skills

| Skill                       | Purpose                                                                                                                                   |
| :-------------------------- | :---------------------------------------------------------------------------------------------------------------------------------------- |
| `/batch <instruction>`      | Orchestrate large-scale changes across a codebase in parallel. Spawns one background agent per unit in an isolated git worktree.          |
| `/claude-api`               | Load Claude API reference material for your project's language and Agent SDK reference.                                                    |
| `/debug [description]`      | Enable debug logging for the current session and troubleshoot issues.                                                                      |
| `/loop [interval] <prompt>` | Run a prompt repeatedly on an interval while the session stays open.                                                                       |
| `/simplify [focus]`         | Review your recently changed files for code reuse, quality, and efficiency issues, then fix them.                                          |

## Getting started

### Create your first skill

Create a directory for the skill:

```bash
mkdir -p ~/.claude/skills/explain-code
```

Create `~/.claude/skills/explain-code/SKILL.md`:

```yaml
---
name: explain-code
description: Explains code with visual diagrams and analogies. Use when explaining how code works, teaching about a codebase, or when the user asks "how does this work?"
---

When explaining code, always include:

1. **Start with an analogy**: Compare the code to something from everyday life
2. **Draw a diagram**: Use ASCII art to show the flow, structure, or relationships
3. **Walk through the code**: Explain step-by-step what happens
4. **Highlight a gotcha**: What's a common mistake or misconception?

Keep explanations conversational. For complex concepts, use multiple analogies.
```

### Where skills live

| Location   | Path                                                | Applies to                     |
| :--------- | :-------------------------------------------------- | :----------------------------- |
| Enterprise | See managed settings                                | All users in your organization |
| Personal   | `~/.claude/skills/<skill-name>/SKILL.md`            | All your projects              |
| Project    | `.claude/skills/<skill-name>/SKILL.md`              | This project only              |
| Plugin     | `<plugin>/skills/<skill-name>/SKILL.md`             | Where plugin is enabled        |

When skills share the same name across levels, higher-priority locations win: enterprise > personal > project. Plugin skills use a `plugin-name:skill-name` namespace, so they cannot conflict with other levels.

Each skill is a directory with `SKILL.md` as the entrypoint:

```text
my-skill/
├── SKILL.md           # Main instructions (required)
├── template.md        # Template for Claude to fill in
├── examples/
│   └── sample.md      # Example output showing expected format
└── scripts/
    └── validate.sh    # Script Claude can execute
```

#### Automatic discovery from nested directories

When you work with files in subdirectories, Claude Code automatically discovers skills from nested `.claude/skills/` directories. This supports monorepo setups where packages have their own skills.

#### Skills from additional directories

The `--add-dir` flag grants file access rather than configuration discovery, but skills are an exception: `.claude/skills/` within an added directory is loaded automatically.

## Configure skills

### Frontmatter reference

All fields are optional. Only `description` is recommended so Claude knows when to use the skill.

| Field                      | Required    | Description                                                                                                                                                                                     |
| :------------------------- | :---------- | :---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `name`                     | No          | Display name for the skill. If omitted, uses the directory name. Lowercase letters, numbers, and hyphens only (max 64 characters).                                                              |
| `description`              | Recommended | What the skill does and when to use it. Front-load the key use case: descriptions longer than 250 characters are truncated in the skill listing.                                                |
| `argument-hint`            | No          | Hint shown during autocomplete to indicate expected arguments.                                                                                                                                   |
| `disable-model-invocation` | No          | Set to `true` to prevent Claude from automatically loading this skill. Use for workflows you want to trigger manually with `/name`. Default: `false`.                                           |
| `user-invocable`           | No          | Set to `false` to hide from the `/` menu. Use for background knowledge users shouldn't invoke directly. Default: `true`.                                                                        |
| `allowed-tools`            | No          | Tools Claude can use without asking permission when this skill is active. Accepts a space-separated string or a YAML list.                                                                      |
| `model`                    | No          | Model to use when this skill is active.                                                                                                                                                         |
| `effort`                   | No          | Effort level when this skill is active. Options: `low`, `medium`, `high`, `max` (Opus 4.6 only).                                                                                               |
| `context`                  | No          | Set to `fork` to run in a forked subagent context.                                                                                                                                              |
| `agent`                    | No          | Which subagent type to use when `context: fork` is set.                                                                                                                                         |
| `hooks`                    | No          | Hooks scoped to this skill's lifecycle.                                                                                                                                                         |
| `paths`                    | No          | Glob patterns that limit when this skill is activated. When set, Claude loads the skill automatically only when working with files matching the patterns.                                        |
| `shell`                    | No          | Shell to use for `` !`command` `` blocks. Accepts `bash` (default) or `powershell`.                                                                                                            |

#### Available string substitutions

| Variable               | Description                                                                                         |
| :--------------------- | :-------------------------------------------------------------------------------------------------- |
| `$ARGUMENTS`           | All arguments passed when invoking the skill.                                                        |
| `$ARGUMENTS[N]`        | Access a specific argument by 0-based index.                                                         |
| `$N`                   | Shorthand for `$ARGUMENTS[N]`.                                                                       |
| `${CLAUDE_SESSION_ID}` | The current session ID.                                                                              |
| `${CLAUDE_SKILL_DIR}`  | The directory containing the skill's `SKILL.md` file.                                                |

### Add supporting files

Skills can include multiple files in their directory. Keep `SKILL.md` focused on the essentials while letting Claude access detailed reference material only when needed.

```text
my-skill/
├── SKILL.md (required - overview and navigation)
├── reference.md (detailed API docs - loaded when needed)
├── examples.md (usage examples - loaded when needed)
└── scripts/
    └── helper.py (utility script - executed, not loaded)
```

Reference supporting files from `SKILL.md` so Claude knows what each file contains and when to load it:

```markdown
## Additional resources

- For complete API details, see [reference.md](reference.md)
- For usage examples, see [examples.md](examples.md)
```

Keep `SKILL.md` under 500 lines. Move detailed reference material to separate files.

### Control who invokes a skill

* **`disable-model-invocation: true`**: Only you can invoke the skill. Use this for workflows with side effects like `/commit`, `/deploy`.
* **`user-invocable: false`**: Only Claude can invoke the skill. Use for background knowledge.

| Frontmatter                      | You can invoke | Claude can invoke | When loaded into context                                     |
| :------------------------------- | :------------- | :---------------- | :----------------------------------------------------------- |
| (default)                        | Yes            | Yes               | Description always in context, full skill loads when invoked |
| `disable-model-invocation: true` | Yes            | No                | Description not in context, full skill loads when you invoke |
| `user-invocable: false`          | No             | Yes               | Description always in context, full skill loads when invoked |

In a regular session, skill descriptions are loaded into context so Claude knows what's available, but full skill content only loads when invoked. Subagents with preloaded skills work differently: the full skill content is injected at startup.

### Restrict tool access

```yaml
---
name: safe-reader
description: Read files without making changes
allowed-tools: Read Grep Glob
---
```

### Pass arguments to skills

```yaml
---
name: fix-issue
description: Fix a GitHub issue
disable-model-invocation: true
---

Fix GitHub issue $ARGUMENTS following our coding standards.
```

When you run `/fix-issue 123`, Claude receives "Fix GitHub issue 123 following our coding standards..."

For positional arguments: `$ARGUMENTS[0]`, `$ARGUMENTS[1]`, or shorthand `$0`, `$1`.

## Advanced patterns

### Inject dynamic context

The `` !`<command>` `` syntax runs shell commands before the skill content is sent to Claude:

```yaml
---
name: pr-summary
description: Summarize changes in a pull request
context: fork
agent: Explore
allowed-tools: Bash(gh *)
---

## Pull request context
- PR diff: !`gh pr diff`
- PR comments: !`gh pr view --comments`
- Changed files: !`gh pr diff --name-only`

## Your task
Summarize this pull request...
```

This is preprocessing, not something Claude executes. Claude only sees the final result.

### Run skills in a subagent

Add `context: fork` to run a skill in isolation. The skill content becomes the prompt that drives the subagent.

| Approach                     | System prompt                             | Task                        | Also loads                   |
| :--------------------------- | :---------------------------------------- | :-------------------------- | :--------------------------- |
| Skill with `context: fork`   | From agent type (`Explore`, `Plan`, etc.) | SKILL.md content            | CLAUDE.md                    |
| Subagent with `skills` field | Subagent's markdown body                  | Claude's delegation message | Preloaded skills + CLAUDE.md |

The `agent` field specifies which subagent configuration to use: built-in agents (`Explore`, `Plan`, `general-purpose`) or custom subagent from `.claude/agents/`.

### Restrict Claude's skill access

**Disable all skills** by denying the Skill tool in `/permissions`:

```text
Skill
```

**Allow or deny specific skills** using permission rules:

```text
Skill(commit)
Skill(review-pr *)
Skill(deploy *)
```

## Share skills

* **Project skills**: Commit `.claude/skills/` to version control
* **Plugins**: Create a `skills/` directory in your plugin
* **Managed**: Deploy organization-wide through managed settings

## Troubleshooting

### Skill not triggering

1. Check the description includes keywords users would naturally say
2. Verify the skill appears in `What skills are available?`
3. Try rephrasing your request to match the description more closely
4. Invoke it directly with `/skill-name`

### Skill triggers too often

1. Make the description more specific
2. Add `disable-model-invocation: true` if you only want manual invocation

### Skill descriptions are cut short

Descriptions are loaded into context so Claude knows what's available. If you have many skills, descriptions are shortened to fit the character budget. Front-load the key use case, since each entry is capped at 250 characters regardless of budget.

To raise the limit, set `SLASH_COMMAND_TOOL_CHAR_BUDGET`.
