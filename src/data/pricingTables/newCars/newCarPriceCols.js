export const newCarPriceColumns = [
  {
    key: 'overview',
    header: 'Model',
    component: 'ImageWithContent',
    props: { style: { width: '50%' } },
  },
  {
    key: 'officialPrice',
    header: 'Official Price',
    component: 'Price',
    fallbackText: 'Price Not Available',
  },
  {
    key: 'marketPrice',
    header: 'Market Price',
    component: 'PriceRange',
  },
];

export const newCarPriceChangesColumns = [
  {
    key: 'overview',
    header: 'Classes',
    component: 'ImageWithContent',
  },
  {
    key: 'oldPrice',
    header: 'Old Price',
    component: 'Price',
  },
  {
    key: 'newPrice',
    header: 'New Price',
    component: 'Price',
  },

  {
    key: 'priceChange',
    header: 'Change in Official Price',
    component: 'PriceChange',
  },
];
