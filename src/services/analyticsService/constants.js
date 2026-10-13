import { getCookie } from '@/utils/cookies';
import configs from '@/configs';

const EVENT_NAMES = {
  PAGE_VIEW: 'custom_page_view',
  LOGIN_OPEN: 'login_open',
  LOGIN_SUCCESSFUL: 'login_successful',
  LOGIN_FAILED: 'login_failed',
  LOGIN_ATTEMPT: 'login_attempt',
  LOGIN_ENFORCEMENT_ATTEMPT: 'login_enforcement_attempt',
  LOGIN_ENFORCEMENT_SUCCESSFUL: 'login_enforcement_successful',
  REGISTER_LOGIN_ENFORCEMENT: 'register_login_enforcement',
  SSO_LOGIN_ATTEMPT: 'sso_login_attempt',
  SUBMIT_OTP: 'submit_otp',
  OTP_SUCCESS: 'otp_success',
  SIGNUP_ATTEMPT: 'signup_attempt',
  SIGNUP_SUCCESSFUL: 'signup_successful',
  SIGNUP_FAILED: 'signup_failed',
  CLICK_FORGOT_PASSWORD: 'click_forgot_password',
  CLICK_LOGIN: 'click_login',
  CLICK_SIGNUP: 'click_signup',
  VERIFY_ACCOUNT: 'verify_account',
  SET_NEW_PASSWORD: 'set_new_password',
  OTP_REQUEST_SENT: 'otp_request_sent',
  OTP_REQUEST_RESENT: 'otp_request_resent',
  CLICK_SELL_CAR: 'click_sell_car',
  CLICK: 'click',
  DISPLAY_PHONE: 'phone_view',
  DEALER_PHONE_VIEW: 'dealer_phone_view',
  CALL_PHONE: 'phone_lead',
  SEND_WHATSAPP: 'whatsapp_lead',
  CONTACT_DETAILS_FETCH_SUCCESS: 'contact_details_fetch_success',
  CONTACT_DETAILS_FETCH_ERROR: 'contact_details_fetch_error',
  CLICK_APPLY_FINANCING: 'click_apply_financing',
  CLICK_SUBMIT_FINANCING: 'click_submit_financing',
  CLICK_LISTING: 'click_listing',
  CLICK_NEW_CAR: 'click_new_car',
  CLICK_CONTINUE_IN_APP: 'click_continue_in_app',
  DISMISS_CONTINUE_IN_APP: 'dismiss_continue_in_app',
  APP_BANNER_IMPRESSION: 'app_banner_impression',
  APP_BANNER_CLICK: 'app_banner_click',
  APP_BANNER_DISMISS: 'app_banner_dismiss',
  CLICK_SEARCH: 'click_search',
  CLICK_FILTER: 'click_filter',
  CLICK_GOOD_DEAL: 'click_good_deal',
  START_SEARCH: 'start_search',
  OPEN_FILTER: 'open_filter',
  CONTACT_SUPPORT: 'contact_support',
  CLICK_BOTTOM_NAV: 'click_bottom_nav',
  CLICK_IMAGE_SCROLL: 'click_image_scroll',
  CLICK_SCROLL: 'click_scroll',
  CLICK_FEATURED_DEALER: 'click_featured_dealer',
  CLICK_TOTAL: 'click_total',
  CLICK_VIEW_ALL: 'click_view_all',
  CLICK_FAVOURITE: 'click_favourite',
  CLICK_TAG: 'click_tag',
  CLICK_SORT: 'click_sort',
  CLICK_GALLERY: 'click_gallery',
  DISMISS_GALLERY: 'dismiss_gallery',
  DEALER_PHONE_LEAD: 'dealer_phone_lead',
  AD_IMPRESSION: 'ad_impression',
  ADD_MAINTENANCE_CAR: 'add_maintenance_car',
  SUBMIT_MAINTENANCE_CAR: 'submit_maintenance_car',
  ADD_MAINTENANCE_SERVICE: 'add_maintenance_service',
  SUBMIT_MAINTENANCE_SERVICE: 'submit_maintenance_service',
  SPEC_FILTER_APPLIED: 'spec_filter_applied',
  CLICK_SELL_EV: 'click_sell_ev',
  CLICK_VIEW_ALL_EV: 'click_view_all_ev',
  CLICK_VIEW_ALL_REEV: 'click_view_all_reev',
  CLICK_VIEW_ALL_PHEV: 'click_view_all_phev',
  CLICK_EV_CALCULATOR: 'click_ev_calculator',
  CALCULATE_SAVINGS: 'calculate_savings',
  CLICK_STATION: 'click_station',
  CLICK_NAVIGATE: 'click_navigate',
  FAQ_EXPAND: 'faq_expand',
  SELECT_PACKAGE: 'select_package',
  PAGE_SCROLL: 'page_scroll',
  CLICK_TAB: 'click_tab',
};

const WEBSITE_SECTIONS = {
  BUY: 'buy',
  SELL: 'sell',
  car: 'used-car',
  HOME: 'home',
  LOGIN: 'login',
  SIGNUP: 'sign_up',
};
const PAGE_SECTIONS = {
  HEADER: 'header',
  BANNER: 'banner',
  BROWSE_ALL_CARS: 'browse_all_cars',
  POPULAR_SEARCHES_WIDGET: 'popular_searches_widget',
  EXPLORE_USED_CARS: 'explore_used_cars',
  PREMIUM_DEALS: 'premium_deals',
  SIMILAR_BUDGET: 'similar_budget',
  NEWLY_LAUNCHED_CARS: 'newly_added_cars',
  DIFFERENCE_WITH_OTHER_CLASSES: 'difference_with_other_classes',
  MORE_ON_HATLA2EE: 'more_on_hatla2ee',
  RECOMMENDED_SHOWROOM: 'recommended_showroom',
  RECOMMENDED_SHOWROOMS: 'recommended_showrooms',
  BROWSE_BY_CITY: 'browse_by_city_or_district',
  CAR_NEWS: 'car_news',
  LATEST_CAR_NEWS: 'latest_car_news',
  APP_INSTALL_BANNER: 'app_install_banner',
  SUPPORT: 'support',
  FOOTER: 'footer',
  FINANCING_INFORMATION: 'finacing_information',
  FINANCE_LEAD_POPUP: 'finance_lead_popup',
  CONTACT_CARD: 'contact_card',
  STICKY_TAB: 'sticky_tab',
  SHOWROOM_LISTINGS: 'showroom_listings',
  SHOWROOM_CARD: 'showroom_card',
  SHOWROOM_CONTACT: 'showroom_contact',
  RECENTLY_VIEWED: 'recently_viewed',
  FAVORITES_LIST: 'favorites_list',
  FILTERS: 'filters',
  HERO_SECTION: 'hero_section',
  RECENT_SEARCHES: 'recent_searches',
  STICKY_FILTERS: 'sticky_filters',
  TOP_WIDGET: 'top_widget',
  CONTINUE_IN_APP_BOTTOM_SHEET: 'continue_in_app_bottom_sheet',
  MORE_SCREEN: 'more_screen',
  BOTTOM_NAV: 'bottom_nav',
  INLINE_FILTER: 'inline_filter',
  NEW_VEHICLE_VARIANT_CATALOG: 'new_vehicle_variants',
  FEATURED_DEALERS: 'featured_dealers',
  COMPARE_MODELS: 'compare_models',
  LATEST_CAR_NEWS: 'latest_car_news',
  MORE_ON_HATLA2EE: 'more_on_hatla2ee',
  COMPARE_CARS: 'compare_cars',
  SELECT_SORT: 'select_sort',
  CLICK_SORT: 'click_sort',
  TOP_NEW_CARS: 'top_new_cars',
  EXPLORE_NEW_CARS: 'explore_new_cars',
  TOP_ELECTRIC_CARS_FOR_SALE: 'top_electric_cars_for_sale',
  NEWLY_ADDED_ELECTRIC_CARS: 'newly_added_electric_cars',
  SELL_EV_BANNER: 'sell_ev_banner',
  CHOOSE_RIGHT_EV: 'choose_right_ev',
  COST_CALCULATOR: 'cost_calculator',
  CHARGING_STATIONS: 'charging_stations',
  FAQ: 'faq',
  PACKAGES: 'packages',
  TESTIMONIALS: 'testimonials',
  HERO: 'hero',
};
const INTERACTED_FROM = {
  HEADER: 'header',
  HOME: 'home',
  MORE_SCREEN: 'more_screen',
};
const PAGE_TYPES = {
  ORIGIN_COUNTRY: 'origin_country',
  ALL_CITIES: 'all_cities',
  ALL_MAKES: 'all_makes',
  ALL_MODELS: 'all_models',
  MAKE_INFO: 'make_info',
  HOME: 'home',
  LOGIN: 'login',
  LOGIN_MODAL: 'login_modal',
  SIGNUP: 'sign_up',
  USED_CARS: 'used_car',
  NEW_CARS: 'new_car',
  IMPORTED_CARS: 'imported_car',
  USED_CAR_PRICES: 'used_car_prices',
  NEW_CAR_PRICES: 'new_car_prices',
  PRICE_CHANGES: 'price_changes',
  USED_CAR_FINANCE: 'used_car_finance',
  NEW_CAR_FINANCE: 'new_car_finance',
  CAR_EVALUATION: 'car_evaluation',
  MAINTENANCE_CENTERS: 'maintenance_centers',
  CAR_REVIEWS: 'car_reviews',
  FAVOURITES: 'favourites',
  PRODUCT_SELECTION: 'product_selection',
  MY_ADS: 'my_ads',
  car: 'used-car',
  RESET_PASSWORD: 'reset_password',
  OTP_VERIFICATION: 'otp_verification',
  USED_CAR_LANDING: 'used_car_landing',
  SEARCH_RESULTS: 'searchresults',
  OFFER_DETAIL: 'offerdetail',
  CAR_FINANCING: 'car_financing',
  NEW_CAR_FINANCING: 'new_car_financing',
  NEW_CAR_MODEL: 'new_car_model',
  MORE_SCREEN: 'more_screen',
  NEW_CAR_LANDING: 'new_car_landing',
  NEW_TRUCK_LANDING: 'new_truck_landing',
  NEW_BUS_LANDING: 'new_bus_landing',
  NEW_MOTORCYCLE_LANDING: 'new_motorcycle_landing',
  IMPORTED_CAR: 'imported_car',
  SHOWROOMS: 'showrooms',
  SHOWROOM_DETAIL: 'showroom_detail',
  LISTING_DETAIL: 'listing_detail',
  NEW_VEHICLE_DETAIL: 'new_car_detail',
  NEW_TRUCK_DETAIL: 'new_truck_detail',
  NEW_BUS_DETAIL: 'new_bus_detail',
  NEW_MOTORCYCLE_DETAIL: 'new_motorcycle_detail',
  REVIEW_DETAIL: 'review_detail',
  CAR_FINANCE: 'car-finance',
  EVALUATE: 'car_evaluation',
  COMPARE: 'car_comparison',
  REVIEW: 'car_reviews',
  MAINTENANCES_CENTER: 'maintenance_centers',
  ROADSIDE_ASSISTANCE: 'roadside-assistance',
  FAVORITE_CARS: 'favorite_cars',
  NEW_CAR_RESULTS: 'new_car_results',
  MY_MAINTENANCE_LANDING: 'my_maintenance_landing',
  MAINTENANCE_HOME: 'maintainence_home',
  MAINTENANCE_DETAIL: 'maintenance_detail',
  ELECTRIC_CARS: 'electric_cars',
  BUY_CREDITS: 'buy_credits',
  CREDITS_LANDING: 'credits_landing',
};

const LOGIN_MODES = {
  EMAIL: 'email',
  MOBILE: 'mobile',
  GOOGLE: 'google',
};

const COUNTRY_NAMES = {
  eg: 'EG',
  jordan: 'JO',
  ksa: 'SA',
  kuwait: 'KW',
  oman: 'OM',
  uae: 'AE',
  qatar: 'QA',
};
const tenantCode = process.env.NEXT_PUBLIC_TENANT || 'eg';
const chosenCountry = COUNTRY_NAMES[tenantCode] || tenantCode;

const getUserIdFromToken = () => {
  try {
    const token = getCookie(configs.authToken);
    if (!token || token.split('.').length !== 3) return null;
    const payload = JSON.parse(atob(token.split('.')[1]));

    return payload?.tokenable_id || null;
  } catch (e) {
    return null;
  }
};

const getCommonParams = (
  locale,
  user = {},
  websiteSection = WEBSITE_SECTIONS.BUY,
) => {
  const userId = user?.id || getUserIdFromToken();
  return {
    language: locale || null,
    page_title: document.title || null,
    signed_in_with_user_id: !!userId,
    user_id: userId || null,
    is_showroom: !!user?.agency_id,
    website_section: websiteSection,
    ...(user?.agency_id && { agency_id: user?.agency_id }),
    chosen_country: chosenCountry,
    mode_of_login: userId ? (user?.social_logged_in ? 'google' : 'email') : null,
  };
};

const EXACT_PATH_MAP = {
  '/': PAGE_TYPES.HOME,
  '/login': PAGE_TYPES.LOGIN,
  '/go/apply': PAGE_TYPES.SIGNUP,
  '/car': PAGE_TYPES.USED_CAR_LANDING,
  '/electric-car': PAGE_TYPES.ELECTRIC_CARS,
  '/buy-credits': PAGE_TYPES.CREDITS_LANDING,
  '/imported-car': PAGE_TYPES.SEARCH_RESULTS,
  '/new-car': PAGE_TYPES.NEW_CAR_LANDING,
  '/new-trucks': PAGE_TYPES.NEW_TRUCK_LANDING,
  '/new-bus': PAGE_TYPES.NEW_BUS_LANDING,
  '/new-motorcycle': PAGE_TYPES.NEW_MOTORCYCLE_LANDING,
  '/car/search': PAGE_TYPES.SEARCH_RESULTS,
  '/new-car/search': PAGE_TYPES.NEW_CAR_RESULTS,
  '/new-trucks/search': PAGE_TYPES.SEARCH_RESULTS,
  '/new-bus/search': PAGE_TYPES.SEARCH_RESULTS,
  '/new-motorcycle/search': PAGE_TYPES.SEARCH_RESULTS,
  '/car/all-prices': PAGE_TYPES.NEW_CAR_PRICES,
  '/showroom': 'used_car_showroom',
  '/showroom-new': 'new_car_showroom',
  '/showroom-authorized': 'authorized_car_dealer',
  '/car/used-prices/evaluate': PAGE_TYPES.EVALUATE,
  '/car/used-prices/evaluate/get-offer': PAGE_TYPES.EVALUATE,
  '/new-car/compare': PAGE_TYPES.COMPARE,
  '/new-car/price-change': PAGE_TYPES.PRICE_CHANGES,
  '/review': PAGE_TYPES.REVIEW,
  '/maintenances-center': PAGE_TYPES.MAINTENANCES_CENTER,
  '/roadside-assistance': PAGE_TYPES.ROADSIDE_ASSISTANCE,
  '/car-selection': PAGE_TYPES.FAVORITE_CARS,
  '/car-finance/finance-new-car': PAGE_TYPES.NEW_CAR_FINANCE,
  '/car-finance/finance-used-car': PAGE_TYPES.USED_CAR_FINANCE,
  '/car-maintenance': PAGE_TYPES.MY_MAINTENANCE_LANDING,
  '/car-maintenance/my-garage': PAGE_TYPES.MAINTENANCE_HOME,
};

const PATH_PATTERN_MAP = [
  {
    pattern: /^\/car-maintenance\/my-garage\/maintenance-services/,
    condition: () => true,
    pageType: PAGE_TYPES.MAINTENANCE_DETAIL,
  },
  {
    pattern: /^\/car-finance/,
    condition: () => true,
    pageType: PAGE_TYPES.CAR_FINANCE,
  },
  {
    pattern: /^\/maintenances-center/,
    condition: () => true,
    pageType: PAGE_TYPES.MAINTENANCES_CENTER,
  },
  {
    pattern: /^\/car\/used-prices/,
    condition: () => true,
    pageType: PAGE_TYPES.USED_CAR_PRICES,
  },
  {
    pattern: /^\/(trucks|bus|motorcycle)\/all-prices/,
    condition: () => true,
    pageType: PAGE_TYPES.NEW_CAR_PRICES,
  },
  {
    pattern: /^\/car\/prices\/range\//,
    condition: () => true,
    pageType: PAGE_TYPES.NEW_CAR_PRICES,
  },
  {
    pattern: /^\/car\/prices-range\//,
    condition: () => true,
    pageType: PAGE_TYPES.NEW_CAR_PRICES,
  },
  {
    pattern: /^\/(car|trucks|bus|motorcycle)\/price\//,
    condition: () => true,
    pageType: PAGE_TYPES.NEW_CAR_PRICES,
  },
  {
    // new-car/price-change/:make → price_changes
    pattern: /^\/new-car\/price-change\//,
    condition: () => true,
    pageType: PAGE_TYPES.PRICE_CHANGES,
  },
  {
    // new-car/compare/... → car_comparison
    pattern: /^\/new-car\/compare\//,
    condition: () => true,
    pageType: PAGE_TYPES.COMPARE,
  },
  {
    // new-car/price-limit/:price → search_results
    pattern: /^\/new-car\/price-limit\//,
    condition: () => true,
    pageType: PAGE_TYPES.SEARCH_RESULTS,
  },
  {
    // new-car/body/:body → search_results
    pattern: /^\/new-car\/body\//,
    condition: () => true,
    pageType: PAGE_TYPES.SEARCH_RESULTS,
  },
  {
    // car/:make/:model/:id → offerdetail
    pattern: /^\/car\//,
    condition: (path, pathParts) => {
      const lastPart = pathParts[pathParts.length - 1];
      return /^\d+$/.test(lastPart) && pathParts.length === 4;
    },
    pageType: PAGE_TYPES.OFFER_DETAIL,
  },
  {
    // new-car/:make/:model/:varID/:id OR new-car/imported/:make/:model/:id → offerdetail
    pattern: /^\/new-car\//,
    condition: (path, pathParts) => {
      const lastPart = pathParts[pathParts.length - 1];
      return /^\d+$/.test(lastPart) && pathParts.length === 5;
    },
    pageType: PAGE_TYPES.OFFER_DETAIL,
  },
  {
    // new-car/:make/:model/:id → new_car_detail (and other new vehicle types)
    pattern: /^\/(new-car|new-trucks|new-bus|new-motorcycle)\//,
    condition: (path, pathParts) => {
      const lastPart = pathParts[pathParts.length - 1];
      return /^\d+$/.test(lastPart) && pathParts.length === 4;
    },
    pageType: PAGE_TYPES.NEW_VEHICLE_DETAIL,
  },
  {
    // new-car/:make/:model → new_car_detail (no numeric ID)
    pattern: /^\/(new-car|new-trucks|new-bus|new-motorcycle)\//,
    condition: (path, pathParts) => {
      const lastPart = pathParts[pathParts.length - 1];
      return !/^\d+$/.test(lastPart) && pathParts.length === 3;
    },
    pageType: PAGE_TYPES.NEW_VEHICLE_DETAIL,
  },
  {
    pattern: /^\/review\//,
    condition: (path, pathParts) => {
      const lastPart = pathParts[pathParts.length - 1];
      return /^\d+$/.test(lastPart) && pathParts.length >= 3;
    },
    pageType: PAGE_TYPES.REVIEW_DETAIL,
  },
  {
    pattern: /^\/review/,
    condition: () => true,
    pageType: PAGE_TYPES.REVIEW,
  },
  {
    pattern: /^\/showroom-new\//,
    condition: (path, pathParts) => pathParts.length >= 2,
    pageType: PAGE_TYPES.SHOWROOM_DETAIL,
  },
  {
    pattern: /^\/showroom-authorized\//,
    condition: (path, pathParts) => pathParts.length >= 2,
    pageType: PAGE_TYPES.SHOWROOM_DETAIL,
  },
  {
    pattern: /^\/showroom\//,
    condition: (path, pathParts) => pathParts.length >= 2,
    pageType: PAGE_TYPES.SHOWROOM_DETAIL,
  },
  {
    pattern:
      /^\/(car|new-car|new-trucks|new-bus|new-motorcycle|imported-car)\//,
    condition: () => true,
    pageType: PAGE_TYPES.SEARCH_RESULTS,
  },
];

const getPathParts = (pathname) => {
  const path = pathname.replace(/^\/[a-z]{2}(?=\/|$)/, '') || '/';
  return path.split('/').filter(Boolean);
};

const getPageTypeFromPath = (pathname) => {
  const path = pathname.replace(/^\/[a-z]{2}(?=\/|$)/, '') || '/';

  if (EXACT_PATH_MAP[path]) {
    return EXACT_PATH_MAP[path];
  }

  const pathParts = getPathParts(pathname);
  for (const { pattern, condition, pageType } of PATH_PATTERN_MAP) {
    if (pattern.test(path) && condition(path, pathParts)) {
      return pageType;
    }
  }

  return '';
};

const VEHICLE_TYPE_MAP = {
  car: 'used_car',
  'new-car': 'new_car',
  'new-trucks': 'new_truck',
  'new-bus': 'new_bus',
  'new-motorcycle': 'new_motorcycle',
  'imported-car': 'used_car',
  trucks: 'new_truck',
  bus: 'new_bus',
  motorcycle: 'new_motorcycle',
};
const getVehicleTypeFromPath = (pathname) => {
  const pageType = getPageTypeFromPath(pathname);
  const pathParts = getPathParts(pathname);
  const firstSegment = pathParts[0];
  if (pageType === PAGE_TYPES.NEW_CAR_PRICES && firstSegment === 'car') {
    return 'new_car';
  }
  return firstSegment ? VEHICLE_TYPE_MAP[firstSegment] || null : null;
};

const getConditionFromPath = (pathname, searchParams) => {
  const pageType = getPageTypeFromPath(pathname);

  // Only return condition for search results, new car results, and offer detail pages
  if (
    pageType !== PAGE_TYPES.SEARCH_RESULTS &&
    pageType !== PAGE_TYPES.NEW_CAR_RESULTS &&
    pageType !== PAGE_TYPES.OFFER_DETAIL
  ) {
    return null;
  }

  const conditionParam = searchParams?.get?.('condition');
  if (conditionParam === 'new' || conditionParam === 'used') {
    return conditionParam;
  }

  const pathParts = getPathParts(pathname);
  const firstSegment = pathParts[0];

  // New car paths
  if (
    ['new-car', 'new-trucks', 'new-bus', 'new-motorcycle'].includes(
      firstSegment,
    )
  ) {
    return 'new';
  }

  // Used car paths
  if (['car', 'imported-car'].includes(firstSegment)) {
    return 'used';
  }

  return null;
};

const getShowroomNameFromPath = (pathname) => {
  const pageType = getPageTypeFromPath(pathname);

  // Only return showroom name for showroom pages
  if (pageType !== PAGE_TYPES.SHOWROOM_DETAIL) {
    return null;
  }

  const pathParts = getPathParts(pathname);
  // showroom/:name or showroom-new/:name or showroom-authorized/:name
  if (pathParts.length >= 2) {
    return pathParts[1] || null;
  }

  return null;
};

const getListingIdFromPath = (pathname) => {
  const pageType = getPageTypeFromPath(pathname);

  // Only return listing_id for offer detail pages
  if (pageType !== PAGE_TYPES.OFFER_DETAIL) {
    return null;
  }

  const pathParts = getPathParts(pathname);
  const lastPart = pathParts[pathParts.length - 1];

  // Return the listing_id if it's a numeric value
  if (/^\d+$/.test(lastPart)) {
    return lastPart;
  }

  return null;
};

export {
  EVENT_NAMES,
  getCommonParams,
  getPageTypeFromPath,
  getVehicleTypeFromPath,
  getConditionFromPath,
  getShowroomNameFromPath,
  getListingIdFromPath,
  WEBSITE_SECTIONS,
  PAGE_TYPES,
  PAGE_SECTIONS,
  INTERACTED_FROM,
  LOGIN_MODES,
};
