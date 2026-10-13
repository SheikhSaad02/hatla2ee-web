export const usedCarPriceCols = [
  {
    key: 'title',
    header: 'Model',
    component: 'Link',
    className: 'text-primary',
    props: { style: { width: '30%' } },
  },
  {
    key: 'avgPrice',
    header: 'Average Price',
    component: 'Price',
  },
  {
    key: 'minPrice',
    header: 'Minimum Price',
    component: 'Price',
  },
  {
    key: 'maxPrice',
    header: 'Maximum Price',
    component: 'Price',
  },
];
