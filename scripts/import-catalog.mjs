#!/usr/bin/env node
/**
 * Woodex catalog bridge — imports the real storefront content from
 * `seed/catalog.json` (sourced from blackibexofficial-blip/woodex-reimagined)
 * into Supabase so the admin dashboard manages what the site displays.
 *
 *   node scripts/import-catalog.mjs            # dry-run (default, writes nothing)
 *   node scripts/import-catalog.mjs --apply    # actually upsert
 *   node scripts/import-catalog.mjs --apply --only=products,series
 *
 * Requires (never commit these):
 *   SUPABASE_URL              https://<ref>.supabase.co
 *   SUPABASE_SERVICE_ROLE_KEY sb_secret_... or legacy service_role JWT
 *
 * The service role key bypasses RLS, which is why this is a local/CI script and
 * not browser code. src/lib/supabase.ts refuses to let it into client env.
 */
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { createClient } from '@supabase/supabase-js';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const APPLY = process.argv.includes('--apply');
const onlyArg = process.argv.find((a) => a.startsWith('--only='));
const ONLY = onlyArg ? onlyArg.slice(7).split(',').map((s) => s.trim()) : null;

const seed = JSON.parse(readFileSync(join(ROOT, 'seed/catalog.json'), 'utf8'));

const url = process.env.SUPABASE_URL || '';
const key = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

const isPrivileged =
  key.startsWith('sb_secret_') ||
  (key.startsWith('eyJ') && key.split('.')[1] &&
    JSON.parse(Buffer.from(key.split('.')[1], 'base64').toString()).role === 'service_role');

if (!APPLY) {
  console.log('MODE: dry-run (pass --apply to write)\n');
} else {
  if (!/^https?:\/\/.+/.test(url)) fail('SUPABASE_URL is missing or not a URL.');
  if (!isPrivileged) {
    fail('SUPABASE_SERVICE_ROLE_KEY must be a secret/service_role key.\n' +
         '       The anon/publishable key cannot write past RLS.');
  }
  console.log(`MODE: APPLY -> ${url}\n`);
}

function fail(msg) { console.error('\nERROR: ' + msg); process.exit(1); }
const want = (n) => !ONLY || ONLY.includes(n);

const slugify = (s = '') =>
  String(s).toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

const report = [];
const note = (entity, ok, detail = '') => report.push({ entity, ok, detail });

// ── helpers (declared before first use: `let` is not hoisted) ─────────────
let _client;
function client() {
  if (!_client) _client = createClient(url, key, { auth: { persistSession: false } });
  return _client;
}

async function upsert(table, rows, conflictKey) {
  if (!rows.length) return;
  const { error } = await client()
    .from(table)
    .upsert(rows, { onConflict: conflictKey });
  if (error) fail(`${table}: ${error.message}`);
  console.log(`  ✓ ${table}: upserted ${rows.length} rows (onConflict=${conflictKey})`);
}

// ── 1. series (text PK, direct upsert) ───────────────────────────────────
if (want('series')) {
  const rows = (seed.series || []).map((s, i) => ({
    id: s.id, name: s.name, slug: s.slug || slugify(s.name),
    tagline: s.tagline ?? null, badge: s.badge ?? null,
    description: s.description ?? null, cover_image: s.cover_image ?? null,
    sort_order: s.sort_order ?? i, is_active: true,
  }));
  note('series', rows.length, `${rows.length} rows`);
  if (APPLY) await upsert('series', rows, 'id');
}

// ── 2. materials (text PK, direct upsert) ────────────────────────────────
if (want('materials')) {
  const rows = (seed.materials || []).map((m, i) => ({
    id: m.id, name: m.name, category: m.category, brightness: m.brightness,
    image: m.image ?? null, applicable_to: m.applicable_to ?? [],
    is_active: true, sort_order: i,
  }));
  const bad = rows.filter((r) => !['wood','laminate','metal','fabric'].includes(r.category));
  note('materials', !bad.length, bad.length ? `${bad.length} invalid category` : `${rows.length} rows`);
  if (APPLY) await upsert('materials', rows, 'id');
}

// ── 3. categories (UUID PK; slug carries the storefront text id) ─────────
let categoryBySlug = new Map();
if (want('categories')) {
  const rows = (seed.categories || [])
    .filter((c) => c.id !== 'all')                 // virtual "All Products" filter
    .map((c, i) => ({
      name: c.name, slug: c.slug || c.id, description: c.description ?? null,
      image_url: c.image_url ?? null, sort_order: i, is_active: true,
    }));
  note('categories', rows.length, `${rows.length} rows (dropped virtual "all")`);
  if (APPLY) {
    await upsert('categories', rows, 'slug');
    const { data } = await client().from('categories').select('id,slug');
    categoryBySlug = new Map((data || []).map((c) => [c.slug, c.id]));
  }
}

// ── 4. products ──────────────────────────────────────────────────────────
if (want('products')) {
  const rows = (seed.products || []).map((p) => ({
    source_id: p.id,
    name: p.name,
    slug: p.slug || slugify(`${p.name}-${p.id}`),
    sku: p.sku || p.id.toUpperCase(),
    description: p.description ?? null,
    short_description: p.shortDescription ?? null,
    subcategory: p.subcategory ?? null,
    category_id: APPLY ? (categoryBySlug.get(p.category) ?? null) : null,
    series_id: p.series ?? null,
    base_price: p.price ?? 0,
    original_price: p.originalPrice ?? null,
    currency: 'PKR',
    colors: p.colors ?? [],
    specifications: p.specifications ?? [],
    features: p.features ?? [],
    rating: p.rating ?? 0,
    reviews_count: p.reviews ?? 0,
    is_best_seller: !!p.isBestSeller,
    is_new: !!p.isNew,
    is_featured: !!p.isBestSeller,
    is_active: true,
    is_customizable: true,
    stock_status: p.inStock ? 'in_stock' : 'out_of_stock',
    metadata: { imported_from: 'woodex-reimagined', storefront_category: p.category },
  }));

  const noName = rows.filter((r) => !r.name).length;
  const noPrice = rows.filter((r) => !r.base_price).length;
  const noImages = rows.filter((r) => !r.images?.length).length;
  note('products', !noName, `${rows.length} rows; ${noName} missing name; ${noPrice} missing price; ${noImages} missing images (expected - see README)`);
  if (APPLY) await upsert('products', rows, 'source_id');
}

// ── 5. services ──────────────────────────────────────────────────────────
if (want('services')) {
  const rows = (seed.services || []).map((s, i) => ({
    title: s.title || s.name, slug: s.slug || slugify(s.title || s.name),
    description: s.description ?? null, icon: s.icon ?? null,
    features: s.features ?? [], is_active: true, display_order: s.order_index ?? i,
    seo_title: s.seo_title ?? null, seo_description: s.seo_description ?? null,
  }));
  note('services', rows.length, `${rows.length} rows`);
  if (APPLY) await upsert('services', rows, 'slug');
}

// ── 6. blog_posts ────────────────────────────────────────────────────────
if (want('blogPosts')) {
  const rows = (seed.blogPosts || []).map((b) => ({
    title: b.title, slug: b.slug || slugify(b.title),
    excerpt: b.excerpt ?? null, content: b.content ?? b.body_md ?? null,
    featured_image: b.cover_image ?? null, category: b.category ?? null,
    tags: b.tags ?? [], status: b.is_published === false ? 'draft' : 'published',
    published_at: b.published_at ?? null,
    seo_title: b.seo_title ?? null, seo_description: b.seo_description ?? null,
  }));
  note('blog_posts', rows.length, `${rows.length} rows`);
  if (APPLY) await upsert('blog_posts', rows, 'slug');
}

console.log('\n── summary ' + '─'.repeat(50));
for (const r of report) console.log(`  ${r.detail.padEnd(70)} ${r.entity}`);
const total = report.reduce((n, r) => n + (parseInt(r.detail) || 0), 0);
console.log('─'.repeat(62));
console.log(APPLY ? `Imported ${total} records.` : `Would import ${total} records. Re-run with --apply.`);
console.log('\nNOTE: product images are intentionally empty. The MCP snapshot omits');
console.log('image assets, so upload src/assets/*.jpg to a Supabase Storage bucket');
console.log('and patch products.images / materials.image afterwards.');
