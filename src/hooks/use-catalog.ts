import { useQuery } from '@tanstack/react-query';
import { supabase, isSupabaseConfigured } from '../lib/supabase';

/**
 * Catalog data layer.
 *
 * Every read goes through React Query rather than a hand-rolled
 * `useEffect` + `setState`, which gives caching, request deduplication,
 * retry, window-focus refetch and a shared loading/error surface for free.
 * (The QueryClientProvider has been mounted in main.tsx since the project
 * started but not a single page used it.)
 *
 * When Supabase is not configured the hooks fall back to the real catalog
 * snapshot in `seed/catalog.json` - the 148 products / 16 materials imported
 * from woodex-reimagined - so the dashboard renders genuine content instead of
 * empty tables. The snapshot is loaded via dynamic import, so it is code-split
 * out of the main bundle and never downloaded on a configured deployment.
 */

export interface Material {
  id: string;
  name: string;
  category: 'wood' | 'laminate' | 'metal' | 'fabric';
  brightness: 'light' | 'medium' | 'dark' | 'all';
  image: string | null;
  applicable_to: string[];
}

export interface CatalogProduct {
  source_id: string;
  name: string;
  slug: string;
  category: string;
  subcategory?: string | null;
  series?: string | null;
  base_price: number;
  original_price?: number | null;
  currency: string;
  short_description?: string | null;
  in_stock: boolean;
  is_best_seller?: boolean;
  rating?: number;
  reviews_count?: number;
}

export interface Series {
  id: string;
  name: string;
  tagline?: string | null;
  badge?: string | null;
  description?: string | null;
}

const loadSeed = async () => (await import('../../seed/catalog.json')).default;

/** Where a given read actually came from - surfaced in the UI as a banner. */
export type DataSource = 'supabase' | 'seed';

export interface QueryResult<T> {
  rows: T[];
  source: DataSource;
  isLoading: boolean;
  isError: boolean;
  error: Error | null;
  /**
   * Set when Supabase IS configured but the live read failed, so the seed
   * snapshot is shown instead of a blank screen. The common cause during the
   * migration window is a table that does not exist yet (`42P01`), i.e. the
   * catalog-bridge migration has not been applied to the project.
   */
  degraded: string | null;
}

type Live<T> = { rows: T[]; source: DataSource; degraded: string | null };

/**
 * Runs a live Supabase read, falling back to the seed snapshot on failure so a
 * missing table or an RLS denial degrades to "demo data with a warning" rather
 * than an empty dashboard.
 */
const withSeedFallback = async <T>(
  live: () => Promise<T[]>,
  fromSeed: () => Promise<T[]>,
): Promise<Live<T>> => {
  try {
    return { rows: await live(), source: 'supabase', degraded: null };
  } catch (err: any) {
    const rows = await fromSeed();
    const msg = err?.message ?? String(err);
    const reason = /42P01|does not exist/i.test(msg)
      ? 'table not found - apply supabase/migrations/1762500000_woodex_catalog_bridge.sql'
      : msg;
    return { rows, source: 'seed', degraded: reason };
  }
};

const asResult = <T,>(
  data: Live<T> | undefined,
  q: { isLoading: boolean; isError: boolean; error: Error | null },
): QueryResult<T> => ({
  rows: data?.rows ?? [],
  source: data?.source ?? 'seed',
  degraded: data?.degraded ?? null,
  isLoading: q.isLoading,
  isError: q.isError,
  error: q.error,
});

// ── materials ────────────────────────────────────────────────────────────
export function useMaterials(): QueryResult<Material> {
  const q = useQuery({
    queryKey: ['materials', isSupabaseConfigured],
    queryFn: () =>
      withSeedFallback<Material>(
        async () => {
          const { data, error } = await supabase
            .from('materials')
            .select('*')
            .eq('is_active', true)
            .order('sort_order');
          if (error) throw error;
          return (data ?? []) as Material[];
        },
        async () => ((await loadSeed()).materials ?? []) as Material[],
      ),
    staleTime: 5 * 60 * 1000,
  });

  return asResult(q.data, q);
}

// ── products ─────────────────────────────────────────────────────────────
const seedToProduct = (p: any): CatalogProduct => ({
  source_id: p.id,
  name: p.name,
  slug: p.id,
  category: p.category,
  subcategory: p.subcategory ?? null,
  series: p.series ?? null,
  base_price: p.price ?? 0,
  original_price: p.originalPrice ?? null,
  currency: 'PKR',
  short_description: p.shortDescription ?? null,
  in_stock: !!p.inStock,
  is_best_seller: !!p.isBestSeller,
  rating: p.rating ?? 0,
  reviews_count: p.reviews ?? 0,
});

export function useProducts(): QueryResult<CatalogProduct> {
  const q = useQuery({
    queryKey: ['products', isSupabaseConfigured],
    queryFn: () =>
      withSeedFallback<CatalogProduct>(
        async () => {
          const { data, error } = await supabase
            .from('products')
            .select(
              'source_id,name,slug,subcategory,series_id,base_price,original_price,currency,short_description,stock_status,is_best_seller,rating,reviews_count,is_active,metadata',
            )
            .eq('is_active', true)
            .order('created_at', { ascending: false });
          if (error) throw error;
          return (data ?? []).map((p: any) => ({
            ...p,
            category: p.metadata?.storefront_category ?? '',
            series: p.series_id,
            in_stock: p.stock_status === 'in_stock',
          })) as CatalogProduct[];
        },
        async () => ((await loadSeed()).products ?? []).map(seedToProduct),
      ),
    staleTime: 5 * 60 * 1000,
  });

  return asResult(q.data, q);
}

// ── series ───────────────────────────────────────────────────────────────
export function useSeries(): QueryResult<Series> {
  const q = useQuery({
    queryKey: ['series', isSupabaseConfigured],
    queryFn: () =>
      withSeedFallback<Series>(
        async () => {
          const { data, error } = await supabase
            .from('series')
            .select('*')
            .eq('is_active', true)
            .order('sort_order');
          if (error) throw error;
          return (data ?? []) as Series[];
        },
        async () => ((await loadSeed()).series ?? []) as Series[],
      ),
    staleTime: 5 * 60 * 1000,
  });

  return asResult(q.data, q);
}
