export const variantsTableColumns = [
  {
    key: 'overview',
    header: 'Classes',
    component: 'ImageWithContent',
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
  {
    key: 'minDeposit',
    header: 'Min Deposit',
    component: 'Price',
  },
  {
    key: 'minInstallment',
    header: 'Min installment',
    component: 'Price',
  },
  {
    key: 'actionButton',
    header: 'null',
    component: 'CompareButton',
  },
];

export const variantsPriceChangesColumns = [
  {
    key: 'overview',
    header: 'Classes',
    component: 'LinkWithIcon',
  },
  {
    key: 'officialPrice',
    header: 'New Price',
    component: 'Price',
  },
  {
    key: 'oldPrice',
    header: 'Old Price',
    component: 'Price',
  },
  {
    key: 'priceChange',
    header: 'Change in Official Price',
    component: 'PriceChange',
  },
];
