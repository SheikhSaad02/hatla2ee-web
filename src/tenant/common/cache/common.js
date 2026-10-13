import { Routes } from './routes/index.js';

/**
 * Section-based cache configuration presets for non-EG tenants
 *
 * HOW TO DISABLE CACHING FOR A SECTION:
 * Simply remove or comment out the section value.
 * Routes using that section will automatically be excluded from caching.
 *
 * Cache durations:
 * - home, usedCars, newCars: 30 minutes (1800 seconds)
 * - All other sections: 1 hour (3600 seconds)
 */
export const commonCacheConfig = {
  // ==================== 30 MINUTE CACHE SECTIONS ====================
  // Home section - 30 minutes cache
  home: 'public, max-age=0, s-maxage=1800, stale-while-revalidate=60, stale-if-error=3600',

  // Used cars section - 30 minutes cache
  usedCars:
    'public, max-age=0, s-maxage=1800, stale-while-revalidate=60, stale-if-error=3600',

  // New cars section - 30 minutes cache
  newCars:
    'public, max-age=0, s-maxage=1800, stale-while-revalidate=60, stale-if-error=3600',

  // ==================== 1 HOUR CACHE SECTIONS ====================
  // Prices section
  prices:
    'public, max-age=0, s-maxage=3600, stale-while-revalidate=60, stale-if-error=3600',

  // New cars offers section
  newCarsOffers:
    'public, max-age=0, s-maxage=3600, stale-while-revalidate=60, stale-if-error=3600',

  // New cars assembled section
  newCarsAssembled:
    'public, max-age=0, s-maxage=3600, stale-while-revalidate=60, stale-if-error=3600',

  // New cars origin section
  newCarsOrigin:
    'public, max-age=0, s-maxage=3600, stale-while-revalidate=60, stale-if-error=3600',

  // New trucks section
  newTrucks:
    'public, max-age=0, s-maxage=3600, stale-while-revalidate=60, stale-if-error=3600',

  // New bus section
  newBus:
    'public, max-age=0, s-maxage=3600, stale-while-revalidate=60, stale-if-error=3600',

  // New motorcycle section
  newMotorcycle:
    'public, max-age=0, s-maxage=3600, stale-while-revalidate=60, stale-if-error=3600',

  // Car finance section
  carFinance:
    'public, max-age=0, s-maxage=3600, stale-while-revalidate=60, stale-if-error=3600',

  // Showroom section
  showroom:
    'public, max-age=0, s-maxage=3600, stale-while-revalidate=60, stale-if-error=3600',

  // Compare section
  compare:
    'public, max-age=0, s-maxage=3600, stale-while-revalidate=60, stale-if-error=3600',

  // Maintenance center section
  maintenanceCenter:
    'public, max-age=0, s-maxage=3600, stale-while-revalidate=60, stale-if-error=3600',

  // My Maintenance landing section
  myMaintenance:
    'public, max-age=0, s-maxage=1800, stale-while-revalidate=60, stale-if-error=3600',

  // Reviews section
  reviews:
    'public, max-age=0, s-maxage=3600, stale-while-revalidate=60, stale-if-error=3600',

  // Car selection section
  carSelection:
    'public, max-age=0, s-maxage=3600, stale-while-revalidate=60, stale-if-error=3600',

  // Roadside assistance section
  roadsideAssistance:
    'public, max-age=0, s-maxage=3600, stale-while-revalidate=60, stale-if-error=3600',

  // Contact us / static pages section
  contactUs:
    'public, max-age=0, s-maxage=3600, stale-while-revalidate=60, stale-if-error=3600',

  // ==================== DETAIL PAGES SECTION ====================
  // Used car detail pages - 1 hour cache
  usedCarDetail:
    'public, max-age=0, s-maxage=3600, stale-while-revalidate=60, stale-if-error=3600',

  // New car detail pages - 1 hour cache
  newCarDetail:
    'public, max-age=0, s-maxage=3600, stale-while-revalidate=60, stale-if-error=3600',

  // Imported car detail pages - 1 hour cache
  importedCarDetail:
    'public, max-age=0, s-maxage=3600, stale-while-revalidate=60, stale-if-error=3600',

  // ==================== SPECIAL CACHE VALUES ====================
  // No cache: absolutely no caching
  noCache: 'private, no-cache, no-store, max-age=0, must-revalidate',
};

/**
 * Common cache routes configuration for all non-EG tenants
 * Routes are only added if their cacheControl value exists
 */
const commonCacheRoutesConfig = [
  // ==================== HOME SECTION ====================
  { source: Routes.home, cacheControl: commonCacheConfig.home },
  { source: Routes.homeLocalized, cacheControl: commonCacheConfig.home },

  // ==================== USED CARS SECTION ====================
  { source: Routes.usedCars, cacheControl: commonCacheConfig.usedCars },
  { source: Routes.usedCarsSearch, cacheControl: commonCacheConfig.usedCars },
  {
    source: Routes.usedCarDetail,
    cacheControl: commonCacheConfig.usedCarDetail,
  },
  { source: Routes.usedCarInfo, cacheControl: commonCacheConfig.usedCars },
  { source: Routes.usedCarInfoMake, cacheControl: commonCacheConfig.usedCars },
  { source: Routes.usedCarCities, cacheControl: commonCacheConfig.usedCars },
  { source: Routes.usedCarMakes, cacheControl: commonCacheConfig.usedCars },
  { source: Routes.usedCarModels, cacheControl: commonCacheConfig.usedCars },
  { source: Routes.usedCarsCity, cacheControl: commonCacheConfig.usedCars },
  { source: Routes.usedCarsCityBody, cacheControl: commonCacheConfig.usedCars },
  { source: Routes.usedCarsCityMake, cacheControl: commonCacheConfig.usedCars },
  {
    source: Routes.usedCarsCityMakeModel,
    cacheControl: commonCacheConfig.usedCars,
  },
  { source: Routes.usedCarsMake, cacheControl: commonCacheConfig.usedCars },
  {
    source: Routes.usedCarsMakeModel,
    cacheControl: commonCacheConfig.usedCars,
  },
  {
    source: Routes.usedCarsMakeModelYear,
    cacheControl: commonCacheConfig.usedCars,
  },
  {
    source: Routes.usedCarsMakeModelTeraz,
    cacheControl: commonCacheConfig.usedCars,
  },
  { source: Routes.usedCarsBody, cacheControl: commonCacheConfig.usedCars },
  {
    source: Routes.usedCarsPriceLimit,
    cacheControl: commonCacheConfig.usedCars,
  },
  { source: Routes.usedCarsCC, cacheControl: commonCacheConfig.usedCars },
  { source: Routes.usedCarsKasrZero, cacheControl: commonCacheConfig.usedCars },
  { source: Routes.usedCarsTaxi, cacheControl: commonCacheConfig.usedCars },
  { source: Routes.usedCarsDisabled, cacheControl: commonCacheConfig.usedCars },
  { source: Routes.usedCarsHybrid, cacheControl: commonCacheConfig.usedCars },
  { source: Routes.usedCarsClassic, cacheControl: commonCacheConfig.usedCars },
  { source: Routes.usedCarsElectric, cacheControl: commonCacheConfig.usedCars },
  { source: Routes.usedCarsFinanced, cacheControl: commonCacheConfig.usedCars },

  // Imported car detail (Egypt only but included for consistency)
  {
    source: Routes.importedCarDetail,
    cacheControl: commonCacheConfig.importedCarDetail,
  },

  // ==================== NEW CARS SECTION ====================
  { source: Routes.newCars, cacheControl: commonCacheConfig.newCars },
  { source: Routes.newCarsSearch, cacheControl: commonCacheConfig.newCars },
  { source: Routes.newCarsMake, cacheControl: commonCacheConfig.newCars },
  { source: Routes.newCarsMakeModel, cacheControl: commonCacheConfig.newCars },
  { source: Routes.newCarsVariant, cacheControl: commonCacheConfig.newCars },
  { source: Routes.newCarDetail, cacheControl: commonCacheConfig.newCarDetail },
  { source: Routes.newCarsPriceLimit, cacheControl: commonCacheConfig.newCars },
  { source: Routes.newCarsBody, cacheControl: commonCacheConfig.newCars },

  // ==================== PRICES SECTION ====================
  { source: Routes.usedCarPrices, cacheControl: commonCacheConfig.prices },
  // CRITICAL: get-offer must come AFTER wildcard (last-match-wins)
  {
    source: Routes.usedCarPricesEvaluateGetOffer,
    cacheControl: commonCacheConfig.noCache,
  },
  { source: Routes.newCarPrices, cacheControl: commonCacheConfig.prices },
  { source: Routes.newCarPriceByMake, cacheControl: commonCacheConfig.prices },
  {
    source: Routes.newCarPricesRangeTo,
    cacheControl: commonCacheConfig.prices,
  },
  {
    source: Routes.newCarPricesRangeFrom,
    cacheControl: commonCacheConfig.prices,
  },
  { source: Routes.newCarPricesRange, cacheControl: commonCacheConfig.prices },

  // ==================== NEW CARS OFFERS SECTION ====================
  {
    source: Routes.newCarsOffers,
    cacheControl: commonCacheConfig.newCarsOffers,
  },

  // ==================== NEW CARS ASSEMBLED SECTION ====================
  {
    source: Routes.newCarsAssembled,
    cacheControl: commonCacheConfig.newCarsAssembled,
  },

  // ==================== NEW CARS ORIGIN SECTION ====================
  {
    source: Routes.newCarsOrigin,
    cacheControl: commonCacheConfig.newCarsOrigin,
  },

  // ==================== CAR SELECTION SECTION ====================
  { source: Routes.carSelection, cacheControl: commonCacheConfig.carSelection },

  // ==================== MY MAINTENANCE LANDING SECTION ====================
  {
    source: Routes.myMaintenance,
    cacheControl: commonCacheConfig.myMaintenance,
  },

  // ==================== CONTACT US / STATIC PAGES SECTION ====================
  { source: Routes.contactUs, cacheControl: commonCacheConfig.contactUs },
  {
    source: Routes.termsAndConditions,
    cacheControl: commonCacheConfig.contactUs,
  },
  { source: Routes.privacy, cacheControl: commonCacheConfig.contactUs },
];

/**
 * Filter out routes where cacheControl is undefined (section not enabled)
 * This allows disabling sections by simply removing their value from commonCacheConfig
 */
export const commonCacheRoutes = commonCacheRoutesConfig.filter(
  (route) => route.cacheControl !== undefined,
);
