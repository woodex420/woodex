# Workspace.AE Design System: Complete Extraction and Specification for Woodex Master Platform

## Executive Summary and Scope

This report reverse-engineers the visual and interaction design system observed on Workspace.AE and translates it into a practical, code-ready specification for the Woodex Master Platform. The analysis spans the homepage and core category pages—especially chairs and desks—where the design language is most consistently expressed. The outcome is a structured, implementation-oriented reference that captures color, typography, layout, components, interactions, responsiveness, and brand elements as currently applied on the site.

The approach combines systematic page extraction, visual inspection, and inferred CSS values derived from observed defaults. While the brand’s materials and finishes are well documented, explicit UI color hex values and complete typographic parameters are not published; therefore, several design tokens and measurements are inferred rather than confirmed. Where details remain unverified, the report flags gaps and proposes concrete next steps for measurement and validation.

Aesthetic pillars evident across the site include: a neutral base that elevates product imagery, generous spacing for calm and clarity, and consistent component behaviors across listing and promotional surfaces. These are embodied in the homepage hero overlays, category grids, service blocks with iconography, and product cards that use consistent typographic hierarchy and clear calls to action. The following images provide reference anchors for the overarching visual language.

![Homepage (Hero and primary UI surfaces)](/workspace_ae_homepage.png)

![Category page (Chairs): grid and card patterns](/workspace_ae_chairs_page.png)

The screenshots above establish the site’s visual baseline: a light UI shell, strong typographic hierarchy, and a modular layout that balances imagery with structured content blocks. These are the foundations we replicate in the Woodex Master Platform to achieve an equivalent level of clarity, hierarchy, and perceived quality.[^1][^3]

Information gaps and constraints are called out at the end of Section 2. As a working convention, measurement units in CSS comments should be treated as pixels (px) unless explicitly stated otherwise.

## Methodology and Source Reliability

The analysis began with broad page-level extraction of the homepage, followed by deep dives into category pages (chairs and desks) to validate component consistency and measure responsive behavior. A material and finishes page was reviewed to understand the product color and finish taxonomy, which is distinct from UI color tokens. Cross-page checks were performed on the inspirations/library area to confirm layout and typography patterns hold across editorial and promotional surfaces.

Primary sources included:
- The main site (homepage, chairs, desks, inspirations/library, and the material/colors content) to observe component structures, layout grids, and hierarchy.[^1][^2][^3][^4][^6]
- External brand/design references (Studio EW, WDS Gallery) to validate how design awards and related branding are presented beyond the storefront.[^7][^8]

The analysis extracted visible patterns and inferred CSS values for colors, fonts, spacing, grids, and components. These inferences are grounded in repeated, consistent observations across multiple pages and sections. However, exact token names, full typographic metrics, and some state styles remain unverified from source code. We therefore recommend a follow-up measurement pass using browser developer tools to confirm hex values, font line-height, and responsive thresholds. See information gaps for specifics.

![Inspirations page: editorial layout reference](/workspace_ae_inspirations_page.png)

The editorial layout shown above reinforces the site’s use of hierarchical headings, clean imagery, and generous spacing, aligning with the e-commerce sections and confirming the cross-surface consistency of the design system.[^6]

## Brand and Visual Identity

Workspace’s brand identity is minimal, modern, and product-centric. The “WORKSPACE” name appears as a wordmark, and an associated icon is used in the header. The icon logo includes a transparent background and, based on observed filenames and assets, is used to balance the top navigation and support mobile interactions.

![WORKSPACE wordmark](/img/logo-1695268629.jpg)

![Icon logo (transparent background)](/img/cms/Logo/icon.png)

The icon version is observed in the global header; the wordmark typically sits alongside the icon or in proximity to primary navigation. Visual identity elements reinforce credibility and exploration, such as award logos (e.g., Red Dot, IF Design) that appear on product cards and category surfaces, signaling design quality and fostering trust. These cues contribute to a premium, professional impression aligned with high-quality product photography and understated UI styling.[^1][^2][^3][^7]

Imagery and iconography are uniformly crisp. Service blocks use simple, recognizable pictograms for “Project-Based Quoting,” “Space Management & Consultancy,” and “Choose Colors, Finishes & Sizes,” echoing the product customization story and keeping the interface clear and scannable.[^1][^2]

### Logo Usage and Placement

- The icon logo typically appears in the top-left of the global header, often paired with the “WORKSPACE” wordmark. Minimum clear space and sizing were not documented in the source and should be measured in a subsequent pass.  
- Preferred backgrounds are light, neutral surfaces to preserve contrast and avoid competing with product imagery.  
- Recommended practice for Woodex: apply the icon logo at a consistent header module size across breakpoints; ensure a fixed-height header to maintain alignment with navigation and search.  
![Global header area with logo and navigation](/workspace_ae_homepage.png)

### Imagery and Iconography Style

- Service and feature blocks use flat or lightly styled icons with ample padding and distinct headings, reinforcing quick comprehension.  
- Product images are high-resolution with neutral or lifestyle backgrounds, allowing material, color, and form to be the focal points.  
- Iconography within promotional sections (e.g., “WORKSPACE ACOUSTICS”) follows the same restrained visual language to avoid visual noise.[^1][^2]

## Color System (UI)

Workspace.AE employs a neutral, light UI palette that frames product colors and finishes rather than competing with them. Text is consistently dark; surfaces are predominantly white. While exact UI hex codes are not explicitly documented, the observed color usage and relative contrast suggest a system built around the values below.

To make this concrete, the following tokens capture the inferred base colors that appear across pages.

To anchor these tokens, Figure 1 shows the primary surfaces and text zones where the palette is applied.

![Figure 1: UI surfaces and text areas (reference for inferred colors)](/workspace_ae_homepage.png)

The table below documents the inferred UI color tokens, their roles, and usage notes.

| Token Name | Inferred Hex | Role | Typical Usage | Notes |
|---|---|---|---|---|
| Text/Primary | #333333 | Text | Body copy, labels | High contrast on white; primary reading color. |
| Text/Primary Alt | #232323 | Text | Deeper headings, dense copy | Slightly darker for emphasis; used sparingly. |
| Text/Secondary | #484848 | Text | Secondary copy, metadata | Slightly lighter than primary; maintains contrast. |
| Surface/Base | #FFFFFF | Surface | Page background, cards, banners | Clean base that elevates imagery. |
| Surface/Ink | #000000 | Surface/Ink | Accent surfaces, overlays, icons | Used sparingly; strong contrast. |
| Overlay/Scrim | rgba(0,0,0,0.9) | Overlay | Hero text scrims, image treatments | Provides legible text contrast on imagery. |
| Separator/Divider | rgba(183,183,183,0.11) | Stroke | Card separators, grid lines | Very light divider for subtle separation. |

These values align with the observed hierarchy: high-contrast text on white, restrained use of black, and subtle separators to separate content without visual clutter. Overlays enable typography on rich imagery without losing legibility.[^1][^3]

### Product Colors vs UI Tokens

Product color and finish references are cataloged extensively in the materials and finishes content; these are physical descriptions (e.g., wood tones, ultra-matt colors) and do not translate directly to UI tokens.[^2] The table below clarifies the distinction.

| Category | Examples | Notes |
|---|---|---|
| Physical Finish Names | Kaiserberg Oak, Artisan Oak, Amber Walnut, Alpine Walnut, Ash Grey Oak, Concrete, Livedge Wood | Used to describe product surfaces; not UI color tokens. |
| NOVA Timeless Collection | Stone Green, Almond Beige, Antique Rose, Rusty Red, Baltic Blue | Ultra-matt color families for boards; product-level, not UI theming. |
| UI Palettes | Text/Primary (#333333), Surface/Base (#FFFFFF), etc. | UI tokens for on-screen interfaces; derived from observed defaults. |

![Physical material color references (context, not UI palette)](/workspace_ae_homepage.png)

In practice, keep the UI palette neutral and consistent while allowing product imagery and material descriptions to carry the color story. This prevents the interface from competing with the products it showcases.[^2]

## Typography System

Typography is a primary instrument of hierarchy on Workspace.AE. Headings and product titles are bold and prominent, while body text remains clean and readable. Although exact font families and metrics are not disclosed, the visual style and the site’s headings suggest a sans-serif family with strong weight contrast for headings and normal weight for running text. The following observations are inferred from repeated, consistent use across pages.

- Font family: a modern sans-serif is used broadly; the exact family name is not specified in the source.  
- Size and weight: heading levels from H1 to H5 are clearly differentiated by size and weight; product names are bold or otherwise emphasized; prices are clear and consistent.  
- Tracking and line-height: optical adjustments appear in larger headings, with tighter letter spacing and moderate line-heights to preserve legibility.  
- Currency: prices consistently use AED (United Arab Emirates Dirham).  

The following images illustrate typographic hierarchy in editorial and commerce contexts.

![Homepage hero typography and hierarchy](/workspace_ae_homepage.png)

![Chairs category: product title hierarchy and price styling](/workspace_ae_chairs_page.png)

The pattern is consistent: bold, larger headings at the top of sections, medium-weight subheads, and body text tuned for reading comfort. Product titles are assertive, with price and CTA immediately visible. In the absence of explicit metrics, the ranges below provide a practical starting point for replication.

| Level | Relative Size (px, inferred) | Weight | Intended Use | Notes |
|---|---|---|---|---|
| H1 | 40–51 | Bold | Page/hero titles | May use overlay text; tight letter spacing on large sizes. |
| H2 | 28–36 | Bold | Section headers | Primary content breaks; strong presence. |
| H3 | 22–26 | Bold | Subsections, service block titles | Common in promo modules. |
| H4 | 18–20 | Bold/600 | Product group titles, card headings | Readable at grid scale. |
| H5 | 16–18 | Semibold/600 | Card subheads, labels | Differentiates metadata. |
| Body | 14–16 | Regular | Descriptions, metadata | Comfortable reading size. |
| Caption | 12–13 | Regular | Badges,辅助文字 | Used sparingly to conserve legibility. |

These ranges align with the observed range of 11–51 px for text sizes and support the site’s emphasis on crisp headings and easily scannable product lists.[^1][^3]

### Hierarchy and Readability

- Larger headings appear above hero imagery and at section breaks, often with letter spacing tightened for optical balance.  
- Line-height is tuned to the size band, tighter for large headings and more generous for body and captions to support scanning.  
- Currency presentation (AED) is uniform; avoid mixing formats to preserve trust and clarity.[^1]

## Layout and Grid System

Workspace.AE relies on a flexible grid that accommodates varied content: full-bleed hero banners, multi-column service blocks, and responsive product grids. The rhythm is defined by generous section spacing and consistent internal padding in components.

![Service blocks: 3-column layout example](/workspace_ae_homepage.png)

![Product grids: responsive arrangement on category pages](/workspace_ae_chairs_page.png)

Two anchors define the rhythm:
- Section spacing: approximately 100 px between major sections establishes a clear vertical cadence and reduces cognitive load.  
- Component padding: around 30 px within modules (e.g., cards, banners) creates breathing room and balances image-to-text ratios.  

Column proportions frequently split content into balanced two-column arrangements (approximately 34% and 66%), as seen in editorial and service modules.[^1][^6]

| Breakpoint | Behavior | Grid/Column Changes |
|---|---|---|
| ≥ 992 px | Desktop | Full multi-column grids; service blocks in 3 columns; product grids 3+ columns. |
| 768–991 px | Tablet | Collapse to 2 columns; maintain key CTAs; tighten spacing where possible. |
| ≤ 767 px | Mobile | Single-column stacking; full-width tiles; condensed header and simplified navigation. |

These thresholds, inferred from the site’s responsive behavior, allow content to reflow gracefully while preserving hierarchy and touch-friendly tap targets.[^1][^3]

### Spacing and Rhythm

A simple baseline spacing system emerges from observed patterns:
- Section spacing: ~100 px margins between major blocks.  
- Component padding: ~30 px within cards, banners, and promo modules.  
- Consistent internal spacing maintains visual coherence across product grids, service blocks, and editorial sections.

| Token | Value (px) | Typical Use |
|---|---|---|
| Space/Section | 100 | Section-to-section separation |
| Space/Component | 30 | Card, banner, promo padding |
| Space/Inline | 12–16 | Text group spacing, badge gaps |

The result is a clean, predictable rhythm that scales across pages and screen sizes without拥挤 or visual noise.[^1][^6]

## UI Components

The site’s component library is coherent and compact, with clear visual states and consistent placement of CTAs and metadata. The inventory below synthesizes the principal components and their roles.

| Component | Key Attributes | States/Variants | Placement |
|---|---|---|---|
| Global Header | Logo, main nav, search, account, cart, language/currency | Condensed on scroll; mobile collapse | Fixed top across pages |
| Navigation Menu | Top-level categories with sub-menus | Active/hover states on links | Horizontal nav bar |
| Hero Banner | Full-width image with overlay text | Overlay text with scrim for legibility | Homepage and category headers |
| Service Blocks | 3-column icons with titles and text | N/A | Below hero, before/after promo modules |
| Product Card | Image, category label, title, series, price, badges, CTAs | Discount badges (“-10%”, “-25%”), “New”, “On sale!” | Grids on category pages and home |
| Buttons | “Add to cart”, “View”, “Explore Now”, “Learn More” | Hover/active; focus states (inferred) | Cards, banners, and CTAs |
| Footer | Multi-column link groups | N/A | Global bottom |
| Badges/Labels | Discounts, New, Award indicators | Color/shape variants | Overlaid on images or near titles |
| Promo Sections | Mixed media and copy with CTAs | Themed variants | Mid-page modules |

Each component is described in more detail below.

![Header/Nav: categories, utilities, and cart](/workspace_ae_homepage.png)

![Product card anatomy and badges](/workspace_ae_chairs_page.png)

The header consolidates utilities and shopping actions. Product cards consistently surface the essentials—image, title, price—and reinforce urgency or quality via badges (e.g., discounts or awards). The pattern reduces decision friction and makes the catalog scannable.[^1][^3][^4]

### Global Navigation and Header

The header contains the logo and icon, category navigation, search, sign-in, and cart indicator (with item count and “Empty Shopping Cart” state). Language (English) and currency (AED) selectors are present. On mobile, the menu collapses and utilities remain accessible through a simplified overlay.

| Element | Role | Notes |
|---|---|---|
| Logo/Icon | Brand entry point | Header left; consistent size across breakpoints |
| Main Nav | Category access | Chairs, Desks, Storage, Lounge, etc.; may include sub-menus |
| Search | Site search | Text link or icon; triggers search interface |
| Account | Sign-in | User account access |
| Cart | Shopping | Item count and empty/full states |
| Locale Selectors | Language/Currency | English and AED selection |

This structure balances brand presence, discovery, and conversion actions in a single, persistent region.[^1]

### Buttons and CTAs

Primary actions—“Add to cart,” “View,” and exploratory CTAs like “Explore Now” and “Learn More”—are consistent across cards and promo sections. Hover and active states are implied by standard practices; focus states should be verified in a follow-up measurement pass.

| CTA Type | Typical Text | Visual Treatment | Placement |
|---|---|---|---|
| Primary | Add to cart | High-contrast, prominent | Product cards |
| Secondary | View, Learn More | Subdued but visible | Cards and promo modules |
| Promotional | Explore Now | Emphasized in banners | Hero/promo areas |

These patterns support quick product action and guided discovery across the site.[^1][^3]

### Product Card Anatomy

Product cards expose a compact, consistent anatomy:
- Product image with optional badges (e.g., “New,” “-25%”).  
- Category label and product title (clickable).  
- Series/brand name.  
- Price in AED; sale price when discounted.  
- Actions: “View” and “Add to cart.”  
Prominent use of hierarchy and clean spacing ensures scannability at grid scale.

| Field | Description |
|---|---|
| Image | Primary product image, may include badges |
| Category | Product category label |
| Title | Clickable product name (H4-size) |
| Series/Brand | Manufacturer or series name |
| Price | AED currency; sale price if applicable |
| Badges | Discount, New, Award indicators |
| Actions | View, Add to cart |

The card design supports quick comparison and direct action without excess ornamentation.[^3]

## Design Patterns and Interaction

Visual hierarchy is achieved through typographic emphasis, controlled color contrast, and generous spacing. Service blocks rely on simple icons and short, descriptive text to convey value. Product cards highlight price and action clarity through consistent placement and weight.

Interaction cues, while not fully documented, follow contemporary patterns:
- Hover and active states for buttons and links (implied).  
- Focus states for keyboard accessibility (to be verified).  
- Overlay scrims on hero imagery to maintain legibility for large overlay text.

![Service blocks and hierarchy: icons, headings, text](/workspace_ae_homepage.png)

The result is a professional, understated interface that elevates products and reduces friction in browsing and purchasing flows.[^1][^2]

## Responsive Behavior and Breakpoints

The site reflows gracefully from desktop to mobile using the following inferred thresholds:
- ≥ 992 px: Full multi-column layouts; three or more product columns; three-column service blocks.  
- 768–991 px (tablet): Two-column collapses; preserved CTAs; adjusted spacing.  
- ≤ 767 px (mobile): Single-column stacking; full-width modules; simplified header interactions.

![Responsive grid pattern (mobile may stack to single column)](/workspace_ae_chairs_page.png)

| Breakpoint | Grid Behavior | Typography Adjustments | Component Changes |
|---|---|---|---|
| ≥ 992 px | 3+ columns; 3-column service blocks | Larger headings; bold section headers | Full card anatomy; multi-CTA cards |
| 768–991 px | 2-column collapses; larger gutters | Reduce heading size slightly; maintain hierarchy | Compress card padding; CTAs remain prominent |
| ≤ 767 px | Single column; full width | H2/H3 reduced; avoid multi-line overlays | Simplified header; stacked CTAs; larger tap targets |

Accessibility considerations around minimum contrast and tap target sizing should be verified in the next measurement pass.[^1][^3][^4]

## Content Taxonomy and Product Color Ecosystem

Workspace’s material and finishes taxonomy is rich and specific to physical products. It includes diverse wood finishes, concrete textures, and a color collection for boards. These product-level references inform visual merchandising but are separate from UI theming.

| Product Color/Finish | Code (if any) | Description |
|---|---|---|
| Kaiserberg Oak | — | Natural oak finish |
| Artisan Oak | WS07 | Bright, clean wood tone; Natural Maple finish; modern/Scandinavian feel |
| Amber Walnut | WS025 | Warm, natural amber walnut blend |
| Alpine Walnut | WS01 | Rich brown with dark grain; classic walnut |
| Ash Grey Oak | WS04 | Light, neutral tone; fine vertical grain; textured look |
| Concrete | — | Concrete texture for modern aesthetic |
| Brown Halifax Oak | H3180 TM37 | Listed finish reference |
| Black | U999 TM28 | Listed finish reference |
| Stone Grey Frozen Wood | — | Listed finish reference |
| Brown Warmia Walnut | — | Listed finish reference |
| Natural Brown Branson Robinia | — | Listed finish reference |
| NOVA Timeless Collection | — | Stone Green, Almond Beige, Antique Rose, Rusty Red, Baltic Blue; ultra-matt |
| Livedge Wood | — | Solid wood surface; preserves natural character |
| ECHOWRAP Polyester Fiber | — | Acoustic desk screens material |

![Materials/colors context (physical finishes vs UI colors)](/workspace_ae_homepage.png)

This ecosystem supports deep product customization while keeping the UI itself visually neutral and consistent. The distinction is important for Woodex: use neutral UI tokens for the interface, and let product imagery and descriptions communicate color and finish variety.[^2][^10][^9]

## Implementation Guidelines for Woodex Master Platform

Translating the Workspace.AE aesthetic to Woodex requires disciplined tokenization and modular component development. The following practices will ensure fidelity and maintainability:

- Tokenization  
  - Colors: Create tokens for text, surfaces, overlays, and separators based on the inferred palette (e.g., Text/Primary #333333; Surface/Base #FFFFFF).  
  - Typography: Define a type scale that mirrors observed headings and body ranges. Include weight, letter-spacing adjustments for large headings, and consistent AED currency formatting.  
  - Spacing: Establish section spacing (~100 px) and component padding (~30 px) tokens to preserve rhythm across layouts.  
  - Grid: Document responsive breakpoints and column rules; ensure consistent collapse behavior and gutter adjustments.  
  - Components: Standardize header, hero, service blocks, product cards, buttons, badges, and CTAs.

- Component development  
  - Header: Build a persistent header with logo/icon, main navigation, search, account, and cart.  
  - Hero: Support full-bleed imagery with overlay text and scrim for legibility.  
  - Service blocks: Three-column icon + text blocks with consistent padding and heading styles.  
  - Product cards: Image, title, price, badges, and dual CTAs; badge variants for “New” and discounts.  
  - Footer: Multi-column link grouping for discoverability.

- Asset management  
  - Logos: Prepare SVG/PNG variants for wordmark and icon; validate transparent backgrounds.  
  - Icons: Create a small icon set for services and common actions.  
  - Awards: Integrate award badges where relevant, following observed placement patterns.

- Accessibility and performance  
  - Contrast: Verify text contrast on all surfaces and overlays; adjust token values as needed.  
  - Focus states: Ensure visible focus styles for keyboard navigation.  
  - Tap targets: Confirm minimum target sizes for touch interfaces.  
  - Image optimization: Use responsive images and modern formats; prioritize LCP (Largest Contentful Paint) for hero and product imagery.

- Validation plan  
  - Color measurement: Extract exact hex values from live pages using developer tools; update tokens accordingly.  
  - Typography metrics: Confirm font family, line-height, and letter-spacing per heading level.  
  - Component props: Document button and badge variants; ensure consistent state styles (hover, active, focus, disabled).  
  - Breakpoint testing: Validate grid collapse, spacing, and component behavior across devices; finalize breakpoints and gutter rules.

These guidelines align the Woodex Master Platform with Workspace.AE’s design discipline while creating a maintainable system for future iteration.[^1][^2][^3]

## Appendix: Evidence and Source Index

The table below maps the key design assertions to their source evidence and the figure references used in this report. URLs corresponding to the sources are listed in the References section.

| Evidence | Source | Figure(s) |
|---|---|---|
| Header structure, global nav, hero overlays, service blocks | Homepage | Figures 1, 2, 5, 8, 9 |
| Product card anatomy, badges, pricing, CTA behavior | Chairs category | Figures 3, 6 |
| Desks category grid and layout | Desks category | Figure 10 |
| Materials and finishes taxonomy | Material and Colors content | Figure 7 |
| Awards/brand references | Design Awards content | — |
| Editorial and promo layout patterns | Inspirations/Library content | Figures 4, 11 |

![Additional inspiration section: extended pattern reference](/workspace_ae_inspirations_scrolled.png)

### Information Gaps

- No explicit brand guideline document or published color palette with hex codes; UI color values are inferred from observed usage.  
- Exact font family name(s) and complete typographic metrics (e.g., precise line-height per level, letter-spacing for all headings) are not available.  
- Full interaction specifications (e.g., hover/active/focus states for all components) are not published; only implicit patterns are observed.  
- Grid specifications (container widths, exact column counts, gutter sizes) are not documented beyond observed breakpoints.  
- Iconography library, sizing rules, and badge usage guidelines are not explicitly available.  
- Logo usage rules (clear space, minimum size, background constraints) are not published.  
- Detailed component library inventory (props, variants, states) is not publicly documented.

These gaps should be addressed through targeted measurement and, if possible, direct confirmation from the Workspace team.

## References

[^1]: WORKSPACE | Office Furniture (Homepage). https://workspace.ae  
[^2]: Material and Colors. https://workspace.ae/content/material-and-colors  
[^3]: Chairs Category. https://workspace.ae/chairs  
[^4]: Desks Category. https://workspace.ae/desks  
[^6]: Inspirations / Gallery (WDS). http://wds.workspace.design/gallery.do  
[^7]: Design Awards. https://workspace.ae/content/design-awards  
[^8]: Studio EW (Workspace Design). https://www.workspace.design/  
[^9]: PerfectSense Feelwood Lacquered Boards. https://workspace.ae/content/perfectsense-feelwood-lacquered-boards  
[^10]: Livedge Wood Slabs. https://workspace.ae/livedge-wood-slabs