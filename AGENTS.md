# Agent Instructions

This repo uses **AppworkZ Katalyst**.

Before making product or code changes:

1. Read `spec.md`.
2. Read `skills/katalyst/SKILL.md`.
3. Read `tasks/current.md` if it exists.
4. Inspect dependency files.
5. Use `neuledge/context` to retrieve correct docs before touching external dependencies, frameworks, SDKs, CLIs, or deployment config.
6. Follow existing code conventions.
7. Make the smallest safe change.
8. Update repo memory when behavior, architecture, docs sources, or product scope changes.

Do not rely on model memory for fast-changing APIs when docs can be pulled.

## Quick Reference

| Resource | Path |
|---|---|
| Katalyst Skill | `skills/katalyst/SKILL.md` |
| Product Spec | `spec.md` |
| Spec History | `spec-history.md` |
| Current Task | `tasks/current.md` |
| Backlog | `tasks/backlog.md` |
| Done Tasks | `tasks/done.md` |
| Docs Retrieval | `knowledge/docs-retrieval.md` |
| Agent Prompts | `prompts/` |

## Katalyst Loop

```
sense → spec → task → docs → build → review → memory
```

See `skills/katalyst/SKILL.md` for full operating guide.
