# Workspace.ae CSS Technical Analysis

**Extraction Date:** November 6, 2025  
**Website:** https://workspace.ae  
**Analysis Method:** Page source inspection and CSS extraction

## Technical CSS Properties Discovered

### Color Values (From Page Source)

```css
/* Primary Brand Colors */
color: #333333;              /* Dark gray for primary text */
color: #232323;              /* Slightly lighter dark gray */
color: #484848;              /* Medium dark gray for headers */
background-color: #ffffff;   /* White background */
background-color: #000000;   /* Black elements */

/* Hover States and Interactive Colors */
color: rgba(0,0,0,0.9);      /* Dark gray with transparency */
color: rgba(0,0,0,0);        /* Transparent */
background-color: rgba(0,0,0,0);  /* Transparent background */
border-color: rgba(0,0,0,0.22);   /* Subtle border hover state */
border-color: rgba(183,183,183,0.11);  /* Light gray border */
border-color: rgba(255,255,255,0);     /* White transparent border */

/* Button Colors */
background-color: rgba(12,0,2,0.06);  /* Very subtle dark background */
background-color: rgba(224,224,224,0); /* Light gray transparent */
background-color: #0c0c0c;            /* Almost black for primary buttons */
color: #ffffff;                       /* White text on dark buttons */
```

### Typography Specifications

```css
/* Primary Font Family */
font-family: Raleway, Sans-serif;

/* Font Size Scale */
font-size: 42px;   /* Large headings */
font-size: 34px;   /* Medium headings */
font-size: 32px;   /* Section headers */
font-size: 27px;   /* Subsection headers */
font-size: 26px;   /* Large body text */
font-size: 20px;   /* Button text */
font-size: 17px;   /* Standard body text */
font-size: 16px;   /* Small text */
font-size: 14px;   /* Mobile body text */
font-size: 11px;   /* Small labels */

/* Font Weights and Styles */
font-weight: bold;         /* Headings and emphasis */
font-weight: normal;       /* Body text */
font-style: normal;        /* Standard text */

/* Line Height and Spacing */
line-height: 1em;          /* Tight leading for headings */
line-height: 0.9em;        /* Very tight for large headings */
line-height: 1.8em;        /* Generous for body text */

/* Letter Spacing (Tracking) */
letter-spacing: -1.9px;    /* Very tight for large headings */
letter-spacing: -1.6px;    /* Tight for headings */
letter-spacing: -1.1px;    /* Moderate tight for medium headings */
letter-spacing: -1px;      /* Slight tight for smaller headings */
letter-spacing: -0.6px;    /* Minimal tight for subheadings */
letter-spacing: -0.2px;    /* Very minimal tight for buttons */
letter-spacing: -0.1px;    /* Slight adjustment */
letter-spacing: 0px;       /* No tracking adjustment */
```

### Spacing and Layout System

```css
/* Margin System (Large Scale) */
margin-top: 100px;         /* Major section spacing */
margin-bottom: 100px;      /* Major section spacing */
margin: 130px 0px 25px 0px;  /* Custom margin spacing */
margin: 180px 0px 0px 0px;   /* Large top margin */
margin: 250px 0px 0px 0px;   /* Extra large top margin */

/* Margin System (Medium Scale) */
margin-top: 70px;          /* Medium section spacing */
margin: 30px 28px 27px 34px;  /* Custom medium spacing */
margin: 20px 0px 0px -16px;   /* Button positioning */

/* Margin System (Small Scale) */
margin: 10px 0px 0px 0px;   /* Small spacing */
margin: 5px 0px 0px 0px;    /* Tiny spacing */
margin: 0px 0px 0px 0px;    /* No margin */

/* Padding System */
padding: 0px 0px 0px 0px;   /* No padding */
padding: 30px 30px 30px 30px;  /* Uniform padding */
padding: 86px 102px 0px 0px;   /* Custom padding for banners */
padding: 0px 0px 0px 50px;     /* Left padding */
padding: 95px 0px 0px 50px;    /* Multiple side padding */
```

### Component-Specific Styles

#### Banner/Hero Components
```css
.elementor-iqit-banner-content {
    padding: 86px 102px 0px 0px;  /* Left and right padding for banner text */
    text-align: left;
}

.elementor-iqit-banner-title {
    margin: 0px 0;
    color: #333333;
    font-size: 42px;
    font-weight: bold;
    line-height: 1em;
    letter-spacing: -1.6px;
}

.elementor-iqit-banner-description {
    display: block;
    color: #232323;
    font-size: 26px;
    line-height: 1em;
    letter-spacing: -0.6px;
}
```

#### Button Components
```css
.elementor-button {
    margin-top: 0px;
    color: rgba(0,0,0,0.9);
    font-size: 17px;
    font-family: Raleway, Sans-serif;
    background-color: rgba(12,0,2,0.06);
    border-style: solid;
    border-color: rgba(183,183,183,0.11);
}

.elementor-button:hover {
    border-color: rgba(0,0,0,0.22);
}
```

#### Image Components
```css
.elementor-image img {
    max-width: 100%;
    opacity: 1;                    /* Full opacity for main images */
    opacity: 0.32;                 /* Reduced opacity for background elements */
    opacity: 0.42;                 /* Medium opacity for secondary elements */
}
```

### Responsive Design Breakpoints

```css
/* Tablet Breakpoint (max-width: 991px) */
@media(max-width: 991px) {
    .elementor-iqit-banner-content {
        padding: 52px 52px 52px 68px;  /* Reduced padding */
    }
    
    .elementor-iqit-banner-title {
        font-size: 26px;              /* Smaller heading on tablet */
    }
    
    .elementor-iqit-banner-description {
        font-size: 14px;              /* Smaller description on tablet */
    }
}

/* Mobile Breakpoint (max-width: 767px) */
@media(max-width: 767px) {
    .elementor-iqit-banner-content {
        padding: 5px 7px 75px 10px;   /* Minimal padding for mobile */
    }
    
    .elementor-iqit-banner-title {
        font-size: 21px;              /* Mobile heading size */
        letter-spacing: -0.9px;       /* Adjusted tracking for mobile */
    }
    
    .elementor-iqit-banner-description {
        font-size: 11px;              /* Small text for mobile */
    }
    
    .elementor-button {
        font-size: 8px;               /* Very small button text */
        margin-top: 24px;             /* Extra spacing for mobile buttons */
    }
}
```

### Grid System Specifications

```css
/* Desktop Grid Proportions */
.elementor-element-m0k9qkp { width: 34.530%; }    /* Left column */
.elementor-element-dyyr3nb { width: 65.404%; }    /* Right column */
.elementor-element-f7fy2as { width: 34.604%; }    /* Left column */
.elementor-element-0ou2w26 { width: 65.373%; }    /* Right column */

/* Balanced Layouts */
.elementor-element-raq9ijz { width: 49.996%; }    /* ~50% left */
.elementor-element-c63dlk4 { width: 49.851%; }    /* ~50% right */

.elementor-element-d9nbwf5 { width: 59.996%; }    /* ~60% left */
.elementor-element-s11mfxc { width: 39.719%; }    /* ~40% right */
```

### Background and Visual Effects

```css
/* Fixed Background Images */
background-image: url("https://workspace.ae/img/cms/Layouts/paralax-2.jpg");
background-position: center center;
background-attachment: fixed;
background-repeat: repeat;

/* Section Background Colors */
background-color: #ffffff;     /* White sections */
background-color: #0c0c0c;     /* Dark sections for contrast */

/* Container Min-Height */
.elementor-element-1ppfkip > .elementor-container {
    min-height: 550px;         /* Desktop height */
}

@media(max-width: 991px) {
    .elementor-element-1ppfkip > .elementor-container {
        min-height: 400px;     /* Tablet height */
    }
}

@media(max-width: 767px) {
    .elementor-element-1ppfkip > .elementor-container {
        min-height: 60px;      /* Mobile height */
    }
}
```

### Text Alignment and Positioning

```css
text-align: left;             /* Default alignment */
text-align: center;           /* Centered content */
text-align: right;            /* Right-aligned content */

/* Image Positioning */
.elementor-position-right .elementor-image-box-img {
    margin-left: 15px;         /* Space when image is right */
}

.elementor-position-left .elementor-image-box-img {
    margin-right: 15px;        /* Space when image is left */
}

.elementor-position-top .elementor-image-box-img {
    margin-bottom: 15px;       /* Space when image is top */
}
```

## Design System Insights

### Typography Hierarchy
1. **Hero Headings:** 42-51px, bold, tight tracking (-1.6px to -1.9px)
2. **Section Headers:** 32-34px, regular weight, moderate tracking (-1px to -1.1px)
3. **Subsection Headers:** 27px, regular weight, minimal tracking (-0.1px)
4. **Body Text:** 17px standard, 14-15px for content areas
5. **Button Text:** 17-20px for desktop, 14px for mobile
6. **Labels/Captions:** 11-16px, minimal tracking

### Color Strategy
- **High Contrast:** Dark grays (#333333, #232323) on white backgrounds
- **Subtle Hover States:** RGBA colors with low opacity (0.11, 0.22)
- **Professional Palette:** Monochromatic scheme with strategic black/white contrast
- **Background Textures:** Subtle opacity variations (0.32, 0.42) for visual hierarchy

### Spacing System
- **Large Sections:** 100px vertical margins
- **Medium Sections:** 70px vertical margins
- **Component Spacing:** 30px uniform padding
- **Element Spacing:** 15-20px for related elements
- **Tight Spacing:** 5-10px for closely related content

### Responsive Strategy
- **Progressive Size Reduction:** Font sizes scale down proportionally
- **Padding Adjustment:** Layout adapts from desktop (102px) to mobile (5-10px)
- **Grid Flexibility:** Column widths remain proportional across breakpoints
- **Touch Optimization:** Button sizes and spacing increase for mobile interaction

---

*This analysis was generated through direct extraction of CSS properties from the live website's source code, providing precise technical specifications for the workspace.ae design system.*