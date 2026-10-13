import UsedCarsListings from '@/components/listing/usedCarListings/usedCarsListings';
import { usedCarUrlValidator } from '@/services/urlValidator/usedCarsListings';
import { getLocale } from 'next-intl/server';

const UsedCarsListingsServerWrapper = async ({ slugParts, queryParams }) => {
  const locale = await getLocale();
  const { updatedFilters } = await usedCarUrlValidator.validateUrl(
    slugParts,
    queryParams,
    locale,
  );

  const showQuickFiltersWidget =
    !slugParts.includes('page') && !queryParams['page'];

  return (
    <UsedCarsListings
      updatedFilters={updatedFilters}
      slugParts={slugParts}
      isSearch={false}
      showQuickFiltersWidget={showQuickFiltersWidget}
      showAd={true}
      prioritizeFirstImage
    />
  );
};

export default UsedCarsListingsServerWrapper;
