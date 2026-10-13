import PageLayout from '@/components/layout/pageLayout';
import React from 'react';
import NewVehicleListings from './newVehicleListings';
import { newVehicleUrlValidator } from '@/services/urlValidator/newVehicleListings';
import { parseUrlSearchParams } from '@/utils/new-cars/listings';
import { decodeSearchParams } from '@/utils/url';

const NewVehicleListingsWrapper = async ({
  params,
  searchParams: _searchParams,
  categorySlug,
}) => {
  const { locale } = await params;
  const searchParams = decodeSearchParams(await _searchParams);
  const { queryParams, isSearch } = parseUrlSearchParams(searchParams);
  const { filters } = await newVehicleUrlValidator.validateUrl(
    queryParams,
    categorySlug,
    isSearch,
    locale,
  );
  const { sortby, ...rest } = queryParams;

  return (
    <PageLayout route="new-listings">
      <NewVehicleListings
        isSearch={isSearch}
        searchParams={filters}
        categorySlug={categorySlug}
        showQuickFiltersWidget={
          !isSearch ||
          Object.keys(queryParams)?.length === 0 ||
          (Object.keys(queryParams)?.length === 1 && 'sortby' in queryParams)
        }
        prioritizeFirstImage
      />
    </PageLayout>
  );
};

export default NewVehicleListingsWrapper;
