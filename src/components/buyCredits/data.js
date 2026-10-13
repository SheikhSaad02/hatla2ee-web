const AD_PRODUCTS = [
  {
    id: 'silver',
    nameKey: 'products.silver.name',
    headlineKey: 'products.silver.headline',
    descKey: 'products.silver.desc',
    points: [
      'products.silver.point1',
      'products.silver.point2',
      'products.silver.point3',
    ],
    tagVariant: 'secondaryGradient',
    glow: null,
  },
  {
    id: 'premium',
    nameKey: 'products.premium.name',
    headlineKey: 'products.premium.headline',
    descKey: 'products.premium.desc',
    points: [
      'products.premium.point1',
      'products.premium.point2',
      'products.premium.point3',
    ],
    tagVariant: 'primaryGradient',
    glow: '#F7D319',
  },
  {
    id: 'turbo',
    nameKey: 'products.turbo.name',
    headlineKey: 'products.turbo.headline',
    descKey: 'products.turbo.desc',
    points: [
      'products.turbo.point1',
      'products.turbo.point2',
      'products.turbo.point3',
    ],
    tagVariant: 'turboGradient',
    glow: '#D43234',
  },
  {
    id: 'pump',
    nameKey: 'products.pump.name',
    headlineKey: 'products.pump.headline',
    descKey: 'products.pump.desc',
    points: [
      'products.pump.point1',
      'products.pump.point2',
      'products.pump.point3',
    ],
    tagVariant: 'pump',
    glow: '#3160A5',
  },
];

const PAGE_STATS = [
  { value: '1M+', labelKey: 'stats.label1' },
  { value: '100+', labelKey: 'stats.label2' },
  { value: '2.6M+', labelKey: 'stats.label3' },
  { value: '1.7M+', labelKey: 'stats.label4' },
];

export function getAdProducts() {
  return AD_PRODUCTS;
}

export function getPageStats() {
  return PAGE_STATS;
}
