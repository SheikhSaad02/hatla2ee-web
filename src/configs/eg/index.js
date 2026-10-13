import { CDN_PATH } from '../../constants/index.js';
import { getCdnWithoutProtocol } from '../helper-functions.js';

const config = {
  locales: [
    { value: 'ar', rtl: true, default: true },
    { value: 'en', rtl: false },
  ],
  currency: {
    en: { code: 'EGP', label: 'EGP' },
    ar: { code: 'EGP', label: 'جنيه' },
  },
  country: {
    en: { label: 'Egypt', code: 'EG' },
    ar: { label: 'مصر', code: 'EG' },
  },
  flag: 'EG',
  isValidEmail: (value) =>
    /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(value),
  isValidMobileNumber: (value) => {
    const sanitizeNumber = value?.replace(/\s+/g, '');
    // Egypt: +20, 20, or 0, followed by 1 then [0,1,2,5]
    const mobileRegex = /^(?:\+20|20|0)1[0125]\d{8}$/;
    return mobileRegex.test(sanitizeNumber);
  },
  CLASSIFIED_BASE_URL: process.env.NEXT_PUBLIC_CLASSIFIED_BASE_URL,
  ENABLE_GOOGLE_SIGN_IN: true,
  ENABLE_MOBILE_SIGN_IN: true,
  ROUTES: {
    allow: ['*'], // Full access
    block: [], // No restrictions
  },
  remotePatterns: [
    { protocol: 'https', hostname: 'legion-images.hatla2ee.com' },
    { protocol: 'https', hostname: 'legion-images.prelive.eg.hatla2ee.com' },

    {
      protocol: 'https',
      hostname: getCdnWithoutProtocol(CDN_PATH),
    },
  ],
  disabledSections: [],
  spec_visibility: false,
  isReCaptchaEnabled: true,
  ENABLE_SELLABLE_BADGES: true,
  ENABLE_GOOD_DEAL_FILTER: true,
  ENABLE_CREDIT_USAGE: true,
  ENABLE_FACET_CASCADE_REDIRECT: true,
  ENABLE_LEAD_LOGIN_ENFORCEMENT: true,
  USE_MAKE_MODEL__TABS_IMAGES: true,
  ENABLE_LLMS_TXT: true,
  ENABLE_WHATSAPP_OTP_FALLBACK: true,
  helpCenterUrl: {
    en: 'https://help.hatla2ee.com/hc/en-us',
    ar: 'https://help.hatla2ee.com/hc/ar',
  },
};

export default config;
