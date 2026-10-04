# WOODEX Production-Ready Monorepo

**Status**: ✅ Phase 4 Complete - Production Ready

## Overview

This is a full-stack e-commerce monorepo for a furniture business, featuring:
- **Frontend**: Customer-facing storefront (woodex-reimagined)
- **Admin Dashboard**: Management interface for products, orders, inventory
- **API Layer**: Node.js/Express backend with business logic
- **Database**: Supabase (PostgreSQL) with real-time capabilities
- **Integrations**: Stripe (payments), SendGrid (emails), WhatsApp (messaging)

## Project Structure

```
woodex-admin/
├── apps/
│   ├── frontend/          # Customer storefront
│   ├── admin/             # Admin dashboard
│   └── api/               # Node.js/Express API
├── packages/
│   ├── shared-types/      # Shared TypeScript types
│   └── supabase-client/   # Reusable Supabase queries
├── supabase/              # Database migrations & functions
├── docs/                  # Documentation
└── package.json           # Root monorepo config
```

## Quick Start

### Prerequisites
- Node.js >= 18.0.0
- pnpm >= 8.0.0
- Supabase account with project created
- Stripe account (for payments)
- SendGrid account (for emails)

### Installation

```bash
# Clone the repository
git clone https://github.com/woodex420/woodex.git
cd woodex

# Checkout woodex-admin branch
git checkout woodex-admin

# Install dependencies
pnpm install

# Configure environment
cp .env.example .env.local
# Edit .env.local with your credentials

# Start development
pnpm dev
```

## Credentials & Access

### Test Account (Admin)
**Email**: roeodggw@minimax.com  
**Password**: ut7qa4SKF6  
**Role**: Admin  

### Supabase Project
**Project URL**: vocqqajpznqyopjcymer.supabase.co  
**Status**: Active and configured  

### API Endpoints
- **Frontend API**: http://localhost:3001 (development)
- **Admin API**: http://localhost:3001 (same backend)
- **Supabase Functions**: https://vocqqajpznqyopjcymer.supabase.co/functions/v1

## Development Scripts

```bash
# Start all services in development
pnpm dev

# Build all apps
pnpm build

# Format code
pnpm format

# Install dependencies
pnpm install-deps

# Clean builds and node_modules
pnpm clean
```

## Deployment

### Frontend & Admin
```bash
# Deploy to Vercel/Netlify
pnpm build
# Push to your hosting provider
```

### API (Hostinger)
See [docs/DEPLOYMENT.md](./docs/DEPLOYMENT.md) for Hostinger setup guide.

## Documentation

- [Architecture Overview](./docs/ARCHITECTURE.md)
- [API Documentation](./docs/API.md)
- [Database Schema](./docs/DATABASE.md)
- [Deployment Guide](./docs/DEPLOYMENT.md)
- [Feature List](./docs/FEATURES.md)
- [Integration Setup](./docs/INTEGRATIONS.md)

## Key Features

### Phase 1 (Complete)
- ✅ Customer authentication & profiles
- ✅ Product catalog with images
- ✅ Shopping cart & checkout
- ✅ Stripe payment integration
- ✅ Order management
- ✅ Admin dashboard

### Phase 2 (Complete)
- ✅ Quotation system
- ✅ Customer management
- ✅ WhatsApp integration
- ✅ Order tracking

### Phase 4 (Complete)
- ✅ Inventory management
- ✅ Delivery tracking
- ✅ Returns & refunds
- ✅ Order status history
- ✅ Stock movements
- ✅ 14 delivery zones configured

## Live Deployments

- **Admin Dashboard**: https://admin.woodex.com
- **Customer Storefront**: https://woodex.com
- **Supabase Dashboard**: https://supabase.com/dashboard

## Support

For issues or questions, contact the development team.

---

**Version**: 2.0.0  
**Last Updated**: November 2025  
**Status**: Production Ready ✅
