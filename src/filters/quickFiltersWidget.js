import { QuickFiltersService } from '@/services/elasticsearch/quick-filters-service';
import FilterTabs from './filterTabs';
import { isMobileServer } from '@/utils/serverFunctions';
import { getLocale } from 'next-intl/server';
import { ConditionalSuspense as Suspense } from '@/components/common/ConditionalSuspense';
import { QuickFiltersWidgetSkeleton } from '@/components/common/loading';

const QuickFiltersTabs = async ({ quickFilters, page_type =''}) => {
  const tabs = await quickFilters?.getTabs();
  return <FilterTabs tabs={tabs} page_type={page_type} />;
};

const QuickFiltersWidget = async ({
  data,
  urlArray,
  filter,
  isSearch = true,
  isLanding = false,
  page_type ='',
}) => {
  const isMobile = await isMobileServer();
  const locale = await getLocale();

  const quickFilters = new QuickFiltersService({
    locale,
    isMobile,
    data,
    urlArray,
    filter,
    isSearch,
    isLanding,
  });

  if (quickFilters.shouldHideWidget()) {
    return null;
  }

  return (
    <Suspense fallback={<QuickFiltersWidgetSkeleton isMobile={isMobile} />}>
      <QuickFiltersTabs quickFilters={quickFilters} page_type={page_type} />
    </Suspense>
  );
};

export default QuickFiltersWidget;
