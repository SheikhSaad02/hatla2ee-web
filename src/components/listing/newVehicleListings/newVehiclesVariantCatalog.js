import { fetchNewCarsByModel } from '@/apis/new-car';
import CarouselSection from '@/components/common/carouselSection/carouselSection';
import NewVehicleCard from '@/components/common/newVehicleCard/newVehicleCard';
import ViewAllLink from '@/components/common/viewAllLink/viewAllLink';
import { appPaths } from '@/constants';
import { cn } from '@/utils';
import { getAsset } from '@/utils/general';
import { getListingTitleByLevel } from '@/utils/listings';
import { newVehiclePlaceholder } from '@/constants';
import { PAGE_SECTIONS } from '@/services/analyticsService/constants';
import { listingJumpLinks } from '@/data/detail';

const NewVehiclesVariantCatalog = async ({
  title,
  model,
  make,
  rootClass,
  showFinancingDetail = false,
  vehicleType = 'car',
  hideTitleLink = false,
}) => {
  const carCatalog = await fetchNewCarsByModel(model, vehicleType);
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
        <div className="flex justify-between items-center">
          <h2 className="sectionHeading mb-0">{title}</h2>

          {!hideTitleLink && carCatalog?.length >= minNumberOfListings && (
            <ViewAllLink
              href={`${appPaths[getPathKey()]}/${make}/${model}`}
              title={title}
            />
          )}
        </div>
        <CarouselSection
          className="h-full w-full"
          itemBasis="basis-[70%] sm:basis-[60%] md:basis-[40%] lg:basis-[26%]"
          pageSection={PAGE_SECTIONS.NEW_VEHICLE_VARIANT_CATALOG}
        >
          {carCatalog?.map(async (item, index) => {
            // Build model slug with shape if it exists
            let modelSlug = item?.model?.slug;
            if (item?.shape?.slug) {
              modelSlug = `${item?.model?.slug}-shape-${item?.shape?.slug}`;
            }

            return (
              <NewVehicleCard
                key={`variant-${index}`}
                href={`${appPaths[`new-car`]}/${
                  item?.make?.slug
                }/${modelSlug}/${item?.variant?.id}`}
                title={await getListingTitleByLevel(item, 'variant')}
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
            );
          })}
        </CarouselSection>
      </div>
    )
  );
};

export default NewVehiclesVariantCatalog;
