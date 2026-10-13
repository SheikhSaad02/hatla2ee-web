import CarServiceDetails from '@/components/car-maintenance/car-service-details/car-service-details';
import PageLayout from '@/components/layout/pageLayout';
import {
  CAR_MAINTENANCE_PAGE_TYPES,
  getCarMaintenanceSeo,
} from '@/services/seoStrategy/carMaintenancePage';
import { isMobileServer } from '@/utils/serverFunctions';

export default async function CarMaintenanceMaintenanceServicesPage({
  params,
}) {
  const { locale } = await params;
  const isMobile = await isMobileServer();
  const seoData = await getCarMaintenanceSeo(locale, {
    pageType: CAR_MAINTENANCE_PAGE_TYPES.MAINTENANCE_SERVICES,
  });

  return (
    <PageLayout
      route="detail-page"
      breadCrumbsList={seoData.breadcrumbs}
      className="max-md:gap-4 max-md:pt-0"
    >
      <CarServiceDetails isMobile={isMobile} />
    </PageLayout>
  );
}
