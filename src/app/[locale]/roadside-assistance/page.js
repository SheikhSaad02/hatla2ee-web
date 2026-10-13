import BaseCard from '@/components/common/baseCard/baseCard';
import Button from '@/components/common/button/button';
import { CallIcon } from '@/icons/socials';
import NextImage from '@/components/common/nextImage';
import PageLayout from '@/components/layout/pageLayout';
import SellCarBanner from '@/components/common/sellCarBanner.js';
import ServiceCard from '@/components/common/serviceCard/serviceCard';
import Text from '@/components/common/text';
import { cn } from '@/utils';
import { getTranslations } from 'next-intl/server';
import { isMobileServer } from '@/utils/serverFunctions';
import configs from '@/configs';
import { getAsset } from '@/utils/general';

// export async function generateStaticParams() {
//   return [{ locale: 'en' }, { locale: 'ar' }];
// }
// export const dynamic = 'force-static';
export async function generateMetadata({ params }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'metadata' });
  return {
    title: t('roadsideAssistanceTitle'),
    description: t('roadsideAssistanceDescription'),
  };
}
const RoadsideAssistance = async ({ params }) => {
  const { locale } = await params;
  const isMobile = await isMobileServer();

  const t = await getTranslations({ locale, namespace: 'roadsideAssistance' });
  const services = [
    {
      image: getAsset('/assets/tow-truck/tow-truck.webp'),
      label: t('Tow Trucks'),
    },
    {
      image: getAsset('/assets/tow-truck/tyres.webp'),
      label: t('Tires Changing'),
    },
    {
      image: getAsset('/assets/tow-truck/battery.webp'),
      label: t('Battery Charging'),
    },
    {
      image:
        locale === 'ar'
          ? getAsset('/assets/tow-truck/meter-ar.webp')
          : getAsset('/assets/tow-truck/meter.webp'),
      label: t('Fuel Delivery'),
      imageClass: 'transform-none',
    },
  ];

  const renderBanner = () => {
    return (
      <>
        <BaseCard className="relative w-full h-[380px] md:h-auto flex flex-col justify-start md:justify-center  rtl:items-end gap-0 p-3 md:p-8 lg:px-13 lg:py-18 border-none bg-no-repeat bg-bottom bg-primary-50 md:bg-gray-50 bg-contain md:bg-cover md:bg-right flipX overflow-hidden">
          <div className="flipX max-w-[45rem] z-10">
            <div className="flex flex-col ">
              <div className="mb-2 md:mb-5">
                <Text
                  as="h1"
                  className={cn(
                    'text-base md:text-3xl lg:text-3.5xl mb-2 font-bold',
                  )}
                >
                  {t('Tow Truck - Quick Roadside Assistance in {country}', {
                    country: configs.country[locale].label,
                  })}
                </Text>
                <Text as="p" className="text-2xs md:text-sm">
                  {t(
                    'Hatla2ee Quick roadside assistance if you need a tow truck on ring road or tow truck on the desert road or tow truck in the north coast or any where in {country}, Even if you need to charge your car battery on the road or we can deliver fuel',
                    {
                      country: configs.country[locale].label,
                    },
                  )}
                </Text>
              </div>

              <div className="flex items-center gap-1.5 mb-4  md:mb-7">
                <Text className="text-xs font-semibold md:font-bold">
                  {t('In collaboration with')}
                </Text>
                <NextImage
                  src={getAsset('/assets/may-day-logo.png')}
                  width={98}
                  height={20}
                  alt="Showroom Cover"
                  className="w-24 h-5"
                />
              </div>
            </div>
            <Button
              className="px-6 w-full md:w-auto"
              icon={<CallIcon className="size-5 flipX" />}
              href={`tel:01276192726`}
              size="xxl"
            >
              {t('Call Now') + ' - '}
              <span dir="ltr">0127 61 92 726</span>
            </Button>
          </div>
          <NextImage
            src={
              isMobile
                ? getAsset('/assets/tow-truck/tow-truck-banner-sm.webp')
                : getAsset('/assets/tow-truck/tow-truck-banner.webp')
            }
            width={1200}
            height={367}
            className={
              'absolute w-full h-full inset-0 object-bottom object-contain md:object-cover '
            }
          />
        </BaseCard>
      </>
    );
  };
  return (
    <PageLayout
      route="tow-trucks"
      pageTitle={isMobile && t('Tow Trucks')}
      className="pt-0 md:pt-0"
    >
      {renderBanner()}
      <div className="grid grid-cols-2 md:flex gap-4">
        {services?.map((item, index) => (
          <ServiceCard
            key={`service-${index}`}
            title={item.label}
            image={item.image}
            className="flex flex-col w-full bg-[#F7F9FA]"
            headerClass="h-[50px]"
            imageClass={cn(item.imageClass || 'flipX')}
          />
        ))}
      </div>

      <SellCarBanner locale={locale} />
    </PageLayout>
  );
};

export default RoadsideAssistance;
