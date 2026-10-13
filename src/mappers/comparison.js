import { appPaths } from '@/constants';
import { carComparisonTableAttributes } from '@/constants/carComparison';
import { formatNumberValue } from '@/utils/numbers';
import { getAsset, getLocaleString } from '@/utils/general';
import { newVehiclePlaceholder } from '@/constants';

export function mapComparisonDetailResponse(listings) {
  if (!listings) {
    return { cars: [], attributes: [] };
  }

  const cars = listings?.map((listing) => ({
    id: listing.id,
    title: listing.title,
    title_l1: listing.title_l1,
    price: formatNumberValue(listing.price),
    make: listing.make,
    model: listing.model,
    generation: listing.generation,
    variant: listing.variant,
    modelHref: `${appPaths[`new-${listing.listing_category?.slug}`]}/${
      listing.make?.slug
    }/${listing.model?.slug}`,
    variantHref: `${appPaths[`new-${listing.listing_category?.slug}`]}/${
      listing.make?.slug
    }/${listing.model?.slug}/${listing.variant?.id}`,
    generation_variant: listing.generation_variant,
    image:
      listing.new_listing_images?.find((image) => image.main)?.sizes?.medium ||
      getAsset(
        `/assets/${newVehiclePlaceholder[listing.listing_category?.slug]}`,
      ),
    specs: {
      ...listing.specs,
      description: listing.specs?.description?.map((desc) => {
        if (desc.slug === 'warranty-in-kms') {
          return {
            ...desc,
            spec_values: desc.spec_values?.map((val) => ({
              ...val,
              value: formatNumberValue(val?.value),
              value_l1: formatNumberValue(val?.value_l1),
            })),
          };
        }
        return desc;
      }),
    },
    features: listing.specs?.features || [],
    launch_year: listing?.launch_year,
  }));

  // Only include predefined attributes from carComparisonTableAttributes
  const attributes = Object.keys(carComparisonTableAttributes).map((slug) => ({
    slug,
    label: carComparisonTableAttributes[slug],
  }));

  return { cars, attributes };
}

export function getCarAttributeValue(car, attributeSlug, locale) {
  if (!car) return '-';

  // Handle price-related attributes from generation_variant
  if (
    ['official_prices', 'min_installment', 'min_deposit'].includes(
      attributeSlug,
    )
  ) {
    const priceInfo = getCarPriceInfo(car);
    if (!priceInfo) return '-';

    switch (attributeSlug) {
      case 'official_prices':
        return priceInfo.official_price || '-';
      case 'min_installment':
        return priceInfo.min_installment || '-';
      case 'min_deposit':
        return priceInfo.min_deposit || '-';
      default:
        return '-';
    }
  }

  // Check if car has specs
  if (!car?.specs) return '-';

  // Check in description specs
  if (car.specs.description) {
    const spec = car.specs.description.find((s) => s.slug === attributeSlug);
    if (spec?.spec_values?.[0]) {
      const value = getLocaleString(spec.spec_values[0], 'value', locale);

      // If this is engine capacity (power) and turbo is present in specs, append "Turbo"
      if (
        attributeSlug === 'power' &&
        value !== null &&
        value !== undefined &&
        value !== '-'
      ) {
        const turboSpec = car.specs.description.find((s) => s.slug === 'turbo');
        if (turboSpec) {
          return `${value} ${getLocaleString(
            turboSpec.spec_values[0],
            'label',
            locale,
          )}`;
        }
      }

      return value !== null && value !== undefined ? value : '-';
    }
  }

  // Check in features
  if (car.specs.features) {
    const feature = car.specs.features.find((f) => f.slug === attributeSlug);
    if (feature) {
      return 'Yes';
    }
  }

  return '-';
}

export function getCarPriceInfo(car) {
  if (!car?.generation_variant) return null;

  return {
    official_price: car.generation_variant.min_market_price || car.price,
    min_installment: car.generation_variant.min_installment,
    min_deposit: car.generation_variant.min_deposit,
  };
}
