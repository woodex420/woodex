# Deployment Guide

This guide describes how to deploy the Woodex project to common hosts (GitHub, Vercel, Netlify) and how to prepare a GitHub upload.

1) Prepare repository for upload

- Ensure `package.json` and `pnpm-lock.yaml` are present at repo root.
- Add `complete-project/` folder (this folder) and commit.
- Add `.gitignore` to exclude `node_modules/`, `.env`, and build caches.

2) Local build check

```bash
pnpm install --prefer-offline
pnpm run build:prod   # or `pnpm build`
pnpm preview
```

If preview serves the app and pages render, the build is good.

3) Deploy to Vercel (recommended for Vite/React)

- Create a Vercel project, connect to the GitHub repo.
- Set the build command: `pnpm build` (or `pnpm run build:prod`)
- Set output directory: `dist`
- Add necessary environment variables (Supabase URL/Key, payment provider keys, etc.) in Vercel settings.

4) Deploy to Netlify

- Create a new site, connect to GitHub.
- Build command: `pnpm build`
- Publish directory: `dist`
- Add environment variables on Netlify site settings.

5) GitHub Actions (optional)

Create a simple workflow `.github/workflows/ci.yml` that runs `pnpm install` and `pnpm build` on pushes to `main`/`production` branches.

6) Release packaging

If you want a single folder to upload (e.g., send to QA), run the helper script `complete-project/prepare_release.sh` which will:
- Install deps
- Build the project
- Copy `dist/` into `complete-project/release-dist/` for easy zipping and sharing

7) Verify after deploy

- Confirm pages load and important flows work (login, add to cart, checkout, order creation)
- Use the provided test account to validate flows.


--
End of deploy guide.