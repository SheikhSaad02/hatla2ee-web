import { getAsset } from '@/utils/general';

export const triggerSpriteMapping = {
  make: <span className="moreIcon filterTabs brands"></span>,
  body: <span className="moreIcon filterTabs bStyle"></span>,
  'price-range': <span className="moreIcon filterTabs prices"></span>,
  'special-conditions': (
    <span className="moreIcon filterTabs sCondition"></span>
  ),
  cc: <span className="moreIcon filterTabs ccRange"></span>,
  info: <span className="moreIcon filterTabs modelInfo"></span>,
  year: <span className="moreIcon filterTabs modelYear"></span>,
  model: <span className="moreIcon filterTabs modelModel"></span>,
  variant: <span className="moreIcon filterTabs modelClass"></span>,
  city: <span className="moreIcon filterTabs modelCity"></span>,
  subplace: <span className="moreIcon filterTabs modelSubplace"></span>,
};

export const parentClasses = {
  body: 'moreIcon bodyStyles',
  specialCondition: 'moreIcon specialCondition',
  fuel: 'moreIcon fuelType',
};

export const getSpriteVariables = (isMobile) => ({
  '--more-icon': `url(${getAsset('/assets/tabSpriteGrayed-new.webp')})`,
  '--vehicle-container': `url(${getAsset(
    '/assets/sprite-images/vehicle-types-more-new.webp',
  )})`,
  ...(isMobile && {
    '--footer-nav': `url(${getAsset('/assets/footer/footer-nav-New.webp')})`,
  }),
});
