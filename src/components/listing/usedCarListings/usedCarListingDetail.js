import { fetchCarNews } from '@/apis/car-news';
import { fetchNewCarsByModel } from '@/apis/new-car';
import { fetchUsedCarPricesStats } from '@/apis/used-car-prices';
import TrackAdMetrics from '@/components/adMetrics/track-ad-metrics';
import BackButton from '@/components/common/backButton';
import { BottomBar } from '@/components/common/bottomBar';
import { Breadcrumbs } from '@/components/common/breadcrumbs';
import Button from '@/components/common/button/button';
import CarNewsSection from '@/components/common/carNewsSection/carNewsSection';
import { ConditionalSuspense as Suspense } from '@/components/common/ConditionalSuspense';
import ContactCard from '@/components/common/contactCard/contactCard';
import ExpandableGrid from '@/components/common/expandableGrid/expandableGrid';
import FeaturesSection from '@/components/common/featuresSection/featuresSection';
import FinancingSection from '@/components/common/financingSection/financingSection';
import FormattedText from '@/components/common/formatedText/formattedText';
import HighlightedPoints from '@/components/common/highlightedPoints/highlightedPoints';
import ImageGallery from '@/components/common/imageGallery';
import GalleryModalHeader from '@/components/common/imageGallery/modalHeader';
import InfoCTAButtons from '@/components/common/infoCard/infoCtaButtons';
import ListingActions from '@/components/common/listingActions/listingActions';
import ListingOverview from '@/components/common/listingOverview/listingOverview';
import SellableBadges from '@/components/common/sellableBadges/sellableBadges';
import {
  CarNewsSectionSkeleton,
  MakeModelTabsCompactSkeleton,
  PriceRangeSkeleton,
  ReviewsSkeleton,
  UsedCarsCatalogSkeleton,
} from '@/components/common/loading';
import NextImage from '@/components/common/nextImage';
import PriceRangeChart from '@/components/common/priceRangeChart/priceRangeChart';
import PriceTrends from '@/components/common/priceTrends/priceTrends';
import ReportAd from '@/components/common/reportAd/reportAd';
import Reviews from '@/components/common/reviews/reviews';
import SpecificationGrid from '@/components/common/specificationGrid/specificationGrid';
import StickyDetialInfo from '@/components/common/stickyDetialInfo/stickyDetialInfo';
import Text from '@/components/common/text';
import AdBanner from '@/components/googleAd/adBanner';
import StickyAd from '@/components/googleAd/stickyAd';
import { getUsedCarDetailAdUnits } from '@/components/googleAd/adsConfig';
import MakeModelTabs from '@/components/home/make-model-tabs';
import UsedCarsCatalog from '@/components/listing/usedCarListings/usedCarsCatalog';
import TotalEnergyCenterBanner from '@/components/maintenance-center/total-energy-center';
import {
  getListingJumpLinks,
  listingJumpLinks,
  PRICE_TRENDS_MIN_ADS,
} from '@/data/detail';
import { isSectionEnabled } from '@/configs';
import { appSections, IMAGES_BASE_URL } from '@/constants';
import {
  PAGE_SECTIONS,
  PAGE_TYPES,
} from '@/services/analyticsService/constants';
import { CarListingSEOStrategy } from '@/services/seoStrategy/listingDetailPage';
import { buildUsedCarListingUrl } from '@/services/urlBuilder/usedCarListingUrl';
import { Badge } from '@/components/common/badge/badge';
import { cn } from '@/utils';
import { convertPriceToRange, getLocaleString } from '@/utils/general';
import { getContactPresence } from '@/utils/contactDetails';
import {
  extractFlatCtaTrackingItem,
  getListingTitleByLevel,
} from '@/utils/listings';
import {
  getLocaleStringServer,
  isWebViewServer,
} from '@/utils/serverFunctions';
import { getRecentUsedCarsCached } from '@/services/elasticsearch/listings-service';
import { ChevronLeftIcon, ExternalLink } from 'lucide-react';
import { getTranslations } from 'next-intl/server';
import NewVehiclesVariantCatalog from '../newVehicleListings/newVehiclesVariantCatalog';
import AddRecentViewedToStorage from './addRecentViewedToStorage';
import DetailPageAppOpenSheet from '@/components/common/detailPageAppOpenSheet';
import { CAR_PRICE_THRESHOLD, MIN_FINANCING_YEAR } from '@/data/car-finance';

const UsedCarsListingDetail = async ({
  id,
  isMob,
  condition = 'used',
  listingDetailData,
  locale,
}) => {
  const t = await getTranslations('common');
  const newCarsT = await getTranslations('newCar');
  const isWebView = await isWebViewServer();
  const {
    products_information,
    features,
    price,
    specificationList,
    specifications,
    dynamic_fields,
    contact_details,
    agency,
    images,
    tags,
    sold_at,
    disposition,
    location,
  } = listingDetailData;

  // `disposition` is the ad's lifecycle exactly as the API reports it — `live`
  // for a normal ad, otherwise expired/sold/etc. Non-live ads are still
  // reachable by direct link, so flag the state on the gallery rather than
  // rendering them as if nothing changed. Label and its Arabic come from the
  // API, so a new lifecycle state needs no change here.
  const statusLabel =
    disposition?.slug && disposition.slug !== 'live'
      ? getLocaleString(disposition, 'name', locale)
      : null;

  const priceTrendsEligible =
    isMob &&
    !isWebView &&
    Boolean(dynamic_fields?.make?.slug) &&
    Boolean(dynamic_fields?.model?.slug) &&
    Boolean(dynamic_fields?.year);

  const [
    carNewsData,
    newCarsCatalog,
    sameBudgetList,
    premiumDealsList,
    priceTrendPoints,
  ] = await Promise.all([
    fetchCarNews(locale),
    fetchNewCarsByModel(dynamic_fields?.model?.slug, 'car'),
    getRecentUsedCarsCached({
      queryParams: {
        priceRange: price,
        exclude: id,
        maxSize: 6,
        city: location?.slug,
        condition: condition,
      },
    }),
    getRecentUsedCarsCached({
      make: dynamic_fields?.make?.slug,
      model: dynamic_fields?.model?.slug,
      queryParams: {
        isPremium: true,
        exclude: id,
        condition: condition,
      },
    }),
    priceTrendsEligible
      ? fetchUsedCarPricesStats({
          make: dynamic_fields.make.slug,
          model: dynamic_fields.model.slug,
          year: dynamic_fields.year,
          fetchOptions: { next: { revalidate: 86400 } },
        })
      : null,
  ]);

  const carDetails = {
    make: dynamic_fields?.make?.slug,
    model: dynamic_fields?.model?.slug,
    year: dynamic_fields?.year,
    condition: dynamic_fields?.condition?.slug,
    imported: dynamic_fields?.imported?.slug,
    category: listingDetailData?.listing_category?.slug,
    body: dynamic_fields?.body_type?.slug,
  };
  const AD_UNITS = getUsedCarDetailAdUnits(isMob, locale, carDetails);
  // Do not use the `id` route param here: on the new-vehicle routes
  // (/new-car|new-bus|new-trucks|new-motorcycle/[make]/[model]/[variantId]/[id])
  // that segment is `listing_external_id`, not `listing_id`.
  const metricsListingId = listingDetailData?.listing_id;
  const listingMetrics = {
    listing_id: metricsListingId,
    products_information,
    platform_listing_external_id:
      listingDetailData?.platform_listing_external_id,
    ad_image_url: listingDetailData?.ad_image_url || null,
  };
  const ctaMetrics = {
    source: 'details', //previously was detail, ovation gave error as it was not allowed, double check
    listing_id: metricsListingId,
    products_information,
    platform_listing_external_id:
      listingDetailData?.platform_listing_external_id,
    ad_image_url: listingDetailData?.ad_image_url || null,
  };

  const displayClickTrackingItem = extractFlatCtaTrackingItem({
    location,
    agency,
    listing_id: id,
    ...dynamic_fields,
  });
  const listingTitle = await getListingTitleByLevel(
    {
      ...dynamic_fields,
      year: dynamic_fields?.year,
    },
    condition === 'new' ? 'variant' : 'year',
  );
  const listingTitleModelLevel = await getListingTitleByLevel(
    { ...dynamic_fields, year: dynamic_fields?.year },
    'model',
  );

  const carSEO = new CarListingSEOStrategy({
    language: locale,
    listingDetailData,
    car_language_matches_user: locale === listingDetailData?.locale,
    is_new_car_ad: condition === 'new',
    year_page_indexed: listingDetailData?.rules?.index_page,
  });

  const seoData = await carSEO.generateSEO();
  const galleryImages = (() => {
    if (!images?.length) return images;
    const imageAlt =
      (typeof seoData?.h1 === 'object' ? seoData.h1?.h1 : seoData?.h1) ?? '';
    return images.map((img, i) => (i === 0 ? { ...img, alt: imageAlt } : img));
  })();
  const { priceMin, priceMax } = convertPriceToRange(price);
  const similarBudgetListingsHref = buildUsedCarListingUrl({
    make: dynamic_fields?.make,
    model: dynamic_fields?.model,
    priceMin,
    priceMax,
    condition: { slug: condition },
  });

  const isFinancingEligible =
    isSectionEnabled(appSections.FINANCING) &&
    dynamic_fields?.financed?.slug !== 'yes' &&
    Number(dynamic_fields?.year) >= MIN_FINANCING_YEAR &&
    Number(price) >= CAR_PRICE_THRESHOLD;

  // Only mweb shows the price trends teaser. The app renders a trend only when the
  // price index holds enough monthly points, so gate m-web on the same signal.
  const showPriceTrends =
    priceTrendsEligible &&
    (priceTrendPoints?.length ?? 0) >= PRICE_TRENDS_MIN_ADS;

  const jumpLinkShow = {
    carDetails: specifications?.length > 0,
    features: features?.length > 0,
    financing: isFinancingEligible,
    premiumDeals: premiumDealsList?.length > 0,
    sameBudget: sameBudgetList?.length > 0,
    latestNewCars: Array.isArray(newCarsCatalog) && newCarsCatalog.length > 0,
    carNews: Array.isArray(carNewsData) && carNewsData.length > 0,
    priceTrends: showPriceTrends,
  };

  const renderGalleryHeader = (darkMode) => {
    return (
      <GalleryModalHeader
        title={
          condition === 'new' ? seoData?.h1?.h1 || seoData?.h1 : seoData.h1
        }
        specificationList={specificationList}
        price={price}
        financed={dynamic_fields?.financed?.slug === 'yes'}
        min_deposit={dynamic_fields?.min_deposit}
        min_installment={dynamic_fields?.min_installment}
        duration={dynamic_fields?.duration}
        isMob={isMob}
        darkMode={darkMode}
        contact_details={contact_details}
        ctaMetrics={ctaMetrics}
        sold_at={sold_at}
        ctaEventsProps={{
          pageSection: PAGE_SECTIONS?.CONTACT_CARD,
          pageType: PAGE_TYPES?.OFFER_DETAIL,
          item: displayClickTrackingItem,
        }}
      />
    );
  };

  const renderGalleryFooter = async () => {
    const { phone, whatsapp, mobile } = contact_details || {};
    const phoneNumber = mobile || phone;

    return (
      <InfoCTAButtons
        contactInfo={{
          call: phoneNumber,
          whatsapp: whatsapp,
          presence: getContactPresence(contact_details),
        }}
        btnSize={'lg'}
        ctaMetrics={ctaMetrics}
        sold_at={sold_at}
        showDisclaimer
        classNameWhatsapp="flex-1"
        classNamePhoneNumber="flex-1"
        pageSection={PAGE_SECTIONS?.CONTACT_CARD}
        pageType={PAGE_TYPES?.OFFER_DETAIL}
        item={displayClickTrackingItem}
      />
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
          sold_at={sold_at}
          statusLabel={statusLabel}
          modalHeader={renderGalleryHeader({ darkMode: true })}
          modalFooter={isMob && renderGalleryFooter({ darkMode: true })}
          listingData={displayClickTrackingItem}
        />
      );
    } else {
      return (
        <div className="relative flex items-center justify-center bg-primary-50 md:h-100 md:rounded-lg max-md:-mx-4 max-md:aspect-4/3">
          {statusLabel && (
            <Badge
              // Matches the spec chips (year / km / fuel) under the title.
              className="absolute start-4 top-4 z-10 rounded-sm text-2xs md:text-sm font-bold border border-gray-100 bg-gray-50 text-gray-600 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200"
              variant="outline"
            >
              {statusLabel}
            </Badge>
          )}
          <NextImage
            src={`${IMAGES_BASE_URL}/${dynamic_fields?.make?.slug}/large.png`}
            priority={images?.length === 0}
            fetchPriority={images?.length === 0 ? 'high' : 'auto'}
            alt={dynamic_fields?.make?.title || 'Logo'}
            className={cn(
              'w-full h-[200] md:h-[300] object-contain',
              isMob && 'breakout',
            )}
            width={300}
            height={300}
          />
        </div>
      );
    }
  };
  return (
    <>
      {seoData?.jsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(seoData.jsonLd),
          }}
        />
      )}
      {isMob && <StickyAd adConfig={AD_UNITS.stickyAd} />}
      <AddRecentViewedToStorage id={id} />
      {isMob && !isWebView && <DetailPageAppOpenSheet />}
      <StickyDetialInfo
        title={seoData?.h1}
        id={id}
        mobileElement={listingJumpLinks.GALLERY_MOBILE}
        webElement="listing-overview"
        jumpLinks={getListingJumpLinks(t, jumpLinkShow)}
        image={
          images.length > 0
            ? images?.[0]
            : {
                thumbnail: `${IMAGES_BASE_URL}/${dynamic_fields?.make.slug}/thumbnail.png`,
              }
        }
        specificationList={specificationList}
        min_deposit={dynamic_fields?.min_deposit}
        min_installment={dynamic_fields?.min_installment}
        duration={dynamic_fields?.duration}
        financed={dynamic_fields?.financed?.slug === 'yes'}
        price={price}
        contact_details={contact_details}
        ctaMetrics={ctaMetrics}
        sold_at={sold_at}
        imagesLength={images?.length}
        item={displayClickTrackingItem}
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
            <ListingActions
              title={listingTitle}
              specificationList={specificationList}
              image={images?.[0]}
              isMob={isMob}
              id={id}
              className="flex gap-1"
              btnclassName={'h-8'}
            />
          </div>
        </>
      )}

      <div className="flex flex-col gap-2">
        {!isMob && (
          <div className="flex justify-between items-center">
            <Breadcrumbs list={seoData?.breadcrumbs} />
            <ListingActions
              title={listingTitle}
              specificationList={specificationList}
              image={images?.[0]}
              isMob={isMob}
              id={id}
              className={'flex gap-2 -my-[10px]'}
            />
          </div>
        )}

        <div id="listing-overview">
          <ListingOverview
            title={seoData?.h1}
            specificationList={specificationList}
            price={price}
            financed={dynamic_fields?.financed?.slug === 'yes'}
            min_deposit={dynamic_fields?.min_deposit}
            min_installment={dynamic_fields?.min_installment}
            duration={dynamic_fields?.duration}
            badges={listingDetailData?.badges}
            locale={locale}
            isMob={isMob}
          />
        </div>

        {!isMob && renderImageGallery()}
      </div>
      <div className="lg:grid lg:grid-cols-3 lg:gap-3">
        <div className="flex flex-col gap-8 lg:gap-14 col-span-2 ltr:lg:pr-13 rtl:lg:pl-13">
          <div className="flex flex-col gap-6">
            <SpecificationGrid
              title={t('Car Details')}
              data={specifications}
              headerSlot={
                !isMob ? (
                  <SellableBadges badges={listingDetailData?.badges} />
                ) : null
              }
            />
            <ExpandableGrid>
              <FormattedText
                text={await getLocaleStringServer(
                  listingDetailData,
                  'description',
                )}
                isMob={isMob}
              />
            </ExpandableGrid>
          </div>
          <HighlightedPoints
            title={t('Highlighted Points')}
            items={dynamic_fields?.highlighted_points}
          />
          <FeaturesSection title={t('Features')} featuresList={features} />
        </div>
        {isMob && <AdBanner adConfig={AD_UNITS?.usedCarDetailSideBarAd} />}
        <div className="flex flex-col gap-6 mt-7 lg:mt-0">
          <div id="contact-card">
            <ContactCard
              contact_details={contact_details}
              agency={agency}
              className="w-full"
              href={agency?.slug ? `/showroom/${agency?.slug}` : null}
              ctaMetrics={ctaMetrics}
              sold_at={sold_at}
              item={displayClickTrackingItem}
            />
          </div>
          {isSectionEnabled(appSections.REVIEWS) && (
            <Suspense fallback={<ReviewsSkeleton />}>
              <Reviews
                year={dynamic_fields?.year}
                makeSlug={dynamic_fields?.make?.slug}
                modelSlug={dynamic_fields?.model?.slug}
              />
            </Suspense>
          )}
          <Suspense fallback={<PriceRangeSkeleton />}>
            <PriceRangeChart
              title={t('Market Insights')}
              listingTitle={listingTitle}
              makeSlug={dynamic_fields?.make?.slug}
              modelSlug={dynamic_fields?.model?.slug}
              price={price}
              modelYear={dynamic_fields?.year}
            />
          </Suspense>
          {showPriceTrends && (
            <div id={listingJumpLinks.PRICE_TRENDS}>
              <PriceTrends title={t('Price Trend')} />
            </div>
          )}
          {!isMob && <AdBanner adConfig={AD_UNITS?.usedCarDetailSideBarAd} />}
          {!isMob && (
            <div className="flex flex-wrap gap-2 justify-center">
              <ReportAd id={listingDetailData?.id} isMob={isMob} />
              <Button
                title={t('New Cars 2025-2026')}
                variant={'ghost'}
                href={`/new-car`}
                icon={<ExternalLink />}
                className="hidden"
              >
                {t('New Cars 2025-2026')}
              </Button>
            </div>
          )}
        </div>
      </div>
      {isFinancingEligible && (
        <FinancingSection
          showMarketingColumn={!isMob}
          listingPrice={price}
          id={id}
          condition={dynamic_fields?.condition}
          carDetail={{
            brand: dynamic_fields?.make,
            model: dynamic_fields?.model,
            year: { label: dynamic_fields?.year },
            class: dynamic_fields?.variant,
          }}
        />
      )}
      <Suspense fallback={<UsedCarsCatalogSkeleton isMobile={isMob} />}>
        <UsedCarsCatalog
          title={t('Premium Deals')}
          make={dynamic_fields?.make?.slug}
          model={dynamic_fields?.model?.slug}
          pageType={PAGE_TYPES.OFFER_DETAIL}
          queryParams={{
            isPremium: true,
            exclude: id,
            condition: condition,
          }}
          pageSection={PAGE_SECTIONS?.PREMIUM_DEALS}
          anchorId={listingJumpLinks.PREMIUM_DEALS}
        />
      </Suspense>

      <TotalEnergyCenterBanner locale={locale} />

      <Suspense fallback={<UsedCarsCatalogSkeleton isMobile={isMob} />}>
        <UsedCarsCatalog
          title={t('Cars in same budget')}
          pageType={PAGE_TYPES.OFFER_DETAIL}
          queryParams={{
            priceRange: price,
            exclude: id,
            maxSize: 6,
            city: location?.slug,
            condition: condition,
          }}
          href={similarBudgetListingsHref}
          pageSection={PAGE_SECTIONS?.SIMILAR_BUDGET}
        />
      </Suspense>
      {isMob && <AdBanner adConfig={AD_UNITS?.usedCarDetailBottomAd} />}

      <Suspense fallback={<UsedCarsCatalogSkeleton isMobile={isMob} />}>
        <NewVehiclesVariantCatalog
          title={
            (await getLocaleStringServer(dynamic_fields?.make, 'label')) +
            ' ' +
            newCarsT('new_vehicle', {
              vehicle: newCarsT(
                `${listingDetailData?.listing_category?.slug}-plural`,
              ),
            })
          }
          model={dynamic_fields?.model?.slug}
          make={dynamic_fields?.make?.slug}
          showFinancingDetail={true}
        />
      </Suspense>
      {!isMob && <AdBanner adConfig={AD_UNITS?.usedCarDetailBottomAd} />}
      <Suspense fallback={<CarNewsSectionSkeleton isMobile={isMob} />}>
        <CarNewsSection />
      </Suspense>
      <Suspense fallback={<MakeModelTabsCompactSkeleton isMobile={isMob} />}>
        <MakeModelTabs
          isMobile={isMob}
          carPurposeTitle={'Used Cars For Sale'}
          tabsToShow={['bodyTypes', 'priceRanges']}
          pageType={PAGE_TYPES.OFFER_DETAIL}
        />
      </Suspense>

      {isMob && (
        <div className="flex flex-wrap gap-4">
          <div className="w-full">
            <ReportAd id={listingDetailData?.id} isMob={isMob} />
          </div>
          <Button
            title={t('New Cars 2025-2026')}
            variant={'ghost'}
            href={`/new-car`}
            icon={<ExternalLink />}
            className="hidden"
          >
            {t('New Cars 2025-2026')}
          </Button>
        </div>
      )}

      {isMob && !isWebView && <Breadcrumbs list={seoData?.breadcrumbs} />}

      {isMob && (
        <BottomBar>
          {sold_at ? (
            <div className="w-full bg-gray-600 flex justify-center rounded-md px-2.5 py-3">
              <Text className="text-white font-semibold text-base">
                {t('Sold Out')}
              </Text>
            </div>
          ) : (
            <InfoCTAButtons
              sold_at={sold_at}
              contactInfo={{
                call: contact_details?.phone || contact_details?.mobile,
                whatsapp: contact_details?.whatsapp,
                presence: getContactPresence(contact_details),
              }}
              localisedName={await getLocaleStringServer(
                contact_details,
                'name',
              )}
              email={contact_details?.email}
              verified={contact_details?.verified}
              btnSize={'xl'}
              ctaMetrics={ctaMetrics}
              classWrapper="[grid-template-columns:repeat(auto-fit,minmax(0,1fr))]"
              fullWidth
              showDisclaimer
              pageSection={PAGE_SECTIONS?.CONTACT_CARD}
              pageType={PAGE_TYPES?.OFFER_DETAIL}
              item={displayClickTrackingItem}
            />
          )}
        </BottomBar>
      )}
      <TrackAdMetrics adMetrics={listingMetrics} type="detail" />
    </>
  );
};

export default UsedCarsListingDetail;
