import CarouselSection from '@/components/common/carouselSection/carouselSection';
import NextLink from '@/components/common/nextLink';
import ServiceCard from '@/components/common/serviceCard/serviceCard';
import NewTag from '@/components/common/newTag';
import { getLocale, getTranslations } from 'next-intl/server';
import { isMobileServer } from '@/utils/serverFunctions';
import ClickEventTracker from '@/services/analyticsService/clickTracker';
import { isSectionEnabled } from '@/configs';
import tenantData from '@data';
export async function MoreSectionsCarousel() {
  const locale = await getLocale();
  const t = await getTranslations({ locale, namespace: 'home' });
  const layoutT = await getTranslations({ locale, namespace: 'layout' });
  const isMobile = await isMobileServer();

  if (!tenantData.serviceList?.length) {
    return null;
  }

  return (
    <div>
      <h2 className="sectionHeading">{t('More on Hatla2ee')}</h2>
      <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-4 auto-rows-fr">
        {tenantData.serviceList.map((item, index) => (
          <NextLink
            key={index}
            href={item?.link}
            title={item?.title}
            className={item.featured ? 'col-span-2' : ''}
          >
            <ClickEventTracker
              service={item?.title}
              gaEvent="more_on_hatla2ee_click"
            >
              <ServiceCard
                key={`varient-${index}`}
                title={layoutT(item.title)}
                description={!isMobile ? layoutT(item.description) : null}
                image={
                  locale === 'ar' && item.imageArabic
                    ? item.imageArabic
                    : item.image
                }
                className="flex flex-col h-full w-full"
                headerClass={item.headerClass}
                titleClassName={item.titleClassName}
                imagePlacement={item.featured ? 'background' : 'bottom'}
                style={item.style}
                tag={
                  item.isNew ? <NewTag className={item.tagClassName} /> : null
                }
              />
            </ClickEventTracker>
          </NextLink>
        ))}
      </div>
    </div>
  );
}
