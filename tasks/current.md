# Current Task

Ship the fast React Projects Horizon and static BMC correction while keeping the minimalist black-and-white control system.

## Objective

Serve a React/Vite frontend from the Worker, remove the heavy tldraw BMC user flow, keep the standard nine-block BMC layout editable with one simple edit/save control, and keep Projects Horizon, business metrics, and Buubo sync-ready architecture.

## Acceptance Criteria

- UI is low-fidelity black and white with no decorative effects.
- UI routes render an instant shell first instead of blocking first paint on D1.
- Browser cache is used first; D1 refresh happens in the background and updates page sections.
- New compact JSON data endpoints hydrate Mission Control, Director, and BMC.
- Mission Control is split into Money Flow, Horizon of Controls, and All Detailed Data.
- Loading status clearly says data loaded from Cloudflare D1 and shows counts.
- Add Transaction is a separate page for manual cash in/out tracking.
- Ledger tracks salary Rp2,000,000, bank admin Rp25,000, GoPay Rp12,000, WARAS Rp1,000,000 asset, savings Rp0.
- WARAS is out of Adit free cash and tracked as WARAS asset in Sonny's empty bank account.
- WARAS ownership is visible as Adit 65%, Sonny 35%.
- MCP live visibility check currently shows only 16 tools; the next correction is to make the expanded ledger/control-plane tools visible with ChatGPT-facing names.
- Tests, migration, deployment, and smoke checks pass.

- Director Control tracks Sativa 300T vision, weekly review, OKRs, and business control.
- Business Model Canvas editor tracks every building block and its elements for each business.
- Business Model Canvas uses the standard nine-block layout from the provided reference.
- BMC is locked by default; pressing edit inside a block enables add/delete/save for that block.
- Delete buttons are hidden until edit is active.
- The separate BMC edit form is removed from the user flow.
- AppWorkZ Upwork service strategy is seeded: AI-assisted 0-to-MVP, existing app restructure for AI dev, and agentic dev partner service.

- React/Vite frontend is served as Cloudflare Worker static assets.
- `/projects` exists next to Director in the navigation.
- BMC uses the standard static nine-block layout with horizontal business tabs and one global edit/save control.
- BMC structured blocks persist per business in D1 and browser cache.
- Business metrics include shareholding, energy/time allocation, sustainability score, and 300T vision score.
- Buubo sync tables/status exist, with real sync marked pending adapter until Buubo API/webhook access exists.

## Current Correction

- Read-only API routes should not run seed/upsert work before returning data; they should return compact D1 data immediately.
- Sativa OS title is the home link. `+transaction` sits next to the title. Mission Control is not a nav item. MCP Manifest is visible in nav.
- Add Transaction is a super simple form for date, account, business, category, type, cash in, cash out, and description.

## MCP Connection Correction

- `/mcp` should support no-auth Streamable HTTP JSON-RPC for ChatGPT custom app testing.
- Required methods: `initialize`, `tools/list`, `tools/call`, and `ping`.
- Keep `GET /mcp` as a human-readable manifest/help endpoint.
- Use `No authentication` in ChatGPT during this test slice; OAuth/PIN auth is the next hardening step.

## Ledger Control Plane Expansion

- MCP must support auditable transaction CRUD, reclassification, void/soft delete, clean two-leg transfers, splits, notes, receipts, account reconciliation, account/category/business management, exports/imports, bulk cleanup, spending summaries, recurring expense detection, and audit-log reads. ChatGPT-facing names should include `edit_transaction`, `soft_delete_transaction`, `create_transfer`, `create_split`, and `read_audit_log`; old internal aliases may remain callable but should not be the primary advertised names.
- Money writes return updated rows plus money situation where relevant.
- Running balances are derived from non-void, non-deleted ledger rows.
