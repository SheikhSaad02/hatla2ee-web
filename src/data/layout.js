import { appPaths, appSections, BASE_URL } from '@/constants';
import {
  getAsset,
  getLocalizedPathname,
  getUserPathToRedirect,
} from '@/utils/general';
import { AE, EG, JO, KW, OM, QA, SA } from '@/icons/country-flags';
import configs from '@/configs';

export const footerLinks = (locale) => [
  {
    label: 'General Links',
    links: [
      { name: 'Home', href: getLocalizedPathname('/', locale, false) },
      { name: 'Contact Us', href: `/${locale}/contact-us` },
      {
        name: 'Terms And Conditions',
        href: `/${locale}/general-condition`,
      },
      {
        name: 'Privacy',
        href: `/${locale}/privacy`,
      },
      ...(configs.helpCenterUrl?.[locale]
        ? [{ name: 'Help', href: configs.helpCenterUrl[locale] }]
        : []),
    ],
  },
  {
    label: 'Cars for Sale',
    links: [
      {
        name: 'Car For Sale Egypt',
        href: `https://eg.hatla2ee.com/${locale}/car`,
      },
      {
        name: 'Car For Sale UAE',
        href: `https://uae.hatla2ee.com/${locale}/car`,
      },
      {
        name: 'Car For Sale Saudi Arabia',
        href: `https://ksa.hatla2ee.com/${locale}/car`,
      },
    ],
  },
  {
    label: 'Used Cars For Sale',
    links: [
      {
        name: 'Used Car For Sale in Kuwait',
        href: `https://kuwait.hatla2ee.com/${locale}/car`,
      },
      {
        name: 'Used Car in Jordan',
        href: `https://jordan.hatla2ee.com/${locale}/car`,
      },
      {
        name: 'Used Car For Sale in Qatar',
        href: `https://qatar.hatla2ee.com/${locale}/car`,
      },
      {
        name: 'Used Car For Sale in Oman',
        href: `https://oman.hatla2ee.com/${locale}/car`,
      },
    ],
  },
  // {
  //   label: 'Popular Used Cars',
  //   links: [
  //     { name: 'Toyota Corolla for Sale', href: '/car/toyota/corolla/' },
  //     { name: 'Hyundai Elantra for Sale', href: '/car/hyundai/elantra/' },
  //     { name: 'Kia Sportage for Sale', href: '/car/kia/sportage/' },
  //     { name: 'Hyundai Tuscon for Sale', href: '/car/hyundai/tuscon/' },
  //     { name: 'Nissan Sunny for Sale', href: '/car/nissan/sunny/' },
  //     { name: 'Kia Cerato for Sale', href: '/car/kia/cerato/' },
  //   ],
  // },
  // {
  //   label: 'Popular New Cars',
  //   links: [
  //     { name: 'Toyota Corolla', href: '/new-car/toyota/corolla' },
  //     { name: 'Hyundai Elantra', href: '/new-car/hyundai/elantra' },
  //     { name: 'Kia Sportage', href: '/new-car/kia/sportage' },
  //     { name: 'Hyundai Tuscon', href: '/new-car/hyundai/tuscon' },
  //     { name: 'Nissan Sunny', href: '/new-car/nissan/sunny' },
  //     { name: 'Kia Cerato', href: '/new-car/kia/cerato' },
  //   ],
  // },
  // {
  //   label: 'Explore Hatlaee',
  //   links: [
  //     { name: 'Car Reviews', href: '/review' },
  //     { name: 'Car Inspection', href: '#' },
  //     { name: 'Car Financing', href: '/car-finance/finance-used-car' },
  //     { name: 'Blogs', href: '#' },
  //     { name: 'Forum', href: '/forum' },
  //   ],
  // },
];

const getCountryPath = (inputPath, locale, host) => {
  const isPrelive = host.startsWith('prelive.');
  const domainMatch = inputPath.match(
    /https:\/\/(?:prelive\.)?([^/]+)\.hatla2ee\.com/,
  );
  const subdomain = domainMatch?.[1];
  if (!subdomain) return inputPath;
  const newHost = isPrelive
    ? `prelive.${subdomain}.hatla2ee.com`
    : `${subdomain}.hatla2ee.com`;

  const suffix = locale === 'en' ? '/en' : '/';
  return `https://${newHost}${suffix}`;
};

export const countryPlatformsList = (locale, host) => [
  {
    label: 'Egypt',
    href: getCountryPath('https://eg.hatla2ee.com', locale, host),
    id: 'EG',
    icon: EG,
    size: '16px',
  },
  {
    label: 'Saudia Arabia',
    href: getCountryPath('https://ksa.hatla2ee.com', locale, host),
    icon: SA,
    id: 'SA',
  },
  {
    label: 'United Arab Emirates',
    href: getCountryPath('https://uae.hatla2ee.com', locale, host),
    id: 'UAE',
    icon: AE,
  },
  {
    label: 'Jordan',
    href: getCountryPath('https://jordan.hatla2ee.com', locale, host),
    id: 'JO',
    icon: JO,
  },
  {
    label: 'Qatar',
    href: getCountryPath('https://qatar.hatla2ee.com', locale, host),
    id: 'QA',
    icon: QA,
  },
  {
    label: 'Oman',
    href: getCountryPath('https://oman.hatla2ee.com', locale, host),
    id: 'OM',
    icon: OM,
  },
  {
    label: 'Kuwait',
    href: getCountryPath('https://kuwait.hatla2ee.com', locale, host),
    id: 'KW',
    icon: KW,
  },
];

export const mobileNavigationItems = [
  {
    id: appSections.NEW_CARS,
    title: 'New Cars',
    image: getAsset('/assets/more/newCars.webp'),
    link: '/new-car',
  },
  {
    id: appSections.REVIEWS,

    title: 'Car Reviews',
    image: getAsset('/assets/more/carReviewsLatest.webp'),
    link: '/review',
  },
  {
    id: appSections.USED_CARS,
    title: 'Used Cars',
    image: getAsset('/assets/more/usedCars.webp'),
    link: '/car',
  },
  {
    id: appSections.EVALUTATION,
    title: 'Car Evaluation',
    image: getAsset('/assets/more/carEvaluationLatest.webp'),
    link: '/car/used-prices/evaluate',
  },
  {
    id: appSections.FINANCING,
    title: 'Used Car Financing',
    image: getAsset('/assets/more/carFinancingLatest.webp'),
    link: '/car-finance/finance-used-car',
  },
  {
    id: appSections.COMPARISON,
    title: 'Car Comparison',
    image: getAsset('/assets/more/carComparisonLatest.webp'),
    link: '/new-car/compare',
  },
];

export const navigationItems = (locale, isMobile = false, user) => {
  const creditsLink = {
    id: appSections.BUY_CREDITS,
    label: 'Credits',
    href: `${appPaths.buyCredits}`,
    description: 'Buy credits, get more value for money',
    spriteClass: 'Credits',
    isNew: true,
  };

  return {
    'car-prices': [
      {
        id: appSections.NEW_CARS_PRICES,
        label: 'New Car Prices',
        href: '/car/all-prices',
        description: 'Discover the latest prices on brand new cars',
        spriteClass: 'NewCarPrice',
      },
      {
        id: appSections.NEW_CARS_PRICES,
        label: 'Used Car Prices',
        href: '/car/used-prices',
        description: 'Get the best deals on reliable used cars',
        spriteClass: 'UsedCarPrice',
      },
      {
        id: appSections.CHANGE_CAR_PRICES,
        label: 'Changes in New Car Prices',
        href: '/new-car/price-change',
        description: 'Stay up-to date with latest new car price changes',
        spriteClass: 'ChangeCarPrice',
      },
    ],
    'vehicle-prices': [
      {
        id: appSections.NEW_TRUCKS,
        label: 'New Trucks',
        href: '/new-trucks',
        description: 'Explore the latest trucks',
        spriteClass: 'Newtruck',
      },
      {
        id: appSections.NEW_TRUCK_PRICES,
        label: 'New Truck Prices',
        href: '/trucks/all-prices',
        description: 'Find the best prices for new trucks',
        spriteClass: 'Newtruckprice',
      },
      {
        id: appSections.NEW_BUSES,
        label: 'New Buses',
        href: '/new-bus',
        description: 'Check out the newest bus models',
        spriteClass: 'Newbuses',
      },
      {
        id: appSections.NEW_BUS_PRICES,
        label: 'New Bus Prices',
        href: '/bus/all-prices',
        description: 'Get updated prices on new buses',
        spriteClass: 'Newbusprices',
      },
      {
        id: appSections.NEW_MOTORCYCLES,
        label: 'New Motorcycles',
        href: '/new-motorcycle',
        description: 'Discover latest motorcycles',
        spriteClass: 'Newmotorcycles',
      },
      {
        id: appSections.NEW_MOTORCYCLE_PRICES,
        label: 'New Motorcycle Prices',
        href: '/motorcycle/all-prices',
        description: 'Find great deals on new motorcycles',
        spriteClass: 'Newmotorcycleprices',
      },
    ],
    more: [
      ...(isMobile
        ? [
            creditsLink,
            {
              id: appSections.ELECTRIC_CARS,
              label: 'Electric Cars',
              href: appPaths.electricCars,
              description: '',
              spriteClass: 'Electric',
              isNew: true,
            },
            {
              id: appSections.MY_ADS,
              label: 'My Ads',
              href: getUserPathToRedirect(appPaths.listings, user, locale),
              description: '',
              spriteClass: 'MyAds',
            },
          ]
        : []),
      {
        id: appSections.NEW_CAR_FINANCING,
        label: 'Car Financing',
        href: '/car-finance/finance-new-car',
        description: 'Easy car loans with flexible terms',
        spriteClass: 'Financing',
      },
      {
        id: appSections.USED_CAR_FINANCING,
        label: 'Used Car Financing',
        href: '/car-finance/finance-used-car',
        description: 'Affordable financing for used cars',
        spriteClass: 'Used',
      },
      {
        id: appSections.EVALUTATION,
        label: 'Car Evaluation',
        href: '/car/used-prices/evaluate',
        description: 'Get an instant car evaluation',
        spriteClass: 'Evaluation',
      },
      {
        id: appSections.COMPARISON,
        label: 'Car Comparison',
        href: '/new-car/compare',
        description: 'Detailed comparison to make the right decision',
        spriteClass: 'Comparison',
      },
      {
        id: appSections.USED_SHOWROOMS,
        label: 'Used Car Showrooms',
        href: '/showroom',
        description: 'Explore used car showrooms near you',
        spriteClass: 'ShowroomUsed',
      },
      {
        id: appSections.NEW_SHOWROOMS,
        label: 'New Car Showrooms',
        href: '/showroom-new',
        description: 'Find the new cars at showrooms near you',
        spriteClass: 'ShowroomNew',
      },
      {
        id: appSections.AUTHORIZED_DEALERS,
        label: 'Authorized Car Dealers',
        href: '/showroom-authorized',
        description: 'Explore top cars at trusted dealerships',
        spriteClass: 'ShowroomAuthrized',
      },
      {
        id: appSections.REVIEWS,
        label: 'Car Reviews',
        href: '/review',
        description: 'Read expert reviews to make an informed decision',
        spriteClass: 'Reviews',
      },
      {
        id: appSections.NEWS,
        label: 'Latest News',
        href: `${BASE_URL}/news${locale == 'en' ? `/${locale}` : ''}`,
        description: 'Stay updated with the latest car news',
        spriteClass: 'LatestNews',
      },
      {
        id: appSections.MAINTENANCE_CENTER,
        label: 'Maintenance Centers',
        href: `${appPaths.maintenanceCenter}`,
        description: 'Find trusted maintenance centers near you',
        spriteClass: 'CarMaintenance',
      },
      {
        id: appSections.TOW_TRUCKS,
        label: 'Tow Trucks',
        href: `${appPaths.towTrucks}`,
        description: 'Find quick roadside assistance',
        spriteClass: 'TowTruck',
      },
      {
        id: appSections.SAVED_CARS,
        label: 'Saved Cars',
        href: `${appPaths.favoriteCars}`,
        description: 'View your saved cars',
        spriteClass: 'SavedCars',
      },
      {
        id: appSections.MY_MAINTENANCE,
        label: 'My Maintenance',
        href: `${appPaths.carMaintenance}`,
        description: `Manage your car's maintenance`,
        spriteClass: 'MyMaintenance',
      },
      ...(isMobile ? [] : [creditsLink]),
    ],
  };
};

export const desktopNavigationItems = [
  {
    id: appSections.USED_CARS,
    label: 'Used Cars',
    href: '/car',
    title: 'Used cars for sale',
  },
  {
    id: appSections.NEW_CARS,
    label: 'New Cars',
    href: '/new-car',
    title: 'New cars for sale',
  },
  {
    id: appSections.IMPORTED,
    label: 'Imported Cars',
    href: '/imported-car',
    title: 'Imported Cars',
  },
  {
    id: appSections.ELECTRIC_CARS,
    label: 'Electric Cars',
    href: '/electric-car',
    title: 'Electric Cars',
    isNew: true,
  },
  {
    id: appSections.CAR_PRICES,
    label: 'Car Prices',
    href: '#',
    dropdown: true,
    title: 'Car Prices',
  },
  {
    id: appSections.VEHICLE_PRICES,
    label: 'Other Vehicles',
    href: '#',
    dropdown: true,
    title: 'Other Vehicles',
  },
  {
    id: appSections.MORE,
    label: 'More',
    href: '#',
    dropdown: true,
    align: 'center',
    title: 'More',
  },
];
