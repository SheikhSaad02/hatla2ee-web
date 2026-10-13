import { getLocale, getTranslations } from 'next-intl/server';

import { getMaintenanceCenterBrands } from '@/apis/maintenance-brands';
import { getMaintenanceCenterData } from '@/apis/maintenance-center';
import {
  MaintenanceCenterCitiesSkeleton,
  MakeModelTabsSkeleton,
} from '@/components/common/loading';
import Text from '@/components/common/text';
import PageLayout from '@/components/layout/pageLayout';
import MantainenanceCenterBrands from '@/components/maintenance-center/maintenance-brands';
import MantainenceCenters from '@/components/maintenance-center/maintenance-center';
import MaintenanceCenterCities from '@/components/maintenance-center/maintenance-center-cities';
import TotalEnergyCenterBanner from '@/components/maintenance-center/total-energy-center';
import { MaintenanceCenterPageStrategy } from '@/services/seoStrategy/maintenancePage';
import { isMobileServer } from '@/utils/serverFunctions';
import { ConditionalSuspense as Suspense } from '@/components/common/ConditionalSuspense';
import configs from '@/configs';
import { decodeSearchParams } from '@/utils/url';

export async function generateMetadata({ params, searchParams }) {
  const { locale } = await params;
  const { page } = decodeSearchParams(await searchParams);
  const listingsPage = new MaintenanceCenterPageStrategy({
    language: locale,
    data: { page },
    pageType: 'listings',
    absoluteTitle: true,
  });

  const title = await listingsPage.generateMetaTitle();
  const description = await listingsPage.generateMetaDescription();
  const canonical = await listingsPage.generateCanonical();
  const languages = await listingsPage.generateLanguages();
  return {
    title: title,
    description: description,
    alternates: {
      canonical,
      languages,
    },
  };
}

export default async function MaintenanceCenterPage({ params, searchParams }) {
  const dataParams = decodeSearchParams(await searchParams);
  const t = await getTranslations('common');
  const brandsData = await getMaintenanceCenterBrands();
  const maintenanceCenterData = await getMaintenanceCenterData(
    dataParams?.page,
  );
  const locale = await getLocale();
  const isMob = await isMobileServer();
  return (
    <PageLayout
      route="maintenance-center"
      pageTitle={t('Car Maintenance Centers in {country}', {
        country: configs.country[locale].label,
      })}
      pageDescription={
        !isMob && (
          <Text as="p" className="text-sm text-gray-light">
            {t(
              'Authorized and non authorized maintenance centers in {country} for all brands and models including phone numbers and addresses',
              {
                country: configs.country[locale].label,
              },
            )}
          </Text>
        )
      }
    >
      <Suspense fallback={<MakeModelTabsSkeleton />}>
        <MantainenanceCenterBrands
          brandsData={brandsData}
          title={'Brands'}
          isMobile={isMob}
        />
      </Suspense>
      <Suspense
        fallback={<MaintenanceCenterCitiesSkeleton isMobile={isMob} />}
      >
        <MaintenanceCenterCities />
      </Suspense>
      <TotalEnergyCenterBanner locale={locale} />
      <MantainenceCenters maintenanceCenterData={maintenanceCenterData} />
    </PageLayout>
  );
}
