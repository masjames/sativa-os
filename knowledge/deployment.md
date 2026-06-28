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
6. Apply remote D1 migrations with Wrangler.
7. Deploy the Cloudflare Worker with Wrangler.

Required GitHub repository secrets:

- `CLOUDFLARE_API_TOKEN`
- `CLOUDFLARE_ACCOUNT_ID`

Do not commit Cloudflare API tokens or account secrets to the repository.
