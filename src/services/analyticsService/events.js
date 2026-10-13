import {
  EVENT_NAMES,
  PAGE_TYPES,
  WEBSITE_SECTIONS,
  getCommonParams,
  getPageTypeFromPath,
  PAGE_SECTIONS,
  INTERACTED_FROM,
} from './constants';
import { trackEvent, trackEventGA4 } from './eventHandler';

const POPULAR_SEARCH_NAME_MAPPER = {
  make: 'top_brand',
  model: 'top_model',
  'price-range': 'price-range',
  city: 'city',
  body: 'body_styles',
  'special-conditions': 'special-conditions',
  cc: 'cc_ranges',
};

export const trackPageView = (
  locale,
  user,
  pageType,
  websiteSection = WEBSITE_SECTIONS.BUY,
) => {
  const commonParams = getCommonParams(locale, user);
  trackEvent(EVENT_NAMES.PAGE_VIEW, {
    website_section: websiteSection,
    page_type: pageType,
    ...commonParams,
  });
};

export const loginClickEvents = {
  click_login: (locale, user, pageType) => {
    const commonParams = getCommonParams(locale, user);
    trackEvent(EVENT_NAMES.CLICK_LOGIN, {
      website_section: WEBSITE_SECTIONS.HOME,
      page_type: pageType || PAGE_TYPES.HOME,
      page_section: PAGE_SECTIONS.HEADER,
      interacted_from: INTERACTED_FROM.HEADER,
      ...commonParams,
    });
  },

  login_open: (
    locale,
    user,
    pageType = PAGE_TYPES.LOGIN,
    websiteSection = WEBSITE_SECTIONS.HOME,
  ) => {
    const commonParams = getCommonParams(locale, user);
    trackEvent(EVENT_NAMES.LOGIN_OPEN, {
      ...commonParams,
      website_section: websiteSection,
      page_type: pageType,
    });
  },

  login_successful: (locale, user, modeOfLogin) => {
    const commonParams = getCommonParams(locale, user);
    trackEvent(EVENT_NAMES.LOGIN_SUCCESSFUL, {
      ...commonParams,
      website_section: WEBSITE_SECTIONS.LOGIN,
      page_type: PAGE_TYPES.LOGIN,
      mode_of_login: modeOfLogin,
    });
  },

  login_failed: (locale, user) => {
    const commonParams = getCommonParams(locale, user);
    trackEvent(EVENT_NAMES.LOGIN_FAILED, {
      ...commonParams,
      website_section: WEBSITE_SECTIONS.LOGIN,
      page_type: PAGE_TYPES.LOGIN,
    });
  },

  login_attempt: (locale, user) => {
    const commonParams = getCommonParams(locale, user);
    trackEvent(EVENT_NAMES.LOGIN_ATTEMPT, {
      ...commonParams,
      website_section: WEBSITE_SECTIONS.LOGIN,
      page_type: PAGE_TYPES.LOGIN,
    });
  },

  login_enforcement_attempt: (locale, user, modeOfLogin) => {
    const commonParams = getCommonParams(locale, user, WEBSITE_SECTIONS.BUY);
    trackEvent(EVENT_NAMES.LOGIN_ENFORCEMENT_ATTEMPT, {
      ...commonParams,
      page_type: PAGE_TYPES.LOGIN_MODAL,
      mode_of_login: modeOfLogin,
    });
  },

  login_enforcement_successful: (locale, user, modeOfLogin) => {
    const commonParams = getCommonParams(locale, user, WEBSITE_SECTIONS.BUY);
    trackEvent(EVENT_NAMES.LOGIN_ENFORCEMENT_SUCCESSFUL, {
      ...commonParams,
      page_type: PAGE_TYPES.LOGIN_MODAL,
      mode_of_login: modeOfLogin,
    });
  },

  register_login_enforcement: (locale, user) => {
    const commonParams = getCommonParams(locale, user, WEBSITE_SECTIONS.BUY);
    trackEvent(EVENT_NAMES.REGISTER_LOGIN_ENFORCEMENT, {
      ...commonParams,
      page_type: PAGE_TYPES.LOGIN_MODAL,
    });
  },

  sso_login_attempt: (locale, user, pageType = PAGE_TYPES.LOGIN) => {
    const commonParams = getCommonParams(locale, user);
    trackEvent(EVENT_NAMES.SSO_LOGIN_ATTEMPT, {
      ...commonParams,
      website_section:
        pageType === PAGE_TYPES.SIGNUP
          ? WEBSITE_SECTIONS.SIGNUP
          : WEBSITE_SECTIONS.LOGIN,
    });
  },
  submit_otp: (locale, user, { forPasswordReset = false } = {}) => {
    const commonParams = getCommonParams(locale, user);
    trackEvent(EVENT_NAMES.SUBMIT_OTP, {
      ...commonParams,
    });
  },

  otp_success: (locale, user) => {
    const commonParams = getCommonParams(locale, user);
    trackEvent(EVENT_NAMES.OTP_SUCCESS, {
      ...commonParams,
    });
  },

  signup_attempt: (locale, user) => {
    const commonParams = getCommonParams(locale, user, WEBSITE_SECTIONS.SIGNUP);
    trackEvent(EVENT_NAMES.SIGNUP_ATTEMPT, {
      ...commonParams,
      page_type: PAGE_TYPES.SIGNUP,
    });
  },

  signup_successful: (locale, user, modeOfLogin) => {
    const commonParams = getCommonParams(locale, user, WEBSITE_SECTIONS.SIGNUP);
    trackEvent(EVENT_NAMES.SIGNUP_SUCCESSFUL, {
      ...commonParams,
      page_type: PAGE_TYPES.SIGNUP,
      mode_of_login: modeOfLogin,
    });
  },

  signup_failed: (locale, user) => {
    const commonParams = getCommonParams(locale, user, WEBSITE_SECTIONS.SIGNUP);
    trackEvent(EVENT_NAMES.SIGNUP_FAILED, {
      ...commonParams,
      page_type: PAGE_TYPES.SIGNUP,
    });
  },
  click_forgot_password: (locale, user, pageType = PAGE_TYPES.LOGIN_MODAL) => {
    const commonParams = getCommonParams(locale, user, WEBSITE_SECTIONS.LOGIN);
    trackEvent(EVENT_NAMES.CLICK_FORGOT_PASSWORD, {
      ...commonParams,
      website_section: WEBSITE_SECTIONS.LOGIN,
      page_type: pageType,
    });
  },

  click_signup: (locale, user) => {
    const commonParams = getCommonParams(locale, user, WEBSITE_SECTIONS.SIGNUP);
    trackEvent(EVENT_NAMES.CLICK_SIGNUP, {
      ...commonParams,
      website_section: WEBSITE_SECTIONS.SIGNUP,
      page_type: PAGE_TYPES.SIGNUP,
    });
  },
  verify_account: (locale, user) => {
    const commonParams = getCommonParams(locale, user, WEBSITE_SECTIONS.LOGIN);
    trackEvent(EVENT_NAMES.VERIFY_ACCOUNT, {
      ...commonParams,
      website_section: WEBSITE_SECTIONS.LOGIN,
      page_type: PAGE_TYPES.RESET_PASSWORD,
    });
  },

  set_new_password: (locale, user) => {
    const commonParams = getCommonParams(locale, user, WEBSITE_SECTIONS.LOGIN);
    trackEvent(EVENT_NAMES.SET_NEW_PASSWORD, {
      ...commonParams,
      page_type: PAGE_TYPES.RESET_PASSWORD,
    });
  },

  otp_request_sent: (locale, user) => {
    const commonParams = getCommonParams(locale, user, WEBSITE_SECTIONS.LOGIN);
    trackEvent(EVENT_NAMES.OTP_REQUEST_SENT, {
      ...commonParams,
      page_type: PAGE_TYPES.OTP_VERIFICATION,
    });
  },

  otp_request_resent: (locale, user) => {
    const commonParams = getCommonParams(locale, user, WEBSITE_SECTIONS.LOGIN);
    trackEvent(EVENT_NAMES.OTP_REQUEST_RESENT, {
      ...commonParams,
      page_type: PAGE_TYPES.OTP_VERIFICATION,
    });
  },
};

export const homeClickEvents = {
  click_good_deal: (locale, user, page_type, page_section) => {
    const common = getCommonParams(locale, user);
    trackEvent(EVENT_NAMES.CLICK_GOOD_DEAL, {
      website_section: WEBSITE_SECTIONS.BUY,
      page_type,
      page_section,
      ...common,
    });
  },
  click_sell_car: (locale, user, page_type, page_section) => {
    const common = getCommonParams(locale, user);
    trackEvent(EVENT_NAMES.CLICK_SELL_CAR, {
      page_type: page_type == 'car' ? PAGE_TYPES[page_type] : page_type,
      page_section: page_section,
      interacted_from: INTERACTED_FROM.HOME,
      ...common,
    });
  },

  header_link_click: (
    locale,
    user,
    page_type,
    selected_link,
    page_section,
    interactedFrom,
  ) => {
    const common = getCommonParams(locale, user);
    trackEvent(EVENT_NAMES.CLICK, {
      ...common,
      page_type: page_type == 'car' ? PAGE_TYPES[page_type] : page_type,
      page_section: page_section || PAGE_SECTIONS.HEADER,
      name: selected_link,
      ...(interactedFrom && { interacted_from: interactedFrom }),
    });
  },

  browse_all_cars_click: (locale, user) => {
    const common = getCommonParams(locale, user);
    trackEvent(EVENT_NAMES.CLICK_SEARCH, {
      page_type: PAGE_TYPES.HOME,
      page_section: PAGE_SECTIONS.BROWSE_ALL_CARS,
      ...common,
    });
  },

  popular_search_tab_click: (locale, user, tab_name, page_type) => {
    const common = getCommonParams(locale, user);
    trackEvent(EVENT_NAMES.CLICK, {
      page_type: page_type || PAGE_TYPES.HOME,
      page_section: PAGE_SECTIONS.POPULAR_SEARCHES_WIDGET,
      name: tab_name,
      ...common,
    });
  },
  click_bottom_nav: (locale, user, page_section, pathname) => {
    const common = getCommonParams(locale, user);
    const page_type = pathname
      ? getPageTypeFromPath(pathname)
      : PAGE_TYPES.HOME;
    trackEvent(EVENT_NAMES.CLICK_BOTTOM_NAV, {
      page_type,
      website_section: WEBSITE_SECTIONS.BUY,
      name: page_section,
      ...common,
    });
  },
  click_sell_now: (locale, user, page_section, pathname) => {
    const common = getCommonParams(locale, user);
    const page_type = pathname
      ? getPageTypeFromPath(pathname)
      : PAGE_TYPES.HOME;
    trackEvent(EVENT_NAMES.CLICK_SELL_CAR, {
      page_type,
      website_section: WEBSITE_SECTIONS.BUY,
      page_section: PAGE_SECTIONS.BOTTOM_NAV,
      ...common,
    });
  },
  click_image_scroll: (locale, user, page_type, page_section, listing_id) => {
    const common = getCommonParams(locale, user);
    trackEvent(EVENT_NAMES.CLICK_IMAGE_SCROLL, {
      website_section: WEBSITE_SECTIONS.BUY,
      page_type: page_type,
      page_section: page_section,
      ...(listing_id && { listing_id }),
      ...common,
    });
  },
  click_scroll: (locale, user, page_type, page_section) => {
    const common = getCommonParams(locale, user);
    trackEvent(EVENT_NAMES.CLICK_SCROLL, {
      website_section: WEBSITE_SECTIONS.BUY,
      page_type: page_type,
      page_section: page_section,
      ...common,
    });
  },
  popular_search_option_click: (
    locale,
    user,
    page_type,
    page_section,
    { tabLabel: name, label: value, interactedFrom },
  ) => {
    const common = getCommonParams(locale, user);
    const mappedName = POPULAR_SEARCH_NAME_MAPPER[name] || name;
    trackEvent(EVENT_NAMES.CLICK_FILTER, {
      page_type: page_type || PAGE_TYPES.HOME,
      page_section: page_section || PAGE_SECTIONS.POPULAR_SEARCHES_WIDGET,
      name: mappedName,
      value,
      ...(interactedFrom && { interacted_from: interactedFrom }),
      ...common,
    });
  },
  classifieds_listing_click: (
    locale,
    user,
    page_type,
    page_section,
    { item: listing },
  ) => {
    const common = getCommonParams(locale, user);
    trackEvent(EVENT_NAMES.CLICK_LISTING, {
      page_type: page_type,
      page_section: page_section,
      condition: listing?.condition?.slug,
      brand: listing?.make?.slug,
      model: listing?.model?.slug,
      price: listing?.price,
      year: listing?.year,
      city: listing?.location?.breadcrumbs?.[1]?.title,
      transmission: listing?.transmission?.slug,
      fuel_type: listing?.fuel_type?.slug,
      listing_id: listing?.id,
      ...common,
    });
  },
  display_phone_click: (locale, user, page_type, page_section, listing) => {
    const common = getCommonParams(locale, user);
    trackEvent(EVENT_NAMES.DISPLAY_PHONE, {
      page_type: page_type,
      page_section: page_section,
      condition: listing?.condition,
      brand: listing?.brand,
      model: listing?.model,
      price: listing?.price,
      year: listing?.year,
      city: listing?.city,
      transmission: listing?.transmission,
      fuel_type: listing?.fuel_type,
      listing_id: listing?.listing_id,
      agency_name: listing?.agency_name,
      ...common,
    });
  },
  call_phone_click: (locale, user, page_type, page_section, listing) => {
    const common = getCommonParams(locale, user);
    trackEvent(EVENT_NAMES.CALL_PHONE, {
      page_type: page_type,
      page_section: page_section,
      condition: listing?.condition,
      brand: listing?.brand,
      model: listing?.model,
      price: listing?.price,
      year: listing?.year,
      city: listing?.city,
      transmission: listing?.transmission,
      fuel_type: listing?.fuel_type,
      listing_id: listing?.listing_id,
      agency_name: listing?.agency_name,
      ...common,
    });
  },
  send_whatsapp_click: (locale, user, page_type, page_section, listing) => {
    const common = getCommonParams(locale, user);
    trackEvent(EVENT_NAMES.SEND_WHATSAPP, {
      page_type: page_type,
      page_section: page_section,
      condition: listing?.condition,
      brand: listing?.brand,
      model: listing?.model,
      price: listing?.price,
      year: listing?.year,
      city: listing?.city,
      transmission: listing?.transmission,
      fuel_type: listing?.fuel_type,
      listing_id: listing?.listing_id,
      agency_name: listing?.agency_name,
      ...common,
    });
  },
  newly_launched_cars_click: (
    locale,
    user,
    page_type,
    page_section,
    { item: listing },
  ) => {
    const common = getCommonParams(locale, user);
    trackEvent(EVENT_NAMES.CLICK_NEW_CAR, {
      page_type: page_type,
      page_section: page_section,
      brand: listing?.make?.slug,
      model: listing?.model?.slug,
      price: `${listing?.prices?.market?.min} - ${listing?.prices?.market?.max}`,
      ...common,
    });
  },

  more_on_hatla2ee_click: (
    locale,
    user,
    pageType,
    pageSection,
    { service },
  ) => {
    const common = getCommonParams(locale, user);
    trackEvent(EVENT_NAMES.CLICK, {
      page_type: PAGE_TYPES.HOME,
      page_section: PAGE_SECTIONS.MORE_ON_HATLA2EE,
      name: service,
      ...common,
    });
  },

  click_featured_dealer: (
    locale,
    user,
    page_type,
    page_section,
    { showroom },
  ) => {
    const common = getCommonParams(locale, user);
    trackEvent(EVENT_NAMES.CLICK_FEATURED_DEALER, {
      website_section: WEBSITE_SECTIONS.BUY,
      page_type: page_type,
      name: showroom,
      ...common,
    });
  },
  click_total: (locale, user, page_type) => {
    const common = getCommonParams(locale, user);
    trackEvent(EVENT_NAMES.CLICK_TOTAL, {
      website_section: WEBSITE_SECTIONS.BUY,
      page_type: page_type,
      ...common,
    });
  },
  recommended_showroom_click: (
    locale,
    user,
    pageType,
    pageSection,
    { showroom, tab },
  ) => {
    const common = getCommonParams(locale, user);
    trackEvent(EVENT_NAMES.CLICK, {
      page_type:
        pageType == 'showroom' ? 'showroom-used' : pageType || PAGE_TYPES.HOME,
      page_section: PAGE_SECTIONS.RECOMMENDED_SHOWROOM,
      name: tab,
      value: showroom,
      ...common,
    });
  },
  showroom_phone_view: (locale, user, pageType, { showroom, tab }) => {
    const common = getCommonParams(locale, user);
    const SHOWROOM_PAGE_TYPE_MAP = {
      used: 'used_car_showroom',
      new: 'new_car_showroom',
      authorized: 'authorized_car_dealer',
    };

    trackEvent(EVENT_NAMES.DEALER_PHONE_VIEW, {
      page_type: SHOWROOM_PAGE_TYPE_MAP[pageType] || PAGE_TYPES.HOME,
      name: pageType,
      value: showroom,
      agency_name: showroom,
      ...common,
    });
  },
  showroom_phone_click: (locale, user, pageType, { showroom, tab }) => {
    const common = getCommonParams(locale, user);
    const SHOWROOM_PAGE_TYPE_MAP = {
      used: 'used_car_showroom',
      new: 'new_car_showroom',
      authorized: 'authorized_car_dealer',
    };

    trackEvent(EVENT_NAMES.DEALER_PHONE_LEAD, {
      page_type: SHOWROOM_PAGE_TYPE_MAP[pageType] || PAGE_TYPES.HOME,
      name: pageType,
      value: showroom,
      agency_name: showroom,
      ...common,
    });
  },
  browse_city_district_click: (
    locale,
    user,
    pageType,
    pageSection,
    { label },
  ) => {
    const common = getCommonParams(locale, user);
    trackEvent(EVENT_NAMES.CLICK, {
      page_type: PAGE_TYPES.HOME,
      page_section: PAGE_SECTIONS.BROWSE_BY_CITY,
      name: label,
      ...common,
    });
  },
  car_news_click: (locale, user, pageType, pageSection, { label }) => {
    const common = getCommonParams(locale, user);
    trackEvent(EVENT_NAMES.CLICK, {
      page_type: PAGE_TYPES.HOME,
      page_section: PAGE_SECTIONS.CAR_NEWS,
      name: label,
      ...common,
    });
  },

  app_install_banner_click: (locale, user, selected_link) => {
    const common = getCommonParams(locale, user);
    trackEvent(EVENT_NAMES.CLICK, {
      page_type: PAGE_TYPES.HOME,
      page_section: PAGE_SECTIONS.APP_INSTALL_BANNER,
      name: selected_link,
      ...common,
    });
  },
  support_link_click: (locale, user, pageType, pageSection, { label }) => {
    const common = getCommonParams(locale, user);
    trackEvent(EVENT_NAMES.CONTACT_SUPPORT, {
      page_type: pageType || PAGE_TYPES.HOME,
      page_section: PAGE_SECTIONS.SUPPORT,
      interacted_from: pageType || PAGE_TYPES.HOME,
      name: label,
      ...common,
    });
  },

  footer_link_click: (locale, user, pageType, pageSection, { label }) => {
    const common = getCommonParams(locale, user);
    trackEvent(EVENT_NAMES.CLICK, {
      page_type: PAGE_TYPES.HOME,
      page_section: PAGE_SECTIONS.FOOTER,
      name: label,
      ...common,
    });
  },

  view_all_link_click: (
    locale,
    user,
    page_type,
    page_section,
    { activeTab },
  ) => {
    const common = getCommonParams(locale, user);
    trackEventGA4(EVENT_NAMES.CLICK_VIEW_ALL, {
      website_section: WEBSITE_SECTIONS.BUY,
      page_type: page_type || PAGE_TYPES.HOME,
      page_section: page_section,
      name: 'view_all',
      ...(activeTab && { value: activeTab }),
      ...common,
    });
  },

  filter_price_button_click: (locale, user, button_name) => {
    const common = getCommonParams(locale, user);
    trackEvent(EVENT_NAMES.CLICK, {
      website_section: WEBSITE_SECTIONS.BUY,
      page_type: PAGE_TYPES.SEARCH_RESULTS,
      page_section: PAGE_SECTIONS.FILTERS,
      name: button_name,
      ...common,
    });
  },

  filter_quick_link_tracking_map: {
    'used-car-prices': {
      eventName: EVENT_NAMES.CLICK,
      buttonName: 'used_car_prices',
    },
    'new-car-prices': {
      eventName: EVENT_NAMES.CLICK,
      buttonName: 'new_car_prices',
    },
    'imported-cars': {
      eventName: EVENT_NAMES.CLICK_SELL_CAR,
      buttonName: 'sell_car',
    },
    'imported-used-cars': {
      eventName: EVENT_NAMES.CLICK,
      buttonName: 'imported_used_cars',
    },
    'imported-new-cars': {
      eventName: EVENT_NAMES.CLICK,
      buttonName: 'imported_new_cars',
    },
  },

  filter_quick_link_click: (locale, user, linkKey) => {
    const trackingConfig =
      homeClickEvents.filter_quick_link_tracking_map[linkKey];
    if (!trackingConfig) return;

    const common = getCommonParams(locale, user);
    trackEvent(trackingConfig.eventName, {
      website_section: WEBSITE_SECTIONS.BUY,
      page_type: PAGE_TYPES.SEARCH_RESULTS,
      page_section: PAGE_SECTIONS.FILTERS,
      name: trackingConfig.buttonName,
      ...common,
    });
  },

  start_search: (locale, user, page_type, page_section) => {
    const common = getCommonParams(locale, user);
    trackEvent(EVENT_NAMES.START_SEARCH, {
      website_section: WEBSITE_SECTIONS.BUY,
      page_type: page_type,
      page_section: page_section,
      ...common,
    });
  },

  search_suggestion_click: (
    locale,
    user,
    page_type,
    page_section,
    name,
    brand,
    model,
  ) => {
    const common = getCommonParams(locale, user);
    trackEvent(EVENT_NAMES.CLICK_SEARCH, {
      website_section: WEBSITE_SECTIONS.BUY,
      page_type: page_type,
      page_section: page_section,
      interacted_from: name,
      ...(brand && { brand }),
      ...(model && { model }),
      ...common,
    });
  },

  recent_searches_click: (locale, user, page_type, brand, model) => {
    const common = getCommonParams(locale, user);
    trackEvent(EVENT_NAMES.CLICK_SEARCH, {
      website_section: WEBSITE_SECTIONS.BUY,
      page_type: page_type || PAGE_TYPES.HOME,
      page_section: PAGE_SECTIONS.RECENT_SEARCHES,
      ...(brand && { brand }),
      ...(model && { model }),
      ...common,
    });
  },

  search_complete: (
    locale,
    user,
    page_type,
    page_section,
    searchQuery,
    selectedOption,
  ) => {
    const common = getCommonParams(locale, user);
    trackEvent(EVENT_NAMES.CLICK_SEARCH, {
      website_section: WEBSITE_SECTIONS.BUY,
      page_type: page_type,
      page_section: page_section,
      name: searchQuery,
      value: selectedOption,
      ...common,
    });
  },

  open_filter: (locale, user, page_type, page_section) => {
    const common = getCommonParams(locale, user);
    trackEvent(EVENT_NAMES.OPEN_FILTER, {
      website_section: WEBSITE_SECTIONS.BUY,
      page_type: page_type,
      page_section: page_section,
      ...common,
    });
  },

  click_filter: (locale, user, page_type, page_section, name, value) => {
    const common = getCommonParams(locale, user);
    trackEvent(EVENT_NAMES.CLICK_FILTER, {
      website_section: WEBSITE_SECTIONS.BUY,
      page_type: page_type,
      page_section: page_section,
      ...(name && { name }),
      ...(value && { value }),
      ...common,
    });
  },

  show_results_click: (locale, user, page_type, page_section) => {
    const common = getCommonParams(locale, user);
    trackEvent(EVENT_NAMES.CLICK_SEARCH, {
      website_section: WEBSITE_SECTIONS.BUY,
      page_type: page_type,
      page_section: page_section,
      ...common,
    });
  },
  click_favourite: (
    locale,
    user,
    page_type,
    page_section,
    { item: listing },
  ) => {
    const common = getCommonParams(locale, user);
    trackEvent(EVENT_NAMES.CLICK_FAVOURITE, {
      website_section: WEBSITE_SECTIONS.BUY,
      page_type: page_type,
      page_section: page_section,
      ...listing,
      ...common,
    });
  },
  click_tag: (locale, user, page_type, page_section, tagLabel) => {
    const common = getCommonParams(locale, user);
    trackEvent(EVENT_NAMES.CLICK_TAG, {
      website_section: WEBSITE_SECTIONS.BUY,
      page_type: page_type,
      page_section: page_section,
      value: tagLabel,
      ...common,
    });
  },

  click_sort: (locale, user) => {
    const common = getCommonParams(locale, user);
    trackEvent(EVENT_NAMES.CLICK, {
      website_section: WEBSITE_SECTIONS.BUY,
      page_type: PAGE_TYPES.SEARCH_RESULTS,
      page_section: PAGE_SECTIONS.SELECT_SORT,
      ...common,
    });
  },
  select_sort: (locale, user, selectedOption) => {
    const common = getCommonParams(locale, user);
    trackEvent(EVENT_NAMES.CLICK_SORT, {
      website_section: WEBSITE_SECTIONS.BUY,
      page_type: PAGE_TYPES.SEARCH_RESULTS,
      name: selectedOption,
      ...common,
    });
  },
};
export const detailPageEvents = {
  click_gallery: (locale, user, listingData, page_type) => {
    const common = getCommonParams(locale, user);
    const eventData = {
      website_section: WEBSITE_SECTIONS.BUY,
      page_type: page_type,
      ...listingData,
      ...common,
    };

    trackEvent(EVENT_NAMES.CLICK_GALLERY, eventData);
  },
  dismiss_gallery: (locale, user, listingData, page_type) => {
    const common = getCommonParams(locale, user);
    const eventData = {
      website_section: WEBSITE_SECTIONS.BUY,
      page_type: page_type,
      ...listingData,
      ...common,
    };

    trackEvent(EVENT_NAMES.DISMISS_GALLERY, eventData);
  },
};
export const impressionEvents = {
  ad_impression: (locale, user, pageType, listingIdsSet1, listingIdsSet2) => {
    const common = getCommonParams(locale, user);
    trackEvent(EVENT_NAMES.AD_IMPRESSION, {
      website_section: WEBSITE_SECTIONS.BUY,
      page_type: pageType,
      listing_ids_set_1: listingIdsSet1,
      listing_ids_set_2: listingIdsSet2,
      ...common,
    });
  },
};
export const carFinancingEvents = {
  click_apply_financing: (
    locale,
    user,
    pageType,
    deposit,
    price,
    condition,
    carDetails,
  ) => {
    const common = getCommonParams(locale, user);
    trackEvent(EVENT_NAMES.CLICK_APPLY_FINANCING, {
      page_type: pageType,
      page_section: PAGE_SECTIONS.FINANCING_INFORMATION,
      value: deposit,
      price: price,
      condition: condition?.slug,
      brand: carDetails?.brand?.slug,
      model: carDetails?.model?.slug,
      class: carDetails?.class?.slug,
      ...common,
    });
  },
  click_submit_financing: (locale, user, pageType, deposit, values) => {
    const common = getCommonParams(locale, user);
    trackEvent(EVENT_NAMES.CLICK_SUBMIT_FINANCING, {
      page_type: pageType,
      page_section: PAGE_SECTIONS.FINANCE_LEAD_POPUP,
      value: deposit,
      price: values?.price,
      condition: values?.condition?.slug,
      brand: values?.car_detail?.brand?.slug,
      model: values?.car_detail?.model?.slug,
      class: values?.car_detail?.class?.slug,
      ...common,
    });
  },
};

export const appBannerEvents = {
  impression: (locale, user, pageType, bannerVersion) => {
    const common = getCommonParams(locale, user);
    trackEvent(EVENT_NAMES.APP_BANNER_IMPRESSION, {
      platform: 'mweb',
      banner_version: bannerVersion,
      page_type: pageType,
      user_logged_in: common.signed_in_with_user_id,
      ...common,
    });
  },
  click: (locale, user, pageType, bannerVersion) => {
    const common = getCommonParams(locale, user);
    trackEvent(EVENT_NAMES.APP_BANNER_CLICK, {
      platform: 'mweb',
      banner_version: bannerVersion,
      page_type: pageType,
      ...common,
    });
  },
  dismiss: (locale, user, pageType, bannerVersion) => {
    const common = getCommonParams(locale, user);
    trackEvent(EVENT_NAMES.APP_BANNER_DISMISS, {
      platform: 'mweb',
      banner_version: bannerVersion,
      page_type: pageType,
      ...common,
    });
  },
};
export const continueInAppEvents = {
  click: (locale, user, pageType = PAGE_TYPES.OFFER_DETAIL) => {
    const common = getCommonParams(locale, user);
    trackEvent(EVENT_NAMES.CLICK_CONTINUE_IN_APP, {
      website_section: WEBSITE_SECTIONS.BUY,
      page_type: PAGE_TYPES.OFFER_DETAIL,
      ...common,
    });
  },
  dismiss: (locale, user, pageType = PAGE_TYPES.OFFER_DETAIL) => {
    const common = getCommonParams(locale, user);
    trackEvent(EVENT_NAMES.DISMISS_CONTINUE_IN_APP, {
      website_section: WEBSITE_SECTIONS.BUY,
      page_type: PAGE_TYPES.OFFER_DETAIL,
      ...common,
    });
  },
};
export const newCarListingsEvents = {
  click_filter: (locale, user, name, value) => {
    const common = getCommonParams(locale, user);
    const eventData = {
      website_section: WEBSITE_SECTIONS.BUY,
      page_type: PAGE_TYPES.NEW_CAR_RESULTS,
      page_section: PAGE_SECTIONS.FILTERS,
      ...(name && { name }),
      ...(value && { value }),
      ...common,
    };
    trackEvent(EVENT_NAMES.CLICK_FILTER, eventData);
  },
};

export const carMaintenanceEvents = {
  go_to_my_garage_click: (locale, user) => {
    const common = getCommonParams(locale, user);
    trackEvent(EVENT_NAMES.CLICK, {
      website_section: WEBSITE_SECTIONS.BUY,
      page_type: PAGE_TYPES.MY_MAINTENANCE_LANDING,
      ...common,
    });
  },

  add_my_car_banner_click: (locale, user, pageType) => {
    const common = getCommonParams(locale, user);
    trackEvent(EVENT_NAMES.CLICK, {
      website_section: WEBSITE_SECTIONS.BUY,
      page_type: pageType,
      ...common,
    });
  },

  add_maintenance_car: (locale, user, _pageType, _pageSection) => {
    const common = getCommonParams(locale, user);
    trackEvent(EVENT_NAMES.ADD_MAINTENANCE_CAR, {
      website_section: WEBSITE_SECTIONS.BUY,
      page_type: PAGE_TYPES.MAINTENANCE_HOME,
      ...common,
    });
  },

  submit_maintenance_car: (locale, user) => {
    const common = getCommonParams(locale, user);
    trackEvent(EVENT_NAMES.SUBMIT_MAINTENANCE_CAR, {
      website_section: WEBSITE_SECTIONS.BUY,
      page_type: PAGE_TYPES.MAINTENANCE_HOME,
      ...common,
    });
  },

  add_maintenance_service: (locale, user) => {
    const common = getCommonParams(locale, user);
    trackEvent(EVENT_NAMES.ADD_MAINTENANCE_SERVICE, {
      website_section: WEBSITE_SECTIONS.BUY,
      page_type: PAGE_TYPES.MAINTENANCE_HOME,
      ...common,
    });
  },

  submit_maintenance_service: (locale, user) => {
    const common = getCommonParams(locale, user);
    trackEvent(EVENT_NAMES.SUBMIT_MAINTENANCE_SERVICE, {
      website_section: WEBSITE_SECTIONS.BUY,
      page_type: PAGE_TYPES.MAINTENANCE_HOME,
      ...common,
    });
  },

  maintenance_home_click: (locale, user, name) => {
    const common = getCommonParams(locale, user);
    trackEvent(EVENT_NAMES.CLICK, {
      website_section: WEBSITE_SECTIONS.BUY,
      page_type: PAGE_TYPES.MAINTENANCE_HOME,
      name,
      ...common,
    });
  },

  maintenance_detail_click: (locale, user) => {
    const common = getCommonParams(locale, user);
    trackEvent(EVENT_NAMES.CLICK, {
      website_section: WEBSITE_SECTIONS.BUY,
      page_type: PAGE_TYPES.MAINTENANCE_DETAIL,
      name: 'mark as completed',
      ...common,
    });
  },
};

const VIEW_ALL_EVENT_BY_TYPE = {
  ev: EVENT_NAMES.CLICK_VIEW_ALL_EV,
  reev: EVENT_NAMES.CLICK_VIEW_ALL_REEV,
  phev: EVENT_NAMES.CLICK_VIEW_ALL_PHEV,
};

export const evLandingEvents = {
  click_sell_ev: (locale, user) => {
    const common = getCommonParams(locale, user);
    trackEvent(EVENT_NAMES.CLICK_SELL_EV, {
      website_section: WEBSITE_SECTIONS.BUY,
      page_type: PAGE_TYPES.ELECTRIC_CARS,
      page_section: PAGE_SECTIONS.SELL_EV_BANNER,
      ...common,
    });
  },

  click_view_all_type: (locale, user, type) => {
    const eventName = VIEW_ALL_EVENT_BY_TYPE[type];
    if (!eventName) return;
    const common = getCommonParams(locale, user);
    trackEvent(eventName, {
      website_section: WEBSITE_SECTIONS.BUY,
      page_type: PAGE_TYPES.ELECTRIC_CARS,
      page_section: PAGE_SECTIONS.CHOOSE_RIGHT_EV,
      ...common,
    });
  },

  click_ev_calculator: (locale, user, name, value) => {
    const common = getCommonParams(locale, user);
    trackEvent(EVENT_NAMES.CLICK_EV_CALCULATOR, {
      website_section: WEBSITE_SECTIONS.BUY,
      page_type: PAGE_TYPES.ELECTRIC_CARS,
      page_section: PAGE_SECTIONS.COST_CALCULATOR,
      ...(name && { name }),
      ...(value != null && { value }),
      ...common,
    });
  },

  calculate_savings: (locale, user, value) => {
    const common = getCommonParams(locale, user);
    trackEvent(EVENT_NAMES.CALCULATE_SAVINGS, {
      website_section: WEBSITE_SECTIONS.BUY,
      page_type: PAGE_TYPES.ELECTRIC_CARS,
      page_section: PAGE_SECTIONS.COST_CALCULATOR,
      ...(value != null && { value }),
      ...common,
    });
  },

  click_station: (locale, user, name) => {
    const common = getCommonParams(locale, user);
    trackEvent(EVENT_NAMES.CLICK_STATION, {
      website_section: WEBSITE_SECTIONS.BUY,
      page_type: PAGE_TYPES.ELECTRIC_CARS,
      page_section: PAGE_SECTIONS.CHARGING_STATIONS,
      ...(name && { name }),
      ...common,
    });
  },

  click_navigate: (locale, user, name) => {
    const common = getCommonParams(locale, user);
    trackEvent(EVENT_NAMES.CLICK_NAVIGATE, {
      website_section: WEBSITE_SECTIONS.BUY,
      page_type: PAGE_TYPES.ELECTRIC_CARS,
      page_section: PAGE_SECTIONS.CHARGING_STATIONS,
      ...(name && { name }),
      ...common,
    });
  },

  map_interaction: (locale, user) => {
    const common = getCommonParams(locale, user);
    trackEvent(EVENT_NAMES.CLICK, {
      website_section: WEBSITE_SECTIONS.BUY,
      page_type: PAGE_TYPES.ELECTRIC_CARS,
      page_section: PAGE_SECTIONS.CHARGING_STATIONS,
      name: 'map',
      ...common,
    });
  },

  faq_expand: (locale, user, value) => {
    const common = getCommonParams(locale, user);
    trackEvent(EVENT_NAMES.FAQ_EXPAND, {
      website_section: WEBSITE_SECTIONS.BUY,
      page_type: PAGE_TYPES.ELECTRIC_CARS,
      page_section: PAGE_SECTIONS.FAQ,
      ...(value && { value }),
      ...common,
    });
  },
};

export const buyCreditsEvents = {
  choose_package: (locale, user, packageSlug) => {
    const common = getCommonParams(locale, user);
    trackEvent(EVENT_NAMES.CLICK, {
      ...common,
      website_section: WEBSITE_SECTIONS.BUY,
      page_type: PAGE_TYPES.CREDITS_LANDING,
      name: 'credits',
    });
  },

  tab_click: (locale, user) => {
    const common = getCommonParams(locale, user);
    trackEvent(EVENT_NAMES.CLICK, {
      ...common,
      website_section: WEBSITE_SECTIONS.BUY,
      page_type: PAGE_TYPES.CREDITS_LANDING,
    });
  },

  page_scroll: (locale, user, section) => {
    const common = getCommonParams(locale, user);
    trackEvent(EVENT_NAMES.PAGE_SCROLL, {
      ...common,
      website_section: WEBSITE_SECTIONS.BUY,
      page_type: PAGE_TYPES.CREDITS_LANDING,
      interacted_from: section,
    });
  },

  hero_cta_click: (locale, user) => {
    const common = getCommonParams(locale, user);
    trackEvent(EVENT_NAMES.CLICK, {
      ...common,
      website_section: WEBSITE_SECTIONS.BUY,
      page_type: PAGE_TYPES.CREDITS_LANDING,
      page_section: PAGE_SECTIONS.HERO,
      name: 'see_packages',
    });
  },
};

export const contactDetailsEvents = {
  fetch_success: (locale, user, channel, listingId) => {
    const common = getCommonParams(locale, user);
    trackEvent(EVENT_NAMES.CONTACT_DETAILS_FETCH_SUCCESS, {
      channel,
      listing_id: listingId,
      ...common,
    });
  },
  fetch_error: (locale, user, channel, listingId) => {
    const common = getCommonParams(locale, user);
    trackEvent(EVENT_NAMES.CONTACT_DETAILS_FETCH_ERROR, {
      channel,
      listing_id: listingId,
      ...common,
    });
  },
};
