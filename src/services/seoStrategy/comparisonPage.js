import { appPaths, BASE_URL, vehicleSlugLabel } from '@/constants';
import { BaseSEOStrategy } from './baseSeoStrategyClass';
import { generatePageTitle } from '@/utils/serverFunctions';
import { getAsset, getLocaleString } from '@/utils/general';
import { getTranslations } from 'next-intl/server';
import configs from '@/configs';

export class ComparisonPageSEOStrategy extends BaseSEOStrategy {
  constructor(params = {}) {
    super(params);

    this.language = params.language || 'en';
    this.page = params.page;
    this.vehicle = params.vehicle;
    this.id = params.id;
    this.listings = params.listings;
    this.cars = params.cars || (this.listings ? Object.values(this.listings) : []);
  }

  async getCarsTitle(cars, locale, separator = ' - ') {
    const t = await getTranslations('carComparisonSeo');
    if (cars?.length === 4) {
      separator = ` ${t('vs')} `;
    }
    return cars
      ?.map(
        (car) =>
          `${getLocaleString(car?.make, 'label', locale)} ${getLocaleString(
            car?.model,
            'label',
            locale,
          )}`,
      )
      .join(separator);
  }

  async generateLandingPageSEO() {
    const t = await getTranslations('carComparisonSeo');
    const country = configs.country[this.language].label;
    return {
      title: {
        absolute: await generatePageTitle(
          t('compareLandingPageTitle', { country }),
          this.page,
        ),
      },
      description: await this.generatePageDescription(
        t('compareLandingPageDescription', { country }),
        this.page,
      ),
      canonical: await this.generateCanonical(),
      openGraph: await this.generateOpenGraph(),
      languages: await this.generateLanguages(),
    };
  }

  async generateH1Title() {
    const t = await getTranslations('carComparisonSeo');
    const carsTitle = await this.getCarsTitle(
      this.cars,
      this.language,
      ` ${t('vs')} `,
    );
    return `${t('h1_compare')} ${carsTitle}`;
  }

  async generateDetailPageSEO() {
    const t = await getTranslations('carComparisonSeo');
    const carsTitle = await this.getCarsTitle(this.cars, this.language, ` ${t('vs')} `);
    
    return {
      title: t('compareDetailTitle', { carsTitle }),
      description: t('compareDetailDescription', { carsTitle }),
      h1: await this.generateH1Title(),
      breadcrumbs: [
        {
          label: t('Popular Side-by-Side New Car Comparisons', {
            vehicle: t(vehicleSlugLabel[this.vehicle]),
          }),
          href: appPaths.newCarCompare,
        },
      ],
      canonical: await this.generateCanonical(),
      languages: await this.generateLanguages(),
    };
  }

  async generateCanonical() {
    const { generateDefaultCanonical } = await import('@/utils/general');
    const canonical = await generateDefaultCanonical();
    if (canonical) return canonical;
    const basePath = `/${this.language}${appPaths.newCarCompare}`;
    return `${BASE_URL}${basePath}`;
  }
  async generateOpenGraphImage() {
    const languageSuffix = this.language === 'ar' ? 'ar' : 'en';
    return getAsset(`/assets/og-images/car-comparison-${languageSuffix}.webp`);
  }

  async generateOpenGraph() {
    const image = await this.generateOpenGraphImage();
    const url = await this.generateCanonical();

    return {
      url,
      images: image
        ? [
            {
              url: image,
              width: 1200,
              height: 630,
            },
          ]
        : undefined,
    };
  }
}
