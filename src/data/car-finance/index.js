export const CAMPAIGN_ID_DETAIL_PAGE = 943;
export const CAMPAIGN_ID_FINANCE_LANDING = 519;

export const MIN_FINANCING_YEAR = 2021;
export const CAR_PRICE_THRESHOLD = 600000;
export const CAR_PRICE_UPPER_THRESHOLD = 20000000;
export const DEPOSIT_PERCENT_LOWER_THRESHOLD_NEW_CAR = 0;
export const DEPOSIT_PERCENT_LOWER_THRESHOLD_USED_CAR = 25;
export const DEPOSIT_PERCENT_UPPER_THRESHOLD = 95;
// New cars qualify for the lower rate once the deposit reaches this percentage
export const NEW_CAR_LOW_DEPOSIT_THRESHOLD = 15;
export const INTEREST_RATE_NEW_CAR = 13.5;
export const INTEREST_RATE_NEW_CAR_LOW_DEPOSIT = 18;
export const INTEREST_RATE_USED_CAR = 14.5;

export const yearsOptions = Array.from({ length: 5 }, (_, i) => ({
  key: `${i + 1}`,
  label: `${i + 1}`,
}));
export const getConditionOptions = (t) => [
  {
    key: 'new',
    label: t('Finance a New Car'),
    slug: 'new',
  },
  {
    key: 'used',
    label: t('Finance a Used Car'),
    slug: 'used',
  },
];
