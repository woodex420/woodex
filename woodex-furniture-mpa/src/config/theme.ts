// THEME CUSTOMIZATION CONFIGURATION
// This file allows easy customization of the website theme

export const themeConfig = {
  // ====== BRAND CUSTOMIZATION ======
  brand: {
    name: 'WOODEX',
    logo: {
      showLogo: true,
      logoText: 'WOODEX',
      logoSize: 'text-2xl lg:text-3xl',
      logoWeight: 'font-bold',
    }
  },

  // ====== COLOR CUSTOMIZATION ======
  colors: {
    // Primary color scheme
    primary: '#C2F21E', // Change this to your brand primary color
    primaryDark: '#A5D119',
    primaryLight: '#D4F554',
    
    // Accent colors
    accent: '#FFD700', // Secondary accent color
    
    // UI Elements
    background: {
      page: '#FFFFFF',
      section: '#FAFAFA',
      card: '#FFFFFF',
    },
    
    // Text colors
    text: {
      primary: '#171717',
      secondary: '#525252',
      muted: '#737373',
    }
  },

  // ====== TYPOGRAPHY CUSTOMIZATION ======
  typography: {
    // Font families
    fonts: {
      heading: 'Acumin Variable Concept', // Change to your heading font
      body: 'Raleway', // Change to your body font
    },
    
    // Font sizes (mobile first, then responsive)
    sizes: {
      xs: '0.75rem',
      sm: '0.875rem', 
      base: '1rem',
      lg: '1.125rem',
      xl: '1.25rem',
      '2xl': '1.5rem',
      '3xl': '1.75rem',
      '4xl': '2.25rem',
      '5xl': '3rem',
      '6xl': '4rem',
    },
    
    // Line heights
    lineHeights: {
      tight: 1.25,
      normal: 1.5,
      relaxed: 1.625,
    }
  },

  // ====== LAYOUT CUSTOMIZATION ======
  layout: {
    // Header height (affects spacing)
    headerHeight: {
      mobile: '64px', // h-16
      desktop: '80px', // h-20
    },
    
    // Container max width
    containerMaxWidth: '1400px',
    
    // Spacing scale
    spacing: {
      1: '0.25rem',
      2: '0.5rem',
      4: '1rem',
      6: '1.5rem',
      8: '2rem',
      12: '3rem',
      16: '4rem',
      24: '6rem',
    }
  },

  // ====== ELEMENT VISIBILITY CONTROL ======
  elements: {
    // Header elements
    header: {
      showUtilityBar: true,     // Top utility bar with company info
      showLogo: true,           // Company logo
      showSearch: true,         // Search button
      showAccount: true,        // Account button
      showCart: true,           // Shopping cart button
      showMobileMenu: true,     // Mobile hamburger menu
    },
    
    // Navigation elements
    navigation: {
      showMainNav: true,        // Main navigation links
      showUtilityLinks: true,   // Utility links (Customization, E-Quotation)
      showContactInfo: true,    // Contact information
    },
    
    // Footer elements
    footer: {
      showNewsletter: true,     // Newsletter subscription
      showSocialLinks: true,    // Social media links
      showBackToTop: true,      // Back to top button
    }
  },

  // ====== RESPONSIVE BREAKPOINTS ======
  breakpoints: {
    xs: '320px',
    sm: '480px',
    smPlus: '640px', 
    md: '768px',
    lg: '1024px',
    xl: '1280px',
    '2xl': '1400px',
    ultra: '1440px',
  },

  // ====== ANIMATION SETTINGS ======
  animations: {
    duration: {
      fast: '150ms',
      normal: '300ms',
      slow: '500ms',
    },
    easing: {
      smooth: 'cubic-bezier(0.4, 0, 0.2, 1)',
    }
  },

  // ====== BORDER RADIUS ======
  borderRadius: {
    none: '0',
    sm: '0.125rem',
    md: '0.375rem',
    lg: '0.5rem',
    xl: '0.75rem',
    '2xl': '1rem',
    full: '9999px',
  },

  // ====== SHADOWS ======
  shadows: {
    sm: '0 1px 2px rgba(0, 0, 0, 0.05)',
    md: '0 4px 6px rgba(0, 0, 0, 0.07)',
    lg: '0 10px 15px rgba(0, 0, 0, 0.1)',
    xl: '0 20px 25px rgba(0, 0, 0, 0.1)',
  },

  // ====== CUSTOM COMPONENTS ======
  components: {
    // Button styles
    buttons: {
      primary: {
        backgroundColor: 'var(--color-primary)',
        color: 'var(--color-gray-900)',
        padding: '0.75rem 1.5rem',
        borderRadius: 'var(--radius-lg)',
        fontWeight: '600',
      },
      secondary: {
        backgroundColor: 'transparent',
        color: 'var(--color-primary)',
        border: '2px solid var(--color-primary)',
        padding: '0.75rem 1.5rem',
        borderRadius: 'var(--radius-lg)',
        fontWeight: '600',
      }
    },
    
    // Card styles
    cards: {
      default: {
        backgroundColor: 'var(--color-white)',
        borderRadius: 'var(--radius-lg)',
        boxShadow: 'var(--shadow-sm)',
        padding: '1.5rem',
      }
    }
  }
};

// ====== UTILITY FUNCTIONS ======

// Function to generate CSS variables from theme config
export const generateCSSVariables = (config = themeConfig) => {
  const cssVars = [];
  
  // Colors
  cssVars.push(`--color-primary: ${config.colors.primary};`);
  cssVars.push(`--color-primary-dark: ${config.colors.primaryDark};`);
  cssVars.push(`--color-primary-light: ${config.colors.primaryLight};`);
  
  // Typography
  cssVars.push(`--font-family-heading: ${config.typography.fonts.heading};`);
  cssVars.push(`--font-family-body: ${config.typography.fonts.body};`);
  
  return cssVars.join('\n');
};

// Function to check if element should be visible
export const shouldShowElement = (elementName, config = themeConfig) => {
  const elementPath = elementName.split('.');
  let current = config;
  
  for (const key of elementPath) {
    if (current && typeof current === 'object' && key in current) {
      current = current[key];
    } else {
      return true; // Default to showing if not specified
    }
  }
  
  return typeof current === 'boolean' ? current : true;
};

// Function to get responsive classes
export const getResponsiveClasses = (baseClass, responsive = {}) => {
  const classes = [baseClass];
  
  Object.entries(responsive).forEach(([breakpoint, className]) => {
    if (breakpoint === 'sm') classes.push(`sm:${className}`);
    if (breakpoint === 'md') classes.push(`md:${className}`);
    if (breakpoint === 'lg') classes.push(`lg:${className}`);
    if (breakpoint === 'xl') classes.push(`xl:${className}`);
  });
  
  return classes.join(' ');
};

export default themeConfig;