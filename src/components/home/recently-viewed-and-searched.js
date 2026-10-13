import CarouselSection from '../common/carouselSection/carouselSection';
import { ChevronArrowBubble } from '@/icons';
import ListingCard from '../listing/listingCard';
import RecentSearches from '../common/recentSearches/recentSearches';
import ScrollArea from '../common/scrollArea';
import { transformRecentlySearched } from '@/mappers/listings';
import { useLocale } from 'next-intl';
import { useTranslations } from 'next-intl';
import {
  PAGE_TYPES,
  PAGE_SECTIONS,
} from '@/services/analyticsService/constants';
import { useUser } from '@/providers/user';
import { homeClickEvents } from '@/services/analyticsService/events';
import AdImpressionTracker from '@/components/common/adImpressionTracker/adImpressionTracker';

export default function RecentlyViewedAndSearched({
  recentlyViewed,
  recentlySearched,
  isMobile,
}) {
  const t = useTranslations('home');
  const locale = useLocale();
  const { user } = useUser();
  const commonT = useTranslations('common');
  const recentSearchesData = transformRecentlySearched(
    recentlySearched,
    locale,
    commonT,
  );

  const handleRecentSearchClick = ({ brand, model }) => {
    homeClickEvents.recent_searches_click(
      locale,
      user,
      PAGE_TYPES.HOME,
      brand,
      model,
    );
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[425px_1fr] gap-5">
      {recentlySearched && (
        <div className="flex flex-col">
          <h2 className="sectionHeading">{t('Recent Searches')}</h2>
          <ScrollArea
            className="max-h-[430px]"
            orientation={isMobile ? 'horizontal' : 'vertical'}
          >
            <RecentSearches
              className="h-full w-full min-h-[390px]"
              icon={<ChevronArrowBubble />}
              list={recentSearchesData}
              onItemClick={handleRecentSearchClick}
            />
          </ScrollArea>
        </div>
      )}
      {recentlyViewed && (
        <div className="min-w-0">
          <AdImpressionTracker listings={recentlyViewed} pageType={PAGE_TYPES.HOME} />
          <h2 className="sectionHeading">{t('Recently Viewed')}</h2>
          <CarouselSection
            className="h-full w-full mb-10"
            itemBasis="basis-[80%] md:basis-[55%] lg:basis-[43%]"
            pageType={PAGE_TYPES.HOME}
            pageSection={PAGE_SECTIONS.RECENTLY_VIEWED}
          >
            {recentlyViewed?.map((item, index) => {
              const carPurposeTitle = t(
                `${
                  item?.condition?.slug == 'new' ? `New` : `Used`
                } Car For Sale`,
              );

              return (
                <ListingCard
                  key={`listing-${index}`}
                  item={item}
                  carPurposeTitle={carPurposeTitle}
                  locale={locale}
                  gaEvent="classifieds_listing_click"
                  pageType={PAGE_TYPES.HOME}
                  pageSection={PAGE_SECTIONS.RECENTLY_VIEWED}
                />
              );
            })}
          </CarouselSection>
        </div>
      )}
    </div>
  );
}
