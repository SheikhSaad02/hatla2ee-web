import PageLayout from '@/components/layout/pageLayout';
import React from 'react';
import NewVehicleListings from './newVehicleListings';
import { getTranslations } from 'next-intl/server';
import { appPaths, newVehiclesCategorySlugs } from '@/constants';
import {
  getCountryObject,
  validateAndRedirect,
} from '@/utils/countryValidation';
import filterData from '@data';
import { decodeSearchParams } from '@/utils/url';

const populatedFilters = (filters) => {
  const populatedFilters = {};

  if (filters.sortby) {
    populatedFilters.sortby = filterData.newListingsFilterData.sortby.find(
      (item) => item.slug === filters.sortby,
    );
  }

  if (filters.page) {
    populatedFilters.page = filters.page;
  }

  return populatedFilters;
};

const AssembledPageWrapper = async ({ categorySlug, searchParams, params }) => {
  const { locale, country } = await params;
  const queryParams = decodeSearchParams(await searchParams);
  const populatedFiltersObject = populatedFilters(queryParams);
  const t = await getTranslations({ locale, namespace: 'metadata' });
  const layoutT = await getTranslations({ locale, namespace: 'layout' });
  const newCarT = await getTranslations({
    locale,
    namespace: 'newVehicleListingsSeo',
  });
  const countryT = await getTranslations({ locale, namespace: 'countries' });
  const quickLinks =
    categorySlug === newVehiclesCategorySlugs.newCars
      ? [
          {
            key: 'new-car-prices',
            label: layoutT('Used Cars For Sale'),
            link: appPaths.usedCars,
          },
        ]
      : [];
  const countryObj = getCountryObject(country);

  // Validate country and redirect if invalid
  validateAndRedirect(country, locale, categorySlug);

  return (
    <PageLayout route="new-listings">
      <NewVehicleListings
        isSearch={false}
        searchParams={{ ...populatedFiltersObject }}
        showQuickFiltersWidget
        additionalQuery={{
          'f[assembled.slug]': countryObj.slug,
        }}
        seoData={{
          heading: t('New {vehicleType} Assembled in {country}', {
            vehicleType: newCarT(categorySlug),
            country: countryT(countryObj.label),
          }),
          breadcrumbs: [
            { href: appPaths['new-car'], label: layoutT('New Car') },
          ],
        }}
        categorySlug={categorySlug}
        useQueryPagination
        quickLinks={quickLinks}
        prioritizeFirstImage={true}
      />
    </PageLayout>
  );
};

export default AssembledPageWrapper;
