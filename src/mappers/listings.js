import configs from '@/configs';
import { appPaths, IMAGES_BASE_URL, newVehiclePlaceholder } from '@/constants';
import { getAsset, transformImages } from '@/utils/general';
import { formatNumberValue } from '@/utils/numbers';

// Contact-detail delivery seam (anti-scraping): raw phone/whatsapp/email/mobile
// values are always stripped from the client payload so they never reach the
// server-rendered HTML; only presence flags survive to gate CTA visibility. The
// real values are fetched on click from the reCAPTCHA-gated endpoint.
const mapContactDetails = (contact_details) => {
  const raw = contact_details || {};

  // eslint-disable-next-line no-unused-vars
  const { phone, mobile, whatsapp, email, ...safe } = raw;

  // Each channel is resolved independently — no key depends on another:
  //  - has_<channel> present as a boolean  -> use it verbatim (true shows, false hides)
  //  - has_<channel> absent                -> fall back to that channel's raw
  //    Elastic value, exactly as before.
  return {
    ...safe,
    has_phone:
      typeof raw.has_phone === 'boolean' ? raw.has_phone : !!(phone || mobile),
    has_email:
      typeof raw.has_email === 'boolean' ? raw.has_email : !!email,
    has_whatsapp:
      typeof raw.has_whatsapp === 'boolean' ? raw.has_whatsapp : !!whatsapp,
  };
};

export const mapGroupedFeatures = (featuresArray = []) => {
  if (!featuresArray.length) return [];
  const grouped = featuresArray?.reduce((acc, feature) => {
    const sectionSlug = feature?.dynamic_section?.slug;

    if (!acc[sectionSlug]) {
      acc[sectionSlug] = {
        label: feature?.dynamic_section?.name,
        label_l1: feature?.dynamic_section?.name_l1,
        display_order: feature?.dynamic_section?.display_order,
        features: [],
      };
    }

    acc[sectionSlug].features.push({
      label: feature.label,
      label_l1: feature.label_l1,
    });

    return acc;
  }, {});

  return Object.values(grouped).sort((a, b) => {
    const orderA = a.display_order ?? Number.MAX_SAFE_INTEGER;
    const orderB = b.display_order ?? Number.MAX_SAFE_INTEGER;
    return orderA - orderB;
  });
};

export const mapCarAdDetails = (source, context = 'list') => {
  const dynamic_fields = source?.dynamic_fields || source;

  const {
    make,
    model,
    variant,
    condition,
    transmission,
    fuel_type,
    exterior_color,
    assembled,
    origin,
    features,
    financed,
    imported,
    taxi,
    power,
    disabled,
    kasr_zero,
    km,
    year,
    spec,
  } = dynamic_fields || {};

  const {
    price,
    images,
    agency,
    products_information,
    location,
    contact_details,
    listing_id,
    listing_external_id,
    posted_at,
    updated_at,
  } = source || {};

  const transformedImages = transformImages(images);

  const tags = [
    ...(products_information?.some((item) => item?.slug === 'signature-listing')
      ? ['premium']
      : []),
      ...(products_information?.some((item) => item?.slug === 'turbo')
      ? ['turbo']
      : []),
    // LP-5351: 'financed' is shown via the price badge now, not a gallery tag
    // ...(financed?.slug === 'yes' && context === 'detail' ? ['financed'] : []),
    ...(imported?.slug == 'yes' && context === 'detail' ? ['imported'] : []),
  ];

  const specField = spec;
  const specLabel = specField?.label;
  const specLabel_l1 = specField?.label_l1;

  const itemList = [
    ...(configs.spec_visibility && specLabel
      ? [
          {
            label: specLabel,
            label_l1: specLabel_l1,
            slug: 'spec',
          },
        ]
      : []),
    { label: year, slug: 'year' },
    {
      label:
        km != null
          ? formatNumberValue(km)
          : condition?.slug === 'new'
          ? formatNumberValue(0)
          : null,
      slug: 'km',
    },
    {
      label: transmission?.label,
      label_l1: transmission?.label_l1,
      slug: 'transmission',
    },
    {
      label: fuel_type?.label,
      label_l1: fuel_type?.label_l1,
      slug: 'fuel',
    },
  ];

  const mappedAd = {
    ...source,
    min_installment: dynamic_fields?.min_installment,
    images: transformedImages,
    tags,
    price,
    contact_details: mapContactDetails(contact_details),
    specifications: [
      {
        label: 'Brand',
        value: make?.label,
        value_l1: make?.label_l1,
      },
      {
        label: 'Model',
        value: model?.label,
        value_l1: model?.label_l1,
      },
      {
        label: 'Class',
        value: variant?.label,
        value_l1: variant?.label_l1,
      },
      {
        label: 'Condition',
        value: condition?.label,
        value_l1: condition?.label_l1,
      },
      {
        label: 'Color',
        value: exterior_color?.value,
        value_l1: exterior_color?.value_l1,
      },
      {
        label: 'cc',
        value: power,
      },
      {
        label: 'Posted On',
        slug: 'posted_at',
        value: posted_at,
      },
      {
        label: 'Last Updated',
        slug: 'updated_at',
        value: updated_at,
      },
      {
        label: 'Location',
        value: location?.title,
        value_l1: location?.title_l1,
      },
      ...(condition?.slug === 'new' && assembled
        ? [
            {
              label: 'Assembly Country',
              value: assembled?.value,
              value_l1: assembled?.value_l1,
              href: `${appPaths?.['new-car']}/assembled/${assembled?.slug}`,
            },
          ]
        : []),

      ...(condition?.slug === 'new' && origin
        ? [
            {
              label: 'Origin Country',
              value: origin?.value,
              value_l1: origin?.value_l1,
              href: `${appPaths?.['new-car']}/origin/${origin?.slug}`,
            },
          ]
        : []),
    ],
    specificationList: itemList,
  };

  if (context === 'list') {
    const href = `${
      condition?.slug === 'new' ? appPaths['new-car'] : appPaths.usedCars
    }/${make?.slug}/${model?.slug}/${
      condition?.slug === 'new'
        ? `${variant?.id}/${listing_external_id}`
        : listing_id
    }`;

    const isImportedNewCar =
      imported?.slug === 'yes' && condition?.slug === 'new';

    const validBreadcrumbs = location?.breadcrumbs
      ?.reverse()
      ?.filter((data) => data?.level > 1);

    const hasValidBreadcrumbs = validBreadcrumbs && validBreadcrumbs.length > 0;

    const listingChips = [
      location &&
        hasValidBreadcrumbs &&
        (isImportedNewCar ||
          condition?.slug === 'used' ||
          condition?.slug === 'new') && {
          label: validBreadcrumbs.map((b) => b.title).join(', '),
          label_l1: validBreadcrumbs.map((b) => b.title_l1).join(', '),
          icon: 'location-icon',
          // City: Link if not imported (Normal Cars), Text if imported
          ...(isImportedNewCar || condition?.slug === 'new'
            ? {}
            : {
                href: `${appPaths.usedCars}/city/${location?.slug}`,
                hrefTitleKey: 'cars_in_city',
                hrefTitleParams: {
                  label: make?.label,
                  label_l1: make?.label_l1,
                  city: validBreadcrumbs.map((b) => b.title).join(', '),
                  city_l1: validBreadcrumbs.map((b) => b.title_l1).join(', '),
                },
              }),
        },
      !isImportedNewCar &&
        make?.slug && {
          label: make.label,
          label_l1: make.label_l1,
          // Brand: Always Link (all cases show Brand as Link)
          href: `${appPaths.usedCars}/${make.slug}`,
          hrefTitleKey: 'cars_in_city',
          hrefTitleParams: {
            label: make?.label,
            label_l1: make?.label_l1,
          },
        },
      !isImportedNewCar &&
        model?.slug && {
          label: model.label,
          label_l1: model.label_l1,
          // Model: Link if not imported, Text if imported (Premium Cars case)
          // For Normal Cars, always Link
          // For Imported cases, Brand & Model combined as Link
          href: `${appPaths.usedCars}/${make?.slug}/${model?.slug}`,
          hrefTitleKey: 'cars_in_city',
          hrefTitleParams: {
            label: model?.label,
            label_l1: model?.label_l1,
          },
        },

      isImportedNewCar && {
        label: `${make?.label} ${model?.label}`,
        label_l1: `${make?.label_l1} ${model?.label_l1}`,
        href: `${appPaths.usedCars}/${make?.slug}/${model?.slug}`,
        hrefTitleKey: 'cars_in_city',
        hrefTitleParams: {
          label: `${make?.label} ${model?.label}`,
          label_l1: `${make?.label_l1} ${model?.label_l1}`,
        },
      },

      variant?.slug && {
        label: variant.label,
        label_l1: variant.label_l1,
        href: `${appPaths.usedCars}/${make.slug}/${model.slug}/teraz/${variant.id}`,
        hrefTitleKey: 'cars_in_city',
        hrefTitleParams: {
          label: `${make?.label} ${model?.label} ${variant?.label}`,
          label_l1: `${make?.label_l1} ${model?.label_l1} ${variant?.label_l1}`,
        },
      },

      fuel_type?.slug == 'electric' && {
        label: fuel_type?.label,
        label_l1: fuel_type.label_l1,
        // Electric: Link if not imported, Text if imported
        ...(!isImportedNewCar
          ? {
              href: `${appPaths.usedCars}/${fuel_type?.slug}`,
              hrefTitleKey: 'fuel_type_cars_for_sale',
              hrefTitleParams: {
                label: fuel_type?.label,
                label_l1: fuel_type?.label_l1,
              },
            }
          : {}),
      },

      fuel_type?.slug == 'hybrid' && {
        label: fuel_type?.label,
        label_l1: fuel_type.label_l1,
        // Hybrid: Link if not imported, Text if imported
        ...(!isImportedNewCar
          ? {
              href: `${appPaths.usedCars}/${fuel_type?.slug}`,
              hrefTitleKey: 'fuel_type_cars_for_sale',
              hrefTitleParams: {
                label: fuel_type?.label,
                label_l1: fuel_type?.label_l1,
              },
            }
          : {}),
      },
    ].filter(Boolean);

    if (financed && financed.slug === 'yes') {
      listingChips.push({
        label: 'Financed',
        // Installment: Link if not imported, Text if imported
        ...(isImportedNewCar
          ? {}
          : {
              href: appPaths.usedCarsFinanced,
              hrefTitleKey: 'financed_cars_for_sale',
              hrefTitleParams: {
                label: 'Financed',
              },
            }),
      });
    }
    if (isImportedNewCar) {
      listingChips.push({
        label: 'Imported',
        href: appPaths.usedImportedCars,
        hrefTitleKey: 'imported_cars_for_sale',
        hrefTitleParams: {
          label: 'Imported',
        },
      });
    }

    if (taxi?.slug === 'yes') {
      listingChips.push({
        label: 'Taxi',
        // Taxi: Link if not imported, Text if imported
        ...(isImportedNewCar
          ? {}
          : {
              href: '/car/taxi',
              hrefTitleKey: 'taxi_cars_for_sale',
              hrefTitleParams: { label: 'Taxi' },
            }),
      });
    }

    if (kasr_zero) {
      listingChips.push({
        label: 'Low KM',
        // Kasr Zero: Link if not imported, Text if imported
        ...(isImportedNewCar
          ? {}
          : {
              href: '/car/kasr-zero',
              hrefTitleKey: 'kasr_zero_cars_for_sale',
              hrefTitleParams: { label: 'Low KM' },
            }),
      });
    }

    if (disabled?.slug === 'yes') {
      listingChips.push({
        label: 'Disabled',
        // Disabled: Link if not imported, Text if imported
        ...(isImportedNewCar
          ? {}
          : {
              href: '/car/disabled',
              hrefTitleKey: 'disabled_cars_for_sale',
              hrefTitleParams: { label: 'Disabled' },
            }),
      });
    }

    Object.assign(mappedAd, {
      href,
      itemList,
      listingChips,
      ...(agency?.id
        ? {
            dealerTag:
              agency?.agency_logo ||
              getAsset('/assets/agency-placeholder.webp'),
            dealerLink: `/showroom/${agency.slug}`,
          }
        : {}),
    });
  } else if (context === 'detail') {
    const mappedFeatures = mapGroupedFeatures(features || []);

    Object.assign(mappedAd, {
      features: mappedFeatures,
      href: null,
      itemList: null,
      listingChips: null,
      dealerTag: null,
      dealerLink: null,
    });
  }

  return mappedAd;
};

export const mapNewCarVaraintDeails = (source) => {};

export function transformRecentlySearched(data, locale, commonT) {
  const transformedSearch = data
    ? Object.keys(data)
        .map((key) => {
          const item = data[key];
          const makeLabel = item?.make?.label;
          const modelLabel = item?.model?.label;
          const makeLabel_l1 = item?.make?.label_l1;
          const modelLabel_l1 = item?.model?.label_l1;
          const makeSlug = item?.make?.slug;
          const modelSlug = item?.model?.slug;
          const searchKey = `${makeSlug}-${modelSlug}`;
          const link = data[searchKey]?.pathname || '#';

          const price = item?.price
            ? item.price.min && item.price.max
              ? ` ${configs?.currency?.[locale]?.label} ${formatNumberValue(
                  item.price.min,
                )} - ${formatNumberValue(item.price.max)}`
              : ` ${configs?.currency?.[locale]?.label} ${formatNumberValue(
                  item.price.min || item.price.max,
                )}`
            : null;

          const km = item?.mileage
            ? item.mileage.min && item.mileage.max
              ? `${formatNumberValue(item.mileage.min)} - ${formatNumberValue(
                  item.mileage.max,
                )} ${commonT('km')}`
              : `${formatNumberValue(
                  item.mileage.min || item.mileage.max,
                )} ${commonT('km')}`
            : null;

          const color = item?.color?.label ? commonT(item.color.label) : null;
          const city = item?.city?.label
            ? locale === 'en'
              ? item.city.label
              : item.city.label_l1 || item.city.label
            : null;

          const condition = item?.condition?.label
            ? commonT(item.condition.label)
            : null;
          const year = item?.year
          ? item.year.min != null && item.year.max != null
            ? item.year.min === item.year.max
              ? String(item.year.min)
              : `${item.year.min} - ${item.year.max}`
            : item.year.min != null
              ? `${commonT('from')} ${item.year.min}`
              : item.year.max != null
                ? `${commonT('to')} ${item.year.max}`
                : null
          : null;

          const itemList = [year, city, condition, km, price, color]?.filter(Boolean);
          return {
            title:
              locale == 'en'
                ? `${makeLabel || ''} ${modelLabel || ''}`.trim()
                : `${makeLabel_l1 || ''} ${modelLabel_l1 || ''}`.trim(),
            itemList: itemList?.length ? itemList : null,
            link,
            timestamp: item?.timestamp,
            brand: makeSlug || null,
            model: modelSlug || null,
          };
        })
        .sort((a, b) => (b.timestamp || 0) - (a.timestamp || 0))
    : [];
  return transformedSearch;
}

export function getTransformedCities(items) {
  return items?.map((data) => ({
    ...data,
    label: data?.city_info?.hits?.hits[0]?._source?.location?.title,
    label_l1: data?.city_info?.hits?.hits[0]?._source?.location?.title_l1,
    slug: data?.city_info?.hits?.hits[0]?._source?.location?.slug,
  }));
}

export function transformModels(data) {
  const updatedModels = data?.map((item) => {
    return {
      ...item,
      label:
        item?.labels?.hits?.hits[0]?._source?.make?.label +
        ' ' +
        item?.labels?.hits?.hits[0]?._source?.model?.label,
      label_l1:
        item?.labels?.hits?.hits[0]?._source?.make?.label_l1 +
        ' ' +
        item?.labels?.hits?.hits[0]?._source?.model?.label_l1,
      makeSlug: item?.labels?.hits?.hits[0]?._source?.make?.slug,
      modelSlug: item?.labels?.hits?.hits[0]?._source?.model?.slug,
      makeId: item?.labels?.hits?.hits[0]?._source?.make?.id,
      modelId: item?.labels?.hits?.hits[0]?._source?.model?.id,
      src: configs.USE_MAKE_MODEL__TABS_IMAGES
        ? `${IMAGES_BASE_URL}/${item?.labels?.hits?.hits[0]?._source?.model?.slug}/thumbnail.png`
        : getAsset(`/assets/${newVehiclePlaceholder.car}`),
    };
  });
  return updatedModels;
}

export const orderAdsByIds = (mappedAds, listingIds) => {
  return listingIds
    .map((originalId) => {
      const idStr = String(originalId);
      const normalizedId = idStr.startsWith('new-')
        ? idStr.replace('new-', '')
        : idStr;

      return mappedAds.find((ad) => {
        return (
          String(ad.listing_id) === normalizedId ||
          String(ad.listing_external_id) === normalizedId
        );
      });
    })
    .filter(Boolean);
};
