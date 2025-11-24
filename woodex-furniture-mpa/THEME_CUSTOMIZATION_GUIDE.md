# Theme Customization Guide

## Overview
The Woodex Furniture website now features a comprehensive theme customization system that allows for easy customization of fonts, colors, and element visibility while maintaining optimal responsiveness.

## 🚀 Deployment
**Live Website:** https://gvxv8p6qpgvf.space.minimax.io

## ✨ Key Features

### 1. **Responsive Design Optimization**
- **Mobile-First Approach:** Designed for mobile devices first, then enhanced for larger screens
- **Improved Breakpoints:** Enhanced breakpoints for better device compatibility
- **Flexible Container System:** Responsive containers that adapt to different screen sizes
- **Optimized Header:** Streamlined header design with better mobile experience

### 2. **Easy Theme Customization**
- **CSS Custom Properties:** Centralized theme variables for easy color and font changes
- **Configuration System:** Pre-built configuration object for theme management
- **Dynamic Updates:** Real-time theme updates without rebuilding

### 3. **Element Management**
- **Hide/Show Elements:** Easy control over which elements are displayed
- **Progressive Enhancement:** Elements gracefully degrade for better performance
- **Component-Based:** Modular approach to element management

### 4. **Enhanced User Experience**
- **Smoother Animations:** Optimized transition durations and easing
- **Better Accessibility:** Improved focus management and reduced motion support
- **Cleaner Design:** Removed unnecessary elements for better performance

## 🎨 Theme Customization

### Changing Colors
Edit the CSS custom properties in `src/styles/theme.css`:

```css
:root {
  --color-primary: #C2F21E;        /* Primary brand color */
  --color-primary-dark: #A5D119;   /* Darker variant */
  --color-primary-light: #D4F554;  /* Lighter variant */
  --color-accent: #FFD700;         /* Accent color */
}
```

### Changing Fonts
Update the font families in `src/styles/theme.css`:

```css
:root {
  --font-family-heading: 'Your Heading Font', sans-serif;
  --font-family-body: 'Your Body Font', sans-serif;
}
```

### Hiding/Showing Elements
Use the theme configuration in `src/config/theme.ts`:

```typescript
export const themeConfig = {
  elements: {
    header: {
      showUtilityBar: false,        // Hide top utility bar
      showLogo: true,               // Show/hide logo
      showSearch: false,            // Hide search button
      showCart: false,              // Hide cart button
    }
  }
};
```

## 📱 Responsive Breakpoints

The website uses the following breakpoints:

| Breakpoint | Width | Usage |
|------------|-------|-------|
| `xs` | 320px | Small phones |
| `sm` | 480px | Large phones |
| `md` | 768px | Tablets |
| `lg` | 1024px | Small laptops |
| `xl` | 1280px | Desktops |
| `2xl` | 1400px | Large desktops |
| `ultra` | 1440px | Extra large screens |

## 🛠️ Development Tools

### Theme Hooks
Custom React hooks for theme management:

```typescript
import { useThemeColors, useElementManager } from '../hooks/useTheme';

const Component = () => {
  const { colors, updateColor } = useThemeColors();
  const { hideElement, showElement } = useElementManager();
  
  // Change primary color
  updateColor('primary', '#new-color');
  
  // Hide element
  hideElement('header.showUtilityBar');
};
```

### Responsive Classes
Utility for responsive class management:

```typescript
import { useResponsiveClasses } from '../hooks/useTheme';

const { getClasses, isMobile } = useResponsiveClasses();

// Responsive class application
const buttonClasses = getClasses(
  'btn btn-primary',
  {
    mobile: 'w-full',      // Full width on mobile
    desktop: 'w-auto'      // Auto width on desktop
  }
);
```

## 🔧 File Structure

```
src/
├── styles/
│   └── theme.css          # CSS custom properties
├── config/
│   └── theme.ts           # Theme configuration
├── hooks/
│   └── useTheme.ts        # Theme management hooks
└── components/
    ├── Header.tsx         # Optimized header
    ├── Layout.tsx         # Layout wrapper
    └── ...
```

## 🎯 Performance Optimizations

1. **Reduced Bundle Size:** Removed unused utilities and optimized imports
2. **Better Caching:** Improved CSS structure for better browser caching
3. **Mobile Optimization:** Enhanced mobile experience with touch-friendly interfaces
4. **Loading Performance:** Optimized image loading and component rendering

## 🌟 New Features

### 1. **Streamlined Header**
- Removed redundant utility bar for cleaner design
- Improved mobile navigation with better focus management
- Enhanced visual hierarchy and spacing

### 2. **Better Typography**
- Mobile-first responsive typography scaling
- Improved line heights and readability
- Better font loading and fallback systems

### 3. **Enhanced Accessibility**
- Focus trap for mobile menus
- Reduced motion support
- Better keyboard navigation

### 4. **Customizable Elements**
- Easy control over element visibility
- Theme-aware component behavior
- Progressive enhancement approach

## 🚦 Usage Examples

### Quick Color Change
To quickly change the primary brand color, update this line in `theme.css`:
```css
--color-primary: #your-new-color;
```

### Hide Mobile Search
To hide the search functionality on mobile devices:
```typescript
// In any component
import { useElementManager } from '../hooks/useTheme';
const { hideElement } = useElementManager();
hideElement('header.showSearch');
```

### Responsive Spacing
Use the new spacing system:
```css
/* Instead of fixed pixel values */
padding: var(--space-4);  /* Adapts to screen size */
margin: var(--space-8);   /* Responsive spacing */
```

## 📊 Browser Support

- ✅ Chrome 90+
- ✅ Firefox 88+
- ✅ Safari 14+
- ✅ Edge 90+
- ✅ Mobile browsers (iOS Safari, Chrome Mobile)

## 🔄 Future Enhancements

The theme system is designed for extensibility:

1. **Dark Mode Support** - Built-in dark mode system
2. **Component Theming** - Individual component customization
3. **Animation Control** - Granular animation settings
4. **Layout Options** - Multiple layout templates

---

## Quick Start

1. **Deploy the website** - Already deployed at: https://gvxv8p6qpgvf.space.minimax.io
2. **Customize colors** - Edit `src/styles/theme.css`
3. **Adjust elements** - Modify `src/config/theme.ts`
4. **Test responsiveness** - Check on different devices
5. **Rebuild if needed** - `npm run build`

The website is now optimized for maximum flexibility and ease of customization while maintaining excellent performance and user experience across all devices.