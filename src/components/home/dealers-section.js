import { fetchDealersData } from '@/apis/dealers';
import tenantData from '@data';
import CarouselSection from '../common/carouselSection/carouselSection';
import DealerCard from '../common/dealerCard/dealerCard';
import { Tabs } from '../common/tabs';
import { getAsset, getLocaleString } from '@/utils/general';
import { ShowroomsSectionSkeleton } from '../common/loading';
import ClickEventTracker from '@/services/analyticsService/clickTracker';
import { getLocale, getTranslations } from 'next-intl/server';
import ViewAllLink from '../common/viewAllLink/viewAllLink';
import { PAGE_SECTIONS } from '@/services/analyticsService/constants';

export default async function DealersWithClassification({
  isMobile,
  defaultTab,
  pageType = '',
}) {
  const locale = await getLocale();
  const t = await getTranslations({ locale, namespace: 'home' });
  const commonT = await getTranslations({ locale, namespace: 'common' });
  const dealersTabs = tenantData.getDealersTabs(defaultTab);

  const dealersDataArray = await Promise.all(
    dealersTabs.map((tab) => fetchDealersData(tab.value)),
  );

  const filteredTabs = dealersTabs.filter((tab, index) => {
    const dealers = dealersDataArray[index]?.agencies || [];
    return dealers.length > 0;
  });

  const defaultTabValue =
    dealersTabs.find((tab) => tab.value === defaultTab)?.value ||
    filteredTabs[0]?.value;

  const filteredDealersData = dealersTabs
    .map((tab, index) => ({ tab, data: dealersDataArray[index] }))
    .filter(({ data }) => data?.agencies?.length > 0)
    .map(({ data }) => data);

  const tabItems = filteredTabs.map((tab, index) => {
    const dealers = filteredDealersData[index]?.agencies || [];
    const labelText = commonT(tab.label);

    return {
      label: labelText,
      value: tab.value,
      link:tab.path &&{
        content:
          <ViewAllLink
            href={tab.path}
            title={`${commonT('View All')} ${labelText} ${tab.path == "/showroom-authorized" ? commonT('Dealers') : commonT('Showrooms')}`}
          />,
        event:{
          name:"view_all_link_click",
          params:{
            page_section: PAGE_SECTIONS.RECOMMENDED_SHOWROOMS,
            active_tab: tab.value
          }
        }
      },
      content:
        dealers.length === 0 ? (
          <ShowroomsSectionSkeleton
            itemsCount={isMobile ? 2 : 5}
            isMobile={isMobile}
          />
        ) : (
          <CarouselSection
            className="h-full w-full"
            itemBasis="w-[190px]"
            contentClassName="gap-4"
            isMobile={isMobile}
            pageSection={
              tab.value === 'featured'
                ? PAGE_SECTIONS.FEATURED_DEALERS
                : PAGE_SECTIONS.RECOMMENDED_SHOWROOMS
            }
          >
            {dealers.map((item, i) => (
              <ClickEventTracker
                key={i}
                showroom={item?.name}
                gaEvent={
                  tab.value === 'featured'
                    ? 'click_featured_dealer'
                    : 'recommended_showroom_click'
                }
                tab={tab.value}
                pageType={pageType}
              >
                <DealerCard
                  key={`variant-${i}`}
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
                  className="flex flex-col h-full"
                  titleClassName="block"
                  showFeaturedBadge={item.featured}
                  showVipBadge={
                    tab.value === 'featured' && item.is_vip_featured
                  }
                  tile
                />
              </ClickEventTracker>
            ))}
          </CarouselSection>
        ),
    };
  });

  return (
    <div>
      <h2 className="sectionHeading">{t('Recommended Showrooms')}</h2>
      <Tabs
        items={tabItems}
        defaultValue={defaultTabValue}
        className="gap-5"
        viewAllLink={true}
      />
    </div>
  );
}
