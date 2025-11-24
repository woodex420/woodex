# Wireframe - Woodex Furniture V2.1 Homepage

## Overview
Single-page application (SPA) with 7 main sections in vertical scroll layout.
Total estimated height: ~4000-5000px (desktop), responsive stacking on mobile.

---

## Section 1: Fixed Header (80px height)

```
┌─────────────────────────────────────────────────────────────────────────────┐
│  [WOODEX LOGO]    Shop  About  Projects  Portfolio  Services  FAQs         │
│                                                    📞 +92 322 4000 768      │
│                                                    🕐 Mon-Fri: 10:30-7:30   │
└─────────────────────────────────────────────────────────────────────────────┘
```

**Layout Details:**
- Left: Logo (icon + wordmark, 40px height)
- Center: Horizontal navigation menu (7 items)
- Right: Contact information (phone + hours)
- Background: White (#FFFFFF) with subtle shadow
- Sticky position: Fixed to top during scroll

**Responsive (Mobile < 1024px):**
- Logo left, hamburger menu right
- Contact info moves to menu drawer
- Height reduces to 64px

---

## Section 2: Hero Section (500-600px height)

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                                                                             │
│                    [FULL-WIDTH BACKGROUND IMAGE]                            │
│                         + Dark Overlay (60%)                                │
│                                                                             │
│              Pakistan's premium custom office                               │
│              furniture manufacturer                                         │
│                                                                             │
│        Design-to-delivery solutions for modern workspaces                   │
│                                                                             │
│           [Get Started CTA]  [Contact Us CTA]                               │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

**Layout Details:**
- Full viewport width background image (office workspace)
- Dark overlay: rgba(0,0,0,0.6) for text legibility
- Content centered vertically and horizontally
- Headline: 72px, white, Acumin Extra Bold
- Tagline: 20px, white, Raleway Light
- Two CTAs: Primary (lime green) + Secondary (outlined)
- Content max-width: 1200px

**Responsive (Mobile):**
- Height: Auto (min 400px)
- Headline: 40px
- Buttons stack vertically with 16px gap

---

## Section 3: Product Categories (Auto height, ~800px)

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                                                                             │
│                         Our Product Categories                              │
│                   Discover premium office furniture solutions              │
│                                                                             │
│   ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐                  │
│   │  Image   │  │  Image   │  │  Image   │  │  Image   │                  │
│   │          │  │          │  │          │  │          │                  │
│   │ Ergonomic│  │Executive │  │ Work-    │  │Reception │                  │
│   │  Chair   │  │  Desks   │  │ stations │  │          │                  │
│   └──────────┘  └──────────┘  └──────────┘  └──────────┘                  │
│                                                                             │
│   ┌──────────┐  ┌──────────┐  ┌──────────┐                                │
│   │  Image   │  │  Image   │  │  Image   │                                │
│   │          │  │          │  │          │                                │
│   │ Meeting  │  │  Office  │  │ Storage  │                                │
│   │  Table   │  │   Sofa   │  │          │                                │
│   └──────────┘  └──────────┘  └──────────┘                                │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

**Layout Details:**
- Section padding: 96px vertical
- Background: #FAFAFA (subtle grey)
- Section heading: 48px, centered
- Card grid: 4 columns, 32px gap
- Each card: 
  - Background: White
  - Image area: Full-width, 4:3 aspect ratio
  - Padding: 32px
  - Title: 24px, Acumin Bold
  - Hover: Lift + shadow enhancement

**Responsive:**
- Desktop (1024px+): 4 columns
- Tablet (768px): 2 columns
- Mobile (<768px): 1 column

---

## Section 4: Services Section (Auto height, ~700px)

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                                                                             │
│                          Our Services                                       │
│                 Comprehensive solutions for your workspace                  │
│                                                                             │
│   ┌─────────────┐    ┌─────────────┐    ┌─────────────┐                   │
│   │    📋       │    │    💡       │    │    🖥️       │                   │
│   │             │    │             │    │             │                   │
│   │E-Quotation  │    │Planning     │    │  Virtual    │                   │
│   │             │    │   Ideas     │    │ Showroom    │                   │
│   │Description  │    │Description  │    │Description  │                   │
│   └─────────────┘    └─────────────┘    └─────────────┘                   │
│                                                                             │
│   ┌─────────────┐    ┌─────────────┐    ┌─────────────┐                   │
│   │    🚚       │    │    🎨       │    │    📐       │                   │
│   │             │    │             │    │             │                   │
│   │ Delivery    │    │Material &   │    │ Workspace   │                   │
│   │Installation │    │   Color     │    │   Design    │                   │
│   │Description  │    │Description  │    │Description  │                   │
│   └─────────────┘    └─────────────┘    └─────────────┘                   │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

**Layout Details:**
- Section padding: 96px vertical
- Background: White (#FFFFFF)
- Section heading: 48px, centered
- Card grid: 3 columns, 32px gap
- Each card:
  - Icon: 48px, lime green (#C2F21E), top center
  - Title: 20px, Acumin Semibold
  - Description: 16px, Raleway Regular, grey
  - Hover: Border changes to lime green, subtle lift

**Responsive:**
- Desktop (1024px+): 3 columns
- Tablet (768px): 2 columns
- Mobile (<768px): 1 column

---

## Section 5: About Us Section (Auto height, ~1200px)

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                                                                             │
│                           About Woodex                                      │
│                                                                             │
│  ┌─────────────────────────┐  ┌─────────────────────────┐                 │
│  │                         │  │                         │                 │
│  │  Why Choose Woodex      │  │   [Office Image]        │                 │
│  │                         │  │                         │                 │
│  │  Every workday needs... │  │                         │                 │
│  │  (full paragraph text)  │  │                         │                 │
│  │                         │  │                         │                 │
│  └─────────────────────────┘  └─────────────────────────┘                 │
│                                                                             │
│  ┌────────────────────────────────────────────────────────────┐            │
│  │  Our Mission: Redefining Office Spaces                     │            │
│  │  (Mission statement paragraph)                             │            │
│  └────────────────────────────────────────────────────────────┘            │
│                                                                             │
│  ┌────────────────────────────────────────────────────────────┐            │
│  │  Who We Are                                                │            │
│  │  (Company background paragraph)                            │            │
│  └────────────────────────────────────────────────────────────┘            │
│                                                                             │
│                          Our Values                                         │
│                                                                             │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐                   │
│  │ Quality  │  │Innovation│  │Sustaina- │  │Customer- │                   │
│  │          │  │          │  │ bility   │  │Centricity│                   │
│  │ (desc)   │  │ (desc)   │  │ (desc)   │  │ (desc)   │                   │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘                   │
│                                                                             │
│  ┌────────────────────────────────────────────────────────────┐            │
│  │  Our Products (Expandable section)                         │            │
│  │  • Ergonomic Chairs (description)                          │            │
│  │  • Desks and Workstations (description)                    │            │
│  │  • Conference Room Furniture (description)                 │            │
│  │  • Storage Solutions (description)                         │            │
│  │  • Reception Area Furniture (description)                  │            │
│  │  • Collaborative Furniture (description)                   │            │
│  └────────────────────────────────────────────────────────────┘            │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

**Layout Details:**
- Section padding: 96px vertical
- Background: #FAFAFA (subtle grey)
- Multiple sub-sections with varied layouts:
  - "Why Choose": 2-column (50/50 split, text left, image right)
  - "Mission" & "Who We Are": Full-width text blocks (max-width 800px)
  - "Our Values": 4-column card grid
  - "Our Products": Expandable/accordion list or full text display
- Typography hierarchy: H2 (48px) → H3 (32px) → Body (18px)
- Text blocks: Line-height 1.6, color #484848

**Responsive:**
- 2-column layouts stack to 1 column on mobile
- Values grid: 4 cols → 2 cols → 1 col
- Text max-width adjusts for readability

---

## Section 6: FAQ & Contact Section (Auto height, ~600px)

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                                                                             │
│                     Get answers to your queries                             │
│                                                                             │
│   Have a question? Whether it's about a product, pricing, availability...  │
│   We have compiled questions based on commonly raised concerns...           │
│                                                                             │
│   ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐                  │
│   │    📞    │  │    💬    │  │    ✉️    │  │    📍    │                  │
│   │          │  │          │  │          │  │          │                  │
│   │Call Now  │  │Let's Talk│  │Email Us  │  │   Get    │                  │
│   │          │  │          │  │          │  │Direction │                  │
│   │+92 322   │  │Available │  │info@     │  │Visit our │                  │
│   │4000 768  │  │ to chat  │  │woodex... │  │ office   │                  │
│   │          │  │          │  │          │  │          │                  │
│   │[Action]  │  │[Action]  │  │[Action]  │  │[Action]  │                  │
│   └──────────┘  └──────────┘  └──────────┘  └──────────┘                  │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

**Layout Details:**
- Section padding: 96px vertical
- Background: White (#FFFFFF)
- Section heading: 48px, centered
- Intro paragraph: 18px, centered, max-width 800px
- Contact cards grid: 4 columns, 24px gap
- Each card:
  - Icon: 48px, lime green, centered top
  - Title: 20px, Acumin Semibold
  - Description: 16px, Raleway Regular
  - Action link/button: Lime green color
  - Hover: Green border (2px) + lift effect

**Responsive:**
- Desktop: 4 columns
- Tablet: 2 columns
- Mobile: 1 column

---

## Section 7: Footer (Auto height, ~400px)

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                                                                             │
│  [WOODEX LOGO]                                                              │
│  Pakistan's premium custom office furniture manufacturer.                   │
│  Design-to-delivery solutions for modern workspaces.                        │
│                                                                             │
│  ┌────────────┐  ┌────────────┐  ┌────────────┐  ┌────────────┐           │
│  │   Shop     │  │ Learn More │  │  Services  │  │  Contact   │           │
│  │            │  │            │  │            │  │            │           │
│  │• Ergonomic │  │• About Us  │  │• E-Quote   │  │Phone:      │           │
│  │  Chair     │  │• Projects  │  │• Planning  │  │+92 322...  │           │
│  │• Executive │  │• Portfolio │  │• Virtual   │  │            │           │
│  │  Desks     │  │• Services  │  │  Showroom  │  │Email:      │           │
│  │• Work-     │  │• Series    │  │• Delivery  │  │info@...    │           │
│  │  stations  │  │• FAQs      │  │• Material  │  │            │           │
│  │• Reception │  │            │  │• Workspace │  │Hours:      │           │
│  │• Meeting   │  │            │  │  Design    │  │Mon-Fri     │           │
│  │  Table     │  │            │  │            │  │10:30-7:30  │           │
│  │• Office    │  │            │  │            │  │            │           │
│  │  Sofa      │  │            │  │            │  │            │           │
│  │• Storage   │  │            │  │            │  │            │           │
│  └────────────┘  └────────────┘  └────────────┘  └────────────┘           │
│                                                                             │
│  ─────────────────────────────────────────────────────────────────────────  │
│                                                                             │
│  © 2025 WoodEx Furniture. All rights reserved.                             │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

**Layout Details:**
- Section padding: 64px vertical
- Background: Dark grey (#595C59)
- Text color: White
- Logo + tagline: Top, centered or left-aligned
- Navigation columns: 4 columns
  - Shop (products list)
  - Learn More (pages)
  - Services (service types)
  - Contact (info)
- Bottom bar: Copyright text, centered, smaller font (14px)
- Links: White with lime green hover

**Responsive:**
- Desktop: 4 columns
- Tablet: 2 columns
- Mobile: 1 column (stacked)

---

## Mobile Wireframe Summary (<768px)

**Key Changes:**
1. **Header:** Logo + hamburger menu (64px height)
2. **Hero:** Vertical stacking, reduced text sizes (40px headline)
3. **All Grids:** Convert to single column
4. **Touch Targets:** Minimum 56px height for buttons
5. **Spacing:** Reduced padding (96px → 64px sections)
6. **Images:** Full-width, maintain aspect ratio
7. **Navigation:** Slide-in drawer menu

---

## Design System Quick Reference

**Colors:**
- Primary accent: #C2F21E (lime green)
- Backgrounds: #FFFFFF (white), #FAFAFA (subtle grey), #595C59 (dark grey)
- Text: #000000 (headings), #484848 (body)

**Typography:**
- Headings: Acumin, Bold/Extra Bold
- Body: Raleway, Regular/Light
- Sizes: 72px (hero) → 48px (sections) → 24px (cards) → 16-18px (body)

**Spacing:**
- Sections: 96px vertical
- Cards: 32px padding
- Grids: 32px gap (desktop), 24px (tablet/mobile)

**Components:**
- Cards: White bg, shadow, 12px radius, hover lift
- Buttons: 48-56px height, 8px radius, lime green (primary)
- Icons: 48px, SVG, lime green color

---

## Wireframe Complete

This wireframe provides a complete visual structure for the Woodex Furniture V2.1 homepage, following the design specifications and brand guidelines. All sections are clearly defined with layout patterns, responsive behavior, and component specifications ready for development implementation.
