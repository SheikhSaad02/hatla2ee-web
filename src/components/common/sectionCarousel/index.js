import React from 'react';
import { cn } from '@/utils';
import CarouselSection from '@/components/common/carouselSection/carouselSection';
import ViewAllLink from '../viewAllLink/viewAllLink';

const SectionCarousel = ({
  title,
  viewAllHref,
  viewAllLabel,
  className,
  itemBasis = 'basis-[70%] sm:basis-[60%] md:basis-[40%] lg:basis-[26%]',
  data,
  component: ItemComponent,
  getItemProps,
  gaEvent,
  pageType,
  pageSection,
}) => {
  if (!data?.length) return null;

  return (
    <div className={cn('gap-3 lg:gap-4 flex flex-col', className)}>
      <div className="flex justify-between items-center">
        <h2 className="sectionHeading mb-0">{title}</h2>
        {viewAllHref && viewAllLabel && (
          <ViewAllLink
            href={viewAllHref}
            title={viewAllLabel}
            gaEvent={gaEvent}
            pageType={pageType}
            pageSection={pageSection}
          />
        )}
      </div>

      <CarouselSection className="h-full w-full" itemBasis={itemBasis}>
        {data.map((item, index) => {
          const props = {
            ...(getItemProps ? getItemProps(item, index) : item),
          };
          const { key = index, ...rest } = props;
          return <ItemComponent key={key} {...rest} />;
        })}
      </CarouselSection>
    </div>
  );
};

export default SectionCarousel;
