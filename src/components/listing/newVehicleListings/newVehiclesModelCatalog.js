import { fetchListingsByMake, getNewCarsData } from '@/apis/new-car';
import CarouselSection from '@/components/common/carouselSection/carouselSection';
import NewVehicleCard from '@/components/common/newVehicleCard/newVehicleCard';
import ViewAllLink from '@/components/common/viewAllLink/viewAllLink';
import { appPaths } from '@/constants';
import { cn } from '@/utils';
import { getListingTitleByLevel } from '@/utils/listings';
import { getTranslations } from 'next-intl/server';
import { newVehiclePlaceholder } from '@/constants';
import ClickEventTracker from '@/services/analyticsService/clickTracker';
import { extractNewVehicleTrackingItem } from '@/utils/listings';
import { getAsset } from '@/utils/general';
import { PAGE_SECTIONS } from '@/services/analyticsService/constants';
import AdImpressionTracker from '@/components/common/adImpressionTracker/adImpressionTracker';
import { listingJumpLinks } from '@/data/detail';
const NewVehiclesModelCatalog = async ({
  title,
  linkLabel,
  make,
  rootClass,
  showFinancingDetail = false,
  vehicleType = 'car',
  viewAllHref,
  pageType = '',
  pageSection = PAGE_SECTIONS.NEWLY_LAUNCHED_CARS,
  queryParams = {},
}) => {
  const t = await getTranslations('usedCarsListings');
  const carCatalog = make
    ? await fetchListingsByMake(make, vehicleType, {
        'f[imported.slug]': 'no',
        'sort[min_official_price]': 'asc',
        'f[price_not_available]': 'false',
        ...queryParams,
      })
    : await getNewCarsData(vehicleType, {
        'f[imported.slug]': 'no',
        'f[price_not_available]': 'false',
        ...queryParams,
      });

  const getPathKey = () => {
    switch (vehicleType) {
      case 'car':
        return 'new-car';
      case 'bus':
        return 'new-bus';
      case 'truck':
      case 'trucks':
        return 'new-trucks';
      case 'motorcycle':
        return 'new-motorcycle';
      default:
        return 'new-car';
    }
  };
  const minNumberOfListings = 4;

  return (
    carCatalog?.length > 0 && (
      <div
        id={listingJumpLinks.LATEST_NEW_CARS}
        className={cn('gap-3 lg:gap-4 flex flex-col', rootClass)}
      >
        <AdImpressionTracker listings={carCatalog} pageType={pageType} />
        <div className="flex justify-between items-center">
          <h2 className="sectionHeading mb-0">{title}</h2>
          {carCatalog?.length >= minNumberOfListings && (
            <ViewAllLink
              href={
                viewAllHref ||
                `${appPaths[getPathKey()]}${make ? `/${make}` : ''}`
              }
              title={linkLabel || title}
              gaEvent="view_all_link_click"
              pageType={pageType}
              pageSection={pageSection}
            />
          )}
        </div>
        <CarouselSection
          className="h-full w-full"
          itemBasis="basis-[70%] sm:basis-[60%] md:basis-[40%] lg:basis-[26%]"
          pageSection={pageSection}
        >
          {carCatalog?.map(async (item, index) => {
            // Build model slug with shape if it exists
            let modelSlug = item?.model?.slug;
            if (item?.shape?.slug) {
              modelSlug = `${item?.model?.slug}-shape-${item?.shape?.slug}`;
            }
            const order =
              item?.imported?.slug === 'yes'
                ? ['make', 'model', 'imported']
                : ['make', 'model', 'variant', 'year'];

            return (
              <ClickEventTracker
                item={extractNewVehicleTrackingItem(item)}
                key={index}
                pageType={pageType}
                gaEvent={'newly_launched_cars_click'}
                pageSection={pageSection}
              >
                <NewVehicleCard
                  key={`variant-${index}`}
                  href={`${appPaths[`new-${item?.listing_category?.slug}`]}/${
                    item?.imported?.slug === 'yes'
                      ? `imported/${item?.make?.slug}`
                      : item?.make?.slug
                  }/${modelSlug}${item?.id ? `/${item?.id}` : ''}`}
                  title={await getListingTitleByLevel(
                    { ...item, year: item?.launch_year },
                    'variant',
                    { order, t },
                  )}
                  count={item?.variantCount}
                  price={item?.prices}
                  img={
                    item?.images?.[0]?.medium ||
                    getAsset(
                      `/assets/${
                        newVehiclePlaceholder[item?.listing_category?.slug]
                      }`,
                    )
                  }
                  showFinancingDetail={showFinancingDetail}
                />
              </ClickEventTracker>
            );
          })}
        </CarouselSection>
      </div>
    )
  );
};

export default NewVehiclesModelCatalog;
