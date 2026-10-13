'use client';

import CarMakeModalSearch from '@/components/landingSearch/carMakeModalSearch';
import { useSearchAnalytics } from '@/hooks/useSearchAnalytics';
import {
  PAGE_SECTIONS,
  PAGE_TYPES,
} from '@/services/analyticsService/constants';

export default function ListingSearchTrigger({ title }) {
  const handleSearchOpen = useSearchAnalytics(
    PAGE_TYPES.SEARCH_RESULTS,
    PAGE_SECTIONS.HEADER,
  );

  return (
    <CarMakeModalSearch
      triggerProps={{
        variant: 'small',
      }}
      placeholder={title}
      onOpen={handleSearchOpen}
      pageSection={PAGE_SECTIONS.HEADER}
    />
  );
}
