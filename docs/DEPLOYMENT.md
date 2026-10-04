# WOODEX Deployment Guide

## Overview

This guide explains how to deploy the monorepo to Hostinger + Supabase for production.

## Required Services

- Supabase project
- Hostinger Node.js environment or VPS
- Stripe account
- SendGrid account
- Meta WhatsApp Business account

## Environment Variables

Copy `.env.example` to your deployment environment and fill in production values.

```bash
cp .env.example .env.production
```

## Frontend Deployment

### Vercel or Netlify
- deploy `apps/frontend`
- set env vars:
  - `VITE_SUPABASE_URL`
  - `VITE_SUPABASE_ANON_KEY`
  - `VITE_API_BASE_URL=https://api.yourdomain.com`

### Admin Deployment
- deploy `apps/admin`
- same env vars as frontend

## API Deployment (Hostinger)

1. Upload project to Hostinger Node.js instance
2. Install dependencies:

```bash
npm install
pnpm install
```

3. Build API:

```bash
cd apps/api
pnpm install
pnpm build
```

4. Start with PM2:

```bash
pm install -g pm2
pm run build
pm run start
```

5. Configure reverse proxy or Node server to expose on port 3001

## Supabase Setup

1. Create new project in Supabase
2. Run migrations in `supabase/migrations`
3. Configure RLS policies and storage buckets
4. Add environment values to admin/frontend apps

## Production Checklist

- [ ] database migrations applied
- [ ] Stripe keys configured
- [ ] SendGrid keys configured
- [ ] WhatsApp webhook configured
- [ ] API deployed and healthy
- [ ] frontend and admin connected to API
- [ ] domain mapping configured
- [ ] SSL enabled

## Health Check

```bash
curl http://localhost:3001/health
```
