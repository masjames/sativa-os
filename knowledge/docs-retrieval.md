# Docs Retrieval — neuledge/context

> Last updated: 2026-06-26

This file explains how this repo uses neuledge/context for documentation retrieval.

## What is Context?

neuledge/context is a local-first MCP documentation server and CLI that helps AI coding agents retrieve correct, version-specific docs before coding.

Repository: https://github.com/neuledge/context

## Why We Use It

AI agents rely on training data that may be stale. This causes:
- Wrong imports
- Outdated API calls
- Old framework patterns
- Hallucinated config
- Broken code

Context prevents this by providing a structured way to pull and query docs.

## Setup

### Install

```bash
npm install -g @neuledge/context
```

### OpenAI Codex Local

```bash
codex mcp add context -- context serve
```

Or in Codex config:

```toml
[mcp_servers.context]
command = "context"
args = ["serve"]
```

### Other MCP-Compatible Agents

```json
{
  "mcpServers": {
    "context": {
      "command": "context",
      "args": ["serve"]
    }
  }
}
```

### Manual CLI Fallback

```bash
context browse <package>
context install <registry/name>
context add <source>
```

## Commonly Needed Packages

None identified yet. Update this section as the product stack is defined.

Examples for future reference:

```bash
context install npm/next
context install npm/react
context install npm/tailwindcss
context add https://github.com/vercel/next.js/tree/v16.0.0
```

## Official Docs Sources

None yet. Add links to official documentation as the stack is chosen.

## Internal Docs

None yet. Use `context add ./docs --name appworkz-internal-docs --pkg-version 1.0.0` when internal docs exist.

## Known Doc Gaps

None yet.

## When Context is Unavailable

If Context is not available in the current environment:

1. The agent must say so explicitly.
2. Fall back to repo docs and official documentation available in the workspace.
3. Do not pretend docs were checked when they were not.
4. Note the gap in the session summary.

## Official Docs Sources Added 2026-06-27

- tldraw persistence: https://tldraw.dev/sdk-features/persistence
- tldraw readonly mode: https://tldraw.dev/sdk-features/readonly
- tldraw store/snapshot loading: https://tldraw.dev/sdk-features/store
- Vite guide: https://vite.dev/guide/
- React build tool guidance: https://react.dev/learn/build-a-react-app-from-scratch
- Cloudflare Workers static assets: https://developers.cloudflare.com/workers/static-assets/
- Cloudflare React/Vite Workers guide: https://developers.cloudflare.com/workers/framework-guides/web-apps/react/

Context CLI was unavailable in this environment (`context: command not found`), so official web documentation was used as fallback.

## 2026-06-27 implementation note

The tldraw documentation was retrieved for the previous experiment, but the BMC user flow was reverted to a lightweight structured nine-block editor after UX/performance feedback. Future BMC work should prefer the structured `business_model_blocks` API unless a whiteboard dependency is explicitly requested again.
