import { Breadcrumbs } from '@/components/common/breadcrumbs';
import { getMaintenanceCenterLocations } from '@/apis/maintenance-locations';
import NextImage from '@/components/common/nextImage';
import { PageTitle } from '@/components/common/pageTitle/pageTitle';
import PageLayout from '@/components/layout/pageLayout';
import MaintenanceCenterLocations from '@/components/maintenance-center/maintenance-center-locations';
import TotalEnergyCenterBanner from '@/components/maintenance-center/total-energy-center';
import { MaintenanceCenterPageStrategy } from '@/services/seoStrategy/maintenancePage';
import {getAsset, getLocaleString } from '@/utils/general';
import { isMobileServer, isWebViewServer } from '@/utils/serverFunctions';
import { getLocale } from 'next-intl/server';
import { ifError } from '@/utils/ifError';

export async function generateMetadata({ params }) {
  const { locale, id } = await params;
  const data = await getMaintenanceCenterLocations(id);

  const listingsPage = new MaintenanceCenterPageStrategy({
    language: locale,
    pageType: 'detail',
    data: {
      maintenanceCenterName: getLocaleString(
        data?.maintainance_center,
        'name',
        locale,
      ),
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

const MaintenanceCenterDetailPage = async ({ params }) => {
  const dataParams = await params;

  const maintenanceCenterAddressData = await getMaintenanceCenterLocations(
    dataParams?.id,
  );

  ifError(maintenanceCenterAddressData);

  const locale = await getLocale();
  const isMobile = await isMobileServer();
  const isWebView = await isWebViewServer();

  const detailSeoStrategy = new MaintenanceCenterPageStrategy({
    language: locale,
    data: {
      locationSlug:
        maintenanceCenterAddressData?.maintainance_center?.location?.slug,
      locationLabel: getLocaleString(
        maintenanceCenterAddressData?.maintainance_center?.location,
        'name',
        locale,
      ),
    },
    pageType: 'detail',
  });
  const breadCrumbs = await detailSeoStrategy.generateBreadcrumbs();

  const renderPageTitle = () => {
    return (
      !isWebView && (
        <PageTitle
          title={getLocaleString(
            maintenanceCenterAddressData?.maintainance_center,
            'name',
            locale,
          )}
        />
      )
    );
  };

  return (
    <PageLayout
      route="maintenance-center"
      breadCrumbsList={isMobile && breadCrumbs}
    >
      {isMobile ? (
        renderPageTitle()
      ) : (
        <div className="flex items-center gap-9 justify-between -mb-8">
          <div className="flex flex-col gap-2">
            <Breadcrumbs list={breadCrumbs} />
            {renderPageTitle()}
          </div>
          <div className="border rounded-lg overflow-hidden">
            <NextImage
              src={
                maintenanceCenterAddressData?.maintainance_center?.logo ||
                getAsset('/assets/maintenance-placeholder.webp')
              }
              width={isMobile ? 40 : 50}
              height={isMobile ? 40 : 50}
              className="ml-auto h-[90px] w-[122px]"
            />
          </div>
        </div>
      )}

      {maintenanceCenterAddressData?.maintainance_center?.slug ==
        'totalenergies-alex-km59' && (
        <TotalEnergyCenterBanner locale={locale} />
      )}
      <MaintenanceCenterLocations
        data={maintenanceCenterAddressData?.maintainance_center}
        isMobile={isMobile}
      />
    </PageLayout>
  );
};
export default MaintenanceCenterDetailPage;
