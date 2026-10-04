/**
 * Google Analytics bootstrap.
 *
 * `index.html` used to hardcode `GA_MEASUREMENT_ID` as a literal, so every
 * pageview fired two requests to googletagmanager.com with an invalid id and
 * logged a config error. Analytics is now opt-in: it only initialises when a
 * real measurement id is present in `VITE_GA_MEASUREMENT_ID`.
 */

const GA_ID_PATTERN = /^(G|GT|UA|AW)-[A-Z0-9]+/;

const measurementId = (import.meta.env.VITE_GA_MEASUREMENT_ID || '').trim();

/** True when a plausible Google Analytics measurement id is configured. */
export const isAnalyticsEnabled = GA_ID_PATTERN.test(measurementId);

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
  }
}

/**
 * Injects the gtag snippet and records the initial page_view. Safe to call
 * once at boot; a no-op when analytics is not configured.
 */
export function initAnalytics(): void {
  if (!isAnalyticsEnabled || typeof document === 'undefined') return;

  const script = document.createElement('script');
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${measurementId}`;
  document.head.appendChild(script);

  window.dataLayer = window.dataLayer || [];
  window.gtag = function gtag() {
    // eslint-disable-next-line prefer-rest-params
    window.dataLayer!.push(arguments);
  };
  window.gtag('js', new Date());
  window.gtag('config', measurementId, { send_page_view: true });
}
