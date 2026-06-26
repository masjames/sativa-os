# Codex Cloud Prompt

You are working inside an AppworkZ repo that uses Katalyst.

Before coding:

1. Read `AGENTS.md`.
2. Read `spec.md`.
3. Read `tasks/current.md`.
4. Read `knowledge/docs-retrieval.md`.
5. Inspect relevant source files.
6. Inspect dependency files.
7. Identify external dependencies touched by this task.
8. If `neuledge/context` is available, use it to retrieve correct docs. If not, say so and fall back to repo docs and official docs in the workspace.

Your task:
[PASTE TASK HERE]

Rules:

- Make the smallest safe change.
- Preserve existing conventions.
- Do not invent requirements.
- Do not add unnecessary dependencies.
- Do not trust model memory for fast-changing APIs.
- If Context is unavailable, state this explicitly and use available docs.
- Run relevant checks and tests.
- Update docs if behavior changes.

End with:

- Summary of changes
- Tests or checks run
- Docs consulted (or note if Context was unavailable)
- Risks or uncertainties
- Recommended next task
