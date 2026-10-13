import { fetchBodyTypesData } from '@/apis/new-cars-listings';
import tenantFilterData from '@data';
import { parentClasses } from '@/data/listings/used-cars/spriteMapping';
import { LocationIcon, RangeIcon } from '@/icons/basicSvgs';
import { ListingsService } from '@/services/elasticsearch/listings-service';
import { MakesService } from '@/services/elasticsearch/makes-service';
import { ModelsService } from '@/services/elasticsearch/models-service';
import { getAsset, getLocaleString } from '@/utils/general';
import { getLocale, getTranslations } from 'next-intl/server';
import { MultilineCarousel } from '../common/carousel/multlineCarousel';
import { ChipWithIcon } from '../common/chip-with-icon/chip-with-icon';
import NextLink from '../common/nextLink';
import OptionCard from '../common/optionCard/optionCard';
import { Tabs } from '../common/tabs';
import { cn } from '@/utils';
import configs from '@/configs';
import { AllBrandsIcon, AllCitiesIcon, AllModelsIcon } from '@/icons';
import tenantData from '@data';
import { IMAGES_BASE_URL } from '@/constants';
import { formatNumberValue } from '@/utils/numbers';
import { PAGE_TYPES } from '@/services/analyticsService/constants';
import { buildUsedCarListingUrl } from '@/services/urlBuilder/usedCarListingUrl';
import { extractPriceRange } from '@/utils/used-cars/listings';
// import { isMobileServer } from '@/utils/serverFunctions';

export const getModelLink = (make, model) => `/car/${make}/${model}`;
const getBodyTypesByCondition = async (vehicleParam, categorySlug) => {
  if (vehicleParam !== 'car') {
    const items = await fetchBodyTypesData(categorySlug);
    return {
      body: {
        key: 'body-styles',
        label: 'Body Styles',
        value: 'body',
        hasCount: true,
        items,
      },
    };
  }
  return ListingsService.getBodyTypes(10);
};
const MakeModelTabs = async ({
  carPurposeTitle,
  isMobile,
  tabsToShow = [
    'makes',
    'models',
    'bodyTypes',
    'ccRanges',
    'cities',
    'priceRanges',
    'specialConditions',
  ],
  locale: paramsLocale,
  categorySlug = 'car',
  vehicleParam = 'car',
  tabsClassName,
  pageType = PAGE_TYPES.HOME,
  scopeFilters,
  makesScopeFilters,
  extraTabs = [],
  hideCounts = false,
}) => {
  const locale = paramsLocale || (await getLocale());

  const getBodyTypeLink = (itemSlug) => `/${vehicleParam}/body/${itemSlug}`;
  const scopedLink = (filters, scope = scopeFilters) =>
    scope ? buildUsedCarListingUrl({ ...filters, ...scope }) : null;

  // Carousel configurations for each tab type
  // makes: 16 total (15 + view all) - 2 rows, 8 each
  // models: 16 total (15 + view all) - 2 rows, 8 each
  // cities: 16 total (15 + view all) - 2 rows, 8 each
  // priceRanges: 10 total - 2 rows, 5 each
  // ccRanges: 16 total - 2 rows, 8 each
  // specialConditions: 7 total - single row
  // bodyTypes: 6 total - single row
  const getCarouselConfig = (key) => {
    switch (key) {
      case 'makes':
      case 'models':
      case 'cities':
        return {
          rows: 2,
          threshold: isMobile ? 6 : 12,
          itemBasis: 'basis-[30%] md:basis-[25%] lg:basis-[16.67%]',
        };
      case 'priceRanges':
        return {
          rows: 2,
          threshold: isMobile ? 4 : 12,
          itemBasis: 'basis-[32%] md:basis-[25%] lg:basis-[16.66%]',
        };
      case 'ccRanges':
        return {
          rows: 2,
          threshold: isMobile ? 4 : 15,
          itemBasis: 'basis-[30%] md:basis-[25%] lg:basis-[14.28%]',
        };
      case 'specialConditions':
        return {
          rows: 2,
          threshold: 6,
          itemBasis: isMobile
            ? 'basis-[25%] md:basis-[25%] lg:basis-[14%]'
            : 'basis-[45%] md:basis-[33.33%] lg:basis-[33.33%]',
          gridClassName: 'grid-cols-3',
        };
      case 'bodyTypes':
        return {
          rows: 2,
          threshold: isMobile ? 6 : 8,
          itemBasis: 'basis-[33.33%] md:basis-[25%] lg:basis-[25%]',
          gridClassName: isMobile ? 'grid-cols-3' : 'grid-cols-4',
        };
      default:
        return {
          rows: 2,
          threshold: isMobile ? 4 : 16,
          itemBasis: 'basis-[50%] md:basis-[25%] lg:basis-[12.5%]',
        };
    }
  };

  const dataFetchers = {
    makes: () => MakesService.getTopMakes(15), // 15 + view all = 16
    models: () => ModelsService.getTopModels(15), // 15 + view all = 16
    bodyTypes: () => getBodyTypesByCondition(vehicleParam, categorySlug),
    ccRanges: () => ListingsService.getCCRanges(),
    cities: () => ListingsService.getTopCitiesForAds(15), // 15 + view all = 16
  };

  const t = await getTranslations({ locale, namespace: 'common' });

  const fetchedData = await Promise.all(
    tabsToShow
      .filter((key) => dataFetchers[key])
      .map((key) => dataFetchers[key]()),
  );

  const dataMap = {};
  tabsToShow.forEach((key, index) => {
    if (dataFetchers[key]) dataMap[key] = fetchedData[index];
  });

  const carTabs = [];

  const getAllLinkCard = (type) => {
    const Icon =
      type === 'cities'
        ? AllCitiesIcon
        : type === 'models'
          ? AllModelsIcon
          : AllBrandsIcon;
    const dataObj = {
      customImage: <Icon />,
    };
    switch (type) {
      case 'makes':
        return {
          label: 'All Brands',
          slug: 'makes',
          link: '/car/makes',
          ...dataObj,
        };
      case 'models':
        return {
          label: 'All Models',
          slug: 'models',
          link: '/car/models',
          ...dataObj,
        };
      case 'cities':
        return {
          label: 'All Cities',
          slug: 'cities',
          link: '/car/cities',
          ...dataObj,
        };
    }
  };

  if (dataMap.makes) {
    dataMap.makes.items = [...dataMap.makes.items, getAllLinkCard('makes')];
    carTabs.push({
      ...dataMap.makes,
      ...getCarouselConfig('makes'),
      items:
        dataMap.makes.items?.map((item) => ({
          ...item,
          hrefTitle: `${
            locale == 'en' ? item?.label : item?.label_l1
          } ${carPurposeTitle}`,
          link:
            item?.link ||
            // Match used-car filter URLs: id-based when scoped (?make=<id>&fuel=…).
            // makesScopeFilters lets a page scope makes to a pretty-page-backed
            // filter combination (e.g. EV landing → /car/:make/electric).
            scopedLink(
              { make: { id: item?.id, slug: item?.slug } },
              makesScopeFilters ?? scopeFilters,
            ) ||
            `/car/${item?.slug}`,
        })) || [],
    });
  }

  if (dataMap.models) {
    dataMap.models.items = [...dataMap.models.items, getAllLinkCard('models')];

    carTabs.push({
      ...dataMap.models,
      ...getCarouselConfig('models'),
      items:
        dataMap.models.items?.map((item) => ({
          ...item,
          hrefTitle: `${getLocaleString(
            item,
            'label',
            locale,
          )} ${carPurposeTitle}`,
          link:
            item?.link ||
            scopedLink({
              make: { id: item?.makeId, slug: item?.makeSlug },
              model: { id: item?.modelId, slug: item?.modelSlug },
            }) ||
            getModelLink(item?.makeSlug, item?.modelSlug),
        })) || [],
    });
  }

  if (dataMap?.cities) {
    dataMap.cities.items = [
      ...(dataMap.cities.items || []),
      getAllLinkCard('cities'),
    ];

    carTabs.push({
      ...dataMap.cities,
      ...getCarouselConfig('cities'),
      items: dataMap.cities.items?.map((data) => ({
        ...data,
        link:
          data?.link ||
          scopedLink({ city: { id: data?.id, slug: data?.slug } }) ||
          `/car/city/${data?.slug}`,
        icon: <LocationIcon size={32} className="text-gray-400" />,
        src: configs.USE_MAKE_MODEL__TABS_IMAGES
          ? `${IMAGES_BASE_URL}/${data?.slug}/thumbnail.png`
          : getAsset(`/assets/city-placeholder.webp`),
      })),
    });
  }

  if (tabsToShow.includes('priceRanges')) {
    const priceRangeItems = tenantFilterData.usedListingsFilterData.priceRanges
      .slice(0, 10) // Take only 10 items
      .map((pr) => ({
        ...pr,
        ...(isMobile
          ? {
              label: t('under_price', {
                price: `${pr.label} ${configs.currency?.[locale]?.label}`,
              }),
              labelText: (
                <>
                  <span className="text-xs text-gray-light block text-center">
                    {t('Under')}
                  </span>
                  {`${pr.label} ${configs.currency?.[locale]?.label}`}
                </>
              ),
            }
          : { label: `${pr.label} ${configs.currency?.[locale]?.label}` }),
        link:
          scopedLink({ price: extractPriceRange(pr.slug) }) ||
          `/${vehicleParam}/price-limit/${pr.slug}`,
        hrefTitle: t('price_range_href', {
          vehicle: t(categorySlug),
          range: `${getLocaleString(pr, 'label', locale)}`,
          currency: configs.currency?.[locale]?.label,
          country: configs.country?.[locale]?.label,
        }),
      }));

    carTabs.push({
      label: 'Price Ranges',
      value: 'price-range',
      type: 'badge',
      ...getCarouselConfig('priceRanges'),
      items: priceRangeItems,
    });
  }

  if (dataMap.bodyTypes) {
    const bodyTypesData =
      dataMap?.bodyTypes?.body?.items || dataMap?.bodyTypes || [];
    carTabs.push({
      label: 'Body Styles',
      key: 'body-styles',
      value: 'body',
      hasCount: true,
      ...getCarouselConfig('bodyTypes'),
      items:
        bodyTypesData.map((item) => ({
          // Take only 6 items
          ...item,
          hrefTitle: `${getLocaleString(
            item,
            'label',
            locale,
          )} ${carPurposeTitle}`,
          link: getBodyTypeLink(item?.slug),
          spriteClass: `${parentClasses?.body} body-${item?.slug}`,
          doc_count: item?.doc_count || item?.count,
        })) || [],
    });
  }

  if (tabsToShow.includes('specialConditions')) {
    carTabs.push({
      label: 'Special Conditions',
      value: 'special-conditions',
      ...getCarouselConfig('specialConditions'),
      items: tenantData.usedListingsFilterData.specialConditions
        ?.slice(0, 7) // Take only 7 items
        ?.map((data) => ({
          ...data,
          spriteClass: `${parentClasses.specialCondition} ${data?.slug}`,
        })),
    });
  }

  if (dataMap.ccRanges?.items?.length > 0) {
    carTabs.push({
      ...dataMap.ccRanges,
      ...getCarouselConfig('ccRanges'),
      type: 'badge',
      items: dataMap.ccRanges.items?.map((data) => ({
        ...data,
        label: data.id,
        link: `/car/cc/${data.id}`,
        icon: <RangeIcon className="text-gray-400" />,
        doc_count: formatNumberValue(data?.count || 0),
      })),
    });
  }

  extraTabs.forEach((tab) => {
    carTabs.push({
      type: 'plainCard',
      ...getCarouselConfig('specialConditions'),
      ...tab,
    });
  });

  // Render function for items in the MultilineCarousel
  const renderItem = (item, index, type, tabValue) => {
    if (type === 'badge') {
      return (
        <ChipWithIcon
          href={item?.link ? item?.link : `/car/${item?.label}`}
          hrefTitle={item?.hrefTitle}
          key={index}
          optionClickGaEvent="popular_search_option_click"
          tabLabel={tabValue}
          optionText={getLocaleString(item, 'label', locale)}
          pageType={pageType}
          pageSection="popular_searches_widget"
          label={
            <>
              {item?.labelText
                ? item?.labelText
                : getLocaleString(item, 'label', locale)}
              {item?.doc_count ? (
                <span className="text-xs text-dim"> ({item?.doc_count})</span>
              ) : (
                ''
              )}
            </>
          }
          className="justify-center capitalize px-2 flex items-center text-center h-[54px] lg:h-[70px]"
        />
      );
    }

    return (
      <NextLink
        title={item?.hrefTitle}
        href={item?.link ? item?.link : `/car/${item?.label}`}
        key={index}
      >
        <OptionCard
          key={index}
          tabLabel={tabValue}
          optionText={getLocaleString(item, 'label', locale, t)}
          pageType={pageType}
          pageSection="popular_searches_widget"
          optionClickGaEvent="popular_search_option_click"
          interactedFrom={type === 'plainCard' && pageType}
          cardClassName={
            type === 'plainCard' &&
            'min-h-[72px] lg:min-h-[92px] items-center justify-center'
          }
          width={100}
          height={100}
          customImage={item?.customImage}
          image={
            item?.src ? item?.src : getAsset('/assets/car-placeholder.svg')
          }
          src={item?.src}
          imageClassName={'w-auto h-[50px] flex-shrink-0'}
          label={
            item?.labelText
              ? item?.labelText
              : getLocaleString(item, 'label', locale, t)
          }
          subLabel={!hideCounts && (item?.doc_count || item.count)}
          spriteClassName={item?.spriteClass}
          contentClassName="flex gap-1"
          labelClassName="text-sm truncate max-w-[100px] md:max-w-[140px]"
          subLabelClassName="text-xs"
        />
      </NextLink>
    );
  };

  return (
    <Tabs
      className={cn('gap-4 min-h-70 lg:min-h-82', tabsClassName)}
      locale={locale}
      tabClickGaEvent="popular_search_tab_click"
      page_type={pageType}
      items={carTabs?.map(
        ({
          label,
          value,
          items,
          hasCount,
          itemBasis,
          type,
          rows,
          threshold,
          gridClassName,
        }) => ({
          label: t(label),
          value,
          content: (
            <MultilineCarousel
              items={items}
              rows={rows}
              threshold={threshold}
              itemBasis={itemBasis}
              showDots
              showArrows={false}
              locale={locale}
              // showArrows={!isMobile}
              renderItem={(_item, i) => renderItem(_item, i, type, value)}
              gridClassName={gridClassName}
            />
          ),
        }),
      )}
    />
  );
};

export default MakeModelTabs;
