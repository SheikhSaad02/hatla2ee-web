export const listingJumpLinks = {
  CAR_DETAILS: 'car-details',
  FEATURES: 'features',
  FINANCING: 'financing',
  PREMIUM_DEALS: 'premium-deals',
  SAME_BUDGET: 'similar-budget',
  LATEST_NEW_CARS: 'new-cars-catalog',
  CAR_NEWS: 'car-news',
  GALLERY_MOBILE: 'listing-gallery-mobile',
  DIFFERENCE_OTHER_CLASSES: 'difference-with-classes',
  CLASSES_OFFICIAL_PRICES: 'classes-official-prices',
  PRICE_CHANGES: 'price-changes',
  AVAILABLE_NOW_FOR_SALE: 'available-now-for-sale',
  PRICE_TRENDS: 'price-trends',
};

// Price Trends is only meaningful when the app can actually render a trend for
// the ad's Make/Model/Year, which needs at least this many monthly price points
// from used_car_prices/stats. Mirrors the rule the iOS/Android apps apply.
export const PRICE_TRENDS_MIN_ADS = 6;

export const sectionTabs = [
  { label: 'Car Details', value: 'car-details' },
  { label: 'Features', value: 'features' },
  { label: 'Car Financing', value: 'car-financing' },
  { label: 'Highlighted Points', value: 'highlighted-points' },
  { label: 'Financing', value: 'financing' },
];

export const getListingJumpLinks = (t, show, options = {}) => [
  {
    id: listingJumpLinks.CAR_DETAILS,
    label: t('Car Details'),
    show: show.carDetails,
  },
  {
    id: listingJumpLinks.FEATURES,
    label: t('Features'),
    show: show.features,
  },
  {
    id: listingJumpLinks.PRICE_TRENDS,
    label: t('Price Trend'),
    show: show.priceTrends,
  },
  {
    id: listingJumpLinks.FINANCING,
    label: t('Financing'),
    show: show.financing,
  },
  {
    id: listingJumpLinks.DIFFERENCE_OTHER_CLASSES,
    label: options.differenceOtherClassesLabel,
    show: show.differenceOtherClasses,
  },
  {
    id: listingJumpLinks.CLASSES_OFFICIAL_PRICES,
    label: options.classesOfficialPricesLabel,
    show: show.classesOfficialPrices,
  },
  {
    id: listingJumpLinks.PRICE_CHANGES,
    label: options.priceChangesLabel,
    show: show.priceChanges,
  },
  {
    id: listingJumpLinks.PREMIUM_DEALS,
    label: t('Premium Deals'),
    show: show.premiumDeals,
  },
  {
    id: listingJumpLinks.SAME_BUDGET,
    label: options.sameBudgetLabel ?? t('Cars in same budget'),
    show: show.sameBudget,
  },
  {
    id: listingJumpLinks.AVAILABLE_NOW_FOR_SALE,
    label: t('Available Now For Sale'),
    show: show.availableNowForSale,
  },
  {
    id: listingJumpLinks.LATEST_NEW_CARS,
    label: t('Latest New Cars'),
    show: show.latestNewCars,
  },
  {
    id: listingJumpLinks.CAR_NEWS,
    label: t('Latest Car News'),
    show: show.carNews,
  },
];
