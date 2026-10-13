import { QuickFiltersService } from '@/services/elasticsearch/quick-filters-service';
import { isMobileServer } from '@/utils/serverFunctions';
import FiltersWithData from './filtersWithData';

const Filters = async ({
  initialData,
  locale,
  isSearch,
  categorySlug,
  quickLinks: links,
}) => {
  const isMob = await isMobileServer();
  const quickFilters = new QuickFiltersService({
    locale,
    isMobile: isMob,
    data: initialData,
    categorySlug,
    isSearch,
  });

  const quickLinks = links || (await quickFilters.getNewCarContextualLinks());

  return (
    <FiltersWithData
      initialData={initialData}
      locale={locale}
      isMobile={isMob}
      quickLinks={quickLinks}
      isSearch={isSearch}
      categorySlug={categorySlug}
    />
  );
};
export default Filters;
