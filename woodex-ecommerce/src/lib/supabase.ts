import { createClient } from '@supabase/supabase-js';

// Use environment variables so configuration can differ between local/staging/prod.
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: { persistSession: true }
});

export const getSupabaseAnonKey = () => supabaseAnonKey;

// TypeScript types
export interface Product {
  id: string;
  name: string;
  slug: string;
  sku: string;
  description?: string;
  category_id?: string;
  price: number;
  cost_price?: number;
  images?: string[];
  is_active: boolean;
  is_featured: boolean;
  stock_status: 'in_stock' | 'out_of_stock' | 'made_to_order';
  created_at: string;
}

export interface RoomPackage {
  id: string;
  name: string;
  slug: string;
  package_type: string;
  description: string;
  base_price: number;
  discount_percentage: number;
  featured_image?: string;
  included_products: any;
  is_active: boolean;
  is_featured: boolean;
}

export interface CartItem {
  id: string;
  product_id: string;
  quantity: number;
  price: number;
  product?: Product;
}
