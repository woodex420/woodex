# Woodex — Production Release Package

This folder contains a compact, GitHub-ready package and deployment instructions for the Woodex project.

Live instances (provided by user):
- Admin Dashboard: https://ig4pphp2edwp.space.minimax.io
- E-Commerce Platform: https://2oaw9w5vzwif.space.minimax.io
- Deployment (staging/other): https://jq5qqkov5cnw.space.minimax.io
- Test Account: `roeodggw@minimax.com` / `ut7qa4SKF6`

What this folder contains:
- `README_PRODUCTION.md` — this file
- `DEPLOY.md` — step-by-step deploy instructions
- `.gitignore` — recommended ignores for uploads
- `prepare_release.sh` — helper script to build and collect `dist` for upload

Quick Prerequisites
- Node.js (v18+ recommended)
- `pnpm` (project scripts use `pnpm`) — install: `npm i -g pnpm`

Build & Preview (local)

From repository root run:

```bash
pnpm install --prefer-offline
# Standard prod build
pnpm build
# or explicit prod mode
pnpm run build:prod
# Preview the production build
pnpm preview
```

Notes
- `build:prod` sets `BUILD_MODE=prod` in the `package.json` script; this toggles some Vite plugin behavior.
- Environment variables: If you use a `.env` file, DO NOT commit secrets to GitHub. Add a `.env.example` that documents required variables.

Files to include in GitHub
- `package.json`, `pnpm-lock.yaml` (or `package-lock.json` if used)
- `src/`, `public/`, `vite.config.ts`, `tsconfig.*`, `README.md`, `docs/`, `complete-project/` (this folder)

Files to exclude
- `node_modules/`, `.pnpm-store/`, `.env` files, local caches, OS artifacts like `.DS_Store`.

Next steps suggested (see `DEPLOY.md`):
- Add GitHub Actions for CI build and optional deploy to Vercel/Netlify
- Add a `production` branch or tag for releases
- Confirm environment variables for Supabase and any payment providers

Contact / Test info
- Use the Test Account above to validate login flows and order management features before listing as production-ready.

--
Generated release helper for repository packaging.