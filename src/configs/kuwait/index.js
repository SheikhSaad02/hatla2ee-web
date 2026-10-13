import { getCdnWithoutProtocol } from '../helper-functions.js';
import { appPaths, appSections, CDN_PATH } from '../../constants/index.js';

const config = {
  locales: [
    { value: 'ar', rtl: true, default: true },
    { value: 'en', rtl: false },
  ],
  currency: {
    en: { code: 'KWD', label: 'KWD' },
    ar: { code: 'KWD', label: 'دينار' },
  },
  country: {
    en: { label: 'Kuwait', code: 'KW' },
    ar: { label: 'الكويت', code: 'KW' },
  },
  flag: 'KW',
  isValidEmail: (value) =>
    /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(value),
  isValidMobileNumber: (value) => {
    const sanitizeNumber = value?.replace(/\s+/g, '');
    // Kuwait: +9655XXXXXXX
    const mobileRegex = /^(?:\+?965)?[569]\d{7}$/;
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
    { protocol: 'https', hostname: 'images.kuwait.hatla2ee.com' },
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
