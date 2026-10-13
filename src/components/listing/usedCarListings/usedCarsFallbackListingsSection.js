import ListingCard from '@/components/listing/listingCard';
import { cn } from '@/utils';
import { getLocale, getTranslations } from 'next-intl/server';
import { getLocaleStringServer } from '@/utils/serverFunctions';
import {
  USED_CAR_FALLBACK_THRESHOLD,
  fetchUsedCarFallbackListingsPriority,
} from '@/services/used-cars/usedCarFallbackListingsPriority';

const UsedCarsFallbackListingsSection = async ({
  updatedFilters,
  totalCount,
  page,
  results,
  className,
}) => {
  const shouldFetchFallback =
    page === 1 && totalCount < USED_CAR_FALLBACK_THRESHOLD;
  if (!shouldFetchFallback) return null;

  const primaryGridCount = results?.length ?? 0;
  const excludeListingIds = results?.map((r) => r.listing_id) ?? [];

  const { listings, titleKey } = await fetchUsedCarFallbackListingsPriority({
    updatedFilters,
    primaryGridCount,
    excludeListingIds,
  });
  if (!listings?.length) return null;

  const locale = await getLocale();
  const tListings = await getTranslations({ namespace: 'usedCarsListings' });
  const tHome = await getTranslations({ namespace: 'home' });

  const city = updatedFilters?.city;
  const rawDisplayCity =
    city?.level > 2
      ? (city?.hierarchy?.find((l) => Number(l.level) === 2) ?? city)
      : city;
  const cityName = await getLocaleStringServer(rawDisplayCity, 'title');

  return (
    <div className={cn('flex flex-col gap-6 min-w-0', className)}>
      <h2 className="sectionHeading mb-0">
        {tListings(titleKey, { location: cityName })}
      </h2>
      <div className="grid grid-cols-[repeat(auto-fill,minmax(230px,1fr))] auto-rows-max gap-4 lg:gap-y-6">
        {listings.map((item, index) => (
          <ListingCard
            key={`fallback-${item.listing_id ?? index}`}
            item={item}
            carPurposeTitle={tHome('Used Car For Sale')}
            locale={locale}
          />
        ))}
      </div>
    </div>
  );
};

export default UsedCarsFallbackListingsSection;
