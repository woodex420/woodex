# Woodex Release Package — Quick Reference

This folder contains all resources needed to deploy Woodex as a production-ready project.

## 📂 Contents

| File | Purpose |
|------|---------|
| `README_PRODUCTION.md` | Quick start & live URLs |
| `COMPLETE_SETUP_GUIDE.md` | 10-part comprehensive setup, test, deploy guide |
| `DEPLOY.md` | Deployment steps for Vercel/Netlify/GitHub |
| `NEXT_PHASES.md` | Roadmap: remaining features & phases |
| `.env.example` | Template for local environment configuration |
| `.gitignore` | Recommended git ignores (node_modules, .env, etc.) |
| `prepare_release.sh` | Helper script to build & package for upload |

## 🚀 Quick Start (Pick One)

### Option A: Local Development (Fastest for Testing)
```bash
cp complete-project/.env.example .env
# Edit .env with your Supabase credentials
pnpm install --prefer-offline
pnpm run build:prod
pnpm preview
# Open http://localhost:4173
```

### Option B: Deploy to Vercel (Automatic Deploys)
```bash
# Push to GitHub
git add .
git commit -m "Ready for Vercel"
git push origin main

# On GitHub: connect repo to Vercel at https://vercel.com
# Add env vars in Vercel dashboard
# Auto-deploys on every push to main
```

### Option C: Prepare Release Package (For QA/Sharing)
```bash
sh complete-project/prepare_release.sh
# Creates complete-project/release-dist/ with production build
# Zip and share or upload to server
```

## 🔑 Environment Variables Required

| Variable | Example | Where to Get |
|----------|---------|--------------|
| `VITE_SUPABASE_URL` | `https://vocqqajpznqyopjcymer.supabase.co` | Supabase Dashboard → Settings → API |
| `VITE_SUPABASE_ANON_KEY` | `eyJ...` (your anon key) | Same location as above |

⚠️ **NEVER commit `.env` to GitHub.** Use `.env.example` as template.

## ✅ Pre-Launch Checklist

- [ ] Build succeeds: `pnpm run build:prod`
- [ ] CI passes: GitHub Actions green ✅
- [ ] Test login works: `roeodggw@minimax.com / ut7qa4SKF6`
- [ ] Admin dashboard accessible
- [ ] E-commerce storefront accessible
- [ ] Products display correctly
- [ ] Cart & checkout flows work
- [ ] Orders sync between admin & e-commerce
- [ ] SSL certificate valid
- [ ] Mobile responsive (test on DevTools)

## 📞 Support & Links

- **Supabase Dashboard**: https://supabase.com/dashboard/project/vocqqajpznqyopjcymer
- **GitHub**: https://github.com/woodex420/woodex
- **Current Admin**: https://ig4pphp2edwp.space.minimax.io
- **Current E-Commerce**: https://2oaw9w5vzwif.space.minimax.io

## 📖 Full Documentation

For detailed setup, testing, and deployment procedures, see **COMPLETE_SETUP_GUIDE.md** (10 sections with step-by-step instructions).

---

**Ready to deploy?** Start with `COMPLETE_SETUP_GUIDE.md` Part 1–7 for a complete walkthrough.
