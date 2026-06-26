# Product Spec

## Product Objective

Sativa OS is Adit's private clarity/control plane: it turns scattered high-context operating energy into clear priorities, captured obligations, decisions, worries, intentions, and daily action.

## Current Scope

First shippable slice: a Cloudflare-native test MVP with auth intentionally disabled so all core functions can be tested before installing it as a custom ChatGPT MCP/tool server.

## Primary User

Adit.

## Core Use Case

Adit asks, “what should I pay attention to, build, sell, or ignore today so Sativa compounds?” Sativa OS returns one grounded daily brief from structured operating data.

## Current Features

- Cloudflare Worker dashboard.
- Cloudflare D1-backed entries.
- Sections: entities, ledger, ventures, obligations, decisions, weekly, intentions, worries, journal, captures.
- Tool endpoints for daily brief, priority, intentions, worries, obligations, capture, journal, and decisions.
- Simple MCP planning manifest at `/mcp`.

## Non-Goals

- No PIN/session auth in this test slice.
- No real Google Calendar sync yet.
- No private ledger/client data committed to Git.
- No full ChatGPT Apps SDK registration yet.

## User Flow

1. Open the deployed Worker URL.
2. Capture an intention, worry, obligation, decision, ledger item, venture, entity, or free capture.
3. View the daily brief and priority.
4. Query JSON endpoints from a future custom ChatGPT MCP/tool integration.

## Architecture Summary

Cloudflare Worker serves both the UI and API. Cloudflare D1 stores structured Sativa OS entries. Auth is deliberately disabled in test mode and must be added before real private data is stored.

## Data Model Summary

A general `entries` table stores sectioned operating records with title, body, status, priority, due date, amount, metadata, timestamps, and section indexes. A `system_events` table is reserved for later audit/memory events.

## API Summary

- `GET /health`
- `GET /mcp`
- `GET /api/sections`
- `GET /api/entries?section=...`
- `POST /api/entries`
- `GET /api/daily-brief`
- `GET /api/priority`
- `GET /api/intentions`
- `GET /api/worries`
- `GET /api/obligations`
- `POST /api/capture`
- `POST /api/journal`
- `POST /api/decision`

## Business Rules

- Cash, obligations, decisions, intentions, and worries must be visible.
- ChatGPT should query Sativa OS instead of storing Sativa OS data in memory.
- Real private operating data belongs in D1 or external services, not Git.

## Technical Decisions

- Use Cloudflare Worker + D1 for this MVP because the user requested Cloudflare infra.
- Skip auth only for functional testing.
- Use a single Worker for UI and API to keep deployment simple.

## Docs Retrieval

### External Dependencies

- Cloudflare Workers
- Cloudflare D1
- Wrangler
- TypeScript

### Official Docs Sources

- Cloudflare Workers configuration docs.
- Cloudflare D1 getting started and Worker binding docs.
- Cloudflare static assets/testing docs as needed.

### Known Doc Gaps

Custom ChatGPT MCP server install details are not finalized in this slice.

## Known Constraints

- Cloudflare secrets are available through environment variables.
- Google Calendar credentials were not present during initial verification.
- Auth must be added before production/private data use.

## Links to Knowledge Files

- `knowledge/docs-retrieval.md` — docs retrieval protocol.
- `docs/deployment.md` — deployment and endpoint notes.

## Current Next Task

After test deployment, add PIN/session auth and then formalize the MCP/ChatGPT connector contract.
