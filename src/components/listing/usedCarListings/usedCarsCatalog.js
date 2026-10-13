import CarouselSection from '@/components/common/carouselSection/carouselSection';
import LinkWithIcon from '@/components/common/linkWithIcon/linkWithIcon';
import { cn } from '@/utils';
import { ChevronRightIcon } from 'lucide-react';
import { getLocale, getTranslations } from 'next-intl/server';
import ListingCard from '../listingCard';
import NextLink from '@/components/common/nextLink';
import TrackAdMetrics from '@/components/adMetrics/track-ad-metrics';
import { PAGE_SECTIONS } from '@/services/analyticsService/constants';
import ViewAllLink from '@/components/common/viewAllLink/viewAllLink';
import AdImpressionTracker from '@/components/common/adImpressionTracker/adImpressionTracker';
import { listingJumpLinks } from '@/data/detail';
import { getRecentUsedCarsCached } from '@/services/elasticsearch/listings-service';

const UsedCarsCatalog = async ({
  href,
  make,
  model,
  year,
  title,
  titleAsHref,
  rootClass,
  linkLabel,
  carPurposeTitle = 'Used Car For Sale',
  queryParams = {},
  pageType = '',
  pageSection = PAGE_SECTIONS?.EXPLORE_USED_CARS,
  anchorId = listingJumpLinks.SAME_BUDGET,
  itemBasis = 'basis-[70%] sm:basis-[60%] md:basis-[40%] lg:basis-[26%]',
}) => {
  const t = await getTranslations({ namespace: 'home' });
  const commonT = await getTranslations({ namespace: 'common' });
  const locale = await getLocale();

  const carList = await getRecentUsedCarsCached({
    make: make,
    model: model,
    year: year,
    queryParams,
  });
  const minNumberOfListings = 4;

  return (
    carList?.length > 0 && (
      <div
        id={anchorId}
        className={cn('gap-3 lg:gap-4 flex flex-col', rootClass)}
      >
        <AdImpressionTracker listings={carList} pageType={pageType} />
        <div className="flex justify-between items-center">
          {titleAsHref ? (
            <NextLink
              href={titleAsHref}
              title={title}
              className="sectionHeading mb-0"
            >
              {title}
            </NextLink>
          ) : (
            <h2 className="sectionHeading mb-0">{title}</h2>
          )}

          {carList?.length >= minNumberOfListings && (
            <ViewAllLink
              href={
                href ||
                `/car${make ? `/${make}` : ''}${model ? `/${model}` : ''}`
              }
              title={linkLabel || commonT('View All Used Cars for Sale')}
              gaEvent="view_all_link_click"
              pageType={pageType}
              pageSection={pageSection}
            />
          )}
        </div>
        <CarouselSection
          className="h-full w-full"
          itemBasis={itemBasis}
          pageType={pageType}
          pageSection={pageSection}
        >
          {carList?.map((item, index) => (
            <ListingCard
              key={`info-${index}`}
              gaEvent={'classifieds_listing_click'}
              item={item}
              carPurposeTitle={t(carPurposeTitle)}
              locale={locale}
              pageSection={pageSection}
              pageType={pageType}
            />
          ))}
        </CarouselSection>
        <TrackAdMetrics adMetrics={carList} />
      </div>
    )
  );
};

export default UsedCarsCatalog;
