'use client';
import { fetchAllShowroom } from '@/apis/showroom';
import { showRooms } from '@/data/common';
import { getShowroomListingsRequestPayload } from '@/mappers/showroom';
import { getLocaleString } from '@/utils/general';
import { useLocale, useTranslations } from 'next-intl';
import { useEffect, useMemo, useState } from 'react';
import DealerCard from '../common/dealerCard/dealerCard';
import ListingNotFound from '../common/errors/listingNotFound';
import { ShowroomListingsSkeleton } from '../common/loading';
import Pagination from '../common/pagination';
import { Tabs } from '../common/tabs';
import PriceLinks from './price-links';
import ShowRoomSideBar from './showroom-side-bar';
import { Breadcrumbs } from '../common/breadcrumbs';
import configs from '@/configs';
import { appPaths } from '@/constants';
import { useRouter } from 'next/navigation';
import StickyHeader from '../common/pageTitle/stickyHeader';
import Container from '../layout/container';
import BackButton from '../common/backButton';
import { ChevronLeftIcon } from 'lucide-react';
import Text from '../common/text';
import NextImage from '../common/nextImage';
import {
  PAGE_TYPES,
  PAGE_SECTIONS,
} from '@/services/analyticsService/constants';

const ShowRoomsListingsWrapper = ({
  isMobile,
  page,
  locationId,
  initialData,
  currentTab,
  showroomBasePath,
  isWebView,
}) => {
  const t = useTranslations('common');
  const locale = useLocale();
  const router = useRouter();

  const [activeValue, setActiveTabValue] = useState(currentTab);
  const [showRoomsData, setShowRoomsData] = useState(
    showRooms(t)?.reduce((acc, tab) => {
      acc[tab.value] = {
        agencies: tab?.value == currentTab ? initialData?.agencies : null,
        pagination: tab?.value == currentTab ? initialData?.pagination : null,
        page: 1,
        locationId: null,
      };
      return acc;
    }, {}),
  );

  const [loading, setLoading] = useState(false);

  const isCachedData = () => {
    const current = showRoomsData[activeValue];
    return (
      current?.agencies &&
      current?.page === page &&
      current?.locationId === locationId
    );
  };

  const showroomPageTitle = useMemo(
    () => ({
      used: t('Used Car Showroom in {country}', {
        country: configs.country[locale].label,
      }),
      new: t('New Car Showroom in {country}', {
        country: configs?.country[locale].label,
      }),
      authorized: t('Authorized Car Dealers in {country}', {
        country: configs.country[locale].label,
      }),
      ev: t('Electric Car Showroom in {country}', {
        country: configs.country[locale].label,
      }),
    }),
    [],
  );

  useEffect(() => {
    const fetchShowroomsData = async () => {
      setLoading(true);
      const reqPayload = getShowroomListingsRequestPayload(
        activeValue,
        page,
        locationId,
      );
      const response = await fetchAllShowroom(
        reqPayload,
        showroomBasePath,
        activeValue,
      );
      if (response) {
        setLoading(false);
        setShowRoomsData((prev) => ({
          ...prev,
          [activeValue]: { ...response, page, locationId },
        }));
      }
    };
    if (!isCachedData()) {
      fetchShowroomsData();
    }
  }, [activeValue, page, locationId]);

  const renderPageTitle = (isMobile, title) => {
    if (!isMobile) {
      return (
        <Text as="h1" weight="bold" className="text-2xl lg:text-3.5xl">
          {title}
        </Text>
      );
    }

    return (
      <StickyHeader>
        <Container className="flex items-center justify-between gap-3">
          <div className="flex gap-2 flex-1">
            <BackButton
              variant="ghost"
              className="bg-gray-50 text-gray-500 w-8 h-auto"
            >
              <ChevronLeftIcon className="w-4 h-4 rounded-xs flipX" />
            </BackButton>
            <Text
              as="h1"
              weight="bold"
              className="text-lg text-gray-900 content-center"
            >
              {title}
            </Text>
          </div>
        </Container>
      </StickyHeader>
    );
  };

  return (
    <div className="flex flex-col gap-4 md:gap-2">
      {!isWebView &&
        renderPageTitle(isMobile, showroomPageTitle?.[activeValue])}
      <Tabs
        onValueChange={(tab) => {
          const selectedTab = showRooms(t).find(
            (item) => item.value === tab,
          )?.path;
          if (!page) {
            setActiveTabValue(tab);
            return;
          }
          router.push(`/${locale}${selectedTab}`);
        }}
        items={showRooms(t)}
        className="-mx-4 lg:mx-0"
        value={activeValue}
      />

      <div className="grid grid-cols-1 lg:grid-cols-[268px_1fr] gap-5">
        <ShowRoomSideBar isMobile={isMobile} />

        {loading ? (
          <ShowroomListingsSkeleton grids={3} itemsCount={isMobile ? 1 : 6} />
        ) : showRoomsData[activeValue]?.agencies?.length > 0 ? (
          <div className="flex flex-col gap-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {showRoomsData[activeValue]?.agencies?.map((agency, index) => {
                const showroomName = getLocaleString(agency, 'title', locale);
                const locationString = agency?.addresses
                  ?.map((addr) => getLocaleString(addr, 'location', locale))
                  .join(', ');
                return (
                  <DealerCard
                    key={index}
                    {...{
                      ...agency,
                      title: showroomName,
                      location: locationString,
                    }}
                    titleClassName="block "
                    pageType={activeValue}
                    gaEvent="recommended_showroom_click"
                    item={{
                      agency_name: showroomName,
                      city: locationString,
                    }}
                    showFeaturedBadge={agency?.featured}
                    showVipBadge={
                      activeValue === 'ev' && agency?.is_vip_featured
                    }
                  />
                );
              })}
            </div>

            <Pagination
              className="pagination-bar"
              currentPage={showRoomsData[activeValue]?.pagination?.current_page}
              totalCount={showRoomsData[activeValue]?.pagination?.total_count}
              pageSize={30}
            />
            {isMobile && <PriceLinks isMobile={isMobile} />}
          </div>
        ) : (
          <ListingNotFound
            title={t('No Showrooms found')}
            isMobile={isMobile}
          />
        )}
      </div>
    </div>
  );
};
export default ShowRoomsListingsWrapper;
