# Phase 4: Content & Customization Tasks

This checklist covers content and customization tasks you should perform after the app is live.

## 1. Branding & Theme
- Update `tailwind.config.js` colors and re-run build
- Update `src/index.css` CSS variables if needed
- Replace logos and favicon in `public/`
- Set site title and meta tags in `index.html`

## 2. Product Upload
- Use Admin Dashboard → Products → Add Product
- Recommended image format: PNG/JPG, max 5MB
- Add categories and tags
- Verify images upload to Supabase Storage

## 3. Shipping & Taxes
- Configure shipping zones and rates (admin panel)
- Add tax rules if applicable

## 4. Payments
- If using Stripe, set keys in Vercel env vars:
  - `VITE_STRIPE_PUBLISHABLE_KEY`
  - `STRIPE_SECRET_KEY` (server-side)
- Test payments in sandbox mode

## 5. Notifications
- Configure email notifications (SMTP or transactional service)
- Configure WhatsApp notifications if integrated

## 6. SEO & Analytics
- Add Google Analytics / GA4 tracking ID to env
- Verify sitemap and robots.txt
- Test core vitals and Lighthouse

## 7. QA Checklist
- Mobile responsiveness check
- Product purchase end-to-end test
- Order status updates & notifications
- Quotation generation & PDF export

## 8. Backup & Monitoring
- Schedule periodic Supabase backups
- Configure Sentry or other error monitoring (optional)

## 9. Go-Live Checklist (final)
- Confirm all env vars are set in Vercel
- Run smoke test script:
  ```bash
  ./scripts/test-deployment.sh https://your-vercel-url
  ```
- Verify admin login, product pages, checkout flows
- Announce launch to stakeholders

---

If you want, I can begin performing some of these tasks automatically (uploading images, creating sample products) — I will need API keys and permissions for Supabase (service-role key) and Vercel (VERCEL_TOKEN). Otherwise I will provide exact CLI commands and step-by-step instructions for you to run.
