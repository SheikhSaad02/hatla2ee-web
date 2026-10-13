'use client';
import { useState, useEffect } from 'react';
import FiltersClient from './filtersClient';
import { fetchNewVehiclesFiltersData } from '@/apis/new-cars-listings';
import { getShouldfetchVariantLevelAds } from '@/utils/new-cars/listings';

const FiltersWithData = ({
  initialData,
  locale,
  isMobile,
  quickLinks,
  isSearch,
  categorySlug,
}) => {
  const [filterData, setFilterData] = useState(null);
  const [loading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchFilterData = async () => {
      try {
        setIsLoading(true);
        const filtersData = await fetchNewVehiclesFiltersData(
          initialData,
          categorySlug,
          true,
          !isMobile,
        );

        const filterData = {
          make: filtersData.makes,
          model: filtersData.models,
          body: filtersData.bodyTypes,
          fuel: filtersData.fuelTypes,
          transmission: filtersData.transmissions,
        };
        setFilterData(filterData);
      } catch (error) {
        console.error('Error fetching new vehicle filters data:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchFilterData();
  }, [initialData, locale, categorySlug]);

  return (
    <FiltersClient
      filterData={filterData}
      initialData={initialData}
      locale={locale}
      isMobile={isMobile}
      quickLinks={quickLinks}
      isSearch={isSearch}
      categorySlug={categorySlug}
      loading={loading}
    />
  );
};

export default FiltersWithData;
