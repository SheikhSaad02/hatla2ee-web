const AD_COUNTRY = process.env.NEXT_PUBLIC_TENANT || 'eg';

const getAdPath = (isMobile) =>
  `/1000931/hatla2ee_${isMobile ? 'mweb' : 'desktop'}`;

const getCommonParams = (locale = 'en') => ({
  debug: process.env.NEXT_PUBLIC_DEBUG_ADS === 'true',
  country: AD_COUNTRY,
  language: locale,
});

const categorySlugToAdPath = {
  car: 'cars',
  trucks: 'trucks',
  motorcycle: 'motorcycles',
  bus: 'buses',
};

const getCategoryAdPath = (categorySlug) => {
  return categorySlugToAdPath[categorySlug] || categorySlug;
};

export const getHomeAdUnits = (isMobile = false, locale = 'en') => {
  const AD_PATH = getAdPath(isMobile);

  return {
    homeHeroBanner: {
      path: `${AD_PATH}/home`,
      size: [1, 1],
      divId: 'ad-placement-0',
      targeting: {
        slot_index: '0',
        ...getCommonParams(locale),
        condition: 'all',
      },
    },
    homeTopBanner: {
      path: `${AD_PATH}/home`,
      size: isMobile ? [300, 250] : [970, 250],
      divId: isMobile ? 'ad-placement-0' : 'ad-placement-1',
      targeting: {
        slot_index: isMobile ? '0' : '1',
        ...getCommonParams(locale),
        condition: 'all',
      },
    },
    homeBottomBanner: {
      path: `${AD_PATH}/home`,
      size: isMobile ? [300, 250] : [970, 250],
      divId: isMobile ? 'ad-placement-1' : 'ad-placement-2',
      targeting: {
        slot_index: isMobile ? '1' : '2',
        ...getCommonParams(locale),
        condition: 'all',
      },
    },
  };
};

export const getUsedCarLandingAdUnits = (isMobile = false, locale = 'en') => {
  const AD_PATH = getAdPath(isMobile);

  return {
    usedCarHeroBanner: {
      path: `${AD_PATH}/cars_home`,
      size: [1, 1],
      divId: 'ad-placement-0',
      targeting: {
        slot_index: '0',
        ...getCommonParams(locale),
        condition: 'used',
        hatla2ee_section: 'cars',
      },
    },
    usedCarLandingTopAd: {
      path: `${AD_PATH}/cars_home`,
      size: isMobile ? [300, 250] : [970, 250],
      divId: 'ad-placement-1',
      targeting: {
        slot_index: '1',
        ...getCommonParams(locale),
        condition: 'used',
        hatla2ee_section: 'cars',
      },
    },
  };
};

export const getListingAdUnits = (
  isMobile = false,
  locale = 'en',
  categorySlug = 'cars',
  condition = 'used',
  make = '',
  model = '',
  body = '',
  imported = false,
) => {
  const AD_PATH = getAdPath(isMobile);
  const mappedCategory = categorySlug
    ? getCategoryAdPath(categorySlug)
    : categorySlug;
  const makeModelTargeting = {
    condition: condition,
    hatla2ee_section: mappedCategory,
    ...(make && { hatla2ee_make: make }),
    ...(model && { hatla2ee_model: model }),
    ...(body && { body_type: body }),
    ...(imported && { hatla2ee_imported: imported }),
  };
  return {
    usedCarLandingListingsAd: {
      path: `${AD_PATH}/cars_home`,
      size: isMobile ? [320, 100] : [970, 250],
      divId: 'ad-placement-2',
      targeting: {
        slot_index: '2',
        ...getCommonParams(locale),
        ...makeModelTargeting,
      },
    },
    searchTopAd: {
      path: `${AD_PATH}/${mappedCategory}_lpv`,
      size: isMobile ? [320, 100] : [728, 90],
      divId: 'ad-placement-0',
      targeting: {
        slot_index: '0',
        ...getCommonParams(locale),
        ...makeModelTargeting,
      },
    },
    searchBottomAd: {
      path: `${AD_PATH}/${mappedCategory}_lpv`,
      size: isMobile ? [320, 100] : [970, 250],
      divId: 'ad-placement-1',
      targeting: {
        slot_index: '1',
        ...getCommonParams(locale),
        ...makeModelTargeting,
      },
    },
    sidebarAd: {
      path: `${AD_PATH}/cars_lpv`,
      size: [300, 250],
      divId: 'ad-placement-1',
      targeting: {
        slot_index: '1',
        ...getCommonParams(locale),
        condition: condition,
        hatla2ee_section: categorySlug,
        ...makeModelTargeting,
      },
    },
    stickyAd: getStickyAdUnit(isMobile, locale, makeModelTargeting),
  };
};

export const getUsedCarDetailAdUnits = (
  isMobile = false,
  locale = 'en',
  carDetails = {},
) => {
  const AD_PATH = getAdPath(isMobile);
  const { make, model, year, condition, imported, category, body } = carDetails;
  const mappedCategory = category ? getCategoryAdPath(category) : category;
  const commonTargeting = {
    ...getCommonParams(locale),
    hatla2ee_section: mappedCategory,
    hatla2ee_make: make,
    hatla2ee_model: model,
    year: year,
    condition: condition,
    hatla2ee_imported: imported == 'no' ? 'false' : 'true',
    ...(body && { body_type: body }),
  };
  return {
    usedCarDetailTopAd: {
      path: `${AD_PATH}/cars_dpv`,
      size: [970, 250],
      divId: 'ad-placement-0',
      targeting: { slot_index: '0', ...commonTargeting },
    },
    usedCarDetailSideBarAd: {
      path: `${AD_PATH}/cars_dpv`,
      size: [300, 250],
      divId: 'ad-placement-1',
      targeting: { slot_index: '1', ...commonTargeting },
    },
    usedCarDetailBottomAd: {
      path: `${AD_PATH}/cars_dpv`,
      size: isMobile ? [300, 250] : [970, 250],
      divId: 'ad-placement-2',
      targeting: { slot_index: '2', ...commonTargeting },
    },
    stickyAd: getStickyAdUnit(isMobile, locale, commonTargeting),
  };
};

export const getNewCarLandingAdUnits = (
  isMobile = false,
  locale = 'en',
  categorySlug = 'cars',
) => {
  const AD_PATH = getAdPath(isMobile);
  const mappedCategory = getCategoryAdPath(categorySlug);
  const adPathSuffix = `${mappedCategory}_home`;

  return {
    newCarHeroBanner: {
      path: `${AD_PATH}/${adPathSuffix}`,
      size: [1, 1],
      divId: 'ad-placement-0',
      targeting: {
        slot_index: '0',
        ...getCommonParams(locale),
        condition: 'new',
        hatla2ee_section: mappedCategory,
      },
    },
    newCarLandingTopAd: {
      path: `${AD_PATH}/${adPathSuffix}`,
      size: isMobile ? [320, 100] : [970, 250],
      divId: 'ad-placement-1',
      targeting: {
        slot_index: '1',
        ...getCommonParams(locale),
        condition: 'new',
        hatla2ee_section: mappedCategory,
      },
    },
    newCarLandingMiddleAd: {
      path: `${AD_PATH}/${adPathSuffix}`,
      size: isMobile ? [320, 100] : [970, 250],
      divId: 'ad-placement-2',
      targeting: {
        slot_index: '2',
        ...getCommonParams(locale),
        condition: 'new',
        hatla2ee_section: mappedCategory,
      },
    },
    newCarLandingBottomAd: {
      path: `${AD_PATH}/${adPathSuffix}`,
      size: isMobile ? [320, 100] : [970, 250],
      divId: 'ad-placement-3',
      targeting: {
        slot_index: '3',
        ...getCommonParams(locale),
        condition: 'new',
        hatla2ee_section: mappedCategory,
      },
    },
  };
};

export const getCarInfoAdUnits = (
  isMobile = false,
  locale = 'en',
  carDetails = {},
) => {
  const AD_PATH = getAdPath(isMobile);
  const { make, model, year, condition, imported, category, body } = carDetails;
  const mappedCategory = category ? getCategoryAdPath(category) : category;
  const commonTargeting = {
    ...getCommonParams(locale),
    hatla2ee_section: mappedCategory,
    hatla2ee_make: make,
    hatla2ee_model: model,
    year: year,
    condition: condition,
    hatla2ee_imported: imported == 'no' ? 'false' : 'true',
    ...(body && { body_type: body }),
  };
  return {
    carInfoDetailTopAd: {
      path: `${AD_PATH}/prices_dpv`,
      size: [970, 250],
      divId: 'ad-placement-0',
      targeting: { slot_index: '0', ...commonTargeting },
    },
    carInfoDetailMiddleAd: {
      path: `${AD_PATH}/prices_dpv`,
      size: [300, 250],
      divId: 'ad-placement-1',
      targeting: { slot_index: '1', ...commonTargeting },
    },
    carInfoDetailBottomAd: {
      path: `${AD_PATH}/prices_dpv`,
      size: isMobile ? [300, 250] : [970, 250],
      divId: 'ad-placement-2',
      targeting: { slot_index: '2', ...commonTargeting },
    },
    evaluateDetailAd: {
      path: `${AD_PATH}/prices_dpv`,
      size: isMobile ? [300, 250] : [970, 250],
      divId: 'ad-placement-0',
      targeting: {
        slot_index: '0',
        ...getCommonParams(locale),
        hatla2ee_make: make,
        hatla2ee_model: model,
        year: year,
        ...(body && { body_type: body }),
      },
    },
    stickyAd: getStickyAdUnit(isMobile, locale, commonTargeting),
  };
};
export const getCarPricesAdUnits = (
  isMobile = false,
  locale = 'en',
  condition = 'used',
  make = '',
  vehicle = '',
) => {
  const AD_PATH = getAdPath(isMobile);
  const mappedVehicle = vehicle ? getCategoryAdPath(vehicle) : vehicle;
  const commonTargeting = {
    ...getCommonParams(locale),
    hatla2ee_section: mappedVehicle,
    condition: condition,
    ...(make && { hatla2ee_make: make }),
  };
  return {
    carPricesTopAd: {
      path: `${AD_PATH}/prices_home`,
      size: isMobile ? [320, 100] : [970, 250],
      divId: 'ad-placement-0',
      targeting: {
        slot_index: '0',
        ...commonTargeting,
      },
    },
    carPricesMakeAd: {
      path: `${AD_PATH}/prices_lpv`,
      size: isMobile ? [320, 100] : [970, 250],
      divId: 'ad-placement-0',
      targeting: {
        slot_index: '0',
        ...commonTargeting,
      },
    },
    carPricesMakeBottomAd: {
      path: `${AD_PATH}/prices_lpv`,
      size: isMobile ? [320, 100] : [970, 250],
      divId: 'ad-placement-1',
      targeting: {
        slot_index: '1',
        ...commonTargeting,
      },
    },
    stickyAd: getStickyAdUnit(isMobile, locale, commonTargeting),
  };
};

export const getStickyAdUnit = (
  isMobile = false,
  locale = 'en',
  targeting = {},
) => {
  const AD_PATH = getAdPath(isMobile);

  return {
    path: `${AD_PATH}/sticky`,
    size: [300, 100],
    divId: 'ad-placement-sticky',
    targeting: {
      slot_index: '-2',
      ...getCommonParams(locale),
      ...targeting,
    },
  };
};
