# WOODEX Production Credentials & Setup Guide

## ⚠️ SECURE STORAGE
All credentials below should be stored securely in `.env.local` (never commit to git).

---

## 1. SUPABASE CONFIGURATION

### Project Information
**Project ID**: vocqqajpznqyopjcymer  
**Project URL**: https://vocqqajpznqyopjcymer.supabase.co  
**Status**: ✅ Active  

### Authentication Keys

#### Anon Key (Client-side)
```
EyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```
**Usage**: Frontend & Mobile  
**Permissions**: Public read, authenticated write  

#### Service Role Key (Server-side)
```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```
**Usage**: API server, scheduled jobs  
**Permissions**: Full database access  
⚠️ **NEVER expose in frontend code**

### Environment Variables
```bash
VITE_SUPABASE_URL=https://vocqqajpznqyopjcymer.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
VITE_SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here
```

---

## 2. DATABASE ACCESS

### Admin Account
**Email**: admin@woodex.local  
**Password**: Generate in Supabase → Project Settings → Database  

### Database Connection
```
Host: db.vocqqajpznqyopjcymer.supabase.co
Port: 5432
Database: postgres
Username: postgres
Password: [Generated in Supabase]
```

### Tables Structure
- `auth.users` - Authentication
- `public.profiles` - User profiles
- `public.products` - Product catalog
- `public.orders` - Orders
- `public.quotations` - Quotes
- `public.inventory` - Stock levels
- `public.deliveries` - Shipping
- `public.returns` - Return requests
- `public.order_status_history` - Audit trail
- `public.stock_movements` - Inventory tracking
- `public.delivery_zones` - Shipping zones (14 zones configured)

---

## 3. TEST ACCOUNTS

### Admin User
**Email**: roeodggw@minimax.com  
**Password**: ut7qa4SKF6  
**Role**: admin  
**Dashboard**: https://admin.woodex.com/dashboard  

### Customer User (Test)
**Email**: customer@test.com  
**Password**: Test@123456  
**Role**: customer  
**Storefront**: https://woodex.com  

### Editor User (Demo)
**Email**: editor@woodex.local  
**Password**: Editor@123456  
**Role**: editor  

---

## 4. STRIPE PAYMENT INTEGRATION

### Test Keys (Development)
```
Public Key: pk_test_51234567890123456789...
Secret Key: sk_test_98765432109876543210...
Webhook Secret: whsec_test_1234567890123456789...
```

### Live Keys (Production)
```
Public Key: pk_live_[Your live public key]
Secret Key: sk_live_[Your live secret key]
Webhook Secret: whsec_[Your webhook secret]
```

### Webhook Endpoint
```
URL: https://api.woodex.com/webhooks/stripe
Events: payment_intent.succeeded, charge.refunded
```

### Environment Variables
```bash
STRIPE_PUBLIC_KEY=pk_test_...
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
```

### Test Card Numbers
- **Success**: 4242 4242 4242 4242
- **Decline**: 4000 0000 0000 0002
- **3D Secure**: 4000 0025 0000 3155

---

## 5. SENDGRID EMAIL INTEGRATION

### API Configuration
```
API Key: SG.AbCdEfGhIjKlMnOpQrStUvWxYz...
From Email: noreply@woodex.com
From Name: WOODEX
Sender ID: 123456
```

### Email Templates
- **Order Confirmation** (Template ID: d-abc123)
- **Order Shipped** (Template ID: d-def456)
- **Return Approved** (Template ID: d-ghi789)
- **Password Reset** (Template ID: d-jkl012)

### Environment Variables
```bash
SENDGRID_API_KEY=SG.AbCdEfGhIjKlMnOpQrStUvWxYz...
SENDGRID_FROM_EMAIL=noreply@woodex.com
SENDGRID_FROM_NAME=WOODEX
```

---

## 6. WHATSAPP BUSINESS API

### Meta Business Account
```
Business Account ID: 123456789
Phone Number ID: 987654321
Access Token: EAACEdEose...[Very long token]
Webhook Verify Token: woodex_webhook_token_123
```

### Webhook Configuration
```
URL: https://api.woodex.com/webhooks/whatsapp
Verify Token: woodex_webhook_token_123
Events: messages, message_status
```

### Environment Variables
```bash
WHATSAPP_BUSINESS_ACCOUNT_ID=123456789
WHATSAPP_PHONE_NUMBER_ID=987654321
WHATSAPP_ACCESS_TOKEN=EAACEdEose...
WHATSAPP_WEBHOOK_VERIFY_TOKEN=woodex_webhook_token_123
```

---

## 7. HOSTINGER HOSTING

### VPS/Cloud Details
```
Hostname: your-server.hostinger.com
SSH Port: 22
Username: hostinger_user
Password: [Secure password]
```

### File Transfer
```
FTP Host: ftp.your-domain.com
FTP User: your_ftp_user
FTP Password: [Secure password]
```

### Node.js Configuration
```
Node Version: 18.x or 20.x
Port: 3001 (API)
Process Manager: PM2 or systemd
SSL: Let's Encrypt (free)
```

### Environment Variables (Production)
```bash
NODE_ENV=production
API_PORT=3001
API_HOST=0.0.0.0
JWT_SECRET=[Generate strong random string]
```

---

## 8. FRONTEND DEPLOYMENT

### Vercel Configuration
```
Project: woodex-frontend
Branch: main
Framework: Vite + React
Environment Variables:
  VITE_SUPABASE_URL
  VITE_SUPABASE_ANON_KEY
  VITE_API_BASE_URL=https://api.woodex.com
```

### Admin Dashboard (Vercel)
```
Project: woodex-admin
Branch: main
Framework: Vite + React
Environment Variables:
  VITE_SUPABASE_URL
  VITE_SUPABASE_ANON_KEY
  VITE_API_BASE_URL=https://api.woodex.com
```

---

## 9. JWT CONFIGURATION

### Generate Strong JWT Secret
```bash
# Generate 32-character random string
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### JWT Environment Variable
```bash
JWT_SECRET=your-generated-32-char-hex-string
```

### Token Configuration
- **Expiry**: 24 hours for access token
- **Refresh**: 7 days for refresh token
- **Algorithm**: HS256

---

## 10. SECURITY CHECKLIST

### Before Production Deploy
- [ ] All `.env` variables set with real credentials
- [ ] Service Role Key stored securely (not in code)
- [ ] Stripe keys switched to live keys
- [ ] SendGrid live account verified
- [ ] WhatsApp webhook configured
- [ ] Database backups configured (Supabase auto 2x/day)
- [ ] SSL certificate configured (Let's Encrypt)
- [ ] CORS configured for frontend domains
- [ ] Rate limiting enabled on API
- [ ] Database RLS policies verified

---

## 11. BACKUP & RECOVERY

### Supabase Automatic Backups
- **Frequency**: Every 24 hours
- **Retention**: 7 days
- **Location**: Supabase secure storage

### Manual Backup (PostgreSQL)
```bash
pg_dump -h db.vocqqajpznqyopjcymer.supabase.co \
  -U postgres -d postgres > backup.sql
```

### Restore from Backup
```bash
psql -h db.vocqqajpznqyopjcymer.supabase.co \
  -U postgres -d postgres < backup.sql
```

---

## 12. API KEYS ROTATION

### Recommended Rotation Schedule
- **Stripe Keys**: Every 90 days
- **SendGrid Keys**: Every 90 days
- **JWT Secret**: Every 180 days (requires token invalidation)
- **WhatsApp Token**: As needed by Meta

### Rotation Steps
1. Generate new key in service provider
2. Update `.env` variables
3. Restart API server
4. Monitor for errors
5. Revoke old key after verification

---

## Quick Reference

| Service | Env Variable | Status | Expires |
|---------|-------------|--------|----------|
| Supabase | VITE_SUPABASE_URL | ✅ | Never |
| Stripe | STRIPE_SECRET_KEY | ✅ | 90 days |
| SendGrid | SENDGRID_API_KEY | ✅ | 90 days |
| WhatsApp | WHATSAPP_ACCESS_TOKEN | ✅ | 3 months |
| JWT | JWT_SECRET | ✅ | 180 days |

---

**Last Updated**: November 2025  
**Version**: 2.0.0  
**Maintainer**: WOODEX Team
