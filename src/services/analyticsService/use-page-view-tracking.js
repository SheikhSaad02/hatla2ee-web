'use client';
import { useEffect, useRef } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import { useUser } from '@/providers/user';
import { useLocale } from 'next-intl';
import {
  getCommonParams,
  getPageTypeFromPath,
  getVehicleTypeFromPath,
  getConditionFromPath,
  getShowroomNameFromPath,
  getListingIdFromPath,
  PAGE_TYPES,
  WEBSITE_SECTIONS,
} from './constants';
import { trackEvent } from './eventHandler';
import { getLpvDimensionsFromFilters } from './lpvPageViewDimensions';

const isLpvPageType = (pageType) =>
  pageType === PAGE_TYPES.SEARCH_RESULTS ||
  pageType === PAGE_TYPES.NEW_CAR_RESULTS;

export function usePageViewTracking(filters) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { user } = useUser();
  const locale = useLocale();
  const previousPath = useRef(null);

  useEffect(() => {
    const url = searchParams.toString()
      ? `${pathname}?${searchParams.toString()}`
      : pathname;
    if (previousPath.current === url) return;

    const pageType = getPageTypeFromPath(pathname);
    // don't track custom page views in case of lpv page type and no filters
    if (isLpvPageType(pageType) && !filters) {
      previousPath.current = url;
      return;
    }

    const timer = setTimeout(() => {
      const commonParams = getCommonParams(locale, user);
      const vehicleType = getVehicleTypeFromPath(pathname);
      const condition = getConditionFromPath(pathname, searchParams);
      const showroomName = getShowroomNameFromPath(pathname);
      const listingId = getListingIdFromPath(pathname);
      const lpvDims = filters
        ? getLpvDimensionsFromFilters(filters)
        : null;

      const eventParams = {
        page_path: url,
        page_location:
          (typeof window !== 'undefined' && window.location.href) || url,
        page_title: (typeof document !== 'undefined' && document.title) || '',
        website_section: WEBSITE_SECTIONS.BUY,
        page_type: pageType,
        ...(vehicleType && { vehicle_type: vehicleType }),
        ...(condition && { condition }),
        ...(showroomName && { name: showroomName }),
        ...(listingId && { listing_id: listingId }),
        ...(lpvDims || {}),
        ...commonParams,
      };

      trackEvent('page_view', eventParams);

      if (process.env.NODE_ENV === 'development') {
        console.log('[GA Page View - Navigation]', {
          page_path: url,
          page_title: (typeof document !== 'undefined' && document.title) || '',
          page_type: pageType,
          ...(vehicleType && { vehicle_type: vehicleType }),
          ...(condition && { condition }),
          ...(showroomName && { name: showroomName }),
          ...(listingId && { listing_id: listingId }),
          ...(lpvDims || {}),
          ...commonParams,
        });
      }
    }, 100);

    previousPath.current = url;
    return () => clearTimeout(timer);
  }, [pathname, searchParams, locale, user, filters]);
}
