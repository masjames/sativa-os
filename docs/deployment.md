# Deployment

Sativa OS is deployed as a Cloudflare-native ledger MVP.

## Runtime

- Cloudflare Worker: serves the React/Vite static frontend assets, JSON APIs, and MCP tool endpoints.
- Cloudflare D1: stores accounts, businesses, ledger categories, ledger transactions, reports, reflections, and generic entries.
- Browser cache: React pages read `localStorage` first for instant repeat loads, then refresh from Cloudflare D1 in the background. The BMC stores structured BMC blocks per business in browser cache and D1.
- Auth: intentionally disabled for the current functional test deployment.

## Useful commands

```bash
npm install
npm run typecheck
npm run build
npm test
npm run db:migrate:remote
npm run deploy
```

## Ledger tool surface

- `GET /` — Mission Control split into Money Flow, Horizon of Controls, and All Detailed Data.
- `GET /director` — director-level control: 300T vision, weekly review, OKRs, businesses, and business metrics.
- `GET /projects` — Projects Horizon grouped by parent business with Buubo sync status.
- `GET /business-model` — static nine-block business canvas with horizontal business tabs and global lock/unlock.
- `GET /add-transaction` — separate manual cash in/out form.
- `GET /mcp` — human-readable MCP/tool manifest.
- `POST /mcp` — no-auth Streamable HTTP JSON-RPC MCP endpoint for ChatGPT custom app testing (`initialize`, `tools/list`, `tools/call`).
- `GET /api/mission-control-data` — compact Mission Control snapshot for lazy UI hydration/cache refresh.
- `GET /api/director-data` — compact Director snapshot for lazy UI hydration/cache refresh.
- `GET /api/business-model-data` — compact structured BMC data for lazy UI hydration/cache refresh.
- `GET /api/projects` — active projects, each tied to a parent business.
- `POST /api/projects` — create a project tied to a parent business.
- `GET /api/business-metrics` — shareholding, energy/time, sustainability, and vision metrics.
- `GET /api/businesses/:businessId/canvas` — legacy structured canvas snapshot endpoint for a business.
- `PUT /api/businesses/:businessId/canvas` — save legacy structured canvas snapshot for a business.
- `GET /api/sync/buubo/status` — Buubo sync readiness/status.
- `GET /api/ledger/summary` — whole money situation.
- `GET /api/ledger/accounts` — pockets/accounts with balances.
- `GET /api/ledger/transactions` — cashflow ledger.
- `POST /api/ledger/transactions` — add cash in/out transaction.
- `GET /api/ledger/cashflow` — period cashflow rows and totals.
- `GET /api/ledger/assets` — asset table.
- `GET /api/ledger/categories` — tax-aware categories.
- `GET /api/businesses` — simplified business accounting and ownership.
- `GET /api/reports/tax-summary` — simplified tax/SPT preparation view.
- `GET /api/director/summary` — high-level director control summary.
- `GET /api/weekly-review` — weekly review records.
- `GET /api/okrs` — business OKRs.
- `GET /api/vision` — Sativa 300T alignment goals.
- `GET /api/business-model` — BMC blocks/elements.
- `POST /api/business-model` — update a BMC building block.

## Seeded current facts

- Salary: Rp2,000,000 cash in.
- Bank admin spare: Rp25,000 cash out.
- GoPay: Rp12,000 spendable wallet balance.
- WARAS: Rp1,000,000 out of free cash and tracked as WARAS asset in Sonny's empty bank account.
- WARAS ownership: Adit 65%, Sonny 35%.
- Savings: Rp0.

## Next hardening step

Add PIN/session auth before putting more sensitive private operating data into D1.

## 2026-06-27 performance correction

- Read-only API routes no longer await seed/upsert work before returning JSON. This avoids slow refreshes such as 15s mission-control loads.
- The React frontend removed the heavy tldraw user flow and uses a static nine-block BMC editor with browser cache and per-block D1 persistence.
- Navigation is simplified: the Sativa OS title is the home link, `+transaction` is next to the title, and MCP Manifest is in the top menu.

## ChatGPT Create an App values

Use these values for the no-auth test connection:

- Name: `Sativa OS`
- Description: `Private operating system for ledger, cashflow, projects, weekly review, OKRs, and business model control.`
- Connection: Server URL
- Server URL: `https://sativa-os.praditya-bagus.workers.dev/mcp`
- Authentication: `No authentication` if available. OAuth is not implemented yet.

After the app connects, ask ChatGPT to call `get_money_situation`, `list_accounts`, `get_weekly_review`, or `get_business_model_canvas`.

## Ledger control MCP tools

The no-auth MCP endpoint should expose a 47-tool unfiltered discovery surface: the 16 live baseline tools plus expanded ledger control tools beyond add/list: `edit_transaction`, `reclassify_transaction`, `void_transaction`, `soft_delete_transaction`, `create_transfer`, `create_split`, `attach_receipt`, `add_transaction_note`, `reconcile_account`, `read_audit_log`, account/category/business management tools, spending summaries, recurring expense checks, tax/export/import/bulk cleanup, and audit-log reads. Older internal aliases (`update_transaction`, `delete_transaction`, `record_transfer`, `split_transaction`, `get_audit_log`) remain callable for backward compatibility, but the ChatGPT-facing manifest advertises the corrected names. All mutations write to `ledger_audit_log` including `metadata_json` where practical; voided/deleted rows are excluded from balances by default.


## Live MCP manifest verification

After deploying the Worker, verify the live Streamable HTTP MCP discovery response with:

```bash
node scripts/verify-mcp-manifest.mjs https://sativa-os.praditya-bagus.workers.dev/mcp
```

Expected result: `Total tool count: 47`, no missing expected tools, no missing/empty schemas for schema-bearing tools, all preferred names (`edit_transaction`, `soft_delete_transaction`, `create_transfer`, `create_split`, `read_audit_log`) present, all compatibility aliases (`update_transaction`, `delete_transaction`, `record_transfer`, `split_transaction`, `get_audit_log`) present, and final `PASS`.
