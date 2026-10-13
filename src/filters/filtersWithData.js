'use client';
import { FiltersService } from '@/services/elasticsearch/filter-service';
import { cleanObject } from '@/utils/general';
import { useEffect, useState } from 'react';
import FiltersClient from './filtersClient';
import { FILTERS_AGG_CONFIG } from './filterConfig';
import tenantFilterData from '@data';
import { ListingsService } from '@/services/elasticsearch/listings-service';
import configs from '@/configs';

// Badge aggregations only carry slug/count, so merge them onto the curated
// tenant list to keep its labels and ordering, and drop badges with no
// listings under the other applied filters.
const withCounts = (options = [], aggregations) => {
  // Only fall back to the unfiltered list when the aggregation itself failed;
  // an empty result means no badge has listings under the applied filters.
  if (!Array.isArray(aggregations)) return options;

  return options
    .map((option) => ({
      ...option,
      count: aggregations.find((agg) => agg?.slug === option.slug)?.count ?? 0,
    }))
    .filter((option) => option.count > 0);
};

const FiltersWithData = ({
  initialData,
  locale,
  isMobile,
  quickLinks,
  isSearch,
}) => {
  const [filterData, setFilterData] = useState(null);
  const [loading, setIsLoading] = useState(false);
  const [goodDealCount, setGoodDealCount] = useState(null);

  useEffect(() => {
    const fetchFilterData = async () => {
      try {
        const baseFilters = {};
        const { make, model } = initialData;

        if (initialData) {
          Object.entries(initialData || {}).forEach(([propName, value]) => {
            if (!value) return;
            if (propName === 'specialConditions') return;
            const filterKey =
              tenantFilterData.filterKeysMappings[propName] || propName;
            if (Array.isArray(value)) {
              const slugs = value.map((v) => v?.slug).filter(Boolean);
              if (slugs.length) baseFilters[filterKey] = slugs;
            } else if (value.min != null || value.max != null) {
              baseFilters[filterKey] = { min: value.min, max: value.max };
            } else if (value.slug) {
              baseFilters[filterKey] =
                filterKey === 'location' ? value : value.slug;
            }
          });
        }

        delete baseFilters['sortby'];

        if (initialData.specialConditions?.length) {
          initialData.specialConditions.forEach(({ slug }) => {
            baseFilters[slug] = slug;
          });
        }

        const filterVariants = {
          make: { ...baseFilters, make: undefined },
          ...(make && { model: { ...baseFilters, model: undefined } }),
          ...(model && { variant: { ...baseFilters, variant: undefined } }),
          bodyType: { ...baseFilters, body_type: undefined },
          fuelType: { ...baseFilters, fuel_type: undefined },
          color: { ...baseFilters, exterior_color: undefined },
          location: { ...baseFilters, location: undefined },
          cc: { ...baseFilters, cc: undefined },
          ...(configs.ENABLE_SELLABLE_BADGES && {
            badges: { ...baseFilters, badges: undefined },
          }),
          ...(configs.ENABLE_GOOD_DEAL_FILTER && {
            goodDeal: { ...baseFilters },
          }),
        };

        setIsLoading(true);

        let aggregatedResults = [];

        if (!isMobile) {
          aggregatedResults = await Promise.all(
            Object.entries(filterVariants).map(([facet, obj]) =>
              FiltersService.getFiltersWithCounts(
                cleanObject(obj),
                [facet],
                FILTERS_AGG_CONFIG,
              ),
            ),
          );
        } else {
          aggregatedResults = await Promise.all(
            Object.entries(filterVariants).map(([facet, obj]) => {
              const { make, model } = obj || {};
              const extraParams =
                facet === 'variant'
                  ? { make, model }
                  : facet === 'model'
                  ? { make }
                  : {};

              return FiltersService.getFiltersWithCounts(
                cleanObject(extraParams),
                [facet],
                FILTERS_AGG_CONFIG,
              );
            }),
          );
        }

        const {
          make: makes,
          model: models,
          variant,
          bodyType,
          location,
          cc,
          color,
          fuelType,
          goodDeal,
          badges,
        } = aggregatedResults.reduce((acc, res) => {
          return { ...acc, ...res };
        }, {});

        setGoodDealCount(
          configs.ENABLE_GOOD_DEAL_FILTER ? goodDeal ?? 0 : null,
        );

        const filterData = {
          make: makes,
          model: models,
          variant: variant,
          body: bodyType,
          city: location,

          specialConditions:
            tenantFilterData.usedListingsFilterData.specialConditions,
          cc: cc,
          color: color,
          transmission: tenantFilterData.usedListingsFilterData.transmission,
          badges: withCounts(
            tenantFilterData.usedListingsFilterData.badges,
            badges,
          ),
          fuel: fuelType,
          condition: tenantFilterData.usedListingsFilterData.condition,
          ...(configs.spec_visibility && {
            spec: tenantFilterData.usedListingsFilterData.spec,
          }),
        };

        setFilterData(filterData);
      } catch (error) {
        console.error('Error fetching filter data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchFilterData();
  }, [initialData, locale]);

  return (
    <FiltersClient
      filterData={filterData}
      initialData={initialData}
      locale={locale}
      isMobile={isMobile}
      quickLinks={quickLinks}
      isSearch={isSearch}
      loading={loading}
      goodDealCount={goodDealCount}
    />
  );
};

export default FiltersWithData;
