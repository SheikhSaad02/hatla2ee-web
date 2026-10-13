import { appPaths, appSections, CDN_PATH } from '../../constants/index.js';
import { getCdnWithoutProtocol } from '../helper-functions.js';

const config = {
  locales: [
    { value: 'ar', rtl: true, default: true },
    { value: 'en', rtl: false },
  ],
  currency: {
    en: { code: 'OMR', label: 'OMR' },
    ar: { code: 'OMR', label: 'ريال' },
  },
  country: {
    en: { label: 'Oman', code: 'OM' },
    ar: { label: 'عمان', code: 'OM' },
  },
  flag: 'OM',
  isValidEmail: (value) =>
    /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(value),
  isValidMobileNumber: (value) => {
    const sanitizeNumber = value?.replace(/\s+/g, '');
    // Oman: +9689XXXXXXX
    const mobileRegex = /^(?:\+?968)?9\d{7}$/;
    return mobileRegex.test(sanitizeNumber);
  },
  CLASSIFIED_BASE_URL: process.env.NEXT_PUBLIC_CLASSIFIED_BASE_URL,
  ENABLE_GOOGLE_SIGN_IN: true,
  ENABLE_MOBILE_SIGN_IN: false,
  ROUTES: {
    allow: [
      appPaths.home,
      `${appPaths.usedCars}/*`,
      appPaths.favoriteCars,
      `${appPaths.changePassword}/*`,
      `${appPaths.login}/*`,
      `${appPaths.resetRequest}/*`,
      `${appPaths.go}/*`,
      `${appPaths.contactUs}`,
      `${appPaths.termsandCondtion}`,
      `${appPaths.privacy}`,
      `${appPaths.carMaintenance}/*`,
    ],
    block: [
      '/car/used-prices/*',
      '/showroom/*',
      '/new-car/*',
      '/insurance/*',
      '/maintenances-center/*',
      '/review/*',
      '/car/all-prices/*',
      '/car/prices-range/*',
    ],
  },
  remotePatterns: [
    { protocol: 'https', hostname: 'images.oman.hatla2ee.com' },
    { protocol: 'https', hostname: 'legion-images.hatla2ee.com' },
    {
      protocol: 'https',
      hostname: getCdnWithoutProtocol(CDN_PATH),
    },
  ],
  disabledSections: [
    appSections.BUY_CREDITS,
    appSections.ELECTRIC_CARS,
    appSections.SHOWROOMS,
    appSections.EVALUTATION,
    appSections.FINANCING,
    appSections.REVIEWS,
    appSections.MAINTENANCE_CENTER,
    appSections.SUPPORT,
    appSections.TOTAL_ENERGIES_BANNER,
    appSections.VEHICLE_PRICES,
    appSections.IMPORTED,
    appSections.CHANGE_CAR_PRICES,
    appSections.NEW_CAR_FINANCING,
    appSections.USED_CAR_FINANCING,
    appSections.USED_SHOWROOMS,
    appSections.NEW_SHOWROOMS,
    appSections.AUTHORIZED_DEALERS,
    appSections.REVIEWS,
    appSections.MAINTENANCE_CENTER,
    appSections.TOW_TRUCKS,
    appSections.NEW_CARS,
    appSections.COMPARISON,
    appSections.USED_CARS_PRICES,
    appSections.NEW_CARS_PRICES,
    appSections.CAR_PRICES,
  ],
  spec_visibility: true,
  isReCaptchaEnabled: true,
  ENABLE_SELLABLE_BADGES: false,
  ENABLE_GOOD_DEAL_FILTER: false,
  ENABLE_CREDIT_USAGE: false,
  ENABLE_LEAD_LOGIN_ENFORCEMENT: false,
  ENABLE_LLMS_TXT: false,
  ENABLE_WHATSAPP_OTP_FALLBACK: false,
};

export default config;
