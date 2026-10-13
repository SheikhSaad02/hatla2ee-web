import { convertToEmbedLinks, transformImages } from '@/utils/general';
import { mapGroupedFeatures } from './listings';
import { formatNumberValue } from '@/utils/numbers';
import { appPaths } from '@/constants';

const slugsWithHref = {
  assembled: true,
  origin: true,
};

const slugsWithFormattedValues = {
  length: true,
  width: true,
  height: true,
  'warranty-in-kms': true,
  'battery-in-kms': true,
};

const transformSpecifications = (data = [], listing_category) => {
  return data.map((spec) => {
    const rawValue = spec?.spec_values?.[0]?.value;
    const rawValueL1 = spec?.spec_values?.[0]?.value_l1;

    const shouldAddHref = slugsWithHref[spec?.slug];
    const shouldFormat = slugsWithFormattedValues[spec?.slug];

    const value =
      shouldFormat && rawValue ? formatNumberValue(rawValue) : rawValue;
    const valueL1 =
      shouldFormat && rawValueL1 ? formatNumberValue(rawValueL1) : rawValueL1;

    return {
      label: spec.label,
      label_l1: spec.label_l1,
      value: value,
      value_l1: valueL1,
      ...(shouldAddHref && {
        href: `${appPaths[`new-${listing_category?.slug}`]}/${spec?.slug}/${
          spec?.spec_values?.[0]?.slug
        }`,
      }),
    };
  });
};

export const mapModelData = (data) => {
  const videoReviews = convertToEmbedLinks(data?.new_listing_videos);
  const make = data?.make;
  const model = data?.model;
  const listing_category = data?.listing_category;
  const priceNotAvailable = data?.price_not_available;
  const prices = {
    official: {
      min: data?.min_official_price ?? null,
      max: data?.max_official_price ?? null,
    },
    market: { min: data?.min_market_price, max: data?.max_market_price },
    minDeposit: data?.price_ranges?.min_deposit || null,
    minInstallment: data?.price_ranges?.min_installment || null,
    discountUpto: data?.discount,
    cashback: data?.cashback,
    priceNotAvailable: data?.price_not_available,
  };
  const variantCount = data?.variant_count;

  return {
    shape: data?.shape,
    videoReviews,
    make,
    model,
    prices,
    variantCount,
    listing_category,
    generation: data?.generation,
    images: transformImages(
      data?.new_listing_images || data?.new_listing_image,
    ),
    priceNotAvailable,
    imported: data?.imported,
    launch_year: data?.launch_year,
  };
};

export const mapVariantsData = ({
  all_variants = [],
  listing_category,
  new_listing_images,
  ...rest
}) => {
  return {
    ...rest,
    listing_category,
    images: transformImages(new_listing_images),
    variantsTableData: all_variants.map((variant) => {
      const features = [];

      if (variant?.power?.value) {
        features.push({ label: variant.power.value, slug: 'power' });
      }

      // Build model slug with shape if it exists
      let modelSlug = variant?.model?.slug;
      if (variant?.shape?.slug) {
        modelSlug = `${variant?.model?.slug}-shape-${variant?.shape?.slug}`;
      }

      // Determine the price values based on the 'price_not_available' flag
      const isPriceNotAvailable = variant?.price_not_available === true;

      const officialPrice = isPriceNotAvailable
        ? null
        : (variant.price ?? variant.official_price ?? null);

      const newPrice = variant.price ?? variant.official_price ?? null;

      const marketPrice = isPriceNotAvailable
        ? { min: null, max: null }
        : {
            min: variant.price_ranges?.min_market_price ?? null,
            max: variant.price_ranges?.max_market_price ?? null,
          };

      const minDeposit = isPriceNotAvailable
        ? null
        : (variant.price_ranges?.min_deposit ?? null);

      const minInstallment = isPriceNotAvailable
        ? null
        : (variant.price_ranges?.min_installment ?? null);

      const oldPrice = variant?.old_price ?? null;

      // The priceChange value and date are typically null/empty if the price is not available,
      // but explicitly setting the value to null here ensures consistency for the UI.
      const priceChangeValue = variant?.price_difference?.difference;
      const priceChangeDate = variant?.price_difference?.created_at;
      const actionButton = {
        children: 'Compare',
        variant: 'tertiary',
        icon: 'addIcon',
        iconPosition: 'right',
        item: {
          id: variant?.id,
          image:
            transformImages(variant?.new_listing_images)?.[0]?.medium || null,
          href: `${appPaths[`new-${listing_category?.slug}-compare-terazes`]}/${
            variant?.variant?.id
          }`,
          title: `${variant?.make?.label} ${variant?.model?.label} ${variant?.launch_year} ${variant?.variant?.label}`,
          title_l1: `${variant?.make?.label_l1} ${variant?.model?.label_l1} ${variant?.launch_year} ${variant?.variant?.label_l1}`,
        },
      };

      return {
        id: variant?.id,
        overview: {
          title: `${variant?.make?.label} ${variant?.model?.label} ${variant?.launch_year} ${variant?.variant?.label}`,
          title_l1: `${variant?.make?.label_l1} ${variant?.model?.label_l1} ${variant?.launch_year} ${variant?.variant?.label_l1}`,
          features,
          href: `${appPaths[`new-${listing_category?.slug}`]}/${
            variant?.make?.slug
          }/${modelSlug}/${variant?.variant?.id}`,
        },
        // Price fields set to null if price_not_available is true
        officialPrice: officialPrice,
        newPrice: newPrice,
        marketPrice: marketPrice,
        minDeposit: minDeposit,
        minInstallment: minInstallment,
        oldPrice: oldPrice,
        priceNotAvailable: isPriceNotAvailable,
        actionButton: actionButton,
        priceChange: {
          value: priceChangeValue,
          dateOfChange: priceChangeDate,
        },
        hrefCompare: `${
          appPaths[`new-${listing_category?.slug}-compare-terazes`]
        }/${variant?.id}`,
      };
    }),
  };
};
export const mapNewListingVariantLevelResponse = (data) => {
  const specs = data?.specs?.description || [];
  const features = mapGroupedFeatures(data?.specs?.features);
  const images = transformImages(
    data?.new_listing_images || data?.new_listing_image,
  );
  const videoReviews = convertToEmbedLinks(data?.new_listing_videos);
  const specifications = transformSpecifications(specs, data?.listing_category);

  const transmissionSpec = specs?.find((s) => s?.slug === 'transmission');
  const fuelSpec = specs?.find((s) => s?.slug === 'fuel-type');
  const powerSpec = specs?.find((s) => s?.slug === 'power');
  const priceNotAvailable = data?.price_not_available;

  const specificationList = [
    { label: data?.launch_year, slug: 'year' },
    {
      label: transmissionSpec?.spec_values?.[0]?.label,
      label_l1: transmissionSpec?.spec_values?.[0]?.label_l1,
      slug: 'transmission',
    },
    {
      label: fuelSpec?.spec_values?.[0]?.label,
      label_l1: fuelSpec?.spec_values?.[0]?.label_l1,
      slug: 'fuel',
    },
  ];

  const prices = {
    official: {
      min: data?.price,
    },
    market: {
      min: data?.price_ranges?.min_market_price,
      max: data?.price_ranges?.max_market_price,
    },
    minDeposit: data?.price_ranges?.min_deposit || null,
    minInstallment: data?.price_ranges?.min_installment || null,
    discountUpto: data?.discount,
    cashback: data?.cashback,
    priceNotAvailable: data?.price_not_available,
  };
  return {
    ...data,
    prices,
    features,
    videoReviews,
    specificationList,
    specifications,
    images,
    priceNotAvailable,
  };
};

export const mapNewListingModelLevelResponse = (
  data,
  includeGenerations = false,
) => {
  if (!data) {
    return null;
  }
  if (includeGenerations && !data?.listings?.length) {
    return null;
  }
  const basicDetails = mapModelData(
    includeGenerations ? data?.listings?.[0] : data,
  );

  let generations = null;
  if (includeGenerations) {
    generations = data?.listings
      ?.map((listing) => mapVariantsData(listing))
      .filter((gen) => gen?.imported?.slug !== 'yes');
  }

  return {
    ...basicDetails,
    ...(includeGenerations && {
      generations,
      years: generations?.map((generation) => {
        return generation?.launch_year;
      }),
    }),
  };
};

export const mapNewCarsModelCatalog = (response) => {
  if (!response?.listings || !Array.isArray(response.listings)) {
    return [];
  }
  return response?.listings.map((item) => {
    return mapNewListingModelLevelResponse(item);
  });
};

export const mapNewCarsVariantCatalog = (response) => {
  if (!response?.listings || !Array.isArray(response.listings)) {
    return [];
  }
  return response?.listings.map((item) => {
    return mapNewListingVariantLevelResponse(item);
  });
};

export const mapDifferencewithOtherClasses = (response) => {
  if (!response?.variant_differences?.length) {
    return [];
  }
  return response?.variant_differences?.map((item) => {
    return {
      id: item?.id,
      label: item?.title,
      label_l1: item?.title_l1,
      make: item?.make,
      model: item?.model,
      generation: item?.generation,
      listing_category: item?.listing_category,
      variant: item?.variant,
      price: item?.price,
      images: transformImages(item?.new_listing_images),
      href: `${appPaths[`new-${item?.listing_category?.slug}`]}/${
        item?.make?.slug
      }/${item?.model?.slug}/${item?.variant?.id}`,
      list: item?.included_specs?.map((point) => {
        return {
          id: point?.id,
          label: point?.title,
          label_l1: point?.title_l1,
          slug: point?.slug,
        };
      }),
    };
  });
};
