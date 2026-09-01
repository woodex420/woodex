# Demo Credentials - Temporary Testing

> ⚠️ **IMPORTANT**: These are temporary demo accounts for testing purposes only. They should be replaced with proper authentication before production deployment.

## Admin Account

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
- The live deployment at `https://woodex-store.vercel.app/` is not accessible with these demo credentials
- Contact @woodex420 for temporary access or instructions to set up your own instance

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
