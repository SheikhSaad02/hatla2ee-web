import { isSectionEnabled } from '@/configs';
import {
  appPaths,
  appSections,
  SUPPORT_EMAIL,
  CONTACT_SALES_FORM_URL,
} from '@/constants';
import { ContactSalesIcon, MailIcon, TextMsgIcon } from '@/icons/socials';
import { getAsset } from '@/utils/general';
import tenantData from '@tenantData';

const contactData = [
  {
    title: 'Email',
    description: `${SUPPORT_EMAIL}`,
    Icon: MailIcon,
    href: `mailto:${SUPPORT_EMAIL}`,
  },
  {
    title: 'Contact Sales',
    description: 'Get in touch with our sales team',
    Icon: ContactSalesIcon,
    href: CONTACT_SALES_FORM_URL,
    translate: true,
  },
  {
    title: 'Help & Support',
    description: 'Send us your queries!',
    Icon: TextMsgIcon,
    href: appPaths.contactUs,
    translate: true,
  },
];

const serviceList = [
  {
    id: appSections.NEW_CARS_PRICES,
    title: 'New Car Prices',
    description: 'Discover the latest prices on brand new cars',
    image: getAsset('/assets/more/newCarPricesLatest.webp'),
    imageArabic: getAsset('/assets/more/newCarPricesNewArabic.webp'),
    link: '/car/all-prices',
    featured: true,
  },
  {
    id: appSections.USED_CARS_PRICES,
    title: 'Used Car Prices',
    description: 'Get the best deals on reliable used cars',
    image: getAsset('/assets/more/usedCarPricesLatest.webp'),
    link: '/car/used-prices',
  },
  {
    id: appSections.COMPARISON,
    title: 'Car Comparison',
    description: 'Detailed comparison to make the right decision',
    image: getAsset('/assets/more/carComparisonLatest.webp'),
    link: '/new-car/compare',
  },
  {
    id: appSections.MY_MAINTENANCE,
    title: 'My Maintenance',
    description: `Manage and track your car's maintenance`,
    image: getAsset('/assets/more/carMaintainanceLatest.webp'),
    link: `${appPaths.carMaintenance}`,
  },
  {
    id: appSections.FINANCING,
    title: 'Car Financing',
    description: 'Simplified car loans, tailored for you',
    image: getAsset('/assets/more/carFinancingLatest.webp'),
    link: '/car-finance/finance-new-car',
  },
  {
    id: appSections.EVALUTATION,
    title: 'Car Evaluation',
    description: "Know your car's worth with our expert evaluation",
    image: getAsset('/assets/more/carEvaluationLatest.webp'),
    link: '/car/used-prices/evaluate',
  },
  {
    id: appSections.ELECTRIC_CARS,
    title: 'Electric Cars',
    description: 'Explore top EVs, locate chargers, and calculate savings',
    image: getAsset('/assets/more/electricCarsMore.webp'),
    link: appPaths.electricCars,
    isNew: true,
    headerClass: 'relative',
    titleClassName: 'static pe-12 sm:pe-0',
    tagClassName: 'absolute top-4 end-4 sm:static sm:top-auto sm:end-auto',
    style: {
      background:
        'linear-gradient(189.12deg, #FFFFFF 0%, rgba(255, 255, 255, 0.9) 22%, rgba(255, 255, 255, 0) 72%), linear-gradient(0deg, #D3E2F4, #D3E2F4)',
    },
  },
].filter((item) => isSectionEnabled(item.id));

const getDealersTabs = (defaultTab = 'featured') => {
  const tabs = [
    { label: 'Featured Dealers', value: 'featured', path: '' },
    { label: 'Used Cars', value: 'used', path: '/showroom' },
    { label: 'New Cars', value: 'new', path: '/showroom-new' },
    {
      label: 'Authorized Cars',
      value: 'authorized',
      path: '/showroom-authorized',
    },
  ];

  return tabs;

  const defaultTabItem = tabs.find((tab) => tab.value === defaultTab);
  const otherTabs = tabs.filter((tab) => tab.value !== defaultTab);

  return defaultTabItem ? [defaultTabItem, ...otherTabs] : tabs;
};

const dealersTabs = getDealersTabs();

const citiesForHome = tenantData.citiesForHome;

const landingData = {
  contactData,
  dealersTabs,
  getDealersTabs,
  serviceList,
  citiesForHome,
};

export default landingData;
