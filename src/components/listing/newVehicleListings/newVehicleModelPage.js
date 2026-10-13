import CompareCarousel from '@/components/common/comapareModels/comparisonCarousel';
import {
  NewVehicleGenerationPricesSkeleton,
  ReviewsSkeleton,
  TableSkeleton,
  UsedCarsCatalogSkeleton,
} from '@/components/common/loading';
import Reviews from '@/components/common/reviews/reviews';
import SellCarBanner from '@/components/common/sellCarBanner.js';
import VideoReviewsSection from '@/components/common/videoReviewCard/videoReviewCard';
import { NewVehiclePage } from '@/services/seoStrategy/newVehiclePage';
import { getListingTitleByLevel } from '@/utils/listings';
import { getLocaleStringServer, isMobileServer } from '@/utils/serverFunctions';
import { getTranslations } from 'next-intl/server';
import { ConditionalSuspense as Suspense } from '@/components/common/ConditionalSuspense';
import UsedCarsCatalog from '../usedCarListings/usedCarsCatalog';
import NewCarsPriceChanges from './newCarsPriceChanges';
import NewCarsGenerationCard from './newVehicleGenerationCard';
import NewVehiclesModelCatalog from './newVehiclesModelCatalog';
import { isSectionEnabled } from '@/configs';
import { appSections } from '@/constants';
import { PAGE_TYPES } from '@/services/analyticsService/constants';
const NewVehicleModelPage = async ({ listingDetailData, locale }) => {
  const t = await getTranslations('common');
  const newCarsT = await getTranslations('newCar');
  const isMob = await isMobileServer();

  const carSEO = new NewVehiclePage({
    language: locale,
    listingDetailData,
    modelLevelDetail: true,
  });

  const { videoReviews, make, model, generations } = listingDetailData || {};
  const listingTitle = await getListingTitleByLevel({ make, model }, 'model');

  return (
    <>
      <div className="flex flex-col gap-4 lg:gap-6">
        {generations?.map((listing) => (
          <Suspense
            key={listing?.id}
            fallback={<NewVehicleGenerationPricesSkeleton />}
          >
            <NewCarsGenerationCard
              key={listing?.id}
              listing={listing}
              make={listing?.make}
              model={listing?.model}
              generation={listing?.generation}
              isMobile={isMob}
            />
          </Suspense>
        ))}
      </div>

      <VideoReviewsSection title={listingTitle} videos={videoReviews} />

      <Suspense fallback={<UsedCarsCatalogSkeleton isMobile={isMob} />}>
        <UsedCarsCatalog
          title={`${t('Used')} ${await getLocaleStringServer(
            make,
            'label',
          )} ${await getLocaleStringServer(model, 'label')} ${t('for Sale')}`}
          make={make?.slug}
          model={model?.slug}
          queryParams={{ condition: 'used' }}
          linkLabel={`${t('Used')} ${await getLocaleStringServer(
            make,
            'label',
          )} ${await getLocaleStringServer(model, 'label')} ${t('for Sale')}`}
          href={`/car/${make.slug}/${model.slug}?condition=used`}
          pageType={PAGE_TYPES.OFFER_DETAIL}
        />
      </Suspense>

      <Suspense fallback={<UsedCarsCatalogSkeleton isMobile={isMob} />}>
        <CompareCarousel
          makeSlug={make?.slug}
          modelSlug={model?.slug}
          title={t('Compare Models')}
        />
      </Suspense>

      {generations?.length > 0 && (
        <Suspense fallback={<TableSkeleton />}>
          <NewCarsPriceChanges
            title={listingTitle}
            makeSlug={make?.slug}
            modelSlug={model?.slug}
            isMobile={isMob}
            locale={locale}
            listing_category={listingDetailData?.listing_category}
          />
        </Suspense>
      )}

      <SellCarBanner />

      {isSectionEnabled(appSections.REVIEWS) && (
        <Suspense fallback={<ReviewsSkeleton />}>
          <Reviews
            makeSlug={make?.slug}
            modelSlug={model?.slug}
            // year={generations?.[0]?.launch_year} //BE Requirement to remove year to match as on prod
          />
        </Suspense>
      )}

      <Suspense fallback={<UsedCarsCatalogSkeleton isMobile={isMob} />}>
        <UsedCarsCatalog
          title={t('Available Now For Sale')}
          make={make?.slug}
          model={model?.slug}
          queryParams={{ condition: 'new' }}
          pageType={PAGE_TYPES.OFFER_DETAIL}
          linkLabel={`${t('New')} ${await getLocaleStringServer(
            make,
            'label',
          )} ${await getLocaleStringServer(model, 'label')} ${t('for Sale')}`}
          href={`/car/${make.slug}/${model.slug}?condition=new`}
        />
      </Suspense>

      <Suspense fallback={<UsedCarsCatalogSkeleton isMobile={isMob} />}>
        <NewVehiclesModelCatalog
          title={
            (await getLocaleStringServer(make, 'label')) +
            ' ' +
            newCarsT('new_vehicle', {
              vehicle: newCarsT(
                `${listingDetailData?.listing_category?.slug}-plural`,
              ),
            })
          }
          make={make?.slug}
          pageType={PAGE_TYPES?.NEW_CAR_MODEL}
          pageSection={`${make?.slug}_new_cars`}
          vehicleType={listingDetailData?.listing_category?.slug}
        />
      </Suspense>
    </>
  );
};

export default NewVehicleModelPage;
