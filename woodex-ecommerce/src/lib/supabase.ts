import { createClient } from '@supabase/supabase-js';

const supabaseUrl = "https://vocqqajpznqyopjcymer.supabase.co";
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZvY3FxYWpwem5xeW9wamN5bWVyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjE3MTM5MTMsImV4cCI6MjA3NzI4OTkxM30.b2ncZs7ETkh5_I9p7QP0kgUchDO166y5jUG-Na5yuEM";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

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
