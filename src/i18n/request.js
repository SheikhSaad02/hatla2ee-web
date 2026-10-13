import { getRequestConfig } from 'next-intl/server';
import { hasLocale } from 'next-intl';
import { routing } from './routing';

const tenant = process.env.NEXT_PUBLIC_TENANT || 'eg';

// Helper function to import tenant-specific translations
// This uses explicit imports so webpack can statically analyze them
async function importTenantTranslation(tenant, locale, fileName) {
  if (!tenant) {
    return {};
  }

  // Skip tenant-specific translations for 'eg' or 'oman'
  if (tenant === 'eg' || tenant === 'oman') {
    return {};
  }

  try {
    const tenantModule = await import(
      `../dictionaries/${tenant}/${locale}/${fileName}`
    );
    return tenantModule?.default || {};
  } catch (error) {
    // Translation file doesn't exist for this tenant/locale combination
    return {};
  }
}

async function importWithFallback(fileName, locale) {
  let commonTranslations = {};
  let tenantTranslations = {};

  try {
    const commonModule = await import(`../dictionaries/${locale}/${fileName}`);
    commonTranslations = commonModule.default || {};
  } catch (error) {
    // console.log(error);
  }

  tenantTranslations = await importTenantTranslation(tenant, locale, fileName);

  return {
    ...commonTranslations,
    ...tenantTranslations,
  };
}

export default getRequestConfig(async ({ requestLocale }) => {
  // Typically corresponds to the `[locale]` segment
  const requested = await requestLocale;
  const locale = hasLocale(routing.locales, requested)
    ? requested
    : routing.defaultLocale;

  const messages = Object.assign(
    {},
    {
      common: await importWithFallback('common.json', locale),
    },
    {
      home: await importWithFallback('home.json', locale),
    },
    {
      evLanding: await importWithFallback('ev-landing.json', locale),
    },
    {
      layout: await importWithFallback('layout.json', locale),
    },
    {
      metadata: await importWithFallback('metadata.json', locale),
    },
    {
      usedCarsListings: await importWithFallback(
        'used-cars-listings.json',
        locale,
      ),
    },
    {
      carPrices: await importWithFallback('car-prices.json', locale),
    },
    {
      carPricesSeo: await importWithFallback('car-prices-seo.json', locale),
    },
    {
      carEvaluation: await importWithFallback('car-evaluation.json', locale),
    },
    {
      contactUs: await importWithFallback('contact-us.json', locale),
    },
    {
      privacyPolicy: await importWithFallback('privacy.json', locale),
    },
    {
      login: await importWithFallback('login.json', locale),
    },
    {
      signUp: await importWithFallback('signUp.json', locale),
    },
    {
      terms: await importWithFallback('terms.json', locale),
    },
    {
      filters: await importWithFallback('filters.json', locale),
    },
    {
      roadsideAssistance: await importWithFallback(
        'roadside-assistance.json',
        locale,
      ),
    },
    {
      newCar: await importWithFallback('new-car.json', locale),
    },
    {
      newMotorcycle: await importWithFallback('new-motorcycle.json', locale),
    },
    {
      newBus: await importWithFallback('new-bus.json', locale),
    },
    {
      newTruck: await importWithFallback('new-truck.json', locale),
    },
    {
      reviews: await importWithFallback('reviews.json', locale),
    },
    {
      carFinance: await importWithFallback('car-finance.json', locale),
    },
    {
      carListingsSeo: await importWithFallback('car-listings-seo.json', locale),
    },
    {
      newVehicleListingsSeo: await importWithFallback(
        'new-vehicle-detail-seo.json',
        locale,
      ),
    },
    {
      usedCarsListingSeo: await importWithFallback(
        'used-car-listings-seo.json',
        locale,
      ),
    },
    {
      carComparison: await importWithFallback('car-comparison.json', locale),
    },
    {
      countries: await importWithFallback('countries.json', locale),
      carComparisonSeo: await importWithFallback(
        'car-comparison-seo.json',
        locale,
      ),
    },
    {
      originCountries: await importWithFallback(
        'origin-countries.json',
        locale,
      ),
    },
    {
      reviewsSeo: await importWithFallback('reviews-seo.json', locale),
    },
    {
      carMaintenance: await importWithFallback('car-maintenance.json', locale),
    },
    {
      buyCredits: await importWithFallback('buy-credits.json', locale),
    },
  );

  return {
    locale,
    messages,
  };
});
