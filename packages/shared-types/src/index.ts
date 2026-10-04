export type UserRole = 'admin' | 'editor' | 'customer' | 'guest'

export interface Profile {
  id: string
  full_name: string
  role: UserRole
  email?: string
  phone?: string
  department?: string
  avatar_url?: string
  created_at?: string
  updated_at?: string
}

export interface Product {
  id: string
  name: string
  slug: string
  sku: string
  description?: string
  category_id?: string
  price: number
  cost_price?: number
  images?: string[]
  is_active: boolean
  is_featured: boolean
  stock_status: 'in_stock' | 'out_of_stock' | 'made_to_order'
  created_at?: string
  updated_at?: string
}

export interface Customer {
  id: string
  full_name: string
  email?: string
  phone?: string
  status: 'lead' | 'prospect' | 'active' | 'inactive'
  created_at?: string
}

export interface Order {
  id: string
  order_number: string
  customer_id: string
  status: 'pending' | 'confirmed' | 'production' | 'shipped' | 'delivered' | 'cancelled'
  payment_status: 'pending' | 'partial' | 'paid' | 'refunded'
  subtotal: number
  total: number
  created_at?: string
}

export interface Quotation {
  id: string
  quote_number: string
  customer_id: string
  status: 'draft' | 'sent' | 'viewed' | 'accepted' | 'rejected' | 'expired'
  total_amount: number
  currency: string
  created_at?: string
}

export interface Delivery {
  id: string
  order_id: string
  tracking_number?: string
  courier_name?: string
  delivery_type: 'standard' | 'express' | 'same_day'
  status: 'pending' | 'picked_up' | 'in_transit' | 'out_for_delivery' | 'delivered' | 'failed'
  delivery_cost: number
  created_at?: string
}

export interface ReturnRequest {
  id: string
  order_id: string
  return_number: string
  reason: string
  return_type: 'refund' | 'exchange' | 'store_credit'
  status: 'requested' | 'approved' | 'rejected' | 'received' | 'inspected' | 'completed'
  created_at?: string
}
