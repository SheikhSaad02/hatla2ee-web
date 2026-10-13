'use client';

/**
 * Sets GA4 user properties that will be attached to all events including session_start
 * This must be called early in the app lifecycle, before any events fire
 *
 * Uses gtag directly to set user properties, which will be attached to session_start
 */
export function setGA4UserProperties() {
  if (typeof window === 'undefined' || !window.gtag) return;

  const tenantCode = process.env.NEXT_PUBLIC_TENANT || 'eg';

  // Map tenant codes to country names (matching your COUNTRY_NAMES constant)
  const COUNTRY_NAMES = {
    eg: 'EG',
    jordan: 'JO',
    ksa: 'SA',
    kuwait: 'KW',
    oman: 'OM',
    uae: 'AE',
    qatar: 'QA',
  };

  const chosenCountry = COUNTRY_NAMES[tenantCode] || tenantCode;

  // Set user property using gtag - this will be attached to all events including session_start
  // The 'set' command sets user properties that persist across sessions
  window.gtag('set', 'user_properties', {
    chosen_country: chosenCountry,
  });
}
