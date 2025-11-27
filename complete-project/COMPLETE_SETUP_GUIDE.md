# Woodex Complete Setup & Deployment Guide

This guide covers everything needed to set up, test, deploy, and manage the Woodex e-commerce and admin platform from development through production.

---

## 🎯 Overview

The Woodex project consists of:
- **Admin Dashboard** (`src/` + `user_input_files/woodex-admin-dashboard/`)
- **E-Commerce Platform** (`src/` + `woodex-furniture-mpa/`)
- **Shared Services** (Supabase, Edge Functions, WhatsApp/CRM integrations)

**Current Live Instances:**
- Admin: https://ig4pphp2edwp.space.minimax.io
- E-Commerce: https://2oaw9w5vzwif.space.minimax.io
- Staging: https://jq5qqkov5cnw.space.minimax.io
- Test Account: `roeodggw@minimax.com` / `ut7qa4SKF6`

---

## 📋 Part 1: Prerequisites & Environment Setup

### 1.1 Required Tools
Ensure you have installed:
- **Node.js** v18+ (recommended v20 LTS)
- **pnpm** v9+: `npm install -g pnpm`
- **Git** (for version control)
- **GitHub CLI** (optional, for easier GitHub integration): `brew install gh` (macOS)

### 1.2 Verify Installation
```bash
node --version      # Should be v18 or higher
pnpm --version      # Should be v9 or higher
git --version
```

### 1.3 Get Supabase Credentials

1. Visit your Supabase project dashboard: https://supabase.com/dashboard/project/vocqqajpznqyopjcymer
2. Navigate to **Settings** > **API**
3. Copy:
   - **Project URL**: `https://vocqqajpznqyopjcymer.supabase.co`
   - **Anon Key**: (starts with `eyJ...`) — keep this secret
   - **Service Role Key**: (starts with `eyJ...`) — admin use only, keep very secret
4. Keep these values handy; you'll add them to `.env` files

---

## 🏠 Part 2: Local Development Setup

### 2.1 Clone & Install

```bash
cd /path/to/your/projects
git clone https://github.com/woodex420/woodex.git
cd woodex
```

If you already have the repo, update it:
```bash
git pull origin main
```

### 2.2 Create Environment File

Copy the example file and add your Supabase credentials:

```bash
cp complete-project/.env.example .env
```

Edit `.env` and fill in:
```dotenv
VITE_SUPABASE_URL=https://vocqqajpznqyopjcymer.supabase.co
VITE_SUPABASE_ANON_KEY=<paste your anon key here>
```

⚠️ **IMPORTANT**: Never commit `.env` to Git. The `.gitignore` should already exclude it.

### 2.3 Install Dependencies & Build

```bash
# Install all project dependencies
pnpm install --prefer-offline

# Run the production build locally
pnpm run build:prod

# Preview the production build
pnpm preview
```

If the build succeeds, the app will be available at: `http://localhost:4173`

**Expected Output:**
```
  ➜  Local:   http://localhost:4173/
  ➜  press h to show help
```

### 2.4 Test Login & Core Flows

1. Open http://localhost:4173 in your browser
2. Log in with test account:
   - Email: `roeodggw@minimax.com`
   - Password: `ut7qa4SKF6`
3. Verify you can:
   - View the admin dashboard (Products, Orders, Customers, etc.)
   - View the e-commerce storefront (Products, Cart, Checkout)
   - Create a quotation or add an item to cart

---

## 🔧 Part 3: Configuration & Customization

### 3.1 Product Upload & Content Management

**Via Admin Dashboard:**
1. Navigate to **Products** → **Add Product**
2. Fill in:
   - Product name, SKU, description
   - Price, cost price
   - Category, materials, finishes
   - Upload product images (PNG/JPG recommended, max 5MB each)
   - Mark as featured (for homepage display)
3. Click **Save**

**Via Supabase Dashboard (direct database):**
1. Go to https://supabase.com/dashboard/project/vocqqajpznqyopjcymer
2. Click **SQL Editor** → **New Query**
3. Example insert:
   ```sql
   INSERT INTO products (name, sku, description, price, category_id, is_featured, is_active, stock_status)
   VALUES ('Modern Sofa', 'SOFA-001', 'Comfortable modern sofa', 25000, 'cat-1', true, true, 'in_stock');
   ```

### 3.2 Styling & Theme Customization

- **Tailwind CSS**: `/tailwind.config.js` — modify colors, spacing, fonts
- **CSS Variables**: `/src/index.css` — global theme colors
- **Component styles**: Each component has inline Tailwind classes

To customize colors:
1. Edit `tailwind.config.js`
2. Rebuild: `pnpm run build:prod`
3. Restart preview: `pnpm preview`

### 3.3 Image Upload & Storage

Images are stored in **Supabase Storage**:

**Upload via admin UI:**
- Products page → select images during product creation
- Images auto-upload to Supabase bucket

**Upload via Supabase Dashboard:**
1. Go to **Storage** tab
2. Click the `products` bucket
3. Click **Upload** → select image files
4. Reference in database: copy the file path/URL

---

## 🧪 Part 4: Testing & Validation

### 4.1 Build & Preview Validation

```bash
# Clean and rebuild
pnpm clean
pnpm install --prefer-offline
pnpm run build:prod

# Verify build succeeded
if [ -d "dist" ]; then
  echo "✅ Build OK"
  pnpm preview
else
  echo "❌ Build failed"
  pnpm lint  # check for errors
fi
```

### 4.2 Test Account Flows

**Admin Flow:**
1. Log in → Dashboard
2. Create a product
3. View orders (from test customers)
4. Update order status

**E-Commerce Flow:**
1. Browse products
2. Add item to cart
3. Enter address (use any valid Pakistani postal code)
4. Calculate shipping
5. Complete checkout (test with test payment method if configured)

### 4.3 Error Checking

If you encounter errors:

**Build errors:**
```bash
pnpm lint          # Check for code issues
pnpm run build     # Try standard build (less strict)
```

**Runtime errors (check browser console):**
- Open **DevTools** (F12 or Cmd+Option+I)
- Go to **Console** tab
- Look for red error messages
- Common issues: missing env vars, CORS errors, auth issues

**Supabase connection errors:**
- Verify `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` in `.env`
- Check Supabase project is active: https://supabase.com/dashboard
- Check row-level security (RLS) policies: some tables may be read-only for anon users

---

## 📤 Part 5: GitHub Setup & Version Control

### 5.1 Initialize Git (if not already done)

```bash
git init
git add .
git commit -m "Initial Woodex project setup with complete configuration"
git branch -M main
git remote add origin https://github.com/woodex420/woodex.git
git push -u origin main
```

### 5.2 Create Feature Branches

For each new feature, create a branch:

```bash
# Feature branch
git checkout -b feature/products-catalog
# ... make changes ...
git add .
git commit -m "Add product filtering and search"
git push origin feature/products-catalog

# Then create a Pull Request on GitHub
```

### 5.3 Protect Main Branch

On GitHub:
1. Go to **Settings** → **Branches**
2. Add rule for `main` branch:
   - ✅ Require pull request reviews
   - ✅ Require status checks to pass
   - ✅ Require up-to-date branches
3. Save

---

## 🚀 Part 6: GitHub Actions CI/CD

### 6.1 Create Workflow File

Create `.github/workflows/ci.yml`:

```yaml
name: CI Build & Test

on:
  push:
    branches: [ main, develop ]
  pull_request:
    branches: [ main ]

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      
      - uses: pnpm/action-setup@v2
        with:
          version: 9
      
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'pnpm'
      
      - run: pnpm install --prefer-offline
      
      - run: pnpm lint
      
      - run: pnpm run build:prod
      
      - name: Upload dist for deployment
        uses: actions/upload-artifact@v4
        with:
          name: dist
          path: dist
```

### 6.2 Commit Workflow

```bash
git add .github/workflows/ci.yml
git commit -m "Add GitHub Actions CI pipeline"
git push origin main
```

Now, every push to `main` will trigger an automated build check! ✅

---

## 🌐 Part 7: Vercel Deployment

### 7.1 Create Vercel Account & Project

1. Visit https://vercel.com/signup
2. Sign up with GitHub account
3. Click **New Project**
4. Select your `woodex` repository
5. Click **Import**

### 7.2 Configure Environment Variables

In Vercel project settings:
1. Go to **Settings** → **Environment Variables**
2. Add:
   - Name: `VITE_SUPABASE_URL`
     Value: `https://vocqqajpznqyopjcymer.supabase.co`
   - Name: `VITE_SUPABASE_ANON_KEY`
     Value: `<paste your anon key>`
   - (Repeat for all env vars in `.env`)

### 7.3 Configure Build Settings

1. Go to **Settings** → **Build & Development**
2. Set:
   - **Build Command**: `pnpm run build:prod`
   - **Output Directory**: `dist`
   - **Install Command**: `pnpm install --prefer-offline`
3. Save

### 7.4 Deploy

Option A: **Automatic** (recommended)
- Push to `main` → Vercel auto-deploys

Option B: **Manual**
- In Vercel dashboard, click **Deploy** button

**Verify deployment:**
- Visit the Vercel-provided URL (e.g., `https://woodex-123.vercel.app`)
- Test login and core flows

### 7.5 Custom Domain

1. In Vercel: **Settings** → **Domains**
2. Add your domain (e.g., `woodex.com`)
3. Update DNS records per Vercel instructions
4. SSL cert auto-generated

---

## 📊 Part 8: Content & Feature Management

### 8.1 Product Management

**Add Products:**
- Admin Dashboard → Products → Add Product
- Fill form, upload images, save

**Edit Products:**
- Admin Dashboard → Products → click product
- Modify fields, save changes

**Delete Products:**
- Admin Dashboard → Products → click product → Delete (be careful!)

### 8.2 Customer Management

**View Customers:**
- Admin Dashboard → Customers
- Search by name, email, phone

**Export Customer Data:**
- Click customer → View details
- (Export feature can be added as needed)

### 8.3 Order Management

**View Orders:**
- Admin Dashboard → Orders
- Filter by status (pending, confirmed, shipped, delivered)

**Update Order Status:**
- Click order → Update Status dropdown
- Select new status (e.g., "shipped")
- Auto-triggers notifications

**View Deliveries:**
- Admin Dashboard → Deliveries
- Track shipment status and delivery dates

### 8.4 Quotations & PDFs

**Generate Quotation:**
- Admin Dashboard → Quotations → Create Quotation
- Select customer & products
- Add pricing, discount, terms
- Click **Generate PDF**

**Send Quotation:**
- Quotation detail → Send Email
- Auto-sends to customer email

### 8.5 WhatsApp Integration

**Send WhatsApp Messages:**
- (Requires WhatsApp Business API setup)
- Admin Dashboard → WhatsApp
- Select customer, type message, send

**Automated Messages:**
- Order confirmations
- Delivery updates
- Quote follow-ups
(Configure in WhatsApp settings)

---

## 🔒 Part 9: Security Best Practices

### 9.1 Environment Variables

**DO:**
- Store secrets in Vercel env vars (not in repo)
- Use `.env.example` as a template
- Rotate anon keys if compromised

**DON'T:**
- Commit `.env` to GitHub
- Share API keys in chat/email
- Use same keys for dev & production

### 9.2 Row-Level Security (RLS)

Supabase RLS ensures users only see their data:

1. Go to Supabase Dashboard → **Authentication** → **Policies**
2. Each table should have policies:
   - Authenticated users: SELECT own records
   - Admins: SELECT/UPDATE/DELETE all records
3. Verify policies are enabled

### 9.3 API Keys & Secrets

**Never hardcode credentials in source!**

Instead:
```typescript
// ✅ GOOD: Use environment variables
const key = import.meta.env.VITE_SUPABASE_ANON_KEY;

// ❌ BAD: Hardcoded (gets exposed in public builds)
const key = "eyJ...";
```

---

## 🆘 Part 10: Troubleshooting & Support

### Issue: Build fails with "Cannot find module"

**Solution:**
```bash
pnpm clean
pnpm install --prefer-offline
pnpm run build:prod
```

### Issue: Login not working

**Check:**
1. Email/password correct?
2. User exists in Supabase? (Dashboard → **Authentication** → **Users**)
3. `.env` has correct `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`?

### Issue: Products not showing

**Check:**
1. Products exist in Supabase? (Dashboard → **SQL Editor** → `SELECT * FROM products;`)
2. Is `is_active = true`?
3. Check browser console (F12) for errors
4. Check Supabase RLS policies

### Issue: Orders not updating

**Check:**
1. Edge Function `order-status-updater` exists? (Dashboard → **Edge Functions**)
2. Is the function enabled and has no errors?
3. User has `admin` role? (Check RLS policies)
4. Correct API endpoint in code?

### Issue: WhatsApp not sending

**Check:**
1. WhatsApp Business API configured?
2. Correct phone number format?
3. Webhook secret valid?
4. Edge Function `whatsapp-message-handler` enabled?

### Debug Mode

Enable verbose logging:
```bash
DEBUG=* pnpm preview
```

Check browser DevTools Console (F12) for errors.

---

## 📋 Pre-Launch Checklist

Before going live:

- [ ] Test all flows locally (`pnpm preview`)
- [ ] Build succeeds without errors (`pnpm run build:prod`)
- [ ] GitHub Actions CI passes ✅
- [ ] Vercel deployment successful
- [ ] Test login works
- [ ] Can create/edit products
- [ ] Can place orders
- [ ] Can update order status
- [ ] Admin & e-commerce both accessible
- [ ] Mobile responsive test (use browser DevTools)
- [ ] SSL certificate working (check browser lock icon)
- [ ] Analytics/tracking enabled (if desired)
- [ ] Email notifications working
- [ ] WhatsApp notifications working (if enabled)
- [ ] Backup Supabase data
- [ ] Document any custom changes/extensions

---

## 📞 Next Steps & Support

### Quick Links
- Supabase Dashboard: https://supabase.com/dashboard/project/vocqqajpznqyopjcymer
- GitHub Repository: https://github.com/woodex420/woodex
- Vercel Dashboard: https://vercel.com
- Current Admin: https://ig4pphp2edwp.space.minimax.io
- Current E-Commerce: https://2oaw9w5vzwif.space.minimax.io

### Phase 5+: Enhanced Features

See `NEXT_PHASES.md` for roadmap:
- E-Commerce Platform Integration & Enhancement
- E-Quotation & PDF System
- WhatsApp CRM Integration
- Payment System & Order Management
- B2B Enterprise Features
- Performance Optimization & SEO
- Marketing Website & User Documentation
- Testing, Deployment & Launch

### Questions?

Refer to:
- `README_DEPLOYMENT.md` for deployment details
- `PHASE4_COMPLETE_SUMMARY.md` for Phase 4 system status
- Supabase docs: https://supabase.com/docs
- Vite docs: https://vitejs.dev

---

**Document Version:** 1.0  
**Last Updated:** 28 November 2025  
**Maintained by:** Woodex Development Team
