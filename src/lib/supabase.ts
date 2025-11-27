import { createClient } from '@supabase/supabase-js';

// Read Supabase configuration from environment. Set these in your deployment
// environment or local `.env` file (see `complete-project/.env.example`).
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: { persistSession: true }
});

// Helper to expose the anon key (used by fetch calls when needed).
export const getSupabaseAnonKey = () => supabaseAnonKey;

// Database types
export type UserRole = 'admin' | 'editor' | 'viewer';

export interface Profile {
  id: string;
  full_name: string;
  role: UserRole;
  avatar_url?: string;
  phone?: string;
  department?: string;
  email?: string;
  created_at: string;
  updated_at: string;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  sku: string;
  description?: string;
  category_id?: string;
  price: number;
  cost_price?: number;
  dimensions?: any;
  weight?: number;
  materials?: any;
  finishes?: any;
  images?: string[];
  panorama_image?: string;
  is_customizable: boolean;
  is_featured: boolean;
  is_active: boolean;
  stock_status: 'in_stock' | 'out_of_stock' | 'made_to_order';
  created_at: string;
  updated_at: string;
}

export interface Customer {
  id: string;
  customer_type: 'individual' | 'business';
  full_name: string;
  company_name?: string;
  email?: string;
  phone: string;
  whatsapp_number?: string;
  address?: any;
  status: 'lead' | 'prospect' | 'active' | 'inactive';
  lead_score: number;
  created_at: string;
}

export interface Quotation {
  id: string;
  quote_number: string;
  customer_id: string;
  status: 'draft' | 'sent' | 'viewed' | 'accepted' | 'rejected' | 'expired';
  subtotal: number;
  tax_amount: number;
  discount_amount: number;
  shipping_cost: number;
  total_amount: number;
  currency: string;
  valid_until: string;
  notes?: string;
  terms_conditions?: string;
  created_by?: string;
  pdf_url?: string;
  created_at: string;
  updated_at: string;
}

export interface Order {
  id: string;
  order_number: string;
  customer_id: string;
  quotation_id?: string;
  status: 'pending' | 'confirmed' | 'production' | 'shipped' | 'delivered' | 'cancelled';
  payment_status: 'pending' | 'partial' | 'paid' | 'refunded';
  subtotal: number;
  total: number;
  created_at: string;
}

export interface WhatsAppMessage {
  id: string;
  customer_id?: string;
  phone_number: string;
  direction: 'incoming' | 'outgoing';
  message_type: 'text' | 'image' | 'document' | 'audio' | 'video';
  content: string;
  status: 'pending' | 'sent' | 'delivered' | 'read' | 'failed';
  created_at: string;
}

export interface AnalyticsDaily {
  id: string;
  date: string;
  messages_sent: number;
  messages_received: number;
  leads_generated: number;
  quotations_created: number;
  quotations_accepted: number;
  orders_created: number;
  revenue: number;
  active_users: number;
}

// Phase 4: Order Management Types
export interface Delivery {
  id: string;
  order_id: string;
  tracking_number?: string;
  courier_name?: string;
  delivery_type: 'standard' | 'express' | 'same_day';
  status: 'pending' | 'picked_up' | 'in_transit' | 'out_for_delivery' | 'delivered' | 'failed';
  scheduled_date?: string;
  delivered_date?: string;
  delivery_cost: number;
  delivery_address: any;
  recipient_name?: string;
  recipient_phone?: string;
  notes?: string;
  proof_of_delivery?: string;
  created_at: string;
  updated_at: string;
}

export interface Return {
  id: string;
  order_id: string;
  return_number: string;
  reason: string;
  reason_category: 'defective' | 'wrong_item' | 'not_as_described' | 'changed_mind' | 'other';
  return_type: 'refund' | 'exchange' | 'store_credit';
  status: 'requested' | 'approved' | 'rejected' | 'received' | 'inspected' | 'completed';
  items_to_return: any;
  refund_amount?: number;
  customer_notes?: string;
  admin_notes?: string;
  images?: string[];
  approved_by?: string;
  approved_at?: string;
  completed_at?: string;
  created_at: string;
  updated_at: string;
}

export interface OrderStatusHistory {
  id: string;
  order_id: string;
  old_status?: string;
  new_status: string;
  changed_by?: string;
  change_reason?: string;
  notes?: string;
  created_at: string;
}

export interface StockMovement {
  id: string;
  product_id: string;
  variant_id?: string;
  movement_type: 'inbound' | 'outbound' | 'adjustment' | 'reserved' | 'released';
  quantity: number;
  reference_type?: string;
  reference_id?: string;
  reason?: string;
  performed_by?: string;
  created_at: string;
}

export interface Inventory {
  id: string;
  product_id: string;
  variant_id?: string;
  location?: string;
  stock_quantity: number;
  reserved_quantity: number;
  low_stock_threshold: number;
  reorder_point?: number;
  reorder_quantity?: number;
  last_restocked?: string;
  updated_at: string;
}

export interface DeliveryZone {
  id: string;
  zone_name: string;
  postal_codes: string[];
  cities: string[];
  delivery_types: any;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}
