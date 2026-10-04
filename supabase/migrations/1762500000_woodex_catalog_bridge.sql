-- Migration: woodex_catalog_bridge
-- Purpose: reconcile the admin schema with the real storefront data model from
--          github.com/blackibexofficial-blip/woodex-reimagined
--
-- The storefront ships 148 products / 20 categories / 5 series / 7 services /
-- 6 blog posts / 16 materials as static TypeScript. The admin has Supabase but
-- none of that content, and is missing four tables the storefront needs.
--
-- Everything here is additive: no column is dropped or renamed, so the existing
-- 15 tables the dashboard already reads keep working throughout.

-- ─────────────────────────────────────────────────────────────────────────
-- 1. series  (storefront: /series, /series/:id — product.series field)
-- ─────────────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS series (
  id          TEXT PRIMARY KEY,           -- e.g. 'ek-series'
  name        TEXT NOT NULL,
  slug        TEXT UNIQUE,
  tagline     TEXT,
  badge       TEXT,                       -- e.g. 'Budget-Friendly'
  description TEXT,
  cover_image TEXT,
  sort_order  INTEGER DEFAULT 0,
  is_active   BOOLEAN DEFAULT true,
  created_at  TIMESTAMPTZ DEFAULT now(),
  updated_at  TIMESTAMPTZ DEFAULT now()
);

-- ─────────────────────────────────────────────────────────────────────────
-- 2. materials  (storefront: /materials + RoomConfigurator MaterialPanel)
--    16 finishes across wood / laminate / metal / fabric, each scoped to the
--    furniture parts it can actually be applied to.
-- ─────────────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS materials (
  id            TEXT PRIMARY KEY,          -- e.g. 'natural-oak'
  name          TEXT NOT NULL,
  category      TEXT NOT NULL CHECK (category IN ('wood','laminate','metal','fabric')),
  brightness    TEXT NOT NULL CHECK (brightness IN ('light','medium','dark','all')),
  image         TEXT,                      -- Supabase Storage URL
  applicable_to TEXT[] NOT NULL DEFAULT '{}',  -- worktop|frame|seating|panel|storage
  is_active     BOOLEAN DEFAULT true,
  sort_order    INTEGER DEFAULT 0,
  created_at    TIMESTAMPTZ DEFAULT now(),
  updated_at    TIMESTAMPTZ DEFAULT now()
);

-- ─────────────────────────────────────────────────────────────────────────
-- 3. projects  (storefront: /projects, /projects/:id — case studies)
-- ─────────────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS projects (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title         TEXT NOT NULL,
  slug          TEXT UNIQUE,
  sector        TEXT CHECK (sector IN ('Corporate','Startup','Hospitality','Retail','Education','Healthcare')),
  city          TEXT,
  area          TEXT,
  area_sqft     INTEGER,
  year          INTEGER,
  client_name   TEXT,
  is_anonymised BOOLEAN DEFAULT false,
  challenge     TEXT,
  solution      TEXT,
  result        TEXT,
  testimonial   TEXT,
  cover_image   TEXT,
  gallery       JSONB DEFAULT '[]',
  products_used UUID[] DEFAULT '{}',
  tags          TEXT[] DEFAULT '{}',
  is_published  BOOLEAN DEFAULT false,
  published_at  TIMESTAMPTZ,
  created_at    TIMESTAMPTZ DEFAULT now(),
  updated_at    TIMESTAMPTZ DEFAULT now()
);

-- ─────────────────────────────────────────────────────────────────────────
-- 4. newsletter_subscribers  (blueprint: newsletter-subscribe edge function)
-- ─────────────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS newsletter_subscribers (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email         TEXT UNIQUE NOT NULL,
  source_url    TEXT,
  is_confirmed  BOOLEAN DEFAULT false,
  confirmed_at  TIMESTAMPTZ,
  created_at    TIMESTAMPTZ DEFAULT now()
);

-- ─────────────────────────────────────────────────────────────────────────
-- 5. products — add the storefront fields the admin schema never had.
--    Existing columns (base_price, category_id, sku, dimensions, cost_price,
--    materials JSONB, finishes JSONB, panorama_image, stock_status) are kept.
-- ─────────────────────────────────────────────────────────────────────────
ALTER TABLE products
  ADD COLUMN IF NOT EXISTS source_id       TEXT,        -- storefront string id, e.g. 'exec-desk-01'
  ADD COLUMN IF NOT EXISTS subcategory     TEXT,
  ADD COLUMN IF NOT EXISTS series_id       TEXT REFERENCES series(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS short_description TEXT,
  ADD COLUMN IF NOT EXISTS original_price  DECIMAL(12,2),
  ADD COLUMN IF NOT EXISTS currency        TEXT DEFAULT 'PKR',
  ADD COLUMN IF NOT EXISTS colors          JSONB DEFAULT '[]',   -- [{name,hex,image}]
  ADD COLUMN IF NOT EXISTS specifications  JSONB DEFAULT '[]',   -- [{label,value}]
  ADD COLUMN IF NOT EXISTS features        JSONB DEFAULT '[]',   -- [string]
  ADD COLUMN IF NOT EXISTS rating          NUMERIC(3,2) DEFAULT 0,
  ADD COLUMN IF NOT EXISTS reviews_count   INTEGER DEFAULT 0,
  ADD COLUMN IF NOT EXISTS is_best_seller  BOOLEAN DEFAULT false,
  ADD COLUMN IF NOT EXISTS is_new          BOOLEAN DEFAULT false;

CREATE UNIQUE INDEX IF NOT EXISTS products_source_id_key ON products(source_id) WHERE source_id IS NOT NULL;
CREATE INDEX IF NOT EXISTS products_series_id_idx ON products(series_id);
CREATE INDEX IF NOT EXISTS products_subcategory_idx ON products(subcategory);

-- ─────────────────────────────────────────────────────────────────────────
-- 6. Row Level Security — mirror the existing admin policy shape.
--    Public read for storefront-facing catalog; writes require an authed user.
-- ─────────────────────────────────────────────────────────────────────────
ALTER TABLE series                ENABLE ROW LEVEL SECURITY;
ALTER TABLE materials             ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects              ENABLE ROW LEVEL SECURITY;
ALTER TABLE newsletter_subscribers ENABLE ROW LEVEL SECURITY;

DO $$
DECLARE t TEXT;
BEGIN
  FOREACH t IN ARRAY ARRAY['series','materials','projects'] LOOP
    EXECUTE format('DROP POLICY IF EXISTS "%s_public_read" ON %I', t, t);
    EXECUTE format('CREATE POLICY "%s_public_read" ON %I FOR SELECT USING (true)', t, t);
    EXECUTE format('DROP POLICY IF EXISTS "%s_auth_write" ON %I', t, t);
    EXECUTE format(
      'CREATE POLICY "%s_auth_write" ON %I FOR ALL TO authenticated USING (true) WITH CHECK (true)', t, t);
  END LOOP;
END $$;

-- Newsletter: the public may INSERT (subscribe) but never read others' rows.
DROP POLICY IF EXISTS "newsletter_public_insert" ON newsletter_subscribers;
CREATE POLICY "newsletter_public_insert" ON newsletter_subscribers
  FOR INSERT WITH CHECK (true);
DROP POLICY IF EXISTS "newsletter_auth_read" ON newsletter_subscribers;
CREATE POLICY "newsletter_auth_read" ON newsletter_subscribers
  FOR SELECT TO authenticated USING (true);
