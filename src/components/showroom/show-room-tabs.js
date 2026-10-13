'use client';

import { useRouter } from '@/i18n/navigation';
import { getLocaleString } from '@/utils/general';
import { ChevronLeftIcon } from 'lucide-react';
import { useLocale, useTranslations } from 'next-intl';
import { ChipWithIcon } from '../common/chip-with-icon/chip-with-icon';
import ListingCard from '../listing/listingCard';
import LinkWithIcon from '../common/linkWithIcon/linkWithIcon';
import Pagination from '../common/pagination';
import { Tabs } from '../common/tabs';
import Text from '../common/text';
import ShowRoomMakes from './showroom-makes';
import ListingNotFound from '../common/errors/listingNotFound';
import { useMemo } from 'react';
import TrackAdMetrics from '../adMetrics/track-ad-metrics';
import { IMAGES_BASE_URL } from '@/constants';
import {
  PAGE_SECTIONS,
  PAGE_TYPES,
} from '@/services/analyticsService/constants';
import AdImpressionTracker from '@/components/common/adImpressionTracker/adImpressionTracker';

const ShowRoomTabs = ({
  showRoomCarsData,
  listingDetailData,
  condition,
  showRoomMakes,
  showMakes,
  makesData,
}) => {
  const t = useTranslations('home');
  const commonT = useTranslations('common');
  const router = useRouter();
  const locale = useLocale();
  const getTabValue = () => {
    const tabValue = showRoomCarsData?.find(
      (data) => data?.value == condition,
    )?.value;
    return tabValue ? tabValue : showRoomCarsData[0]?.value;
  };

  const activeTabData = showRoomCarsData.find(
    (item) => item.value === getTabValue(),
  );
  const listingsData = useMemo(
    () => (showMakes ? makesData : activeTabData?.listings),
    [showMakes, makesData, activeTabData],
  );
  const getLabelLink = (value) => {
    const hasUsed = showRoomCarsData?.some((item) => item.value === 'used');
    const hasNew = showRoomCarsData?.some((item) => item.value === 'new');
    const hasBoth = hasUsed && hasNew;

    if (hasBoth) {
      return value === 'used'
        ? `/showroom/${listingDetailData?.slug}/used`
        : `/showroom/${listingDetailData?.slug}`;
    }

    return `/showroom/${listingDetailData?.slug}`;
  };

  const getTransformedData = (listings) => {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-5">
        {listings?.map((item, index) => {
          const carPurposeTitle = t(
            `${item?.condition?.slug == 'new' ? `New` : `Used`} Car For Sale`,
          );

          return (
            <div key={`listing-wrapper-${index}`} className="h-full">
              <ListingCard
                key={`listing-${index}`}
                item={item}
                carPurposeTitle={carPurposeTitle}
                locale={locale}
                gaEvent="showroom_listing_click"
                pageType={PAGE_TYPES.SHOWROOM_DETAIL}
                pageSection={PAGE_SECTIONS.SHOWROOM_LISTINGS}
              />
            </div>
          );
        })}
      </div>
    );
  };

  return showRoomCarsData?.length > 0 ? (
    <div>
      <Tabs
        tabsListClassName="w-min border-b-0"
        className="gap-5"
        defaultValue={getTabValue()}
        value={getTabValue()}
        onValueChange={(option) => {
          router.push(getLabelLink(option));
        }}
        items={showRoomCarsData?.map(
          ({ label, value, listings, pagination }, tabIndex) => ({
            label:
              t(label) +
              ` (${pagination?.total_count || listings?.length || 0})`,
            value,
            labelHref: getLabelLink(value),
            content: (
              <div>
                {activeTabData?.value == 'new' && !showMakes && (
                  <div className="mb-4">
                    <ShowRoomMakes showRoomMakes={showRoomMakes} />
                  </div>
                )}
                {showMakes && (
                  <div className="flex items-center justify-between space-y-2">
                    <div>
                      <LinkWithIcon
                        href={`/showroom/${listingDetailData?.slug}`}
                        title={t('Back To All Brands')}
                        icon={
                          <ChevronLeftIcon className="w-4 h-4 bg-primary-50 text-primary rounded-xs rtl:rotate-180" />
                        }
                        iconPosition={'left'}
                        className="text-primary justify-left text-xs md:text-sm  hover:text-primary my-3"
                      />
                      <div className="flex gap-4">
                        <Text as="h2" className="sectionHeading font-semibold">
                          {commonT('showRoomMakeTitle', {
                            make: getLocaleString(
                              makesData[0]?.make,
                              'label',
                              locale,
                            ),
                          })}
                        </Text>
                      </div>
                    </div>

                    <ChipWithIcon
                      img={`${IMAGES_BASE_URL}/${makesData[0]?.make?.slug}/thumbnail.png`}
                      href={`/car/${makesData[0]?.make?.slug}`}
                    />
                  </div>
                )}
                {getTransformedData(listingsData)}
                {!showMakes && (
                  <Pagination
                    className="pagination-bar"
                    currentPage={activeTabData?.pagination?.current_page}
                    totalCount={activeTabData?.pagination?.total_count}
                    pageSize={30}
                    totalPages={activeTabData?.pagination?.total_pages}
                  />
                )}
              </div>
            ),
          }),
        )}
      ></Tabs>
      <TrackAdMetrics adMetrics={listingsData} />
      <AdImpressionTracker listings={listingsData} pageType={PAGE_TYPES.SHOWROOM_DETAIL} />
    </div>
  ) : (
    <ListingNotFound
      description={commonT('Please try browsing another showroom')}
    />
  );
};
export default ShowRoomTabs;
