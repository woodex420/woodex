# Phase 2: Vercel Deployment Guide

**Status:** Ready to Deploy ✅  
**Build:** Verified & Working ✅  
**GitHub Repo:** https://github.com/woodex420/woodex ✅  
**Vercel Project:** https://vercel.com/woodexs-projects/woodex-project

---

## 🚀 Quick Deploy Path (5 Minutes)

### Step 1: Connect Vercel to GitHub Repo

1. Visit: https://vercel.com/woodexs-projects/woodex-project
2. Click **Add Project** or **Import Project**
3. Select **GitHub** as source
4. Find and select `woodex420/woodex` repository
5. Click **Import**

### Step 2: Configure Build Settings

Vercel should auto-detect, but verify:

- **Framework**: Vite (or auto-detected)
- **Build Command**: `pnpm run build:prod`
- **Output Directory**: `dist`
- **Install Command**: `pnpm install --prefer-offline`

### Step 3: Add Environment Variables

In Vercel project settings → **Environment Variables**, add:

```
VITE_SUPABASE_URL=https://vocqqajpznqyopjcymer.supabase.co
VITE_SUPABASE_ANON_KEY=<YOUR_ANON_KEY>
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_... (if available)
VITE_CUSTOM_DOMAIN=woodex.vercel.app
```

**⚠️ IMPORTANT:** You need the actual Supabase anon key. Get it from:
- Supabase Dashboard: https://supabase.com/dashboard/project/vocqqajpznqyopjcymer
- Settings → API → Anon Key (starts with `eyJ...`)

### Step 4: Deploy

Click **Deploy** button in Vercel dashboard.

**Expected Output:**
```
✅ Building...
✅ Build succeeded
✅ Deploying...
✅ Deployment complete
🎉 Live URL: https://woodex-xxxx.vercel.app
```

---

## 🔧 Detailed Configuration Steps

### A. Connect Repository

**Via Vercel Dashboard:**

1. Go to: https://vercel.com/woodexs-projects/woodex-project
2. Click **+ Add New** → **Project**
3. Select **Import Git Repository**
4. Authorize GitHub if needed
5. Select `woodex420/woodex`
6. Click **Import**

**Vercel will:**
- Detect Vite framework automatically
- Set build command to `pnpm run build:prod`
- Set output to `dist/`

### B. Configure Environment Variables

**In Vercel:**
1. Go to **Settings** → **Environment Variables**
2. Add each variable:

| Variable | Value | Source |
|----------|-------|--------|
| `VITE_SUPABASE_URL` | `https://vocqqajpznqyopjcymer.supabase.co` | Supabase Dashboard |
| `VITE_SUPABASE_ANON_KEY` | `eyJ...` | Supabase Dashboard → API |
| `VITE_STRIPE_PUBLISHABLE_KEY` | `pk_test_...` | Stripe Dashboard (optional) |
| `VITE_CUSTOM_DOMAIN` | `woodex.vercel.app` | Auto-generated or custom |

**Get Supabase Anon Key:**
1. Visit: https://supabase.com/dashboard/project/vocqqajpznqyopjcymer
2. Click **Settings** (gear icon)
3. Go to **API** tab
4. Copy **Anon Key** (public, safe to share)
5. Paste into Vercel env vars

### C. Deploy

**Manual Deploy:**
1. In Vercel dashboard, click **Deploy**
2. Watch build logs
3. Wait for completion

**Auto Deploy (Recommended):**
1. Push changes to `main` branch: `git push origin main`
2. Vercel auto-triggers deployment
3. Check deployment status in Vercel dashboard

---

## ✅ Verification Checklist

After deployment, verify:

- [ ] Vercel build succeeded (check deployment logs)
- [ ] Live URL accessible: `https://woodex-xxxx.vercel.app`
- [ ] Page loads without errors (check DevTools console)
- [ ] Can log in with test account:
  - Email: `roeodggw@minimax.com`
  - Password: `ut7qa4SKF6`
- [ ] Admin dashboard loads
- [ ] E-commerce storefront displays products
- [ ] Can add items to cart
- [ ] Mobile responsive (test with DevTools)

---

## 🆘 Troubleshooting

### Build Fails: "Cannot find module"

**Solution:**
```bash
# In local terminal:
pnpm clean
pnpm install --prefer-offline
pnpm run build:prod
git push origin main  # Redeploy
```

### Blank Page or 404 on Live URL

**Check:**
1. Vercel build logs for errors
2. Environment variables set correctly
3. Browser DevTools Console (F12) for errors
4. Clear browser cache (Ctrl+Shift+Del)

### Login Not Working

**Check:**
1. `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` in Vercel env vars
2. Supabase project is active and accessible
3. User exists in Supabase (Dashboard → Authentication → Users)
4. Browser console for specific errors

### Products Not Loading

**Check:**
1. Supabase database has products (Dashboard → SQL Editor: `SELECT * FROM products;`)
2. RLS policies allow anon users to read products
3. API endpoint URLs are correct
4. Network tab (DevTools → Network) for failed requests

---

## 📊 Post-Deployment Monitoring

### Check Deployment Status

1. Vercel Dashboard → Recent Deployments
2. Click deployment → View deployment logs
3. Check for warnings or errors

### Monitor Performance

- Vercel Dashboard → Analytics
- Check page load times, error rates
- Monitor function invocations (if using Edge Functions)

### Enable Domain

1. Vercel Dashboard → **Domains**
2. Add custom domain or use auto-generated
3. Update DNS records if using custom domain
4. SSL certificate auto-generated

---

## 🎯 Next Steps After Deployment

### Phase 3: Pre-Launch Checklist
- [ ] Test all user flows on live Vercel deployment
- [ ] Admin dashboard functionality
- [ ] E-commerce checkout
- [ ] Product management
- [ ] Order management
- [ ] WhatsApp notifications (if enabled)

### Phase 4: Content & Customization
- [ ] Upload products via admin dashboard
- [ ] Customize site colors/branding
- [ ] Configure payment methods
- [ ] Set shipping rates
- [ ] Enable email notifications

### Phase 5+: Advanced Features
See `NEXT_PHASES.md` for:
- E-Commerce Platform Enhancement
- Quotation & PDF System
- WhatsApp CRM Integration
- Payment System Integration
- B2B Features
- Performance & SEO

---

## 📞 Quick Links

- **GitHub Repo**: https://github.com/woodex420/woodex
- **Vercel Project**: https://vercel.com/woodexs-projects/woodex-project
- **Supabase Dashboard**: https://supabase.com/dashboard/project/vocqqajpznqyopjcymer
- **Supabase API Settings**: https://supabase.com/dashboard/project/vocqqajpznqyopjcymer/settings/api
- **Test Account**: `roeodggw@minimax.com` / `ut7qa4SKF6`

---

## 📋 Environment Variables Reference

### All Required Variables

```dotenv
# Supabase (Required)
VITE_SUPABASE_URL=https://vocqqajpznqyopjcymer.supabase.co
VITE_SUPABASE_ANON_KEY=<YOUR_ANON_KEY_HERE>

# Stripe (Optional - for payments)
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_xxx

# Custom Domain (Optional)
VITE_CUSTOM_DOMAIN=woodex.vercel.app
```

### Where to Find Each Variable

| Variable | Location |
|----------|----------|
| `VITE_SUPABASE_URL` | Supabase Dashboard → Settings → API → Project URL |
| `VITE_SUPABASE_ANON_KEY` | Supabase Dashboard → Settings → API → Anon Key |
| `VITE_STRIPE_PUBLISHABLE_KEY` | Stripe Dashboard → API Keys → Publishable Key |
| `VITE_CUSTOM_DOMAIN` | Vercel → Project → Domains (auto-assigned or custom) |

---

**Document Version:** 2.0  
**Created:** 28 November 2025  
**Status:** Ready for Deployment ✅
