import { getLocale, getTranslations } from 'next-intl/server';

import { Breadcrumbs } from '@/components/common/breadcrumbs';

import MaintenanceCenterCities from '@/components/maintenance-center/maintenance-center-cities';
import { MaintenanceCenterPageStrategy } from '@/services/seoStrategy/maintenancePage';
import MantainenceCenters from '@/components/maintenance-center/maintenance-center';
import PageLayout from '@/components/layout/pageLayout';
import Text from '@/components/common/text';
import {getLocaleString } from '@/utils/general';
import { getMaintenanceCenterData } from '@/apis/maintenance-center';
import { isMobileServer } from '@/utils/serverFunctions';
import { PageTitle } from '@/components/common/pageTitle/pageTitle';
import {
  MaintenanceCenterCitiesSkeleton,
  MakeModelTabsSkeleton,
} from '@/components/common/loading';
import { ConditionalSuspense as Suspense } from '@/components/common/ConditionalSuspense';
import configs from '@/configs';
import { decodeSearchParams } from '@/utils/url';

export async function generateMetadata({ params, searchParams }) {
  const { locale, name } = await params;
  const { page } = decodeSearchParams(await searchParams);
  const maintenanceCenterData = await getMaintenanceCenterData(1, name);

  const listingsPage = new MaintenanceCenterPageStrategy({
    language: locale,
    pageType: 'brand',
    data: {
      makeData: getLocaleString(maintenanceCenterData?.make, 'label', locale),
      page,
    },
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

const MaintainenceCenterBrandsPage = async ({ params, searchParams }) => {
  const dataParams = await params;
  const queryParams = decodeSearchParams(await searchParams);
  const isMobile = await isMobileServer();
  const maintenanceCenterData = await getMaintenanceCenterData(
    queryParams?.page,
    dataParams?.name,
  );
  const t = await getTranslations('common');
  const locale = await getLocale();
  const brandSeoStrategy = new MaintenanceCenterPageStrategy({
    language: locale,
    data: {},
    pageType: 'brand',
  });
  const breadCrumbs = await brandSeoStrategy.generateBreadcrumbs();

  return (
    <PageLayout
      route="maintenance-center"
      breadCrumbsList={breadCrumbs}
      pageTitle={t('carMaintenanceCentersMakeInCountry', {
        make: getLocaleString(maintenanceCenterData?.make, 'label', locale),
        country: configs.country[locale].label,
      })}
    >
      <Suspense
        fallback={<MaintenanceCenterCitiesSkeleton isMobile={isMobile} />}
      >
        <MaintenanceCenterCities
          makeSlug={dataParams?.name}
          suffixPath={`brand/${dataParams?.name}`}
        />
      </Suspense>
      <MantainenceCenters maintenanceCenterData={maintenanceCenterData} />
    </PageLayout>
  );
};
export default MaintainenceCenterBrandsPage;
