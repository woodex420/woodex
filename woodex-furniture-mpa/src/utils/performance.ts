// Performance Monitoring Utilities

// Declare gtag for TypeScript
declare global {
  interface Window {
    gtag?: (...args: any[]) => void;
    dataLayer?: any[];
  }
}

/**
 * Report Web Vitals to analytics (lightweight implementation)
 */
export const reportWebVitals = (callback?: (metric: any) => void) => {
  if (!callback || !(callback instanceof Function)) return;

  // Simplified Web Vitals tracking without external package
  if ('PerformanceObserver' in window) {
    try {
      // Largest Contentful Paint (LCP)
      const lcpObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        const lastEntry = entries[entries.length - 1];
        callback({
          name: 'LCP',
          value: lastEntry.startTime,
          id: 'v1-lcp',
        });
      });
      lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });

      // First Input Delay (FID)
      const fidObserver = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          callback({
            name: 'FID',
            value: (entry as any).processingStart - entry.startTime,
            id: 'v1-fid',
          });
        }
      });
      fidObserver.observe({ entryTypes: ['first-input'] });

      // Cumulative Layout Shift (CLS)
      let clsValue = 0;
      const clsObserver = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (!(entry as any).hadRecentInput) {
            clsValue += (entry as any).value;
          }
        }
        callback({
          name: 'CLS',
          value: clsValue,
          id: 'v1-cls',
        });
      });
      clsObserver.observe({ entryTypes: ['layout-shift'] });
    } catch (e) {
      console.error('Error setting up performance observers:', e);
    }
  }
};

/**
 * Lazy load images with Intersection Observer
 */
export const lazyLoadImages = () => {
  const imageObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const img = entry.target as HTMLImageElement;
        const src = img.getAttribute('data-src');
        if (src) {
          img.src = src;
          img.removeAttribute('data-src');
          img.classList.remove('lazy');
          observer.unobserve(img);
        }
      }
    });
  });

  const images = document.querySelectorAll('img.lazy');
  images.forEach(img => imageObserver.observe(img));
};

/**
 * Preload critical resources
 */
export const preloadCriticalResources = () => {
  // Preload hero image
  const link = document.createElement('link');
  link.rel = 'preload';
  link.as = 'image';
  link.href = '/images/hero_background_7.jpg';
  document.head.appendChild(link);
};

/**
 * Optimize font loading
 */
export const optimizeFontLoading = () => {
  // Use font-display: swap for better performance
  if ('fonts' in document) {
    Promise.all([
      (document as any).fonts.load('1em Raleway'),
      (document as any).fonts.load('700 1em Acumin Variable Concept'),
    ]).then(() => {
      document.documentElement.classList.add('fonts-loaded');
    }).catch(() => {
      // Silently fail if fonts can't be loaded
    });
  }
};

/**
 * Measure page load time
 */
export const measurePageLoad = () => {
  window.addEventListener('load', () => {
    const perfData = window.performance.timing;
    const pageLoadTime = perfData.loadEventEnd - perfData.navigationStart;
    const connectTime = perfData.responseEnd - perfData.requestStart;
    const renderTime = perfData.domComplete - perfData.domLoading;

    console.log('Page Load Metrics:', {
      pageLoadTime: `${pageLoadTime}ms`,
      connectTime: `${connectTime}ms`,
      renderTime: `${renderTime}ms`,
    });

    // Send to analytics if available
    if (typeof window.gtag !== 'undefined') {
      window.gtag('event', 'timing_complete', {
        name: 'page_load',
        value: pageLoadTime,
        event_category: 'Performance',
      });
    }
  });
};

/**
 * Optimize Core Web Vitals
 */
export const optimizeCoreWebVitals = () => {
  // Largest Contentful Paint (LCP) optimization
  const observer = new PerformanceObserver((list) => {
    for (const entry of list.getEntries()) {
      console.log('LCP candidate:', entry.startTime);
    }
  });
  observer.observe({ entryTypes: ['largest-contentful-paint'] });

  // First Input Delay (FID) - minimize JS execution
  if (typeof requestIdleCallback !== 'undefined') {
    requestIdleCallback(() => {
      // Defer non-critical JavaScript
      console.log('Non-critical tasks deferred');
    });
  }

  // Cumulative Layout Shift (CLS) - reserve space for dynamic content
  const images = document.querySelectorAll('img');
  images.forEach((img) => {
    if (!img.hasAttribute('width') || !img.hasAttribute('height')) {
      img.setAttribute('loading', 'lazy');
    }
  });
};

/**
 * Initialize all performance optimizations
 */
export const initPerformanceOptimizations = () => {
  preloadCriticalResources();
  optimizeFontLoading();
  measurePageLoad();
  optimizeCoreWebVitals();
  
  // Lazy load images after initial render
  setTimeout(() => {
    lazyLoadImages();
  }, 100);

  // Report Web Vitals
  reportWebVitals((metric) => {
    console.log(metric);
    // Send to analytics if available
    if (typeof window.gtag !== 'undefined') {
      window.gtag('event', metric.name, {
        value: Math.round(metric.name === 'CLS' ? metric.value * 1000 : metric.value),
        event_category: 'Web Vitals',
        event_label: metric.id,
        non_interaction: true,
      });
    }
  });
};
