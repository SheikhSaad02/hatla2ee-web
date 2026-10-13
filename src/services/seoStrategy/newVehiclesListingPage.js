import {
  fetchNewCarsListingsData,
  newVehiclePageSize,
} from '@/apis/new-cars-listings';
import configs from '@/configs';
import { BASE_URL, newVehiclesCategorySlugs } from '@/constants';
import { getModelYears } from '@/utils/date';
import {
  createLocaleStringGetter,
  getAsset,
  getPaginationMetaLinks,
  removePageFromUrl,
} from '@/utils/general';
import {
  getPagesHrefsForCategorySlug,
  getShouldfetchVariantLevelAds,
} from '@/utils/new-cars/listings';
import { formatNumberValue } from '@/utils/numbers';
import { getTranslations } from 'next-intl/server';
import { BaseSEOStrategy } from './baseSeoStrategyClass';

export class NewVehiclesListingSEOStrategy extends BaseSEOStrategy {
  constructor(params) {
    super(params);
    this.isSearch = !!params.isSearch;
    this.isLanding = !!params.isLanding;
    this.categorySlug = params.categorySlug;
    this.extractString = createLocaleStringGetter(this.language);
    this.initializeDataProperties();
    this.currentPath = params.currentPath || '';
    this.loadTranslations();
    this.absoluteTitle = params.absoluteTitle || false;
  }

  initializeDataProperties() {
    const { make, model, body, page, price } = this.data;
    this.make = this.extractString(make, 'label');
    this.model = this.extractString(model, 'label');
    this.body = this.extractString(body, 'label');
    this.transmission = this.extractString(body, 'label');
    this.page = page || 1;
    const { prevYear, currentYear } = getModelYears();
    this.currentYear = currentYear;
    this.prevYear = prevYear;
    this.country = configs.country[this.language].label;
    this.price = price;
    this.currency = configs.currency[this.language].label;
    this.seoString =
      newVehiclesCategorySlugs.newCars === this.categorySlug
        ? 'car'
        : 'general';
  }

  loadTranslations() {
    this.metaT = getTranslations({
      locale: this.language,
      namespace: 'metadata',
    });

    this.newCarSeoT = getTranslations({
      locale: this.language,
      namespace: 'newVehicleListingsSeo',
    });
  }

  async generateNewCarsH1() {
    const t = await this.newCarSeoT;
    const vehicleTypePlural = t(`${this.categorySlug}-plural`);

    if (this.isSearch) {
      return t(`search_h1_${this.seoString}`, {
        country: this.country,
        vehicleTypePlural,
      });
    }
    const { make, body, price } = this;
    if (make) {
      return t(`make_h1_${this.seoString}`, {
        make,
        country: this.country,
        vehicleTypePlural,
        prevYear: this.prevYear,
        currentYear: this.currentYear,
        vehicleType: t(this.categorySlug),
      });
    }
    if (body) {
      return t(`body_h1_${this.seoString}`, {
        body,
        country: this.country,
        vehicleTypePlural,
      });
    }
    if (price) {
      const { max } = price;
      if (newVehiclesCategorySlugs.newCars === this.categorySlug) {
        return t('price_h1_car', {
          max: formatNumberValue(max),
          currency: this.currency,
          country: this.country,
        });
      }
      return t('price_h1', {
        max: formatNumberValue(max),
        currency: this.currency,
        country: this.country,
        vehicleType: vehicleTypePlural,
      });
    }

    return t(`landing_h1_${this.seoString}`, {
      prevYear: this.prevYear,
      currentYear: this.currentYear,
      country: this.country,
      vehicleTypePlural,
      vehicleType: t('Car'),
    });
  }

  async generateH1() {
    return await this.generateNewCarsH1();
  }

  async generateNewCarsMetaTitle() {
    const t = await this.newCarSeoT;
    const vehicleTypePlural = t(`${this.categorySlug}-plural`);
    if (this.isSearch) {
      return t(`search_metaTitle_${this.seoString}`, {
        country: this.country,
        vehicleTypePlural,
      });
    }

    const { make, body, price } = this;
    if (make) {
      return t(`make_metaTitle_${this.seoString}`, {
        make,
        country: this.country,
        vehicleTypePlural,
      });
    }
    if (body) {
      return t(`body_metaTitle_${this.seoString}`, {
        body,
        country: this.country,
        vehicleTypePlural,
      });
    }
    if (price) {
      if (newVehiclesCategorySlugs.newCars === this.categorySlug) {
        const { max } = this.price;
        return t('price_metaTitle_car', {
          max: formatNumberValue(max),
          currency: this.currency,
          country: this.country,
        });
      }
      return this.generateNewCarsH1();
    }

    if (this.isLanding) {
      return t(`landing_metaTitle_${this.seoString}`, {
        country: this.country,
        vehicleTypePlural,
      });
    }

    return this.generateNewCarsH1();
  }

  async generateMetaTitle() {
    let metaTitle = await this.generateNewCarsMetaTitle();

    const t = await this.metaT;
    metaTitle = `${metaTitle} | ${t('Hatla2eeCountry', { country: this.country })}`;

    if (this.page && this.page > 1) {
      metaTitle = `${metaTitle} - ${t('Page')} ${this.page}`;
    }

    return this.absoluteTitle ? { absolute: metaTitle } : metaTitle;
  }

  async generateMetaDescription() {
    return this.generatePageDescription(
      await this.resolveMetaDescription(),
      this.page,
    );
  }

  async resolveMetaDescription() {
    const t = await this.newCarSeoT;
    const vehicleTypePlural = t(`${this.categorySlug}-plural`);
    const vehicleTypeLower = vehicleTypePlural.toLowerCase();
    const vehicleTypeSingular = t(this.categorySlug).toLowerCase();

    if (this.isSearch) {
      return t(`search_metaDesc_${this.seoString}`, {
        country: this.country,
        vehicleTypeLower,
      });
    }
    if (this.make) {
      return t(`make_metaDesc_${this.seoString}`, {
        make: this.make,
        country: this.country,
        vehicleTypePlural,
        vehicleTypeLower,
        vehicleTypeSingular,
      });
    }
    if (this.body) {
      return t(`body_metaDesc_${this.seoString}`, {
        body: this.body,
        country: this.country,
        vehicleTypeLower,
      });
    }

    // Handle price case
    if (this.price) {
      const { max } = this.price;

      if (newVehiclesCategorySlugs.newCars === this.categorySlug) {
        return t('price_metaDesc_car', {
          max: formatNumberValue(max),
          currency: this.currency,
          country: this.country,
        });
      }

      if (max != null && max !== '') {
        return t('price_metaDesc', {
          max: formatNumberValue(max),
          currency: this.currency,
          country: this.country,
          vehicleTypeLower,
          vehicleTypeSingular,
        });
      }
    }

    if (this.isLanding && !this.make && !this.body && !this.price) {
      return t(`landing_metaDesc_${this.seoString}`, {
        country: this.country,
        vehicleTypePlural,
        vehicleTypeLower,
      });
    }

    return '';
  }

  async generateNewCarsBreadCrumbs() {
    const t = await this.newCarSeoT;

    return [
      {
        href: getPagesHrefsForCategorySlug(this.categorySlug, 'landing'),
        label: t('breadcrumbs.new_vehicle', {
          vehicleType: t(`breadcrumbs.${this.categorySlug}`),
        }),
      },
    ];
  }

  async generateBreadcrumbs() {
    return await this.generateNewCarsBreadCrumbs();
  }

  async generateNewCarsCanonical() {
    // Check for pagination pattern and generate canonical URL
    const { generateCanonicalUrlForPagination } =
      await import('@/utils/general');
    const { BASE_URL } = await import('@/constants');

    // Debug logging (remove in production)
    if (this.currentPath) {
      // Use the current path directly (it already contains /page/X if present)
      const paginationCanonical = generateCanonicalUrlForPagination(
        this.currentPath,
        BASE_URL,
        { page: this.data?.page },
      );

      if (paginationCanonical) {
        return paginationCanonical;
      }
    }

    return '';
  }

  async generateCanonical() {
    return await this.generateNewCarsCanonical();
  }

  async generateNewVehicleRobotsTag() {
    if (this.isSearch) return this.getIndexableRobotsTag();

    // make pages -> index only if they have listings
    if (this.make) {
      const { pagination } = await fetchNewCarsListingsData(
        this.data,
        this.categorySlug,
        getShouldfetchVariantLevelAds(this.isSearch, this.data),
      );

      if (!(Number(pagination?.totalCount) > 0)) {
        return {
          index: false,
          follow: true,
        };
      }
    }

    return this.getIndexableRobotsTag();
  }

  async generateRobotsTag() {
    switch (this.categorySlug) {
      case newVehiclesCategorySlugs.newTrucks:
      case newVehiclesCategorySlugs.newBus:
        return this.generateNewVehicleRobotsTag();

      default:
        return this.getIndexableRobotsTag();
    }
  }

  async generatePaginationMetaLinks() {
    const { pagination } = await fetchNewCarsListingsData(
      this.data,
      this.categorySlug,
      getShouldfetchVariantLevelAds(this.isSearch, this.data),
    );

    return getPaginationMetaLinks({
      currentPage: Number(this.page),
      totalCount: Number(pagination.totalCount),
      baseUrl: removePageFromUrl(this.currentPath),
      pageSize: newVehiclePageSize,
    });
  }

  async generateOpenGraphImage() {
    return getAsset(`/assets/og-images/new-cars-${this.language}.webp`);
  }

  async generateOpenGraph() {
    const baseOG = await super.generateOpenGraph();
    const image = await this.generateOpenGraphImage();
    const url = await this.generateCanonical();

    return {
      ...baseOG,
      url,
      images: image
        ? [
            {
              url: image,
              width: 1200,
              height: 630,
              alt: baseOG.title,
            },
          ]
        : undefined,
    };
  }
}
