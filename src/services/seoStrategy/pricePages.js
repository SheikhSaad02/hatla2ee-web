import { BaseSEOStrategy } from './baseSeoStrategyClass';
import { getTranslations } from 'next-intl/server';
import { getYearRange } from '@/utils/date';
import configs from '@/configs';
import { appPaths, vehicleSlugLabel } from '@/constants';
import { formatNumberValue } from '@/utils/numbers';
import { generatePageTitle } from '@/utils/serverFunctions';

export class PricePagesSEOStrategy extends BaseSEOStrategy {
  constructor(params = {}) {
    super(params);

    this.language = params.language || 'en';
    this.data = params.data || {};
    this.config = params.config || {};
    this.page = params.page;
    this.index_page = params.index_page;

    this.condition = params.condition || 'new';
    this.min = params.min;
    this.max = params.max;
    this.absoluteTitle = params.absoluteTitle || false;
    this.vehicleSlug = params.vehicleSlug || 'car';
    this.vehicleLabel =
      params.vehicleLabel || vehicleSlugLabel[this.vehicleSlug];

    this.makeSlug = params.makeSlug;
    this.makeLabel = params.makeLabel;
    this.make = params.make;

    this.modelSlug = params.modelSlug;
    this.modelLabel = params.modelLabel;

    this.year = params.year;
    this.yearRange = params.yearRange || getYearRange();

    this.country = configs?.country?.[this.language]?.label || '';
    this.currency = configs?.currency[this.language]?.label;
    this.seoString = this.vehicleSlug === 'car' ? 'car' : 'general';
    this.tPromise = null;
  }

  async loadTranslations() {
    if (!this.tPromise) {
      this.tPromise = getTranslations({
        locale: this.language,
        namespace: 'carPricesSeo',
      });
    }
    return this.tPromise;
  }

  async getVehicleLabel() {
    const t = await this.loadTranslations();
    const parts = [
      this.makeLabel,
      this.modelLabel,
      this.year && String(this.year),
    ].filter(Boolean);

    if (!this.makeLabel && !this.modelLabel) {
      return t(this.vehicleLabel);
    }

    return parts.join(' ');
  }

  rangeSuffix() {
    const hasMin = this.min != null && this.min !== '';
    const hasMax = this.max != null && this.max !== '';
    if (hasMin && hasMax) return 'range';
    if (hasMin) return 'range-min';
    if (hasMax) return 'range-max';
    return null;
  }

  getUsedCarTitleKey() {
    if (this.year) return 'used-price-detail-title';
    if (this.modelSlug) return 'used-price-model-title';
    if (this.makeSlug) return 'used-price-brand-title';
    if (this.rangeSuffix()) return `used-price-${this.rangeSuffix()}-title`;
    return 'used-price-title';
  }

  getUsedCarH1Key() {
    if (this.year) return 'used-price-detail-h1';
    if (this.modelSlug) return 'used-price-model-h1';
    if (this.makeSlug) return 'used-price-brand-h1';
    if (this.rangeSuffix()) return `used-price-${this.rangeSuffix()}-h1`;
    return 'used-price-h1';
  }

  async getUsedCarMetaDescription(t, params) {
    if (this.year) return t('used-price-detail-desc', params);
    if (this.modelSlug) return t('used-price-model-desc', params);
    if (this.makeSlug) return t('used-price-brand-desc', params);
    if (this.rangeSuffix())
      return t(`used-price-${this.rangeSuffix()}-desc`, params);
    return t(
      'used-price-desc',
      this.getTranslationParams({
        country: this.country,
        b: (text) => text,
        marketLink: (text) => text,
        usedLink: (text) => text,
        newLink: (text) => text,
      }),
    );
  }

  getTranslationParams(extra = {}) {
    return {
      country: this.country,
      vehicle: this.vehicleLabel,
      brand: this.makeLabel,
      make: this.makeLabel,
      model: this.modelLabel,
      min: formatNumberValue(this.min),
      max: formatNumberValue(this.max),
      currency: this.currency,
      year: this.year,
      yearRange: this.yearRange,
      ...extra,
    };
  }

  async generatePriceChangeSEO() {
    const t = await this.loadTranslations();
    const params = this.getTranslationParams();

    const titleKey = this.makeSlug
      ? 'price-change-brand-title'
      : 'price-change-title';
    const title = await generatePageTitle(t(titleKey, params), this.page);

    const h1Key = this.makeSlug ? 'price-change-brand-h1' : 'price-change-h1';
    const h1 = t(h1Key, {
      vehicle: this.vehicleLabel,
      make: this.makeLabel,
    });

    const descKey = this.makeSlug
      ? 'price-change-brand-desc'
      : 'price-change-desc';
    const description = await this.generatePageDescription(
      t(descKey, params),
      this.page,
    );

    const breadcrumbs = [
      {
        label: t('price-change-breadcrumb', { yearRange: this.yearRange }),
        href: appPaths['new-car-prices'],
      },
    ];

    if (this.makeSlug) {
      breadcrumbs.push({
        label: t('price-change-breadcrumb-brand', {
          make: this.makeLabel,
          yearRange: this.yearRange,
          country: this.country,
        }),
        href: `${appPaths['new-car-prices-make']}/${this.makeSlug}`,
      });
    }

    // Get canonical URL for pagination
    const [canonical, languages] = await Promise.all([
      this.generateCanonical(),
      this.generateLanguages(),
    ]);

    return {
      title: this.absoluteTitle ? { absolute: title } : title,
      h1,
      description,
      breadcrumbs,
      canonical,
      languages,
    };
  }

  async generateCanonical() {
    // Check for pagination pattern and generate canonical URL
    const { generateCanonicalUrlForPagination } =
      await import('@/utils/general');
    const { BASE_URL } = await import('@/constants');

    // Get the current URL path from headers
    const { headers } = await import('next/headers');
    const headersList = await headers();
    const currentPath = headersList.get('x-pathname') || '';

    if (currentPath) {
      // Use the current path directly (it already contains /page/X if present)
      const paginationCanonical = generateCanonicalUrlForPagination(
        currentPath,
        BASE_URL,
        { page: this.page },
      );

      if (paginationCanonical) {
        return paginationCanonical;
      }
    }

    return '';
  }

  async generateRobotsTag() {
    if (!this.index_page) {
      return {
        index: false,
        follow: true,
      };
    }

    return this.getIndexableRobotsTag();
  }

  async generateNewCarPricesSEO() {
    const t = await this.loadTranslations();

    // Generate meta title using dynamic seoString approach
    const titleKey =
      this.makeSlug && this.condition === 'new'
        ? `all-price-brand-title-${this.seoString}`
        : this.rangeSuffix() && this.seoString === 'car'
          ? `all-price-${this.rangeSuffix()}-title-car`
          : `all-price-landing-title-${this.seoString}`;

    const vehicleDisplayName = t(vehicleSlugLabel[this.vehicleSlug]);

    // Special case: use 'bus_all_price' as vehicle when titleKey is 'all-price-title' and vehicleDisplayName is 'Bus'
    const vehicleParam =
      vehicleDisplayName === 'أتوبيسات' || vehicleDisplayName === 'Bus'
        ? t('bus_all_price')
        : vehicleDisplayName;

    let brandParam = this.makeLabel;
    if (this.language === 'ar' && this.vehicleSlug === 'trucks' && this.make) {
      brandParam = this.make.label_l1;
    }

    const metaTitle = await generatePageTitle(
      t(
        titleKey,
        this.getTranslationParams({
          vehicle: vehicleDisplayName,
          brand: brandParam,
          make: this.makeLabel,
        }),
      ),
      this.page,
    );

    // Generate H1 key using dynamic seoString approach
    const h1Key =
      !this.makeSlug && !this.rangeSuffix()
        ? `all-price-landing-h1-${this.seoString}`
        : this.makeSlug
          ? `all-price-brand-h1-${this.seoString}`
          : this.rangeSuffix() && this.seoString === 'car'
            ? `all-price-${this.rangeSuffix()}-h1-car`
            : `all-price-h1-${this.seoString}`;

    let brandParamH1 = this.makeLabel;
    if (this.language === 'ar' && this.vehicleSlug === 'trucks' && this.make) {
      brandParamH1 = t('truck_make_h1', {
        make: this.make.label_l1,
      });
    }
    const h1 = t(
      h1Key,
      this.getTranslationParams({
        vehicle: vehicleDisplayName,
        brand: brandParamH1,
        make: this.makeLabel,
      }),
    );

    // Generate meta description using dynamic seoString approach
    const getMetaDescription = () => {
      if (this.makeSlug) {
        return t(
          `all-price-brand-desc-${this.seoString}`,
          this.getTranslationParams({
            brand: brandParam,
            make: this.makeLabel,
            vehicleSingular: t(
              vehicleSlugLabel[this.vehicleSlug],
            ).toLowerCase(),
          }),
        );
      }
      if (this.rangeSuffix() && this.seoString === 'car') {
        return t(
          `all-price-${this.rangeSuffix()}-desc`,
          this.getTranslationParams(),
        );
      }
      return t(
        `all-price-desc-${this.seoString}`,
        this.getTranslationParams({
          vehicle: vehicleParam,
          vehicleSingular: t(vehicleSlugLabel[this.vehicleSlug]).toLowerCase(),
          b: (text) => text,
          marketLink: (text) => text,
          usedLink: (text) => text,
          newLink: (text) => text,
        }),
      );
    };

    const metaDescription = getMetaDescription();

    // Generate breadcrumbs for new cars
    const breadcrumbs = [];
    if (this.makeSlug || this.rangeSuffix()) {
      breadcrumbs.push({
        label: t('new-vehicle-prices', {
          vehicle: t(this.vehicleLabel),
          year: this.yearRange,
        }),
        href: appPaths[`new-${this.vehicleSlug}-prices`],
      });
    }

    // Generate canonical URL
    const canonical = await this.generateCanonical();
    return {
      metaTitle: this.absoluteTitle ? { absolute: metaTitle } : metaTitle,
      h1,
      metaDescription: metaDescription,
      breadcrumbs,
      canonical,
    };
  }

  async generateUsedCarPricesSEO() {
    const t = await this.loadTranslations();
    const vehicleDisplayName = await this.getVehicleLabel();

    // Generate meta title for used cars
    const titleKey = this.getUsedCarTitleKey();
    const params = this.getTranslationParams({
      vehicle: vehicleDisplayName,
      country: this.country,
    });
    const metaTitle = await generatePageTitle(t(titleKey, params), this.page);

    // Generate H1 for used cars
    const h1Key = this.getUsedCarH1Key();
    const h1 = t(h1Key, params);

    // Generate meta description for used cars
    const metaDescription = await this.getUsedCarMetaDescription(t, params);

    // Generate breadcrumbs for used cars
    const breadcrumbs = [
      {
        label: t('Car Prices'),
        href: appPaths['new-car-prices'],
      },
    ];

    if (this.makeSlug || this.min || this.max) {
      breadcrumbs.push({
        label: t('Used Car Prices'),
        href: appPaths.usedCarPrices,
      });
    }

    if (this.modelSlug) {
      breadcrumbs.push({
        label: t('used-vehicle-price', { vehicle: this.makeLabel }),
        href: `${appPaths.usedCarPrices}/${this.makeSlug}`,
      });
    }

    if (this.year) {
      breadcrumbs.push({
        label: t('used-vehicle-price', {
          vehicle: `${this.makeLabel} ${this.modelLabel}`,
        }),
        href: `${appPaths.usedCarPrices}/${this.makeSlug}/${this.modelSlug}`,
      });
    }

    // Generate canonical URL
    const canonical = await this.generateCanonical();
    const robotsTag = await this.generateRobotsTag();

    return {
      metaTitle: this.absoluteTitle ? { absolute: metaTitle } : metaTitle,
      h1,
      metaDescription,
      breadcrumbs,
      canonical,
      robotsTag,
    };
  }

  async generateSEO() {
    const [seoData, languages] = await Promise.all([
      this.condition === 'new'
        ? this.generateNewCarPricesSEO()
        : this.generateUsedCarPricesSEO(),
      this.generateLanguages(),
    ]);

    const description = await this.generatePageDescription(
      seoData.metaDescription,
      this.page,
    );

    return { ...seoData, metaDescription: description, languages };
  }
}
