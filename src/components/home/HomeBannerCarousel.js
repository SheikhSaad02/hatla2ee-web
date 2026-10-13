import React from 'react';
import Carousel from '../common/carousel/carousel';
import SellCarBanner from '../common/sellCarBanner.js';
import FinancingBannerBanner from '../common/financingBanner.js';
import { isSectionEnabled } from '@/configs';
import { appSections } from '@/constants';

const HomeBannerCarousel = ({ prioritizeFirstBanner = false }) => {
  const items = [
    ...(isSectionEnabled(appSections.FINANCING) ? [FinancingBannerBanner] : []),
    SellCarBanner,
  ];

  return (
    <Carousel
      itemBasis="basis-[100%]"
      carouselOpts={{ dragFree: false }}
      showDots
      showArrows={false}
    >
      {items.map((Cmp, index) => (
        <Cmp key={index} prioritizeImage={prioritizeFirstBanner && index === 0} />
      ))}
    </Carousel>
  );
};

export default HomeBannerCarousel;
