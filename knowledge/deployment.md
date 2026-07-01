# Deployment

Sativa OS deploys to Cloudflare Workers with static assets from `dist` and D1 bound as `DB` in `wrangler.jsonc`.

## Automatic production deploy

GitHub Actions workflow: `.github/workflows/deploy.yml`

Triggers:

- Push to `main`
- Manual `workflow_dispatch`

Pipeline:

1. Check out the repo.
2. Install dependencies with `npm ci` on Node.js 22.
3. Run `npm run typecheck`.
4. Run `npm test`.
5. Run `npm run build` to generate `dist` assets.
6. Require Cloudflare deployment secrets to be configured.
7. Apply remote D1 migrations with Wrangler.
8. Deploy the Cloudflare Worker with Wrangler.

If Cloudflare secrets are missing, the workflow now fails before migration/deploy so a merged PR cannot look successfully deployed when Cloudflare was skipped. Add the required secrets to enable the deploy steps.

Required GitHub repository secrets:

- `CLOUDFLARE_API_TOKEN`
- `CLOUDFLARE_ACCOUNT_ID`

Do not commit Cloudflare API tokens or account secrets to the repository.

## Cache visibility note

The Worker marks the SPA HTML entry response as `Cache-Control: no-store, must-revalidate` while leaving hashed static assets cacheable. This forces browsers and Cloudflare edges to re-check `index.html` after deploy so users receive the latest React asset URLs instead of an old app shell.
