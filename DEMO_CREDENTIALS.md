# Demo Credentials - Temporary Testing

> ⚠️ **IMPORTANT**: These are temporary demo accounts for testing purposes only. They should be replaced with proper authentication before production deployment.

## Local Admin Account (no Supabase required) ✅

The login page has a **conditional branch**: if the username is `admin` and the
password is `admin`, the app signs you in locally — no Supabase project, no
network call, no user row in `auth.users`. Any other username/password
combination still goes through normal Supabase authentication.

### Username
```
admin
```

### Password
```
admin
```

### How it works

| Step | Behaviour |
| --- | --- |
| Submit `admin` / `admin` | `isLocalAdminLogin()` matches → a session is minted and stored in `localStorage` under `woodex.local-admin-session` |
| Submit anything else | Falls through to `supabase.auth.signInWithPassword()` exactly as before |
| Reload the page | The persisted local session is restored, so you stay signed in |
| Click **Logout** | The local session is cleared (and Supabase is signed out too, when configured) |

The local session signs you in as a synthetic `admin` profile
(`Administrator`, role `admin`), so every dashboard route renders and the
header shows a **Local admin** badge.

Also accepted as the username: `ADMIN` (case-insensitive), `admin@woodex.local`,
`admin@woodex-demo.com`. The password must match exactly.

### Implementation

- `src/lib/auth.ts` — the conditional check, session minting/persistence, and sign-out
- `src/pages/LoginPage.tsx` — username-or-email field + the conditional branch
- `src/App.tsx` — restores a local session on boot (takes priority over Supabase)
- `src/layouts/DashboardLayout.tsx` — logout clears the local session

### ⚠️ Security caveat

This gate lives entirely in the browser, so **it is not access control**. The
`admin` / `admin` pair is visible in the shipped JavaScript bundle and to anyone
who reads this file. It exists to make the demo reachable. Real data access is
still governed by Supabase Row Level Security — with the local admin you get the
UI, but tables stay empty until Supabase is configured with real credentials.

Before production: change or remove `ADMIN_USERNAME` / `ADMIN_PASSWORD` in
`src/lib/auth.ts`, or delete the local branch entirely.

### Note on data

The local admin unlocks the **interface**. Product/customer/order data is still
fetched from Supabase, so pages show empty states (and `0` counters) when
`VITE_SUPABASE_URL` / `VITE_SUPABASE_ANON_KEY` are not set. When they are
missing or still placeholders, the login page shows an amber notice explaining
that email sign-in is disabled.

---

## Supabase Admin Account

### Email
```
admin@woodex-demo.com
```

### Password
```
Demo@Woodex2024
```

### How to Use

1. **Local Development**
   - Set up your `.env` file with Supabase credentials (see `.env.example`)
   - Create the demo user in your Supabase project
   - Navigate to login page at `http://localhost:5173`
   - Use credentials above

2. **Deployed Instance**
   - You'll need to set up a Supabase project and manually create this user account
   - Contact the project owner (@woodex420) for access to the live deployment

## Setting Up Demo User in Supabase

### Method 1: Via Supabase Console
1. Go to your Supabase project dashboard
2. Navigate to Authentication > Users
3. Click "Add user"
4. Email: `admin@woodex-demo.com`
5. Password: `Demo@Woodex2024`
6. Click "Create user"

### Method 2: Create Profile (if needed)
After creating the auth user, add a profile record:

```sql
INSERT INTO profiles (id, full_name, role, email, created_at, updated_at)
SELECT id, 'Demo Admin', 'admin', email, now(), now()
FROM auth.users 
WHERE email = 'admin@woodex-demo.com';
```

## Features to Test

### Dashboard
- View analytics and KPIs
- Recent orders and quotations
- Sales performance

### Products Management
- Create/Edit/Delete products
- Manage inventory
- Set pricing and discounts

### Customers
- Add new customers (B2B/B2C)
- Manage customer profiles
- Track customer interactions

### Quotations
- Create quotations
- Track quotation status
- Generate PDF quotes

### Orders
- Process orders
- Update order status
- Track order history

### Inventory
- Monitor stock levels
- Create stock adjustments
- Set reorder points

### Deliveries
- Manage delivery tracking
- Update delivery status
- Assign delivery zones

### Returns
- Process return requests
- Approve/Reject returns
- Track return status

### Analytics
- View revenue trends
- Monitor customer metrics
- Track WhatsApp engagement

### WhatsApp Integration
- Send messages
- Track conversations
- Manage customer communications

## Temporary Nature

⏰ **This demo account is temporary** and intended only for:
- Feature testing
- UI/UX evaluation
- Workflow verification

### When Moving to Production:
1. ✅ Create real admin accounts with strong passwords
2. ✅ Remove this demo account from production
3. ✅ Enable 2FA for admin accounts
4. ✅ Set up proper role-based access control
5. ✅ Implement audit logging
6. ✅ Delete this file or move to a secure documentation system

## Troubleshooting

### Login Issues
- Verify `.env` has correct Supabase credentials
- Check that the user exists in your Supabase project
- Clear browser cache and cookies
- Check browser console for error messages

### Accessing Live Deployment
- The live deployment at `https://woodex-store.vercel.app/` **is** reachable with the local admin account: username `admin`, password `admin` (see the top of this file)
- The Supabase demo account (`admin@woodex-demo.com`) only works if that user was actually created in the project's Supabase instance
- Deep links such as `/dashboard` are handled by the SPA rewrite in `vercel.json`; without it Vercel returns `404: NOT_FOUND` on a hard refresh

## Alternative: Run Locally

```bash
# Clone the repository
git clone https://github.com/woodex420/woodex.git
cd woodex

# Install dependencies
pnpm install

# Create and configure .env
cp .env.example .env
# Edit .env with your Supabase credentials

# Start development server
pnpm dev

# Visit http://localhost:5173
# Use demo credentials above
```

## Security Notes

- 🔐 Never commit real credentials to version control
- 🔐 Store sensitive data in environment variables
- 🔐 Use strong, unique passwords in production
- 🔐 Enable authentication logging and monitoring
- 🔐 Rotate credentials regularly

---

**Last Updated**: September 1, 2026  
**For Support**: Contact @woodex420 on GitHub
