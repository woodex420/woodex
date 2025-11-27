# Vercel Deployment Instructions

This guide walks through deploying Woodex to Vercel with automated CI/CD.

## Prerequisites

- GitHub account with `woodex` repository pushed
- Vercel account (free tier OK): https://vercel.com/signup

## Step 1: Connect Repository to Vercel

1. Visit https://vercel.com/new
2. Click **Select a Git Repository**
3. Search for `woodex` and click **Import**
4. Vercel will auto-detect the project as a Vite app

## Step 2: Configure Build Settings

Vercel should auto-detect most settings, but verify:

| Setting | Value |
|---------|-------|
| **Framework Preset** | Vite |
| **Build Command** | `pnpm run build:prod` |
| **Output Directory** | `dist` |
| **Install Command** | `pnpm install --prefer-offline` |
| **Development Command** | `pnpm dev` |

## Step 3: Add Environment Variables

In Vercel dashboard, go to **Settings** → **Environment Variables**:

### Production Environment
Add these variables (copy from Supabase dashboard):

```
VITE_SUPABASE_URL = https://vocqqajpznqyopjcymer.supabase.co
VITE_SUPABASE_ANON_KEY = <your-anon-key-from-supabase>
```

### Preview Environment (Optional)
For testing before production:
```
VITE_SUPABASE_URL = https://vocqqajpznqyopjcymer.supabase.co
VITE_SUPABASE_ANON_KEY = <same-key-or-test-key>
```

### Development Environment (Optional)
```
VITE_SUPABASE_URL = https://vocqqajpznqyopjcymer.supabase.co
VITE_SUPABASE_ANON_KEY = <test-key>
```

## Step 4: Deploy

Click **Deploy** button.

Vercel will:
1. Clone repository
2. Install dependencies (`pnpm install --prefer-offline`)
3. Run linter (`pnpm lint`)
4. Build project (`pnpm run build:prod`)
5. Deploy `dist/` folder to CDN

**Deployment URL:** `https://<project-name>.vercel.app` (auto-generated or custom)

## Step 5: Test Deployment

1. Open the Vercel deployment URL
2. Test login with: `roeodggw@minimax.com / ut7qa4SKF6`
3. Verify:
   - Admin dashboard loads
   - E-commerce storefront accessible
   - Products display
   - Cart/checkout works

## Step 6: Add Custom Domain (Optional)

1. In Vercel: **Settings** → **Domains**
2. Click **Add** → enter your domain (e.g., `woodex.com`)
3. Update DNS records (instructions provided by Vercel)
4. SSL cert auto-issued

## Step 7: Enable Auto-Deployments

By default, every push to `main` triggers auto-deploy.

To require PR approval before deploy:
1. **Settings** → **Git** → **Deploy on Push** → disable
2. Manually trigger deploys from Vercel dashboard when ready

## Step 8: Monitor & Debug

### View Build Logs
- Vercel Dashboard → **Deployments** → click a deployment → **View Logs**

### Common Errors

**Error: "Cannot find module..."**
- Check `.env` has all required variables
- Run locally first: `pnpm install && pnpm run build:prod`

**Error: "SUPABASE_URL is undefined"**
- Verify `VITE_SUPABASE_URL` is set in Vercel env vars
- Wait 5 min after adding env vars (Vercel caches)
- Redeploy: click **Redeploy** on latest deployment

**Error: "401 Unauthorized"**
- Check `VITE_SUPABASE_ANON_KEY` is correct
- Verify user exists in Supabase
- Check row-level security (RLS) policies

## Step 9: Advanced Configuration

### Set Up Staging Environment

Create a `develop` branch for staging:

```bash
git checkout -b develop
git push origin develop
```

In Vercel:
1. **Settings** → **Git**
2. Under **Environments**, add preview branch: `develop`
3. Set different env vars if needed

Now:
- `main` → Production
- `develop` → Staging/Preview

### Enable GitHub Actions (Optional)

CI already configured in `.github/workflows/ci.yml`.

To require CI to pass before merge:
1. GitHub Settings → **Branches** → **main**
2. Enable **Require status checks to pass before merging**
3. Select `ci-build` workflow

## Step 10: Continuous Deployment

Now, every push automatically:
1. Runs GitHub Actions CI (build, lint test)
2. If CI passes, Vercel auto-deploys
3. New URL available within 1-3 minutes

## Rollback (If Needed)

If deployment breaks:
1. Vercel Dashboard → **Deployments**
2. Click a previous working deployment → **Promote to Production**

## Monitoring & Analytics

- Vercel provides free analytics: **Analytics** dashboard
- Check:
  - Page load times
  - Traffic patterns
  - Error rates

## Environment Variables Checklist

Copy this checklist and complete in Vercel:

```
✅ VITE_SUPABASE_URL
✅ VITE_SUPABASE_ANON_KEY
[ ] Any other third-party API keys (Stripe, payment gateways, etc.)
```

## Costs

- **Vercel Free Tier**: 0$ for most projects
  - Includes: 100 GB bandwidth/month, unlimited deployments
  - Suitable for: Development, staging, low-traffic production
- **Vercel Pro**: $20/month
  - Includes: 1 TB bandwidth/month, advanced analytics, priority support

---

**Deployment Complete!** Your app is now live on Vercel with automatic CI/CD.

For questions, see `COMPLETE_SETUP_GUIDE.md` Part 7 or Vercel docs: https://vercel.com/docs
