# 🚀 WOODEX DEPLOYMENT QUICK START

## Command Reference

### Local Development
```bash
cd "/Users/macbook/Documents/Project/Woodex final project /woodex website"
pnpm install --prefer-offline
pnpm run dev
```

### Build for Production
```bash
pnpm run build:prod
pnpm run preview
```

### Git Operations
```bash
# Check status
git status

# Stage all changes
git add -A

# Commit
git commit -m "your message"

# Push to main
git push -u origin main
```

## 🌐 URLs Reference

### GitHub Repository
- **URL**: https://github.com/woodex420/woodex.git
- **Branch**: main
- **Status**: ✅ Ready to deploy

### Vercel Deployment
- **Team**: woodexs-projects
- **Import URL**: https://vercel.com/new?teamSlug=woodexs-projects
- **Expected URL**: https://woodex-ecommerce.vercel.app

### Supabase Backend
- **Dashboard**: https://supabase.com/dashboard/project/vocqqajpznqyopjcymer
- **URL**: https://vocqqajpznqyopjcymer.supabase.co
- **Tables**: 19525 schema available

### Website Live Preview
- **Minimax**: https://2oaw9w5vzwif.space.minimax.io/
- **Dashboard**: Complete admin system ready

## 📋 Environment Variables

```env
VITE_SUPABASE_URL=https://vocqqajpznqyopjcymer.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZvc3FxYWpwem5xeW9wamN5bWVyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzE0MjI2OTcsImV4cCI6MjA0Njk5ODY5N30.wYbU-3bI1b4hT6w_8Q5nG7q7y6n5dY0q0bJ8sXcF5o
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_your_key_here
VITE_CUSTOM_DOMAIN=woodex.vercel.app
```

## ⚡ Vercel Deployment Flow

1. **Go to**: https://vercel.com/new?teamSlug=woodexs-projects
2. **Select**: GitHub → woodex repository
3. **Configure**:
   - Framework: Vite
   - Build: `pnpm run build`
   - Output: `dist`
   - Install: `pnpm install --prefer-offline`
4. **Add Environment**: Paste variables above
5. **Deploy**: Click Deploy button
6. **Monitor**: Watch build logs

## ✅ Current Status

| Item | Status |
|------|--------|
| Project Code | ✅ Complete |
| Git Remote | ✅ Fixed (https://github.com/woodex420/woodex.git) |
| Local Build | ✅ Ready |
| SEO Assets | ✅ Added |
| Environment Config | ✅ Configured |
| Supabase Connection | ✅ Ready |
| GitHub Commit | ✅ 8cabe15 |
| Ready to Deploy | ✅ YES |

## 🎯 Next Actions

1. ✅ Confirm GitHub push successful
2. ⏳ Create Vercel project (click link above)
3. ⏳ Monitor deployment
4. ⏳ Test all features
5. ⏳ Add custom domain (optional)

---

**Deployment Ready**: 25 November 2025, 00:35 UTC
