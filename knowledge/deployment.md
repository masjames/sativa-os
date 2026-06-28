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
6. Check that Cloudflare deployment secrets are configured.
7. If secrets exist, apply remote D1 migrations with Wrangler.
8. If secrets exist, deploy the Cloudflare Worker with Wrangler.

If Cloudflare secrets are missing, the workflow keeps the build green and emits a GitHub Actions warning instead of failing before deployment. Add the required secrets to enable the deploy steps.

Required GitHub repository secrets:

- `CLOUDFLARE_API_TOKEN`
- `CLOUDFLARE_ACCOUNT_ID`

Do not commit Cloudflare API tokens or account secrets to the repository.
