import { fetchDealersData } from '@/apis/dealers';
import { getLocale, getTranslations } from 'next-intl/server';
import { getAsset, getLocaleString } from '@/utils/general';
import CarouselSection from '@/components/common/carouselSection/carouselSection';
import DealerCard from '@/components/common/dealerCard/dealerCard';
import {
  PAGE_TYPES,
  PAGE_SECTIONS,
} from '@/services/analyticsService/constants';

export default async function FeaturedDealers({
  isMobile,
  pageType = PAGE_TYPES.SEARCH_RESULTS,
  showDealerLocation = true,
}) {
  const locale = await getLocale();
  const t = await getTranslations({ locale, namespace: 'common' });

  const dealersData = await fetchDealersData('featured');
  const dealers = dealersData?.agencies || [];

  if (dealers.length === 0) {
    return null;
  }

  // min-h matches FeaturedDealersSkeleton, so the listing grid below does not
  // move when every dealer name fits on one line and the tiles come out shorter.
  return (
    <div className="flex min-h-[216px] flex-col gap-3">
      <h3 className="text-base font-bold">{t('Featured Dealers')}</h3>
      <CarouselSection
        className="w-full"
        itemBasis="w-[130px]"
        isMobile={isMobile}
        showDots
        pageSection={PAGE_SECTIONS.FEATURED_DEALERS}
        contentClassName={isMobile ? 'gap-4' : 'gap-8'}
      >
        {dealers.map((item, i) => (
          <DealerCard
            key={i}
            href={`/showroom/${item.slug}`}
            title={getLocaleString(item, 'name', locale)}
            location={
              showDealerLocation &&
              item?.location?.name &&
              getLocaleString(item?.location, 'name', locale)
            }
            image={{
              src:
                item?.agency_logo ||
                getAsset('/assets/showroom-placeholder-image.png'),
            }}
            showVipBadge={item.is_vip_featured}
            tile
            centerTile
            logoSize={120}
            gaEvent="click_featured_dealer"
            pageType={pageType}
            showroom={getLocaleString(item, 'name', locale)}
          />
        ))}
      </CarouselSection>
    </div>
  );
}
