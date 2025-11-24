# Woodex Master Platform - Technical Architecture

## Executive Summary

Comprehensive furniture business platform combining admin dashboard, virtual showroom, WhatsApp automation, e-quotation system, and real-time collaboration with workspace.ae design system.

## Architecture Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                    FRONTEND APPLICATION                         │
├─────────────────────────────────────────────────────────────────┤
│  1. Admin Dashboard    │  4. E-Quotation System                │
│  2. Virtual Showroom   │  5. Real-time Collaboration           │
│  3. WhatsApp UI        │  6. Customer Portal                   │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│                    SUPABASE BACKEND                             │
├─────────────────────────────────────────────────────────────────┤
│  Database (PostgreSQL)                                          │
│  - Authentication & RBAC                                        │
│  - Products & Categories                                        │
│  - Customers & CRM                                              │
│  - Orders & Quotations                                          │
│  - WhatsApp Messages                                            │
│  - Analytics & Reporting                                        │
│  - Real-time Collaboration                                      │
├─────────────────────────────────────────────────────────────────┤
│  Storage Buckets                                                │
│  - product-images, customer-docs, quotations, media             │
├─────────────────────────────────────────────────────────────────┤
│  Edge Functions                                                 │
│  - whatsapp-handler, quotation-generator, analytics             │
├─────────────────────────────────────────────────────────────────┤
│  Realtime Subscriptions                                         │
│  - Live updates, cursors, presence                              │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│                EXTERNAL INTEGRATIONS                            │
├─────────────────────────────────────────────────────────────────┤
│  WhatsApp Web.js  │  Email Service  │  PDF Generation         │
└─────────────────────────────────────────────────────────────────┘
```

## Database Schema Design

### 1. Authentication & User Management

**profiles** (extends auth.users)
- id (uuid, pk, references auth.users)
- full_name (text)
- role (enum: admin, editor, viewer)
- avatar_url (text)
- phone (text)
- department (text)
- created_at (timestamp)
- updated_at (timestamp)

**user_permissions**
- id (uuid, pk)
- user_id (uuid, references profiles)
- module (text: products, customers, orders, quotations, settings)
- can_view (boolean)
- can_create (boolean)
- can_edit (boolean)
- can_delete (boolean)
- created_at (timestamp)

### 2. Products & Categories

**categories**
- id (uuid, pk)
- name (text)
- slug (text, unique)
- description (text)
- parent_id (uuid, nullable - for hierarchy)
- image_url (text)
- sort_order (integer)
- is_active (boolean)
- created_at (timestamp)
- updated_at (timestamp)

**products**
- id (uuid, pk)
- name (text)
- slug (text, unique)
- sku (text, unique)
- description (text)
- category_id (uuid)
- base_price (decimal)
- cost_price (decimal)
- dimensions (jsonb: {width, height, depth, unit})
- weight (decimal)
- materials (jsonb: array of material options)
- finishes (jsonb: array of finish options)
- images (jsonb: array of image URLs)
- panorama_image (text, nullable - for 360° viewer)
- is_customizable (boolean)
- is_featured (boolean)
- is_active (boolean)
- stock_status (enum: in_stock, out_of_stock, made_to_order)
- metadata (jsonb: additional product data)
- created_at (timestamp)
- updated_at (timestamp)

**product_variants**
- id (uuid, pk)
- product_id (uuid)
- variant_name (text)
- sku (text, unique)
- material (text)
- finish (text)
- color (text)
- price_adjustment (decimal)
- images (jsonb)
- is_active (boolean)
- created_at (timestamp)

**inventory**
- id (uuid, pk)
- product_id (uuid)
- variant_id (uuid, nullable)
- quantity (integer)
- location (text)
- last_updated (timestamp)

### 3. Customers & CRM

**customers**
- id (uuid, pk)
- customer_type (enum: individual, business)
- full_name (text)
- company_name (text, nullable)
- email (text)
- phone (text)
- whatsapp_number (text)
- address (jsonb: {street, city, state, country, postal_code})
- tax_id (text, nullable)
- lead_source (text)
- lead_score (integer)
- status (enum: lead, prospect, active, inactive)
- assigned_to (uuid, references profiles)
- notes (text)
- tags (text[])
- created_at (timestamp)
- updated_at (timestamp)

**customer_interactions**
- id (uuid, pk)
- customer_id (uuid)
- interaction_type (enum: call, email, whatsapp, meeting, note)
- subject (text)
- content (text)
- created_by (uuid, references profiles)
- created_at (timestamp)

### 4. Orders & Quotations

**quotations**
- id (uuid, pk)
- quote_number (text, unique)
- customer_id (uuid)
- status (enum: draft, sent, viewed, accepted, rejected, expired)
- subtotal (decimal)
- tax_amount (decimal)
- discount_amount (decimal)
- shipping_cost (decimal)
- total_amount (decimal)
- currency (text, default: PKR)
- valid_until (date)
- notes (text)
- terms_conditions (text)
- created_by (uuid, references profiles)
- pdf_url (text, nullable)
- created_at (timestamp)
- updated_at (timestamp)

**quotation_items**
- id (uuid, pk)
- quotation_id (uuid)
- product_id (uuid)
- variant_id (uuid, nullable)
- item_name (text)
- description (text)
- quantity (integer)
- unit_price (decimal)
- customizations (jsonb)
- line_total (decimal)
- created_at (timestamp)

**orders**
- id (uuid, pk)
- order_number (text, unique)
- quotation_id (uuid, nullable)
- customer_id (uuid)
- status (enum: pending, confirmed, production, shipped, delivered, cancelled)
- payment_status (enum: pending, partial, paid, refunded)
- subtotal (decimal)
- tax_amount (decimal)
- discount_amount (decimal)
- shipping_cost (decimal)
- total_amount (decimal)
- currency (text)
- shipping_address (jsonb)
- billing_address (jsonb)
- payment_method (text)
- notes (text)
- created_at (timestamp)
- updated_at (timestamp)

**order_items**
- id (uuid, pk)
- order_id (uuid)
- product_id (uuid)
- variant_id (uuid, nullable)
- item_name (text)
- quantity (integer)
- unit_price (decimal)
- customizations (jsonb)
- production_status (enum: pending, in_progress, completed)
- line_total (decimal)
- created_at (timestamp)

### 5. WhatsApp Integration

**whatsapp_messages**
- id (uuid, pk)
- message_id (text, unique - WhatsApp message ID)
- customer_id (uuid, nullable)
- phone_number (text)
- direction (enum: incoming, outgoing)
- message_type (enum: text, image, document, audio, video)
- content (text)
- media_url (text, nullable)
- status (enum: pending, sent, delivered, read, failed)
- response_to (uuid, nullable - references parent message)
- automation_triggered (boolean)
- created_at (timestamp)
- updated_at (timestamp)

**whatsapp_templates**
- id (uuid, pk)
- name (text, unique)
- category (text: greeting, follow_up, quotation, order_update)
- content (text)
- variables (jsonb: array of variable placeholders)
- is_active (boolean)
- usage_count (integer)
- created_at (timestamp)
- updated_at (timestamp)

**whatsapp_automation_rules**
- id (uuid, pk)
- name (text)
- trigger_type (enum: keyword, schedule, event)
- trigger_value (text)
- action_type (enum: send_template, create_lead, assign_user, add_tag)
- action_config (jsonb)
- is_active (boolean)
- created_at (timestamp)

### 6. Analytics & Reporting

**analytics_daily**
- id (uuid, pk)
- date (date, unique)
- messages_sent (integer)
- messages_received (integer)
- leads_generated (integer)
- quotations_created (integer)
- quotations_accepted (integer)
- orders_created (integer)
- revenue (decimal)
- active_users (integer)
- created_at (timestamp)

**user_activity_log**
- id (uuid, pk)
- user_id (uuid)
- action (text)
- resource_type (text)
- resource_id (uuid)
- metadata (jsonb)
- ip_address (text)
- created_at (timestamp)

### 7. Real-time Collaboration

**collaboration_sessions**
- id (uuid, pk)
- session_name (text)
- resource_type (text: quotation, order, product)
- resource_id (uuid)
- active_users (jsonb: array of user IDs)
- created_at (timestamp)
- expires_at (timestamp)

**user_presence**
- id (uuid, pk)
- user_id (uuid)
- session_id (uuid)
- cursor_position (jsonb: {x, y, page})
- last_activity (timestamp)
- is_active (boolean)

### 8. Media Library

**media_assets**
- id (uuid, pk)
- name (text)
- file_type (text)
- file_size (integer)
- mime_type (text)
- storage_path (text)
- public_url (text)
- uploaded_by (uuid, references profiles)
- tags (text[])
- metadata (jsonb)
- created_at (timestamp)

## Storage Buckets

1. **product-images** (public)
   - Product photos
   - 360° panoramas
   - Material swatches

2. **customer-documents** (private)
   - Contracts
   - Invoices
   - Customer files

3. **quotations** (private)
   - Generated PDF quotations
   - Quotation attachments

4. **media-library** (public)
   - General media assets
   - Marketing materials

## Edge Functions

### 1. whatsapp-message-handler
**Purpose:** Process incoming WhatsApp messages, create leads, trigger automations
**Triggers:** Webhook from WhatsApp Web.js
**Logic:**
- Parse incoming message
- Match/create customer record
- Check automation rules
- Send automated responses
- Log to database

### 2. quotation-generator
**Purpose:** Generate PDF quotations from quotation data
**Triggers:** Manual or automated
**Logic:**
- Fetch quotation data
- Apply branding and templates
- Generate PDF
- Upload to storage
- Update quotation record with PDF URL

### 3. analytics-aggregator (cron)
**Purpose:** Daily analytics aggregation
**Triggers:** Scheduled (daily at midnight)
**Logic:**
- Aggregate daily statistics
- Calculate KPIs
- Update analytics_daily table

### 4. order-status-notifier
**Purpose:** Send WhatsApp notifications for order updates
**Triggers:** Order status change
**Logic:**
- Detect status change
- Format notification message
- Send via WhatsApp API
- Log notification

## Real-time Subscriptions

### Channels:
1. **quotations-channel**: Live quotation updates
2. **orders-channel**: Live order updates
3. **presence-channel**: User presence and cursors
4. **messages-channel**: WhatsApp messages in real-time

## Technology Stack

### Frontend
- React 18 + TypeScript
- Vite
- TailwindCSS (workspace.ae design tokens)
- React Router (multi-page navigation)
- Supabase JS Client
- Pannellum (360° viewer)
- Chart.js / Recharts (analytics)

### Backend
- Supabase (PostgreSQL, Auth, Storage, Realtime, Edge Functions)
- Row-Level Security (RLS) policies
- Database triggers for automation

### External Services
- WhatsApp Web.js (message automation)
- PDF generation library (for quotations)
- Email service (notifications)

## Security & Access Control

### Role-Based Access Control (RBAC)

**Admin Role:**
- Full access to all modules
- User management
- System settings
- Financial data

**Editor Role:**
- Create/edit products, categories
- Manage customers and orders
- Create quotations
- View analytics
- No access to: user management, financial settings

**Viewer Role:**
- Read-only access to products, customers
- View orders and quotations
- View analytics
- No create/edit/delete permissions

### RLS Policies Implementation

All tables protected with RLS policies:
- Users can only access data based on role
- Row-level filtering for sensitive data
- Auth checks on all operations
- Allow both 'anon' and 'service_role' for edge function compatibility

## Workspace.ae Design System Integration

### Design Tokens
- Colors: #333333 (primary text), #FFFFFF (surfaces), #000000 (accents)
- Typography: Raleway font family, 11-51px scale
- Spacing: 100px section spacing, 30px component padding
- Grid: Responsive breakpoints (992px, 767px)

### Component Mapping
- Global Header: Logo, navigation, search, account, cart
- Product Cards: Image, title, price, badges, CTAs
- Service Blocks: Icon + text, 3-column layout
- Buttons: Primary/Secondary CTAs with hover states
- Badges: Discount, New, Award indicators

## Implementation Phases

### Phase 1: Backend Foundation (Week 1-2)
1. Database schema implementation
2. RLS policies setup
3. Storage buckets creation
4. Basic edge functions
5. Testing infrastructure

### Phase 2: Core Features Integration (Week 3-4)
1. Admin dashboard integration
2. Product management system
3. Customer CRM
4. Order management
5. User authentication & RBAC

### Phase 3: Advanced Features (Week 5-6)
1. Virtual showroom integration
2. E-quotation system
3. WhatsApp automation
4. Real-time collaboration
5. Analytics dashboard

### Phase 4: Polish & Deployment (Week 7-8)
1. Workspace.ae design system application
2. Responsive optimization
3. Performance tuning
4. Comprehensive testing
5. Production deployment

## Success Metrics

### Technical KPIs
- Page load time: < 2s
- API response time: < 500ms
- Real-time latency: < 100ms
- Uptime: > 99.9%

### Business KPIs
- User adoption rate: > 90%
- Daily active users: > 80%
- Quotation conversion: > 15%
- Customer satisfaction: > 4.5/5

## Risk Mitigation

### Technical Risks
1. **WhatsApp API Limitations**: Implement rate limiting and queue system
2. **Real-time Performance**: Use efficient subscriptions, cursor debouncing
3. **PDF Generation**: Optimize templates, use caching
4. **Storage Costs**: Image optimization, CDN integration

### Business Risks
1. **User Training**: Comprehensive onboarding and documentation
2. **Data Migration**: Backup strategy, rollback plan
3. **Integration Complexity**: Modular architecture, incremental rollout
4. **Scalability**: Load testing, horizontal scaling preparation
