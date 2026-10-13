'use client';
import { useRouter } from '@/i18n/navigation';
import { useCallback } from 'react';
import { appPaths } from '@/constants';
import { getChipsFromData } from '@/utils/used-cars/listings';
import FilterChips from '@/components/listing/filterChips/filterChips'; // Your original component
import { usedCarListingUrlBuilder } from '@/services/urlBuilder/usedCarListingUrl';
import { buildFilterConfig } from '@/filters/filterConfig';
import { useLocale, useTranslations } from 'next-intl';

const UsedCarsFilterChips = ({
  initialData,
  isMobile = false,
  renderQuickFilters,
  hideChipKeys = [],
  onNonQuickChipClick,
}) => {
  const locale = useLocale();
  const t = useTranslations('filters');
  const commonT = useTranslations('common');
  const filterConfig = buildFilterConfig({
    locale,
    initialData,
    t,
  });
  const chipsData = [
    ...getChipsFromData(initialData, filterConfig, {
      locale,
      commonT,
    }),
    ...(initialData?.good_deal
      ? [{ key: 'good_deal', slug: 'good_deal', label: 'Good Deal' }]
      : []),
  ];

  const router = useRouter();

  const handleChipRemove = useCallback(
    (chipKey) => {
      const updatedFilters = { ...initialData };

      Object.keys(updatedFilters).forEach((key) => {
        const currentVal = updatedFilters[key];

        if (Array.isArray(currentVal)) {
          updatedFilters[key] = currentVal.filter(
            (item) => item.slug !== chipKey,
          );

          if (updatedFilters[key].length === 0) {
            delete updatedFilters[key];
          }
        } else {
          if (key === chipKey) {
            delete updatedFilters[chipKey];
          }
        }
      });

      if (filterConfig[chipKey]?.dependents) {
        filterConfig[chipKey].dependents.forEach((depKey) => {
          delete updatedFilters[depKey];
        });
      }

      router.push(usedCarListingUrlBuilder.buildUrl(updatedFilters));
    },
    [initialData, router, filterConfig],
  );

  return (
    <FilterChips
      chipsData={chipsData}
      locale={locale}
      isMobile={isMobile}
      onClick={handleChipRemove}
      pathOnClear={appPaths.usedCarsListingsSearch}
      renderQuickFilters={renderQuickFilters}
      hideChipKeys={hideChipKeys}
      onNonQuickChipClick={onNonQuickChipClick}
    />
  );
};

export default UsedCarsFilterChips;
