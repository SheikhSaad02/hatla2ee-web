'use client';
import UsedCarsFilterChips from '@/components/listing/usedCarListings/UsedCarsFilterChips';
import { usePathname, useRouter } from '@/i18n/navigation';
import { createLocaleStringGetter, toArray } from '@/utils/general';
import { usedCarListingUrlBuilder } from '@/services/urlBuilder/usedCarListingUrl';
import {
  getDisplayValue,
  getFilterCount,
} from '@/utils/used-cars/listings';
import { useSearchParams } from 'next/navigation';
import { cloneElement, useCallback, useEffect, useMemo, useState } from 'react';
import FilterCheckBox from './components/filterCheckBox';
import FilterRadioOption from './components/filterRadioOption';
import FilterRange from './components/filterRange';
import FilterScrollCard from './components/filterScrollCard';
import { buildFilterConfig, filterKeys } from './filterConfig';
import { checkFilterConfigDependencies } from '@/utils/new-cars/listings';
import { useTranslations, useLocale } from 'next-intl';
import FilterLayout from './components/filterLayout';
import FilterChipItem from '@/components/listing/filterChips/filterChipItem';
import { useUser } from '@/providers/user';
import { usePageType } from '@/hooks/usePageType';
import { homeClickEvents } from '@/services/analyticsService/events';
import { PAGE_SECTIONS } from '@/services/analyticsService/constants';
import configs from '@/configs';
import FilterGoodDeal from './components/filterGoodDeal';

const filterComponentsMapping = {
  FilterScrollCard: FilterScrollCard,
  FilterRange: FilterRange,
  FilterCheckBox: FilterCheckBox,
  FilterRadioOption: FilterRadioOption,
};

const FiltersClient = ({
  initialData,
  locale,
  filterData,
  isMobile,
  quickLinks,
  isSearch,
  loading,
  goodDealCount,
}) => {
  const [filterValues, setFilterValues] = useState(initialData || {});
  const [mobileSheetOpen, setMobileSheetOpen] = useState(false);
  const [dynamicFilterData, setDynamicFilterData] = useState({});
  const goodDealEnabled = configs.ENABLE_GOOD_DEAL_FILTER;

  const t = createLocaleStringGetter(locale);
  const commonT = useTranslations('common');
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const filterT = useTranslations('filters');
  const { user } = useUser();
  const pageType = usePageType();

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
    (nextFilters) => {
      const href = usedCarListingUrlBuilder.buildUrl(nextFilters);
      router.push(href);
    },
    [router],
  );

  const handleGoodDealToggle = useCallback(
    (next) => {
      const updated = { ...filterValues };
      if (next) updated.good_deal = true;
      else delete updated.good_deal;
      setFilterValues(updated);
      if (next) {
        homeClickEvents.click_good_deal(
          locale,
          user,
          pageType || 'searchresults',
          PAGE_SECTIONS.STICKY_FILTERS,
        );
      }
      if (!isMobile) applyFilters(updated);
    },
    [filterValues, isMobile, applyFilters, locale, user, pageType],
  );

  function handleDependentDataFetching(filterKey, newValue) {
    const currentConfig = filterConfig[filterKey];
    if (!currentConfig?.dependents) return;

    for (const dep of currentConfig.dependents) {
      const dependentConfig = filterConfig[dep];
      if (dependentConfig?.dataFetcher) {
        dependentConfig
          .dataFetcher({ ...filterValues, [filterKey]: newValue })
          .then((data) => {
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
    if (newValue && typeof newValue === 'object' && newValue.min != null && newValue.max != null) {
      filterValue = getDisplayValue(newValue, t, commonT, {
        ...(currentConfig?.formatting || {}),
        locale,
      });
    } else {
      filterValue = newValue?.slug || newValue?.label || newValue || '';
    }
    if (filterValue) {
      homeClickEvents.click_filter(
        locale,
        user,
        pageType,
        PAGE_SECTIONS.STICKY_FILTERS,
        filterName,
        currentConfig.isMulti ? newValue?.label ?? filterValue : filterValue,
      );
    }

    const updatedFilters = (() => {
      let updatedValues = { ...filterValues };

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
    if (isMobile) {
      homeClickEvents.click_filter(
        locale,
        user,
        pageType || 'searchresults',
        "all_filters",
        '',
        '',
      );
    }

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

      const { showCountInTrigger } = rest;
      const Component = filterComponentsMapping[component];
      const value = filterValues[key];
      const selectedCount = toArray(value).length;

      const chipDisplayValue = getDisplayValue(value, t, commonT, {
        ...formatting,
        locale,
        isMulti,
      });

      const renderChipTrigger = (props = {}) => {
        return (
          <FilterChipItem
            key={_key}
            label={chipDisplayValue || t(filterConfig[key], 'label')}
            className={'cursor-pointer'}
            hideCross={!chipDisplayValue}
            onRemove={chipDisplayValue ? (e) => {
              e.stopPropagation();
              updateFilters(key, undefined, true);
            } : undefined}
            {...props}
          />
        );
      };

      return {
        id: key,
        trigger:
          showCountInTrigger && selectedCount
            ? `${t(filterConfig[key], 'label')} (${selectedCount})`
            : t(filterConfig[key], 'label'),
        suffix: showCountInTrigger
          ? ''
          : getDisplayValue(value, t, commonT, {
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
            href={href}
            title={`${commonT('Select')} ${t(filterConfig[key], 'label')}`}
            placeholder={`${commonT('Select')} ${t(
              filterConfig[key],
              'label',
            )}`}
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

  if (goodDealEnabled) {
    const priceItem = items.find((it) => it.id === filterKeys.price);
    if (priceItem) {
      const basePriceContent = priceItem.getContent;
      priceItem.getContent = (renderChip = false) =>
        cloneElement(basePriceContent(renderChip), {
          belowContent: (
            <FilterGoodDeal
              checked={!!filterValues[filterKeys.goodDeal]}
              count={goodDealCount}
              label={filterT('Good Deals Only')}
              onToggle={handleGoodDealToggle}
            />
          ),
        });
    }
  }

  const filterCount = (() => {
    const _count = getFilterCount(filterValues);
    return _count ? `(${_count})` : '';
  })();

  const quickFilters = ['make', 'model', 'variant', 'year', 'city', 'price', 'mileage'];
  const renderQuickFilters = () => {
    const withValues = items.filter((item) => quickFilters?.includes(item.id) && filterValues[item.id]);
    const withoutValues = items.filter((item) => quickFilters?.includes(item.id) && !filterValues[item.id]);

    return {
      applied: (
        <div className="flex gap-2 items-center">
          {withValues.map((item, index) => (
            <div key={index}>{item.getContent(true)}</div>
          ))}
        </div>
      ),
      unapplied: (
        <div className="flex gap-2 items-center">
          {withoutValues.map((item, index) => (
            <div key={index}>{item.getContent(true)}</div>
          ))}
        </div>
      ),
    };
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
        <UsedCarsFilterChips
          isMobile={isMobile}
          initialData={initialData}
          renderQuickFilters={renderQuickFilters}
          hideChipKeys={quickFilters}
          onNonQuickChipClick={() => setMobileSheetOpen(true)}
        />
      )}
    </>
  );
};
export default FiltersClient;