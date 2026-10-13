import { getTranslations } from 'next-intl/server';
import { BaseSEOStrategy } from './baseSeoStrategyClass';
import { appPaths, BASE_URL } from '@/constants';
import configs from '@/configs';
import { getAsset, removeDoubleQuotes } from '@/utils/general';
import { newVehiclesCategorySlugs } from '@/constants';
export class NewVehiclePage extends BaseSEOStrategy {
  constructor(params) {
    super(params);
    this.listingDetailData = params.listingDetailData || {};
    this.isModelLevel = params.modelLevelDetail || false;
    this.initializeCarProperties();
    this.loadTranslations();
  }

  initializeCarProperties() {
    const { listingDetailData } = this;
    this.car_id = listingDetailData?.id;
    this.data = listingDetailData || {};
    this.vehicleType = listingDetailData?.listing_category?.name || 'Car';
    this.vehicleType_l1 =
      listingDetailData?.listing_category?.name_l1 || 'سيارة';
    this.vehicleTypeSlug = `new-${
      listingDetailData?.listing_category?.slug || 'car'
    }`;
    this.year = listingDetailData?.launch_year || this.data?.year;
    this.country = configs.country?.[this.language]?.label || '';
    this.categorySlug = listingDetailData?.listing_category?.slug || 'car';
    this.seoString =
      newVehiclesCategorySlugs.newCars === this.categorySlug
        ? 'car'
        : 'general';
  }

  loadTranslations() {
    this.newVehicleT = getTranslations({
      locale: this.language,
      namespace: 'newVehicleListingsSeo',
    });
  }

  async getLocalizedStrings() {
    if (this.localizedStrings) return this.localizedStrings;
    const { getLocaleStringServer } = await import('@/utils/serverFunctions');

    this.localizedStrings = {
      brand_name: await getLocaleStringServer(this.data?.make, 'label'),
      model_name: await getLocaleStringServer(this.data?.model, 'label'),
      variant_name: await getLocaleStringServer(this.data?.variant, 'label'),
      shape_name: await getLocaleStringServer(this.data?.shape, 'label'),
    };

    return this.localizedStrings;
  }

  async generateMetaTitle() {
    const t = await this.newVehicleT;
    const strings = await this.getLocalizedStrings();
    const { brand_name, model_name, variant_name, shape_name } = strings;

    if (this.isModelLevel) {
      // Include shape in model name if it exists
      const modelNameWithShape = shape_name
        ? `${model_name} ${shape_name}`
        : model_name;
      return t(`meta_titles.model_level_${this.seoString}`, {
        brandName: brand_name,
        modelName: modelNameWithShape,
        country: this.country,
      });
    } else {
      return t(`meta_titles.variant_level_${this.seoString}`, {
        brandName: brand_name || '',
        modelName: model_name || '',
        variantName: variant_name,
        year: this.year || '',
        country: this.country,
      });
    }
  }

  async generateH1() {
    const t = await this.newVehicleT;
    const strings = await this.getLocalizedStrings();
    const { brand_name, model_name, variant_name, shape_name } = strings;

    if (this.isModelLevel) {
      // Include shape in model name if it exists
      const modelNameWithShape = shape_name
        ? `${model_name} ${shape_name}`
        : model_name;

      return t(`model_level_h1_${this.seoString}`, {
        brandName: brand_name,
        modelName: modelNameWithShape,
        country: this.country,
      });
    } else {
      return t(`variant_level_h1_${this.seoString}`, {
        brandName: brand_name || '',
        modelName: model_name || '',
        variantName: variant_name,
        year: this.year || '',
      });
    }
  }

  async generateMetaDescription() {
    const t = await this.newVehicleT;
    const strings = await this.getLocalizedStrings();
    const { brand_name, model_name, variant_name } = strings;
    const vehicleTypeLower = t(this.categorySlug).toLowerCase();
    if (!this.isModelLevel) {
      return t(`meta_descriptions.variant_level_${this.seoString}`, {
        brandName: brand_name || '',
        modelName: model_name || '',
        variantName: variant_name,
        country: this.country,
        vehicleTypeLower,
      });
    }

    return t(`meta_descriptions.model_level_${this.seoString}`, {
      brandName: brand_name,
      modelName: model_name,
      country: this.country,
      yearString:
        this.seoString === 'car'
          ? ''
          : (
              this.listingDetailData?.years || (this.year ? [this.year] : [])
            ).join(' , '),
    });
  }

  async generateBreadcrumbs() {
    const t = await this.newVehicleT;
    const strings = await this.getLocalizedStrings();
    const { brand_name, model_name, shape_name } = strings;
    const breadcrumbs = [];

    // First breadcrumb - New Vehicle
    breadcrumbs.push({
      label: t('breadcrumbs.new_vehicle', {
        vehicleType: this.isEnglish() ? this.vehicleType : this.vehicleType_l1,
      }),
      href: appPaths[`${this.vehicleTypeSlug}`],
    });

    // Second breadcrumb - Brand
    if (brand_name) {
      const vehicleTypeForBrand =
        newVehiclesCategorySlugs.newCars !== this.categorySlug
          ? this.isEnglish()
            ? this.vehicleType
            : this.vehicleType_l1
          : '';

      if (vehicleTypeForBrand) {
        breadcrumbs.push({
          label: t('breadcrumbs.brand_new', {
            brandName: brand_name,
            vehicleType: vehicleTypeForBrand,
          }),
          href: `${appPaths[`${this.vehicleTypeSlug}`]}/${
            this.data?.make?.slug
          }`,
        });
      } else {
        breadcrumbs.push({
          label: t('breadcrumbs.brand_new_no_vehicle', {
            brandName: brand_name,
          }),
          href: `${appPaths[`${this.vehicleTypeSlug}`]}/${
            this.data?.make?.slug
          }`,
        });
      }
    }

    // Third breadcrumb - Model (only if not model level)
    if (!this.isModelLevel && brand_name && model_name) {
      // Include shape in model name if it exists
      const modelNameWithShape = shape_name
        ? `${model_name} ${shape_name}`
        : model_name;

      // Build model slug with shape if it exists
      let modelSlug = this.data?.model?.slug;
      if (this.data?.shape?.slug) {
        modelSlug = `${this.data?.model?.slug}-shape-${this.data?.shape?.slug}`;
      }

      breadcrumbs.push({
        label: t('breadcrumbs.brand_model_new', {
          brandName: brand_name,
          modelName: modelNameWithShape,
        }),
        href: `${appPaths[`${this.vehicleTypeSlug}`]}/${
          this.data?.make?.slug
        }/${modelSlug}`,
      });
    }

    return breadcrumbs;
  }

  async generateCanonical() {
    if (this.isModelLevel) {
      return `${removeDoubleQuotes(BASE_URL)}/${this.language}/${
        this.vehicleTypeSlug
      }/${this.data?.make?.slug}/${this.data?.model?.slug}`;
    }
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
