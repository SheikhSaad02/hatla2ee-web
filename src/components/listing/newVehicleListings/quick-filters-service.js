import { fetchNewVehiclesFiltersData } from '@/apis/new-cars-listings';
import configs from '@/configs';
import { parentClasses } from '@/data/listings/used-cars/spriteMapping';
import { getModelYears } from '@/utils/date';
import { createLocaleStringGetter } from '@/utils/general';
import { getPagesHrefsForCategorySlug } from '@/utils/new-cars/listings';
import { formatNumberWithPrice } from '@/utils/numbers';
import tenantFilterData from '@data';
import { getTranslations } from 'next-intl/server';

export class QuickFiltersService {
  constructor({ locale, isMobile, categorySlug, data, isLanding }) {
    this.locale = locale;
    this.country = configs.country[locale].label;
    this.isMobile = isMobile;
    this.categorySlug = categorySlug;
    this.data = data;
    this.isLanding = isLanding;
    this.currency = configs.currency[locale].label;
    const { prevYear, currentYear } = getModelYears();
    this.currentYear = currentYear;
    this.prevYear = prevYear;
    this.extractString = createLocaleStringGetter(this.locale);
  }


  shouldHideWidget(currentState, isSearch) {
    return false;
  }

  loadTranslations() {
    return getTranslations({
      locale: this.locale,
      namespace: 'newCar',
    });
  }

  getCurrentState() {
    const data = this.data;
    return {
      make: data?.make,
      model: data?.model,
      body: data?.body,
      price: data?.price,
    };
  }

  getCarouselConfig(key) {
    switch (key) {
      case 'make':
        return {
          rows: 2,
          threshold: this.isMobile ? 4 : 15,
          itemBasis: `basis-[30%] md:basis-[21%] ${!this.isLanding ? 'lg:basis-[16.66%]' : 'lg:basis-[12.5%]'
            }`,
          gridClassName: 'grid-cols-6',
        };

      case 'body':
        return {
          rows: 2,
          threshold: this.isMobile ? 6 : 8,
          itemBasis: 'basis-[33.33%] md:basis-[25%] lg:basis-[25%]',
          gridClassName: this.isMobile ? 'grid-cols-3' : 'grid-cols-4',
        };

      case 'prices':
        return {
          rows: 2,
          threshold: this.isMobile ? 2 : 12,
          itemBasis: `basis-[32%] md:basis-[35%] ' ${!this.isLanding ? 'lg:basis-[16.66%]' : 'lg:basis-[16.67%]'}`,
          gridClassName: !this.isLanding ? 'grid-cols-6' : 'grid-cols-8',
          type: 'badge',
          className: 'h-[54px] lg:h-[70px]',
        };

      default:
        break;
    }
  }

  async getInitialTabs() {
    const currentState = this.getCurrentState();
    const { makes, bodyTypes } = await fetchNewVehiclesFiltersData(
      {},
      this.categorySlug,
    );

    const baseUrl = getPagesHrefsForCategorySlug(this.categorySlug, 'landing');
    const t = await this.loadTranslations();

    const getPriceLabels = (price, displayAr = null) => {
      if(!this.isMobile) return {
        label: (
          <>
            {price}
          </>
        ),
      };
      return {
        label: (
          <>
            <span className="text-xs text-gray-light block text-center">
              {t('Under')}
            </span>
            {price}
          </>
        ),
      };
    };

    return [
      !currentState.body &&
      !currentState.price &&
      !currentState.make && {
        ...makes,
        label: 'Brands',
        value: 'make',
        ...this.getCarouselConfig('make'),
        items:
          makes?.map((item) => ({
            ...item,
            link: `${baseUrl}/${item?.slug}`,
            hrefTitle: t('make_h1', {
              make: this.extractString(item),
              prevYear: this.prevYear,
              currentYear: this.currentYear,
            }),
          })) || [],
      },
      {
        label: 'Prices',
        value: 'price-range',
        ...this.getCarouselConfig('prices'),
       items: tenantFilterData.newListingsFilterData.priceRanges.map(
          (price) => ({
            ...price,
            ...getPriceLabels(
              formatNumberWithPrice(price.label, this.locale, true, (e) => e),
              formatNumberWithPrice(
                price.label_l1,
                this.locale,
                true,
                (e) => e,
              ),
            ),
            link: `${baseUrl}/price-limit/${price.slug}`,
            hrefTitle: t('price_h1', {
              vehicleType: t(`${this.categorySlug}-plural`),
              max: price.slug,
              currency: this.currency,
              country: this.country,
            }),
          }),
        ),
      },
      {
        label: 'Body Styles',
        value: 'body',
        ...this.getCarouselConfig('body'),
        items:
          bodyTypes?.map((item) => ({
            ...item,
            hrefTitle: t('body_metaTitle', {
              body: this.extractString(item),
            }),
            link: `${baseUrl}/body/${item?.slug}`,
            count: item.count,
            spriteClass: `${parentClasses.body} body-${item.slug}`,
          })) || [],
      },
    ].filter(Boolean);
  }

  async getContextualLinks() {
    const currentState = this.getCurrentState();
    const t = await this.loadTranslations();
    const links = [];

    if (currentState.make) {
      links.push({
        key: 'new-car-makes',
        label: t('used_make_for_sale', { make: currentState.make.label }),
        link: `/car/${currentState.make.slug}`,
      });
    }
    if (currentState.price || currentState.body) {
      links.push({
        key: 'new-car-prices',
        label: t('used_cars_for_sale'),
        link: `/car`,
      });
    }

    return links;
  }

  async getTabs() {
    return await this.getInitialTabs();
  }
}
