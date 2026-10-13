/**
 * Egypt tenant cache configuration
 * Uses section-based cache presets with 10-minute cache duration
 *
 * HOW TO DISABLE CACHING FOR A SECTION:
 * Simply remove or comment out the section value in egCachePresets.
 * Routes using that section will automatically be excluded from caching.
 */

import { Routes } from '../../common/cache/routes/index.js';

/**
 * Section-based cache presets for Egypt tenant
 * Each section has a 10-minute cache duration (600 seconds)
 *
 * To disable caching for a section, remove or comment out its value.
 * Example: To disable home caching, remove/comment the 'home' line.
 */
export const egCachePresets = {
  // ==================== DISABLED SECTIONS (no caching) ====================
  // Remove value to disable caching for that section
  // home: 'public, max-age=0, s-maxage=600, stale-while-revalidate=60, stale-if-error=3600',
  usedCars:
    'public, max-age=0, s-maxage=600, stale-while-revalidate=60, stale-if-error=3600',

  newCars:
    'public, max-age=0, s-maxage=600, stale-while-revalidate=60, stale-if-error=3600',

  // ==================== ENABLED SECTIONS (10 min cache) ====================
  // Prices section
  prices:
    'public, max-age=0, s-maxage=1800, stale-while-revalidate=60, stale-if-error=3600',

  // New cars offers section
  newCarsOffers:
    'public, max-age=0, s-maxage=1800, stale-while-revalidate=60, stale-if-error=3600',

  // New cars assembled section
  newCarsAssembled:
    'public, max-age=0, s-maxage=1800, stale-while-revalidate=60, stale-if-error=3600',

  // New cars origin section
  newCarsOrigin:
    'public, max-age=0, s-maxage=3600, stale-while-revalidate=60, stale-if-error=3600',

  // New trucks section
  newTrucks:
    'public, max-age=0, s-maxage=1800, stale-while-revalidate=60, stale-if-error=3600',

  // New bus section
  newBus:
    'public, max-age=0, s-maxage=1800, stale-while-revalidate=60, stale-if-error=3600',

  // New motorcycle section
  newMotorcycle:
    'public, max-age=0, s-maxage=1800, stale-while-revalidate=60, stale-if-error=3600',

  // Car finance section
  carFinance:
    'public, max-age=0, s-maxage=3600, stale-while-revalidate=60, stale-if-error=3600',

  // Showroom section
  showroom:
    'public, max-age=0, s-maxage=1800, stale-while-revalidate=60, stale-if-error=3600',

  // Compare section
  compare:
    'public, max-age=0, s-maxage=1800, stale-while-revalidate=60, stale-if-error=3600',

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
    'public, max-age=0, s-maxage=1800, stale-while-revalidate=60, stale-if-error=3600',

  // Roadside assistance section
  roadsideAssistance:
    'public, max-age=0, s-maxage=86400, stale-while-revalidate=60, stale-if-error=3600',

  // Contact us / static pages section
  contactUs:
    'public, max-age=0, s-maxage=86400, stale-while-revalidate=60, stale-if-error=3600',

  // ==================== DETAIL PAGES SECTION ====================
  // Used car detail pages - 1 hour cache
  usedCarDetail:
    'public, max-age=0, s-maxage=1800, stale-while-revalidate=60, stale-if-error=3600',

  // New car detail pages - 1 hour cache
  newCarDetail:
    'public, max-age=0, s-maxage=1800, stale-while-revalidate=60, stale-if-error=3600',

  // Imported car detail pages - 1 hour cache
  importedCarDetail:
    'public, max-age=0, s-maxage=1800, stale-while-revalidate=60, stale-if-error=3600',

  // ==================== SPECIAL CACHE VALUES ====================
  // Private routes: never cache
  private: 'private, no-store',

  // No cache: absolutely no caching
  noCache: 'private, no-cache, no-store, max-age=0, must-revalidate',
};

/**
 * Egypt-specific cache routes
 * Routes are only added if their cacheControl value exists in egCachePresets
 */
const egCacheRoutesConfig = [
  // ==================== HOME SECTION ====================
  { source: Routes.home, cacheControl: egCachePresets.home },
  { source: Routes.homeLocalized, cacheControl: egCachePresets.home },

  // ==================== USED CARS SECTION ====================
  { source: Routes.usedCars, cacheControl: egCachePresets.usedCars },
  { source: Routes.usedCarsSearch, cacheControl: egCachePresets.usedCars },
  {
    source: Routes.usedCarDetail,
    cacheControl: egCachePresets.usedCarDetail,
  },
  { source: Routes.usedCarInfo, cacheControl: egCachePresets.usedCars },
  { source: Routes.usedCarInfoMake, cacheControl: egCachePresets.usedCars },
  { source: Routes.usedCarCities, cacheControl: egCachePresets.usedCars },
  { source: Routes.usedCarMakes, cacheControl: egCachePresets.usedCars },
  { source: Routes.usedCarModels, cacheControl: egCachePresets.usedCars },
  { source: Routes.usedCarsCity, cacheControl: egCachePresets.usedCars },
  { source: Routes.usedCarsCityBody, cacheControl: egCachePresets.usedCars },
  { source: Routes.usedCarsCityMake, cacheControl: egCachePresets.usedCars },
  {
    source: Routes.usedCarsCityMakeModel,
    cacheControl: egCachePresets.usedCars,
  },
  { source: Routes.usedCarsMake, cacheControl: egCachePresets.usedCars },
  { source: Routes.usedCarsMakeModel, cacheControl: egCachePresets.usedCars },
  {
    source: Routes.usedCarsMakeModelYear,
    cacheControl: egCachePresets.usedCars,
  },
  {
    source: Routes.usedCarsMakeModelTeraz,
    cacheControl: egCachePresets.usedCars,
  },
  { source: Routes.usedCarsBody, cacheControl: egCachePresets.usedCars },
  { source: Routes.usedCarsPriceLimit, cacheControl: egCachePresets.usedCars },
  { source: Routes.usedCarsCC, cacheControl: egCachePresets.usedCars },
  { source: Routes.usedCarsKasrZero, cacheControl: egCachePresets.usedCars },
  { source: Routes.usedCarsTaxi, cacheControl: egCachePresets.usedCars },
  { source: Routes.usedCarsDisabled, cacheControl: egCachePresets.usedCars },
  { source: Routes.usedCarsHybrid, cacheControl: egCachePresets.usedCars },
  { source: Routes.usedCarsClassic, cacheControl: egCachePresets.usedCars },
  { source: Routes.usedCarsElectric, cacheControl: egCachePresets.usedCars },
  { source: Routes.usedCarsFinanced, cacheControl: egCachePresets.usedCars },
  // Imported cars (Egypt only)
  { source: Routes.importedCar, cacheControl: egCachePresets.usedCars },
  { source: Routes.importedCarUsed, cacheControl: egCachePresets.usedCars },
  { source: Routes.importedCarNew, cacheControl: egCachePresets.newCars },
  {
    source: Routes.importedCarDetail,
    cacheControl: egCachePresets.importedCarDetail,
  },

  // ==================== NEW CARS SECTION ====================
  { source: Routes.newCars, cacheControl: egCachePresets.newCars },
  { source: Routes.newCarsSearch, cacheControl: egCachePresets.newCars },
  { source: Routes.newCarsMake, cacheControl: egCachePresets.newCars },
  { source: Routes.newCarsMakeModel, cacheControl: egCachePresets.newCars },
  { source: Routes.newCarsVariant, cacheControl: egCachePresets.newCars },
  {
    source: Routes.newCarDetail,
    cacheControl: egCachePresets.newCarDetail,
  },
  { source: Routes.newCarsPriceLimit, cacheControl: egCachePresets.newCars },
  { source: Routes.newCarsBody, cacheControl: egCachePresets.newCars },

  // ==================== PRICES SECTION ====================
  { source: Routes.usedCarPrices, cacheControl: egCachePresets.prices },
  // CRITICAL: get-offer must come AFTER wildcard (last-match-wins)
  {
    source: Routes.usedCarPricesEvaluateGetOffer,
    cacheControl: egCachePresets.noCache,
  },
  { source: Routes.newCarPrices, cacheControl: egCachePresets.prices },
  { source: Routes.newCarPriceByMake, cacheControl: egCachePresets.prices },
  { source: Routes.newCarPricesRangeTo, cacheControl: egCachePresets.prices },
  { source: Routes.newCarPricesRangeFrom, cacheControl: egCachePresets.prices },
  { source: Routes.newCarPricesRange, cacheControl: egCachePresets.prices },
  { source: Routes.newCarPriceChanges, cacheControl: egCachePresets.prices },

  // ==================== NEW CARS OFFERS SECTION ====================
  { source: Routes.newCarsOffers, cacheControl: egCachePresets.newCarsOffers },

  // ==================== NEW CARS ASSEMBLED SECTION ====================
  {
    source: Routes.newCarsAssembled,
    cacheControl: egCachePresets.newCarsAssembled,
  },

  // ==================== NEW CARS ORIGIN SECTION ====================
  { source: Routes.newCarsOrigin, cacheControl: egCachePresets.newCarsOrigin },

  // ==================== NEW TRUCKS SECTION ====================
  { source: Routes.newTrucks, cacheControl: egCachePresets.newTrucks },
  { source: Routes.newTrucksPrices, cacheControl: egCachePresets.prices },

  // ==================== NEW BUS SECTION ====================
  { source: Routes.newBus, cacheControl: egCachePresets.newBus },
  { source: Routes.newBusPrices, cacheControl: egCachePresets.prices },

  // ==================== NEW MOTORCYCLE SECTION ====================
  { source: Routes.newMotorcycle, cacheControl: egCachePresets.newMotorcycle },
  { source: Routes.newMotorcyclePrices, cacheControl: egCachePresets.prices },

  // ==================== SHOWROOM SECTION ====================
  { source: Routes.showroom, cacheControl: egCachePresets.showroom },
  { source: Routes.showroomNew, cacheControl: egCachePresets.showroom },
  { source: Routes.showroomAuthorized, cacheControl: egCachePresets.showroom },

  // ==================== COMPARE SECTION ====================
  { source: Routes.newCarCompare, cacheControl: egCachePresets.compare },

  // ==================== MAINTENANCE CENTER SECTION ====================
  {
    source: Routes.maintenanceCenter,
    cacheControl: egCachePresets.maintenanceCenter,
  },

  // ==================== MY MAINTENANCE LANDING SECTION ====================
  {
    source: Routes.myMaintenance,
    cacheControl: egCachePresets.myMaintenance,
  },

  // ==================== REVIEWS SECTION ====================
  { source: Routes.review, cacheControl: egCachePresets.reviews },

  // ==================== CAR SELECTION SECTION ====================
  { source: Routes.carSelection, cacheControl: egCachePresets.carSelection },

  // ==================== ROADSIDE ASSISTANCE SECTION ====================
  {
    source: Routes.roadsideAssistance,
    cacheControl: egCachePresets.roadsideAssistance,
  },

  // ==================== CAR FINANCE SECTION ====================
  { source: Routes.carFinance, cacheControl: egCachePresets.carFinance },

  // ==================== CONTACT US / STATIC PAGES SECTION ====================
  { source: Routes.contactUs, cacheControl: egCachePresets.contactUs },
  {
    source: Routes.termsAndConditions,
    cacheControl: egCachePresets.contactUs,
  },
  { source: Routes.privacy, cacheControl: egCachePresets.contactUs },
];

/**
 * Filter out routes where cacheControl is undefined (section not enabled)
 * This allows disabling sections by simply removing their value from egCachePresets
 */
export const egCacheRoutes = egCacheRoutesConfig.filter(
  (route) => route.cacheControl !== undefined,
);
