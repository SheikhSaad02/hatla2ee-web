import { ListingsService } from '@/services/elasticsearch/listings-service';
import { formatNumberValue, formatNumberWithPrice } from '@/utils/numbers';
import { getLocale, getTranslations } from 'next-intl/server';
import { parentClasses } from '@/data/listings/used-cars/spriteMapping';
import { FILTER_CONFIG } from '@/utils/used-cars/listings/prettyParser';
import {
  extractPriceRange,
  getParentCityInfo,
} from '@/utils/used-cars/listings';
import {
  appPaths,
  appSections,
  IMAGES_BASE_URL,
  newVehiclesCategorySlugs,
} from '@/constants';
import configs, { isSectionEnabled } from '@/configs';
import {
  createLocaleStringGetter,
  getAsset,
  getLocaleString,
} from '@/utils/general';
import { MakesService } from './makes-service';
import { ModelsService } from './models-service';
import tenantFilterData from '@data';
import { FiltersService } from './filter-service';
import { FILTERS_AGG_CONFIG } from '@/filters/filterConfig';
import { getYearRange } from '@/utils/date';
import { usedCarListingUrlBuilder } from '../urlBuilder/usedCarListingUrl';
export class QuickFiltersService {
  constructor({
    locale,
    isMobile,
    data = {},
    urlArray,
    filter,
    categorySlug,
    isSearch,
    isLanding,
  }) {
    this.locale = locale;
    this.country = configs.country[locale].label;
    this.currency = configs.currency[locale].label;
    this.isMobile = isMobile;
    this.data = data;
    this.currentYear = new Date().getFullYear();
    this.prevYear = this.currentYear - 1;
    ((this.filter = filter), (this.urlArray = urlArray));
    this.extractString = createLocaleStringGetter(this.locale);
    this.categorySlug = categorySlug;
    this.isSearch = isSearch;
    this.isLanding = isLanding;
    this.buildUrl = usedCarListingUrlBuilder.buildUrl;
  }

  loadTranslations() {
    return getTranslations({
      locale: this.locale,
      namespace: 'usedCarsListings',
    });
  }

  loadNewCarTranslations() {
    return getTranslations({
      locale: this.locale,
      namespace: 'newCar',
    });
  }

  shouldHideWidget() {
    const currentState = this.data;
    return (
      currentState.variant ||
      currentState.price ||
      !!currentState.specialConditions?.length ||
      currentState.cc ||
      (currentState.body && currentState.city) ||
      currentState.transmission
    );
  }

  getCurrentState() {
    const data = this.data;
    return {
      make: data?.make,
      model: data?.model,
      year: data?.year,
      variant: data?.variant,
      body: data?.body,
      fuel: data?.fuel,
      transmission: data?.transmission,
      price: data?.price,
      specialConditions: data?.specialConditions,
      cc: data?.cc,
      city: data?.city,
    };
  }

  getCarouselConfig = (key) => {
    const isMobile = this.isMobile;
    switch (key) {
      case 'make':
        return {
          rows: 2,
          threshold: isMobile ? 6 : 12,
          itemBasis: `basis-[30%] md:basis-[25%] ${
            'lg:basis-[16.67%]'
          } `,
          gridClassName: 'grid-cols-6',
        };

      case 'city':
        return {
          rows: 2,
          threshold: isMobile ? 6 : 14,
          itemBasis:
            'basis-[38.33%] md:basis-[20%] lg:basis-[16.66%] xl:basis-[16.66%]',
          gridClassName: 'grid-cols-6',
        };

      case 'subplace':
        return {
          rows: isMobile ? 3 : 4,
          threshold: isMobile ? 3 : 16,
          type: 'badge',
          itemBasis: 'basis-[60%] md:basis-[30%] lg:basis-[26%]',
          gridClassName: isMobile ? 'grid-cols-1' : 'grid-cols-4',
        };
      // Updated UI: Blue outline chips for mobile and gray chips for desktop (both without any images)
      case 'quickFilterChips': {
        if (!isMobile || this.isLanding) {
          return this.getCarouselConfig('model');
        }
        return {
          rows: 1,
          threshold: 3,
          type: 'badge',
          itemBasis: 'basis-auto',
          gridClassName:
            'grid-flow-col auto-cols-max auto-rows-min gap-2 overflow-x-auto pb-1 -mx-1 px-1',
          className:
            'rounded-full border border-primary-200 bg-primary-50 px-4 py-2 text-xs font-medium text-primary',
          labelClassName: 'flex items-center gap-1 justify-center',
        };
      }

      case 'variant':
        return {
          rows: isMobile ? 3 : 4,
          threshold: isMobile ? 3 : 16,
          type: 'badge',
          itemBasis: 'basis-[60%] md:basis-[30%] lg:basis-[26%]',
          gridClassName: isMobile ? 'grid-cols-1' : 'grid-cols-4',
          className: 'whitespace-normal text-center',
        };

      case 'model':
      return {
        rows: isMobile ? 4 : 2,
        threshold: 8,
        type: 'badge',
        itemBasis: 'basis-[48.33%] md:basis-[22%] lg:basis-[19.18%]',
        gridClassName: isMobile ? 'grid-cols-3' : 'grid-cols-6',
        labelClassName:
          'flex items-center gap-1 justify-center text-xs md:text-sm',
        className: 'lg:h-[70px]',
      };

      case 'year':
        return {
          rows: 4,
          threshold: isMobile ? 8 : 20,
          type: 'badge',
          itemBasis: 'basis-[48.33%] md:basis-[22%] lg:basis-[18.76%]',
          gridClassName: isMobile ? 'grid-cols-3' : 'grid-cols-5',
          labelClassName:
            'flex items-center gap-1 justify-center text-xs md:text-sm',
        };

      case 'body':
        return {
          rows: 2,
          threshold: !isMobile ? 8 : 6,
          itemBasis: 'basis-[33.33%] md:basis-[25%] lg:basis-[25%]',
          gridClassName: isMobile ? 'grid-cols-3' : 'grid-cols-4',
        };

      case 'prices':
        return {
          rows: 2,
          threshold: isMobile ? 2 : 12,
          itemBasis: `basis-[32%] md:basis-[35%] ' ${!this.isLanding ? 'lg:basis-[16.66%]' : 'lg:basis-[16.67%]'}`,
          gridClassName: !this.isLanding ? 'grid-cols-6' : 'grid-cols-6',
          type: 'badge',
          className: 'h-[54px] lg:h-[70px]',
        };


      case 'special-conditions':
        return {
          rows: 2,
          threshold: isMobile ? 6 : 8,
          itemBasis: 'basis-[25%] md:basis-[20%] lg:basis-[12.5%]',
          gridClassName: 'grid-cols-3'
        };

      case 'cc':
        return {
          rows: 2,
          threshold: 10,
          gridClassName: isMobile ? 'grid-cols-3' : 'grid-cols-7',
          itemBasis: 'basis-[40%] sm:basis-[34%] md:basis-[25%] lg:basis-[14.28%]',
          type: 'badge',
          className: 'h-[54px] lg:h-[70px]',
        };

      case 'info':
        return {
          rows: isMobile ? 2 : 1,
          threshold: 3,
          type: 'badge',
          gridClassName: isMobile ? 'grid-cols-1' : 'grid-cols-3',
        };

      default:
        break;
    }
  };

  getSpecialConditionHrefTitle(slug, t) {
    const titles = {
      'kasr-zero': () => t('Low KM cars for sale'),
      taxi: () => t('Taxi for sale'),
      financed: () => t('Financed used cars'),
      classic: () =>
        t('Classic cars for sale in {country}', { country: this.country }),
      disabled: () =>
        t('Buy Disabled cars in {country}', { country: this.country }),
      imported: () =>
        t('Buy imported cars in {country}', { country: this.country }),
      electric: () => t('Used Electric cars'),
    };

    return titles[slug] ? titles[slug]() : '';
  }

  async getInitialTabs() {
    const [makes, bodyTypes = [], ccRanges, topModels, fuelTypes] =
      await Promise.all([
        MakesService.getTopMakes(!this.isLanding ? 12 : 16),
        ListingsService.getBodyTypes(),
        ListingsService.getCCRanges(),
        ModelsService.getTopModels(),
        ListingsService.getFuelTypes(),
      ]);

    const t = await this.loadTranslations();
    const { usedListingsFilterData } = tenantFilterData;

    const getPriceLabels = (price, displayAr = null) => {
      if (!this.isMobile){
       return {
        label: (
          <>
            {displayAr || price}
          </>
        ),
      };
      }
      return {
        label: (
          <>
            <span className="text-xs text-gray-light block text-center">
              {t('Under')}
            </span>
            {displayAr || price}
          </>
        ),
      };
    };

    return [
      {
        ...makes,
        label: 'Brands',
        value: 'make',
        ...this.getCarouselConfig('make'),
        items:
          makes?.items.map((item) => ({
            ...item,
            link: `/car/${item?.slug}`,
            src: `${IMAGES_BASE_URL}/${item?.slug}/thumbnail.png`,
            hrefTitle: t('Used {make} For Sale', {
              make: this.extractString(item),
            }),
          })) || [],
      },
      ...(topModels?.items?.length
        ? [
            {
              label: 'Models',
              value: 'models',
              ...this.getCarouselConfig(
                this.isMobile ? 'quickFilterChips' : 'model',
              ),
              items: topModels.items.map((item) => ({
                ...item,
                link: this.buildUrl({
                  make: { slug: item.makeSlug },
                  model: { slug: item.modelSlug },
                }),
                count: formatNumberValue(item.doc_count),
                hrefTitle: this.buildCarHrefTitle(
                  {
                    label: item.label,
                    label_l1: item.label_l1,
                    slug: item.modelSlug,
                  },
                  t,
                ),
              })),
            },
          ]
        : []),
      {
        label: 'Price Ranges',
        value: 'price-range',
        ...this.getCarouselConfig('prices'),
        items: usedListingsFilterData.priceRanges.map((price) => ({
          ...price,
          ...getPriceLabels(
            formatNumberWithPrice(price.label, this.locale, true, (e) => e),
          ),
          link: `/car/price-limit/${price.slug}`,
          hrefTitle: (() => {
            const { min, max } = extractPriceRange(price.slug);
            return t(
              'Used Cars under {max} {currency} in {country} ({min} - {max})',
              {
                max: formatNumberValue(max),
                min: formatNumberValue(min),
                country: this.country,
                currency: this.currency,
              },
            );
          })(),
        })),
      },
      {
        label: 'Body Styles',
        value: 'body',
        ...this.getCarouselConfig('body'),
        items:
          bodyTypes?.map((item) => ({
            ...item,
            hrefTitle: t('{body} car for sale in {country}', {
              body: this.extractString(item),
              country: this.country,
            }),
            link: `/car/body/${item?.slug}`,
            spriteClass: `${parentClasses.body} body-${item.slug}`,
          })) || [],
      },
      {
        label: 'Special Conditions',
        value: 'special-conditions',
        ...this.getCarouselConfig('special-conditions'),
        items: usedListingsFilterData.specialConditions.map((item) => ({
          ...item,
          spriteClass: `${parentClasses.specialCondition} ${item.slug}`,
          slug:
            Object.entries(
              FILTER_CONFIG.SPECIAL_CONDITIONS_KEYS_MAPPING_QUERY_PARAMS,
            ).find(([, v]) => v === item.slug)?.[0] || item.slug,
          hrefTitle: this.getSpecialConditionHrefTitle(item.slug, t),
        })),
      },
      {
        label: 'CC Ranges',
        value: 'cc',
        ...this.getCarouselConfig('cc'),
        items: ccRanges?.items?.map((data) => ({
          ...data,
          link: `/car/cc/${data?.id}`,
          icon: getAsset('/assets/CC.svg'),
        })),
      },
      ...(fuelTypes?.length
        ? [
            {
              label: 'Fuel Type',
              value: 'fuel',
              ...this.getCarouselConfig(
                this.isMobile ? 'quickFilterChips' : 'special-conditions',
              ),
              items: fuelTypes.map(({ count, ...item }) => ({
                ...item,
                spriteClass: `${parentClasses.fuel} fuel-${item.slug}`,
                link: this.buildUrl({
                  fuel: {
                    slug: item.slug,
                    label: item.label,
                    label_l1: item.label_l1,
                  },
                }),
                ...(!(this.isMobile && this.isLanding) && {
                  count: formatNumberValue(count),
                }),
                hrefTitle: t('fuel_cars_for_sale', {
                  fuel: this.extractString(item),
                  country: this.country,
                }),
              })),
            },
          ]
        : []),
      ...(usedListingsFilterData.transmission?.length
        ? [
            {
              label: 'Transmission',
              value: 'transmission',
              ...this.getCarouselConfig('quickFilterChips'),
              items: usedListingsFilterData.transmission.map((item) => ({
                ...item,
                link: this.buildUrl({
                  transmission: {
                    slug: item.slug,
                    label: item.label,
                    label_l1: item.label_l1,
                  },
                }),
                hrefTitle: t('transmission_cars_for_sale', {
                  transmission: this.extractString(item),
                  location: this.country,
                }),
              })),
            },
          ]
        : []),
    ];
  }

  async getSubplacesTab() {
    const currentState = this.getCurrentState();

    if (currentState.city?.level > 2) {
      return null;
    }

    const response = await ListingsService.getSubCitiesWithListings(
      currentState.city?.id,
      {
        makeSlug: currentState?.make?.slug,
        modelSlug: currentState?.model?.slug,
      },
    );

    return {
      label: 'Sub Places',
      value: 'subplace',
      ...this.getCarouselConfig('subplace'),
      items:
        response?.map((item) => ({
          ...item,
          link: this.buildUrl({
            city: { slug: item.slug },
            ...(currentState.make?.slug && { make: currentState.make }),
            ...(currentState.model?.slug && { model: currentState.model }),
          }),
        })) || [],
    };
  }

  async getContextualLinks() {
    const currentState = this.getCurrentState();
    const links = [];
    const t = await this.loadTranslations();

    if (currentState.specialConditions?.length) {
      const importedObj = currentState.specialConditions.find(
        (item) => item.slug === 'imported',
      );

      if (importedObj) {
        return [
          {
            key: 'imported-cars',
            label: t(`Sell your imported car now!`),
            link: appPaths.postListing,
          },
          {
            key: 'imported-used-cars',
            label: t(`Imported used cars`),
            link: `/car${appPaths.importedCars}`,
          },
          {
            key: 'imported-new-cars',
            label: t(`Imported new cars`),
            link: appPaths.newImportedCars,
          },
        ];
      }
    }

    if (isSectionEnabled(appSections.USED_CARS_PRICES)) {
      links.push({
        key: 'used-car-prices',
        label: t('Used Car Prices'),
        link: '/car/used-prices',
        type: 'always',
      });
    }

    if (isSectionEnabled(appSections.NEW_CARS_PRICES)) {
      links.push({
        key: 'new-car-prices',
        label: t('new_car_prices', {
          yearRange: getYearRange(),
        }),
        link: '/car/all-prices',
        type: 'always',
      });
    }

    // Early return if no city selected
    if (!currentState.city) return links;

    // Helper function to create sell car link
    const createSellCarLink = (suffix = '') => {
      return {
        key: `sell-car${suffix}`,
        label: t('sell_your_used_car', {
          city: getLocaleString(currentState?.city, 'label', this.locale),
        }),
        link: '/sell-your-car',
        type: 'contextual',
      };
    };

    // Helper function to create parent city link
    const createParentCityLink = async (
      parentCity,
      makeSlug = '',
      modelSlug = '',
    ) => {
      const pathParts = [parentCity.slug, makeSlug, modelSlug].filter(Boolean);

      const _count = await ListingsService.getUsedCarsCountByLocationMakeModel(
        parentCity.slug,
        makeSlug || undefined,
        modelSlug || undefined,
      );
      const count = formatNumberValue(_count);

      let label;
      const makeName = getLocaleString(
        currentState?.make,
        'label',
        this.locale,
      );
      const modelName = getLocaleString(
        currentState?.model,
        'label',
        this.locale,
      );

      const cityLabel = getLocaleString(parentCity, 'label', this.locale);

      if (makeSlug && modelSlug) {
        label = t('Used {makeName} {modelName} for sale in {label} ({count})', {
          makeName,
          modelName,
          label: cityLabel,
          count,
        });
      } else if (makeSlug) {
        label = t('Used {makeName} for sale in {label} ({count})', {
          makeName,
          label: cityLabel,
          count,
        });
      } else {
        label = t('Used for sale in {label} ({count})', {
          label: cityLabel,
          count,
        });
      }

      return {
        key: `used-${makeSlug ? 'make-' : ''}${
          modelSlug ? 'model-' : ''
        }parent-city`,
        label,
        link: `/car/city/${pathParts.join('/')}`,
        type: 'contextual',
      };
    };

    const isSubplace = currentState.city.level > 2;
    const { city, make, model } = currentState;

    const sellCarSuffix = isSubplace
      ? `-subplace${make ? '-make' : ''}${model ? '-model' : ''}`
      : `${make ? '-city-make' : '-city'}${model ? '-model' : ''}`;

    links.push(createSellCarLink(sellCarSuffix));

    // Add parent city links only for subplaces
    if (isSubplace) {
      const parentCity = await getParentCityInfo(city);
      if (parentCity) {
        const makeSlug = make?.slug || '';
        const modelSlug = model?.slug || '';
        links.push(await createParentCityLink(parentCity, makeSlug, modelSlug));
      }
    }

    return links;
  }

  async getNewCarContextualLinks() {
    const make = this.data?.make;
    const t = await this.loadNewCarTranslations();
    const categorySlug = this.categorySlug;
    const isSearch = this.isSearch;
    const links = [];
    const category_Slug = t(categorySlug);

    links.push({
      key: 'new-car-prices',
      label: t('New {Car} Prices', {
        car: category_Slug,
        yearRange: getYearRange(),
      }),
      link: `/${categorySlug}/all-prices`,
      type: 'always',
    });

    if (!make || !make.label || !make.slug) {
      return links;
    }

    if (!isSearch && categorySlug === newVehiclesCategorySlugs.newCars) {
      links.push({
        key: `used-${make.slug}-for-sale`,
        label: t('Used {make} For Sale', {
          make: make.label,
        }),
        link: `/car/${make.slug}`,
        type: 'contextual',
      });
    }

    return links;
  }

  buildCarHrefTitle(item = null, t, { exclude = [] } = {}) {
    const parts = [];
    const currentState = this.getCurrentState();

    if (currentState.make && !exclude.includes('make')) {
      parts.push(this.extractString(currentState.make));
    }

    if (currentState.model && !exclude.includes('model')) {
      parts.push(this.extractString(currentState.model));
    }

    if (currentState.year && !exclude.includes('year')) {
      parts.push(this.extractString(currentState.year));
    }

    if (currentState.variant && !exclude.includes('variant')) {
      parts.push(this.extractString(currentState.variant));
    }

    if (item) {
      parts.push(this.extractString(item));
    }

    const makeString = parts.filter(Boolean).join(' ');
    return t('Used {make} For Sale', { make: makeString });
  }

  async getDynamicTabs() {
    const currentState = this.getCurrentState();
    const urlArray = this.urlArray.map((item) => decodeURIComponent(item));
    const filter = this.filter;

    const t = await this.loadTranslations();

    const tabs = [];

    if (currentState.fuel && !currentState.make) {
      const { fuelType: allFuels = [] } =
        await FiltersService.getFiltersWithCounts({}, ['fuelType'], {
          fuelType: FILTERS_AGG_CONFIG.fuelType,
        });
      const currentFuelSlug = currentState.fuel?.slug;
      const otherFuels = allFuels.filter(
        (item) => item.slug && item.slug !== currentFuelSlug,
      );
      if (otherFuels.length) {
        tabs.push({
          label: 'Other Fuel Type',
          value: 'other-fuel-types',
          tabTitle: {
            mobile: t('qf_fuels_site', {
              fuel: this.extractString(currentState.fuel),
            }),
          },
          ...(this.isMobile
            ? this.getCarouselConfig('quickFilterChips')
            : this.getCarouselConfig('subplace')),
          items: otherFuels.map((item) => ({
            ...item,
            link: this.buildUrl({ fuel: { slug: item.slug } }),
            hrefTitle: t('fuel_cars_for_sale', {
              fuel: this.extractString(item),
              country: this.country,
            }),
          })),
        });
      }
      return tabs;
    }

    // CITY-BASED FLOWS
    if (currentState.city) {
      // City -> Make (show makes + areas if city level <= 2)
      if (!currentState.make) {
        const baseFilterObj = { city: { slug: currentState.city.slug } };
        const [{ make: makes }, cityModels, subplacesTab] = await Promise.all([
          FiltersService.getFiltersWithCounts(
            { location: { ...currentState.city } },
            ['make'],
            {
              location: FILTERS_AGG_CONFIG.location,
              make: { ...FILTERS_AGG_CONFIG.make },
            },
          ),
          ListingsService.getTopModelsInCity(currentState.city),
          this.getSubplacesTab(),
        ]);

        tabs.push({
          label: 'Brands',
          value: 'make',
          ...this.getCarouselConfig('make'),
          items:
            makes?.map((item) => ({
              ...item,
              link: this.buildUrl({
                ...baseFilterObj,
                make: { slug: item.slug },
              }),
              src: `${IMAGES_BASE_URL}/${item?.slug}/thumbnail.png`,
              hrefTitle: t('Used {make} For Sale in {location}', {
                make: this.extractString(item),
                location: this.extractString(currentState.city),
              }),
            })) || [],
        });

        if (cityModels?.length) {
          tabs.push({
            label: 'Models',
            value: 'city-models',
            ...this.getCarouselConfig('quickFilterChips'),
            items: cityModels.map((item) => ({
              ...item,
              link: this.buildUrl({
                ...baseFilterObj,
                make: { slug: item.makeSlug },
                model: { slug: item.slug },
              }),
              hrefTitle: t('Used {make} For Sale in {location}', {
                make: this.extractString({
                  label: item.label,
                  label_l1: item.label_l1,
                }),
                location: this.extractString(currentState.city),
              }),
            })),
          });
        }

        if (subplacesTab?.items?.length) {
          tabs.push(subplacesTab);
        }
      }
      // City + Make -> Model (show models + areas if city level <= 2)
      else if (!currentState.model) {
        const { model: response } = await FiltersService.getFiltersWithCounts(
          {
            location: { ...currentState.city },
            make: { ...currentState.make },
          },
          ['model'],
          {
            location: FILTERS_AGG_CONFIG.location,
            make: FILTERS_AGG_CONFIG.make,
            model: FILTERS_AGG_CONFIG.model,
          },
        );
        tabs.push({
          label: 'Model',
          value: 'model',
          ...this.getCarouselConfig('model'),
          items:
            response?.map((item) => ({
              ...item,
              link: this.buildUrl({
                city: { slug: currentState.city.slug },
                make: { slug: currentState.make.slug },
                model: { slug: item.slug },
              }),
              hrefTitle: t('Used {make} For Sale in {location}', {
                make: `${this.extractString(
                  currentState.make,
                )} ${this.extractString(item)}`,
                location: this.extractString(currentState.city),
              }),
            })) || [],
        });

        // Add areas tab if city level <= 2
        const subplacesTab = await this.getSubplacesTab();
        if (subplacesTab?.items?.length) {
          tabs.push(subplacesTab);
        }
      }
      // City + Make + Model -> Sub places + Other models (/car/city/:city/:make/:model)
      else if (!currentState.year) {
        const baseFilterObj = {
          city: { slug: currentState.city.slug },
          make: { slug: currentState.make.slug },
          model: { slug: currentState.model.slug },
        };
        const [subplacesTab, { model: modelsForCityMake = [] }] =
          await Promise.all([
            this.getSubplacesTab(),
            FiltersService.getFiltersWithCounts(
              {
                location: { ...currentState.city },
                make: { ...currentState.make },
              },
              ['model'],
              {
                location: FILTERS_AGG_CONFIG.location,
                make: FILTERS_AGG_CONFIG.make,
                model: {
                  ...FILTERS_AGG_CONFIG.model,
                  size: 13,
                },
              },
            ),
          ]);

        const currentModelSlug = currentState.model?.slug;
        const otherModels = modelsForCityMake
          .filter(
            (item) =>
              !currentModelSlug ||
              String(item.slug ?? '') !== String(currentModelSlug),
          )
          .slice(0, 12);

        if (subplacesTab?.items?.length) {
          tabs.push(subplacesTab);
        }

        if (otherModels.length) {
          tabs.push({
            label: 'Other Models',
            value: 'other-models',
            tabTitle: {
              mobile: t('qf_models_other', {
                make: this.extractString(currentState.make),
              }),
            },
            ...this.getCarouselConfig('quickFilterChips'),
            items:
              otherModels.map((item) => ({
                ...item,
                link: this.buildUrl({
                  ...baseFilterObj,
                  model: { slug: item.slug },
                }),
                hrefTitle: t('Used {make} For Sale in {location}', {
                  make: `${this.extractString(
                    currentState.make,
                  )} ${this.extractString(item)}`,
                  location: this.extractString(currentState.city),
                }),
              })) || [],
          });
        }
      }
    }

    // ORIGINAL FLOWS (when no city is selected)
    else {
      if (currentState.make && currentState.body) {
        const makeLabel = this.extractString(currentState.make);
        const makeSlug = { slug: currentState.make.slug };
        const { bodyType: bodies = [] } =
          await FiltersService.getFiltersWithCounts(
            { make: { ...currentState.make } },
            ['bodyType'],
            { bodyType: FILTERS_AGG_CONFIG.bodyType },
          );
        const otherBodies = bodies.filter(
          (item) => item.slug !== currentState.body?.slug,
        );
        if (otherBodies.length) {
          tabs.push({
            label: 'Other Body Type',
            value: 'other-body-types',
            tabTitle: {
              mobile: t('qf_bodies_make', {
                make: makeLabel,
              }),
            },
            ...this.getCarouselConfig('body'),
            items: otherBodies.map((item) => ({
              ...item,
              link: this.buildUrl({
                make: makeSlug,
                body: { slug: item.slug },
              }),
              hrefTitle: t('make_body_cars_for_sale_loc', {
                make: makeLabel,
                body: this.extractString(item),
                location: this.country,
              }),
              spriteClass: `${parentClasses.body} body-${item.slug}`,
            })),
          });
        }
        return tabs;
      }

      if (currentState.make && currentState.fuel) {
        const makeLabel = this.extractString(currentState.make);
        const makeSlug = { slug: currentState.make.slug };
        const { fuelType: fuelsForMake = [] } =
          await FiltersService.getFiltersWithCounts(
            { make: { ...currentState.make } },
            ['fuelType'],
            { fuelType: FILTERS_AGG_CONFIG.fuelType },
          );
        const otherFuels = fuelsForMake.filter(
          (item) => item.slug !== currentState.fuel?.slug,
        );
        if (otherFuels.length) {
          tabs.push({
            label: 'Other Fuel Type',
            value: 'other-fuel-types-make',
            tabTitle: {
              mobile: t('qf_fuels_make', {
                make: makeLabel,
              }),
            },
            ...this.getCarouselConfig('quickFilterChips'),
            items: otherFuels.map((item) => ({
              ...item,
              link: this.buildUrl({
                make: makeSlug,
                fuel: { slug: item.slug },
              }),
              hrefTitle: t('make_fuel_cars_for_sale_loc', {
                make: makeLabel,
                fuel: this.extractString(item),
                location: this.country,
              }),
            })),
          });
        }
        return tabs;
      }

      if (currentState.make && currentState.year) {
        const makeLabel = this.extractString(currentState.make);
        const makeSlug = { slug: currentState.make.slug };
        const currentYearVal = String(
          currentState.year?.min ?? currentState.year?.max ?? '',
        );
        const { year: yearsForMake = [] } =
          await FiltersService.getFiltersWithCounts(
            { make: { ...currentState.make } },
            ['year'],
            { year: FILTERS_AGG_CONFIG.year },
          );
        const otherYears = yearsForMake
          .filter(
            (item) => String(item.slug ?? item.key ?? '') !== currentYearVal,
          )
          .slice(0, 12);
        if (otherYears.length) {
          tabs.push({
            label: 'Other Years',
            value: 'make-year-other-years',
            tabTitle: {
              mobile: t('qf_years_make', {
                make: makeLabel,
              }),
            },
            ...this.getCarouselConfig('year'),
            items: otherYears.map((item) => ({
              ...item,
              label: item.key,
              link: this.buildUrl({
                make: makeSlug,
                year: { min: item.slug, max: item.slug },
              }),
              hrefTitle: t('make_year_cars_for_sale_loc', {
                make: makeLabel,
                year: String(item.key ?? item.slug ?? ''),
                location: this.country,
              }),
            })),
          });
        }
        return tabs;
      }

      // Make -> Model + Cities + Year + Body + Fuel + Transmission (/car/:make)
      if (currentState.make && !currentState.model) {
        const makeSlug = { slug: currentState.make.slug };
        const makeLabel = this.extractString(currentState.make);

        const [
          response,
          {
            location: citiesForMake = [],
            year: yearsForMake = [],
            bodyType: bodiesForMake = [],
            fuelType: fuelsForMake = [],
            transmission: transmissionsForMake = [],
          },
        ] = await Promise.all([
          ListingsService.getModelData(currentState.make?.slug),
          FiltersService.getFiltersWithCounts(
            { make: { ...currentState.make } },
            ['location', 'year', 'bodyType', 'fuelType', 'transmission'],
            {
              location: FILTERS_AGG_CONFIG.location,
              year: FILTERS_AGG_CONFIG.year,
              bodyType: FILTERS_AGG_CONFIG.bodyType,
              fuelType: FILTERS_AGG_CONFIG.fuelType,
              transmission: FILTERS_AGG_CONFIG.transmission,
            },
          ),
        ]);

        tabs.push({
          label: 'Model',
          value: 'model',
          tabTitle: {
            mobile: t('qf_make_models'),
          },
          ...this.getCarouselConfig('model'),
          items:
            response?.map((item) => ({
              ...item,
              link: this.buildUrl({
                make: { slug: currentState.make.slug },
                model: { slug: item.slug },
              }),
              hrefTitle: this.buildCarHrefTitle(item, t),
            })) || [],
        });

        const topCities = citiesForMake.slice(0, 12);
        if (topCities.length) {
          tabs.push({
            label: 'Cities',
            value: 'city',
            tabTitle: {
              mobile: t('qf_make_cities'),
            },
            ...(this.isMobile
              ? this.getCarouselConfig('quickFilterChips')
              : this.getCarouselConfig('subplace')),
            items:
              topCities?.map((item) => ({
                ...item,
                link: this.buildUrl({
                  make: { slug: currentState.make.slug },
                  city: { slug: item.slug },
                }),
                hrefTitle: t('make_cars_for_sale_in_loc', {
                  make: this.extractString(currentState.make),
                  location: this.extractString(item),
                }),
              })) || [],
          });
        }

        const topYears = (yearsForMake || []).slice(0, 12);
        if (topYears.length) {
          tabs.push({
            label: 'Year',
            value: 'year',
            tabTitle: {
              mobile: t('qf_make_year', {
                make: makeLabel,
              }),
            },
            ...this.getCarouselConfig('year'),
            items:
              topYears.map((item) => ({
                ...item,
                label: item.key,
                hrefTitle: t('make_year_cars_for_sale_loc', {
                  make: this.extractString(currentState.make),
                  year: String(item.key ?? item.slug ?? ''),
                  location: this.country,
                }),
                link: this.buildUrl({
                  make: makeSlug,
                  year: { min: item.slug, max: item.slug },
                }),
              })) || [],
          });
        }

        const topBodies = bodiesForMake || [];
        if (topBodies.length) {
          tabs.push({
            label: 'Body Type',
            value: 'body',
            tabTitle: {
              mobile: t('qf_make_body', {
                make: makeLabel,
              }),
            },
            ...this.getCarouselConfig('body'),
            items: topBodies.map((item) => ({
              ...item,
              link: this.buildUrl({
                make: makeSlug,
                body: { slug: item.slug },
              }),
              hrefTitle: t('make_body_cars_for_sale_loc', {
                make: this.extractString(currentState.make),
                body: this.extractString(item),
                location: this.country,
              }),
              spriteClass: `${parentClasses.body} body-${item.slug}`,
            })),
          });
        }

        const topFuels = fuelsForMake || [];
        if (topFuels.length) {
          tabs.push({
            label: 'Fuel Type',
            value: 'fuel',
            tabTitle: {
              mobile: t('qf_make_fuel', {
                make: makeLabel,
              }),
            },
            ...(this.isMobile
              ? this.getCarouselConfig('quickFilterChips')
              : this.getCarouselConfig('special-conditions')),
            items: topFuels.map((item) => ({
              ...item,
              spriteClass: `${parentClasses.fuel} fuel-${item.slug}`,
              link: this.buildUrl({
                make: makeSlug,
                fuel: { slug: item.slug },
              }),
              hrefTitle: t('make_fuel_cars_for_sale_loc', {
                make: this.extractString(currentState.make),
                fuel: this.extractString(item),
                location: this.country,
              }),
            })),
          });
        }
        const transmissionQuickItems = (transmissionsForMake || []).filter(
          (item) => FILTER_CONFIG.TRANSMISSION_TAGS.has(item.slug),
        );

        if (transmissionQuickItems.length) {
          tabs.push({
            label: 'Transmission',
            value: 'transmission',
            tabTitle: {
              mobile: t('qf_make_trans', {
                make: makeLabel,
              }),
            },
            ... this.getCarouselConfig('quickFilterChips'),
            items: transmissionQuickItems.map((item) => ({
              ...item,
              link: this.buildUrl({
                make: makeSlug,
                transmission: {
                  slug: item.slug,
                },
              }),
              hrefTitle: t('make_transmission_cars_for_sale_loc', {
                make: this.extractString(currentState.make),
                transmission: this.extractString(item),
                location: this.country,
              }),
            })),
          });
        }
      }

      // Make + Model -> Year + Cities + Other models (/car/:make/:model)
      if (currentState.make && currentState.model && !currentState.year) {
        const baseFilterObj = {
          make: { slug: currentState.make.slug },
          model: { slug: currentState.model.slug },
        };

        const [
          yearsResponse,
          { location: citiesForMakeModel = [] },
          modelsForMake,
        ] = await Promise.all([
          ListingsService.getYearsForMakeModel(
            currentState.make.slug,
            currentState.model.slug,
          ),
          FiltersService.getFiltersWithCounts(
            {
              make: { ...currentState.make },
              model: { ...currentState.model },
            },
            ['location'],
            { location: FILTERS_AGG_CONFIG.location },
          ),
          ListingsService.getModelData(currentState.make.slug, {
            limit: 13,
          }),
        ]);

        if (yearsResponse?.length) {
          tabs.push({
            label: 'Year',
            value: 'year',
            ...this.getCarouselConfig('year'),
            items:
              yearsResponse.map((item) => ({
                ...item,
                label: item.key,
                hrefTitle: this.buildCarHrefTitle(item, t),
                link: this.buildUrl({
                  ...baseFilterObj,
                  year: { min: item.slug, max: item.slug },
                }),
              })) || [],
          });
        }

        const topCities = citiesForMakeModel.slice(0, 12);
        if (topCities.length) {
          tabs.push({
            label: 'Cities',
            value: 'city',
            ...(this.isMobile
              ? this.getCarouselConfig('quickFilterChips')
              : this.getCarouselConfig('subplace')),
            items:
              topCities?.map((item) => ({
                ...item,
                link: this.buildUrl({
                  ...baseFilterObj,
                  city: { slug: item.slug },
                }),
                hrefTitle: t('Used {make} For Sale in {location}', {
                  make: `${this.extractString(
                    currentState.make,
                  )} ${this.extractString(currentState.model)}`,
                  location: this.extractString(item),
                }),
              })) || [],
          });
        }

        const currentModelSlug = currentState.model?.slug;
        const otherModels = (modelsForMake || [])
          .filter(
            (item) =>
              !currentModelSlug ||
              String(item.slug ?? '') !== String(currentModelSlug),
          )
          .slice(0, 12);

        if (otherModels.length) {
          tabs.push({
            label: 'Other Models',
            value: 'other-models',
            tabTitle: {
              mobile: t('qf_models_other', {
                make: this.extractString(currentState.make),
              }),
            },
            ...this.getCarouselConfig('quickFilterChips'),
            items:
              otherModels.map((item) => ({
                ...item,
                link: this.buildUrl({
                  ...baseFilterObj,
                  model: { slug: item.slug },
                }),
                hrefTitle: this.buildCarHrefTitle(item, t, {
                  exclude: ['model'],
                }),
              })) || [],
          });
        }
      }

      // Make + Model + Year -> Variant + Other years (/car/:make/:model/year/:year)
      if (
        currentState.make &&
        currentState.model &&
        currentState.year &&
        !currentState.variant
      ) {
        const baseFilterObj = {
          make: { slug: currentState.make.slug },
          model: { slug: currentState.model.slug },
          year: { min: currentState.year.min, max: currentState.year.max },
        };

        const [variants, yearsForMakeModel] = await Promise.all([
          ListingsService.getVariantsForMakeModelYear(
            currentState.make.slug,
            currentState.model.slug,
            currentState.year,
          ),
          ListingsService.getYearsForMakeModel(
            currentState.make.slug,
            currentState.model.slug,
            { limit: 11 },
          ),
        ]);

        const currentYearVal = String(
          currentState.year?.min ?? currentState.year?.max ?? '',
        );
        const otherYears = yearsForMakeModel
          .filter(
            (item) => String(item.slug ?? item.key ?? '') !== currentYearVal,
          )
          .slice(0, 10);

        if (variants?.length) {
          tabs.push({
            label: 'Class',
            value: 'variant',
            ...this.getCarouselConfig('variant'),
            items:
              variants?.map((item) => ({
                ...item,
                hrefTitle: item.key,
                link: this.buildUrl({
                  ...baseFilterObj,
                  variant: { id: item.id },
                }),
                hrefTitle: this.buildCarHrefTitle(item, t),
              })) || [],
          });
        }

        if (otherYears.length) {
          tabs.push({
            label: 'Other Years',
            value: 'other-years',
            tabTitle: {
              mobile: t('qf_years_mm_other', {
                make: this.extractString(currentState.make),
                model: this.extractString(currentState.model),
              }),
            },
            ...this.getCarouselConfig('quickFilterChips'),
            items:
              otherYears.map((item) => ({
                ...item,
                label: item.key,
                hrefTitle: this.buildCarHrefTitle(item, t, {
                  exclude: ['year'],
                }),
                link: this.buildUrl({
                  ...baseFilterObj,
                  year: { min: item.slug, max: item.slug },
                }),
              })) || [],
          });
        }
      }

      // Body -> City
      if (currentState.body && !currentState.city) {
        const response =
          tenantFilterData.usedListingsFilterData.citiesForBodyTypes;

        tabs.push({
          label: 'City',
          value: 'city',
          ...this.getCarouselConfig('city'),
          items:
            response?.map((item) => ({
              ...item,
              link: this.buildUrl({
                body: { slug: currentState.body.slug },
                city: { slug: item.slug },
              }),
              src: configs.USE_MAKE_MODEL__TABS_IMAGES
                ? `${IMAGES_BASE_URL}/${item?.slug}/thumbnail.png`
                : getAsset(`/assets/city-placeholder.webp`),
            })) || [],
        });
      }
    }

    // Info Tab (only for make/model selections without location)
    if (
      (currentState.make || currentState.model) &&
      !currentState.variant &&
      !currentState.year &&
      !currentState.city
    ) {
      const currentYear = new Date().getFullYear();
      const makeSlug = currentState.make?.slug;
      const makeName = currentState.make?.label;
      const makeNameL1 = currentState.make?.label_l1;
      const make = getLocaleString(currentState?.make, this.locale);
      const model = getLocaleString(currentState?.model, this.locale);

      tabs.push({
        label: makeName,
        label_l1: makeNameL1,
        value: 'info',
        type: 'badge',
        rows: 1,
        threshold: 1,
        ...this.getCarouselConfig('info'),
        items: [
          {
            key: 'showroom',
            label: t('make_showrooms', { make }),
            link: `/car/info/${makeSlug}#showroom`,
            icon: getAsset('/assets/info/showroom.svg'),
          },
          ...(isSectionEnabled(appSections.MAINTENANCE_CENTER)
            ? [
                {
                  key: 'maintenance',
                  label: t('make_maintenance_centers', { make }),
                  link: `${appPaths.maintenanceCenter}/brand/${makeSlug}`,
                  icon: getAsset('/assets/info/maintenance.svg'),
                },
              ]
            : []),
          {
            key: 'prices',
            label: t('prices_label', {
              makeName: make,
              modelName: model ? ` ${model}` : '',
              yearRange: getYearRange(),
            }),
            link: `/car/price/${makeSlug}`,
            icon: getAsset('/assets/info/prices.svg'),
          },
        ],
      });
    }

    return tabs;
  }

  async getTabs() {
    const currentState = this.getCurrentState();

    const hasAnySelection = Object.values(currentState).some((value) => value);

    if (!hasAnySelection) {
      return await this.getInitialTabs();
    } else {
      return await this.getDynamicTabs();
    }
  }
}
