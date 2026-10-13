import configs from '@/configs';
import { appPaths, IMAGES_BASE_URL } from '@/constants';
const newCarPricingDataMapper = (apiData = [], vehicle = 'car') =>
  apiData.map((item) => {
    // Build model slug with shape if it exists
    let modelSlug = item?.model?.slug;
    if (item?.shape?.slug) {
      modelSlug = `${item?.model?.slug}-shape-${item?.shape?.slug}`;
    }

    return {
      id: item?.id,
      overview: {
        image: item?.new_listing_images?.thumbnail || '',
        title: `${item?.make?.label} ${item?.model?.label} ${
          item?.launch_year
        }${item?.shape?.label ? ` ${item?.shape?.label}` : ''}`,
        title_l1: `${item?.make?.label_l1} ${item?.model?.label_l1} ${
          item?.launch_year
        }${item?.shape?.label_l1 ? ` ${item?.shape?.label_l1}` : ''}`,
        href: `${appPaths[`new-${vehicle}`]}/${item?.make?.slug}/${modelSlug}`,
        features: [
          {
            label: item?.variant?.label,
            label_l1: item?.variant?.label_l1,
            slug: 'variant',
          },
          ...(item?.power?.value
            ? [{ label: item?.power?.value, slug: 'power' }]
            : []),
        ].filter(Boolean),
      },
      officialPrice: item?.price,
      marketPrice: {
        min: item?.price_ranges?.min_market_price,
        max: item?.price_ranges?.max_market_price,
      },
    };
  });

export const mapNewCarPriceChanges = (data) => {
  const priceChangesData = (data?.price_logs || [])?.map((item) => {
    // Build model slug with shape if it exists
    let modelSlug = item?.new_listing?.model?.slug;
    if (item?.new_listing?.shape?.slug) {
      modelSlug = `${item?.new_listing?.model?.slug}-shape-${item?.new_listing?.shape?.slug}`;
    }

    return {
      overview: {
        title: `${item?.new_listing?.make?.label} ${item?.new_listing?.model?.label} ${item?.new_listing?.variant?.label} ${item?.new_listing?.launch_year}`,
        title_l1: `${item?.new_listing?.make?.label_l1} ${item?.new_listing?.model?.label_l1} ${item?.new_listing?.variant?.label_l1} ${item?.new_listing?.launch_year}`,
        href: `${
          appPaths[`new-${item?.new_listing?.listing_category?.slug}`]
        }/${item?.new_listing?.make?.slug}/${modelSlug}/${
          item?.new_listing?.variant?.id
        }`,
      },
      newPrice: item?.new_price ?? null,
      oldPrice: item?.old_price ?? null,
      priceChange: {
        value: item?.difference ?? null,
        dateOfChange: item?.created_at ?? null,
      },
    };
  });

  return priceChangesData;
};

const newCarPriceMakesMapper = ({ apiData = [], priceChange, make, vehicle }) =>
  apiData?.map((item) => {
    return {
      label: item?.label,
      label_l1: item?.label_l1,
      slug: item?.slug,
      image: make
        ? item?.logo
        : item?.logo || `${IMAGES_BASE_URL}/${item?.slug}/thumbnail.png`,
      href: priceChange
        ? make
          ? `${appPaths[`new-${vehicle}`]}/${make}/${item?.slug}#price-changes`
          : `${appPaths['newCarsPriceChanges']}/${item?.slug}`
        : `${appPaths[`new-${vehicle}-prices-make`]}/${item?.slug}`,
      ...(!configs.USE_BRAND_SPRITE && {
        src: `${IMAGES_BASE_URL}/${item?.slug}/thumbnail.png`,
      }),
    };
  });

export { newCarPriceMakesMapper, newCarPricingDataMapper };
