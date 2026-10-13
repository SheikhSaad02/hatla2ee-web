import { appPaths, appSections, CDN_PATH } from '../../constants/index.js';
import { getCdnWithoutProtocol } from '../helper-functions.js';

const config = {
  locales: [
    { value: 'ar', rtl: true, default: true },
    { value: 'en', rtl: false },
  ],
  currency: {
    en: { code: 'QAR', label: 'QAR' },
    ar: { code: 'QAR', label: 'ريال' },
  },
  country: {
    en: { label: 'Qatar', code: 'QA' },
    ar: { label: 'قطر', code: 'QA' },
  },
  flag: 'QA',
  isValidEmail: (value) =>
    /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(value),
  isValidMobileNumber: (value) => {
    const sanitizeNumber = value?.replace(/\s+/g, '');
    // Qatar: +9745XXXXXXX (8 digits after 5/6/7)
    const mobileRegex = /^(?:\+?974)?[3567]\d{7}$/;
    return mobileRegex.test(sanitizeNumber);
  },
  CLASSIFIED_BASE_URL: process.env.NEXT_PUBLIC_CLASSIFIED_BASE_URL,
  ENABLE_GOOGLE_SIGN_IN: true,
  ENABLE_MOBILE_SIGN_IN: false,
  ROUTES: {
    allow: [
      appPaths.home,
      `${appPaths.usedCars}/*`,
      `${appPaths['new-car']}/*`,
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
    block: [],
  },
  remotePatterns: [
    { protocol: 'https', hostname: 'images.qatar.hatla2ee.com' },
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
