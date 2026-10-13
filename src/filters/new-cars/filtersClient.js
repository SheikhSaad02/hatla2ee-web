'use client';
import NewCarsFilterChips from '@/components/listing/newVehicleListings/newCarsFilterChips';
import { usePathname, useRouter } from '@/i18n/navigation';
import { createLocaleStringGetter, toArray } from '@/utils/general';
import { checkFilterConfigDependencies } from '@/utils/new-cars/listings';
import { buildNewVehicleListingUrl } from '@/services/urlBuilder/newCarListingUrl';
import { getDisplayValue, getFilterCount } from '@/utils/used-cars/listings';
import { useTranslations } from 'next-intl';
import { useSearchParams } from 'next/navigation';
import { useCallback, useEffect, useMemo, useState } from 'react';
import FilterLayout from '../components/filterLayout';
import FilterRadioOption from '../components/filterRadioOption';
import FilterRange from '../components/filterRange';
import FilterScrollCard from '../components/filterScrollCard';
import { buildFilterConfig } from './filterConfig';
import FilterChipItem from '@/components/listing/filterChips/filterChipItem';
import { useUser } from '@/providers/user';
import { newCarListingsEvents } from '@/services/analyticsService/events';
const filterComponentsMapping = {
  FilterScrollCard: FilterScrollCard,
  FilterRange: FilterRange,
  FilterRadioOption: FilterRadioOption,
};

const FiltersClient = ({
  initialData,
  locale,
  filterData,
  isMobile,
  quickLinks,
  isSearch,
  categorySlug,
  loading,
}) => {
  const { user } = useUser();
  const [filterValues, setFilterValues] = useState(initialData || {});
  const [mobileSheetOpen, setMobileSheetOpen] = useState(false);
  const [dynamicFilterData, setDynamicFilterData] = useState({});

  const t = createLocaleStringGetter(locale);
  const commonT = useTranslations('common');
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const filterT = useTranslations('filters');

  const filterConfig = useMemo(() => {
    return buildFilterConfig({
      locale,
      filterData: {
        ...filterData,
        ...dynamicFilterData,
      },
      t: filterT,
    });
  }, [locale, filterData, filterValues, dynamicFilterData]);

  useEffect(() => {
    const currentStateString = JSON.stringify(filterValues);
    const newStateString = JSON.stringify(initialData);
    if (currentStateString !== newStateString) {
      setFilterValues(initialData);
    }
  }, [pathname, searchParams, filterData, initialData]);

  const applyFilters = useCallback(
    (newFilters) => {
      // Emits the pretty URL when the active filters map to an existing pretty
      // route (make, make+model, body, max-only price), else faceted search.
      router.push(buildNewVehicleListingUrl(newFilters, categorySlug));
    },
    [router, categorySlug],
  );

  function handleDependentDataFetching(filterKey, newValue) {
    const currentConfig = filterConfig[filterKey];
    if (!currentConfig?.dependents) return;

    for (const dep of currentConfig.dependents) {
      const dependentConfig = filterConfig[dep];
      if (dependentConfig?.dataFetcher) {
        dependentConfig.dataFetcher({ newValue, categorySlug }).then((data) => {
          setDynamicFilterData((prev) => ({
            ...prev,
            [dep]: data,
          }));
        });
      }
    }
  }

  function updateFilters(filterKey, newValue, applyOnClick = false) {
    const currentConfig = filterConfig[filterKey];
    const filterName = t(currentConfig, 'label');
    let filterValue = '';
    if (
      newValue &&
      typeof newValue === 'object' &&
      newValue.min != null &&
      newValue.max != null
    ) {
      filterValue = getDisplayValue(newValue, t, commonT, {
        ...(currentConfig?.formatting || {}),
        locale,
      });
    } else {
      filterValue = newValue?.slug || newValue?.label || newValue || '';
    }
    if (filterValue) {
      newCarListingsEvents.click_filter(locale, user, filterName, filterValue);
    }
    const updatedFilters = (() => {
      const currentConfig = filterConfig[filterKey];
      let updatedValues = { ...filterValues };

      // Multi-select (e.g. fuel): toggle the option in/out of an array.
      if (currentConfig.isMulti) {
        const previousData = toArray(updatedValues[filterKey]);
        const exists = previousData.some(
          (item) => item?.slug === newValue?.slug,
        );
        updatedValues[filterKey] = exists
          ? previousData.filter((item) => item?.slug !== newValue?.slug)
          : [...previousData, newValue];
        return updatedValues;
      }

      const dependents = currentConfig.dependents;
      if (dependents) {
        for (const dp of dependents) {
          delete updatedValues[dp];
        }
      }
      updatedValues[filterKey] = newValue;
      return updatedValues;
    })();
    setFilterValues(updatedFilters);
    if (!isMobile || applyOnClick) {
      applyFilters(updatedFilters);
    } else {
      handleDependentDataFetching(filterKey, newValue);
    }
  }

  const handleClearAllFilters = () => {
    setFilterValues({});
    setDynamicFilterData({});
  };

  const handleApplyFilters = (e) => {
    applyFilters(filterValues);
    setMobileSheetOpen(false);
  };

  const items = Object.keys(filterConfig)
    .map((key) => {
      const { met } = checkFilterConfigDependencies(
        filterConfig,
        filterValues,
        key,
      );
      if (!met) return null;

      const {
        linkable,
        href,
        formatting = {},
        options,
        component,
        isMulti,
        triggerProps,
        key: _key,
        ...rest
      } = filterConfig[key];

      const Component = filterComponentsMapping[component];
      const value = filterValues[key];

      const renderChipTrigger = (props = {}) => {
        return (
          <FilterChipItem
            key={_key}
            label={t(filterConfig[key], 'label')}
            className={'cursor-pointer'}
            hideCross
            {...props}
          />
        );
      };

      return {
        id: key,
        trigger: t(filterConfig[key], 'label'),
        suffix: getDisplayValue(value, t, commonT, {
          ...formatting,
          locale,
          isMulti,
        }),
        getContent: (renderChip = false) => (
          <Component
            key={_key}
            isMobile={isMobile}
            data={initialData}
            value={value}
            isMulti={isMulti}
            linkable={linkable}
            onChange={(item) => updateFilters(key, item, renderChip)}
            title={`${commonT('Select')} ${t(filterConfig[key], 'label')}`}
            placeholder={`${commonT('Select')} ${t(
              filterConfig[key],
              'label',
            )}`}
            href={href}
            options={options}
            renderExternalTrigger={renderChip && renderChipTrigger}
            loading={loading}
            showSuffix={!isMobile}
            {...formatting}
            {...rest}
          />
        ),
      };
    })
    .filter(Boolean);

  const filterCount = (() => {
    const _count = getFilterCount(filterValues);
    return _count ? `(${_count})` : '';
  })();
  const quickFilters = ['make', 'model', 'variant'];
  const renderQuickFilters = () => {
    return (
      <div className="flex gap-2 items-center">
        {items
          .filter((item) => quickFilters?.includes(item.id))
          .map((item, index) => (
            <div key={index} className="">
              {item.getContent(true)}
            </div>
          ))}
      </div>
    );
  };

  return (
    <>
      <FilterLayout
        open={mobileSheetOpen}
        setIsOpen={setMobileSheetOpen}
        isMobile={isMobile}
        items={items}
        quickLinks={quickLinks}
        handleApplyFilters={handleApplyFilters}
        handleClearAllFilters={handleClearAllFilters}
        filterCount={filterCount}
      />
      {isMobile && (
        <NewCarsFilterChips
          isMobile={isMobile}
          initialData={initialData}
          isSearch={isSearch}
          categorySlug={categorySlug}
          renderQuickFilters={renderQuickFilters}
        />
      )}
    </>
  );
};
export default FiltersClient;
