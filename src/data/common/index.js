import { TurboBadgeIcon } from '@/icons/basicSvgs';

export const tagList = [
  {
    title: 'Turbo',
    slug: 'turbo',
    tagColor: 'color-secondary-700',
    textColor: 'color-primary-50',
    variant: 'turboGradient',
    icon: <TurboBadgeIcon />,
  },
  {
    title: 'Premium',
    slug: 'premium',
    tagColor: 'color-secondary-700',
    textColor: 'color-primary-50',
    variant: 'secondaryGradient',
  },
  {
    title: 'Featured',
    slug: 'featured',
    tagColor: 'color--gray-600/40',
    textColor: 'color-primary-50',
    variant: 'glassy',
  },
  {
    title: 'Imported',
    slug: 'imported',
    tagColor: 'color--gray-600/40',
    textColor: 'color-primary-50',
    variant: 'glassy',
    href: '/imported-car',
  },

  {
    title: 'Financed',
    slug: 'financed',
    tagColor: 'color--gray-600/40',
    textColor: 'color-primary-50',
    variant: 'glassy',
    href: '/car/used-car-financed',
  },
];

export const showRooms = (t) => [
  {
    label: t('Authorized Car Dealers'),
    value: 'authorized',
    path: '/showroom-authorized',
  },
  { label: t('Used Cars Showroom'), value: 'used', path: '/showroom' },
  { label: t('New Cars Showroom'), value: 'new', path: '/showroom-new' },
  { label: t('Electric Cars Showroom'), value: 'ev', path: '/showroom-electric' },
];
export const yearsList = () => {
  const currentYear = new Date().getFullYear();
  const years = [];
  for (let year = currentYear + 1; year >= 1950; year--) {
    years.push({
      label: String(year),
      value: String(year),
      slug: String(year),
    });
  }
  return years;
};
