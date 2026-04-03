# Plugins Reference

> Source: https://code.claude.com/docs/en/plugins-reference
> Complete technical reference for Claude Code plugin system, including schemas, CLI commands, and component specifications.

A **plugin** is a self-contained directory of components that extends Claude Code with custom functionality. Plugin components include skills, agents, hooks, MCP servers, and LSP servers.

## Plugin components reference

### Skills

**Location**: `skills/` or `commands/` directory in plugin root

**Skill structure**:

```text
skills/
├── pdf-processor/
│   ├── SKILL.md
│   ├── reference.md (optional)
│   └── scripts/ (optional)
└── code-reviewer/
    └── SKILL.md
```

**Integration behavior**:

* Skills and commands are automatically discovered when the plugin is installed
* Claude can invoke them automatically based on task context
* Skills can include supporting files alongside SKILL.md

### Agents

**Location**: `agents/` directory in plugin root

**File format**: Markdown files describing agent capabilities

```markdown
---
name: agent-name
description: What this agent specializes in and when Claude should invoke it
model: sonnet
effort: medium
maxTurns: 20
disallowedTools: Write, Edit
---

Detailed system prompt for the agent describing its role, expertise, and behavior.
```

Plugin agents support `name`, `description`, `model`, `effort`, `maxTurns`, `tools`, `disallowedTools`, `skills`, `memory`, `background`, and `isolation` frontmatter fields. The only valid `isolation` value is `"worktree"`. For security reasons, `hooks`, `mcpServers`, and `permissionMode` are not supported for plugin-shipped agents.

### Hooks

**Location**: `hooks/hooks.json` in plugin root, or inline in plugin.json

Plugin hooks respond to lifecycle events:

| Event                | When it fires                                                                                                  |
| :------------------- | :------------------------------------------------------------------------------------------------------------- |
| `SessionStart`       | When a session begins or resumes                                                                               |
| `UserPromptSubmit`   | When you submit a prompt, before Claude processes it                                                           |
| `PreToolUse`         | Before a tool call executes. Can block it                                                                      |
| `PermissionRequest`  | When a permission dialog appears                                                                               |
| `PermissionDenied`   | When a tool call is denied by the auto mode classifier                                                         |
| `PostToolUse`        | After a tool call succeeds                                                                                     |
| `PostToolUseFailure` | After a tool call fails                                                                                        |
| `Notification`       | When Claude Code sends a notification                                                                          |
| `SubagentStart`      | When a subagent is spawned                                                                                     |
| `SubagentStop`       | When a subagent finishes                                                                                       |
| `TaskCreated`        | When a task is being created                                                                                   |
| `TaskCompleted`      | When a task is being marked as completed                                                                       |
| `Stop`               | When Claude finishes responding                                                                                |
| `StopFailure`        | When the turn ends due to an API error                                                                         |
| `TeammateIdle`       | When an agent team teammate is about to go idle                                                                |
| `InstructionsLoaded` | When a CLAUDE.md or `.claude/rules/*.md` file is loaded into context                                           |
| `ConfigChange`       | When a configuration file changes during a session                                                             |
| `CwdChanged`         | When the working directory changes                                                                             |
| `FileChanged`        | When a watched file changes on disk                                                                            |
| `WorktreeCreate`     | When a worktree is being created                                                                               |
| `WorktreeRemove`     | When a worktree is being removed                                                                               |
| `PreCompact`         | Before context compaction                                                                                      |
| `PostCompact`        | After context compaction completes                                                                             |
| `Elicitation`        | When an MCP server requests user input                                                                         |
| `ElicitationResult`  | After a user responds to an MCP elicitation                                                                    |
| `SessionEnd`         | When a session terminates                                                                                      |

**Hook types**: `command`, `http`, `prompt`, `agent`

### MCP servers

**Location**: `.mcp.json` in plugin root, or inline in plugin.json

```json
{
  "mcpServers": {
    "plugin-database": {
      "command": "${CLAUDE_PLUGIN_ROOT}/servers/db-server",
      "args": ["--config", "${CLAUDE_PLUGIN_ROOT}/config.json"],
      "env": {
        "DB_PATH": "${CLAUDE_PLUGIN_ROOT}/data"
      }
    }
  }
}
```

### LSP servers

**Location**: `.lsp.json` in plugin root, or inline in `plugin.json`

```json
{
  "go": {
    "command": "gopls",
    "args": ["serve"],
    "extensionToLanguage": {
      ".go": "go"
    }
  }
}
```

**Required fields**: `command`, `extensionToLanguage`

**Optional fields**: `args`, `transport`, `env`, `initializationOptions`, `settings`, `workspaceFolder`, `startupTimeout`, `shutdownTimeout`, `restartOnCrash`, `maxRestarts`

## Plugin installation scopes

| Scope     | Settings file                   | Use case                                                 |
| :-------- | :------------------------------ | :------------------------------------------------------- |
| `user`    | `~/.claude/settings.json`      | Personal plugins available across all projects (default) |
| `project` | `.claude/settings.json`        | Team plugins shared via version control                  |
| `local`   | `.claude/settings.local.json`  | Project-specific plugins, gitignored                     |
| `managed` | Managed settings               | Managed plugins (read-only, update only)                 |

## Plugin manifest schema

The `.claude-plugin/plugin.json` file defines your plugin's metadata and configuration. The manifest is optional. If omitted, Claude Code auto-discovers components in default locations and derives the plugin name from the directory name.

### Complete schema

```json
{
  "name": "plugin-name",
  "version": "1.2.0",
  "description": "Brief plugin description",
  "author": {
    "name": "Author Name",
    "email": "author@example.com",
    "url": "https://github.com/author"
  },
  "homepage": "https://docs.example.com/plugin",
  "repository": "https://github.com/author/plugin",
  "license": "MIT",
  "keywords": ["keyword1", "keyword2"],
  "commands": ["./custom/commands/special.md"],
  "agents": "./custom/agents/",
  "skills": "./custom/skills/",
  "hooks": "./config/hooks.json",
  "mcpServers": "./mcp-config.json",
  "outputStyles": "./styles/",
  "lspServers": "./.lsp.json"
}
```

### Required fields

If you include a manifest, `name` is the only required field.

| Field  | Type   | Description                               |
| :----- | :----- | :---------------------------------------- |
| `name` | string | Unique identifier (kebab-case, no spaces) |

### Metadata fields

| Field         | Type   | Description                                                                                                                 |
| :------------ | :----- | :-------------------------------------------------------------------------------------------------------------------------- |
| `version`     | string | Semantic version. If also set in the marketplace entry, `plugin.json` takes priority.                                       |
| `description` | string | Brief explanation of plugin purpose                                                                                         |
| `author`      | object | Author information                                                                                                          |
| `homepage`    | string | Documentation URL                                                                                                           |
| `repository`  | string | Source code URL                                                                                                             |
| `license`     | string | License identifier                                                                                                          |
| `keywords`    | array  | Discovery tags                                                                                                              |

### Component path fields

| Field          | Type                  | Description                                                                                                                                               |
| :------------- | :-------------------- | :-------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `commands`     | string/array          | Custom command files/directories (replaces default `commands/`)                                                                                           |
| `agents`       | string/array          | Custom agent files (replaces default `agents/`)                                                                                                           |
| `skills`       | string/array          | Custom skill directories (replaces default `skills/`)                                                                                                     |
| `hooks`        | string/array/object   | Hook config paths or inline config                                                                                                                        |
| `mcpServers`   | string/array/object   | MCP config paths or inline config                                                                                                                         |
| `outputStyles` | string/array          | Custom output style files/directories (replaces default `output-styles/`)                                                                                 |
| `lspServers`   | string/array/object   | Language Server Protocol configs                                                                                                                          |
| `userConfig`   | object                | User-configurable values prompted at enable time                                                                                                          |
| `channels`     | array                 | Channel declarations for message injection                                                                                                                |

### User configuration

```json
{
  "userConfig": {
    "api_endpoint": {
      "description": "Your team's API endpoint",
      "sensitive": false
    },
    "api_token": {
      "description": "API authentication token",
      "sensitive": true
    }
  }
}
```

Values available as `${user_config.KEY}` in MCP/LSP configs, hook commands. Also exported as `CLAUDE_PLUGIN_OPTION_<KEY>` environment variables.

### Path behavior rules

For `commands`, `agents`, `skills`, and `outputStyles`, custom paths replace the default directory. All paths must be relative and start with `./`.

To keep the default directory and add more paths: `"commands": ["./commands/", "./extras/deploy.md"]`

### Environment variables

* **`${CLAUDE_PLUGIN_ROOT}`**: Absolute path to plugin's installation directory. Changes when plugin updates.
* **`${CLAUDE_PLUGIN_DATA}`**: Persistent directory for plugin state that survives updates. Located at `~/.claude/plugins/data/{id}/`.

## Plugin caching and file resolution

Plugins are copied to the user's local plugin cache (`~/.claude/plugins/cache`). Understanding this is important:

* **Path traversal limitations**: Installed plugins cannot reference files outside their directory. Paths like `../shared-utils` will not work.
* **Working with external dependencies**: Create symbolic links within your plugin directory. Symlinks are honored during the copy process.

## Plugin directory structure

### Standard plugin layout

```text
enterprise-plugin/
├── .claude-plugin/           # Metadata directory (optional)
│   └── plugin.json             # plugin manifest
├── commands/                 # Default command location
├── agents/                   # Default agent location
├── skills/                   # Agent Skills
│   ├── code-reviewer/
│   │   └── SKILL.md
│   └── pdf-processor/
│       ├── SKILL.md
│       └── scripts/
├── output-styles/            # Output style definitions
├── hooks/                    # Hook configurations
│   ├── hooks.json
│   └── security-hooks.json
├── bin/                      # Plugin executables added to PATH
├── settings.json            # Default settings for the plugin
├── .mcp.json                # MCP server definitions
├── .lsp.json                # LSP server configurations
├── scripts/                 # Hook and utility scripts
├── LICENSE
└── CHANGELOG.md
```

**WARNING**: The `.claude-plugin/` directory contains the `plugin.json` file. All other directories (commands/, agents/, skills/, output-styles/, hooks/) must be at the plugin root, not inside `.claude-plugin/`.

### File locations reference

| Component         | Default Location             | Purpose                                                                                                                                  |
| :---------------- | :--------------------------- | :--------------------------------------------------------------------------------------------------------------------------------------- |
| **Manifest**      | `.claude-plugin/plugin.json` | Plugin metadata and configuration (optional)                                                                                             |
| **Commands**      | `commands/`                  | Skill Markdown files (legacy; use `skills/` for new skills)                                                                              |
| **Agents**        | `agents/`                    | Subagent Markdown files                                                                                                                  |
| **Skills**        | `skills/`                    | Skills with `<name>/SKILL.md` structure                                                                                                  |
| **Output styles** | `output-styles/`             | Output style definitions                                                                                                                 |
| **Hooks**         | `hooks/hooks.json`           | Hook configuration                                                                                                                       |
| **MCP servers**   | `.mcp.json`                  | MCP server definitions                                                                                                                   |
| **LSP servers**   | `.lsp.json`                  | Language server configurations                                                                                                           |
| **Executables**   | `bin/`                       | Executables added to the Bash tool's `PATH`                                                                                              |
| **Settings**      | `settings.json`              | Default configuration applied when the plugin is enabled                                                                                 |

## CLI commands reference

### plugin install

```bash
claude plugin install <plugin> [options]
```

Options: `-s, --scope <scope>` (user, project, local)

### plugin uninstall

```bash
claude plugin uninstall <plugin> [options]
```

Options: `-s, --scope <scope>`, `--keep-data`

Aliases: `remove`, `rm`

### plugin enable

```bash
claude plugin enable <plugin> [options]
```

### plugin disable

```bash
claude plugin disable <plugin> [options]
```

### plugin update

```bash
claude plugin update <plugin> [options]
```

## Debugging and development tools

Use `claude --debug` to see plugin loading details.

### Common issues

| Issue                               | Cause                           | Solution                                                |
| :---------------------------------- | :------------------------------ | :------------------------------------------------------ |
| Plugin not loading                  | Invalid `plugin.json`           | Run `claude plugin validate` or `/plugin validate`      |
| Commands not appearing              | Wrong directory structure       | Ensure `commands/` at root, not in `.claude-plugin/`    |
| Hooks not firing                    | Script not executable           | Run `chmod +x script.sh`                                |
| MCP server fails                    | Missing `${CLAUDE_PLUGIN_ROOT}` | Use variable for all plugin paths                       |
| Path errors                         | Absolute paths used             | All paths must be relative and start with `./`          |
| LSP `Executable not found in $PATH` | Language server not installed   | Install the binary                                      |

### Version management

Follow semantic versioning: `MAJOR.MINOR.PATCH`

* Start at `1.0.0` for your first stable release
* Update the version in `plugin.json` before distributing changes
* Document changes in a `CHANGELOG.md` file

**Critical**: Claude Code uses the version to determine whether to update your plugin. If you change your plugin's code but don't bump the version in `plugin.json`, your plugin's existing users won't see your changes due to caching.
