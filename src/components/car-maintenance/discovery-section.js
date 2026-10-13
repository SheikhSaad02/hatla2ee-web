import { getMaintenanceCenterBrands } from '@/apis/maintenance-brands';
import MantainenanceCenterBrands from '@/components/maintenance-center/maintenance-brands';
import MaintenanceCenterCities from '@/components/maintenance-center/maintenance-center-cities';
import configs from '@/configs';
import { isMobileServer } from '@/utils/serverFunctions';
import { getLocale, getTranslations } from 'next-intl/server';
import { ConditionalSuspense as Suspense } from '@/components/common/ConditionalSuspense';
import { MaintenanceCenterCitiesSkeleton } from '@/components/common/loading';

export default async function CarMaintenanceDiscoverySection() {
  const locale = await getLocale();
  const isMobile = await isMobileServer();

  const [t, brandsData] = await Promise.all([
    getTranslations({ locale, namespace: 'common' }),
    getMaintenanceCenterBrands(),
  ]);

  return (
    <section className="space-y-6">
      <h2 className="sectionHeading mb-5">
        {t('Car Maintenance Centers in {country}', {
          country: configs.country[locale].label,
        })}
      </h2>

      <MantainenanceCenterBrands
        brandsData={brandsData}
        title={'Brands'}
        isMobile={isMobile}
        containerClassName="gap-4"
        titleClass="text-sm font-semibold text-gray-700"
      />

      <Suspense
        fallback={<MaintenanceCenterCitiesSkeleton isMobile={isMobile} />}
      >
        <MaintenanceCenterCities />
      </Suspense>
    </section>
  );
}
