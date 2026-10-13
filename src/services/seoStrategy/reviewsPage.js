import configs from '@/configs';
import { BaseSEOStrategy } from './baseSeoStrategyClass';
import { appPaths } from '@/constants';
import { getTranslations } from 'next-intl/server';
import { getAsset } from '@/utils/general';

export class ReviewsPageSEO extends BaseSEOStrategy {
  constructor(params) {
    super(params);
    this.make = params?.make;
    this.model = params?.model;
    this.yearFrom = params?.yearFrom;
    this.yearTo = params?.yearTo;
    this.reviewsOgImage = params?.reviewsOgImage;
    this.reviewsData = params?.reviewsData;
    this.page = params?.page;
    this.initializeParams();
    this.loadTranslations();
  }

  initializeParams() {}

  loadTranslations() {
    this.reviewsT = getTranslations({
      locale: this.language,
      namespace: 'reviewsSeo',
    });
  }

  async generateMetaTitle() {
    const t = await this.reviewsT;

    if (this.make && this.model) {
      const yearRange =
        this.yearFrom && this.yearTo
          ? ` ${this.yearFrom} - ${this.yearTo}`
          : '';

      const makeLabel = this.isEnglish()
        ? this.make?.label
        : this.make?.label_l1;
      const modelLabel = this.isEnglish()
        ? this.model?.label
        : this.model?.label_l1;

      return t('meta_title_detail', {
        make: makeLabel,
        model: modelLabel,
        yearRange: yearRange,
      });
    }

    if (this.make) {
      const makeLabel = this.isEnglish()
        ? this.make?.label
        : this.make?.label_l1;
      return t('meta_title_make', {
        make: makeLabel,
        country: configs.country[this.language].label,
      });
    }

    return t('meta_title_landing', {
      country: configs.country[this.language].label,
    });
  }

  async generateMetaDescription() {
    return this.generatePageDescription(
      await this.resolveMetaDescription(),
      this.page,
    );
  }

  async resolveMetaDescription() {
    const t = await this.reviewsT;

    if (this.make && this.model) {
      const makeLabel = this.isEnglish()
        ? this.make?.label
        : this.make?.label_l1;
      const modelLabel = this.isEnglish()
        ? this.model?.label
        : this.model?.label_l1;

      return t('meta_description_detail', {
        make: makeLabel,
        model: modelLabel,
      });
    }

    if (this.make) {
      const makeLabel = this.isEnglish()
        ? this.make?.label
        : this.make?.label_l1;

      return t('meta_description_make', {
        make: makeLabel,
      });
    }

    return t('meta_description_landing');
  }

  async generateH1() {
    const t = await this.reviewsT;

    if (this.make && this.model) {
      const yearRange =
        this.yearFrom && this.yearTo
          ? ` ${this.yearFrom} - ${this.yearTo}`
          : '';

      const makeLabel = this.isEnglish()
        ? this.make?.label
        : this.make?.label_l1;
      const modelLabel = this.isEnglish()
        ? this.model?.label
        : this.model?.label_l1;

      return t('h1_detail', {
        make: makeLabel,
        model: modelLabel,
        yearRange: yearRange,
      });
    }

    if (this.make) {
      const makeLabel = this.isEnglish()
        ? this.make?.label
        : this.make?.label_l1;
      return t('h1_make', {
        make: makeLabel,
        country: configs.country[this.language].label,
      });
    }

    return t('h1_landing', {
      country: configs.country[this.language].label,
    });
  }

  async generateBreadcrumbs() {
    const t = await this.reviewsT;
    const breadcrumbs = [];

    if (this.make && this.model) {
      breadcrumbs.push({
        label: t('breadcrumb_car_reviews'),
        href: `${appPaths.review}`,
      });
      return breadcrumbs;
    }

    if (this.make) {
      breadcrumbs.push({
        label: t('breadcrumb_car_reviews_egypt', {
          country: configs.country[this.language].label,
        }),
        href: `${appPaths.review}`,
      });
      return breadcrumbs;
    }

    return [];
  }

  async generateOpenGraphImage() {
    // Use car-reviews OG image based on language
    const languageSuffix = this.language === 'ar' ? 'ar' : 'en';

    //if reviews detail page then  retuen first image from reviews detail data
    if (this.make && this.model && this.yearFrom && this.yearTo) {
      return (
        this.reviewsOgImage ||
        getAsset(`/assets/og-images/car-reviews-${this.language}.webp`)
      );
    }

    return getAsset(`/assets/og-images/car-reviews-${this.language}.webp`);
  }

  async generateOpenGraph() {
    const baseOG = await super.generateOpenGraph();
    const title = await this.generateMetaTitle();
    const description = await this.generateMetaDescription();
    const image = await this.generateOpenGraphImage();

    return {
      ...baseOG,
      title,
      description,
      images: image
        ? [
            {
              url: image,
              width: 1200,
              height: 630,
              alt: title,
            },
          ]
        : undefined,
    };
  }

  async shouldIndex() {
    const reviewsCount = this.reviewsData?.length || 0;
    return reviewsCount >= 3;
  }

  async getRobotsTag() {
    const shouldIndex = await this.shouldIndex();
    if (!shouldIndex) {
      return {
        index: false,
        follow: true,
      };
    }

    return this.getIndexableRobotsTag();
  }

  async generateRobotsTag() {
    return this.getRobotsTag();
  }
}
