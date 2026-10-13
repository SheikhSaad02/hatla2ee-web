import { appSections } from '../constants/index.js';
import egConfig from './eg/index.js';
import jordanConfig from './jordan/index.js';
import ksaConfig from './ksa/index.js';
import kuwaitConfig from './kuwait/index.js';
import omanConfig from './oman/index.js';
import qatarConfig from './qatar/index.js';
import uaeConfig from './uae/index.js';
import { ENABLE_OVATION } from '../constants/index.js';

const commonConfig = {
  SET_AD_METRICS: ENABLE_OVATION,
  USE_BRAND_SPRITE: false,
  ENABLE_FACET_CASCADE_REDIRECT: false,
  evaluate_car_cookie: 'carEvaluationDetail',
  authToken: 'ht_access_token',
  legacyAuthToken: 'hatla2ee',
  ENABLE_ADS: process.env.NEXT_PUBLIC_ENABLE_ADS === 'true',
  slotting: {
    usedCars: {
      pageSize: 40,
      turboSlots: 5,
      premiumSlots: 15,
      basicSlots: 20,
    },
  },
};

const tenantConfigs = {
  eg: egConfig,
  ksa: ksaConfig,
  uae: uaeConfig,
  jordan: jordanConfig,
  qatar: qatarConfig,
  oman: omanConfig,
  kuwait: kuwaitConfig,
};

const tenant = process.env.NEXT_PUBLIC_TENANT || 'eg';

const tenantConfig = tenantConfigs[tenant];

const _allowedSections = Object.keys(appSections).reduce((acc, key) => {
  const section = appSections[key];
  acc[section] = !tenantConfig.disabledSections.includes(section);
  return acc;
}, {});

const isSectionEnabled = (section) => !!_allowedSections[section];

const configs = { ...commonConfig, ...tenantConfig };

const defaultLocale = configs.locales.find((locale) => locale.default).value;

export { tenant, isSectionEnabled, defaultLocale };
export default configs;
