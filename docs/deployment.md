# Deployment

Sativa OS is currently deployed as a Cloudflare-native test MVP.

## Runtime

- Cloudflare Worker: serves the UI and JSON tool endpoints.
- Cloudflare D1: stores Sativa OS entries.
- Auth: intentionally disabled for the first test deployment.

## Useful commands

```bash
npm install
# Project scripts run Wrangler through Node 22 because current Wrangler requires Node >=22.
npm run typecheck
npm test
npm run db:migrate:remote
npm run deploy
```

## Tool surface

- `GET /mcp` — simple tool manifest for custom MCP/ChatGPT integration planning.
- `GET /api/daily-brief`
- `GET /api/priority`
- `GET /api/intentions`
- `GET /api/worries`
- `GET /api/obligations`
- `POST /api/capture`
- `POST /api/journal`
- `POST /api/decision`

## Next hardening step

Add PIN/session auth before putting real private operating data into D1.
