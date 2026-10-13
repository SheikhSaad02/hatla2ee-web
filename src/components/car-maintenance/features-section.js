import { getCarMaintenanceFeaturesData } from '@/components/car-maintenance/data';
import ServiceCard from '@/components/common/serviceCard/serviceCard';
import ClickEventTracker from '@/services/analyticsService/clickTracker';
import { PAGE_TYPES } from '@/services/analyticsService/constants';
import { isMobileServer } from '@/utils/serverFunctions';
import { getLocale } from 'next-intl/server';

export default async function CarMaintenanceFeaturesSection() {
  const locale = await getLocale();
  const { sectionTitle, items } = await getCarMaintenanceFeaturesData(locale);
  const isMobile = await isMobileServer();

  return (
    <section>
      <h2 className="sectionHeading">{sectionTitle}</h2>

      <div className="grid grid-cols-2 gap-2 md:grid-cols-2 md:gap-4 lg:grid-cols-4">
        {items.map((item) => (
          <ClickEventTracker
            key={item.id}
            gaEvent="add_my_car_banner_click"
            eventGroup="carMaintenance"
            pageType={PAGE_TYPES.MY_MAINTENANCE_LANDING}
          >
            <ServiceCard
              title={item.title}
              description={!isMobile && item.description}
              image={
                locale === 'ar' && item.imageArabic
                  ? item.imageArabic
                  : item.image
              }
              className="relative flex h-[212px] w-full flex-col justify-between overflow-hidden rounded-2xl max-md:mx-auto max-md:h-[164px] max-md:max-w-[168px]"
              style={{ backgroundColor: item.bgColor }}
              headerClass="h-[80px] shrink-0 gap-0 p-3 pb-0 max-md:h-auto max-md:gap-0.5 "
              titleClassName="text-base  md:text-xs max-md:leading-tight md:text-base"
              descriptionClassName="text-sm font-normal text-gray-700 lg:text-sm pt-1"
              imageClass="mt-auto h-[132px] w-full shrink-0 object-cover object-bottom pb-5 max-sm:h-[64px] max-md:h-[80px] max-md:object-cover max-md:object-bottom max-md:pb-0"
            />
          </ClickEventTracker>
        ))}
      </div>
    </section>
  );
}
