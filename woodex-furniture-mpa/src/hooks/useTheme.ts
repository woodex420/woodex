import { useState, useEffect } from 'react';
import { shouldShowElement } from '../config/theme';

// ====== RESPONSIVE HOOKS ======

/**
 * Hook to detect screen size
 */
export const useResponsive = () => {
  const [screenSize, setScreenSize] = useState({
    width: typeof window !== 'undefined' ? window.innerWidth : 0,
    height: typeof window !== 'undefined' ? window.innerHeight : 0,
  });

  useEffect(() => {
    const handleResize = () => {
      setScreenSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const breakpoints = {
    xs: screenSize.width >= 320,
    sm: screenSize.width >= 480,
    smPlus: screenSize.width >= 640,
    md: screenSize.width >= 768,
    lg: screenSize.width >= 1024,
    xl: screenSize.width >= 1280,
    '2xl': screenSize.width >= 1400,
    ultra: screenSize.width >= 1440,
  };

  return {
    ...screenSize,
    ...breakpoints,
    isMobile: !breakpoints.md,
    isTablet: breakpoints.md && !breakpoints.lg,
    isDesktop: breakpoints.lg,
    isLargeDesktop: breakpoints.xl,
  };
};

/**
 * Hook to check if element should be shown
 */
export const useElementVisibility = (elementName: string) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    setIsVisible(shouldShowElement(elementName));
  }, [elementName]);

  return isVisible;
};

// ====== THEME CUSTOMIZATION HOOKS ======

/**
 * Hook to get current theme colors
 */
export const useThemeColors = () => {
  const [colors, setColors] = useState({
    primary: '#C2F21E',
    primaryDark: '#A5D119',
    primaryLight: '#D4F554',
    accent: '#FFD700',
    background: {
      page: '#FFFFFF',
      section: '#FAFAFA',
      card: '#FFFFFF',
    },
    text: {
      primary: '#171717',
      secondary: '#525252',
      muted: '#737373',
    },
  });

  // This could be connected to a theme provider or localStorage
  useEffect(() => {
    // Load colors from CSS variables or localStorage
    const root = document.documentElement;
    const computedStyle = getComputedStyle(root);
    
    const newColors = {
      primary: computedStyle.getPropertyValue('--color-primary') || '#C2F21E',
      primaryDark: computedStyle.getPropertyValue('--color-primary-dark') || '#A5D119',
      primaryLight: computedStyle.getPropertyValue('--color-primary-light') || '#D4F554',
      accent: computedStyle.getPropertyValue('--color-accent') || '#FFD700',
      background: {
        page: computedStyle.getPropertyValue('--color-white') || '#FFFFFF',
        section: computedStyle.getPropertyValue('--color-gray-50') || '#FAFAFA',
        card: computedStyle.getPropertyValue('--color-white') || '#FFFFFF',
      },
      text: {
        primary: computedStyle.getPropertyValue('--color-gray-900') || '#171717',
        secondary: computedStyle.getPropertyValue('--color-gray-700') || '#525252',
        muted: computedStyle.getPropertyValue('--color-gray-500') || '#737373',
      },
    };
    
    setColors(newColors);
  }, []);

  const updateColor = (colorPath: string, value: string) => {
    const root = document.documentElement;
    root.style.setProperty(`--color-${colorPath}`, value);
    setColors(prev => ({ ...prev, [colorPath]: value }));
  };

  return { colors, updateColor };
};

/**
 * Hook to manage element removal/hiding
 */
export const useElementManager = () => {
  const [hiddenElements, setHiddenElements] = useState<Set<string>>(new Set());

  const hideElement = (elementName: string) => {
    setHiddenElements(prev => new Set([...prev, elementName]));
    
    // Add CSS class to hide element
    const elements = document.querySelectorAll(`[data-element="${elementName}"]`);
    elements.forEach(el => {
      el.classList.add('remove-element');
    });
  };

  const showElement = (elementName: string) => {
    setHiddenElements(prev => {
      const newSet = new Set(prev);
      newSet.delete(elementName);
      return newSet;
    });
    
    // Remove CSS class to show element
    const elements = document.querySelectorAll(`[data-element="${elementName}"]`);
    elements.forEach(el => {
      el.classList.remove('remove-element');
    });
  };

  const toggleElement = (elementName: string) => {
    if (hiddenElements.has(elementName)) {
      showElement(elementName);
    } else {
      hideElement(elementName);
    }
  };

  const isElementHidden = (elementName: string) => {
    return hiddenElements.has(elementName);
  };

  return {
    hideElement,
    showElement,
    toggleElement,
    isElementHidden,
    hiddenElements: Array.from(hiddenElements),
  };
};

/**
 * Hook to manage responsive classes
 */
export const useResponsiveClasses = () => {
  const { isMobile, isTablet, isDesktop, isLargeDesktop } = useResponsive();

  const getClasses = (base: string, responsive: Record<string, string> = {}) => {
    const classes = [base];
    
    if (responsive.mobile && isMobile) classes.push(responsive.mobile);
    if (responsive.tablet && isTablet) classes.push(responsive.tablet);
    if (responsive.desktop && isDesktop) classes.push(responsive.desktop);
    if (responsive.largeDesktop && isLargeDesktop) classes.push(responsive.largeDesktop);
    
    return classes.join(' ');
  };

  return { getClasses, isMobile, isTablet, isDesktop, isLargeDesktop };
};

// ====== ACCESSIBILITY HOOKS ======

/**
 * Hook to manage reduced motion preferences
 */
export const useReducedMotion = () => {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);

    const handleChange = (e: MediaQueryListEvent) => {
      setPrefersReducedMotion(e.matches);
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  return prefersReducedMotion;
};

/**
 * Hook to manage focus management for mobile menus
 */
export const useFocusManagement = () => {
  const [focusTrap, setFocusTrap] = useState<HTMLElement | null>(null);

  const trapFocus = (element: HTMLElement) => {
    setFocusTrap(element);
    
    const focusableElements = element.querySelectorAll(
      'a[href], button, textarea, input[type="text"], input[type="radio"], input[type="checkbox"], select'
    );
    const firstElement = focusableElements[0] as HTMLElement;
    const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement;

    const handleTabKey = (e: KeyboardEvent) => {
      if (e.key !== 'Tab') return;

      if (e.shiftKey) {
        if (document.activeElement === firstElement) {
          lastElement.focus();
          e.preventDefault();
        }
      } else {
        if (document.activeElement === lastElement) {
          firstElement.focus();
          e.preventDefault();
        }
      }
    };

    element.addEventListener('keydown', handleTabKey);
    return () => element.removeEventListener('keydown', handleTabKey);
  };

  const releaseFocus = () => {
    setFocusTrap(null);
  };

  return { trapFocus, releaseFocus, focusTrap };
};

export default {
  useResponsive,
  useElementVisibility,
  useThemeColors,
  useElementManager,
  useResponsiveClasses,
  useReducedMotion,
  useFocusManagement,
};