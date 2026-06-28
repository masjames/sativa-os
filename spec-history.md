# Spec History

Change log of product understanding. Record why important decisions happened.

---

## 2026-06-26

**Initial Katalyst setup.**

- Created Katalyst Skill as the repo-native development operating layer.
- Established repo structure: spec, tasks, knowledge, prompts, skills.
- Integrated neuledge/context as the preferred docs retrieval engine.
- No product defined yet — this repo is the Katalyst skill itself.

## 2026-06-27 — React/tldraw Projects Horizon Upgrade

- Replaced the active UI target with a React/Vite frontend served as Worker static assets.
- Business Model Canvas moves from static HTML blocks toward a tldraw whiteboard with horizontal business tabs, global lock/unlock, browser cache, and D1 snapshot persistence per business.
- Added Projects Horizon as a first-class control layer; every project belongs to one parent business.
- Added business metrics for shareholding, energy/time allocation, sustainability, and Sativa 300T vision alignment.
- Added Buubo two-way sync schema/status architecture; real sync remains pending Buubo API/webhook credentials or shared database access.

## 2026-06-27 — Fast static BMC correction

- Removed the tldraw BMC user flow after performance/UX feedback.
- Kept React/Vite, Projects Horizon, MCP nav, and browser caching.
- Changed read-only API routes so they do not run seeding before returning D1 data.
- Simplified navigation and Add Transaction form.

## 2026-06-27 — No-auth ChatGPT MCP endpoint

- Added no-auth Streamable HTTP JSON-RPC handling on `POST /mcp` for ChatGPT custom app testing.
- Kept `GET /mcp` as the human-readable tool manifest.
- Documented Create an App form values and OAuth as a follow-up hardening task.

## 2026-06-27 — Auditable MCP ledger control plane

- Added D1 audit/control-plane schema for transaction metadata, external refs, transfer groups, split parents, receipts, void/deleted state, audit log, transaction notes, and transfer groups.
- Expanded MCP tools for CRUD, reclassification, void/delete, transfers, splits, notes, receipts, reconciliation, account/category/business management, export/import, bulk cleanup, spending summaries, recurring expense detection, and audit reads.


## 2026-06-27 — MCP live tool visibility correction

- Captured the live ChatGPT MCP surface as 16 visible baseline tools.
- Renamed the primary advertised expanded ledger tools to ChatGPT-facing names: `edit_transaction`, `soft_delete_transaction`, `create_transfer`, `create_split`, and `read_audit_log`.
- Kept older internal ledger tool aliases callable for compatibility while making the missing tools explicit in repo memory.
