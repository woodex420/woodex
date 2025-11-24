# WoodEx Business Model 2.0 — Project Inventory and Architecture Overview

## 1. Executive Summary and Objectives

This report provides a comprehensive, evidence-driven inventory and architecture overview of the WoodEx Business Model 2.0 project. It is intended for technical and business stakeholders who need a clear understanding of the project’s structure, the relationships between its parts, and the implications for delivery, operations, and governance. The analysis synthesizes directory layout, codebases, backend (Supabase) configuration, documentation assets, media libraries, and deployment scaffolding, and maps them to the platform’s core business capabilities: visualization-first e-commerce, real-time customization, e‑quotation, payments, CRM, and content/SEO.

The project is organized into eight top-level folders that segment concerns cleanly and support parallel development:

- 01_website-projects: The operational website projects, including build configs, devops utilities, and deployments.
- 02_documentation-reports: A large, well-indexed corpus of implementation, testing, business, technical, and status documentation.
- 03_research-analysis: Foundational research, architecture planning, and market/competitor analyses.
- 04_assets-media: Centralized media inventory and categorized image assets for products, branding, and showroom content.
- 05_backend-supabase: Supabase backend consolidation—edge functions, migrations, schema/client configs, and related testing scaffolding.
- 06_user-inputs: Structured inputs from users, including brand voice, business requirements, competitor references, and original documents.
- 07_deployment: Environment and operational scaffolding for staging, production, configuration, logs, and scripts.
- 08_business-data: Analytics, financial, KPI dashboard, and metrics placeholders to support decision-making and performance tracking.

Key findings:

- Frontend applications are built with React, TypeScript, and Vite, with TailwindCSS and Radix UI components. The 3D stack uses React Three Fiber (@react-three/fiber) and drei (@react-three/drei) for visualization and customization. Payments are integrated via Stripe libraries. Supabase JS is used for data access and edge function invocation.
- Supabase backend consolidation is mature: the 05_backend-supabase directory contains twelve database migrations spanning initial schema, e‑commerce extensions, user roles/auth, enhancement tables, final quotes, and an enhanced CRM system. Twelve edge functions cover quotation, pricing, payments, admin, contact, customization, and migration support. RLS (row-level security) is enabled across core tables; policies and CORS are uniformly configured.
- The documentation corpus is extensive, organized by category (implementation, testing, business, technical, status), and indexed by a master index. This inventory greatly reduces discovery friction and supports governance, onboarding, and auditability.
- Static assets and SEO artifacts are present in both public and dist directories, with structured data and sitemap components. Responsive and WebP-optimized imagery is in place, alongside a comprehensive image inventory (image_meta.json).

Deliverable path: docs/project_structure/project_structure_analysis.md. The analysis is grounded in the project’s backend structure documentation and the documentation master index, and it aligns to the technical architecture that envisions a scalable, event-driven system built on PostgreSQL with Supabase components and a pragmatic evolution path to cloud-native services.[^6][^7]

## 2. Repository Layout and Inventory

The project’s repository is intentionally modular. Each top-level folder has a distinct purpose, yet the folders interleave through builds, deployments, and operations. To orient the reader, the following high-level directory map summarizes the structure and primary contents.

Table 1. High-level directory map

| Folder | Purpose | Key Subfolders | Primary Artifacts |
|---|---|---|---|
| 01_website-projects | Website projects and ops scripts | api-integration, backend, database-schemas, dist, frontend, react_app, public, versions-archive | package.json, vite.config.ts, eslint.config.js, postcss.config.js, database_migration_phase3.sql, dist (assets, data, images, robots.txt, sitemap.xml, site.webmanifest) |
| 02_documentation-reports | Documentation corpus | implementation-reports, testing-reports, business-reports, technical-reports, status-reports, meeting-notes, user-guides | 126+ organized Markdown files, master index, PDFs, testing checklists, SEO configurations |
| 03_research-analysis | Foundational research | architecture-planning, business-intelligence, competitor-analysis, market-research, technical-research | Research inventory, UI wireframes, user journey maps, business model analysis, master requirements |
| 04_assets-media | Media library | icons-logos, images-branding, images-products, images-showroom, ui-assets, audio, videos, graphics | ASSET_INVENTORY.md, categorized image directories, logos, showroom and product assets |
| 05_backend-supabase | Supabase backend | functions, migrations, schemas, config, tests | BACKEND_STRUCTURE.md, CONSOLIDATION_SUMMARY.md, 12 edge functions, 12 migrations, client config schemas, admin scripts |
| 06_user-inputs | External inputs | brand-materials, business-documents, competitor-analysis, design-specifications, originals, surveys, user-stories | INPUT_FILES_INDEX.md, brand voice, business model docs, SEO keyword structures, original DOCX files |
| 07_deployment | Deployment scaffolding | scripts, staging, production, config, logs | Environment placeholders for CI/CD and operations |
| 08_business-data | Business intelligence | analytics, financials, kpi-dashboards, metrics | Placeholders to support dashboards, KPIs, and analytics |
| assets (root) | Additional assets | images | image_meta.json, assorted images for product/showroom/hero content |
| code | Codebases | supabase, woodex-dark-theme, woodex-website | Dark theme React app; woodex-website dist and public assets; supabase functions/migrations |

To make the inventory actionable, the following table aggregates the top-level folders with representative contents and indicates where duplication occurs and where archive versions live.

Table 2. Top-level folders and representative contents

| Folder | Representative Contents | Notes |
|---|---|---|
| 01_website-projects | Build configs (package.json, Vite, ESLint, PostCSS), database migration script, dist assets (robots.txt, sitemap.xml, site.webmanifest, PDFs, images, data) | public mirrors dist with SEO artifacts; versions-archive contains prior builds |
| 02_documentation-reports | Categorized Markdown files across implementation, testing, business, technical, status; meeting notes; user guides | Master index notes duplicates (e.g., duplicate agent analysis reports, phase completion) and recommends consolidation |
| 03_research-analysis | Architecture planning (system design, wireframes, journeys), market/competitor research, master requirements | Foundation for roadmap and product-market fit |
| 04_assets-media | Icons/logos, branding images, product images, showroom images; asset inventory and media library | Supports brand identity, product visualization, and showroom contexts |
| 05_backend-supabase | Edge functions (pricing, quotes, payments, admin, contact, customization), migrations (auth, roles, schema, CRM), client config schemas | Centralized backend for e‑commerce, e‑quotation, CRM; consolidation summary available |
| 06_user-inputs | Brand voice, business docs, competitor references, content structures, original DOCX files | Used to seed content, SEO, and product narratives |
| 07_deployment | Scripts, staging, production, config, logs | Placeholders for CI/CD, environment secrets, and operational runbooks |
| 08_business-data | Analytics, financials, KPI dashboards, metrics | Stubs for decision support; to be integrated with data pipelines |

Duplication is present and explicitly called out in the documentation master index: duplicate/near-duplicate Markdown files, repeated phase completion reports, and parallel progress tracking files. This suggests an opportunity to consolidate and canonicalize documentation to reduce maintenance and prevent confusion.[^7]

### 2.1 Key Artifacts in Top-Level Folders

The repository contains several critical artifacts that anchor development and operations:

- Configuration files: package.json, vite.config.ts, eslint.config.js, postcss.config.js. These define the frontend build, linting, and styling toolchain.
- Database migration: database_migration_phase3.sql (present alongside build configs), indicating a database migration surfaced to the website project layer.
- Deployment artifacts in dist/public: robots.txt, sitemap.xml, site.webmanifest, PDFs (e.g., content agent reports), and mirrored images/data directories. These support SEO, PWA manifest, and content publishing.

Table 3. Critical files and their roles

| File/Folder | Role | Relevance |
|---|---|---|
| package.json | Node/TypeScript/Vite build definitions and dependencies | Core for React/TypeScript builds, code quality, and scripts |
| vite.config.ts | Vite bundler configuration | Frontend build pipeline and optimization |
| eslint.config.js, postcss.config.js | Linting and PostCSS processing | Code standards and CSS transformations |
| database_migration_phase3.sql | Phase 3 database migration | Aligns backend schema to current website features |
| dist/public (robots.txt, sitemap.xml, site.webmanifest) | SEO and PWA assets | Search crawling, sitemap presence, and PWA identity |
| dist/data (e.g., products.json) | Static data payloads | Seed data for UI, prototyping, and testing |
| images/ and images_backup_original/ | Static image assets and backups | Content delivery, responsive image variants, and fallbacks |

## 3. React Application Architecture

The frontend applications use a modern React stack—React 18, TypeScript, Vite 6, and TailwindCSS—augmented by Radix UI components for accessible primitives. The UI stack is complemented by a visualization layer built on React Three Fiber and drei, enabling 3D product viewing and real-time customization. Payments integrate via Stripe React components and JS SDK. Supabase JS provides the client for database and edge functions.

The woodex-website codebase is the primary website implementation. It exposes dist assets (bundled JS/CSS, products data, responsive images), and mirrors a public directory containing SEO and PWA files. A dark theme application exists in code/woodex-dark-theme, illustrating a theme variant with a minimal component set and an error boundary. Both projects are structured around Vite and TypeScript, with linting and CSS tooling configured. The main site includes Three.js and R3F for 3D experiences, with progressive loading and responsive images for performance.

To ground this description, the image below is used in the site’s public/dist imagery and is representative of the product showroom context.

![Showroom interior display exemplar used by the website (image_060.png).](/workspace/user_input_files/woodex-business-model-2.0/04_assets-media/images-showroom/showroom-interior-display-060.png)

The following table lists the principal dependencies and their purpose. The absence of explicit version ranges here reflects the focus on categories and high-level versions, consistent with the project’s package.json files.

Table 4. Frontend dependencies and versions (principal categories)

| Dependency | Category | Purpose |
|---|---|---|
| react, react-dom | Core UI | Component model and rendering |
| typescript | Language | Static typing for reliability |
| vite | Build tool | Fast dev server and bundling |
| tailwindcss, postcss, autoprefixer | Styling | Utility-first CSS and processing |
| @radix-ui/* | UI primitives | Accessible components (dialogs, menus, tabs, etc.) |
| @react-three/fiber, @react-three/drei | 3D visualization | Declarative Three.js scenes and helpers |
| three | 3D engine | WebGL rendering and 3D model support |
| @stripe/react-stripe-js, @stripe/stripe-js | Payments | Client-side Stripe integration |
| @supabase/supabase-js | Backend client | Supabase REST and functions access |
| react-router-dom | Routing | SPA navigation |
| react-hook-form, zod | Forms/validation | Schema-driven form validation |
| framer-motion | Animations | Motion primitives for UX |
| recharts, zustand | Data & state | Charts and state management |
| sonner, react-toastify | Feedback | Toast notifications |
| lucide-react | Icons | Iconography |
| vite-plugin-source-identifier | Build plugin | Source identification for deployments |

To illustrate configuration intent, the build matrix below summarizes key scripts and build modes.

Table 5. Build scripts matrix

| Script | Purpose | Notes |
|---|---|---|
| dev | Local development with install and Vite | Optimized for fast iteration |
| build | Production build with install and Vite | Standard production bundling |
| build:seo | SEO-optimized build with preprocessing | Includes shell script optimization step |
| build:prod | TypeScript compile then Vite prod build | Enforces type-checking before bundling |
| lint | Linting with ESLint | Code quality enforcement |
| preview | Preview the production build locally | Post-build verification |
| install-deps | Dependency installation | Consistent environment setup |
| clean | Purge node_modules and lockfile | Clean slate for dependency issues |
| seo:build / seo:check | SEO utilities invocation and validation | Supporting SEO workflow |

### 3.1 Application Structure (woodex-website)

The woodex-website implementation includes a dist directory that holds bundled assets (JS, CSS), data (products.json), images (including responsive variants), and SEO/PWA files (robots.txt, sitemap.xml, site.webmanifest). The public directory mirrors these artifacts, providing a canonical source for static assets during development or static hosting.

Table 6. Asset inventory in dist

| Asset | Purpose | Notes |
|---|---|---|
| assets/*.js, *.css | Bundled application code and styles | Minimized for production |
| data/products.json | Product catalog seed | Used for UI rendering and testing |
| images/* | Product, showroom, and hero imagery | Includes responsive variants and backups |
| robots.txt, sitemap.xml, site.webmanifest | SEO and PWA manifest | Search, site structure, installability |
| PDFs | Content and reporting artifacts | Supplementary information for stakeholders |

![Hero imagery for the main site (dark-hero-custom-made.png).](/workspace/user_input_files/woodex-business-model-2.0/01_website-projects/frontend/dist/images/dark-hero-custom-made.png)

The dist assets reflect an emphasis on SEO and PWA readiness, while the product and showroom images support a visualization-first e-commerce experience. Responsive variants of imagery enable adaptive delivery across device classes.

### 3.2 Theme Variant (woodex-dark-theme)

The dark theme application demonstrates a secondary theme implementation built with the same core stack. It includes:

- A minimal component set with a home page and an error boundary, suitable for pilot testing of dark mode experiences.
- Vite, TypeScript, TailwindCSS, and linting configuration consistent with the main site, lowering the barrier to reuse shared utilities and styles.

This variant can be used to validate theme performance, accessibility, and visual contrast in production contexts, and to iterate on dark mode patterns without risking the main site’s stability.

### 3.3 3D and Customization Pipeline

The 3D visualization stack is implemented with @react-three/fiber (R3F) and drei helpers, rendering WebGL scenes declaratively within React components. Performance strategies such as progressive loading, responsive image variants, and texture optimization (including WebP) are aligned to e-commerce best practices for mobile performance and search-driven discovery. Combined with server-side price calculation, this enables a responsive “customize → price → quote” loop.

The architecture references real-time techniques—WebSockets as primary, Server-Sent Events (SSE) as secondary, and long polling as fallback—to serve bi-directional customization sessions and uni-directional price updates. This multi-transport approach broadens device compatibility while meeting sub-second feedback targets for price and configuration changes.[^8][^9]

![Configurator interface imagery used in 3D customization flow (configurator-tablet.png).](/workspace/user_input_files/woodex-business-model-2.0/01_website-projects/frontend/dist/images/configurator-tablet.png)

As shown above, the configurator assets are treated as first-class citizens in the pipeline, with responsive variants and optimized formats. This visual context helps bridge the gap between 3D modeling and real-world product selection by presenting intuitive controls alongside rendered outputs.

### 3.4 Routing, State, and Forms

Routing is handled via react-router-dom, supporting standard SPA navigation patterns. State management leverages zustand for lightweight, scalable store logic, while forms are implemented with react-hook-form and validated with zod schemas. UI feedback is provided through sonner/react-toastify, and data visualization uses recharts. This stack encourages rapid iteration on UX flows (e.g., customization, quotation) with reliable validation and error handling.

## 4. Supabase Backend Architecture

The backend is consolidated under 05_backend-supabase and includes edge functions, migrations, schema/client configuration, and testing scaffolding. The consolidation summary indicates a unification from multiple sources into a coherent, comprehensive solution for e‑commerce and quotation management. Supabase components—PostgreSQL, Auth, Storage, Edge Functions, and Realtime—provide an accelerated path to MVP while retaining the option to evolve into a cloud-native split for global scale.[^6][^11][^12]

Table 7. Edge functions catalog

| Name | Purpose | Inputs | Outputs | Notes |
|---|---|---|---|---|
| calculate-pricing | Dynamic pricing for product specs | productId, options, quantity | price breakdown | CORS, validation, error handling |
| create-admin-user | Create/admin management | admin payload | user record | RBAC setup, seeded admin |
| create-payment-intent | Stripe payment intent | order/quote context | client secret | Idempotency and webhook alignment |
| generate-quote | Basic quote generation | customer, items | quote record, PDF | Totals and tax/delivery |
| generate-quote-enhanced | Advanced quote + CRM | enhanced payload | enriched quote | CRM fields, status |
| generate-invoice | Invoice from quote/order | quote/order reference | invoice PDF | Financial artifacts |
| save-customization | Persist configurations | configuration JSON | saved config | Validation and retrieval |
| stripe-webhook | Stripe webhook handler | event payload | processed status | Signature verification |
| submit-contact-form | Contact intake | contact form | status | CRM/notification trigger |
| submit-quote-request | Quote request intake | request details | status | Workflow kickoff |
| migration-phase3 | Migration management | migration args | status | Schema alignment with website |

The directory maintains a consistent pattern for CORS, error handling, and response formatting. The functions support core business flows—pricing, quotation, payments, CRM, and admin—while isolating sensitive operations server-side.[^11]

Table 8. Migrations timeline

| File | Domain | Purpose |
|---|---|---|
| 20241030_01_complete_schema.sql | Portfolio/Testimonials | Initial content schema and RLS policies |
| 20241030_02_ecommerce_complete_schema.sql | E-commerce | Extended schema for catalogs and transactions |
| 20241030_03_seed_data.sql | Seed | Populate initial data for testing |
| 20241030_1761778074_ecommerce_complete_schema.sql | E-commerce | Comprehensive schema updates |
| 20241030_1761778149_ecommerce_schema_v2.sql | E-commerce | Version迭代 and refinements |
| 20241030_1761781578_add_user_roles_and_auth_tables.sql | Auth/Roles | User roles and auth support tables |
| 20241030_1761781608_add_authentication_support.sql | Auth | Additional auth features |
| 20241030_1761835088_create_enhancement_tables.sql | Enhancements | Business enhancements beyond core |
| 20241030_1761835125_initial_woodex_schema.sql | WoodEx | Initial business schema |
| 20241030_1761838960_create_user_roles_table.sql | RBAC | Role management |
| 20241030_1761848467_create_quotes_table_final.sql | Quotes | Final quote structures |
| 20241030_1761850299_enhanced_crm_system.sql | CRM | Complete CRM system implementation |

Table 9. Environment variables

| Variable | Scope | Purpose |
|---|---|---|
| VITE_SUPABASE_URL | Frontend/Edge | Supabase project URL for client and functions |
| VITE_SUPABASE_ANON_KEY | Frontend/Edge | Anonymous key for client-side operations |
| SUPABASE_SERVICE_ROLE_KEY | Edge functions | Service role for privileged operations |
| STRIPE_SECRET_KEY | Edge functions | Stripe server-side integration |

Table 10. API catalog (selected)

| Method | Path | Auth | Purpose |
|---|---|---|---|
| POST | /auth/v1/signup | Public | User registration |
| POST | /auth/v1/token?grant_type=password | Public | User login |
| POST | /auth/v1/logout | JWT | User logout |
| POST | /functions/v1/generate-quote | JWT | Generate quote |
| POST | /functions/v1/generate-quote-enhanced | JWT | Enhanced quote generation |
| POST | /functions/v1/create-payment-intent | JWT | Create payment intent |
| POST | /functions/v1/stripe-webhook | Secret | Stripe webhook handler |
| GET | /rest/v1/quotes | JWT | Retrieve quotes |
| PATCH | /rest/v1/quotes | JWT | Update quote |
| POST | /functions/v1/calculate-pricing | JWT | Price calculation |

### 4.1 Edge Functions (Deno)

All edge functions follow consistent conventions:

- CORS headers enable cross-origin requests safely.
- Request validation and error handling ensure predictable responses.
- Response formatting is standardized to simplify client-side parsing and retries.

This uniformity accelerates development and reduces defects. Function deployment and local testing follow Supabase CLI patterns for fast iteration.[^11]

### 4.2 Migrations and Schema

Migrations progress from initial schema and e‑commerce extensions to auth/roles, enhancements, and a comprehensive CRM system. RLS is enabled across content and transaction tables, and policies are designed to restrict access appropriately. The schema supports a visualization-first e-commerce model with products, categories, quotes, orders, and CRM entities, aligning to proven relational e-commerce patterns.[^12]

Table 11. Key tables and purposes

| Table | Domain | Purpose |
|---|---|---|
| auth.users | Auth | Authentication users |
| user_profiles | Users | Extended user information |
| user_roles | RBAC | Role assignments |
| companies/clients | CRM | B2B client records |
| quotes/orders | Commerce | Quotation and order lifecycle |
| products/categories | Catalog | Product taxonomy and attributes |
| cities/provinces | Logistics | Transportation rates/delivery info |
| invoices/payments | Finance | Financial artifacts and tracking |

### 4.3 Client Config and Types

The Supabase client configuration provides the URL, anonymous key, and TypeScript interfaces for key entities. It integrates with the frontend through environment variables and typed models, enabling strong contracts between UI and backend. Type definitions cover quote requests, products, user profiles, and quotes.

Table 12. Type definitions overview

| Interface | Key Fields | Usage |
|---|---|---|
| QuoteRequest | id, name, company, email, phone, project_type, office_size, product_interests, timeline, budget_range, requirements, status, created_at | Intake and status tracking of quote submissions |
| ContactSubmission | id, name, email, phone, subject, message, status, created_at | Contact form handling and CRM |
| Product | id, name, description, category, base_price, status, seo_slug, images, model3d_url | Catalog rendering and search |
| UserProfile | id, email, display_name, roles, company_id | RBAC and personalization |
| Quote | id, customer_id, status, currency_code, subtotal, discount_total, tax_total, delivery_total, grand_total, valid_until, pdf_url | Quotation management |

### 4.4 Security Model

The security model implements JWT-based authentication and role-based authorization. RLS policies isolate data at the row level, restricting access based on roles and ownership. CORS is configured consistently across functions. Payment security is aligned to PCI-DSS expectations by delegating sensitive handling to Stripe and avoiding raw card data storage. Audit logging, MFA for administrative actions, and data encryption in transit and at rest complete the security posture.

Table 13. RLS policy summary (selected)

| Table | Policy | Scope | Intent |
|---|---|---|---|
| product_categories | Public can view active categories | Public read | SEO and catalog browsing |
| products | Authenticated read; admin write | Authenticated/admin | Controlled product management |
| quotes | Owner read/write; admin override | Customer/sales/admin | Quotation privacy and workflow |
| user_profiles | Owner read/write; admin override | Customer/sales/admin | Profile privacy |
| contact_submissions | Admin/sales read; owner write | Admin/sales/customer | CRM intake management |

## 5. Documentation and Reporting Ecosystem

The documentation ecosystem is comprehensive, with 126+ files organized into five primary categories. The master index consolidates purpose and usage guidance for each category and flags duplicate/near-duplicate files to be consolidated. This ecosystem is a major asset: it reduces onboarding friction, supports auditability, and enables governance over implementations, tests, and delivery status.

Table 14. Documentation summary

| Category | Approx. Count | Representative Files | Purpose |
|---|---|---|---|
| Implementation | 43 | Complete implementation report; Stripe integration; CRM completion; bug fixes; error handling | Feature rollout, fixes, deployments |
| Testing | 33 | Final testing report; admin dashboard validation; CRM validation; quote system validation; cross-browser/mobile | QA coverage and validation |
| Business | 26 | Master analysis; project summaries; agent roles; product catalog; delivery summaries | Strategy, analysis, and business context |
| Technical | 37 | Architecture designs; SEO implementation; setup guides; troubleshooting; image optimization | Technical guides and specifications |
| Status | 32 | Final completion; phase completion; redesign progress; deployment activation; Stripe status | Delivery status, milestones, confirmations |

Duplicate reports identified include agent analysis documents, test progress variants, and phase completion files. Consolidation is recommended to streamline maintenance and improve clarity, with clear ownership for each canonical document.[^7]

## 6. Assets and Media Library

The 04_assets-media directory centralizes media, with an asset inventory and categorized images. The repository root also includes a substantial images directory and a metadata file (image_meta.json) describing the asset inventory. Branding, product, and showroom images exist alongside logos and UI assets, enabling a cohesive content pipeline.

Table 15. Asset categories and examples

| Category | Representative Files | Purpose |
|---|---|---|
| icons-logos | WOodex Logo copy.png, icon-copy variants | Brand identity and UI icons |
| images-branding | delivery-truck-office-furniture-050.jpg, woodex-warehouse-facility-062.png | Brand narrative and logistics context |
| images-products | cabinets, chairs, desks (e.g., cabinet-storage-lockable-wood-010.jpg; chair-ergonomic-lumbar-support-004.jpg) | Product visualization and catalog |
| images-showroom | conference tables, reception desks, meeting rooms, workspace setups (e.g., conference-table-modern-003.jpg; reception-desk-modern-office-001.jpg) | Showroom contexts and inspiration |
| ui-assets | Placeholder for UI graphics | Supporting interface visuals |
| videos/audio | Placeholders for multimedia content | Future enrichment of content |

Metadata is consolidated via image_meta.json, enabling automated processing and consistent use across the site. The following image illustrates a branding context asset.

![Branding context image: delivery truck (maroon_peterbilt_office_furniture_outlet_delivery_truck.jpg).](/workspace/user_input_files/woodex-business-model-2.0/04_assets-media/images-branding/maroon_peterbilt_office_furniture_outlet_delivery_truck.jpg)

Static assets in dist/public complement the media library, including robots.txt, sitemap.xml, and site.webmanifest. These artifacts anchor the site’s SEO and PWA posture and support the visualization-first product experience.

![Showroom image used in dist/public (showroom-interior-display-060.png).](/workspace/user_input_files/woodex-business-model-2.0/01_website-projects/public/images/showroom-interior-display-060.png)

## 7. Data Model and Migrations (Derived from SQL)

The migrations define a comprehensive schema aligned to e-commerce operations, with RLS policies enabling secure public reads for content and restricted access for transactional data. The initial schema covers content entities (portfolio_projects, testimonials) and extends to transactional domains (quotes, orders, products, categories). A subsequent migration adds e‑commerce structures and seed data, followed by auth and role tables, enhancement tables, and a final enhanced CRM system.

Table 16. ER summary (derived from migrations)

| Entity | Primary Key | FKs | Purpose |
|---|---|---|---|
| portfolio_projects | id (UUID) | — | Case studies and featured content |
| testimonials | id (UUID) | project_id → portfolio_projects | Social proof and client feedback |
| product_categories | id (UUID) | — | Taxonomy for products |
| products | id (UUID) | category_id → product_categories | Product catalog with SEO and status |
| blog_posts | id (UUID) | — | Content marketing and SEO |
| quote_requests | id (UUID) | — | Intake for e‑quotation workflows |
| contact_submissions | id (UUID) | — | Contact form submissions |
| user_profiles | id (UUID) | user_id → auth.users | Extended user information |
| user_roles | role_id | user_id → auth.users, role_id → roles | RBAC assignments |
| roles | role_id | — | Admin, sales, customer roles |
| quotes | id (UUID) | customer_id → user_profiles/companies | Quotation lifecycle and financials |
| orders | id (UUID) | customer_id → user_profiles/companies | Order management |
| invoices/payments | id (UUID) | order_id → orders | Financial tracking |

The schema enforces RLS across content tables and provides policy scaffolds for transactional tables, aligning to best practices in relational e-commerce design.[^10][^12]

## 8. Integrations and Deployment

The integrations are concentrated in edge functions, with Stripe for payments and Supabase Realtime for optional real-time features. The backend structure documentation outlines the deployment approach, environment secrets, and CLI commands for local and production workflows.

Table 17. Integration inventory

| System | Data Objects | Protocol | Direction | Error/Retry Policy |
|---|---|---|---|---|
| Stripe | Payment intents, charges, refunds, webhooks | REST + Webhook | Bi-directional | Idempotency keys; signature verification; exponential backoff |
| Supabase | Auth, storage, PostgreSQL, edge functions | REST/SDK/Functions | Bi-directional | Managed retries; RLS policy enforcement |
| Contact/Quote Intake | Submissions, requests | Edge functions | Inbound | Validation; logging; CRM triggers |
| Realtime | Subscriptions, price updates | WebSockets/SSE | Bi-directional | Fallback to polling on legacy devices |

Deployment is coordinated via Supabase CLI and environment secrets. The repository includes scripts for local development, migrations, and function serving. Operational placeholders in 07_deployment anticipate CI/CD integration for staging and production.

Table 18. Deployment topology (planned)

| Environment | Compute | Data Stores | Policies |
|---|---|---|---|
| Dev | Supabase local; edge functions serve | Local PostgreSQL; local storage | Open access within team; relaxed limits |
| Staging | Deployed edge functions; services | Staging PostgreSQL; staging storage | Auth; rate limits; synthetic data |
| Production | Managed Supabase; edge functions | Managed PostgreSQL; managed storage | Strict auth; RBAC; WAF/DDoS; full observability |

Table 19. Environment variables and secrets

| Variable | Scope | Purpose |
|---|---|---|
| VITE_SUPABASE_URL | Frontend/Functions | Supabase URL |
| VITE_SUPABASE_ANON_KEY | Frontend/Functions | Anonymous key |
| SUPABASE_SERVICE_ROLE_KEY | Functions | Service role for admin/privileged ops |
| STRIPE_SECRET_KEY | Functions | Stripe server-side integration |

![Operational context image: modern meeting room (modern-meeting-room-conference-space-design-geometric-wall-art.jpg).](/workspace/user_input_files/woodex-business-model-2.0/04_assets-media/images-showroom/modern-meeting-room-conference-space-design-geometric-wall-art.jpg)

This image represents the operational context for meeting room solutions—an important product category supported by the platform’s quotation and visualization capabilities.

## 9. Security, Privacy, and Compliance

Security is layered across identity, transport, data, application, and operations:

- Identity and access: JWT-based authentication with refresh tokens; role-based access control (RBAC) with scoped permissions; session management and revocation.
- Data protection: TLS for transport; encryption at rest for database and storage; secrets management and rotation; data minimization and pseudonymization where appropriate.
- Application security: input validation; output encoding; parameterized queries; CSP and SRI; rate limiting and abuse detection; audit logging for sensitive actions.
- Compliance: GDPR considerations (data subject rights, data export/deletion, privacy notices); PCI-DSS alignment via provider-hosted payments; retention policies for logs and audit trails.
- Infrastructure security: WAF and DDoS protection; network segmentation; container and dependency vulnerability management.

RLS is central to data isolation. Policies restrict who can read and write transactional data based on roles and ownership, while public read policies enable content delivery. CORS is configured consistently across functions. Webhook handlers verify signatures and apply idempotency.

Table 20. Role-based access matrix (illustrative)

| Role | Permissions |
|---|---|
| Customer | Create/read/update quotations; create/read orders |
| Sales | CRUD quotations; read products and orders |
| Admin | Full access to all resources |
| Supplier | Scoped read/update of inventory; read shipments |

Table 21. Data classification matrix

| Data Type | Classification | Storage | Encryption | Retention |
|---|---|---|---|---|
| Customer PII | Sensitive | PostgreSQL | At rest + in transit | GDPR-driven |
| Orders/Payments | Confidential | PostgreSQL | At rest + in transit | Regulatory minimums |
| 3D Models/Textures | Internal | Object storage/CDN | At rest + in transit | Until superseded |
| Audit Logs | Confidential | PostgreSQL | At rest + in transit | 12–24 months (policy TBD) |
| Configuration JSON | Internal | PostgreSQL (JSONB) | At rest + in transit | Business-defined |

## 10. Performance and Scalability Strategy

The performance strategy targets:

- Page load: under 3 seconds (mobile), under 2 seconds (desktop).
- API reads: under 200 ms; writes: under 500 ms.
- 3D model initial load: under 2 seconds; material swaps: under 500 ms.
- Search results: under 300 ms.

Caching spans browser, CDN, application (Redis), and database layers, with invalidation tied to domain events. Database scaling uses read replicas and connection pooling; indexing supports hot paths. Mobile optimization includes responsive images (WebP), reduced lighting, disabled antialiasing on constrained devices, and texture compression. The 3D pipeline leverages progressive loading, LOD, culling, batching, and instancing.

Table 22. Performance benchmarks and measurement

| KPI | Target | Measurement |
|---|---|---|
| Page load (mobile/desktop) | < 3 s / < 2 s | RUM and Lighthouse |
| API read/write latency | < 200 ms / < 500 ms | APM and gateway metrics |
| 3D model initial load | < 2 s | Client timing |
| Material change latency | < 500 ms | Client timing |
| Search latency | < 300 ms | APM and query timing |
| Availability | 99.9%+ | SLO dashboards |

Table 23. Cache layers and invalidation

| Layer | Scope | TTL | Triggers | Warming |
|---|---|---|---|---|
| Browser | Static assets | Days | Build hash change | Prefetch critical assets |
| CDN | Images, 3D models | Days–Weeks | Versioned URLs; content revisions | Pre-warm new versions |
| Application (Redis) | Hot API responses; price breakdowns | Minutes–Hours | Domain events (ProductUpdated, PriceRuleChanged) | Warm on deploy; precompute hot items |
| Database Cache | Query results | Seconds–Minutes | Row updates | Automatic |

These strategies align with mobile e-commerce best practices and responsive breakpoint guidance for 2025 device classes.[^9][^5]

## 11. Risks, Assumptions, and Information Gaps

A disciplined risk program addresses technology, integration, and operations. Assumptions are clearly identified, and mitigations are proposed. Information gaps are captured for stakeholder decisions, particularly beyond the Supabase MVP.

Table 24. Risk register

| Risk | Likelihood | Impact | Mitigation | Owner | Review |
|---|---|---|---|---|---|
| Payment gateway downtime | Medium | High | Multiple providers; retry with DLQ; graceful fallback | Payments | Monthly |
| CDN caching of 3D assets | Medium | Medium | Versioned URLs; cache headers; pre-warming | Platform | Bi-weekly |
| Complex rule validation bugs | Medium | High | Server-side enforcement; contract tests | Customization | Weekly |
| Inventory inconsistency | Medium | High | Event-driven sync; reconciliation jobs | Fulfillment | Weekly |
| Mobile 3D performance regression | Medium | Medium | Performance budgets; device testing; adaptive quality | Frontend | Bi-weekly |
| API rate limit abuse | Medium | Medium | Multi-tier rate limiting; WAF; anomaly detection | SRE | Weekly |
| Compliance/residency gaps | Low | High | Confirm requirements; region pinning | Compliance | Quarterly |
| Cost overruns | Medium | Medium | Autoscaling; cache tuning; usage alerts | Finance/SRE | Monthly |

Information gaps requiring decisions:

- Cloud provider beyond Supabase (AWS/GCP/Azure) and managed services (Kafka, Redis, CDN).
- Payment gateways for the Pakistani market and settlement specifics.
- Shipping carrier selection, SLAs, and COD policies.
- ERP system and scope of synchronization.
- Identity provider for SSO and MFA.
- Regulatory scope beyond GDPR and data residency constraints.
- Non-functional SLOs per user journey and device tier.
- 3D asset pipeline details (licensing, LOD strategy, CDN).
- Capacity planning (peak RPS, concurrent users, 3D size distribution).
- Data retention policies and legal logging requirements.

These gaps influence the architecture choices and should be resolved during the Foundation phase to avoid downstream reworks.[^8][^4]

## 12. Recommendations and Next Steps

The repository already exhibits a robust structure. The recommendations below aim to consolidate gains, reduce duplication, and mature operations.

1. Consolidate documentation. The master index flags duplicates across agent analyses, testing progress, and phase completion. Create canonical files per category and redirect or archive duplicates. Assign owners and establish a maintenance cadence.
2. Standardize frontend builds. Align the woodex-website and woodex-dark-theme projects to a single Vite/TypeScript/Tailwind baseline, and formalize SEO build steps across both. Ensure consistent linting rules and error handling patterns.
3. Harden environment management. Define environment-specific .env files and CI/CD secrets, validate them in CI, and document rotation policies. Enforce the separation of public (VITE_*) and server-side secrets.
4. Expand testing coverage. Extend unit/integration tests for edge functions; add contract tests between frontend and backend; implement E2E tests for critical user journeys (customization, quotation, checkout); add load tests for 3D model delivery and API latency.
5. Establish performance budgets. Create dashboards for mobile/desktop page load, API latency, 3D load times, and search latency. Tie alerts to SLO burn rates and enforce regression gates in CI.
6. Optimize the 3D pipeline. Enforce LOD, texture compression (WebP), and progressive loading. Pre-warm CDN caches and version model URLs. Implement device-specific rendering defaults and fallbacks.
7. Strengthen security posture. Verify RLS policies across all tables; enforce MFA for admin; ensure webhook signature verification and idempotency across payment flows; implement structured audit logging.
8. Create deployment runbooks. Document CI/CD steps, database migration workflows, rollback procedures, and disaster recovery. Define environment promotion rules and approval gates.
9. Build the analytics foundation. Integrate event ingestion from domain flows; define KPIs (conversion, AOV, engagement); set up dashboards for product performance, quote funnel, and operational metrics.
10. Plan the evolution beyond Supabase MVP. Define criteria and a migration path to Kubernetes-based microservices, managed Kafka, Redis, and a CDN. This should be tied to traffic growth, feature complexity, and team capacity.

Table 25. Action plan matrix

| Task | Owner | Priority | Dependencies | Timeline |
|---|---|---|---|---|
| Documentation consolidation | PM/Tech Writer | High | Master index; stakeholder sign-off | 2–3 weeks |
| Build standardization | Frontend Lead | High | package.json; lint configs | 2 weeks |
| Environment/CI secrets | SRE | High | Vault/CI integration | 2 weeks |
| Test coverage expansion | QA/Backend | High | Edge functions; E2E framework | 4–6 weeks |
| Performance dashboards | SRE/Frontend | Medium | APM and RUM tooling | 3–4 weeks |
| 3D pipeline optimization | Frontend | Medium | CDN; asset pipeline | 4 weeks |
| Security hardening | Security/SRE | High | RLS audit; MFA rollout | 3 weeks |
| Deployment runbooks | SRE | Medium | CI/CD pipeline | 2–3 weeks |
| Analytics foundation | Data/PM | Medium | Event schemas; BI tool | 4–6 weeks |
| Post-MVP evolution plan | CTO/Architect | Medium | Capacity planning | 6–8 weeks |

These steps operationalize the architecture blueprint, improve reliability and performance, and prepare the platform for scale beyond the Supabase MVP, while maintaining a tight feedback loop with business outcomes.[^6][^7]

---

## References

[^1]: Database Design Principles for E-commerce. GeeksforGeeks. https://www.geeksforgeeks.org/dbms/how-to-design-a-relational-database-for-e-commerce-website/
[^2]: Exploring Real-time Web Techniques in JS. Medium. https://medium.com/@ksaquib/exploring-real-time-web-techniques-in-js-choosing-the-right-approach-for-your-application-1d8747af6179
[^3]: Mobile E-commerce Best Practices. MobiLoud. https://www.mobiloud.com/blog/mobile-ecommerce-best-practices
[^4]: Complete E-commerce Integration Guide. Integrate.io. https://www.integrate.io/blog/complete-guide-to-ecommerce-integration/
[^5]: Responsive Design Breakpoints 2025. BrowserStack. https://www.browserstack.com/guide/responsive-design-breakpoints
[^6]: Supabase Documentation. https://supabase.com/docs
[^7]: WoodEx Documentation & Reports Master Index. (Project document)
[^8]: WoodEx System Architecture Design. (Project technical report)
[^9]: Modern Furniture E-commerce Technical Architecture Requirements. (Project technical report)
[^10]: WoodEx Supabase Backend Structure Documentation. (Project backend document)
[^11]: Supabase Edge Functions Guide. https://supabase.com/docs/guides/functions
[^12]: Supabase Database Migrations. https://supabase.com/docs/guides/migrations
[^13]: Supabase Row Level Security (RLS). https://supabase.com/docs/guides/auth/auth-rls
[^14]: Supabase Project URL (E-Quotation system). https://tpgzfinnlwlabbtmbmxo.supabase.co