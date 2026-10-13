import { QuickFiltersService } from '@/services/elasticsearch/quick-filters-service';
import { isMobileServer } from '@/utils/serverFunctions';
import FiltersWithData from './filtersWithData';

const Filters = async ({ initialData, locale, isSearch }) => {
  const isMob = await isMobileServer();

  const quickFilters = new QuickFiltersService({
    locale,
    isMob,
    data: initialData,
  });

  const quickLinks = await quickFilters.getContextualLinks();

  return (
    <FiltersWithData
      initialData={initialData}
      locale={locale}
      isMobile={isMob}
      quickLinks={quickLinks}
      isSearch={isSearch}
    />
  );
};

export default Filters;
