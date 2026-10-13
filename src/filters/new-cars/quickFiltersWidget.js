import { QuickFiltersService } from '@/components/listing/newVehicleListings/quick-filters-service';
import FilterTabs from '../filterTabs';
import { getLocale } from 'next-intl/server';
import { isMobileServer } from '@/utils/serverFunctions';
import { ConditionalSuspense as Suspense } from '@/components/common/ConditionalSuspense';
import { QuickFiltersWidgetSkeleton } from '@/components/common/loading';

//Pending: Merge this with used cars - common

const QuickFiltersTabs = async ({ quickFilters, page_type =''}) => {
  const tabs = await quickFilters?.getTabs();
      return <FilterTabs tabs={tabs} page_type={page_type} />;
};

const QuickFiltersWidget = async ({ data, categorySlug, isSearch, isLanding = false, page_type =''}) => {
  const locale = await getLocale();
  const isMobile = await isMobileServer();

  const quickFilters = new QuickFiltersService({
    locale,
    isMobile,
    data,
    categorySlug,
    isLanding,
  });

  const currentState = quickFilters.getCurrentState();

  if (quickFilters.shouldHideWidget(currentState, isSearch)) {
    return null;
  }
  return (
    <Suspense fallback={<QuickFiltersWidgetSkeleton isMobile={isMobile} />}>
      <QuickFiltersTabs quickFilters={quickFilters} page_type={page_type} />
    </Suspense>
  );
};

export default QuickFiltersWidget;
