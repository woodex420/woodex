# Design Specification - Woodex Furniture V2.1

## 1. Direction & Rationale

**Style:** Professional Minimalism with Strategic Accent

**Visual Essence:** Clean, modern aesthetic emphasizing professionalism and trust through generous whitespace, strong typographic hierarchy, and strategic use of lime green (#C2F21E) as a high-impact accent. The design balances corporate credibility with contemporary freshness, positioning Woodex as a premium yet approachable office furniture manufacturer.

**Reference Examples:**
- steelcase.com - Office furniture industry leader, professional presentation
- herman-miller.com - Premium furniture with clean layouts
- stripe.com - Trust-building through minimalist clarity

---

## 2. Design Tokens

### 2.1 Color System

| Token Name | Hex Value | Usage | WCAG Contrast |
|------------|-----------|-------|---------------|
| **Primary Palette** | | | |
| primary-500 | #C2F21E | Primary CTAs, accents, highlights, hover states | - |
| primary-600 | #A5D119 | Active/pressed states for primary elements | - |
| primary-400 | #D4F554 | Lighter accent variations, backgrounds | - |
| **Neutral Palette** | | | |
| neutral-900 | #000000 | Primary headings, navigation text, buttons | White: 21:1 (AAA) |
| neutral-700 | #484848 | Secondary text, descriptions, body copy | White: 9.4:1 (AAA) |
| neutral-600 | #595C59 | Alternative backgrounds, borders | White: 7.9:1 (AAA) |
| neutral-100 | #FAFAFA | Subtle section backgrounds, card surfaces | - |
| neutral-0 | #FFFFFF | Primary page background, card content | Black: 21:1 (AAA) |
| **Background System** | | | |
| bg-page | #FFFFFF | Main page background | - |
| bg-section | #FAFAFA | Alternating section backgrounds | - |
| bg-card | #FFFFFF | Card/elevated surface backgrounds | - |
| bg-overlay | rgba(0,0,0,0.6) | Image overlays for text legibility | - |
| **Semantic Colors** | | | |
| success | #10B981 | Success messages, confirmations | - |
| error | #EF4444 | Error states, validation | - |
| warning | #F59E0B | Warnings, alerts | - |
| info | #3B82F6 | Informational messages | - |

**Key WCAG Validations:**
- Primary text (neutral-900) on white: 21:1 (AAA)
- Secondary text (neutral-700) on white: 9.4:1 (AAA)
- White text on neutral-900: 21:1 (AAA)

### 2.2 Typography

| Token | Value | Usage |
|-------|-------|-------|
| **Font Families** | | |
| font-heading | 'Acumin Variable Concept', sans-serif | All headings, navigation, buttons |
| font-body | 'Raleway', sans-serif | Body text, descriptions, lists |
| **Font Sizes** | | |
| text-xs | 12px / 0.75rem | Small labels, captions |
| text-sm | 14px / 0.875rem | Supporting text, metadata |
| text-base | 16px / 1rem | Body text baseline |
| text-lg | 18px / 1.125rem | Large body text, intro paragraphs |
| text-xl | 20px / 1.25rem | Section subheadings |
| text-2xl | 24px / 1.5rem | Card titles, small headings |
| text-3xl | 32px / 2rem | Section headings |
| text-4xl | 48px / 3rem | Page headings |
| text-5xl | 64px / 4rem | Hero headline |
| text-6xl | 72px / 4.5rem | Large hero displays |
| **Font Weights** | | |
| font-light | 300 | Light body text (Raleway) |
| font-regular | 400 | Standard body text |
| font-semibold | 600 | Emphasized text, subheadings |
| font-bold | 700 | Headings, navigation (Acumin) |
| font-extrabold | 800 | Hero headlines, major headings |
| **Line Heights** | | |
| leading-tight | 1.2 | Large headings, hero text |
| leading-snug | 1.3 | Section headings |
| leading-normal | 1.5 | Standard body text |
| leading-relaxed | 1.6 | Long-form content, paragraphs |
| leading-loose | 1.8 | Highly readable sections |

### 2.3 Spacing Scale (4pt Grid System)

| Token | Value | Usage |
|-------|-------|-------|
| space-1 | 4px | Tight inline spacing, icon gaps |
| space-2 | 8px | Minimum component spacing |
| space-3 | 12px | Related element spacing |
| space-4 | 16px | Default component padding |
| space-6 | 24px | Section element spacing |
| space-8 | 32px | Card padding, component spacing |
| space-12 | 48px | Large card padding, section gaps |
| space-16 | 64px | Section vertical padding |
| space-24 | 96px | Major section spacing |
| space-32 | 128px | Hero section padding |

### 2.4 Border Radius

| Token | Value | Usage |
|-------|-------|-------|
| radius-sm | 4px | Small buttons, tags |
| radius-md | 8px | Cards, inputs, buttons |
| radius-lg | 12px | Large cards, modals |
| radius-xl | 16px | Featured elements |
| radius-full | 9999px | Pills, circular buttons |

### 2.5 Shadows

| Token | Value | Usage |
|-------|-------|-------|
| shadow-sm | 0 1px 2px rgba(0,0,0,0.05) | Subtle elevation |
| shadow-card | 0 4px 12px rgba(0,0,0,0.08) | Default card elevation |
| shadow-card-hover | 0 8px 24px rgba(0,0,0,0.12) | Card hover state |
| shadow-lg | 0 12px 32px rgba(0,0,0,0.15) | Modals, dropdowns |

### 2.6 Animation

| Token | Value | Usage |
|-------|-------|-------|
| duration-fast | 200ms | Icon rotations, small elements |
| duration-normal | 300ms | Standard interactions, hover states |
| duration-slow | 400ms | Page transitions, large movements |
| easing-default | ease-out | Standard ease for most animations |
| easing-smooth | cubic-bezier(0.4, 0, 0.2, 1) | Smooth professional transitions |

---

## 3. Component Specifications

### 3.1 Navigation Header (Fixed)

**Structure:**
- Fixed position header with white background, subtle bottom shadow
- Height: 80px desktop, 64px mobile
- Contains: Logo (left), navigation menu (center), contact info (right)

**Token Application:**
- Background: `bg-card` (#FFFFFF)
- Shadow: `shadow-sm`
- Padding: `space-8` vertical, `space-16` horizontal
- Logo height: 40px
- Nav text: `text-base`, `font-heading`, `font-semibold`
- Nav color: `neutral-900`, hover: `primary-500`

**States:**
- Default: White background, black text
- Hover: Menu items shift to `primary-500`, underline animation (2px, 300ms)
- Active: `primary-500` text with full underline
- Mobile: Hamburger menu icon (24px), slide-in drawer navigation

**Note:** Logo placement left-aligned maintains professional standard. Contact info (phone + hours) prominent in header right for immediate accessibility.

---

### 3.2 Button System

**Primary Button:**
- Background: `primary-500` (#C2F21E)
- Text: `neutral-900` (black), `font-heading`, `font-bold`
- Padding: `space-4` vertical, `space-8` horizontal
- Border-radius: `radius-md` (8px)
- Height: 48px (desktop), 56px (mobile touch-friendly)
- Hover: Background `primary-600`, lift with `shadow-card-hover`, transform scale(1.02)
- Active: Background `primary-600`, scale(0.98)
- Transition: `duration-normal`, `easing-smooth`

**Secondary Button:**
- Background: Transparent
- Border: 2px solid `neutral-900`
- Text: `neutral-900`, `font-heading`, `font-bold`
- Same sizing as primary
- Hover: Background `neutral-900`, text `neutral-0`, lift
- Active: Scale(0.98)

**Note:** High contrast lime green ensures CTAs stand out dramatically against neutral palette. Black text on lime green maintains WCAG AA compliance while creating bold visual impact.

---

### 3.3 Product/Service Card

**Structure:**
- Vertical card layout with image/icon top, content below
- Minimum height: 320px
- Aspect ratio for images: 4:3 or 1:1

**Token Application:**
- Background: `bg-card`
- Shadow: `shadow-card`, hover: `shadow-card-hover`
- Border-radius: `radius-lg` (12px)
- Padding: `space-8` (32px)
- Gap between elements: `space-4`
- Title: `text-2xl`, `font-heading`, `font-bold`, `neutral-900`
- Description: `text-base`, `font-body`, `font-regular`, `neutral-700`
- Icon/Image area: 80px height for service cards, full-width for product cards

**States:**
- Default: Subtle shadow, scale(1)
- Hover: Enhanced shadow, transform translateY(-4px) + scale(1.02), `duration-normal`
- Active: Scale(0.99)

**Grid Layout:**
- Product Categories: 4 columns (desktop) → 2 columns (tablet) → 1 column (mobile)
- Services: 3 columns (desktop) → 2 columns (tablet) → 1 column (mobile)
- Gap: `space-8` (32px)

**Note:** Cards must "float" with clear elevation. Image overlays use `bg-overlay` for text legibility when text overlays images.

---

### 3.4 Hero Section

**Structure:**
- Full-width section, height: 500-600px (desktop), auto (mobile)
- Background: Full-width image with `bg-overlay` gradient overlay
- Content: Centered vertically and horizontally, max-width 1200px

**Token Application:**
- Padding: `space-32` (128px) vertical, `space-16` horizontal
- Headline: `text-6xl` (72px desktop, 48px mobile), `font-heading`, `font-extrabold`, `neutral-0`
- Tagline: `text-xl`, `font-body`, `font-light`, `neutral-0`
- Letter-spacing: -0.02em for headline
- Line-height: `leading-tight` for headline, `leading-normal` for tagline
- Button group spacing: `space-4` gap
- Overlay: `bg-overlay` (rgba(0,0,0,0.6)) for text legibility

**Hierarchy:**
- Primary CTA (lime green button): Prominent, 56-64px height
- Secondary CTA (outlined button): Adjacent, same height
- Text content centered with max-width 800px

**Note:** Hero creates immediate brand impact. Large typography (72px) establishes premium positioning. Lime green CTA creates focal point against dark overlay.

---

### 3.5 Section Layout

**Standard Section Structure:**
- Padding: `space-24` (96px) vertical desktop, `space-16` (64px) mobile
- Background: Alternates between `bg-page` and `bg-section` for visual rhythm
- Max-width: 1400px, centered with auto margins
- Horizontal padding: `space-16` (64px) desktop, `space-8` (32px) tablet, `space-4` (16px) mobile

**Section Heading:**
- Size: `text-4xl` (48px desktop, 32px mobile)
- Font: `font-heading`, `font-bold`
- Color: `neutral-900`
- Margin-bottom: `space-12` (48px)
- Optional accent: 4px `primary-500` left border

**Section Description:**
- Size: `text-lg` (18px)
- Font: `font-body`, `font-regular`
- Color: `neutral-700`
- Max-width: 800px for readability
- Line-height: `leading-relaxed`

**Note:** Sections breathe with 96px vertical spacing. Background alternation (white/subtle grey) creates natural visual breaks without heavy borders.

---

### 3.6 FAQ Contact Cards

**Structure:**
- 4-column grid (desktop) → 2-column (tablet) → 1-column (mobile)
- Each card: Icon (top), title, description, CTA link

**Token Application:**
- Card padding: `space-8` (32px)
- Background: `bg-card`
- Border: 1px solid `neutral-100`, hover: 2px solid `primary-500`
- Border-radius: `radius-lg`
- Icon size: 48px, color: `primary-500`
- Title: `text-xl`, `font-heading`, `font-semibold`, `neutral-900`
- Description: `text-base`, `font-body`, `neutral-700`
- CTA link: `text-base`, `font-semibold`, `primary-500`, underline on hover

**States:**
- Hover: Border transitions to `primary-500`, lift with `shadow-card`, `duration-normal`
- Icon: Subtle scale(1.1) on card hover

**Icons:** Phone, chat bubble, email, map pin (SVG from Lucide/Heroicons, 48px)

**Note:** Contact cards provide clear action paths. Green border on hover signals interactivity. Icons add visual interest while maintaining professionalism.

---

## 4. Layout & Responsive Strategy

### 4.1 Website Architecture (SPA - Single Page)

Based on content-structure-plan.md, the homepage follows this section flow:

**Section Sequence:**
1. **Header (Fixed, 80px)** - Always visible navigation
2. **Hero (500-600px)** - Brand statement + primary CTAs
3. **Product Categories (auto)** - 7-item grid showcase
4. **Services (auto)** - 6-item grid with icons
5. **About Us (auto)** - Multi-block content (Why/Mission/Values/Products)
6. **FAQ & Contact (auto)** - 4-column contact cards + FAQ intro
7. **Footer (auto)** - Multi-column navigation + contact info

**Visual Hierarchy:**
- Hero: Maximum prominence (600px, 72px headlines, 56-64px CTAs)
- Product/Service sections: Equal weight (card grids with consistent styling)
- About Us: Text-heavy, requires subheading hierarchy
- FAQ/Contact: Action-oriented, prominent contact cards

**Navigation Pattern:**
- Fixed header with smooth scroll anchor links to sections
- Optional: Back-to-top button appears after 600px scroll
- Mobile: Hamburger menu with full-screen overlay navigation

**Transitions:**
- Smooth scroll behavior: `scroll-behavior: smooth`
- Section entries: Subtle fade-in on scroll (optional, use Intersection Observer)
- NO parallax effects (maintain performance and accessibility)

### 4.2 Grid System & Breakpoints

**Breakpoints:**
```
sm: 640px   (Mobile landscape)
md: 768px   (Tablet portrait)
lg: 1024px  (Tablet landscape / small desktop)
xl: 1280px  (Desktop)
2xl: 1536px (Large desktop)
```

**Grid Specifications:**

**Product Categories (Section 3):**
- Desktop (lg+): 4 columns, gap `space-8` (32px)
- Tablet (md): 2 columns, gap `space-6` (24px)
- Mobile (sm-): 1 column, gap `space-6`

**Services (Section 4):**
- Desktop (lg+): 3 columns, gap `space-8`
- Tablet (md): 2 columns, gap `space-6`
- Mobile (sm-): 1 column, gap `space-6`

**FAQ Contact Cards (Section 6):**
- Desktop (xl+): 4 columns, gap `space-6`
- Tablet (md): 2 columns, gap `space-6`
- Mobile (sm-): 1 column, gap `space-4`

**Container Widths:**
- Max-width: 1400px for all content sections
- Hero: Full-width background, content centered in 1200px container
- Horizontal padding: 64px (desktop), 32px (tablet), 16px (mobile)

### 4.3 Responsive Adaptations

**Typography Scaling:**
- Hero headline: 72px (desktop) → 56px (tablet) → 40px (mobile)
- Section headings: 48px → 36px → 28px
- Body text: Consistent 16px across breakpoints
- Line-height increases on mobile for readability (1.5 → 1.6)

**Component Adaptations:**
- Cards: Maintain padding ratios (32px → 24px → 16px)
- Buttons: Height increases on mobile (48px → 56px) for touch targets
- Navigation: Hamburger menu below 1024px
- Footer: 4 columns → 2 columns → 1 column stacking

**Touch Targets:**
- Minimum 44×44px for all interactive elements on mobile
- Button heights: 56px minimum on touch devices
- Card spacing: 24px minimum for clear tap zones

**Image Handling:**
- Hero background: Responsive srcset, focal point center
- Product cards: Lazy loading, aspect-ratio CSS for layout stability
- Icons: SVG for crispness at all resolutions

### 4.4 Performance Standards

**Animation Performance:**
- Animate ONLY `transform` and `opacity` (GPU-accelerated)
- Never animate: width, height, margin, padding (causes reflow)
- Use `will-change: transform` sparingly for known animations
- Disable animations for `prefers-reduced-motion: reduce`

**Loading Strategy:**
- Critical CSS: Above-fold styles inline
- Hero image: Preload highest priority
- Below-fold images: Lazy load with Intersection Observer
- Fonts: `font-display: swap` for Acumin and Raleway

---

## 5. Interaction & Motion

### 5.1 Animation Standards

**Standard Durations:**
- Micro-interactions (hover, focus): `duration-fast` (200ms)
- Component transitions (cards, buttons): `duration-normal` (300ms)
- Page transitions, modals: `duration-slow` (400ms)

**Easing:**
- Default: `ease-out` for 90% of animations (natural deceleration)
- Smooth: `cubic-bezier(0.4, 0, 0.2, 1)` for complex transitions

**Which Components Animate:**
- **Buttons:** Hover lift (translateY -2px), scale(1.02), shadow enhancement
- **Cards:** Hover lift (translateY -4px), scale(1.02), shadow transition
- **Navigation links:** Underline slide-in from left (width 0% → 100%)
- **Icons in contact cards:** Scale(1.1) on parent card hover
- **Smooth scroll:** Anchor link navigation to sections

**Transform/Opacity Rule:**
- ✅ ALLOWED: `transform: translateY()`, `transform: scale()`, `opacity`
- ❌ FORBIDDEN: Animating width, height, margin, padding, top, left

### 5.2 Accessibility Considerations

**Reduced Motion:**
```css
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
}
```

**Keyboard Navigation:**
- All interactive elements: Visible focus states (2px `primary-500` outline, 4px offset)
- Skip-to-content link for screen readers
- Tab order follows visual hierarchy

**Screen Reader Support:**
- Semantic HTML: `<header>`, `<nav>`, `<main>`, `<section>`, `<footer>`
- ARIA labels for icon-only buttons
- Alt text for all informational images
- Heading hierarchy: Single `<h1>` (hero), logical `<h2>` for sections

### 5.3 Interactive States Summary

**Buttons:**
- Default → Hover (lift + scale + shadow) → Active (scale down) → Focus (outline)

**Cards:**
- Default → Hover (lift + shadow enhancement) → Active (scale) → Focus (outline)

**Links:**
- Default → Hover (color shift to `primary-500` + underline) → Focus (outline)

**Inputs (future forms):**
- Default → Focus (border `primary-500`, shadow) → Error (border red) → Success (border green)

---

## Design Specification Complete

**Word Count:** ~2,400 words
**Components Specified:** 6 (Navigation, Buttons, Cards, Hero, Section Layout, FAQ Cards)
**Token System:** Comprehensive (colors, typography, spacing, radius, shadows, animation)
**Responsive Strategy:** Defined for all breakpoints with specific grid adaptations
**Accessibility:** WCAG AA compliance, reduced motion support, keyboard navigation

This specification provides senior developers with complete design intent and constraints while trusting them to implement technical details. The design balances professional credibility (neutral palette, generous spacing) with brand personality (strategic lime green accents) to position Woodex as a premium, modern office furniture manufacturer.
