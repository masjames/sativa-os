# Done

Completed task notes.

---

## 2026-06-26 — Katalyst Skill v1

**Objective:** Create the first version of AppworkZ Katalyst Skill.

**What was done:**
- Created `skills/katalyst/SKILL.md` with full operating guide
- Created `AGENTS.md` as agent entry point
- Created starter `spec.md`, `spec-history.md`
- Created `tasks/` structure (current, backlog, done)
- Created `knowledge/docs-retrieval.md` for neuledge/context protocol
- Created agent prompts for Codex, Codex Cloud, Antigravity, and Review
- Created `README.md`

**Docs consulted:**
- Context unavailable in this environment.
- Fallback used: prompt specification and neuledge/context GitHub repo docs.
- Remaining uncertainty: None for this task (meta-skill creation, no external APIs touched).

## 2026-07-01 — BMC fallback, MCP manifest, backlog/done, and balance audit correction

- Added full nine-block BMC fallback data for every business so `/business-model` and `?business=...` no longer render empty when D1 has not persisted all blocks yet.
- Added no-store JSON manifest responses for `/mcp`, `/.well-known/mcp.json`, and `/mcp/manifest.json` to avoid the MCP manifest being served like the React homepage.
- Simplified project card editing to only task name, associated business/project, and status; Backlog and Done now render as two separate columns with a backlog add-card form.
- Added pocket balance audit controls that create reconciliation transactions before later spending categorization cleanup.

## 2026-07-01 — Branch preview Worker deployment

- Enabled automatic GitHub Actions runs for all branches and PRs targeting `main`.
- Non-main workflows now upload Cloudflare Workers preview versions with sanitized branch aliases before production merge.
- Kept D1 migrations and production deploy restricted to `main`.
- Documented preview deployment behavior in spec and deployment memory.
