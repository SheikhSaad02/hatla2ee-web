import React from 'react';
import Text from '../text';
import CarouselSection from '../carouselSection/carouselSection';
import DifferenceWithOtherClassesCard from './differenceWithOtherClassesCard';
import { fetchDifferenceWithOtherClasses } from '@/apis/new-car';
import ClickEventTracker from '@/services/analyticsService/clickTracker';
import {
  PAGE_SECTIONS,
  PAGE_TYPES,
} from '@/services/analyticsService/constants';
import { listingJumpLinks } from '@/data/detail';

const DifferenceWithOtherClasses = async ({
  title,
  variantId,
  pageType = PAGE_TYPES.NEW_VEHICLE_DETAIL,
}) => {
  const classes = await fetchDifferenceWithOtherClasses(variantId);

  return (
    classes?.length > 0 && (
      <div id={listingJumpLinks.DIFFERENCE_OTHER_CLASSES}>
        <Text as="h2" className="sectionHeading">
          {title}
        </Text>
        <CarouselSection
          // itemBasis="md:basis-[30%] lg:basis-[27%] xl:basis-[23%]"
          itemBasis="basis-[70%] sm:basis-[60%] md:basis-[40%] lg:basis-[27%]"
          pageSection={PAGE_SECTIONS.DIFFERENCE_WITH_OTHER_CLASSES}
        >
          {!!classes?.length &&
            classes?.map((item, index) => {
              return (
                <ClickEventTracker
                  gaEvent="newly_launched_cars_click"
                  pageType={pageType}
                  pageSection={PAGE_SECTIONS.DIFFERENCE_WITH_OTHER_CLASSES}
                  item={item}
                >
                  <DifferenceWithOtherClassesCard
                    key={item?.variant?.id || index}
                    href={item?.href}
                    item={item}
                    price={item?.price}
                    img={item?.images?.[0]?.medium}
                    features={item?.list}
                    className="flex flex-col h-full w-full"
                  />
                </ClickEventTracker>
              );
            })}
        </CarouselSection>
      </div>
    )
  );
};

export default DifferenceWithOtherClasses;
