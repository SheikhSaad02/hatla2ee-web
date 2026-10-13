import { getCarMaintenanceFaqItems } from '@/components/car-maintenance/data';
import { BaseSEOStrategy } from './baseSeoStrategyClass';
import { appPaths, BASE_URL } from '@/constants';

const PAGE_TYPES = {
  LANDING: 'landing',
  MY_GARAGE: 'my-garage',
  MAINTENANCE_SERVICES: 'maintenance-services',
};

export class CarMaintenancePageSEO extends BaseSEOStrategy {
  constructor(params = {}) {
    super(params);
    this.pageType = params.pageType ?? PAGE_TYPES.LANDING;
    this.absoluteTitle = params.absoluteTitle || false;
  }

  async loadTranslations() {
    await super.loadTranslations(['carMaintenance']);
  }

  async generateMetaTitle() {
    const t = await this.getTranslation('carMaintenance');
    const title = t('meta_title_landing');
    return this.absoluteTitle ? { absolute: title } : title;
  }

  async generateMetaDescription() {
    const t = await this.getTranslation('carMaintenance');
    return t('meta_description_landing');
  }

  async generateH1() {
    const t = await this.getTranslation('carMaintenance');
    return t('h1_landing');
  }

  async generateBreadcrumbs() {
    const t = await this.getTranslation('carMaintenance');

    const root = {
      label: t('my_maintenance'),
      href: appPaths.carMaintenance,
    };

    switch (this.pageType) {
      case PAGE_TYPES.MY_GARAGE:
        return [root, { label: t('my_garage_title') }];
      case PAGE_TYPES.MAINTENANCE_SERVICES:
        return [
          root,
          {
            label: t('my_garage_title'),
            href: appPaths.carMaintenanceMyGarage,
          },
          { label: t('car_service_details_title') },
        ];
      default:
        return [root];
    }
  }

  async generateCanonical() {
    const { generateDefaultCanonical } = await import('@/utils/general');
    const canonical = await generateDefaultCanonical();

    if (canonical) return canonical;

    return `${BASE_URL}/${this.language}${appPaths.carMaintenance}`;
  }

  async generateOpenGraph() {
    const baseOG = await super.generateOpenGraph();
    const title = await this.generateMetaTitle();
    const description = await this.generateMetaDescription();

    return {
      ...baseOG,
      title,
      description,
      url: await this.generateCanonical(),
    };
  }

  async generateJsonLd() {
    if (this.pageType !== PAGE_TYPES.LANDING) return null;

    const { items } = await getCarMaintenanceFaqItems(this.language);

    return {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: items.map(({ trigger, content }) => ({
        '@type': 'Question',
        name: trigger,
        acceptedAnswer: {
          '@type': 'Answer',
          text: content,
        },
      })),
    };
  }

  async generateSEO() {
    const baseSEO = await super.generateSEO();

    if (this.pageType !== PAGE_TYPES.LANDING) {
      return baseSEO;
    }

    const jsonLd = await this.generateJsonLd();
    return { ...baseSEO, jsonLd };
  }
}

export async function getCarMaintenanceSeo(
  locale,
  { pageType = PAGE_TYPES.LANDING, absoluteTitle = false } = {},
) {
  const carMaintenanceSEO = new CarMaintenancePageSEO({
    language: locale,
    pageType,
    absoluteTitle,
  });

  return carMaintenanceSEO.generateSEO();
}

export { PAGE_TYPES as CAR_MAINTENANCE_PAGE_TYPES };
