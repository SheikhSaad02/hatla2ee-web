const SCHEMA = 'https://schema.org';

const IN_STOCK = `${SCHEMA}/InStock`;
const OUT_OF_STOCK = `${SCHEMA}/OutOfStock`;
const SOLD_OUT = `${SCHEMA}/SoldOut`;
const LIVE_DISPOSITION = 'live';

const SLUG_MAPS = {
  fuel: {
    diesel: `${SCHEMA}/Diesel`,
    electric: `${SCHEMA}/Electric`,
    hybrid: `${SCHEMA}/Hybrid`,
    'plug-in-hybrid': `${SCHEMA}/Hybrid`,
    gas: `${SCHEMA}/LPG`,
    'natural-gas': `${SCHEMA}/LPG`,
  },
  transmission: {
    automatic: `${SCHEMA}/AutomaticTransmission`,
    manual: `${SCHEMA}/ManualTransmission`,
  },
  condition: {
    new: `${SCHEMA}/NewCondition`,
    used: `${SCHEMA}/UsedCondition`,
  },
};

export function mapSchemaOrgCarField(field, value) {
  if (value == null || value === '') return undefined;
  const slug = String(value).toLowerCase().trim();
  return SLUG_MAPS[field]?.[slug];
}

export function mapSchemaOrgAvailability({ soldAt, dispositionSlug } = {}) {
  if (soldAt) return SOLD_OUT;
  if (dispositionSlug && dispositionSlug !== LIVE_DISPOSITION) {
    return OUT_OF_STOCK;
  }
  return IN_STOCK;
}
