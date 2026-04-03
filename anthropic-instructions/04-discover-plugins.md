# Discover and Install Prebuilt Plugins Through Marketplaces

> Source: https://code.claude.com/docs/en/discover-plugins
> Find and install plugins from marketplaces to extend Claude Code with new commands, agents, and capabilities.

Plugins extend Claude Code with skills, agents, hooks, and MCP servers. Plugin marketplaces are catalogs that help you discover and install these extensions without building them yourself.

## How marketplaces work

A marketplace is a catalog of plugins that someone else has created and shared. Using a marketplace is a two-step process:

1. **Add the marketplace**: This registers the catalog with Claude Code so you can browse what's available. No plugins are installed yet.
2. **Install individual plugins**: Browse the catalog and install the plugins you want.

Think of it like adding an app store: adding the store gives you access to browse its collection, but you still choose which apps to download individually.

## Official Anthropic marketplace

The official Anthropic marketplace (`claude-plugins-official`) is automatically available when you start Claude Code. Run `/plugin` and go to the **Discover** tab to browse what's available, or view the catalog at claude.com/plugins.

To install a plugin from the official marketplace:

```shell
/plugin install <name>@claude-plugins-official
```

### Code intelligence

Code intelligence plugins enable Claude Code's built-in LSP tool, giving Claude the ability to jump to definitions, find references, and see type errors immediately after edits.

| Language   | Plugin              | Binary required              |
| :--------- | :------------------ | :--------------------------- |
| C/C++      | `clangd-lsp`        | `clangd`                     |
| C#         | `csharp-lsp`        | `csharp-ls`                  |
| Go         | `gopls-lsp`         | `gopls`                      |
| Java       | `jdtls-lsp`         | `jdtls`                      |
| Kotlin     | `kotlin-lsp`        | `kotlin-language-server`     |
| Lua        | `lua-lsp`           | `lua-language-server`        |
| PHP        | `php-lsp`           | `intelephense`               |
| Python     | `pyright-lsp`       | `pyright-langserver`         |
| Rust       | `rust-analyzer-lsp` | `rust-analyzer`              |
| Swift      | `swift-lsp`         | `sourcekit-lsp`              |
| TypeScript | `typescript-lsp`    | `typescript-language-server` |

#### What Claude gains from code intelligence plugins

* **Automatic diagnostics**: after every file edit Claude makes, the language server analyzes the changes and reports errors and warnings back automatically.
* **Code navigation**: Claude can use the language server to jump to definitions, find references, get type info on hover, list symbols, find implementations, and trace call hierarchies.

### External integrations

* **Source control**: `github`, `gitlab`
* **Project management**: `atlassian` (Jira/Confluence), `asana`, `linear`, `notion`
* **Design**: `figma`
* **Infrastructure**: `vercel`, `firebase`, `supabase`
* **Communication**: `slack`
* **Monitoring**: `sentry`

### Development workflows

* **commit-commands**: Git commit workflows including commit, push, and PR creation
* **pr-review-toolkit**: Specialized agents for reviewing pull requests
* **agent-sdk-dev**: Tools for building with the Claude Agent SDK
* **plugin-dev**: Toolkit for creating your own plugins

### Output styles

* **explanatory-output-style**: Educational insights about implementation choices
* **learning-output-style**: Interactive learning mode for skill building

## Add marketplaces

Use the `/plugin marketplace add` command to add marketplaces from different sources.

Shortcuts: You can use `/plugin market` instead of `/plugin marketplace`, and `rm` instead of `remove`.

* **GitHub repositories**: `owner/repo` format
* **Git URLs**: any git repository URL (GitLab, Bitbucket, self-hosted)
* **Local paths**: directories or direct paths to `marketplace.json` files
* **Remote URLs**: direct URLs to hosted `marketplace.json` files

### Add from GitHub

```shell
/plugin marketplace add anthropics/claude-code
```

### Add from other Git hosts

```shell
/plugin marketplace add https://gitlab.com/company/plugins.git
/plugin marketplace add git@gitlab.com:company/plugins.git
```

To add a specific branch or tag, append `#` followed by the ref:

```shell
/plugin marketplace add https://gitlab.com/company/plugins.git#v1.0.0
```

### Add from local paths

```shell
/plugin marketplace add ./my-marketplace
/plugin marketplace add ./path/to/marketplace.json
```

### Add from remote URLs

```shell
/plugin marketplace add https://example.com/marketplace.json
```

## Install plugins

```shell
/plugin install plugin-name@marketplace-name
```

Installation scopes:

* **User scope** (default): install for yourself across all projects
* **Project scope**: install for all collaborators on this repository (adds to `.claude/settings.json`)
* **Local scope**: install for yourself in this repository only (not shared with collaborators)
* **Managed scope**: installed by administrators via managed settings (read-only)

**Make sure you trust a plugin before installing, updating, or using it.** Anthropic does not control what MCP servers, files, or other software are included in plugins and cannot verify that they work as intended.

## Manage installed plugins

Disable a plugin without uninstalling:

```shell
/plugin disable plugin-name@marketplace-name
```

Re-enable a disabled plugin:

```shell
/plugin enable plugin-name@marketplace-name
```

Completely remove a plugin:

```shell
/plugin uninstall plugin-name@marketplace-name
```

### Apply plugin changes without restarting

```shell
/reload-plugins
```

Claude Code reloads all active plugins and shows counts for plugins, skills, agents, hooks, plugin MCP servers, and plugin LSP servers.

## Configure team marketplaces

Add `extraKnownMarketplaces` to your project's `.claude/settings.json`:

```json
{
  "extraKnownMarketplaces": {
    "my-team-tools": {
      "source": {
        "source": "github",
        "repo": "your-org/claude-plugins"
      }
    }
  }
}
```

## Troubleshooting

### /plugin command not recognized

1. Check your version: `claude --version`
2. Update Claude Code
3. Restart Claude Code

### Common issues

* **Marketplace not loading**: Verify the URL is accessible and that `.claude-plugin/marketplace.json` exists
* **Plugin installation failures**: Check that plugin source URLs are accessible and repositories are public (or you have access)
* **Files not found after installation**: Plugins are copied to a cache, so paths referencing files outside the plugin directory won't work
* **Plugin skills not appearing**: Clear the cache with `rm -rf ~/.claude/plugins/cache`, restart Claude Code, and reinstall the plugin.
