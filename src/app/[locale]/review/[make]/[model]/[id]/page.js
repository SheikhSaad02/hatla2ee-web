import { getReviewDetail } from '@/apis/reviews';
import BackButton from '@/components/common/backButton';
import { Breadcrumbs } from '@/components/common/breadcrumbs';
import CarNewsSection from '@/components/common/carNewsSection/carNewsSection';
import ExpandableGrid from '@/components/common/expandableGrid/expandableGrid';
import { htmlStringToJSX } from '@/components/common/htmlContent/htmlContent';
import ImageGallery from '@/components/common/imageGallery';
import {
  CarNewsSectionSkeleton,
  MakeModelTabsCompactSkeleton,
  NewlyLaunchedCarsSkeleton,
  UsedCarsCatalogSkeleton,
} from '@/components/common/loading';
import MakeBanner from '@/components/common/makeBanner/makeBanner';
import NextImage from '@/components/common/nextImage';
import Text from '@/components/common/text';
import VideoReviewsSection from '@/components/common/videoReviewCard/videoReviewCard';
import PageLayout from '@/components/layout/pageLayout';
import NewVehiclesVariantCatalog from '@/components/listing/newVehicleListings/newVehiclesVariantCatalog';
import UsedCarsCatalog from '@/components/listing/usedCarListings/usedCarsCatalog';
import RelatedModels from '@/components/review/relatedModels';
import { Progress } from '@/components/ui/progress';
import { ListingsService } from '@/services/elasticsearch/listings-service';
import { ReviewsPageSEO } from '@/services/seoStrategy/reviewsPage';
import { cn } from '@/utils';
import { getAsset } from '@/utils/general';
import { ifError } from '@/utils/ifError';
import { getListingTitleByLevel } from '@/utils/listings';
import { getLocaleStringServer, isMobileServer } from '@/utils/serverFunctions';
import { ChevronLeftIcon, Star } from 'lucide-react';
import { getTranslations } from 'next-intl/server';
import { cache } from 'react';
import { ConditionalSuspense as Suspense } from '@/components/common/ConditionalSuspense';

const getReviewDetailCached = cache(async (id) => {
  return getReviewDetail(id);
});

export async function generateMetadata({ params }) {
  const { id, locale } = await params;
  const reviewDetail = await getReviewDetailCached(id);

  const carSEO = new ReviewsPageSEO({
    language: locale,
    make: reviewDetail?.make,
    model: reviewDetail?.model,
    yearFrom: reviewDetail?.year_from,
    yearTo: reviewDetail?.year_to,
  });

  const seoData = await carSEO.generateSEO();

  return {
    title: seoData.metaTitle,
    description: seoData.metaDescription,
    openGraph: seoData.openGraph,
  };
}

const ReviewPage = async ({ params }) => {
  const { locale, id, make: makeSlug, model: modelSlug } = await params;
  const homeT = await getTranslations('home');
  const t = await getTranslations('common');
  const reviewT = await getTranslations('reviews');

  const isMob = await isMobileServer();
  const reviewDetail = await getReviewDetailCached(id);

  ifError(reviewDetail);

  const carSEO = new ReviewsPageSEO({
    language: locale,
    make: reviewDetail?.make,
    model: reviewDetail?.model,
    yearFrom: reviewDetail?.year_from,
    yearTo: reviewDetail?.year_to,
    reviewsOgImage: reviewDetail?.images?.[0]?.medium,
  });

  const seoData = await carSEO.generateSEO();

  const {
    categories,
    tags,
    images,
    videoReviews,
    model,
    year_to,
    year_from,
    make,
    logo,
    ratings,
  } = reviewDetail || {};

  const renderReviewOverview = (darkMode) => {
    return (
      <div
        className={cn(
          'flex flex-col md:flex-row md:justify-between md:items-center gap-1.5 md:gap-4 mb-6 dark:bg-[#222222E5] dark:shadow-[0px_1px_6px_#C9C9C924] dark:py-3 dark:px-4 dark:rounded-md dark:mb-0',
          darkMode && 'dark',
        )}
      >
        <Text
          as={darkMode ? 'h2' : 'h1'}
          className="flex flex-col font-semibold text-lg lg:text-3.5xl lg:leading-none dark:text-lg"
        >
          {seoData?.h1}
        </Text>

        <div className="flex gap-1 items-center leading-9" dir="ltr">
          <Star className="w-4 h-4 lg:w-5 lg:h-5 text-yellow-400 fill-yellow-400" />
          <Text className="font-bold text-xl lg:text-3.5xl leading-none">
            {ratings}
          </Text>
          <Text className="text-dim font-medium text-base lg:text-2xl self-end rtl:mb-1 dark:text-white">
            /5
          </Text>
        </div>
      </div>
    );
  };

  const renderImageGallery = () => {
    if (images?.length > 0) {
      return (
        <ImageGallery
          images={images}
          options={{}}
          tags={tags}
          isMob={isMob}
          modalHeader={renderReviewOverview({ darkMode: true })}
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

  const sectionLinks = [
    {
      label: t('Used {make} For Sale', {
        make: await getListingTitleByLevel({ make, model }, 'model'),
      }),
      isExternal: true,
      href: `/car/${makeSlug}/${modelSlug}`,
    },
    {
      label: t('New {make} For Sale', {
        make: await getListingTitleByLevel({ make, model }, 'model'),
      }),
      isExternal: true,
      href: `/new-car/${makeSlug}/${modelSlug}`,
    },
  ];
  return (
    <PageLayout route="review-detail">
      <div className="flex flex-col gap-4">
        {!isMob && <Breadcrumbs list={seoData?.breadcrumbs} />}
        {renderImageGallery()}
        {isMob && (
          <>
            <BackButton
              variant="glassy"
              className="absolute top-4 start-2 flipX h-8 w-8"
            >
              <ChevronLeftIcon />
            </BackButton>
          </>
        )}
      </div>
      <div>
        {renderReviewOverview()}

        <div className="grid md:grid-cols-2 gap-x-10 gap-y-4 lg:gap-y-6">
          {categories?.map(async (item) => (
            <div key={item?.label} className="flex flex-col gap-1.5">
              <div className="flex justify-between items-center md:text-lg">
                <div className="font-medium text-gray-light">
                  {reviewT(item?.label)}
                </div>
                <div dir="ltr">
                  <Text className="font-semibold">
                    {item?.value * 10 + '%'}
                  </Text>
                </div>
              </div>
              <Progress
                value={(item?.value / 10) * 100}
                className="h-2 flipX"
              />
            </div>
          ))}
        </div>
      </div>

      <MakeBanner
        title={await getLocaleStringServer(reviewDetail, 'title')}
        description={htmlStringToJSX(
          await getLocaleStringServer(reviewDetail, 'description'),
        )}
        logo={logo}
        src={reviewDetail?.src}
        logoPosition="right"
        links={sectionLinks}
      />

      <VideoReviewsSection
        title={await getLocaleStringServer(reviewDetail, 'label', locale)}
        videos={videoReviews}
      />

      {categories?.length > 0 && (
        <div className="flex flex-col gap-6">
          {categories?.map(async (item, index) => (
            <div key={index} className="flex flex-col gap-4">
              <div key={item?.label} className="flex flex-col gap-3">
                <div className="flex justify-between items-center">
                  <Text as="h3" className="sectionHeading mb-0">
                    {reviewT(item?.label)}
                  </Text>
                  <Text className="sectionHeading mb-0 font-bold">
                    {item?.value * 10 + '%'}
                  </Text>
                </div>
                <Progress
                  value={(item?.value / 10) * 100}
                  className="h-2 flipX"
                />
              </div>
              <ExpandableGrid maxHeight={'150px'} shouldExpandOnDesktop={true}>
                <Text className="text-sm text-muted-foreground mt-2">
                  {htmlStringToJSX(
                    await getLocaleStringServer(item, 'description'),
                  )}
                </Text>
              </ExpandableGrid>
            </div>
          ))}
        </div>
      )}

      <Suspense fallback={<MakeModelTabsCompactSkeleton isMobile={isMob} />}>
        <RelatedModels modelSlug={model?.slug} locale={locale} />
      </Suspense>
      <Suspense fallback={<UsedCarsCatalogSkeleton isMobile={isMob} />}>
        <UsedCarsCatalog
          title={`${t('The last 5 Used ')} ${await getListingTitleByLevel(
            reviewDetail,
            'model',
          )} ${
            year_from === year_to ? year_from : year_from + ' - ' + year_to
          }`}
          titleAsHref={`/car/search?dateMin=${year_from}&dateMax=${year_to}&make=${make?.id}&model=${model?.id}`}
          make={makeSlug}
          model={modelSlug}
          queryParams={{ year_from, year_to, maxSize: 5 }}
        />
      </Suspense>
      <Suspense fallback={<NewlyLaunchedCarsSkeleton />}>
        <NewVehiclesVariantCatalog
          title={homeT('Newly Launched Cars')}
          make={makeSlug}
          model={modelSlug}
        />
      </Suspense>
      <Suspense fallback={<CarNewsSectionSkeleton isMobile={isMob} />}>
        <CarNewsSection />
      </Suspense>
      {isMob && <Breadcrumbs list={seoData?.breadcrumbs} />}
    </PageLayout>
  );
};

export default ReviewPage;
