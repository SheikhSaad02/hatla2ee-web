import { formatDate, toSchemaOrgDate } from '@/utils/date';
import { BaseSEOStrategy } from './baseSeoStrategyClass';
import {
  mapSchemaOrgAvailability,
  mapSchemaOrgCarField,
} from './schemaOrgCarMappings';
import { appPaths, BASE_URL } from '@/constants';
import { getTranslations } from 'next-intl/server';
import { getAsset } from '@/utils/general';

export class CarListingSEOStrategy extends BaseSEOStrategy {
  constructor(params) {
    super(params);

    this.listingDetailData = params.listingDetailData || {};
    this.car_language_matches_user = params.car_language_matches_user || false;
    this.type_id = params.type_id || 1;
    this.is_new_car_ad = params.is_new_car_ad || false;
    this.year_page_indexed = params.year_page_indexed || false;
    this.initializeCarProperties();
    this.loadTranslations();
  }

  initializeCarProperties() {
    const { listingDetailData } = this;

    this.car_id = listingDetailData?.listing_id;
    this.custom_title = listingDetailData?.title || listingDetailData?.title_l1;
    this.dynamic_fields = listingDetailData?.dynamic_fields || {};
    this.condition = this.dynamic_fields?.condition;
    this.showroom = listingDetailData?.agency;
    this.user_name = listingDetailData?.contact_details;
    this.year = this.dynamic_fields?.year;
    this.price = listingDetailData?.price;
    this.published = listingDetailData?.posted_at;
    this.modified = listingDetailData?.updated_at;
    this.meta7 = listingDetailData?.meta7;
    this.is_associated_with_agency = !!listingDetailData?.agency?.active;
    this.is_imported = this.dynamic_fields?.imported?.slug === 'yes';
    this.hasCustomTitle = this.custom_title && this.car_language_matches_user;
    this.versionOrYear = this.car_language_matches_user
      ? this.meta7 || ' '
      : (this.year ?? ' '); //used as version in legacy hatla2ee
  }

  loadTranslations() {
    this.carListingT = getTranslations({
      locale: this.language,
      namespace: 'carListingsSeo',
    });
  }

  async getLocalizedStrings() {
    // Cache localized strings to avoid multiple calls
    if (this.localizedStrings) return this.localizedStrings;

    const { getLocaleStringServer } = await import('@/utils/serverFunctions');

    this.localizedStrings = {
      city_name: await getLocaleStringServer(
        this.listingDetailData?.location,
        'title',
      ),
      brand_name: await getLocaleStringServer(
        this.dynamic_fields?.make,
        'label',
      ),
      model_name: await getLocaleStringServer(
        this.dynamic_fields?.model,
        'label',
      ),
      variant_name: await getLocaleStringServer(
        this.dynamic_fields?.variant,
        'label',
      ),
      color_name: await getLocaleStringServer(
        this.dynamic_fields?.exterior_color,
        'value',
      ),
      transmission_name: await getLocaleStringServer(
        this.dynamic_fields?.transmission,
        'label',
      ),
      fuel_type_name: await getLocaleStringServer(
        this.dynamic_fields?.fuel_type,
        'label',
      ),
      showroom_name: await getLocaleStringServer(
        this?.listingDetailData?.agency,
        'name',
      ),
      user_name: await getLocaleStringServer(
        this.listingDetailData?.contact_details,
        'name',
      ),
    };

    return this.localizedStrings;
  }

  async getImportedPrefix() {
    if (!this.is_imported) return '';
    const t = await this.carListingT;
    return t('common.imported_prefix');
  }

  async generateMetaTitle() {
    const strings = await this.getLocalizedStrings();
    const {
      brand_name,
      model_name,
      variant_name,
      city_name,
      color_name,
      showroom_name,
    } = strings;

    if (this.is_new_car_ad) {
      return this.generateNewCarMetaTitle(
        brand_name,
        model_name,
        variant_name,
        showroom_name,
      );
    }

    if (this.hasCustomTitle) {
      return this.generateCustomTitleMeta();
    }

    return this.generateUsedCarMetaTitle(
      brand_name,
      model_name,
      city_name,
      color_name,
    );
  }

  async generateNewCarMetaTitle(
    brand_name,
    model_name,
    variant_name,
    showroom_name,
  ) {
    const t = await this.carListingT;
    const baseTitle = `${brand_name} ${model_name} ${this.year ?? ''} ${
      variant_name || ''
    }`;

    const prefix =
      this.is_associated_with_agency && this.showroom
        ? showroom_name && `${showroom_name} `
        : '';

    if (prefix) {
      return t('meta_titles.new_car_for_sale', { prefix, baseTitle });
    } else {
      return t('meta_titles.new_car_for_sale_no_prefix', { baseTitle });
    }
  }

  async generateCustomTitleMeta() {
    const t = await this.carListingT;

    if (this.car_id > 39200) {
      return t('meta_titles.custom_title_with_suffix', {
        customTitle: this.custom_title,
        carId: this.car_id,
      });
    }
    return t('meta_titles.custom_title_simple', {
      customTitle: this.custom_title,
      carId: this.car_id,
    });
  }

  async generateUsedCarMetaTitle(
    brand_name,
    model_name,
    city_name,
    color_name,
  ) {
    const t = await this.carListingT;
    const importedPrefix = await this.getImportedPrefix();
    const baseTitle = `${importedPrefix}${model_name} ${brand_name} ${this.versionOrYear} ${city_name} ${color_name} ${this.car_id}`;

    if (this.car_id > 39200) {
      return t('meta_titles.used_car_with_suffix', { baseTitle });
    }
    return t('meta_titles.used_car_simple', { baseTitle });
  }

  async generateH1() {
    const strings = await this.getLocalizedStrings();
    const {
      brand_name,
      model_name,
      variant_name,
      city_name,
      showroom_name,
      user_name,
    } = strings;

    if (this.is_new_car_ad) {
      return this.generateNewCarH1(
        brand_name,
        model_name,
        variant_name,
        showroom_name,
        user_name,
      );
    }

    if (this.hasCustomTitle) {
      return this.custom_title;
    }

    return this.generateUsedCarH1(brand_name, model_name, city_name);
  }

  async generateNewCarH1(
    brand_name,
    model_name,
    variant_name,
    showroom_name,
    user_name,
  ) {
    const t = await this.carListingT;
    const name =
      this.is_associated_with_agency && this.showroom
        ? showroom_name
        : user_name;

    // Remove parentheses from variant name
    let cleanVariantName = variant_name || '';

    // Check if variant ID is one of the specific IDs that need space handling
    const specialVariantIds = [50340, 50353, 50354];
    const variantId = this.dynamic_fields?.variant?.id;

    if (cleanVariantName) {
      if (specialVariantIds.includes(variantId)) {
        // For special variants: Add spaces before ( and after ) if they don't exist, then remove parentheses
        // Add space before ( if there isn't one
        cleanVariantName = cleanVariantName.replace(/(\S)\(/g, '$1 (');
        // Add space after ) if there isn't one
        cleanVariantName = cleanVariantName.replace(/\)(\S)/g, ') $1');
      }
      // Remove parentheses for all variants
      cleanVariantName = cleanVariantName.replace(/[()]/g, '');
    }

    const baseTitle = `${brand_name} ${model_name} ${this.year || ''} ${
      cleanVariantName || ''
    }`;

    if (name) {
      return {
        name: name,
        h1: t('h1_titles.new_car_without_name', { baseTitle }),
      };
    } else {
      return t('h1_titles.new_car_without_name', { baseTitle });
    }
  }

  async generateUsedCarH1(brand_name, model_name, city_name) {
    const t = await this.carListingT;

    if (this.condition?.slug === 'new' && this.is_imported) {
      return t('h1_titles.imported_new_car', {
        brandName: brand_name,
        modelName: model_name,
        versionOrYear: this.versionOrYear,
        cityName: city_name,
      });
    } else if (this.is_imported) {
      return t('h1_titles.imported_used_car', {
        brandName: brand_name,
        modelName: model_name,
        versionOrYear: this.versionOrYear,
        cityName: city_name,
      });
    } else {
      return t('h1_titles.used_car', {
        brandName: brand_name,
        modelName: model_name,
        versionOrYear: this.versionOrYear,
        cityName: city_name,
      });
    }
  }

  async generateMetaDescription() {
    // if (this.hasCustomTitle || this.is_new_car_ad) {
    //   return null;
    // }

    const t = await this.carListingT;
    const strings = await this.getLocalizedStrings();
    const { brand_name, model_name, color_name, city_name } = strings;

    const publishedDate =
      this.published &&
      formatDate(this.published, undefined, this.isEnglish() ? 'en' : 'ar');

    return t('meta_descriptions.used_car', {
      brandName: brand_name,
      modelName: model_name,
      version: this.meta7 || '',
      year: this.year,
      colorName: color_name,
      cityName: city_name,
      price: this.price,
      publishedDate: publishedDate,
    });
  }

  async generateBreadcrumbs() {
    const strings = await this.getLocalizedStrings();
    const { brand_name, model_name, variant_name, city_name } = strings;

    if (this.is_new_car_ad) {
      return this.generateNewCarBreadcrumbs(
        brand_name,
        model_name,
        variant_name,
      );
    } else if (this.condition?.slug === 'new' && this.is_imported) {
      return this.generateImportedNewCarBreadcrumbs(model_name);
    } else if (this.is_imported) {
      return this.generateImportedUsedCarBreadcrumbs();
    } else {
      return this.generateUsedCarBreadcrumbs(brand_name, model_name, city_name);
    }
  }

  async generateNewCarBreadcrumbs(brand_name, model_name, variant_name) {
    const t = await this.carListingT;
    const breadcrumbs = [];

    breadcrumbs.push({
      label: t('breadcrumbs.new_car'),
      href: appPaths['new-car'],
    });
    breadcrumbs.push({
      label: t('breadcrumbs.brand_new', { brandName: brand_name }),
      href: `${appPaths['new-car']}/${this.dynamic_fields?.make?.slug}`,
    });
    breadcrumbs.push({
      label: t('breadcrumbs.brand_model_new', {
        brandName: brand_name,
        modelName: model_name,
      }),
      href: `${appPaths['new-car']}/${this.dynamic_fields?.make?.slug}/${this.dynamic_fields?.model?.slug}`,
    });
    if (variant_name) {
      //here add tha () condition that is if () then remove them  and add space if no space between them
      // Remove parentheses from variant name
      let cleanVariantName = variant_name || '';

      // Check if variant ID is one of the specific IDs that need space handling
      const specialVariantIds = [50340, 50353, 50354];
      const variantId = this.dynamic_fields?.variant?.id;

      if (cleanVariantName) {
        if (specialVariantIds.includes(variantId)) {
          // For special variants: Add spaces before ( and after ) if they don't exist, then remove parentheses
          // Add space before ( if there isn't one
          cleanVariantName = cleanVariantName.replace(/(\S)\(/g, '$1 (');
          // Add space after ) if there isn't one
          cleanVariantName = cleanVariantName.replace(/\)(\S)/g, ') $1');
        }
        // Remove parentheses for all variants
        cleanVariantName = cleanVariantName.replace(/[()]/g, '');
      }

      breadcrumbs.push({
        label: t('breadcrumbs.variant_new', { variantName: cleanVariantName }),
        href: `${appPaths['new-car']}/${this.dynamic_fields?.make?.slug}/${this.dynamic_fields?.model?.slug}/${this.dynamic_fields?.variant?.id}`,
      });
    }

    return breadcrumbs;
  }

  async generateImportedNewCarBreadcrumbs(model_name) {
    const t = await this.carListingT;
    const breadcrumbs = [];

    breadcrumbs.push({
      label: t('breadcrumbs.new_car'),
      href: appPaths['new-car'],
    });
    breadcrumbs.push({
      label: t('breadcrumbs.imported_new_car'),
      href: appPaths.newImportedCars,
    });
    breadcrumbs.push({
      label: model_name,
      href: `${appPaths.newImportedCars}/${this.dynamic_fields?.make?.slug}/${this.dynamic_fields?.model?.slug}`,
    });

    return breadcrumbs;
  }

  async generateImportedUsedCarBreadcrumbs() {
    const t = await this.carListingT;
    const breadcrumbs = [];

    breadcrumbs.push({
      label: t('breadcrumbs.cars_for_sale'),
      href: appPaths.home,
    });
    breadcrumbs.push({
      label: t('breadcrumbs.used_cars'),
      href: appPaths.usedCars,
    });
    breadcrumbs.push({
      label: t('breadcrumbs.imported_cars'),
      href: appPaths.usedImportedCars,
    });

    return breadcrumbs;
  }

  async generateUsedCarBreadcrumbs(brand_name, model_name, city_name) {
    const t = await this.carListingT;
    const breadcrumbs = [];

    breadcrumbs.push({
      label: t('breadcrumbs.cars_for_sale_home'),
      href: appPaths.home,
    });
    breadcrumbs.push({
      label: t('breadcrumbs.used_cars'),
      href: appPaths.usedCars,
    });
    breadcrumbs.push({
      label: brand_name,
      href: `${appPaths.usedCars}/${this.dynamic_fields?.make?.slug}`,
    });
    breadcrumbs.push({
      label: model_name,
      href: `${appPaths.usedCars}/${this.dynamic_fields?.make?.slug}/${this.dynamic_fields?.model?.slug}`,
    });
    if (this.year_page_indexed) {
      breadcrumbs.push({
        label: this.year?.toString(),
        href: `${appPaths.usedCars}/${this.dynamic_fields?.make?.slug}/${this.dynamic_fields?.model?.slug}/year/${this.year}`,
      });
    }
    breadcrumbs.push({
      label: city_name,
      href: `${appPaths.usedCars}/city/${this.listingDetailData?.location?.slug}`,
    });

    return breadcrumbs;
  }

  async generateCanonical() {
    // If it's a new car, return null (no canonical)
    if (this.is_new_car_ad) {
      return null;
    }

    // The imported route (/new-car/imported/{make}/{model}/{id}) is
    // self-canonical. It passes is_new_car_ad: false, so without this it would
    // fall through to the used-car path below, which only redirects for new
    // cars. Key off the listing itself rather than the flag.
    if (this.is_imported && this.condition?.slug === 'new') {
      const makeSlug = this.dynamic_fields?.make?.slug;
      const shapeSlug = this.listingDetailData?.shape?.slug;
      const baseModelSlug = this.dynamic_fields?.model?.slug;
      // handleSlugRedirect normalises the model slug to include the shape, so
      // the canonical has to match or it points at a redirect.
      const modelSlug = shapeSlug
        ? `${baseModelSlug}-shape-${shapeSlug}`
        : baseModelSlug;

      if (makeSlug && modelSlug && this.car_id) {
        return `${BASE_URL}/${this.language}${appPaths.newImportedCars}/${makeSlug}/${modelSlug}/${this.car_id}`;
      }

      return null;
    }

    // For other cars, return baseUrl/locale/make/model/id
    const makeSlug = this.dynamic_fields?.make?.slug;
    const modelSlug = this.dynamic_fields?.model?.slug;
    const carId = this.car_id;

    if (makeSlug && modelSlug && carId) {
      return `${BASE_URL}/${this.language}/car/${makeSlug}/${modelSlug}/${carId}`;
    }

    return null;
  }

  async generateRobotsTag() {
    const { agency } = this.listingDetailData;


    return this.getIndexableRobotsTag();
  }

  async generateOpenGraphImage() {
    // Get the first car image if available
    const images = this.listingDetailData?.images || [];
    if (images.length > 0) {
      const firstImage = images[0];
      // large is 1200x675 and matches the declared og:image dimensions.
      // medium is only 400x225 and does not.
      return firstImage?.large || firstImage?.medium;
    }

    return getAsset(`/assets/og-images/used-cars-${this.language}.webp`);
  }

  async generateJsonLd() {
    if (this.is_new_car_ad) return null;

    const strings = await this.getLocalizedStrings();
    const { brand_name, model_name, color_name } = strings;
    const { default: configs } = await import('@/configs');
    const { getLocaleStringServer } = await import('@/utils/serverFunctions');
    const canonical = await this.generateCanonical();

    const h1 = await this.generateH1();
    const name = typeof h1 === 'object' ? h1.h1 || h1.name : h1;
    const images = this.listingDetailData?.images || [];
    const firstImage = images[0];
    const contentUrl = firstImage?.full || null;
    const imageName = firstImage?.alt?.trim() || name;

    const description = await getLocaleStringServer(
      this.listingDetailData,
      'description',
    );

    const currencyCode = configs?.currency?.en?.code || 'EGP';
    const priceRaw = this.price;
    const priceValue =
      typeof priceRaw === 'object' && priceRaw !== null
        ? (priceRaw.min ?? priceRaw.max)
        : priceRaw;
    const priceNumber = priceValue != null ? Number(priceValue) : null;
    const km = this.dynamic_fields?.km;
    const year = this.year;
    const conditionSlug = this.condition?.slug;
    const sold_at = this.listingDetailData?.sold_at;

    const itemConditionUrl = mapSchemaOrgCarField('condition', conditionSlug);
    const fuelTypeUrl = mapSchemaOrgCarField(
      'fuel',
      this.dynamic_fields?.fuel_type?.slug,
    );
    const transmissionUrl = mapSchemaOrgCarField(
      'transmission',
      this.dynamic_fields?.transmission?.slug,
    );
    const availabilityUrl = mapSchemaOrgAvailability({
      soldAt: sold_at,
      dispositionSlug: this.listingDetailData?.disposition?.slug,
    });
    // `Car` has no property for when the *ad* was posted or edited — its date
    // properties (vehicleModelDate, productionDate, ...) all describe the
    // vehicle. The listing dates belong to the page, so they ride on a WebPage
    // node hung off mainEntityOfPage, which is where they are actually valid.
    const datePublished = toSchemaOrgDate(this.published);
    const dateModified = toSchemaOrgDate(this.modified);
    const mainEntityOfPage =
      canonical && (datePublished || dateModified)
        ? {
            '@type': 'WebPage',
            '@id': `${canonical}#webpage`,
            url: canonical,
            ...(datePublished && { datePublished }),
            ...(dateModified && { dateModified }),
          }
        : undefined;

    let seller;
    const agency = this.listingDetailData?.agency;
    if (agency?.active && agency?.slug) {
      const agencyName = await getLocaleStringServer(agency, 'name');
      seller = {
        '@type': 'Organization',
        name: agencyName || 'Showroom',
        url: `${BASE_URL}/${this.language}/showroom/${agency.slug}`,
      };
    } else {
      seller = {
        '@type': 'Person',
        name: 'Private Seller',
      };
    }

    const offers = {
      '@type': 'Offer',
      availability: availabilityUrl,
      itemCondition: itemConditionUrl,
      url: canonical,
      seller,
      ...(priceNumber != null &&
        !Number.isNaN(priceNumber) && {
          price: String(priceNumber),
          priceCurrency: currencyCode,
        }),
    };
    const jsonLd = {
      '@context': 'https://schema.org',
      '@type': 'Car',
      '@id': canonical,
      name,
      url: canonical,
      ...(description && {
        description: description?.replace(/^(.{200}\S*)\s.*/s, '$1')?.trim(),
      }),
      ...(contentUrl && {
        image: {
          '@type': 'ImageObject',
          contentUrl,
          name: imageName,
        },
      }),
      brand: {
        '@type': 'Brand',
        name: brand_name,
      },
      model: model_name,
      ...(year != null && { vehicleModelDate: String(year) }),
      ...(fuelTypeUrl && { fuelType: fuelTypeUrl }),
      ...(transmissionUrl && { vehicleTransmission: transmissionUrl }),
      ...(color_name && { color: color_name }),
      ...(km != null && {
        mileageFromOdometer: {
          '@type': 'QuantitativeValue',
          value: String(km),
          unitCode: 'KMT',
        },
      }),
      itemCondition: itemConditionUrl,
      ...(this.car_id != null && { sku: String(this.car_id) }),
      ...(mainEntityOfPage && { mainEntityOfPage }),
      offers,
    };

    return jsonLd;
  }

  async generateSEO() {
    const baseSEO = await super.generateSEO();
    const jsonLd = await this.generateJsonLd();
    return { ...baseSEO, jsonLd };
  }

  async generateOpenGraph() {
    const baseOG = await super.generateOpenGraph();
    const title = await this.generateMetaTitle();
    const description = await this.generateMetaDescription();
    const image = await this.generateOpenGraphImage();
    const url = await this.generateCanonical();

    return {
      ...baseOG,
      title,
      description,
      url,
      images: image
        ? [
            {
              url: image,
              width: 1200,
              height: 675,
              alt: title,
            },
          ]
        : undefined,
    };
  }
}
