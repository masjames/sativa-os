# Deployment

Sativa OS deploys to Cloudflare Workers with static assets from `dist` and D1 bound as `DB` in `wrangler.jsonc`.

## Automatic preview and production deploy

GitHub Actions workflow: `.github/workflows/deploy.yml`

Triggers:

- Push to any branch
- Pull request targeting `main`
- Manual `workflow_dispatch`

Pipeline:

1. Check out the repo.
2. Install dependencies with `npm ci` on Node.js 22.
3. Run `npm run typecheck`.
4. Run `npm test`.
5. Run `npm run build` to generate `dist` assets.
6. Require Cloudflare deployment secrets to be configured.
7. For non-main branches and PRs, compute a DNS-safe preview alias from the branch name and run `npm run deploy:preview -- --preview-alias <alias>`. This uploads a Worker version without promoting it to production.
8. For `main`, apply remote D1 migrations with Wrangler.
9. For `main`, deploy the Cloudflare Worker with Wrangler.

If Cloudflare secrets are missing, the workflow fails before preview upload, migration, or deploy so a branch or merged PR cannot look successfully deployed when Cloudflare was skipped. Add the required secrets to enable the deploy steps.

Required GitHub repository secrets:

- `CLOUDFLARE_API_TOKEN`
- `CLOUDFLARE_ACCOUNT_ID`

Do not commit Cloudflare API tokens or account secrets to the repository.

## Cache visibility note

The Worker marks the SPA HTML entry response as `Cache-Control: no-store, must-revalidate` while leaving hashed static assets cacheable. This forces browsers and Cloudflare edges to re-check `index.html` after deploy so users receive the latest React asset URLs instead of an old app shell.

## Branch preview URL pattern

Cloudflare Workers preview URLs are enabled in `wrangler.jsonc`. Branch workflows call `wrangler versions upload --preview-alias <alias>`, so the preview URL follows Cloudflare's aliased preview pattern: `<alias>-sativa-os.<workers-subdomain>.workers.dev`. The alias is lowercase, stripped to letters/numbers/dashes, starts with a letter, and is truncated for DNS label safety. Preview jobs intentionally do not apply D1 migrations; production migrations still run only on `main`.
