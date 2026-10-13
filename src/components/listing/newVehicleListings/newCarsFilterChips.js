'use client';
import { useRouter } from '@/i18n/navigation';
import { useCallback } from 'react';
import { getChipsFromData } from '@/utils/used-cars/listings';
import FilterChips from '@/components/listing/filterChips/filterChips';
import { buildFilterConfig } from '@/filters/new-cars/filterConfig';
import { useLocale, useTranslations } from 'next-intl';
import { getPagesHrefsForCategorySlug } from '@/utils/new-cars/listings';
import { buildNewVehicleListingUrl } from '@/services/urlBuilder/newCarListingUrl';

/*
  Due: Make this componenet and the used cars filter chips component same,
  since they both serve the same purpose
*/
const NewCarsFilterChips = ({
  initialData,
  isSearch = false,
  isMobile = false,
  categorySlug,
  renderQuickFilters,
}) => {
  const locale = useLocale();
  const t = useTranslations('filters');
  const commonT = useTranslations('common');
  const filterConfig = buildFilterConfig({
    locale,
    initialData,
    t,
  });
  const chipsData = getChipsFromData(initialData, filterConfig, {
    locale,
    commonT,
  });

  const router = useRouter();

  const href = getPagesHrefsForCategorySlug(categorySlug);

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

      // Emits the pretty URL when the remaining filters map to an existing
      // pretty route, else faceted search (empty → category search base).
      router.push(buildNewVehicleListingUrl(updatedFilters, categorySlug));
    },
    [initialData, router, isSearch, categorySlug],
  );

  return (
    <FilterChips
      chipsData={chipsData}
      locale={locale}
      isMobile={isMobile}
      onClick={handleChipRemove}
      pathOnClear={href}
      renderQuickFilters={renderQuickFilters}
    />
  );
};

export default NewCarsFilterChips;
