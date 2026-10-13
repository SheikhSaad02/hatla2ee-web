import tenantData from '@tenantData';
import { isSectionEnabled } from '@/configs';
import { appSections } from '@/constants';

const getNewVehiclesSortFieldMapping = (isModalLevelAds) => ({
  price_asc: {
    [isModalLevelAds ? 'sort[min_official_price]' : 'sort[price]']: 'asc',
  },
  price_desc: {
    [isModalLevelAds ? 'sort[min_official_price]' : 'sort[price]']: 'desc',
  },
  updated_at_asc: { 'sort[updated_at]': 'asc' },
  updated_at_desc: { 'sort[updated_at]': 'desc' },
});

const SORT_FIELD_MAPPING = {
  updated_at_desc: [{ latest_product_application_date: 'desc' }],
  updated_at_asc: [{ latest_product_application_date: 'asc' }],
  price_asc: [{ price: 'asc' }],
  price_desc: [{ price: 'desc' }],
  year_desc: [{ year: 'desc' }],
  year_asc: [{ year: 'asc' }],
  km_asc: [{ km: 'asc' }],
  km_desc: [{ km: 'desc' }],
  popular: [
    { latest_product_application_date: 'desc' }, // then by created date descs
  ],
};

const filterKeysMappings = {
  city: 'location',
  body: 'body_type',
  fuel: 'fuel_type',
  color: 'exterior_color',
};

const commonFilters = {
  transmission: [
    {
      label: 'Automatic',
      label_l1: 'أتوماتيك',
      slug: 'automatic',
      id: 2,
    },
    {
      label: 'Manual',
      label_l1: 'مانيوال',
      slug: 'manual',
      id: 1,
    },
  ],
};

const usedCarsCommonFilters = {
  badges: [
    {
      slug: 'factory-paint',
      label: 'Factory Paint',
      label_l1: 'فابريكا بالكامل',
    },
    { slug: 'first-owner', label: 'First Owner', label_l1: 'مالك أول' },
    { slug: 'no-accidents', label: 'No Accidents', label_l1: 'بدون حوادث' },
    {
      slug: 'agency-maintained',
      label: 'Agency Maintained',
      label_l1: 'صيانات توكيل',
    },
    {
      slug: 'personal-use',
      label: 'Personal Use',
      label_l1: 'استعمال شخصي',
    },
    { slug: 'new-tires', label: 'New Tires', label_l1: 'كاوتش جديد' },
    {
      slug: 'valid-license',
      label: 'Valid License',
      label_l1: 'رخصة سارية',
    },
  ],
  specialConditions: [
    {
      key: 'low-mileage',
      label: 'Low KM',
      slug: 'kasr-zero',
      link: '/car/kasr-zero',
      hrefTitle: 'Low KM cars for sale',
    },
    {
      key: 'financed',
      label: 'Financed',
      slug: 'financed',
      link: '/car/used-car-financed',
      hrefTitle: 'Financed used cars',
    },
    ...(isSectionEnabled(appSections.IMPORTED)
      ? [
          {
            key: 'imported',
            slug: 'imported',
            label: 'Imported Car',
            hrefTitle: 'Buy imported cars in Egypt',
            link: '/imported-car',
          },
        ]
      : []),
    // {
    //   key: 'electric',
    //   slug: 'electric',
    //   label: 'Electric Cars',
    //   hrefTitle: 'Used Electric cars',
    //   link: '/car/electric',
    // },
    {
      key: 'taxi',
      label: 'Taxi',
      slug: 'taxi',
      hrefTitle: 'Taxi for sale',
      link: '/car/taxi',
    },
    {
      key: 'classic',
      slug: 'classic',
      label: 'Classic',
      hrefTitle: 'Classic cars for sale in Egypt',
      link: '/car/classic',
    },
    {
      key: 'disabled',
      slug: 'disabled',
      label: 'Disabled',
      hrefTitle: 'Buy Disabled cars in Egypt',
      link: '/car/disabled',
    },
  ],
  sortby: [
    {
      label: 'popular',
      slug: 'popular',
      isDefault: true,
    },
    {
      label: 'updated_at_desc',
      slug: 'updated_at_desc',
    },
    {
      label: 'updated_at_asc',
      slug: 'updated_at_asc',
    },
    {
      label: 'price_asc',
      slug: 'price_asc',
    },
    {
      label: 'price_desc',
      slug: 'price_desc',
    },
    {
      slug: 'year_desc',
      label: 'year_desc',
    },
    {
      label: 'year_asc',
      slug: 'year_asc',
    },
    {
      label: 'km_desc',
      slug: 'km_desc',
    },
    {
      label: 'km_asc',
      slug: 'km_asc',
    },
  ],
  condition: [
    {
      key: 'used',
      label: 'used_cars',
      url: '/car',
      slug: 'used',
      id: 'used',
    },
    {
      key: 'new',
      label: 'new_cars',
      url: '/new-car',
      slug: 'new',
      id: 'new',
    },
  ],
  // Regional spec (LP-5499). Static frontend list per the ticket options.
  // Slugs must match the backend `spec.slug` values emitted by LP-5355.
  spec: [
    { label: 'GCC - Saudi Spec', label_l1: 'خليجي سعودي', slug: 'gcc-saudi', id: 'gcc-saudi' },
    { label: 'GCC - Non-Saudi Spec', label_l1: 'خليجي غير سعودي', slug: 'gcc-non-saudi', id: 'gcc-non-saudi' },
    { label: 'Canadian', label_l1: 'كندي', slug: 'canadian', id: 'canadian' },
    { label: 'American', label_l1: 'أمريكي', slug: 'american', id: 'american' },
    { label: 'European', label_l1: 'أوروبي', slug: 'european', id: 'european' },
    { label: 'Japanese', label_l1: 'ياباني', slug: 'japanese', id: 'japanese' },
    { label: 'Korean', label_l1: 'كوري', slug: 'korean', id: 'korean' },
    { label: 'Chinese', label_l1: 'صيني', slug: 'chinese', id: 'chinese' },
    { label: 'Other', label_l1: 'أخرى', slug: 'other', id: 'other' },
  ],
};

const newCarsCommonFilters = {
  transmission: [
    {
      label: 'Automatic',
      slug: 'automatic',
      id: 2,
    },
    {
      label: 'Manual',
      slug: 'manual',
      id: 1,
    },
  ],
  sortby: [
    {
      label: 'updated_at_desc',
      slug: 'updated_at_desc',
    },
    {
      label: 'updated_at_asc',
      slug: 'updated_at_asc',
    },
    {
      label: 'price_asc',
      slug: 'price_asc',
      isDefault: true,
    },
    {
      label: 'price_desc',
      slug: 'price_desc',
    },
  ],
};

const DEFAULT_SORT = usedCarsCommonFilters.sortby.find(
  (item) => !!item?.isDefault,
);

const NEW_VEHICLES_DEFAULT_SORT = newCarsCommonFilters.sortby.find(
  (item) => !!item?.isDefault,
);

const usedListingsFilterData = {
  ...commonFilters,
  ...usedCarsCommonFilters,
  ...tenantData.usedListingsFilterData,
};

const newListingsFilterData = {
  ...commonFilters,
  ...tenantData.newListingsFilterData,
  ...newCarsCommonFilters,
};

const commonFilterData = {
  getNewVehiclesSortFieldMapping,
  NEW_VEHICLES_DEFAULT_SORT,
  SORT_FIELD_MAPPING,
  DEFAULT_SORT,
  filterKeysMappings,
  usedListingsFilterData,
  newListingsFilterData,
};

export default commonFilterData;
