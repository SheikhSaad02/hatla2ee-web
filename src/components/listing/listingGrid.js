import { twMerge } from 'tailwind-merge';
import { getLocale, getTranslations } from 'next-intl/server';
import ListingCard from './listingCard';
import Pagination from '../common/pagination';
import ListingNotFound from '../common/errors/listingNotFound';
import { cn } from '@/utils';
import ListingBanner from '../common/listingBanner/listingBanner';
import { MultilineCarousel } from '../common/carousel/multlineCarousel';
import Text from '../common/text';
import {
  combinedGrid,
  getDynamicLabel,
  getFillerCardPlacement,
  FILLER_CARD_MAX_SPAN,
  LISTING_GRID_COLUMNS,
} from '@/utils/used-cars/listings';
import GridSlide from '@/filters/gridSlide';
import { PAGE_TYPES } from '@/services/analyticsService/constants';
import AdBanner from '../googleAd/adBanner';
import { getListingAdUnits } from '../googleAd/adsConfig';
import { PAGE_SECTIONS } from '@/services/analyticsService/constants';
import { appPaths } from '@/constants';
import AdImpressionTracker from '@/components/common/adImpressionTracker/adImpressionTracker';

const ListingGrid = async ({
  showQuickFiltersWidget = true,
  isMobile,
  quickFilters,
  className,
  data: listings,
  totalCount,
  currentPage,
  useQuery,
  PageSize,
  showSellCarBanner = false,
  isLanding = false,
  isSearch = false,
  showPagination = true,
  CardComponent = ListingCard,
  cardProps,
  pageSection = '',
  pageType = '',
  totalPages,
  showAd = false,
  prioritizeFirstImage = false,
  inlineSlots = [],
}) => {
  const locale = await getLocale();
  const homeT = await getTranslations({ locale, namespace: 'home' });
  const t = await getTranslations({ locale, namespace: 'common' });
  const AD_UNITS = getListingAdUnits(isMobile, locale);
  let quickFilter;
  if (quickFilters?.shouldHideWidget() || !showQuickFiltersWidget) {
    quickFilter = [];
  } else quickFilter = await quickFilters?.getTabs();

  // Mobile appends the banner after the grid; desktop threads it into the
  // middle row so it fills the cells the listings leave empty.
  const fillerCard =
    showSellCarBanner && !isMobile
      ? getFillerCardPlacement({
          itemCount: listings?.length,
          columns: LISTING_GRID_COLUMNS,
          maxSpan: FILLER_CARD_MAX_SPAN,
        })
      : null;

  const renderSlot = (listingIndex) => {
    // An inline slot is positioned by grid cell, not by listing, and the
    // filler card takes cells too, so a slot renders once that many cells
    // are filled.
    const cellsFilled =
      fillerCard && fillerCard.position <= listingIndex
        ? listingIndex + fillerCard.span
        : listingIndex;
    const slot = inlineSlots.find((s) => s.position === cellsFilled);
    if (!slot) return [];
    return [
      <div
        key={`inline-slot-${slot.position}`}
        className={cn('col-span-full', slot.className)}
      >
        {slot.content}
      </div>,
    ];
  };

  const sellCarBanner = (span) => (
    <ListingBanner
      key="sell-car-banner"
      title={t('Sell Car, Right Away!')}
      description={t(
        'Sell your car faster than ever and reach thousands of buyers in Egypt',
      )}
      button={t('Sell Car Now')}
      redirectTo={appPaths.postListing}
      singleSlot={span === 1}
      className={cn(
        'col-span-full h-full',
        span === 1 && 'md:col-span-1',
        span === 2 && 'md:col-span-2',
      )}
    />
  );

  const renderFillerCard = (position) =>
    fillerCard && position === fillerCard.position
      ? sellCarBanner(fillerCard.span)
      : null;

  const renderMobile = () => {
    const combinedArray = combinedGrid({ listings, quickFilter });
    let listingCount = 0;

    return combinedArray?.map((item, index) => {
      if (item.type === 'filter') {
        const {
          label,
          label_l1,
          value,
          type,
          items,
          rows,
          threshold,
          itemBasis,
          className: itemClassName,
          tabTitle,
          ...rest
        } = item?.value;

        const defaultFilterHeading =
          value === 'info'
            ? getDynamicLabel({ label, label_l1, value, locale, t })
            : `${t('Search by')}  ${getDynamicLabel({
                label,
                label_l1,
                value,
                locale,
                t,
              })}`;

        return (
          <div
            key={`filter-${index}`}
            className="flex flex-col justify-center col-span-full overflow-hidden py-3"
          >
            <Text as="h2" className="sectionHeading">
              {tabTitle?.mobile || defaultFilterHeading}
            </Text>
            <MultilineCarousel
              items={items}
              renderItem={(_item, i) => (
                <GridSlide
                  key={i}
                  index={i}
                  item={_item}
                  type={type}
                  className={itemClassName}
                  page_type={pageType}
                  pageSection={PAGE_SECTIONS.INLINE_FILTER}
                  tabLabel={value}
                />
              )}
              rows={rows}
              itemBasis={itemBasis}
              threshold={threshold}
              showArrows={isMobile ? false : true}
              {...rest}
            />
          </div>
        );
      }

      if (item.type === 'listing') {
        listingCount++;

        return [
          <CardComponent
            key={`listing-${index}`}
            item={item?.value}
            locale={locale}
            pageType={isLanding ? PAGE_TYPES?.USED_CAR_LANDING : pageType}
            pageSection={pageSection}
            gaEvent={'classifieds_listing_click'}
            prioritizeFirstImage={prioritizeFirstImage && listingCount === 1}
            {...cardProps}
          />,
          ...renderSlot(listingCount),
        ];
      }

      return null; // fallback safety
    });
  };

  const renderDesktop = () =>
    listings.map((item, index) => {
      if (
        !isMobile &&
        isLanding &&
        index === 3 &&
        pageSection === PAGE_SECTIONS?.EXPLORE_USED_CARS
      ) {
        return [
          <CardComponent
            key={`info-${index}`}
            item={item}
            locale={locale}
            gaEvent={'classifieds_listing_click'}
            pageType={isLanding ? PAGE_TYPES?.USED_CAR_LANDING : pageType}
            prioritizeFirstImage={prioritizeFirstImage && index === 0}
            {...cardProps}
          />,
          <AdBanner
            key="ad-after-4"
            adConfig={AD_UNITS?.usedCarLandingListingsAd}
            className="col-span-full mx-auto my-8 w-full max-w-full rounded-xl overflow-hidden"
          />,
        ];
      }
      return [
        <CardComponent
          key={`info-${index}`}
          item={item}
          locale={locale}
          gaEvent={'classifieds_listing_click'}
          pageType={isLanding ? PAGE_TYPES?.USED_CAR_LANDING : pageType}
          pageSection={pageSection}
          prioritizeFirstImage={prioritizeFirstImage && index === 0}
          {...cardProps}
        />,
        renderFillerCard(index + 1),
        ...renderSlot(index + 1),
      ];
    });

  return (
    <>
      {!listings?.length ? (
        <div className={cn('flex-1 content-center', className)}>
          <ListingNotFound className="w-full rounded-lg bg-gray-50" />
        </div>
      ) : (
        <div className={twMerge('flex flex-col gap-6', className)}>
          <AdImpressionTracker listings={listings} pageType={pageType} />
          <div
            className={`grid grid-cols-[repeat(auto-fill,minmax(230px,1fr))] auto-rows-max gap-4 lg:gap-y-6`}
          >
            {isMobile && !isLanding ? renderMobile() : renderDesktop()}
            {showSellCarBanner && isMobile && sellCarBanner()}
            {isMobile && showAd && (
              <AdBanner adConfig={AD_UNITS.searchBottomAd} />
            )}
          </div>

          {showPagination && (
            <Pagination
              className="pagination-bar"
              currentPage={currentPage}
              totalCount={totalCount}
              pageSize={PageSize}
              totalPages={totalPages}
              useQuery={useQuery}
            />
          )}
        </div>
      )}
    </>
  );
};

export default ListingGrid;
