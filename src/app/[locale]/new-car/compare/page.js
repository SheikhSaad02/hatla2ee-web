import { Breadcrumbs } from '@/components/common/breadcrumbs';
import HeroSectionContainer from '@/components/common/heroSection/heroSection';
import { AllComparisonsSkeleton } from '@/components/common/loading';
import { MoreSectionsCarousel } from '@/components/common/moreSectionsCarousel/more-sections-carousel';
import SellCarBanner from '@/components/common/sellCarBanner.js';
import Text from '@/components/common/text';
import AllComparisons from '@/components/compare/allComparisons';
import CompareHeroSection from '@/components/compare/compareHeroSection';
import PageLayout from '@/components/layout/pageLayout';
import { vehicleSlugLabel } from '@/constants';
import { ComparisonPageSEOStrategy } from '@/services/seoStrategy/comparisonPage';
import { isMobileServer } from '@/utils/serverFunctions';
import { getTranslations } from 'next-intl/server';
import { ConditionalSuspense as Suspense } from '@/components/common/ConditionalSuspense';
import { decodeSearchParams } from '@/utils/url';
import configs from '@/configs';

async function getSEOData(locale, page, vehicle) {
  const seoStrategy = new ComparisonPageSEOStrategy({
    language: locale,
    page: page,
    vehicle: vehicle,
  });
  return seoStrategy.generateLandingPageSEO();
}

export async function generateMetadata({ params, searchParams }) {
  const { locale } = await params;
  const sp = decodeSearchParams(await searchParams);
  const page = sp.page;
  const vehicle = sp.vehicle || 'car';
  const seoData = await getSEOData(locale, page, vehicle);

  return {
    title: seoData.title,
    description: seoData.description,
    alternates: {
      canonical: seoData.canonical,
      languages: seoData.languages,
    },
    openGraph: seoData.openGraph,
  };
}

export default async function NewCarComparePage({ params, searchParams }) {
  const { locale } = await params;
  const sp = decodeSearchParams(await searchParams);
  const page = sp.page || 1;
  const vehicle = sp.vehicle || 'car';
  const t = await getTranslations({ locale, namespace: 'carComparisonSeo' });
  const isMobile = await isMobileServer();

  return (
    <PageLayout route="comparison">
      {page == 1 && (
        <HeroSectionContainer
          containerClassName="bg-gradient-to-b from-[#3160A5] to-[#13253F]"
          className="h-[350px] md:h-[380px] lg:h-[380px] mt-26 md:mt-16 md:mt-0"
        >
          <CompareHeroSection
            isMobile={isMobile}
            vehicleCategorySlug={vehicle}
          />
        </HeroSectionContainer>
      )}

      <Text as="h1" className="font-bold text-base lg:text-3.5xl text-center">
        {t('compareLandingPageH1', { country: configs.country[locale].label })}
      </Text>

      <Suspense fallback={<AllComparisonsSkeleton isMobile={isMobile} />}>
        <AllComparisons page={page ? parseInt(page) : 1} per_page={100} />
      </Suspense>

      <MoreSectionsCarousel />

      <SellCarBanner />
    </PageLayout>
  );
}
