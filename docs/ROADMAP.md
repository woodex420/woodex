# WOODEX Platform — Complete Build Roadmap

> **Status:** Phase 0, Catalog Bridge and Phase 1 are **shipped** on branch `arena/01a107c2-woodex` (PR #2).
> **Owner:** @woodex420 · **Last updated:** 2026-10-05
> **Rule for every phase:** *find an existing module first, customise it second, build from scratch last.*

---

## 1. The core problem

Woodex is not one project. It is **four disconnected codebases**, and the two
halves that matter most have never been joined:

| Codebase | What it has | What it lacks |
|---|---|---|
| `woodex` (this repo, admin) | Real deployed Supabase · 36 tables · 24 Edge Functions | **No content.** 15 of 36 tables used, 1 of 24 functions called, `SettingsPage` is a stub |
| `blackibexofficial-blip/woodex-reimagined` | 23 pages · **148 real products** · 16 materials · 5 series · 7 services · 6 blog posts · RoomConfigurator · 47 shadcn/ui components · MCP tools | **No backend at all.** `createClient` appears in zero files; cart/quote are in-memory |
| `woodex420/woodex` branch `woodex-admin` | **Monorepo scaffold already built**: `apps/admin`, `apps/api`, `apps/frontend`, `packages/shared-types`, `packages/supabase-client`, `pnpm-workspace.yaml`, `docs/ARCHITECTURE.md`, `001_init_schema.sql` | Never merged; 50 files diverged from `main` |
| `blackibexofficial-blip/Woodex-AI-Dashboard-3.1` | 11 dashboard pages incl. **Invoices**, **LeadGeneration**, **EQuotations** · `geminiService.ts` AI pattern | AI-Studio generated; no Supabase; needs `GEMINI_API_KEY` |

**So: the dashboard manages nothing, and the storefront persists nothing.**
Everything below exists to join them.

> ⚠️ `blackibexofficial-blip/woodex-ai-suite` returned **404 — repository not
> found**. Confirm whether it is private, renamed, or deleted.
>
> ⚠️ Branch `woodex-admin` contains **`docs/CREDENTIALS.md`**. It was never
> opened or printed during this work. Review and rotate anything inside it.

---

## 2. Evidence base

Findings verified in code, not assumed:

- **CI failed on every run since Nov 2025** (11 months). Cause: `ERR_PNPM_OUTDATED_LOCKFILE` plus a committed `"pnpm-store": "link:/tmp/pnpm-store"` dependency pointing at a path that exists on no CI runner. Lint and build were **always skipped**. → *fixed in Phase 0*
- **24 Radix packages installed, 0 used.** Also unused: `cmdk`, `sonner`, `next-themes`, `vaul`, `zod`, `react-hook-form`, `date-fns`, `embla`, `pannellum-react`, `input-otp`, `react-day-picker`, `react-resizable-panels`. → *17 of them now used via Phase 1*
- **`@tanstack/react-query` provider mounted in `main.tsx` with zero consumers**; 11 pages hand-roll `useEffect` + fetch. → *fixed for catalog reads in Phase 1*
- **`tailwind.config.js` referenced `hsl(var(--border))` / `hsl(var(--background))` but `index.css` only defined `--sidebar-*`** — every shadcn-style utility silently resolved to nothing. → *fixed in Phase 1*
- **18 native `alert()` / `confirm()`** calls; **1** `aria-label` and **1** `role` in the whole app; **0 tests**; **0 lazy loading** (1.44 MB single chunk)
- **10 `.limit()` calls, no `.range()`** — tables silently cap at 100 rows
- **`SettingsPage.tsx`** renders the literal string `PAGETITLE` + "Module under development"
- **`index.html` shipped `GA_MEASUREMENT_ID`** as a placeholder, firing junk to Google Analytics on every pageview. → *fixed in Phase 0*
- **`ShowroomPage` displays "360° View Available" over a flat `<img>`**; `pannellum-react` is installed, unused, and already fails its peer (`unmet peer react@16.x`)
- **21 of 36 tables unused** — and they are exactly the CMS / CRM / automation product
- **Deep links 404'd on Vercel** (`/dashboard` → `404: NOT_FOUND`) — no SPA rewrite. → *fixed by `vercel.json`*

---

## 3. Target architecture

```
pnpm workspace monorepo  (scaffold already exists on branch `woodex-admin`)
│
├── apps/storefront     ← woodex-reimagined (23 pages, real content)
├── apps/admin          ← this repo's dashboard (TailAdmin patterns, shadcn kit)
├── apps/api            ← Edge Functions / server routes (write-guarded)
│
├── packages/ui         ← the 47 shadcn components, shared by both apps
├── packages/shared-types  ← one Product/Order/Quote type for both apps
├── packages/supabase-client
└── packages/mcp        ← reimagined's MCP tools, repointed to live Supabase
                    │
              Supabase (Postgres 15 + RLS + Storage + Edge Functions)
```

**Principles** (from reimagined's own `docs/BLUEPRINT.md`, which are sound):
read-heavy / write-guarded · semantic tokens only · SEO-first · **WhatsApp as
the primary conversion channel** · progressive enhancement.

---

## 4. Roadmap

### ✅ Phase 0 — Stabilise & secure *(shipped, commit `f429f8c`)*

| Task | Result |
|---|---|
| Remove `pnpm-store` link dep; regenerate lockfile | `CI=true pnpm install --frozen-lockfile` now passes |
| Get CI green | **All 8 steps pass** — first time in 11 months |
| Remove GA placeholder | Opt-in `src/lib/analytics.ts`; no request unless a real ID is set |
| Env-gate `admin`/`admin` | Off in production; closing the gate **purges stale sessions** |
| Refuse privileged keys in client env | `sbp_` / `sb_secret_` / `service_role` detected and rejected |

**Exit criteria met:** CI green, no junk analytics, no unguarded bypass.

---

### ✅ Catalog Bridge *(shipped, commit `4cf5909`)*

- `seed/catalog.json` — **201 real records** extracted (148 products, 20 categories, 5 series, 7 services, 6 blog posts, 16 materials), PKR pricing
- Migration creating **`series`, `materials`, `projects`, `newsletter_subscribers`** + 12 new `products` columns. **Purely additive** — nothing dropped or renamed
- `scripts/import-catalog.mjs` — dry-run by default; `--apply` requires a genuine `service_role` key and **refuses an anon key**

**Blocked on you:** run the migration + import (needs the rotated `sbp_` token and an `sb_secret_` key, as local env only).

---

### ✅ Phase 1 — UI kit + data layer *(shipped, commit `1f1e40c`)*

- **17 shadcn/ui components reused** from reimagined — **zero new dependencies**
- Full design-token layer added, mapped to Workspace.AE greys (not shadcn slate) + `.dark` palette
- **React Query hooks** (`useMaterials` / `useProducts` / `useSeries`) with a **seed fallback** so the dashboard shows real content before Supabase is wired; the snapshot code-splits into its own 148 kB chunk
- **Materials module live** at `/materials`

**Decision taken:** TailAdmin migration **dropped**. It would have forced React 19 + Tailwind v4 + router v8 + Vite 8 simultaneously to supply components already owned on a matching React 18 / Tailwind 3 stack. TailAdmin remains the **design reference** for dark mode, RTL, i18n and the notification centre.

---

### ▶️ Phase 2 — Monorepo consolidation *(next)*

**Goal:** one workspace, so every later module lands in the right place once.

1. Adopt the `woodex-admin` branch scaffold (`pnpm-workspace.yaml`, `packages/*`, `apps/*`)
2. **Reconcile `001_init_schema.sql` against the additive catalog bridge** — must not lose the 4 new tables
3. Reconcile the three schema conflicts: `quotes` vs `quotations` · `leads` vs `customers` · roles `admin/sales/editor` vs `admin/editor/viewer`
4. Move `woodex-reimagined` in as `apps/storefront`
5. Extract the 47 shadcn components into `packages/ui`
6. Prune the 5 legacy sibling apps (`woodex-ecommerce`, `woodex-furniture-mpa`, `woodex-furniture-v2`, `woodex-master`, `complete-project`) — all named `react_repo`

**Exit criteria:** `pnpm -r build` green across all workspaces; CI runs per-app.
**Do this as its own PR** — every module built before it has to be moved twice.

---

### Phase 3 — Dashboard modules from real data

Driven by the gap report (frontend feature → dashboard need):

| Module | Source to reuse | Existing asset |
|---|---|---|
| Products (real 148) | reimagined schema | `products` + bridge columns |
| **Series** | reimagined `/series` | table created in bridge |
| **Materials** ✅ | reimagined `/materials` | *done in Phase 1* |
| **Invoices** | **AI-Dashboard-3.1 `Invoices.tsx`** | — |
| **Lead Generation** | **AI-Dashboard-3.1 `LeadGeneration.tsx`** | — |
| **E-Quotations** | AI-Dashboard-3.1 + `quotation-pdf-generator` (264 lines, unwired) | `quotations`, `quotation_items` |
| Projects (case studies) | reimagined `/projects` | table created in bridge |
| Blog CMS | reimagined `/blog` | `blog_posts` (unused) |
| Services | reimagined `/services` | `services` (unused) |
| Settings (**real**) | TailAdmin profile/settings pattern | currently a stub |
| Showroom / Configurator | reimagined `RoomConfigurator`, `HotspotMarker` | `virtual_rooms`, `room_packages` (unused) |
| B2B portal | reimagined `/b2b` | `b2b_companies`, `b2b_users` (unused) |

Also in this phase: React Query everywhere · real pagination via `.range()` · replace all 18 `alert()`/`confirm()` with dialogs + `sonner` · `react-hook-form` + `zod` validated forms · command palette (`cmdk`) · dark mode toggle (`next-themes`).

---

### Phase 4 — RBAC & audit

Spec already written in `woodex-reimagined/docs/05-dashboard/overview.md`:

| Capability | admin | sales | editor |
|---|---|---|---|
| Manage users / roles | ✅ | ❌ | ❌ |
| CRM (leads, quotes) | ✅ | ✅ | ❌ |
| Orders | ✅ | ✅ | ❌ |
| Products / Series | ✅ | ❌ | ✅ |
| Blog / Projects | ✅ | ❌ | ✅ |
| Analytics | ✅ | ✅ (own pipeline) | ❌ |

Build: role matrix UI · per-route guards + per-action gating (replacing the single `canEdit` boolean) · user management · **audit log viewer** (`user_activity_log`, unused) · **Supabase RLS policy audit** — with real data, client-side gating is UX, not security.

---

### Phase 5 — Page builder, CMS & AI

- **GrapesJS** page builder (BSD-3 core + MIT `@grapesjs/react`; 26.2k stars, v0.23.6 Aug 2026). Chosen over Puck/Craft.js because it is **framework-agnostic** (survives future React upgrades), already includes the style manager, asset manager, layers, storage, responsive preview and **MJML email**, and supports **white-label embedding** for agency/multi-client use. Webstudio ruled out (**AGPL-3.0**), Builder.io (proprietary), Craft.js (no release since Feb 2025).
- **Flowbite Blocks** as the builder's element kit (MIT, 459+ sections) — registered as GrapesJS blocks. Split: **TailAdmin = admin chrome · Flowbite Blocks = builder content library.**
- Header/footer builder, template library, scheduled publishing, SEO manager (reimagined has 432 lines of per-route SEO content + JSON-LD)
- **Repoint reimagined's MCP tools from static `data.json` to live Supabase**
- **Official Supabase MCP** (`mcp.supabase.com/mcp`, 20+ tools) — read-only, project-scoped. With populated data including WhatsApp content, *"one poisoned row is an exfiltration path."*
- Harvest `geminiService.ts` from AI-Dashboard-3.1 for AI features: quote drafting from WhatsApp transcripts, product copy, demand forecasting (`pricing_rules` table exists)

---

### Phase 6 — Automation, commerce & hardening

- **WhatsApp automation**: rules, templates, webhook (4 unused `whatsapp_*` tables + a 754-line WhatsAppPage already exist)
- **Payments**: fill the **empty** `create-payment-intent`; COD + bank transfer per the orders spec; 75% advance on quotes
- **Realtime** notification centre: low stock, new order, quote accepted
- **Calendar** (FullCalendar): deliveries + `whatsapp_appointments` (unused)
- **Analytics** to the spec's KPI targets: 50 B2B leads MTD · 3% B2C conversion · 30% WhatsApp CTR · funnel lead→quote→order
- **i18n + RTL** (Urdu / Arabic) — TailAdmin ships the pattern
- Real 360° showroom — **replace `pannellum-react`** (failing peer) with a maintained viewer
- **Tests** (currently 0): Vitest + Playwright around auth and money paths · Sentry · code splitting · review the 1.44 MB bundle

---

## 5. What I need from you

| # | Item | Blocks |
|---|---|---|
| 1 | Supabase **publishable/anon** key → Vercel env vars | Live data in the dashboard |
| 2 | **Rotated `sbp_` token** (the pasted one is burned) + an `sb_secret_` key, local env only | Running the migration + import |
| 3 | Confirm status of `woodex-ai-suite` (404) | Whether more modules can be reused |
| 4 | Review / rotate `docs/CREDENTIALS.md` on branch `woodex-admin` | Security |
| 5 | Approve adopting the `woodex-admin` scaffold | Phase 2 |

**Never commit any of these** — `.env` is tracked in this repo.

---

## 6. Risks

| Risk | Mitigation |
|---|---|
| Monorepo merge conflicts with live deployment | Phase 2 as an isolated PR; Vercel builds from source, `dist/` is vestigial |
| Schema reconciliation loses data | Bridge migration is additive-only; back up Supabase before Phase 2 |
| `admin`/`admin` on a deployment with real data | Already env-gated off in production |
| supabase-js jumped `2.79 → 2.117` on fresh resolve | Bundle grew 945 kB → 1.44 MB; re-test auth flows |
| AGPL contamination | Webstudio excluded; GrapesJS (BSD-3), Puck/Craft.js/Flowbite/TailAdmin (MIT) only |
