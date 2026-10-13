import { getLocale, getTranslations } from 'next-intl/server';

import { Breadcrumbs } from '@/components/common/breadcrumbs';

import MaintenanceCenterCities from '@/components/maintenance-center/maintenance-center-cities';
import { MaintenanceCenterPageStrategy } from '@/services/seoStrategy/maintenancePage';
import MantainenanceCenterBrands from '@/components/maintenance-center/maintenance-brands';
import MantainenceCenters from '@/components/maintenance-center/maintenance-center';
import PageLayout from '@/components/layout/pageLayout';
import Text from '@/components/common/text';
import {getLocaleString } from '@/utils/general';
import { getMaintenanceCenterBrands } from '@/apis/maintenance-brands';
import { getMaintenanceCenterData } from '@/apis/maintenance-center';
import { isMobileServer } from '@/utils/serverFunctions';
import { PageTitle } from '@/components/common/pageTitle/pageTitle';
import { ConditionalSuspense as Suspense } from '@/components/common/ConditionalSuspense';
import { MaintenanceCenterCitiesSkeleton, MakeModelTabsSkeleton } from '@/components/common/loading';
import { decodeSearchParams } from '@/utils/url';

export async function generateMetadata({ params, searchParams }) {
  const { locale, slug } = await params;
  const dataParams = await params;
  const queryParams = decodeSearchParams(await searchParams);
  const maintenanceCenterData = await getMaintenanceCenterData(
    queryParams?.page,
    null,
    dataParams?.slug,
  );

  const listingsPage = new MaintenanceCenterPageStrategy({
    language: locale,
    pageType: 'city',
    data: {
      locationSlug: maintenanceCenterData?.location?.slug,
      locationLabel: getLocaleString(
        maintenanceCenterData?.location,
        'title',
        locale,
      ),
      page: queryParams?.page,
      maintenanceCentersCount:
        maintenanceCenterData?.maintenanceCenters?.length,
    },
    absoluteTitle: true,
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

const MaintainenceCenterCityPage = async ({ params, searchParams }) => {
  const dataParams = await params;
  const queryParams = decodeSearchParams(await searchParams);
  const brandsData = await getMaintenanceCenterBrands(
    {
      location_slug: dataParams?.slug,
    },
    `city/${dataParams?.slug}/`,
  );
  const maintenanceCenterData = await getMaintenanceCenterData(
    queryParams?.page,
    null,
    dataParams?.slug,
  );
  const locale = await getLocale();
  const t = await getTranslations('common');
  const isMobile = await isMobileServer();

  const cityPageSeo = new MaintenanceCenterPageStrategy({
    language: locale,
    data: {
      locationsArray: maintenanceCenterData?.location?.breadcrumbs,
      locationSlug: dataParams?.slug,
      locationLabel: getLocaleString(
        maintenanceCenterData?.location,
        'title',
        locale,
      ),
    },
    pageType: 'city',
  });

  const breadCrumbs = await cityPageSeo.generateBreadcrumbs();

  return (
    <PageLayout
      route="maintenance-center"
      breadCrumbsList={breadCrumbs}
      pageTitle={t('carMaintenanceCentersInLocation', {
        location: getLocaleString(
          maintenanceCenterData?.location,
          'title',
          locale,
        ),
      })}
    >
      <Suspense fallback={<MakeModelTabsSkeleton />}>
        <MantainenanceCenterBrands
          brandsData={brandsData}
          title={'Brands'}
          isMobile={isMobile}
        />
      </Suspense>

      <Suspense fallback={<MaintenanceCenterCitiesSkeleton isMobile={isMobile} />}>
        <MaintenanceCenterCities locationSlug={dataParams?.slug} />
      </Suspense>

      <MantainenceCenters maintenanceCenterData={maintenanceCenterData} />
    </PageLayout>
  );
};
export default MaintainenceCenterCityPage;
