import {
  CarNewsSectionSkeleton,
  UsedCarsCatalogSkeleton,
} from '@/components/common/loading';

import { Breadcrumbs } from '@/components/common/breadcrumbs';
import CarNewsSection from '@/components/common/carNewsSection/carNewsSection';
import { ChipWithIcon } from '@/components/common/chip-with-icon/chip-with-icon';
import { FavoriteCarsWrapper } from '@/components/favoriteCars/favoriteCars';
import NewVehiclesModelCatalog from '@/components/listing/newVehicleListings/newVehiclesModelCatalog';
import NextLink from '@/components/common/nextLink';
import PageLayout from '@/components/layout/pageLayout';
import { PageTitle } from '@/components/common/pageTitle/pageTitle';
import ScrollArea from '@/components/common/scrollArea';
import SellCarBanner from '@/components/common/sellCarBanner.js';
import { Separator } from '@/components/ui/separator';
import { ConditionalSuspense as Suspense } from '@/components/common/ConditionalSuspense';
import { appPaths, appSections } from '@/constants';
import { getTranslations } from 'next-intl/server';
import { getYearRange } from '@/utils/date';
import { isMobileServer } from '@/utils/serverFunctions';
import { isSectionEnabled } from '@/configs';
export default async function FavoriteCars({ params }) {
  const { locale } = await params;
  const t = await getTranslations({ namespace: 'common' });
  const isMobile = await isMobileServer();
  const arePricesSectionEnabled = !!(
    isSectionEnabled(appSections.USED_CARS_PRICES) &&
    isSectionEnabled(appSections.NEW_CARS_PRICES)
  );

  return (
    <PageLayout
      route="listings"
    // breadCrumbsList={[
    //   { label: t('Home'), href: '/' },
    //   { label: t('Favorite Cars'), href: '/car-selection' },
    // ]}
    // pageTitle={t('Your Saved Cars')}
    >
      {!isMobile ? (
        <div className="flex flex-col md:gap-2">
          <Breadcrumbs
            list={[
              { label: t('Home'), href: '/' },
              { label: t('Saved Cars'), href: '/car-selection' },
            ]}
          />
          <div className="flex justify-between items-center">
            <PageTitle title={t('Your Saved Cars')} />
            {arePricesSectionEnabled && (
              <div className="flex items-center text-primary gap-3 text-sm">
                <NextLink href={`${appPaths.usedCarPrices}`}>
                  {t('Used Car Prices')}
                </NextLink>
                <div className="h-3">
                  <Separator orientation="vertical" />
                </div>
                <NextLink href={`${appPaths['new-car-prices']}`}>
                  {`${t('New Car Prices')} ${getYearRange()}`}
                </NextLink>
              </div>
            )}
          </div>
        </div>
      ) : (
        <PageTitle title={t('Your Saved Cars')} />
      )}

      <FavoriteCarsWrapper locale={locale} isMobile={isMobile} />

      <SellCarBanner />

      {isMobile && arePricesSectionEnabled && (
        <ScrollArea orientation={'horizontal'}>
          <div className="flex items-start gap-2">
            <ChipWithIcon
              href={`${appPaths.usedCarPrices}`}
              label={t('Used Car Prices')}
              className={'text-primary bg-primary-100 items-center'}
            />
            <ChipWithIcon
              href={`${appPaths['new-car-prices']}`}
              label={`${t('New Car Prices')} ${getYearRange()}`}
              className={'text-primary bg-primary-100 items-center'}
            />
          </div>
        </ScrollArea>
      )}

      <Suspense fallback={<UsedCarsCatalogSkeleton isMobile={isMobile} />}>
        <NewVehiclesModelCatalog title={t('Newly Added Cars')} />
      </Suspense>

      <Suspense fallback={<CarNewsSectionSkeleton isMobile={isMobile} />}>
        <CarNewsSection />
      </Suspense>

      {isMobile && (
        <Breadcrumbs
          list={[
            { label: t('Home'), href: '/' },
            { label: t('Saved Cars'), href: '/car-selection' },
          ]}
        />
      )}
    </PageLayout>
  );
}
