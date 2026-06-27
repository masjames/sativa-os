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
- Mission Control is divided into Money Flow, Horizon of Controls, and All Detailed Data.
- Visible database loading status shows Cloudflare D1 load time and counts for accounts, transactions, and businesses.
- Accounts/pockets table: bank, GoPay, Sonny WARAS account, savings.
- Cashflow ledger with cash in, cash out, and running balance.
- Asset table distinguishing spendable cash from restricted business assets.
- Business accounting table with simplified revenue, expenses, investment/assets, net cash, and ownership.
- Tax/SPT preparation summary.
- MCP/tool endpoints for money situation, accounts, transactions, cashflow, asset table, categories, business accounting, tax summary, director summary, weekly review, OKRs, Sativa 300T vision alignment, and business model canvas control. `/mcp` now supports a no-auth Streamable HTTP JSON-RPC MCP test endpoint with `initialize`, `tools/list`, and `tools/call`.

### Director / High-Level Control

- Director Control page for Sativa 300T alignment, weekly review, business OKRs, and business control.
- Business Model Canvas is a simple nine-block layout per business with horizontal business tabs, a single edit/save control, local browser cache, and D1 block persistence.
- BMC blocks remain available as MCP/queryable memory without a heavy whiteboard dependency.
- Seeded AppWorkZ Upwork service strategy: AI-assisted 0-to-MVP development, existing app restructure for AI dev, and agentic dev partner service.
- Zippp and Rileks deployment OKRs are tracked as proof-building steps for AppWorkZ.
- Projects Horizon tracks active projects grouped under parent businesses, including Coreitera onboarding, AppWorkZ CV/Upwork setup, Rileks MVP, and Zippp deployment.
- Business metrics track shareholding, energy/time allocation, sustainability score, and Sativa 300T vision alignment.
- Buubo sync architecture is represented with sync status and D1 schema; real two-way sync remains pending Buubo integration credentials/API.

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

Cloudflare Worker serves the UI and JSON APIs. Cloudflare D1 stores accounts, businesses, ledger categories, ledger transactions, reports, reflections, and older generic entries. The ledger tables are the source of truth for money.

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
- `GET /api/business-metrics`
- `GET /api/businesses/:businessId/canvas`
- `PUT /api/businesses/:businessId/canvas`
- `GET /api/sync/buubo/status`
- `GET /api/daily-brief`
- `GET /api/ledger/summary`
- `GET /api/ledger/accounts`
- `GET /api/ledger/transactions`
- `POST /api/ledger/transactions`
- MCP-only ledger control tools: `update_transaction`, `reclassify_transaction`, `void_transaction`, `delete_transaction`, `record_transfer`, `split_transaction`, `add_transaction_note`, `attach_receipt`, `get_transaction`, `reconcile_account`, `create_account`, `update_account`, `archive_account`, `create_category`, `update_category`, `merge_categories`, `create_business`, `update_business`, `get_spending_by_category`, `get_recurring_expenses`, `export_ledger`, `import_transactions`, `bulk_update_transactions`, `bulk_reclassify_by_rule`, `get_audit_log`
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
- Every money movement should have account, business, category, cash in/out, and tax/reflection fields. Edits, reclassifications, voids, deletes, transfers, splits, receipt attachments, and reconciliations must write audit entries.
- Tax/SPT review should be made easier by categorizing from the beginning.
- Real private operating data belongs in D1 or private storage, not Git.

## Technical Decisions

- Use Cloudflare Worker + D1 for the current deployed MVP.
- Keep the UI deliberately black-and-white and table-first.
- Use simplified IFRS-inspired accounting, not full formal IFRS. Running balances are derived from active ledger rows, not stored as source of truth.
- Keep generic entries for non-ledger memory, but make ledger tables the source of truth for cash.
- Use director control tables for weekly review, OKRs, BMC, and 300T alignment rather than burying management detail in prose.
- Prefer React/Vite static assets plus browser cache/lazy D1 refresh for UI routes, so page refresh is fast and D1 reads happen through compact JSON data endpoints instead of blocking first paint. Read-only API routes must not run seed/upsert work before returning data.
- Store editable BMC state in structured `business_model_blocks` for MCP/ChatGPT querying; the heavy tldraw whiteboard experiment is removed from the user flow.

## Known Constraints

- Auth is still disabled for functional testing. The MCP endpoint is ready for no-auth ChatGPT custom app testing, but should receive OAuth/PIN auth before real private production use.
- Deployed D1 contains seeded current cash facts, business metrics, projects, BMC canvas rows, and can accept new transactions/canvas snapshots.
- Accountant review is still needed before legal tax filing.

## Current Next Task

Test the no-auth ChatGPT custom app connection, then add OAuth/PIN auth before storing or exposing sensitive private data.
