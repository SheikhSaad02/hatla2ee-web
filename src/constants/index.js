const API_URL = process.env.NEXT_PUBLIC_API_URL;
const ELASTICSEARCH_URL = process.env.NEXT_PUBLIC_ELASTICSEARCH_URL;
const ELASTICSEARCH_API_KEY = process.env.ELASTICSEARCH_API_KEY;
const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;
const IMAGES_BASE_URL = process.env.NEXT_PUBLIC_IMAGES_BASE_URL;
const googleMapLink = `https://www.google.com/maps/search/?api=1&query=`;
const cookieDomain = process.env.NEXT_PUBLIC_COOKIE_DOMAIN;
const SUPPORT_EMAIL = 'contact@hatla2ee.com';
const CONTACT_SALES_FORM_URL =
  'https://docs.google.com/forms/d/1cIB_ITM2jeC22WmZhCOpvBakuGu_lYfqV2pP9z5faOU/viewform?edit_requested=true';
const GOOGLE_CLIENT_ID = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
const RECAPTCHA_SITE_KEY = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY;
const CDN_PATH = process.env.NEXT_PUBLIC_CDN_URL || '';
const CDN_ASSETS_PATH = process.env.NEXT_PUBLIC_CDN_ASSETS_PATH || '';
const IS_PRODUCTION = !!(process.env.NEXT_PUBLIC_DEPLOY_ENV === 'production');
const ENABLE_OVATION = process.env.NEXT_PUBLIC_ENABLE_OVATION === 'true';
const LEGION_AUTH_TOKEN = process.env.NEXT_PUBLIC_LEGION_AUTH_TOKEN;
const SERVER_CLUSTER_API_URL = process.env.SERVER_API_URL;
const ELASTIC_SEARCH_SERVER_CLUSTER_API_URL =
  process.env.SERVER_API_ELASTIC_SEARCH_URL;

// Anti-scraping: contact CTAs render from presence flags and the real values
// are fetched on click from the reCAPTCHA-gated endpoint.
const CONTACT_DETAILS_ENDPOINT = (listingId) =>
  `/api/surge/consumer/listings/${listingId}/contact_details`;

const getSocialLinks = (locale) => {
  return {
    facebook: 'https://www.facebook.com/Hatla2ee',
    instagram: `https://www.instagram.com/hatla2ee/?hl=${locale}`,
    twitter: 'https://x.com/hatla2ee',
    linkedIn: 'https://www.linkedin.com/company/hatla2ee',
    tiktok: 'https://www.tiktok.com/@hatla2ee',
  };
};

const appPaths = {
  home: '/',
  usedCarsListingsSearch: '/car/search',
  newCarsListingsSearch: '/new-car/search',
  usedImportedCars: '/imported-car',
  newImportedCars: '/new-car/imported',
  importedCars: '/imported',
  usedCars: '/car',
  electricCars: '/electric-car',
  ad: '/ad',
  usedCarPrices: '/car/used-prices',
  'new-car': '/new-car',
  'new-trucks': '/new-trucks',
  'new-truck': '/new-trucks',
  'new-bus': '/new-bus',
  'new-motorcycle': '/new-motorcycle',
  'new-car-prices': '/car/all-prices',
  'new-trucks-prices': '/trucks/all-prices',
  'new-bus-prices': '/bus/all-prices',
  'new-motorcycle-prices': '/motorcycle/all-prices',
  'new-car-prices-make': '/car/price',
  'new-trucks-prices-make': '/trucks/price',
  'new-bus-prices-make': '/bus/price',
  'new-motorcycle-prices-make': '/motorcycle/price',
  usedCarsFinanced: '/car/used-car-financed',
  carInfo: '/car/info',
  newCarsPriceChanges: '/new-car/price-change',
  usedPricesEvaluation: '/car/used-prices/evaluate',
  newTrucksSearch: '/new-trucks/search',
  maintenanceCenter: '/maintenances-center',
  carMaintenance: '/car-maintenance',
  carMaintenanceMyGarage: '/car-maintenance/my-garage',
  carMaintenanceMaintenanceServices:
    '/car-maintenance/my-garage/maintenance-services',
  carFinance: '/car-finance/finance-new-car',
  carFinanceUsed: '/car-finance/finance-used-car',
  newBusSearch: '/new-bus/search',
  newMotorcycleSearch: '/new-motorcycle/search',
  review: '/review',
  contactUs: '/contact-us',
  termsandCondtion: '/general-condition',
  privacy: '/privacy',
  towTrucks: '/roadside-assistance',
  usedCarPricesTo: '/car/used-prices/to',
  usedCarPricesFrom: '/car/used-prices/from',
  usedCarPricesRange: '/car/used-prices/range',
  newCarPricesTo: '/car/prices-range/to',
  newCarPricesFrom: '/car/prices-range/from',
  newCarPricesRange: '/car/prices/range',
  newCarOffers: '/new-car/offers',
  favoriteCars: '/car-selection',
  newCarCompare: '/new-car/compare',
  newCarCompareCar: '/new-car/compare/car',
  newMotorcycleCompare: '/new-motorcycle/compare',
  newBusCompare: '/new-bus/compare',
  newTrucksCompare: '/new-trucks/compare',
  'new-car-compare-terazes': '/new-car/compare/terazes',
  'new-bus-compare-terazes': '/new-bus/compare/terazes',
  'new-motorcycle-compare-terazes': '/new-motorcycle/compare/terazes',
  'new-trucks-compare-terazes': '/new-trucks/compare/terazes',
  news: '/news',
  listings: '/listings',
  usedShowrooms: '/showroom',
  newShowrooms: '/showroom-new',
  authorizedShowrooms: '/showroom-authorized',
  evShowrooms: '/showroom-electric',
  cities: '/car/cities',
  cityPath: '/car/city',
  changePassword: '/change-password',
  login: '/login',
  resetRequest: '/reset-request',
  go: '/go',

  //Profolio/Member area paths
  profolioAssets: '/profolio/profolio-assets',
  postListing: '/sell-your-car',
  listings: '/profolio/listings',
  userSettings: '/profolio/user-settings',
  creditsUsage: '/profolio/credits-usage',
  checkout: '/profolio/checkout',
  userProfileSettings: '/profolio/user-settings/user-profile',
  buyCredits: '/buy-credits',
};

const otherVehicles = ['trucks', 'bus', 'motorcycle'];

const OPENSEARCH_MAX_LIMIT = 10000;
const USED_CAR_PRICES_MONTH_FILTER = 2;

const landingPagesPaths = [
  appPaths.home,
  appPaths.usedCars,
  appPaths.electricCars,
  appPaths['new-car'],
  appPaths.newCarCompare,
  appPaths.newMotorcycleCompare,
  appPaths.newBusCompare,
  appPaths.newTrucksCompare,
  appPaths.carEvaluation,
  appPaths.usedPricesEvaluation,
  appPaths['new-trucks'],
  appPaths['new-bus'],
  appPaths['new-motorcycle'],
  appPaths.review,
  appPaths.carFinance,
  appPaths.carFinanceUsed,
  appPaths.carMaintenance,
  appPaths.buyCredits,
];

const newVehiclesCategorySlugs = {
  newCars: 'car',
  newTrucks: 'trucks',
  newBus: 'bus',
  newMotorcycle: 'motorcycle',
};
const vehicleSlugLabel = {
  car: 'Car',
  trucks: 'Truck',
  bus: 'Bus',
  motorcycle: 'Motorcycle',
};

const pathsWithoutLocalePrefix = {
  //news: '/ar/news',
};

const elasticIndexes = {
  MAKES: process.env.NEXT_PUBLIC_ELASTICSEARCH_MAKES_INDEX,
  MODELS: process.env.NEXT_PUBLIC_ELASTICSEARCH_MODELS_INDEX,
  VARIANTS: process.env.NEXT_PUBLIC_ELASTICSEARCH_VARIANTS_INDEX,
  LOCATIONS: process.env.NEXT_PUBLIC_ELASTICSEARCH_LOCATIONS_INDEX,
  LISTINGS: process.env.NEXT_PUBLIC_ELASTICSEARCH_LISTINGS_INDEX,
};

const IOS_STORE = (() => {
  const id = '1272125275';
  return {
    hatla2ee: `https://apps.apple.com/us/app/hatla2ee/id${id}`,
    appleStore: `https://apps.apple.com/app/apple-store/id${id}`,
  };
})();

const DEFAULT_PT = '118766861';

const ANDROID_PACKAGE = 'com.hatla2ee.hatla2ee_egypt';
const APP_SCHEME = 'hatla2ee';

const IOS_CAMPAIGNS = {
  sticky_banner: { ct: 'sticky_banner' },
  continue_bottom_sheet: {
    base: 'hatla2ee',
    ct: 'continue-bottom-sheet',
  },
  footer_web: { ct: 'web_footer' },
  footer_mweb: { ct: 'mweb_footer' },
  popup_banner: { ct: 'popup_banner' },
  price_trends: { ct: 'price_trends' },
};

const getAppleStoreLink = (campaign) => {
  const {
    base = 'appleStore',
    ct,
    pt = DEFAULT_PT,
  } = IOS_CAMPAIGNS[campaign] || {};

  if (!ct) return IOS_STORE.appleStore;

  const params = new URLSearchParams({ pt, ct, mt: '8' });
  return `${IOS_STORE[base]}?${params}`;
};
const appLinks = (medium, campaign, iosCampaign = campaign) => {
  const utm =
    campaign && medium != null
      ? `&utm_source=Hatla2ee&utm_medium=${medium}&utm_campaign=${campaign}`
      : '';

  return {
    GooglePlay: `https://play.google.com/store/apps/details?id=${ANDROID_PACKAGE}&hl=en&pli=1${utm}`,
    AppleStore: getAppleStoreLink(iosCampaign),
  };
};

const appSections = {
  //Routes/Pages
  USED_CARS: 'used-cars',
  NEW_CARS: 'new-cars',
  IMPORTED: 'imported',
  ELECTRIC_CARS: 'electric-cars',
  SHOWROOMS: 'showrooms',
  COMPARISON: 'comparison',
  FINANCING: 'financing',
  MAINTENANCE_CENTER: 'maintenance-center',
  EVALUTATION: 'car-evaluation',
  REVIEWS: 'reviews',
  USED_CARS_PRICES: 'used-cars-prices',
  NEW_CARS_PRICES: 'new-cars-prices',
  CHANGE_CAR_PRICES: 'change-car-prices',
  NEW_TRUCKS: 'new-trucks',
  NEW_BUSES: 'new-buses',
  NEW_MOTORCYCLES: 'new-motorcycle',
  NEW_TRUCK_PRICES: 'new-truck-prices',
  NEW_BUS_PRICES: 'new-bus-prices',
  NEW_MOTORCYCLE_PRICES: 'new-motorcycle-prices',
  NEW_CAR_FINANCING: 'new-car-financing',
  USED_CAR_FINANCING: 'used-car-financing',
  COMPARISON: 'comparison',
  USED_SHOWROOMS: 'used-showrooms',
  NEW_SHOWROOMS: 'new-showrooms',
  AUTHORIZED_DEALERS: 'authorized-dealers',
  REVIEWS: 'reviews',
  NEWS: 'news',
  MAINTENANCE_CENTER: 'maintenance',
  TOW_TRUCKS: 'tow-trucks',
  SAVED_CARS: 'saved-cars',
  MY_ADS: 'my-ads',
  MY_MAINTENANCE: 'my-maintenance',
  BUY_CREDITS: 'buy-credits',
  //NavSections:
  CAR_PRICES: 'car-prices',
  MORE: 'more',
  VEHICLE_PRICES: 'vehicle-prices',

  //Widgets
  SUPPORT: 'support',
  TOTAL_ENERGIES_BANNER: 'total-energies-banner',
};

const AUTH_ROUTES = [
  appPaths.go,
  appPaths.changePassword,
  appPaths.login,
  appPaths.resetRequest,
];

const newVehiclePlaceholder = {
  car: 'new-car-placeholder.webp',
  trucks: 'new-truck-placeholder.webp',
  motorcycle: 'new-bike-placeholder.webp',
  bus: 'new-bus-placeholder.webp',
};

const FEATURE_FLAGS = {
  ENABLE_SUSPENSE_TOGGLE_FROM_COOKIE: true, // Master toggle to enable/disable this feature.
};

const COOKIE_NAMES = {
  SUSPENSE_NAVIGATION: 'suspense_nav',
  ENABLE_SUSPENSE_TOGGLE: 'enable_suspense_toggle',
  // Set by the backend after it verifies a reCAPTCHA token, and sent back
  // automatically on later contact-details calls. Its presence is the signal
  // that this browser is already cleared, so we skip asking Google for another
  // token. The value is signed and only the backend reads it.
  HAT_VERIFY: 'hat_verify',
};

const MULTI_VALUE_SEPARATOR = '_and_';

const LEAD_ENFORCEMENT = {
  STORAGE_KEY: 'contact_lead_count',
  LIMIT: 4,
};

const INDEXABLE_ROBOTS_TAG = {
  index: true,
  follow: true,
  'max-video-preview': -1,
  'max-image-preview': 'large',
  'max-snippet': -1,
};

export {
  API_URL,
  ELASTICSEARCH_URL,
  ELASTICSEARCH_API_KEY,
  BASE_URL,
  appPaths,
  otherVehicles,
  OPENSEARCH_MAX_LIMIT,
  USED_CAR_PRICES_MONTH_FILTER,
  landingPagesPaths,
  newVehiclesCategorySlugs,
  vehicleSlugLabel,
  IMAGES_BASE_URL,
  googleMapLink,
  pathsWithoutLocalePrefix,
  cookieDomain,
  SUPPORT_EMAIL,
  CONTACT_SALES_FORM_URL,
  GOOGLE_CLIENT_ID,
  getSocialLinks,
  elasticIndexes,
  appLinks,
  ANDROID_PACKAGE,
  APP_SCHEME,
  RECAPTCHA_SITE_KEY,
  appSections,
  AUTH_ROUTES,
  CDN_PATH,
  CDN_ASSETS_PATH,
  IS_PRODUCTION,
  ENABLE_OVATION,
  newVehiclePlaceholder,
  LEGION_AUTH_TOKEN,
  SERVER_CLUSTER_API_URL,
  ELASTIC_SEARCH_SERVER_CLUSTER_API_URL,
  CONTACT_DETAILS_ENDPOINT,
  FEATURE_FLAGS,
  COOKIE_NAMES,
  MULTI_VALUE_SEPARATOR,
  LEAD_ENFORCEMENT,
  INDEXABLE_ROBOTS_TAG,
};
