# AppworkZ Katalyst Skill

**Katalyst** is AppworkZ's Builder OS — a repo-native AI development operating layer that turns messy software ideas into shippable product work.

## What It Is

Katalyst is a reusable skill that any AI coding agent can follow to:

1. Understand the current product state
2. Pull the correct, version-specific docs
3. Decide what to do next
4. Implement correctly
5. Review the work
6. Update repo memory

It works with ChatGPT Codex (local and cloud), Antigravity, Claude/Opus, Gemini CLI, and future AI agents.

## What It Is Not

Not a dashboard. Not a SaaS app. Not a project manager. Not a Notion clone.

It is markdown files, repo conventions, reusable prompts, and agent instructions.

## Quick Start

### For AI Agents

1. Read `AGENTS.md`
2. Read `skills/katalyst/SKILL.md`
3. Follow the Katalyst loop: `sense → spec → task → docs → build → review → memory`

### For Adit

1. Copy this skill into any AppworkZ product repo
2. Run `spec.md` through Katalyst Sense/Spec Mode to define the product
3. Use Task Mode to break work into agent-sized tasks
4. Hand tasks to Codex, Antigravity, or other agents using the prompts in `prompts/`

## Docs Retrieval

Katalyst uses [neuledge/context](https://github.com/neuledge/context) to retrieve correct, version-specific documentation before coding.

```bash
npm install -g @neuledge/context
```

See `knowledge/docs-retrieval.md` for full setup.

## Repo Structure

```
├── .codex-plugin/
│   └── plugin.json            # Codex Plugin Manifest
├── AGENTS.md                  # Entry point for AI agents
├── README.md                  # This file
├── spec.md                    # Product spec (single source of truth)
├── spec-history.md            # Decision change log
├── knowledge/
│   └── docs-retrieval.md      # neuledge/context protocol
├── tasks/
│   ├── current.md             # Active task
│   ├── backlog.md             # Known future work
│   └── done.md                # Completed tasks
├── prompts/
│   ├── codex.md               # Prompt for Codex local
│   ├── codex-cloud.md         # Prompt for Codex Cloud
│   ├── antigravity.md         # Prompt for Antigravity
│   └── review.md              # Review prompt
└── skills/
    └── katalyst/
        └── SKILL.md           # Full operating guide
```

## Plugin Integration

This repository is built as a Codex Plugin. You can install it directly in Codex by pointing your marketplace to this directory or publishing it to the cloud.

## Owner

AppworkZ / Adit
