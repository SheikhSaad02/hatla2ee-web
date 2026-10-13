import { getMaintenanceCenterData } from '@/apis/maintenance-center';
import CarouselSection from '@/components/common/carouselSection/carouselSection';
import DealerCard from '@/components/common/dealerCard/dealerCard';
import ViewAllLink from '@/components/common/viewAllLink/viewAllLink';
import { appPaths } from '@/constants';
import { PAGE_TYPES } from '@/services/analyticsService/constants';
import { getAsset, getLocaleString } from '@/utils/general';
import { isMobileServer } from '@/utils/serverFunctions';
import { getLocale, getTranslations } from 'next-intl/server';

export default async function CarMaintenanceCentersPreviewSection() {
  const locale = await getLocale();
  const isMobile = await isMobileServer();

  const [maintenanceT, maintenanceCenterData] = await Promise.all([
    getTranslations({ locale, namespace: 'carMaintenance' }),
    getMaintenanceCenterData(1),
  ]);
  const centers = maintenanceCenterData?.maintenanceCenters?.slice(0, 12) || [];

  if (!centers.length) {
    return null;
  }

  return (
    <section>
      <div className="mb-6 flex items-center justify-between gap-3">
        <h2 className="sectionHeading mb-0">
          {maintenanceT('maintenance_centers')}
        </h2>
        <ViewAllLink
          href={appPaths.maintenanceCenter}
          title={maintenanceT('view_all_maintenance_centers')}
        />
      </div>

      <CarouselSection
        isMobile={isMobile}
        itemBasis="basis-[88%] md:basis-[46%] lg:basis-[31%] xl:basis-[24%]"
        itemClassName="pb-1"
        showDots={isMobile}
        showArrows={!isMobile}
        contentClassName="-ms-2"
      >
        {centers.map((center, index) => (
          <DealerCard
            key={`${center?.href || center?.title}-${index}`}
            title={getLocaleString(center, 'title', locale)}
            location={getLocaleString(center?.location, 'name', locale)}
            phone={{ call: center.phones?.[0] }}
            contactModalTitle={maintenanceT('contact_maintenance_center')}
            image={{
              src:
                center.image ||
                getAsset('/assets/maintenance-placeholder.webp'),
            }}
            href={center.href}
            className="h-full "
            imageClassName={!center.image && 'object-cover'}
            pageType={PAGE_TYPES.MAINTENANCE_CENTERS}
            pageSection="car_maintenance_centers_preview"
          />
        ))}
      </CarouselSection>
    </section>
  );
}
