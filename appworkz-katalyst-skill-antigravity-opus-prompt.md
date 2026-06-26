# AppworkZ Katalyst Skill — Antigravity Opus Build Prompt

**Owner:** AppworkZ / Adit  
**Target agent:** Antigravity with Opus  
**Purpose:** Create the first strong version of **AppworkZ’s Katalyst Skill** as a repo-native AI development operating layer.  
**Special requirement:** Katalyst must use [`neuledge/context`](https://github.com/neuledge/context) so AI agents pull the correct, current, version-specific docs before coding.

---

# Copy-Paste Prompt for Antigravity + Opus

You are Opus inside Antigravity. I want you to cook deeply.

Your mission is to create **AppworkZ’s Katalyst Skill**.

This is not a normal feature task. This is a meta-system task.

You are building the reusable development operating skill that will help AppworkZ build software products faster, cleaner, and with less cognitive chaos across ChatGPT Codex, ChatGPT Codex Cloud, Antigravity, and future AI coding agents.

Think of this as creating the **builder brain** for AppworkZ.

---

## 0. First, understand the concept

### What is Katalyst?

**Katalyst is AppworkZ’s Builder OS.**

It is the system that turns messy ideas into shippable software using AI coding agents.

It is not a dashboard.  
It is not a SaaS app.  
It is not a task manager.  
It is not a personal productivity app.  
It is not Buubo.  
It is not Sativa OS.

Katalyst is the development operating layer.

In the broader AppworkZ universe:

```text
Sativa OS decides what matters.
Buubo helps Adit execute.
Katalyst builds software.
AppworkZ delivers products and client solutions.
```

Katalyst’s job is:

```text
messy idea
→ clear product intent
→ clear spec
→ clear architecture
→ clear agent task
→ correct documentation retrieval
→ clear coding prompt
→ implementation
→ review
→ update documentation
→ ship
```

The simplest definition:

> Katalyst is the CTO brain in repo form.

The better definition:

> Katalyst is AppworkZ’s internal development OS that lets Adit and AI agents repeatedly transform messy product ideas into production-ready software.

---

## 1. The actual task

Create a reusable **Katalyst Skill** inside this repository.

The skill must be useful for:

1. ChatGPT Codex local
2. ChatGPT Codex Cloud
3. Antigravity
4. Claude / Opus coding sessions
5. Gemini CLI or other future AI agents
6. Adit manually reading and operating the repo

This skill should make it easy for any AI agent to enter a software repo, understand the current product state, pull the correct docs, decide what to do next, implement correctly, and update the development memory.

---

## 2. Very important principle

Do not overbuild.

The first version of Katalyst should be boring but powerful.

No web app.  
No dashboard.  
No database.  
No auth.  
No pretty UI.  
No project management SaaS.  
No Kanban clone.  
No Linear clone.  
No Notion clone.

The correct first version is:

```text
Markdown files
Repo conventions
Reusable prompts
Agent instructions
Spec structure
Task structure
Review checklist
Coding standards
Documentation retrieval protocol
Documentation update loop
Shipping loop
```

This is a skill, not a product.

Make it portable and immediately usable.

---

## 3. Mandatory documentation layer: neuledge/context

Katalyst must use **neuledge/context** as its preferred documentation-retrieval layer.

Repository:

```text
https://github.com/neuledge/context
```

### Why Katalyst needs Context

AI coding agents often rely on stale training data. That causes wrong imports, outdated APIs, old framework patterns, hallucinated config, and broken code.

Katalyst must prevent this.

Katalyst should require AI agents to pull the correct docs before touching framework, library, database, deployment, or SDK code.

The principle:

> Do not trust model memory for library APIs when docs can be pulled.

### What Context is for Katalyst

Context should be treated as:

```text
Katalyst’s docs retrieval engine
```

It should help agents:

```text
- detect the tech stack from package files and repo structure
- identify which libraries/frameworks are involved in the task
- pull version-specific docs
- query docs locally
- avoid stale API usage
- avoid hallucinated imports
- verify implementation patterns before coding
```

### How Katalyst should use Context

Add a dedicated section inside the Katalyst Skill called:

```text
Documentation Retrieval Protocol
```

That protocol must say:

Before coding, if the task touches any external dependency, framework, SDK, CLI, database client, styling system, deployment provider, auth library, testing framework, or AI SDK, the agent must:

1. Inspect the repo dependency files.
2. Identify relevant package names and versions.
3. Use Context to browse/install/query the matching docs if available.
4. Prefer version-specific docs over generic memory.
5. Use official docs or Context-backed docs before making implementation decisions.
6. Mention which docs were used in the final summary.
7. If docs are unavailable, clearly state the uncertainty and avoid pretending.

### Dependency files to inspect

The agent should inspect relevant files such as:

```text
package.json
pnpm-lock.yaml
package-lock.json
yarn.lock
bun.lockb
requirements.txt
pyproject.toml
poetry.lock
Cargo.toml
go.mod
Gemfile
composer.json
Dockerfile
docker-compose.yml
wrangler.toml
vercel.json
netlify.toml
supabase/config.toml
firebase.json
```

Use judgment based on the repo.

### Context setup commands

Add these starter commands to the Katalyst Skill or its setup guide:

```bash
npm install -g @neuledge/context
```

For OpenAI Codex local:

```bash
codex mcp add context -- context serve
```

Or via Codex config:

```toml
[mcp_servers.context]
command = "context"
args = ["serve"]
```

For other MCP-compatible agents:

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

For manual CLI fallback:

```bash
context browse <package>
context install <registry/name>
context add <source>
```

Examples:

```bash
context browse next
context install npm/next
context install npm/react
context install npm/tailwindcss
context add https://github.com/vercel/next.js/tree/v16.0.0
context add ./docs --name appworkz-internal-docs --pkg-version 1.0.0
```

### Context usage rules

Add these rules:

```text
- If the agent touches Next.js, React, Tailwind, AI SDK, OpenAI SDK, Anthropic SDK, Drizzle, Prisma, Firebase, Supabase, Cloudflare, Vercel, testing tools, or any fast-changing dependency, it must retrieve docs first.
- If the package version is known, prefer version-specific docs.
- If Context has no package, use `context add` for official docs, repo docs, llms.txt, or local docs when practical.
- If Context is unavailable in the current environment, the agent must say so and fall back to repo docs and official documentation available in the workspace.
- Never make confident claims about fast-changing APIs without docs.
```

### Context in Katalyst final summaries

Every Katalyst Build Mode or Review Mode session should end with:

```text
Docs consulted:
- Context package / source:
- Version:
- Key docs used:
- Any doc gaps:
```

If Context was unavailable:

```text
Docs consulted:
- Context unavailable in this environment.
- Fallback used:
- Remaining uncertainty:
```

### Context should not become bloat

Do not build a custom docs system.

Do not create a docs dashboard.

Do not mirror the whole internet.

Use Context as the docs engine, not as a product.

The Katalyst rule:

> Pull the smallest correct docs needed for the current task.

---

## 4. Desired outcome

After your work, this repo should contain a clear **Katalyst Skill** that an AI agent can invoke or follow.

The skill should answer:

1. What is Katalyst?
2. When should an AI agent use this skill?
3. How should the AI agent inspect a repo?
4. How should the AI agent pull the correct docs?
5. How should the AI agent create or update the product spec?
6. How should the AI agent break work into tasks?
7. How should the AI agent write implementation prompts?
8. How should the AI agent review its own work?
9. How should the AI agent update repo memory after changes?
10. How should the AI agent avoid bloating the project?
11. How should Adit use Katalyst across Codex, Codex Cloud, and Antigravity?

---

## 5. Please inspect the repo first

Before writing files, inspect the current repository structure.

Look for existing files such as:

```text
README.md
AGENTS.md
CLAUDE.md
spec.md
spec-history.md
docs/
knowledge/
prompts/
tasks/
skills/
.agent/
.antigravity/
.codex/
```

Do not blindly duplicate existing systems.

If the repo already has a convention, integrate with it.

If there is no convention, create a clean minimal one.

Prefer compatibility with common AI-agent conventions:

```text
AGENTS.md
skills/katalyst/SKILL.md
spec.md
spec-history.md
knowledge/
prompts/
tasks/
```

But use your judgment after inspecting the repo.

---

## 6. The core file to create

Create the main skill file here if suitable:

```text
skills/katalyst/SKILL.md
```

If this repo has another skill convention, use that convention instead, but keep the skill name clearly visible as:

```text
AppworkZ Katalyst
```

The skill file should be long enough to be genuinely useful, but not bloated.

It should be written for AI agents first and humans second.

Use direct operational language.

Avoid fluffy startup language.

Avoid vague words like “synergy”, “innovation”, “empower”, unless truly needed.

---

## 7. The Katalyst Skill should include these sections

### A. Identity

Explain:

```text
Name: AppworkZ Katalyst
Type: Builder OS Skill
Purpose: Turn messy software ideas into shippable product work using AI agents.
Owner: AppworkZ / Adit
Primary users: AI coding agents and Adit
```

Include this sentence:

> Katalyst exists to reduce cognitive load while increasing shipping quality.

---

### B. When to use this skill

The agent should use Katalyst when:

```text
- starting a new software product
- entering an unfamiliar repo
- converting an idea into a spec
- turning a spec into implementation tasks
- generating prompts for Codex, Codex Cloud, Antigravity, or other agents
- retrieving correct docs for frameworks/libraries before coding
- reviewing an AI-generated implementation
- updating repo memory after work
- deciding what documentation must exist
- preventing scope creep
- preparing a repo for repeatable AI development
```

---

### C. When not to use this skill

The agent should not use Katalyst for:

```text
- general life planning
- personal journaling
- emotional support
- unrelated business strategy
- building a dashboard before the repo operating layer exists
- replacing product judgment
- adding process for its own sake
```

Make it clear:

> Katalyst is not a productivity app. It is the development operating layer.

---

### D. Core philosophy

Include the operating philosophy:

```text
1. Current state beats history.
2. Small specs beat giant PRDs.
3. Working software beats perfect documentation.
4. Repo memory beats chat memory.
5. Correct docs beat model memory.
6. Clear next tasks beat massive roadmaps.
7. AI agents need constraints, not vibes.
8. Every coding session should leave the repo easier for the next agent.
9. Do not make Adit hold the system in his head.
```

Add this principle:

> If the system creates more cognitive load than it removes, simplify it.

---

### E. Standard Katalyst repo structure

Define the recommended structure:

```text
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

But also explain:

```text
Do not create every file if it would be empty noise.
Create only what is useful now.
Prefer fewer files with clear ownership.
```

---

### F. spec.md rules

Define `spec.md` as the single source of truth.

It should contain:

```text
- product objective
- current scope
- current features
- non-goals
- user flows
- architecture summary
- data model summary
- API summary
- important business rules
- coding conventions
- deployment assumptions
- docs retrieval assumptions
- links to detailed knowledge files
- current known constraints
```

Rules:

```text
- spec.md represents the current state, not the full history.
- Keep it short.
- Ideally under 500 lines.
- Never let it become a graveyard.
- Move details to knowledge/ when needed.
- If implementation changes the product, update spec.md.
```

---

### G. spec-history.md rules

Define `spec-history.md` as the change log of product understanding.

It should contain:

```text
- dated decision notes
- major pivots
- discarded assumptions
- architecture decisions
- product naming changes
- important tradeoffs
- docs retrieval decisions when relevant
```

Rules:

```text
- Do not duplicate all of spec.md.
- Record why important changes happened.
- Use dates.
- Keep entries concise.
```

---

### H. knowledge/ rules

Define knowledge files as deep supporting context.

Examples:

```text
knowledge/architecture.md
knowledge/auth.md
knowledge/database.md
knowledge/frontend.md
knowledge/backend.md
knowledge/deployment.md
knowledge/ai-agents.md
knowledge/docs-retrieval.md
knowledge/product-positioning.md
```

Rules:

```text
- Use knowledge/ for details too large for spec.md.
- Each file should have one clear domain.
- Add a “Last updated” date.
- Link back to spec.md when relevant.
```

For docs retrieval, create or update:

```text
knowledge/docs-retrieval.md
```

It should explain:

```text
- how this repo uses neuledge/context
- which packages/docs are commonly needed
- which official docs sources matter
- where internal docs are located
- known doc gaps
- what to do when Context is unavailable
```

---

### I. tasks/ rules

Define tasks:

```text
tasks/current.md = the active implementation task
tasks/backlog.md = known but not active work
tasks/done.md = completed task notes
```

Important:

```text
Katalyst should not become a full project management app.
Tasks should be small enough for one AI coding session.
Each task should include:
- objective
- context
- files likely involved
- external dependencies involved
- docs that must be checked through Context
- acceptance criteria
- constraints
- test instructions
- documentation updates required
```

---

### J. prompts/ rules

Define reusable prompts for different agents.

The skill should include or generate templates for:

```text
prompts/codex.md
prompts/codex-cloud.md
prompts/antigravity.md
prompts/review.md
```

Each prompt should:

```text
- tell the agent to inspect repo first
- read spec.md and AGENTS.md
- identify relevant files
- identify external packages touched
- use neuledge/context to retrieve correct docs before coding
- make the smallest safe change
- run tests if available
- update docs if behavior changes
- summarize what changed
- mention uncertainties
```

---

## 8. Katalyst operating modes

Add these modes:

### 1. Sense Mode

Used when idea is messy.

Goal:

```text
Turn messy input into a clear product understanding.
```

Output:

```text
- problem
- user
- desired outcome
- constraints
- non-goals
- first shippable slice
```

---

### 2. Spec Mode

Used when product direction is known.

Goal:

```text
Create or update spec.md.
```

Output:

```text
- compact spec
- open questions
- implementation implications
- docs retrieval implications
```

---

### 3. Task Mode

Used before coding.

Goal:

```text
Turn spec into one clear AI-agent task.
```

Output:

```text
- task objective
- file targets
- external dependencies touched
- Context docs to retrieve
- acceptance criteria
- test plan
- docs to update
```

---

### 4. Docs Mode

Used before coding when libraries/frameworks/tools are involved.

Goal:

```text
Retrieve correct, current, version-specific docs before implementation.
```

Process:

```text
1. Inspect dependency files.
2. Identify package names and versions.
3. Check whether Context is available.
4. Use Context to browse/install/query relevant docs.
5. If needed, add docs from official repo, website, llms.txt, or local docs.
6. Extract only what is needed for the active task.
7. Record docs used in the final summary.
```

Rules:

```text
- Prefer Context docs over model memory.
- Prefer version-specific docs over generic docs.
- Do not over-research.
- Do not pull huge docs unrelated to the current task.
- If docs are missing, say so.
```

---

### 5. Build Mode

Used during coding.

Goal:

```text
Implement the task with minimal scope drift.
```

Rules:

```text
- inspect before editing
- retrieve docs before touching external APIs
- preserve existing conventions
- avoid broad rewrites
- prefer simple changes
- test what you touch
```

---

### 6. Review Mode

Used after coding.

Goal:

```text
Check whether implementation matches the task.
```

Checklist:

```text
- Does it satisfy acceptance criteria?
- Did it use correct docs for external dependencies?
- Did it introduce unnecessary complexity?
- Did it break existing behavior?
- Are tests updated or run?
- Are docs updated if behavior changed?
- Are remaining risks documented?
```

---

### 7. Memory Mode

Used at the end of a session.

Goal:

```text
Leave the repo easier for the next agent.
```

Update:

```text
- spec.md if current behavior changed
- spec-history.md if a decision changed
- knowledge/ if deep technical detail changed
- knowledge/docs-retrieval.md if doc sources changed
- tasks/done.md if task completed
- tasks/current.md if next task is obvious
```

---

## 9. Agent loop

Define the standard Katalyst agent loop:

```text
1. Read AGENTS.md.
2. Read spec.md.
3. Read relevant knowledge files.
4. Read tasks/current.md if it exists.
5. Inspect dependency files.
6. Identify external packages touched by the task.
7. Use Context to retrieve correct docs where needed.
8. Inspect code before editing.
9. Restate understanding briefly.
10. Implement the smallest safe change.
11. Run checks/tests where possible.
12. Update docs/memory.
13. Summarize changes, tests, docs used, risks, and next task.
```

Make this loop very explicit.

---

## 10. Anti-bloat rules

This is very important for Adit.

Add strict anti-bloat rules:

```text
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
```

Add this:

> The best Katalyst output is often one clear spec, one correct docs lookup, one clear task, and one correct implementation.

---

## 11. Adit-specific design constraints

Add a section for Adit’s working style.

Context:

```text
Adit has many ideas, many projects, and high context switching.
The system must reduce mental load.
The system should not require Adit to read long walls before doing work.
The system should help AI agents maintain continuity across sessions.
The system should support fast shipping with high clarity.
```

Rules:

```text
- Prefer short operating docs.
- Prefer bold summaries.
- Prefer clear next action.
- Prefer one active task.
- Prefer repo memory over chat memory.
- Prefer correct external docs over model memory.
- Always reduce what Adit has to remember.
```

---

## 12. Product examples

Include examples of products Katalyst may support:

```text
- Buubo: personal execution system
- zippp.link: WhatsApp-first one-page sales page builder
- F&B OS: WhatsApp-first business OS for food and beverage teams
- internal AppworkZ tools
- client apps
```

But make clear:

```text
Katalyst is not these products.
Katalyst is the builder system for these products.
```

---

## 13. Starter templates

Create starter templates either inside the SKILL.md or as separate files if appropriate.

Templates needed:

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

---

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

---

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

---

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

---

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

## 14. Skill invocation examples

Add practical examples like:

```text
Use Katalyst Sense Mode on this idea:
“I want to make a landing page builder for WhatsApp sellers.”

Use Katalyst Spec Mode:
“Update spec.md based on this product decision.”

Use Katalyst Task Mode:
“Turn this feature into one Codex-ready implementation task.”

Use Katalyst Docs Mode:
“Inspect this repo’s dependencies and use Context to retrieve the correct docs for the packages touched by the task.”

Use Katalyst Build Mode:
“Implement tasks/current.md using the correct version-specific docs through Context.”

Use Katalyst Review Mode:
“Review the last diff against tasks/current.md and verify external API usage against Context docs.”

Use Katalyst Memory Mode:
“Update repo memory after this implementation.”
```

---

## 15. Completion behavior

At the end of every Katalyst session, specify that the agent should report:

```text
- changed files
- what was accomplished
- docs consulted through Context
- tests or checks run
- docs updated
- risks or uncertainties
- recommended next task
```

---

## 16. Also create AGENTS.md integration if appropriate

If AGENTS.md exists, update it to mention Katalyst briefly.

If AGENTS.md does not exist, create one.

It should say something like:

```markdown
# Agent Instructions

This repo uses AppworkZ Katalyst.

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
```

Keep AGENTS.md short.

Do not dump the entire skill into AGENTS.md.

AGENTS.md should be the entry point.  
Katalyst SKILL.md should be the deeper operating guide.

---

## 17. Also create starter files only if useful

If this repo does not already have them, create minimal useful versions of:

```text
spec.md
spec-history.md
tasks/current.md
tasks/backlog.md
tasks/done.md
knowledge/docs-retrieval.md
prompts/antigravity.md
prompts/codex.md
prompts/codex-cloud.md
prompts/review.md
```

But do not create empty ceremonial files.

If a file is created, it must contain useful starter content.

For example:

```markdown
# Current Task

No active implementation task yet.

Use Katalyst Task Mode to define one clear task before coding.
```

That is acceptable.

A completely empty file is not acceptable.

---

## 18. Critical quality bar

Do not give me a shallow generic skill.

This must feel like it was designed specifically for AppworkZ and Adit.

It should capture the real operating need:

```text
Adit has many ideas.
AI agents lose context between sessions.
Repos become messy.
Specs drift.
Coding prompts become vague.
Products get overbuilt.
Agents use outdated docs.
Katalyst prevents that.
```

The skill must help create this behavior:

```text
Every AppworkZ repo becomes easier to understand, easier to modify, easier to hand to AI agents, easier to verify against correct docs, and easier to ship.
```

---

## 19. Writing style

Use:

```text
clear headings
short paragraphs
operational instructions
concrete checklists
copy-pasteable templates
simple language
no fluff
no fake enterprise language
```

Avoid:

```text
long theory
motivational filler
generic agile language
corporate jargon
overcomplicated process
```

This is for a founder who wants leverage, speed, clarity, and low cognitive load.

---

## 20. Implementation instructions

Please do the following:

1. Inspect the repo.
2. Identify existing documentation conventions.
3. Create or update the Katalyst skill files.
4. Integrate it with AGENTS.md.
5. Add the neuledge/context documentation retrieval protocol.
6. Add minimal starter templates if they do not already exist.
7. Avoid duplicate or conflicting instructions.
8. Keep the system simple but powerful.
9. After editing, provide a summary.

Your final response should include:

```text
- Files created
- Files updated
- What Katalyst now enables
- How Katalyst uses neuledge/context
- How Adit should use it with Antigravity
- How Adit should use it with Codex / Codex Cloud
- Any assumptions you made
- Recommended next improvement
```

---

## 21. Important non-negotiables

Do not build a UI.

Do not create a web app.

Do not create a database.

Do not install dependencies unless absolutely necessary.

Do not create an elaborate project management system.

Do not create long empty folders.

Do not turn this into a product.

Do not build a custom docs search system when neuledge/context already exists.

This task is only to create the **AppworkZ Katalyst Skill** as a repo-native AI development operating layer, with **neuledge/context** as the preferred docs retrieval engine.

---

## 22. Final mental model

Katalyst is successful if, after this task, I can open any AppworkZ repo and say to an AI agent:

```text
Use Katalyst.
Understand this repo.
Clarify the current product state.
Pull the correct docs.
Create one clean task.
Implement it.
Review it.
Update memory.
Tell me what changed.
```

And the AI agent knows exactly what to do.

Now inspect the repo and implement the first strong version of **AppworkZ’s Katalyst Skill**.

---

# Follow-up Prompt After Antigravity Finishes

Paste this after Antigravity finishes the first implementation:

```markdown
Now run Katalyst Review Mode on your own changes.

Check whether the skill is too bloated, too vague, or missing anything that would help Codex, Codex Cloud, Antigravity, and other AI coding agents operate better.

Specifically verify:

1. Is Katalyst clearly separated from Sativa OS and Buubo?
2. Is the repo structure useful but not ceremonial?
3. Is AGENTS.md short and actionable?
4. Does the skill include a clear Docs Mode?
5. Does it require neuledge/context before touching fast-changing dependencies?
6. Does it tell agents how to report docs consulted?
7. Does it avoid turning Katalyst into Jira, Notion, or a dashboard?
8. Does it reduce Adit’s cognitive load?
9. Can Codex local and Codex Cloud use it easily?
10. Can Antigravity use it easily?

Then simplify or improve it.

End with:

- What you changed
- What you removed
- What docs retrieval behavior now exists
- Remaining risks
- Best next improvement
```

---

# Ultra-Short Command Version

Use this when you do not want to paste the full prompt:

```markdown
Use Katalyst.

Create or update AppworkZ’s Katalyst Skill in this repo.

Katalyst is the AppworkZ Builder OS: a repo-native AI development operating layer that turns messy software ideas into clear specs, clear tasks, correct docs lookup, implementation, review, memory updates, and shipping.

Do not build a UI, database, dashboard, SaaS, Notion clone, Jira clone, or overbuilt project management system.

Create/update `skills/katalyst/SKILL.md`, integrate it with `AGENTS.md`, and add minimal starter files only if useful: `spec.md`, `spec-history.md`, `tasks/current.md`, `tasks/backlog.md`, `tasks/done.md`, `knowledge/docs-retrieval.md`, and agent prompts.

Non-negotiable: Katalyst must use `neuledge/context` as its preferred documentation retrieval layer:
https://github.com/neuledge/context

Before coding, agents must inspect dependencies, identify touched libraries/frameworks/SDKs, use Context to retrieve correct version-specific docs when available, and report docs consulted in the final summary.

Keep everything simple, portable, and useful for ChatGPT Codex local, Codex Cloud, Antigravity with Opus, Claude/Opus, Gemini CLI, and future AI agents.

End with files created/updated, what Katalyst now enables, how Context is used, assumptions, and recommended next improvement.
```

---

# Notes for Adit

## How to use with Antigravity

Paste the full prompt into Antigravity with Opus.

After it edits the repo, paste the follow-up review prompt.

## How to use with Codex local

Install Context once:

```bash
npm install -g @neuledge/context
codex mcp add context -- context serve
```

Then in a repo, tell Codex:

```text
Use Katalyst. Read AGENTS.md and skills/katalyst/SKILL.md. Use Context before touching external APIs. Implement tasks/current.md.
```

## How to use with Codex Cloud

Make sure the repo contains:

```text
AGENTS.md
skills/katalyst/SKILL.md
spec.md
tasks/current.md
knowledge/docs-retrieval.md
```

Then give Codex Cloud a task like:

```text
Use Katalyst. Read repo memory first. Identify external dependencies touched by this task. Use the configured docs retrieval protocol. Make the smallest safe implementation and update memory.
```

If Context is not available in the cloud environment, require the agent to say so and fallback to repo docs or official docs available in the workspace.

## How to use with future agents

The agent only needs three things:

```text
1. Read AGENTS.md
2. Read skills/katalyst/SKILL.md
3. Follow the Katalyst loop
```

The loop:

```text
sense → spec → task → docs → build → review → memory
```

---

# Source Reminder

Katalyst’s Context integration is based on:

```text
https://github.com/neuledge/context
```

Core reason:

```text
AI agents can produce outdated library usage. Context provides a local-first MCP documentation server and registry-based docs workflow so agents can retrieve correct docs before coding.
```
