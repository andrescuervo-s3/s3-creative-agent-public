# Create and Distribute a Plugin Marketplace

> Source: https://code.claude.com/docs/en/plugin-marketplaces
> Build and host plugin marketplaces to distribute Claude Code extensions across teams and communities.

A **plugin marketplace** is a catalog that lets you distribute plugins to others. Marketplaces provide centralized discovery, version tracking, automatic updates, and support for multiple source types (git repositories, local paths, and more). This guide shows you how to create your own marketplace to share plugins with your team or community.

## Overview

Creating and distributing a marketplace involves:

1. **Creating plugins**: build one or more plugins with commands, agents, hooks, MCP servers, or LSP servers.
2. **Creating a marketplace file**: define a `marketplace.json` that lists your plugins and where to find them.
3. **Host the marketplace**: push to GitHub, GitLab, or another git host.
4. **Share with users**: users add your marketplace with `/plugin marketplace add` and install individual plugins.

Once your marketplace is live, you can update it by pushing changes to your repository. Users refresh their local copy with `/plugin marketplace update`.

## Walkthrough: create a local marketplace

This example creates a marketplace with one plugin: a `/quality-review` skill for code reviews.

### Step 1: Create the directory structure

```bash
mkdir -p my-marketplace/.claude-plugin
mkdir -p my-marketplace/plugins/quality-review-plugin/.claude-plugin
mkdir -p my-marketplace/plugins/quality-review-plugin/skills/quality-review
```

### Step 2: Create the skill

```markdown
---
description: Review code for bugs, security, and performance
disable-model-invocation: true
---

Review the code I've selected or the recent changes for:
- Potential bugs or edge cases
- Security concerns
- Performance issues
- Readability improvements

Be concise and actionable.
```

### Step 3: Create the plugin manifest

```json
{
  "name": "quality-review-plugin",
  "description": "Adds a /quality-review skill for quick code reviews",
  "version": "1.0.0"
}
```

### Step 4: Create the marketplace file

```json
{
  "name": "my-plugins",
  "owner": {
    "name": "Your Name"
  },
  "plugins": [
    {
      "name": "quality-review-plugin",
      "source": "./plugins/quality-review-plugin",
      "description": "Adds a /quality-review skill for quick code reviews"
    }
  ]
}
```

### Step 5: Add and install

```shell
/plugin marketplace add ./my-marketplace
/plugin install quality-review-plugin@my-plugins
```

**How plugins are installed**: When users install a plugin, Claude Code copies the plugin directory to a cache location. This means plugins can't reference files outside their directory using paths like `../shared-utils`, because those files won't be copied.

If you need to share files across plugins, use symlinks (which are followed during copying).

## Create the marketplace file

Create `.claude-plugin/marketplace.json` in your repository root. This file defines your marketplace's name, owner information, and a list of plugins with their sources.

```json
{
  "name": "company-tools",
  "owner": {
    "name": "DevTools Team",
    "email": "devtools@example.com"
  },
  "plugins": [
    {
      "name": "code-formatter",
      "source": "./plugins/formatter",
      "description": "Automatic code formatting on save",
      "version": "2.1.0",
      "author": {
        "name": "DevTools Team"
      }
    },
    {
      "name": "deployment-tools",
      "source": {
        "source": "github",
        "repo": "company/deploy-plugin"
      },
      "description": "Deployment automation tools"
    }
  ]
}
```

## Marketplace schema

### Required fields

| Field     | Type   | Description                                                                                                                                                            | Example        |
| :-------- | :----- | :--------------------------------------------------------------------------------------------------------------------------------------------------------------------- | :------------- |
| `name`    | string | Marketplace identifier (kebab-case, no spaces). This is public-facing: users see it when installing plugins (for example, `/plugin install my-tool@your-marketplace`). | `"acme-tools"` |
| `owner`   | object | Marketplace maintainer information                                                                                                                                     |                |
| `plugins` | array  | List of available plugins                                                                                                                                              |                |

### Owner fields

| Field   | Type   | Required | Description                      |
| :------ | :----- | :------- | :------------------------------- |
| `name`  | string | Yes      | Name of the maintainer or team   |
| `email` | string | No       | Contact email for the maintainer |

### Optional metadata

| Field                  | Type   | Description                                                                                                                                                               |
| :--------------------- | :----- | :------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `metadata.description` | string | Brief marketplace description                                                                                                                                             |
| `metadata.version`     | string | Marketplace version                                                                                                                                                       |
| `metadata.pluginRoot`  | string | Base directory prepended to relative plugin source paths (for example, `"./plugins"` lets you write `"source": "formatter"` instead of `"source": "./plugins/formatter"`) |

## Plugin entries

Each plugin entry in the `plugins` array describes a plugin and where to find it.

### Required fields

| Field    | Type           | Description                                                                                                                                            |
| :------- | :------------- | :----------------------------------------------------------------------------------------------------------------------------------------------------- |
| `name`   | string         | Plugin identifier (kebab-case, no spaces). This is public-facing: users see it when installing (for example, `/plugin install my-plugin@marketplace`). |
| `source` | string/object  | Where to fetch the plugin from                                                                                                                         |

### Optional plugin fields

| Field         | Type    | Description                                                                                                                       |
| :------------ | :------ | :-------------------------------------------------------------------------------------------------------------------------------- |
| `description` | string  | Brief plugin description                                                                                                          |
| `version`     | string  | Plugin version                                                                                                                    |
| `author`      | object  | Plugin author information (`name` required, `email` optional)                                                                     |
| `homepage`    | string  | Plugin homepage or documentation URL                                                                                              |
| `repository`  | string  | Source code repository URL                                                                                                        |
| `license`     | string  | SPDX license identifier (for example, MIT, Apache-2.0)                                                                            |
| `keywords`    | array   | Tags for plugin discovery and categorization                                                                                      |
| `category`    | string  | Plugin category for organization                                                                                                  |
| `tags`        | array   | Tags for searchability                                                                                                            |
| `strict`      | boolean | Controls whether `plugin.json` is the authority for component definitions (default: true).                                        |

## Plugin sources

| Source        | Type                            | Fields                             | Notes                                                                                                                                             |
| ------------- | ------------------------------- | ---------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------- |
| Relative path | `string` (e.g. `"./my-plugin"`) | none                               | Local directory within the marketplace repo. Must start with `./`. Resolved relative to the marketplace root, not the `.claude-plugin/` directory |
| `github`      | object                          | `repo`, `ref?`, `sha?`             |                                                                                                                                                   |
| `url`         | object                          | `url`, `ref?`, `sha?`              | Git URL source                                                                                                                                    |
| `git-subdir`  | object                          | `url`, `path`, `ref?`, `sha?`      | Subdirectory within a git repo. Clones sparsely to minimize bandwidth for monorepos                                                               |
| `npm`         | object                          | `package`, `version?`, `registry?` | Installed via `npm install`                                                                                                                       |

### Relative paths

For plugins in the same repository, use a path starting with `./`:

```json
{
  "name": "my-plugin",
  "source": "./plugins/my-plugin"
}
```

Paths resolve relative to the marketplace root, which is the directory containing `.claude-plugin/`.

### GitHub repositories

```json
{
  "name": "github-plugin",
  "source": {
    "source": "github",
    "repo": "owner/plugin-repo",
    "ref": "v2.0.0",
    "sha": "a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0"
  }
}
```

### Git repositories

```json
{
  "name": "git-plugin",
  "source": {
    "source": "url",
    "url": "https://gitlab.com/team/plugin.git",
    "ref": "main",
    "sha": "a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0"
  }
}
```

### Git subdirectories

```json
{
  "name": "my-plugin",
  "source": {
    "source": "git-subdir",
    "url": "https://github.com/acme-corp/monorepo.git",
    "path": "tools/claude-plugin",
    "ref": "v2.0.0"
  }
}
```

### npm packages

```json
{
  "name": "my-npm-plugin",
  "source": {
    "source": "npm",
    "package": "@acme/claude-plugin",
    "version": "2.1.0",
    "registry": "https://npm.example.com"
  }
}
```

### Strict mode

| Value            | Behavior                                                                                                                                                         |
| :--------------- | :--------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `true` (default) | `plugin.json` is the authority. The marketplace entry can supplement it with additional components, and both sources are merged.                                 |
| `false`          | The marketplace entry is the entire definition. If the plugin also has a `plugin.json` that declares components, that's a conflict and the plugin fails to load. |

## Host and distribute marketplaces

### Host on GitHub (recommended)

1. Create a repository
2. Add `.claude-plugin/marketplace.json`
3. Users add with `/plugin marketplace add owner/repo`

### Private repositories

Claude Code supports installing plugins from private repositories. For manual installation, Claude Code uses your existing git credential helpers. Background auto-updates require authentication tokens:

| Provider  | Environment variables        |
| :-------- | :--------------------------- |
| GitHub    | `GITHUB_TOKEN` or `GH_TOKEN` |
| GitLab    | `GITLAB_TOKEN` or `GL_TOKEN` |
| Bitbucket | `BITBUCKET_TOKEN`            |

### Version resolution and release channels

Plugin versions determine cache paths and update detection.

**Warning**: When possible, avoid setting the version in both `plugin.json` and `marketplace.json`. The plugin manifest always wins silently, which can cause the marketplace version to be ignored. For relative-path plugins, set the version in the marketplace entry. For all other plugin sources, set it in the plugin manifest.

**Version format**: `MAJOR.MINOR.PATCH`

* **MAJOR**: Breaking changes
* **MINOR**: New features (backward-compatible)
* **PATCH**: Bug fixes (backward-compatible)

**Critical**: Claude Code uses the version to determine whether to update your plugin. If you change your plugin's code but don't bump the version in `plugin.json`, your plugin's existing users won't see your changes due to caching.

### Require marketplaces for your team

Add to `.claude/settings.json`:

```json
{
  "extraKnownMarketplaces": {
    "company-tools": {
      "source": {
        "source": "github",
        "repo": "your-org/claude-plugins"
      }
    }
  },
  "enabledPlugins": {
    "code-formatter@company-tools": true
  }
}
```

## Validation and testing

```bash
claude plugin validate .
```

```shell
/plugin marketplace add ./path/to/marketplace
/plugin install test-plugin@marketplace-name
```

## CLI commands

### plugin marketplace add

```bash
claude plugin marketplace add <source> [options]
```

Options: `--scope <scope>` (user, project, local), `--sparse <paths...>`

### plugin marketplace list

```bash
claude plugin marketplace list [--json]
```

### plugin marketplace remove

```bash
claude plugin marketplace remove <name>
```

Warning: Removing a marketplace also uninstalls any plugins installed from it.

### plugin marketplace update

```bash
claude plugin marketplace update [name]
```

## Troubleshooting

### Marketplace not loading

* Verify the marketplace URL is accessible
* Check that `.claude-plugin/marketplace.json` exists
* Ensure JSON syntax is valid using `claude plugin validate`
* For private repositories, confirm access permissions

### Plugin installation failures

* Verify plugin source URLs are accessible
* Check that plugin directories contain required files
* For GitHub sources, ensure repositories are public or you have access

### Files not found after installation

Plugins are copied to a cache directory rather than used in-place. Paths that reference files outside the plugin's directory (such as `../shared-utils`) won't work because those files aren't copied.

Solutions: Use symlinks (followed during copying) or restructure directories.
