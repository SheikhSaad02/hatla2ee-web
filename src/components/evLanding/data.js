import { appPaths } from '@/constants';

export const EV_USED_CARS_SEARCH_URL = `${appPaths.usedCarsListingsSearch}?fuel=33_and_35`;

export const EV_FUEL_OPTIONS = [
  { value: 33, slug: 'electric', label: 'Electric' },
  { value: 35, slug: 'plug-in-hybrid', label: 'Plug-in Hybrid' },
];

export const EV_FUEL_FILTER = EV_FUEL_OPTIONS.map((o) => ({ slug: o.slug }));

// Make links point at the /car/:make/:fuel pretty page, which only exists for a
// single fuel type — so they scope to Electric only instead of the EV preset.
export const EV_MAKE_SCOPE_FILTERS = {
  fuel: { id: EV_FUEL_OPTIONS[0].value, slug: EV_FUEL_OPTIONS[0].slug },
};

export const EV_NEW_CAR_FUEL_SLUGS = [
  'electric',
  'plug-in-hybrid',
  'reev',
  'phev',
];

export const EV_NEW_CAR_FUEL_PARAM = {
  'f[variant]': 'notnull',
  'f[fuel_type.slug]': EV_NEW_CAR_FUEL_SLUGS,
  'sort[price]': 'asc',
  'sort[created_at]': undefined,
  per_page: 20,
};
export const EV_NEW_CARS_GUIDE_URL = '/new-car';

export const EV_LOW_MAINTENANCE_CARDS = [
  {
    titleKey: 'leaveFuelTitle',
    descriptionKey: 'leaveFuelDesc',
    image: '/assets/ev-images/fuel_costs.webp',
  },
  {
    titleKey: 'customsTitle',
    descriptionKey: 'customsDesc',
    image: '/assets/ev-images/zero_customs.webp',
  },
  {
    titleKey: 'lessMechanicTitle',
    descriptionKey: 'lessMechanicDesc',
    image: '/assets/ev-images/less_time.webp',
  },
];

export const EV_QUICK_CHIPS = [40, 60, 80, 100, 150];

export const EV_CALCULATOR = {
  avg_mileage: 12,
  petrol_price: 22.25,
  ev_consumption: 18,
  ev_rate: 2.04,
  minKm: 20,
  maxKm: 200,
  step: 1,
  defaultKm: 80,
};

export const EV_TYPE_CARDS = [
  {
    type: 'ev',
    title: 'evTitle',
    description: 'evDesc',
    fuel: 'electric',
    imageBase: 'ev',
  },
  {
    type: 'reev',
    title: 'reevTitle',
    description: 'reevDesc',
    fuel: 'reev',
    imageBase: 'reev',
  },
  {
    type: 'phev',
    title: 'phevTitle',
    description: 'phevDesc',
    fuel: 'phev',
    imageBase: 'phev',
  },
];

export const EV_CHARGING_CENTER = { lat: 30.0444, lng: 31.2357 };
export const EV_CHARGING_RADIUS_M = 25000;

export const EV_CHARGING_STATIONS = [
  { id: 'mall-of-egypt', name: 'Mall of Egypt Hub', area: '6th of October, Giza', distance: '0.8 km', rating: 4.8, power: '150 kW DC Fast', price: '2.5 EGP/kWh', wait: '~0 min', pos: { lat: 29.9720, lng: 31.0170 } },
  { id: 'smart-village', name: 'Smart Village EV Point', area: '6th of October, Giza', distance: '3.1 km', rating: 4.6, power: '60 kW DC', price: '2.2 EGP/kWh', wait: '~5 min', pos: { lat: 30.0710, lng: 31.0170 } },
  { id: 'maadi-grand', name: 'Maadi Grand Mall', area: 'Maadi, Cairo', distance: '9.4 km', rating: 4.7, power: '120 kW DC Fast', price: '2.5 EGP/kWh', wait: '~10 min', pos: { lat: 29.9600, lng: 31.2590 } },
  { id: 'heliopolis', name: 'Heliopolis Ultra-Fast', area: 'Heliopolis, Cairo', distance: '14 km', rating: 4.5, power: '180 kW DC Fast', price: '2.8 EGP/kWh', wait: '~2 min', pos: { lat: 30.0880, lng: 31.3280 } },
  { id: 'nac-gov', name: 'NAC Government Hub', area: 'New Capital', distance: '42 km', rating: 4.9, power: '150 kW DC Fast', price: '2.4 EGP/kWh', wait: '~0 min', pos: { lat: 30.0080, lng: 31.6820 } },
];

export const KM_RANGE_QUERY_FIELD = 'battery_range.value';

export const BATTERY_CAPACITY_QUERY_FIELD = 'battery_capacity.value';

export const BATTERY_CAPACITY_OPTIONS = [
  { id: 1, slug: 'under-40', label: 'Under 40 kWh', label_l1: 'أقل من 40 كيلوواط', value: 40, op: 'lt' },
  { id: 2, slug: 'under-70', label: 'Under 70 kWh', label_l1: 'أقل من 70 كيلوواط', value: 70, op: 'lt' },
  { id: 3, slug: 'under-100', label: 'Under 100 kWh', label_l1: 'أقل من 100 كيلوواط', value: 100, op: 'lt' },
  { id: 4, slug: 'under-130', label: 'Under 130 kWh', label_l1: 'أقل من 130 كيلوواط', value: 130, op: 'lt' },
  { id: 5, slug: 'over-130', label: 'Over 130 kWh', label_l1: 'أكثر من 130 كيلوواط', value: 130, op: 'gt' },
];

export const KM_RANGE_TAB_BUCKETS = [
  { slug: 'up-to-200', label: 'Up to 200 km', label_l1: 'حتى 200 كم', value: 200, op: 'lt' },
  { slug: 'up-to-400', label: 'Up to 400 km', label_l1: 'حتى 400 كم', value: 400, op: 'lt' },
  { slug: 'up-to-600', label: 'Up to 600 km', label_l1: 'حتى 600 كم', value: 600, op: 'lt' },
  { slug: 'up-to-800', label: 'Up to 800 km', label_l1: 'حتى 800 كم', value: 800, op: 'lt' },
  { slug: 'up-to-1000', label: 'Up to 1000 km', label_l1: 'حتى 1000 كم', value: 1000, op: 'lt' },
  { slug: 'over-1000', label: 'Over 1000 km', label_l1: 'أكثر من 1000 كم', value: 1000, op: 'gt' },
];

export async function getEvFaqItems(locale) {
  const { getTranslations } = await import('next-intl/server');
  const t = await getTranslations({ locale, namespace: 'evLanding' });

  return {
    sectionTitle: t('faqTitle'),
    items: [
      { id: 'best-brands', trigger: t('faq_1_question'), content: t('faq_1_answer') },
      { id: 'cost', trigger: t('faq_2_question'), content: t('faq_2_answer') },
      { id: 'charging', trigger: t('faq_3_question'), content: t('faq_3_answer') },
      { id: 'range', trigger: t('faq_4_question'), content: t('faq_4_answer') },
      { id: 'used-check', trigger: t('faq_5_question'), content: t('faq_5_answer') },
      { id: 'battery-life', trigger: t('faq_6_question'), content: t('faq_6_answer') },
    ],
  };
}
