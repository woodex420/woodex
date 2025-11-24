# Content Structure Plan - Woodex Furniture V2.1

## 1. Material Inventory

**Content Files:**
- PDF extract: Website Ui.pdf (comprehensive content covering all sections)
  - Hero/Company introduction
  - Product categories (7 categories)
  - Services (6 service types)
  - About Us section (Mission, Vision, Values, Products)
  - FAQ section with contact methods
  - Footer information

**Visual Assets:**
- `user_input_files/image.png` - Logo variations and typography samples
- `user_input_files/image_1.png` - Logo on different backgrounds with color palette
- PDF embedded images: Product photos, office furniture imagery

**Brand Assets:**
- Logo: Stylized 'W' icon + WOODEX wordmark
- Color palette: #C2F21E (lime green), #000000, #FFFFFF, #595C59, #484848, #FAFAFA
- Typography: Acumin (headings), Raleway (body)

## 2. Website Structure

**Type:** SPA (Single Page Application)

**Reasoning:** 
- Total content ~2000 words across all sections
- Single cohesive story: "Premium office furniture manufacturer"
- 7 main sections with clear flow
- Single conversion goal: Contact/Quote/Purchase
- Content works as continuous scrolling narrative
- Target audience expects quick overview before engagement

## 3. Section Breakdown

### Section 1: Header/Navigation (Fixed)
**Purpose:** Global navigation and brand presence
**Content Mapping:**

| Section | Component Pattern | Data Source | Content to Extract | Visual Asset |
|---------|------------------|-------------|-------------------|--------------|
| Logo Area | Logo + Wordmark | user_input_files/image_1.png | WOODEX branding | image_1.png (logo variations) |
| Main Navigation | Horizontal Nav Menu | PDF extract L51-54 | Shop, About Us, Projects, Portfolio, Services, Series, FAQs | - |
| Contact Info | Header Contact | PDF extract L55-56 | Phone: +92 322 4000 768, Hours: Mon-Fri 10:30 AM - 7:30 PM | - |

---

### Section 2: Hero Section (500-600px)
**Purpose:** Brand statement and primary conversion
**Content Mapping:**

| Section | Component Pattern | Data Source | Content to Extract | Visual Asset |
|---------|------------------|-------------|-------------------|--------------|
| Main Headline | Hero Title | PDF extract L50 | "Pakistan's premium custom office furniture manufacturer" | - |
| Tagline | Hero Subtitle | PDF extract L51 | "Design-to-delivery solutions for modern workspaces" | - |
| CTA Buttons | Primary + Secondary Buttons | - | Call to action prompts | - |
| Background | Full-width Hero Image | - | Office workspace imagery | - |

---

### Section 3: Product Categories Grid (Auto height)
**Purpose:** Product navigation and category showcase
**Content Mapping:**

| Section | Component Pattern | Data Source | Content to Extract | Visual Asset |
|---------|------------------|-------------|-------------------|--------------|
| Category Cards | 7-item Grid (4 cols → 2 cols → 1 col) | PDF extract L52-54 | Ergonomic Chair, Executive Desks, Workstations, Reception, Meeting Table, Office Sofa, Storage | - |
| Category Images | Card Images | - | Representative product images per category | - |

---

### Section 4: Services Section (Auto height)
**Purpose:** Service offerings showcase
**Content Mapping:**

| Section | Component Pattern | Data Source | Content to Extract | Visual Asset |
|---------|------------------|-------------|-------------------|--------------|
| Services Grid | 6-item Grid (3 cols → 2 cols → 1 col) | PDF extract L60-61 | E-Quotation, Planning Ideas, Virtual Showroom, Delivery Installation, Material & Color, Workspace Design | - |
| Service Icons | Icon + Text Cards | - | Service descriptions | - |

---

### Section 5: About Us Section (Auto height)
**Purpose:** Build trust and communicate brand values
**Content Mapping:**

| Section | Component Pattern | Data Source | Content to Extract | Visual Asset |
|---------|------------------|-------------|-------------------|--------------|
| Why Choose Woodex | 2-column Layout | PDF extract L63-69 | "Every workday needs a workspace that delivers..." full paragraph | - |
| Mission Statement | Text Block | PDF extract L71-72 | "Our Mission: Redefining Office Spaces" + description | - |
| Who We Are | Text Block | PDF extract L74 | Company background paragraph | - |
| Our Values | 4-item List/Grid | PDF extract L76-82 | Quality, Innovation, Sustainability, Customer-Centricity with descriptions | - |
| Our Products | Expandable List | PDF extract L84-94 | Detailed product descriptions (Ergonomic Chairs, Desks, Conference, Storage, Reception, Collaborative) | - |

---

### Section 6: FAQ & Contact Section (Auto height)
**Purpose:** Address queries and provide contact options
**Content Mapping:**

| Section | Component Pattern | Data Source | Content to Extract | Visual Asset |
|---------|------------------|-------------|-------------------|--------------|
| FAQ Header | Section Title | PDF extract L3,L5 | "Get answers to your queries" | - |
| FAQ Description | Text Block | PDF extract L7-8 | Introduction paragraph + compiled questions note | - |
| Contact Methods | 4-column Grid (→ 2 cols → 1 col) | PDF extract L10-21 | Call Now (+92 322 4000 768), Let's Talk (chat), Email Us (info@woodexfurniture.pk), Get Direction | - |
| Contact Cards | Icon + Text Cards | - | Contact method descriptions | - |

---

### Section 7: Footer (Auto height)
**Purpose:** Site navigation, legal, contact info
**Content Mapping:**

| Section | Component Pattern | Data Source | Content to Extract | Visual Asset |
|---------|------------------|-------------|-------------------|--------------|
| Footer Logo | Logo Placement | user_input_files/image_1.png | WOODEX logo (white on dark bg) | image_1.png |
| Footer Navigation | Multi-column Links | PDF extract L50-61 | Shop categories, Learn More links, Services | - |
| Contact Info | Contact Block | PDF extract L99-100 | Phone, Email, Hours | - |
| Copyright | Text Line | PDF extract L24 | "© 2025 WoodEx Furniture. All rights reserved." | - |

---

## 4. Content Analysis

**Information Density:** Medium
- ~2000 words total content
- 7 product categories
- 6 service types
- 4 core values with descriptions
- 6 detailed product descriptions
- 4 contact methods

**Content Balance:**
- Text: ~2000 words (60%)
- Product/Service listings: 13 items (25%)
- Visual elements: Logo, product images, service icons (15%)
- **Content Type:** Mixed (text + product showcase + service offerings)

**Design Implications:**
- Needs clear visual hierarchy for text-heavy About section
- Card-based layouts for products/services
- Icon integration for services and contact methods
- Ample whitespace to prevent overwhelming users
- Progressive disclosure for detailed content (e.g., expandable FAQ)
