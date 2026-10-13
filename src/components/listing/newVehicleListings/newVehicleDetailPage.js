import {
  MakeModelTabsCompactSkeleton,
  ReviewsSkeleton,
  TableSkeleton,
  UsedCarsCatalogSkeleton,
} from '@/components/common/loading';
import React from 'react';
import { ConditionalSuspense as Suspense } from '@/components/common/ConditionalSuspense';
import {
  getLocaleStringServer,
  isMobileServer,
  isWebViewServer,
} from '@/utils/serverFunctions';

import BackButton from '@/components/common/backButton';
import { BottomBar } from '@/components/common/bottomBar';
import { Breadcrumbs } from '@/components/common/breadcrumbs';
import { ChevronLeftIcon } from 'lucide-react';
import DifferenceWithOtherClasses from '@/components/common/differenceWithOtherClasses/differenceWithOtherClasses';
import FeaturesSection from '@/components/common/featuresSection/featuresSection';
import FinancingSection from '@/components/common/financingSection/financingSection';
import ImageGallery from '@/components/common/imageGallery';
import ListingActions from '@/components/common/listingActions/listingActions';
import ListingOverview from '@/components/common/listingOverview/listingOverview';
import MakeModelTabs from '@/components/home/make-model-tabs';
import NewCarListingActions from '@/components/common/newCarListingActions/newCarListingActions';
import NewCarsGenerationCard from './newVehicleGenerationCard';
import NewCarsPriceChanges from './newCarsPriceChanges';
import NewListingActions from './newListingActions';
import { NewVehiclePage } from '@/services/seoStrategy/newVehiclePage';
import NewVehiclesModelCatalog from './newVehiclesModelCatalog';
import NextImage from '@/components/common/nextImage';
import Reviews from '@/components/common/reviews/reviews';
import SpecificationGrid from '@/components/common/specificationGrid/specificationGrid';
import StickyDetialInfo from '@/components/common/stickyDetialInfo/stickyDetialInfo';
import Text from '@/components/common/text';
import UsedCarsCatalog from '../usedCarListings/usedCarsCatalog';
import VideoReviewsSection from '@/components/common/videoReviewCard/videoReviewCard';
import { cn } from '@/utils';
import {
  fetchDifferenceWithOtherClasses,
  fetchNewListingModelLevelDetail,
} from '@/apis/new-car';
import { getPriceChanges } from '@/apis/new-car-prices';
import { getListingTitleByLevel } from '@/utils/listings';
import { getTranslations } from 'next-intl/server';
import GalleryModalHeader from '@/components/common/imageGallery/modalHeader';
import { getListingJumpLinks, listingJumpLinks } from '@/data/detail';
import { appPaths, appSections } from '@/constants';
import AdBanner from '@/components/googleAd/adBanner';
import StickyAd from '@/components/googleAd/stickyAd';
import { getCarInfoAdUnits } from '@/components/googleAd/adsConfig';
import { isSectionEnabled } from '@/configs';
import { getAsset } from '@/utils/general';
import { PAGE_TYPES } from '@/services/analyticsService/constants';
import { getRecentUsedCarsCached } from '@/services/elasticsearch/listings-service';
import LeadCampaignActions from '@/components/common/newCarListingActions/leadCampaignActions';
import { extractFlatCtaTrackingItem } from '@/utils/listings';
import { CAR_PRICE_THRESHOLD, MIN_FINANCING_YEAR } from '@/data/car-finance';

const NewVehicleDetailPage = async ({
  variantId,
  locale,
  listingDetailData,
}) => {
  const isMob = await isMobileServer();
  const t = await getTranslations('common');
  const newCarsT = await getTranslations('newCar');
  const isWebView = await isWebViewServer();
  const carSEO = new NewVehiclePage({
    language: locale,
    listingDetailData,
    modelLevelDetail: false,
  });
  const displayClickTrackingItem = extractFlatCtaTrackingItem({
    ...listingDetailData,
  });
  const seoData = await carSEO.generateSEO();

  const {
    features,
    price,
    specificationList,
    specifications,
    generation_variant,
    images,
    tags,
    make,
    launch_year,
    generation,
    model,
    variant,
    videoReviews,
    brochure_url,
    id,
    priceNotAvailable,
  } = listingDetailData;
  const listings = await fetchNewListingModelLevelDetail(
    make?.slug,
    model?.slug,
    launch_year,
  );
  const { generations } = listings || {};
  const bodyType = specifications?.find(
    (spec) => spec?.label === 'Body Type',
  )?.value;
  const carDetails = {
    make: make?.slug,
    model: model?.slug,
    year: launch_year,
    condition: 'new',
    imported: listingDetailData?.imported?.slug,
    category: listingDetailData?.listing_category?.slug,
    body: bodyType,
  };
  const listingTitle = await getListingTitleByLevel(
    { make, model, variant, year: launch_year },
    'variant',
  );

  const listingTitleModelLevel = await getListingTitleByLevel(
    { make, model, variant, year: launch_year },
    'model',
  );
  const galleryImages = (() => {
    if (!images?.length) return images;
    const imageAlt = seoData?.h1 ?? '';
    return images.map((img, i) => (i === 0 ? { ...img, alt: imageAlt } : img));
  })();
  const category = listingDetailData?.listing_category?.slug;
  const AD_UNITS = getCarInfoAdUnits(isMob, locale, carDetails);

  const [
    { data: priceChangesForJump },
    differenceClassesForJump,
    availableNowForSale,
  ] = await Promise.all([
    getPriceChanges({
      makeSlug: make?.slug,
      modelSlug: model?.slug,
      variantId,
      vehicle: category,
    }),
    fetchDifferenceWithOtherClasses(variantId),
    getRecentUsedCarsCached({
      make: make?.slug,
      model: model?.slug,
      queryParams: { condition: 'new' },
    }),
  ]);

  const isFinancingEligible =
    isSectionEnabled(appSections.FINANCING) &&
    category === 'car' &&
    Number(launch_year) >= MIN_FINANCING_YEAR &&
    Number(price) >= CAR_PRICE_THRESHOLD;

  const jumpLinkShow = {
    carDetails: specifications?.length > 0,
    features: features?.length > 0,
    financing: isFinancingEligible,
    differenceOtherClasses: differenceClassesForJump?.length > 0,
    classesOfficialPrices: generations?.[0]?.variantsTableData?.length > 0,
    priceChanges:
      Array.isArray(priceChangesForJump) && priceChangesForJump.length > 0,
    availableNowForSale: availableNowForSale.length > 0,
    latestNewCars: true,
  };
  const renderGalleryHeader = () => {
    return (
      <GalleryModalHeader
        title={seoData?.h1}
        specificationList={specificationList}
        price={price}
        isMob={isMob}
        min_deposit={generation_variant?.min_deposit}
        min_installment={generation_variant?.min_installment}
        darkMode
      />
    );
  };

  const renderListingActions = () => {
    return (
      <ListingActions
        title={listingTitle}
        specificationList={specificationList}
        image={images?.[0]}
        isMob={isMob}
        id={variantId}
        className={'flex gap-2'}
        showWishlist={false}
        btnclassName="h-8"
      />
    );
  };

  const renderLeadCampaignActions = (showCard = false) => {
    return (
      <LeadCampaignActions
        entityType="NewListing"
        source="detail"
        entityId={id}
        isMob={isMob}
        make={make?.slug}
        model={model?.slug}
        showCard={showCard}
        launch_year={launch_year}
      />
    );
  };

  const renderNewListingActions = (darkMode) => {
    return (
      <div id="listing-actions">
        <NewCarListingActions
          item={{
            id: id,
            title: listingTitle,
            image: images?.[0]?.medium,
            brochure_url,
            href: `${
              appPaths[
                `new-${listingDetailData?.listing_category?.slug}-compare-terazes`
              ]
            }/${variantId}`,
          }}
          darkMode={darkMode}
        />
      </div>
    );
  };

  const renderImageGallery = () => {
    if (images?.length > 0) {
      return (
        <ImageGallery
          images={galleryImages}
          options={{}}
          tags={tags}
          isMob={isMob}
          modalHeader={renderGalleryHeader()}
          listingData={displayClickTrackingItem}
        />
      );
    } else {
      return (
        <NextImage
          src={getAsset('/assets/car-placeholder.svg')}
          alt="Main image"
          className={cn(
            'w-full h-[375] md:h-[400] object-cover',
            isMob && 'breakout',
          )}
          width={400}
          height={isMob ? 375 : 400}
        />
      );
    }
  };
  return (
    <>
      {isMob && <StickyAd adConfig={AD_UNITS.stickyAd} />}
      <StickyDetialInfo
        title={seoData?.h1}
        id={id}
        mobileElement={listingJumpLinks.GALLERY_MOBILE}
        image={images?.[0]}
        specificationList={specificationList}
        price={price}
        showWishlist={false}
        type="new"
        href={`${
          appPaths[
            `new-${listingDetailData?.listing_category?.slug}-compare-terazes`
          ]
        }/${variantId}`}
        brochure_url={brochure_url}
        webElement="listing-overview"
        jumpLinks={getListingJumpLinks(t, jumpLinkShow, {
          differenceOtherClassesLabel: newCarsT(
            'Difference with Other Classes',
          ),
          classesOfficialPricesLabel: newCarsT('Classes - Official Prices'),
          priceChangesLabel: `${t('Latest Changes in ')}${listingTitleModelLevel} ${t('Prices')}`,
        })}
        priceNotAvailable={priceNotAvailable}
      />
      {isMob && (
        <>
          <div id={listingJumpLinks.GALLERY_MOBILE}>{renderImageGallery()}</div>
          <BackButton
            variant="glassy"
            className="absolute top-4 start-2 flipX h-8 w-8"
          >
            <ChevronLeftIcon />
          </BackButton>

          <div className="flex top-4 gap-1 absolute end-2">
            {renderListingActions()}
          </div>
        </>
      )}

      <div className="flex flex-col gap-2">
        {!isMob && (
          <div className="flex justify-between items-center">
            <Breadcrumbs list={seoData?.breadcrumbs} />
            {renderListingActions()}
          </div>
        )}

        <div id="listing-overview">
          <ListingOverview
            title={seoData?.h1}
            specificationList={specificationList}
            price={price}
            isMob={isMob}
            min_deposit={generation_variant?.min_deposit}
            min_installment={generation_variant?.min_installment}
            priceNotAvailable={priceNotAvailable}
          />
        </div>
        {!isMob && renderImageGallery()}
      </div>

      <div className="flex flex-col gap-8 lg:grid lg:grid-cols-3 lg:gap-3">
        <div className="flex flex-col gap-8 lg:gap-14 col-span-2 ltr:lg:pr-13 rtl:lg:pl-13">
          {isMob && renderLeadCampaignActions()}

          <SpecificationGrid
            title={`${newCarsT(
              `${listingDetailData?.listing_category?.slug}`,
            )} ${t('Details')}`}
            data={specifications}
          />
          <FeaturesSection title={t('Features')} featuresList={features} />
        </div>
        <div className="flex flex-col gap-4">
          {!isMob && renderNewListingActions()}
          {!isMob && renderLeadCampaignActions(true)}
          {isSectionEnabled(appSections.REVIEWS) && (
            <Suspense fallback={<ReviewsSkeleton />}>
              <Reviews
                makeSlug={make?.slug}
                modelSlug={model?.slug}
                // year={launch_year} //BE Requirement to remove year to match as on prod
              />
            </Suspense>
          )}
          {!isMob && <AdBanner adConfig={AD_UNITS?.carInfoDetailMiddleAd} />}
        </div>
      </div>
      {isMob && <AdBanner adConfig={AD_UNITS?.carInfoDetailMiddleAd} />}
      {isFinancingEligible && (
        <FinancingSection
          showMarketingColumn={!isMob}
          listingPrice={price}
          id={variantId}
          condition={{ slug: 'new' }}
          carDetail={{
            brand: make,
            model,
            year: { label: launch_year },
            class: variant,
          }}
        />
      )}

      <Suspense fallback={<UsedCarsCatalogSkeleton isMobile={isMob} />}>
        <DifferenceWithOtherClasses
          title={newCarsT('Difference with Other Classes')}
          make={make?.slug}
          model={model?.slug}
          variantId={variantId}
          pageType={PAGE_TYPES.NEW_VEHICLE_DETAIL}
        />
      </Suspense>
      {generations?.[0]?.variantsTableData?.length > 0 && (
        <Suspense fallback={<TableSkeleton />}>
          <div id={listingJumpLinks.CLASSES_OFFICIAL_PRICES}>
            <Text as="h2" className="sectionHeading">
              {newCarsT('Classes - Official Prices')}
            </Text>
            <NewCarsGenerationCard
              key={generations?.[0]?.id}
              listing={generations?.[0]}
              make={generations?.[0]?.make}
              model={generations?.[0]?.model}
              generation={generations?.[0]?.generation}
              isMobile={isMob}
              renderGenerationDetail={false}
            />
          </div>
        </Suspense>
      )}

      <Suspense fallback={<TableSkeleton />}>
        <NewCarsPriceChanges
          title={listingTitleModelLevel}
          makeSlug={make?.slug}
          variantId={variantId}
          modelSlug={model?.slug}
          isMobile={isMob}
          locale={locale}
          listing_category={listingDetailData?.listing_category}
        />
      </Suspense>

      <VideoReviewsSection
        title={listingTitleModelLevel}
        videos={videoReviews}
      />

      <Suspense fallback={<UsedCarsCatalogSkeleton isMobile={isMob} />}>
        <UsedCarsCatalog
          title={t('Available Now For Sale')}
          make={make?.slug}
          model={model?.slug}
          queryParams={{ condition: 'new' }}
          linkLabel={`${t('New')} ${await getLocaleStringServer(
            make,
            'label',
          )} ${await getLocaleStringServer(model, 'label')} ${t('for Sale')}`}
          href={`/car/${make.slug}/${model.slug}?condition=new`}
          pageType={PAGE_TYPES.OFFER_DETAIL}
          anchorId={listingJumpLinks.AVAILABLE_NOW_FOR_SALE}
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
          pageType={PAGE_TYPES?.OFFER_DETAIL}
          pageSection={`${make?.slug}_new_cars`}
          vehicleType={listingDetailData?.listing_category?.slug}
        />
      </Suspense>
      <AdBanner adConfig={AD_UNITS?.carInfoDetailBottomAd} />
      <Suspense fallback={<MakeModelTabsCompactSkeleton isMobile={isMob} />}>
        <MakeModelTabs
          isMobile={isMob}
          carPurposeTitle={newCarsT('new_vehicle', {
            vehicle: newCarsT(
              `${listingDetailData?.listing_category?.slug}-plural`,
            ),
          })}
          vehicleParam={`new-${listingDetailData?.listing_category?.slug}`}
          categorySlug={listingDetailData?.listing_category?.slug}
          tabsToShow={['bodyTypes', 'priceRanges']}
          tabsClassName="min-h-35 lg:min-h-43"
          pageType={PAGE_TYPES.NEW_VEHICLE_DETAIL}
        />
      </Suspense>

      {isMob && !isWebView && <Breadcrumbs list={seoData?.breadcrumbs} />}
      {isMob && (
        <BottomBar>
          <NewListingActions
            item={{
              id: variantId,
              title: listingTitle,
              image: images?.[0]?.medium,
              brochure_url,
              href: `${
                appPaths[
                  `new-${listingDetailData?.listing_category?.slug}-compare-terazes`
                ]
              }/${variantId}`,
            }}
            size="xl"
            classNameCompare="flex-1"
            classNameDownload="flex-1"
          />
        </BottomBar>
      )}
    </>
  );
};

export default NewVehicleDetailPage;
