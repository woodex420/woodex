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
}

const asResult = <T,>(
  rows: T[] | undefined,
  source: DataSource,
  q: { isLoading: boolean; isError: boolean; error: Error | null },
): QueryResult<T> => ({
  rows: rows ?? [],
  source,
  isLoading: q.isLoading,
  isError: q.isError,
  error: q.error,
});

// ── materials ────────────────────────────────────────────────────────────
export function useMaterials(): QueryResult<Material> {
  const q = useQuery({
    queryKey: ['materials', isSupabaseConfigured],
    queryFn: async (): Promise<{ rows: Material[]; source: DataSource }> => {
      if (!isSupabaseConfigured) {
        const seed = await loadSeed();
        return { rows: (seed.materials ?? []) as Material[], source: 'seed' };
      }
      const { data, error } = await supabase
        .from('materials')
        .select('*')
        .eq('is_active', true)
        .order('sort_order');
      if (error) throw error;
      return { rows: (data ?? []) as Material[], source: 'supabase' };
    },
    staleTime: 5 * 60 * 1000,
  });

  return asResult(q.data?.rows, q.data?.source ?? 'seed', q);
}

// ── products ─────────────────────────────────────────────────────────────
export function useProducts(): QueryResult<CatalogProduct> {
  const q = useQuery({
    queryKey: ['products', isSupabaseConfigured],
    queryFn: async (): Promise<{ rows: CatalogProduct[]; source: DataSource }> => {
      if (!isSupabaseConfigured) {
        const seed = await loadSeed();
        const rows = (seed.products ?? []).map((p: any) => ({
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
        })) as CatalogProduct[];
        return { rows, source: 'seed' };
      }
      const { data, error } = await supabase
        .from('products')
        .select(
          'source_id,name,slug,subcategory,series_id,base_price,original_price,currency,short_description,stock_status,is_best_seller,rating,reviews_count,is_active',
        )
        .eq('is_active', true)
        .order('created_at', { ascending: false });
      if (error) throw error;
      const rows = (data ?? []).map((p: any) => ({
        ...p,
        category: p.metadata?.storefront_category ?? '',
        series: p.series_id,
        in_stock: p.stock_status === 'in_stock',
      })) as CatalogProduct[];
      return { rows, source: 'supabase' };
    },
    staleTime: 5 * 60 * 1000,
  });

  return asResult(q.data?.rows, q.data?.source ?? 'seed', q);
}

// ── series ───────────────────────────────────────────────────────────────
export function useSeries(): QueryResult<Series> {
  const q = useQuery({
    queryKey: ['series', isSupabaseConfigured],
    queryFn: async (): Promise<{ rows: Series[]; source: DataSource }> => {
      if (!isSupabaseConfigured) {
        const seed = await loadSeed();
        return { rows: (seed.series ?? []) as Series[], source: 'seed' };
      }
      const { data, error } = await supabase
        .from('series')
        .select('*')
        .eq('is_active', true)
        .order('sort_order');
      if (error) throw error;
      return { rows: (data ?? []) as Series[], source: 'supabase' };
    },
    staleTime: 5 * 60 * 1000,
  });

  return asResult(q.data?.rows, q.data?.source ?? 'seed', q);
}
