# Phase 2 — Schema Reconciliation & Monorepo Merge Plan

> Prerequisite analysis for the monorepo consolidation described in
> [`ROADMAP.md`](./ROADMAP.md) §4 Phase 2. **Read before merging branch
> `woodex-admin`.**

---

## 1. The scaffold on branch `woodex-admin` is good — adopt it

| File | Content | Verdict |
|---|---|---|
| `pnpm-workspace.yaml` | `apps/*`, `packages/*` | ✅ Adopt as-is |
| `package.json` | `woodex-monorepo` v2.0.0 · `pnpm -r run build/dev/lint/test/clean` · prettier + typescript · `engines: node>=18, pnpm>=8` | ✅ Adopt as-is |
| `apps/admin`, `apps/api`, `apps/frontend` | Admin (10 pages) · API (`routes/orders`, `routes/products`, `lib/supabase`) · Storefront (Shop, ProductDetail, Cart, Checkout, OrderTracking, Auth/Cart contexts, NotFound) | ✅ Adopt structure |
| `packages/shared-types`, `packages/supabase-client` | Shared TS types + one Supabase client | ✅ Adopt |
| `docs/ARCHITECTURE.md`, `DEPLOYMENT.md` | — | ✅ Adopt |
| `docs/CREDENTIALS.md` | **Not opened.** | ⚠️ Review + rotate before merge |
| `supabase/migrations/001_init_schema.sql` | **9 tables only** | ❌ **Do NOT adopt as authoritative** |

---

## 2. Why `001_init_schema.sql` must not become the schema

The branch consolidates the schema into **9 tables**:
`products, orders, quotations, profiles, inventory, returns, stock_movements, delivery_zones, deliverables`.

`main` defines far more, across **two** locations that were never reconciled:

| Source | Distinct tables |
|---|---|
| `supabase/tables/*.sql` | **36** |
| `supabase/migrations/*.sql` (`CREATE TABLE`) | **20** |
| branch `001_init_schema.sql` | **9** |
| **Union of all three** | **49** |

Adopting the branch file as authoritative would silently drop **~40 tables** —
including every CMS, CRM and automation table that the agency platform depends
on (`blog_posts`, `services`, `faqs`, `testimonials`, `media_assets`,
`customer_interactions`, `customer_journey_events`, `b2b_companies`,
`b2b_users`, `quotation_templates`, `pricing_rules`, `user_permissions`,
`user_activity_log`, `virtual_rooms`, `room_packages`, and all six
`whatsapp_*` tables).

### Exactly one table is unique to the branch

`deliverables` — defined nowhere in `main`. It is the **only** genuine addition
and must be carried across.

`delivery_zones`, `returns` and `stock_movements` appear in both the branch and
`main`'s migrations, so they reconcile cleanly.

### The UI is currently coherent

All **17** tables queried by `src/` resolve to a definition in the union. There
are **no orphan queries** — so the merge is a schema-*organisation* problem, not
a broken-app problem. That is what makes it safe to do deliberately.

---

## 3. Overlap introduced by the Catalog Bridge

`supabase/migrations/1762500000_woodex_catalog_bridge.sql` added
**`series`, `materials`, `projects`, `newsletter_subscribers`** plus 12 new
`products` columns. These already appear in the migration set (source B above).

**Conflict to resolve:** the bridge's `products` columns (`source_id`,
`subcategory`, `series_id`, `short_description`, `original_price`, `currency`,
`colors`, `specifications`, `features`, `rating`, `reviews_count`,
`is_best_seller`, `is_new`) are **absent** from the branch's
`001_init_schema.sql`. Whichever schema wins, the storefront's 148 real
products need those columns or the import fails.

---

## 4. Naming conflicts to settle (decide once, apply everywhere)

| Concept | `main` | reimagined `BLUEPRINT.md` | Recommendation |
|---|---|---|---|
| Quotes | `quotations`, `quotation_items` | `quotes`, `quote_items` | Keep **`quotations`** (already deployed with data) |
| Leads | `customers` (+ `lead_score`, `status`) | `leads` | Keep **`customers`**, add `source_url` + `utm_*` + `assigned_to` + `stage` |
| Roles | `profiles.role` = `admin\|editor\|viewer` | `app_role` = `admin\|sales\|editor` | Union → **`admin\|sales\|editor\|viewer`**; `viewer` is already used by the UI |
| Product id | `products.id UUID` + new `source_id TEXT` | string ids (`exec-desk-01`) | `source_id` bridge already solves this |
| Price | `base_price DECIMAL` | `price` / `pricePkr` | Keep **`base_price`** + `currency` (added by the bridge) |

---

## 5. Merge sequence

1. **Back up Supabase** — hard prerequisite, real data.
2. Branch from current `arena/01a107c2-woodex` (has Phase 0 + bridge + Phase 1).
3. Copy the **structure only** from `woodex-admin`: `pnpm-workspace.yaml`, root `package.json`, `apps/*`, `packages/*`, `docs/ARCHITECTURE.md`, `docs/DEPLOYMENT.md`.
4. **Keep `main`'s full schema.** Add a single new migration creating only `deliverables`, harmonised with the existing naming conventions.
5. Move the current `src/` into `apps/admin/src/`; preserve the 17 shadcn components by lifting them to `packages/ui`.
6. Move `woodex-reimagined` in as `apps/storefront`; repoint its static `src/data/*` imports at `packages/supabase-client`.
7. Delete the five legacy sibling apps (`woodex-ecommerce`, `woodex-furniture-mpa`, `woodex-furniture-v2`, `woodex-master`, `complete-project`) — all named `react_repo`, none deployed.
8. Update `.github/workflows/ci.yml` to `pnpm -r build` and keep `--frozen-lockfile` working (the Phase 0 fix must survive).
9. Update `vercel.json` — the SPA rewrite must target the right app once there are several.
10. **Do not commit `docs/CREDENTIALS.md`.**

### Exit criteria

- `pnpm install --frozen-lockfile` green
- `pnpm -r build` green across all workspaces
- CI green (all steps, not skipped)
- Union of tables preserved: no `CREATE TABLE` lost versus the 49-table union
- `/materials` still renders from the seed fallback in `apps/admin`

---

## 6. Why this order

Every module built **before** the monorepo lands has to be moved twice — once
into `apps/admin`, again when `packages/ui` and `packages/shared-types` are
extracted. Phase 3's eleven modules are the reason to pay this cost now.
