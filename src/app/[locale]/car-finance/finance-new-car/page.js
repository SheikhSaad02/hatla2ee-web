import HeroSectionContainer from '@/components/common/heroSection/heroSection';
import Text from '@/components/common/text';
import PageLayout from '@/components/layout/pageLayout';
import { getTranslations } from 'next-intl/server';
import { appPaths, BASE_URL } from '@/constants';
import { isMobileServer } from '@/utils/serverFunctions';
import CarFinanceForm from '@/components/car-finance/car-finance-form';
import { getAsset, generateHreflangAlternates } from '@/utils/general';
import NextImage from '@/components/common/nextImage';
import { decodeSearchParams } from '@/utils/url';
const mapping = {
  new: {
    titleKey: 'NewCarFinanceTitle',
    descriptionKey: 'NewCarFinanceDescription',
    pathKey: 'carFinance',
    pageTitle: 'Calculate New Car Finance',
  },
  used: {
    titleKey: 'UsedCarFinanceTitle',
    descriptionKey: 'UsedCarFinanceDescription',
    pathKey: 'carFinanceUsed',
    pageTitle: 'Calculate Used Car Finance',
  },
};
export async function generateMetadata({ params, searchParams }) {
  const { locale } = await params;
  const { type } = decodeSearchParams(await searchParams);
  const t = await getTranslations({ locale, namespace: 'metadata' });
  const languages = await generateHreflangAlternates();
  return {
    title: t(mapping[type].titleKey),
    description: t(mapping[type].descriptionKey),
    alternates: {
      canonical: `${BASE_URL}/${locale}${appPaths[mapping[type].pathKey]}`,
      languages,
    },
  };
}
const CarFinance = async ({ params, searchParams }) => {
  const { locale } = await params;
  const { type } = decodeSearchParams(await searchParams);
  const t = await getTranslations({ locale, namespace: 'carFinance' });
  const isMobile = await isMobileServer();
  const renderBanner = () => {
    return (
      <HeroSectionContainer
        imageSrc={
          !isMobile
            ? getAsset(`/assets/landing/financing-landing-banner-web.webp`)
            : getAsset('/assets/landing/financing-landing-banner-mweb.webp')
        }
        imageClassName="object-[50%_80%]"
        className="items-start md:items-center"
      >
        <div className="w-full text-white pt-16 md:pt-0">
          <div className="flex flex-col gap-2 mb-2 md:mb-15">
            <h1 className="heroHeading ">{t(mapping[type].pageTitle)}</h1>
            <Text className="hidden md:block md:text-xl lg:mb-5">
              {t('Simple, flexible plans designed to fit your budget')}
            </Text>
            <Text
              className="uppercase italic flex items-center gap-1"
              weight="bold"
            >
              {isMobile ? t('through') : t('Finance through')}{' '}
              <NextImage
                src={getAsset(
                  '/assets/sell-car-banner/fast-track-logo-blue.webp',
                )}
                alt="Fast Track"
                width={isMobile ? 82 : 100}
                height={isMobile ? 58 : 64}
              />
            </Text>
          </div>
        </div>
      </HeroSectionContainer>
    );
  };

  return (
    <PageLayout route="default">
      {renderBanner()}
      <CarFinanceForm />
    </PageLayout>
  );
};

export default CarFinance;
