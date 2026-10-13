export const usedListingsFilterData = {
  priceRanges: [
    {
      key: '2000',
      label: '2,000',
      value: 2000,
      url: '/car/price-limit/2000',
      slug: 2000,
    },
    {
      key: '3000',
      label: '3,000',
      value: 3000,
      url: '/car/price-limit/3000',
      slug: 3000,
    },
    {
      key: '4000',
      label: '4,000',
      value: 4000,
      url: '/car/price-limit/4000',
      slug: 4000,
    },
    {
      key: '5000',
      label: '5,000',
      value: 5000,
      url: '/car/price-limit/5000',
      slug: 5000,
    },
    {
      key: '7000',
      label: '7,000',
      value: 7000,
      url: '/car/price-limit/7000',
      slug: 7000,
    },
    {
      key: '10000',
      label: '10,000',
      value: 10000,
      url: '/car/price-limit/10000',
      slug: 10000,
    },
  ],
  //double check if we need this

  citiesForBodyTypes: [
    {
      level: 2,
      id: 102,
      label: 'Muscat',
      label_l1: 'مسقط',
      slug: 'muscat',
    },
    {
      level: 2,
      id: 103,
      label: 'Salalah',
      label_l1: 'صلالة',
      slug: 'salalah',
    },
    {
      level: 2,
      id: 104,
      label: 'Sohar',
      label_l1: 'صحار',
      slug: 'sohar',
    },
    {
      level: 2,
      id: 105,
      label: 'Ibri',
      label_l1: 'عبري',
      slug: 'ibri',
    },
    {
      level: 2,
      id: 106,
      label: 'Nizwa',
      label_l1: ' نزوى',
      slug: 'nizwa',
    },
    {
      level: 2,
      id: 107,
      label: 'Sur',
      label_l1: 'صور',
      slug: 'sur',
    },
  ],

  citiesToOmit: [{ id: 2000, level: 1, slug: 'oman' }],
};

export const newListingsFilterData = {
  //check if we can completely remove
  priceRanges: [],
};
