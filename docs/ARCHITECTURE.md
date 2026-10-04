# WOODEX Architecture Overview

## System Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                    CLIENT LAYER                                 │
├──────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ┌──────────────────┐         ┌──────────────────┐              │
│  │  Frontend App    │         │  Admin Dashboard │              │
│  │ (woodex-        │         │ (React + Vite)   │              │
│  │  reimagined)    │         │                  │              │
│  │ (React + Vite)  │         └──────────────────┘              │
│  │                  │                │                          │
│  │ - Home           │                │ Auth Check               │
│  │ - Products       │                │ JWT Validation           │
│  │ - Cart           │                │                          │
│  │ - Checkout       │                │                          │
│  │ - Track Order    │                │                          │
│  │ - Account        │                │                          │
│  └──────────────────┘                │                          │
│           │                          │                          │
│           └──────────────┬───────────┘                          │
│                          │                                       │
└──────────────────────────┼───────────────────────────────────────┘
                           │
                    HTTP/REST API
                    (Axios/Fetch)
                           │
┌──────────────────────────┼───────────────────────────────────────┐
│                 API LAYER (Node.js/Express)                     │
├──────────────────────────┼───────────────────────────────────────┤
│                          ▼                                       │
│  ┌────────────────────────────────────────┐                    │
│  │      Express Server (Port 3001)        │                    │
│  │  ┌────────────────────────────────────┐│                    │
│  │  │  Routes & Controllers              ││                    │
│  │  │  - /auth (Login, Register)         ││                    │
│  │  │  - /products (List, Get)           ││                    │
│  │  │  - /orders (Create, Update)        ││                    │
│  │  │  - /payments (Stripe)              ││                    │
│  │  │  - /quotations (Create, Manage)    ││                    │
│  │  │  - /inventory (Stock Management)   ││                    │
│  │  │  - /deliveries (Tracking)          ││                    │
│  │  │  - /returns (Process Returns)      ││                    │
│  │  │  - /webhooks (Stripe, WhatsApp)    ││                    │
│  │  └────────────────────────────────────┘│                    │
│  │  ┌────────────────────────────────────┐│                    │
│  │  │  Middleware                        ││                    │
│  │  │  - Auth (JWT verification)         ││                    │
│  │  │  - Validation (Input validation)   ││                    │
│  │  │  - Error Handling                  ││                    │
│  │  │  - Rate Limiting                   ││                    │
│  │  │  - CORS                            ││                    │
│  │  └────────────────────────────────────┘│                    │
│  └────────────────────────────────────────┘                    │
│           │                    │                 │              │
│           ▼                    ▼                 ▼              │
│  ┌─────────────────┐ ┌──────────────────┐ ┌────────────────┐  │
│  │  Supabase      │ │  Third-party     │ │  Services      │  │
│  │  Client        │ │  Integrations    │ │  Layer         │  │
│  │                │ │                  │ │                │  │
│  │ - Queries      │ │ - Stripe API     │ │ - Email        │  │
│  │ - Mutations    │ │ - SendGrid API   │ │ - Payment      │  │
│  │ - Subscriptions│ │ - WhatsApp API   │ │ - Notification │  │
│  └─────────────────┘ └──────────────────┘ └────────────────┘  │
└─────────────┬──────────────────┬────────────────────┬──────────┘
              │                  │                    │
              ▼                  ▼                    ▼
      ┌─────────────────┐ ┌─────────────┐ ┌──────────────────┐
      │ Supabase        │ │ Stripe      │ │ SendGrid +       │
      │ PostgreSQL      │ │ (Payments)  │ │ WhatsApp APIs    │
      │                 │ │             │ │                  │
      │ - Database      │ │ Webhooks:   │ │ Webhooks:        │
      │ - Auth          │ │ success     │ │ delivery,        │
      │ - Storage       │ │ failure     │ │ status updates   │
      │ - Edge Fn       │ │ refund      │ │                  │
      │ - Realtime      │ │             │ │                  │
      └─────────────────┘ └─────────────┘ └──────────────────┘
```

## Data Flow Diagram

### Customer Checkout Flow
```
Customer Cart Page
       ↓
  [Add to Cart]
       ↓
  Cart State (Local + Supabase)
       ↓
  [Proceed to Checkout]
       ↓
  Delivery Calculator (Supabase Function)
       ├─→ Get delivery zones
       ├─→ Calculate shipping cost
       └─→ Estimate delivery date
       ↓
  Stripe Checkout (Hosted Page)
       ↓
  [Payment Success/Failure]
       ↓
  Stripe Webhook → API Server
       ↓
  Create Order (Supabase)
       ├─→ Insert order record
       ├─→ Reserve inventory
       ├─→ Create order status history
       └─→ Send confirmation email
       ↓
  Customer Order Confirmation
       ↓
  Order Tracking Page
```

### Admin Order Management Flow
```
Admin Dashboard
       ↓
  [View Orders]
       ↓
  Fetch Orders from API
       ├─→ Query Supabase orders table
       ├─→ Join with customers, products, deliveries
       └─→ Return paginated results
       ↓
  [Update Order Status]
       ↓
  API Call to /orders/update
       ├─→ Validate admin permissions
       ├─→ Call order-status-updater edge function
       ├─→ Update order status
       ├─→ Create status history record
       └─→ Send customer notification
       ↓
  [Manage Delivery]
       ↓
  Update Delivery Info
       ├─→ Assign courier
       ├─→ Set tracking number
       └─→ Notify customer via email/WhatsApp
       ↓
  Real-time Order List Updates (Supabase Subscriptions)
```

## Database Schema

### Core Tables

#### Users & Profiles
```sql
auth.users (Supabase Auth)
├─ id (UUID)
├─ email (String)
├─ created_at (Timestamp)
└─ updated_at (Timestamp)

public.profiles
├─ id (UUID FK → auth.users)
├─ full_name (String)
├─ role (admin|editor|viewer|customer)
├─ avatar_url (String)
├─ phone (String)
├─ department (String)
└─ timestamps
```

#### Products & Inventory
```sql
public.products
├─ id (UUID)
├─ name (String)
├─ slug (String)
├─ sku (String)
├─ description (Text)
├─ price (Decimal)
├─ cost_price (Decimal)
├─ images (JSONB)
├─ is_customizable (Boolean)
├─ is_featured (Boolean)
├─ stock_status (in_stock|out_of_stock|made_to_order)
└─ timestamps

public.inventory
├─ id (UUID)
├─ product_id (UUID FK)
├─ stock_quantity (Integer)
├─ reserved_quantity (Integer)
├─ low_stock_threshold (Integer)
└─ timestamps

public.stock_movements
├─ id (UUID)
├─ product_id (UUID FK)
├─ movement_type (inbound|outbound|adjustment|reserved|released)
├─ quantity (Integer)
├─ reason (String)
├─ performed_by (UUID FK → profiles)
└─ created_at (Timestamp)
```

#### Orders & Quotations
```sql
public.orders
├─ id (UUID)
├─ order_number (String UNIQUE)
├─ customer_id (UUID FK → profiles)
├─ quotation_id (UUID FK)
├─ status (pending|confirmed|production|shipped|delivered|cancelled)
├─ payment_status (pending|partial|paid|refunded)
├─ subtotal (Decimal)
├─ total (Decimal)
└─ timestamps

public.quotations
├─ id (UUID)
├─ quote_number (String UNIQUE)
├─ customer_id (UUID FK)
├─ status (draft|sent|viewed|accepted|rejected|expired)
├─ subtotal (Decimal)
├─ tax_amount (Decimal)
├─ discount_amount (Decimal)
├─ shipping_cost (Decimal)
├─ total_amount (Decimal)
├─ valid_until (Date)
└─ timestamps

public.order_status_history
├─ id (UUID)
├─ order_id (UUID FK)
├─ old_status (String)
├─ new_status (String)
├─ changed_by (UUID FK)
├─ change_reason (String)
└─ created_at (Timestamp)
```

#### Deliveries & Returns
```sql
public.deliveries
├─ id (UUID)
├─ order_id (UUID FK)
├─ tracking_number (String)
├─ courier_name (String)
├─ delivery_type (standard|express|same_day)
├─ status (pending|picked_up|in_transit|out_for_delivery|delivered|failed)
├─ scheduled_date (Date)
├─ delivered_date (Date)
├─ delivery_cost (Decimal)
└─ timestamps

public.returns
├─ id (UUID)
├─ order_id (UUID FK)
├─ return_number (String UNIQUE)
├─ reason (String)
├─ reason_category (defective|wrong_item|not_as_described|changed_mind|other)
├─ return_type (refund|exchange|store_credit)
├─ status (requested|approved|rejected|received|inspected|completed)
├─ refund_amount (Decimal)
└─ timestamps

public.delivery_zones
├─ id (UUID)
├─ zone_name (String)
├─ postal_codes (JSONB Array)
├─ cities (JSONB Array)
├─ delivery_types (JSONB → {standard: cost, express: cost, same_day: cost})
└─ timestamps
```

## API Endpoints

### Authentication
```
POST   /auth/register
POST   /auth/login
POST   /auth/logout
GET    /auth/me
POST   /auth/refresh-token
```

### Products
```
GET    /products
GET    /products/:id
POST   /products (admin)
PUT    /products/:id (admin)
DELETE /products/:id (admin)
```

### Orders
```
GET    /orders (admin - all orders)
GET    /orders/my (customer - own orders)
GET    /orders/:id
POST   /orders (create order)
PUT    /orders/:id/status (admin - update status)
GET    /orders/:id/tracking
```

### Payments
```
POST   /payments/create-intent
POST   /webhooks/stripe
```

### Inventory
```
GET    /inventory
GET    /inventory/:product_id
POST   /inventory/adjust (admin)
GET    /inventory/movements
```

### Deliveries
```
GET    /deliveries
GET    /deliveries/:order_id
PUT    /deliveries/:id (admin)
GET    /delivery-zones
```

### Returns
```
POST   /returns/request
GET    /returns/:order_id
PUT    /returns/:id (admin)
GET    /returns/:id/status
```

## Security Architecture

### Authentication Flow
```
1. User Login
   └─→ Supabase Auth (Email + Password)
       ├─→ JWT Token generated
       ├─→ Refresh token stored in secure httpOnly cookie
       └─→ Access token returned to client

2. API Authorization
   └─→ Every request includes JWT in Authorization header
       ├─→ Verify JWT signature
       ├─→ Check token expiry
       ├─→ Validate user role (admin/editor/viewer/customer)
       └─→ Execute request or return 401/403
```

### Database Security (RLS - Row Level Security)
```
Customers can:
  - View/Edit own profile
  - View own orders
  - Create orders
  - View own quotations

Editors can:
  - View all customers
  - Manage products
  - View/Update orders
  - Manage quotations

Admins can:
  - Full database access
  - Manage all users
  - Analytics access
```

## Deployment Architecture

```
                    Hostinger Shared/VPS
                    ┌───────────────────┐
                    │  Node.js Server   │
                    │  (Express API)    │
                    │  Port: 3001       │
                    └────────┬──────────┘
                             │ HTTPS
                             │
        ┌────────────────────┼─────────────────────┐
        │                    │                     │
        ▼                    ▼                     ▼
   Vercel/Netlify     Vercel/Netlify        Supabase Cloud
   ┌──────────────┐   ┌──────────────┐    ┌──────────────┐
   │   Frontend   │   │    Admin     │    │  PostgreSQL  │
   │  Storefront  │   │  Dashboard   │    │  Database    │
   │   (React)    │   │   (React)    │    │              │
   └──────────────┘   └──────────────┘    └──────────────┘
```

---

**Version**: 2.0.0  
**Last Updated**: November 2025
