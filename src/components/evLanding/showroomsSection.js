import { getLocale, getTranslations } from 'next-intl/server';
import { fetchDealersData } from '@/apis/dealers';
import CarouselSection from '../common/carouselSection/carouselSection';
import DealerCard from '../common/dealerCard/dealerCard';
import ViewAllLink from '../common/viewAllLink/viewAllLink';
import { getAsset, getLocaleString } from '@/utils/general';
import { appPaths } from '@/constants';
import {
  PAGE_SECTIONS,
  PAGE_TYPES,
} from '@/services/analyticsService/constants';

export default async function EvShowroomsSection({ isMobile }) {
  const locale = await getLocale();
  const t = await getTranslations({ locale, namespace: 'evLanding' });

  const res = await fetchDealersData(null, 'f[vehicle_type]=ev');
  const showrooms = res?.agencies || [];

  if (!showrooms.length) return null;

  return (
    <section>
      <div className="flex items-center justify-between">
        <h2 className="sectionHeading">{t('showroomsTitle')}</h2>
        <ViewAllLink
          href={appPaths.evShowrooms}
          title={t('viewAllShowrooms')}
        />
      </div>

      <CarouselSection
        className="h-full w-full"
        itemBasis="w-[190px]"
        contentClassName="gap-4"
        isMobile={isMobile}
        pageSection={PAGE_SECTIONS.RECOMMENDED_SHOWROOMS}
      >
        {showrooms.map((item, i) => (
          <DealerCard
            key={i}
            href={`/showroom/${item.slug}`}
            title={getLocaleString(item, 'name', locale)}
            location={
              item?.location?.name &&
              getLocaleString(item?.location, 'name', locale)
            }
            image={{
              src:
                item?.agency_logo ||
                getAsset('/assets/showroom-placeholder-image.png'),
            }}
            showFeaturedBadge={item.featured}
            showVipBadge={item.is_vip_featured}
            metaBadge={t('evsCount', { count: item.ev_cars_count ?? 0 })}
            pageType={PAGE_TYPES?.ELECTRIC_CARS}
            pageSection={PAGE_SECTIONS.RECOMMENDED_SHOWROOMS}
            gaEvent="recommended_showroom_click"
            hideContact
            tile
          />
        ))}
      </CarouselSection>
    </section>
  );
}
