import { getLocale, getTranslations } from 'next-intl/server';
import { redirect } from 'next/navigation';

import { Breadcrumbs } from '@/components/common/breadcrumbs';

import MaintenanceCenterCities from '@/components/maintenance-center/maintenance-center-cities';
import { MaintenanceCenterPageStrategy } from '@/services/seoStrategy/maintenancePage';
import MantainenceCenters from '@/components/maintenance-center/maintenance-center';
import PageLayout from '@/components/layout/pageLayout';
import Text from '@/components/common/text';
import {getLocaleString, sanitizeData } from '@/utils/general';
import { getMaintenanceCenterData } from '@/apis/maintenance-center';
import { isMobileServer } from '@/utils/serverFunctions';
import { PageTitle } from '@/components/common/pageTitle/pageTitle';
import { ConditionalSuspense as Suspense } from '@/components/common/ConditionalSuspense';
import { MaintenanceCenterCitiesSkeleton } from '@/components/common/loading';
import { decodeSearchParams } from '@/utils/url';

export async function generateMetadata({ params, searchParams }) {
  const { locale, name, slug } = await params;
  const { page } = decodeSearchParams(await searchParams);
  const maintenanceCenterData = await getMaintenanceCenterData(1, name, slug);

  const listingsPage = new MaintenanceCenterPageStrategy({
    language: locale,
    pageType: 'cityAndBrand',
    data: {
      makeData: getLocaleString(maintenanceCenterData?.make, 'label', locale),
      locationLabel: getLocaleString(
        maintenanceCenterData?.location,
        'title',
        locale,
      ),
      page,
      maintenanceCentersCount:
        maintenanceCenterData?.maintenanceCenters?.length,
    },
    absoluteTitle: true,
    maintenanceCentersCount: maintenanceCenterData?.maintenanceCenters?.length,
  });

  const title = await listingsPage.generateMetaTitle();
  const description = await listingsPage.generateMetaDescription();
  const canonical = await listingsPage.generateCanonical();
  const robots = await listingsPage.getRobotsTags();
  const languages = await listingsPage.generateLanguages();
  return {
    title: title,
    description: description,
    alternates: {
      canonical,
      languages,
    },
    robots: robots,
  };
}

const BrandAndCityMaintenancePage = async ({ params, searchParams }) => {
  const dataParams = await params;
  const queryParams = decodeSearchParams(await searchParams);
  const maintenanceCenterData = await getMaintenanceCenterData(
    queryParams?.page || 1,
    dataParams?.name,
    dataParams?.slug,
  );
  const t = await getTranslations('common');
  const locale = await getLocale();
  const isMobile = await isMobileServer();

  //if maintenanceCenterData is empty obj then redirect to /city/slug page
  if (Object.keys(await sanitizeData(maintenanceCenterData)).length === 0) {
    redirect(`/${locale}/maintenances-center/city/${dataParams?.slug}`);
  }

  const brandAndCitySeo = new MaintenanceCenterPageStrategy({
    language: locale,
    data: {
      locationsArray: maintenanceCenterData?.location?.breadcrumbs,
      makeData: maintenanceCenterData?.make,
    },
    pageType: 'cityAndBrand',
  });
  const breadCrumbs = await brandAndCitySeo.generateBreadcrumbs();

  return (
    <PageLayout
      route="maintenance-center"
      breadCrumbsList={breadCrumbs}
      pageTitle={t('carMaintenanceCentersMakeInLocation', {
        make: getLocaleString(maintenanceCenterData?.make, 'label', locale),
        location: getLocaleString(
          maintenanceCenterData?.location,
          'title',
          locale,
        ),
      })}
    >
      <Suspense
        fallback={<MaintenanceCenterCitiesSkeleton isMobile={isMobile} />}
      >
        <MaintenanceCenterCities
          locationSlug={dataParams?.slug}
          makeSlug={dataParams?.name}
          suffixPath={`brand/${dataParams?.name}`}
        />
      </Suspense>
      <MantainenceCenters maintenanceCenterData={maintenanceCenterData} />
    </PageLayout>
  );
};
export default BrandAndCityMaintenancePage;
