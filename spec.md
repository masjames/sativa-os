# Product Spec

## Product Objective

Sativa OS is Adit's private clarity/control plane with a ledger-first cash system. It turns cash anxiety into visible accounts, transactions, balances, business accounting, tax-ready categories, and reviewable cash reflections.

## Current Scope

Cloudflare-native test MVP with auth intentionally disabled. The active slice is a minimalist React/Vite control plane served by Cloudflare Workers. It tracks money flow, director controls, Projects Horizon, business metrics, Buubo sync readiness, and a fast static nine-block Business Model Canvas editor.

## Primary User

Adit.

## Core Use Case

Adit asks, “how much money do I really have and where did it flow?” Sativa OS returns spendable cash, restricted assets, account balances, auditable transaction ledger, business reports, and tax-ready categorization.

## Current Real Cash Facts

- Salary received this month: Rp2,000,000.
- Bank account admin spare/outflow: Rp25,000.
- GoPay balance: Rp12,000.
- WARAS initial investment: Rp1,000,000 is out of Adit's free cash and is now a WARAS asset held in Sonny's empty bank account.
- WARAS ownership: Adit 65%, Sonny 35%.
- Other savings: Rp0.
- Status: critical cash situation.

## Current Features

### Ledger / Money

- Minimalist low-fidelity black-and-white Mission Control UI without decorative effects.
- Mission Control, Director Control, Projects, Add Transaction, and Business Model Canvas are served by a React/Vite frontend with browser cache-first hydration from Cloudflare D1 JSON endpoints.
- Mission Control is divided into Project Scope Kanban, Financial / Money Flow, Horizon of Controls, and All Detailed Data.
- Visible database loading status shows Cloudflare D1 load time and counts for accounts, transactions, and businesses.
- Accounts/pockets table: bank, GoPay, Sonny WARAS account, savings.
- Cashflow ledger with cash in, cash out, and running balance.
- Asset table distinguishing spendable cash from restricted business assets.
- Business accounting table with simplified revenue, expenses, investment/assets, net cash, and ownership.
- Tax/SPT preparation summary.
- MCP/tool endpoints for money situation, accounts, transactions, cashflow, asset table, categories, business accounting, tax summary, director summary, weekly review, OKRs, Sativa 300T vision alignment, and business model canvas control. `/mcp` now supports a no-auth Streamable HTTP JSON-RPC MCP test endpoint with `initialize`, `tools/list`, and `tools/call`.

### Director / High-Level Control

- Director Control page for Sativa 300T alignment, weekly review, business OKRs, and business control.
- Business Model Canvas is a simple nine-block layout per business with a tile-based business home, sticky block title/control row, edit/save/cancel controls, manual in-page refresh, local browser cache, D1 block persistence, latest updated dates, and latest change links.
- BMC blocks remain available as MCP/queryable memory without a heavy whiteboard dependency.
- Seeded AppWorkZ Upwork service strategy: AI-assisted 0-to-MVP development, existing app restructure for AI dev, and agentic dev partner service.
- Zippp and Rileks deployment OKRs are tracked as proof-building steps for AppWorkZ.
- Project scope appears first in Mission Control as a Trello-like draggable Kanban board limited to Todo, Doing, and Review, with editable Backlog and Done list views below it. Projects remain tied to parent businesses and project outcomes/next actions, and the Director view shows each project's current Kanban state.
- Business metrics track shareholding, energy/time allocation, sustainability score, and Sativa 300T vision alignment.
- Buubo sync architecture is represented with sync status and D1 schema; real two-way sync remains pending Buubo integration credentials/API. UI pages poll compact D1 endpoints and the status bar surfaces recently updated/added/changed records with links back to relevant sections.

## Non-Goals

- No PIN/session auth in this test slice.
- No real Google Calendar sync yet.
- No formal accountant-certified IFRS implementation yet.
- No private credentials or evidence files committed to Git.

## User Flow

1. Open the deployed Worker URL.
2. See current cash position and critical status.
3. Review accounts/pockets and asset table.
4. Use the separate `/add-transaction` page only when manually logging cash in/out; otherwise use ChatGPT/MCP as the primary interaction path.
5. Review cashflow ledger and business accounting.
6. Use MCP tools later to ask ChatGPT to log, categorize, and summarize money flows.

## Architecture Summary

Cloudflare Worker serves the UI and JSON APIs. Cloudflare D1 stores accounts, businesses, ledger categories, ledger transactions, reports, reflections, and older generic entries. The ledger tables are the source of truth for money. Pushes to `main` trigger GitHub Actions to typecheck, test, and build; when `CLOUDFLARE_API_TOKEN` and `CLOUDFLARE_ACCOUNT_ID` repository secrets are configured, the same workflow applies remote D1 migrations and deploys the Worker to Cloudflare.

## Data Model Summary

- `accounts` stores pockets/accounts and whether money is spendable.
- `businesses` stores simplified business entities and ownership, including WARAS Adit 65% / Sonny 35%.
- `ledger_categories` stores tax-aware categories.
- `ledger_transactions` stores cash in, cash out, business, account, category, counterparty, tax tag, and reflection.
- `business_reports` stores future report handoffs.
- `reflection_notes` stores review/retrospective notes.

## API Summary

- `GET /health`
- `GET /mcp`
- `POST /mcp`
- `GET /api/overview`
- `GET /api/mission-control-data`
- `GET /api/director-data`
- `GET /api/business-model-data`
- `GET /api/projects`
- `POST /api/projects`
- `POST /api/projects/:projectId/action`
- `GET /api/status-changes`
- `GET /api/business-metrics`
- `GET /api/businesses/:businessId/canvas`
- `PUT /api/businesses/:businessId/canvas`
- `GET /api/sync/buubo/status`
- `GET /api/daily-brief`
- `GET /api/ledger/summary`
- `GET /api/ledger/accounts`
- `GET /api/ledger/transactions`
- `POST /api/ledger/transactions`
- MCP-only ledger control tools expose a 47-tool full unfiltered surface: baseline/director tools; preferred names `edit_transaction`, `soft_delete_transaction`, `create_transfer`, `create_split`, `read_audit_log`; compatibility aliases `update_transaction`, `delete_transaction`, `record_transfer`, `split_transaction`, `get_audit_log`; auditable transaction CRUD/reclassification/void/delete/transfers/splits/notes/receipts/reconciliation; account/category/business management; exports/imports; bulk cleanup; spending summaries; and recurring expense detection
- `GET /api/ledger/cashflow`
- `GET /api/ledger/assets`
- `GET /api/ledger/categories`
- `GET /api/businesses`
- `GET /api/reports/tax-summary`
- `GET /director`
- `GET /business-model`
- `GET /api/director/summary`
- `GET /api/weekly-review`
- `GET /api/okrs`
- `GET /api/vision`
- `GET /api/business-model`
- `POST /api/business-model`

## Business Rules

- WARAS Rp1,000,000 is not free cash; it is a restricted WARAS asset in Sonny's bank account.
- WARAS ownership must be visible as Adit 65% / Sonny 35%.
- Free cash excludes restricted business assets.
- Every money movement should have account, business, category, cash in/out, and tax/reflection fields. Edits, reclassifications, voids, deletes, transfers, splits, receipt attachments, reconciliations, bulk updates, account/category/business changes, and imports must write audit entries with metadata where practical.
- Tax/SPT review should be made easier by categorizing from the beginning.
- Real private operating data belongs in D1 or private storage, not Git.

## Technical Decisions

- Use Cloudflare Worker + D1 for the current deployed MVP.
- Keep the UI deliberately black-and-white and table-first.
- Use simplified IFRS-inspired accounting, not full formal IFRS. Running balances are derived from active ledger rows, not stored as source of truth.
- Keep generic entries for non-ledger memory, but make ledger tables the source of truth for cash.
- Use director control tables for weekly review, OKRs, BMC, and 300T alignment rather than burying management detail in prose.
- Prefer React/Vite static assets plus browser cache/lazy D1 refresh for UI routes, so page refresh is fast and D1 reads happen through compact JSON data endpoints instead of blocking first paint. Read-only API routes must not run seed/upsert work before returning data.
- Store editable BMC state in structured `business_model_blocks` for MCP/ChatGPT querying; the heavy tldraw whiteboard experiment is removed from the user flow. BMC and project UI writes create audit/status rows so external MCP changes can be surfaced by lightweight polling. Production build automation runs through `.github/workflows/deploy.yml` on every push to `main`; Cloudflare migration/deploy steps run in that workflow once the required repository secrets are configured.

## Known Constraints

- Auth is still disabled for functional testing. The MCP endpoint is ready for no-auth ChatGPT custom app testing, but should receive OAuth/PIN auth before real private production use.
- Deployed D1 contains seeded current cash facts, business metrics, projects, BMC canvas rows, and can accept new transactions/canvas snapshots.
- Accountant review is still needed before legal tax filing.

## Current Next Task

Test the no-auth ChatGPT custom app connection, then add OAuth/PIN auth before storing or exposing sensitive private data.
