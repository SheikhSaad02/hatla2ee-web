import MyGarage from '@/components/car-maintenance/my-garage/myGarage';
import PageLayout from '@/components/layout/pageLayout';
import {
  CAR_MAINTENANCE_PAGE_TYPES,
  getCarMaintenanceSeo,
} from '@/services/seoStrategy/carMaintenancePage';
import { isMobileServer } from '@/utils/serverFunctions';
import { getTranslations } from 'next-intl/server';

export async function generateMetadata() {
  return {
    robots: {
      index: false,
      follow: false,
    },
  };
}

export default async function CarMaintenanceMyGaragePage({ params }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'carMaintenance' });
  const isMobile = await isMobileServer();
  const seoData = await getCarMaintenanceSeo(locale, {
    pageType: CAR_MAINTENANCE_PAGE_TYPES.MY_GARAGE,
  });

  return (
    <PageLayout
      breadCrumbsList={seoData.breadcrumbs}
      pageTitle={t('my_garage_title')}
      pageDescription={
        <p className="mt-1 text-xs text-gray-600 md:text-base max-md:px-4 max-md:pb-2">
          {t('my_garage_subtitle')}
        </p>
      }
    >
      <MyGarage isMobile={isMobile} />
    </PageLayout>
  );
}
