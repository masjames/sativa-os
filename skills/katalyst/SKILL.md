---
name: AppworkZ Katalyst
description: >
  Builder OS Skill — turns messy software ideas into shippable product work
  using AI agents. Repo-native development operating layer for AppworkZ.
---

# AppworkZ Katalyst

> Katalyst exists to reduce cognitive load while increasing shipping quality.

## Identity

| Field | Value |
|---|---|
| Name | AppworkZ Katalyst |
| Type | Builder OS Skill |
| Purpose | Turn messy software ideas into shippable product work using AI agents |
| Owner | AppworkZ / Adit |
| Primary users | AI coding agents and Adit |

Katalyst is the development operating layer.

In the AppworkZ universe:

- **Sativa OS** decides what matters.
- **Buubo** helps Adit execute.
- **Katalyst** builds software.
- **AppworkZ** delivers products and client solutions.

Katalyst is not a dashboard, SaaS app, task manager, or productivity app. It is the CTO brain in repo form.

---

## When to Use This Skill

Use Katalyst when:

- Starting a new software product
- Entering an unfamiliar repo
- Converting an idea into a spec
- Turning a spec into implementation tasks
- Generating prompts for Codex, Codex Cloud, Antigravity, or other agents
- Retrieving correct docs for frameworks/libraries before coding
- Reviewing an AI-generated implementation
- Updating repo memory after work
- Deciding what documentation must exist
- Preventing scope creep
- Preparing a repo for repeatable AI development

---

## When NOT to Use This Skill

Do not use Katalyst for:

- General life planning
- Personal journaling
- Emotional support
- Unrelated business strategy
- Building a dashboard before the repo operating layer exists
- Replacing product judgment
- Adding process for its own sake

> Katalyst is not a productivity app. It is the development operating layer.

---

## Core Philosophy

1. Current state beats history.
2. Small specs beat giant PRDs.
3. Working software beats perfect documentation.
4. Repo memory beats chat memory.
5. Correct docs beat model memory.
6. Clear next tasks beat massive roadmaps.
7. AI agents need constraints, not vibes.
8. Every coding session should leave the repo easier for the next agent.
9. Do not make Adit hold the system in his head.

> If the system creates more cognitive load than it removes, simplify it.

---

## Standard Katalyst Repo Structure

```
/
├── README.md
├── AGENTS.md
├── spec.md
├── spec-history.md
├── knowledge/
│   ├── architecture.md
│   ├── frontend.md
│   ├── backend.md
│   ├── database.md
│   ├── deployment.md
│   ├── decisions.md
│   └── docs-retrieval.md
├── tasks/
│   ├── current.md
│   ├── backlog.md
│   └── done.md
├── prompts/
│   ├── codex.md
│   ├── codex-cloud.md
│   ├── antigravity.md
│   └── review.md
└── skills/
    └── katalyst/
        └── SKILL.md
```

**Rules:**

- Do not create every file if it would be empty noise.
- Create only what is useful now.
- Prefer fewer files with clear ownership.

---

## Operating Modes

### 1. Sense Mode

**When:** Idea is messy.

**Goal:** Turn messy input into clear product understanding.

**Output:**

- Problem
- User
- Desired outcome
- Constraints
- Non-goals
- First shippable slice

---

### 2. Spec Mode

**When:** Product direction is known.

**Goal:** Create or update `spec.md`.

**Output:**

- Compact spec
- Open questions
- Implementation implications
- Docs retrieval implications

---

### 3. Task Mode

**When:** Before coding.

**Goal:** Turn spec into one clear AI-agent task.

**Output:**

- Task objective
- File targets
- External dependencies touched
- Context docs to retrieve
- Acceptance criteria
- Test plan
- Docs to update

---

### 4. Docs Mode

**When:** Before coding when libraries/frameworks/tools are involved.

**Goal:** Retrieve correct, current, version-specific docs before implementation.

**Process:**

1. Inspect dependency files.
2. Identify package names and versions.
3. Check whether Context is available.
4. Use Context to browse/install/query relevant docs.
5. If needed, add docs from official repo, website, llms.txt, or local docs.
6. Extract only what is needed for the active task.
7. Record docs used in the final summary.

**Rules:**

- Prefer Context docs over model memory.
- Prefer version-specific docs over generic docs.
- Do not over-research.
- Do not pull huge docs unrelated to the current task.
- If docs are missing, say so.

---

### 5. Build Mode

**When:** During coding.

**Goal:** Implement the task with minimal scope drift.

**Rules:**

- Inspect before editing.
- Retrieve docs before touching external APIs.
- Preserve existing conventions.
- Avoid broad rewrites.
- Prefer simple changes.
- Test what you touch.

---

### 6. Review Mode

**When:** After coding.

**Goal:** Check whether implementation matches the task.

**Checklist:**

- [ ] Does it satisfy acceptance criteria?
- [ ] Did it use correct docs for external dependencies?
- [ ] Did it introduce unnecessary complexity?
- [ ] Did it break existing behavior?
- [ ] Are tests updated or run?
- [ ] Are docs updated if behavior changed?
- [ ] Are remaining risks documented?

---

### 7. Memory Mode

**When:** End of session.

**Goal:** Leave the repo easier for the next agent.

**Update:**

- `spec.md` if current behavior changed
- `spec-history.md` if a decision changed
- `knowledge/` if deep technical detail changed
- `knowledge/docs-retrieval.md` if doc sources changed
- `tasks/done.md` if task completed
- `tasks/current.md` if next task is obvious

---

## Katalyst Agent Loop

Every AI agent entering a Katalyst repo follows this loop:

1. Read `AGENTS.md`.
2. Read `spec.md`.
3. Read relevant `knowledge/` files.
4. Read `tasks/current.md` if it exists.
5. Inspect dependency files.
6. Identify external packages touched by the task.
7. Use Context to retrieve correct docs where needed.
8. Inspect code before editing.
9. Restate understanding briefly.
10. Implement the smallest safe change.
11. Run checks/tests where possible.
12. Update docs/memory.
13. Summarize: changes, tests, docs used, risks, next task.

---

## Documentation Retrieval Protocol

Katalyst uses **neuledge/context** as its docs retrieval engine.

Repository: https://github.com/neuledge/context

### Why

AI coding agents often rely on stale training data. That causes wrong imports, outdated APIs, old framework patterns, hallucinated config, and broken code.

> Do not trust model memory for library APIs when docs can be pulled.

### Before Coding

If the task touches any external dependency, framework, SDK, CLI, database client, styling system, deployment provider, auth library, testing framework, or AI SDK, the agent must:

1. Inspect the repo dependency files.
2. Identify relevant package names and versions.
3. Use Context to browse/install/query the matching docs if available.
4. Prefer version-specific docs over generic memory.
5. Use official docs or Context-backed docs before making implementation decisions.
6. Mention which docs were used in the final summary.
7. If docs are unavailable, clearly state the uncertainty and avoid pretending.

### Dependency Files to Inspect

```
package.json          pnpm-lock.yaml       package-lock.json
yarn.lock             bun.lockb            requirements.txt
pyproject.toml        poetry.lock          Cargo.toml
go.mod                Gemfile              composer.json
Dockerfile            docker-compose.yml   wrangler.toml
vercel.json           netlify.toml         supabase/config.toml
firebase.json
```

### Context Setup

**Install:**

```bash
npm install -g @neuledge/context
```

**OpenAI Codex local:**

```bash
codex mcp add context -- context serve
```

Or via Codex config:

```toml
[mcp_servers.context]
command = "context"
args = ["serve"]
```

**Other MCP-compatible agents:**

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

**Manual CLI fallback:**

```bash
context browse <package>
context install <registry/name>
context add <source>
```

**Examples:**

```bash
context browse next
context install npm/next
context install npm/react
context install npm/tailwindcss
context add https://github.com/vercel/next.js/tree/v16.0.0
context add ./docs --name appworkz-internal-docs --pkg-version 1.0.0
```

### Context Usage Rules

- If the agent touches Next.js, React, Tailwind, AI SDK, OpenAI SDK, Anthropic SDK, Drizzle, Prisma, Firebase, Supabase, Cloudflare, Vercel, testing tools, or any fast-changing dependency, it must retrieve docs first.
- If the package version is known, prefer version-specific docs.
- If Context has no package, use `context add` for official docs, repo docs, llms.txt, or local docs when practical.
- If Context is unavailable in the current environment, the agent must say so and fall back to repo docs and official documentation available in the workspace.
- Never make confident claims about fast-changing APIs without docs.

### Docs Summary Format

Every session should end with:

```
Docs consulted:
- Context package / source:
- Version:
- Key docs used:
- Any doc gaps:
```

If Context was unavailable:

```
Docs consulted:
- Context unavailable in this environment.
- Fallback used:
- Remaining uncertainty:
```

> Pull the smallest correct docs needed for the current task.

---

## spec.md Rules

`spec.md` is the single source of truth.

It should contain:

- Product objective
- Current scope
- Current features
- Non-goals
- User flows
- Architecture summary
- Data model summary
- API summary
- Important business rules
- Coding conventions
- Deployment assumptions
- Docs retrieval assumptions
- Links to detailed knowledge files
- Current known constraints

**Rules:**

- `spec.md` represents the current state, not the full history.
- Keep it short. Ideally under 500 lines.
- Never let it become a graveyard.
- Move details to `knowledge/` when needed.
- If implementation changes the product, update `spec.md`.

---

## spec-history.md Rules

`spec-history.md` is the change log of product understanding.

It should contain:

- Dated decision notes
- Major pivots
- Discarded assumptions
- Architecture decisions
- Product naming changes
- Important tradeoffs
- Docs retrieval decisions when relevant

**Rules:**

- Do not duplicate all of `spec.md`.
- Record why important changes happened.
- Use dates.
- Keep entries concise.

---

## knowledge/ Rules

Knowledge files are deep supporting context.

Examples: `architecture.md`, `auth.md`, `database.md`, `frontend.md`, `backend.md`, `deployment.md`, `ai-agents.md`, `docs-retrieval.md`, `product-positioning.md`

**Rules:**

- Use `knowledge/` for details too large for `spec.md`.
- Each file should have one clear domain.
- Add a "Last updated" date.
- Link back to `spec.md` when relevant.

---

## tasks/ Rules

```
tasks/current.md  = the active implementation task
tasks/backlog.md  = known but not active work
tasks/done.md     = completed task notes
```

**Task structure:**

- Objective
- Context
- Files likely involved
- External dependencies involved
- Docs that must be checked through Context
- Acceptance criteria
- Constraints
- Test instructions
- Documentation updates required

**Rules:**

- Katalyst should not become a full project management app.
- Tasks should be small enough for one AI coding session.

---

## prompts/ Rules

Reusable prompts for different agents:

```
prompts/codex.md
prompts/codex-cloud.md
prompts/antigravity.md
prompts/review.md
```

Each prompt should:

- Tell the agent to inspect repo first
- Read `spec.md` and `AGENTS.md`
- Identify relevant files
- Identify external packages touched
- Use neuledge/context to retrieve correct docs before coding
- Make the smallest safe change
- Run tests if available
- Update docs if behavior changes
- End with summary, tests, docs consulted, risks, and next suggested task

---

## Anti-Bloat Rules

- Do not create a dashboard unless explicitly requested.
- Do not add frameworks just to look professional.
- Do not create five files when one file is enough.
- Do not write huge PRDs.
- Do not add process that slows down shipping.
- Do not add generic enterprise ceremony.
- Do not invent fake requirements.
- Do not build for imaginary scale.
- Do not turn Katalyst into Jira.
- Do not turn Katalyst into Notion.
- Do not turn Katalyst into a second brain.
- Do not turn Context into a custom documentation product.

> The best Katalyst output is often one clear spec, one correct docs lookup, one clear task, and one correct implementation.

---

## Adit-Specific Design Constraints

**Context:** Adit has many ideas, many projects, and high context switching. The system must reduce mental load.

**Rules:**

- Prefer short operating docs.
- Prefer bold summaries.
- Prefer clear next action.
- Prefer one active task.
- Prefer repo memory over chat memory.
- Prefer correct external docs over model memory.
- Always reduce what Adit has to remember.

---

## Product Examples

Katalyst may support building:

- **Buubo** — personal execution system
- **zippp.link** — WhatsApp-first one-page sales page builder
- **F&B OS** — WhatsApp-first business OS for food and beverage teams
- Internal AppworkZ tools
- Client apps

Katalyst is not these products. Katalyst is the builder system for these products.

---

## Templates

### Product Spec Template

```markdown
# Product Spec

## Product Objective

## Current Scope

## Primary User

## Core Use Case

## Current Features

## Non-Goals

## User Flow

## Architecture Summary

## Data Model Summary

## API Summary

## Business Rules

## Technical Decisions

## Docs Retrieval

### External Dependencies

### Required Context Packages

### Official Docs Sources

### Known Doc Gaps

## Known Constraints

## Links to Knowledge Files

## Current Next Task
```

### Task Template

```markdown
# Current Task

## Objective

## Context

## Files Likely Involved

## External Dependencies Touched

## Docs to Retrieve with Context

## Constraints

## Acceptance Criteria

## Test Plan

## Documentation Updates Required

## Definition of Done
```

### Agent Prompt Template

```markdown
You are working inside an AppworkZ repo that uses Katalyst.

Before coding:
1. Read AGENTS.md.
2. Read spec.md.
3. Read tasks/current.md.
4. Inspect relevant files.
5. Inspect dependency files.
6. Identify external dependencies touched by this task.
7. Use neuledge/context to retrieve correct docs where needed.

Your task:
[PASTE TASK HERE]

Rules:
- Make the smallest safe change.
- Preserve existing conventions.
- Do not invent requirements.
- Do not add unnecessary dependencies.
- Do not trust model memory for fast-changing APIs.
- Use Context or official docs before touching external APIs.
- Run relevant checks.
- Update docs if behavior changes.
- End with summary, tests, docs consulted, risks, and next suggested task.
```

### Review Template

```markdown
# Review

## What changed?

## Does it match the task?

## Acceptance criteria result

## Docs consulted

## External API / library correctness

## Tests run

## Risks

## Unnecessary complexity found

## Docs updated?

## Recommended next task
```

### Docs Retrieval Template

```markdown
# Docs Retrieval Notes

## Task

## External dependencies touched

## Detected versions

## Context packages used

## Official docs used

## Key findings

## API/patterns confirmed

## Gaps or uncertainty

## Follow-up docs to add
```

---

## Invocation Examples

**Sense Mode:**
> Use Katalyst Sense Mode on this idea: "I want to make a landing page builder for WhatsApp sellers."

**Spec Mode:**
> Use Katalyst Spec Mode: Update spec.md based on this product decision.

**Task Mode:**
> Use Katalyst Task Mode: Turn this feature into one Codex-ready implementation task.

**Docs Mode:**
> Use Katalyst Docs Mode: Inspect this repo's dependencies and use Context to retrieve the correct docs for the packages touched by the task.

**Build Mode:**
> Use Katalyst Build Mode: Implement tasks/current.md using the correct version-specific docs through Context.

**Review Mode:**
> Use Katalyst Review Mode: Review the last diff against tasks/current.md and verify external API usage against Context docs.

**Memory Mode:**
> Use Katalyst Memory Mode: Update repo memory after this implementation.

---

## Completion Behavior

At the end of every Katalyst session, report:

- Changed files
- What was accomplished
- Docs consulted through Context
- Tests or checks run
- Docs updated
- Risks or uncertainties
- Recommended next task
