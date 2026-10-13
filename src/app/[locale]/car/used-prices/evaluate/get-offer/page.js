import {
  getCookieValue,
  getLocaleStringServer,
  isMobileServer,
} from '@/utils/serverFunctions';
import { getLocale, getTranslations } from 'next-intl/server';
import CarEvaluationCard from '@/components/car-evaluation/car-evaluation-card';
import NewVehiclesModelCatalog from '@/components/listing/newVehicleListings/newVehiclesModelCatalog';
import PageLayout from '@/components/layout/pageLayout';
import { UsedCarPricesTable } from '@/components/car-prices/used-car-prices-table';
import UsedCarsCatalog from '@/components/listing/usedCarListings/usedCarsCatalog';
import configs from '@/configs';
import { cache } from 'react';
import { ConditionalSuspense as Suspense } from '@/components/common/ConditionalSuspense';
import {
  NewlyLaunchedCarsSkeleton,
  CarPricesTableSkeleton,
  UsedCarsCatalogSkeleton,
} from '@/components/common/loading';
import { appPaths } from '@/constants';
import AdBanner from '@/components/googleAd/adBanner';
import StickyAd from '@/components/googleAd/stickyAd';
import { getCarInfoAdUnits } from '@/components/googleAd/adsConfig';
const getEvaluationCookieCached = cache(async () => {
  const cookieValue = await getCookieValue(configs?.evaluate_car_cookie);
  const carEvaluationDetail = cookieValue
    ? JSON.parse(decodeURIComponent(cookieValue))
    : {};
  return carEvaluationDetail;
});

export async function generateMetadata({ params }) {
  const carEvaluationDetail = await getEvaluationCookieCached();
  const { make, model, year } = carEvaluationDetail;
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'metadata' });
  return {
    title: t('carEvaluationOfferTitle', {
      make: await getLocaleStringServer(make, 'label'),
      model: await getLocaleStringServer(model, 'label'),
      year,
    }),
  };
}
export default async function GetOffer() {
  const locale = await getLocale();
  const t = await getTranslations({ locale, namespace: 'common' });
  const trans = await getTranslations({ locale, namespace: 'metadata' });
  const layoutT = await getTranslations({ locale, namespace: 'layout' });
  const carEvaluationDetail = await getEvaluationCookieCached();
  const { make, model, year } = carEvaluationDetail;
  const [makeLabel, modelLabel] = await Promise.all([
    getLocaleStringServer(make, 'label'),
    getLocaleStringServer(model, 'label'),
  ]);
  const isMobile = await isMobileServer();
  const renderEvaluationCard = () => (
    <CarEvaluationCard carEvaluationDetail={carEvaluationDetail} />
  );
  const carDetails = {
    make: make?.slug,
    model: model?.slug,
    year: year,
  };
  const AD_UNITS = getCarInfoAdUnits(isMobile, locale, carDetails);
  return (
    <PageLayout
      route="get-offer"
      pageDescription={renderEvaluationCard()}
      breadCrumbsList={[
        { label: t('Home'), href: appPaths.home },
        { label: trans('Car Evaluation'), href: appPaths.usedPricesEvaluation },
      ]}
    >
      {isMobile && <StickyAd adConfig={AD_UNITS.stickyAd} />}
      {isMobile && renderEvaluationCard()}
      {!!Object.keys(carEvaluationDetail).length && (
        <>
          <Suspense fallback={<CarPricesTableSkeleton isMobile={isMobile} />}>
            <UsedCarPricesTable
              sectionTitle={t('Model Prices By Year')}
              make={make?.slug}
              model={model?.slug}
              locale={locale}
              monthFilter={true}
            />
          </Suspense>
          <AdBanner adConfig={AD_UNITS?.evaluateDetailAd} />
          <Suspense fallback={<UsedCarsCatalogSkeleton isMobile={isMobile} />}>
            <UsedCarsCatalog
              title={`${t('Used')} ${makeLabel} ${modelLabel} ${year}`}
              titleLink={`/car/${make?.slug}/${model?.slug}/year/${year}`}
              make={make?.slug}
              model={model?.slug}
              year={year}
            />
          </Suspense>
          <Suspense fallback={<NewlyLaunchedCarsSkeleton />}>
            <NewVehiclesModelCatalog
              title={`${t('New Cars From ')} ${makeLabel}`}
              make={make?.slug}
            />
          </Suspense>
        </>
      )}
    </PageLayout>
  );
}
