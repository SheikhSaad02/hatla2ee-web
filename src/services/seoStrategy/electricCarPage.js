import { BaseSEOStrategy } from './baseSeoStrategyClass';
import { appPaths, BASE_URL } from '@/constants';
import { getEvFaqItems } from '@/components/evLanding/data';

export class ElectricCarPageSEO extends BaseSEOStrategy {
  constructor(params = {}) {
    super(params);
    this.absoluteTitle = params.absoluteTitle || false;
  }

  async loadTranslations() {
    await super.loadTranslations(['evLanding']);
  }

  async generateMetaTitle() {
    const t = await this.getTranslation('evLanding');
    const title = t('metaTitle');
    return this.absoluteTitle ? { absolute: title } : title;
  }

  async generateMetaDescription() {
    const t = await this.getTranslation('evLanding');
    return t('metaDescription');
  }

  async generateH1() {
    const t = await this.getTranslation('evLanding');
    return t('heroHeading');
  }

  async generateBreadcrumbs() {
    const t = await this.getTranslation('evLanding');
    return [{ label: t('heroHeading'), href: appPaths.electricCars }];
  }

  async generateCanonical() {
    const { generateDefaultCanonical } = await import('@/utils/general');
    const canonical = await generateDefaultCanonical();
    if (canonical) return canonical;
    return `${BASE_URL}/${this.language}${appPaths.electricCars}`;
  }

  async generateOpenGraph() {
    const baseOG = await super.generateOpenGraph();
    return {
      ...baseOG,
      title: await this.generateMetaTitle(),
      description: await this.generateMetaDescription(),
      url: await this.generateCanonical(),
    };
  }

  async generateJsonLd() {
    const { items } = await getEvFaqItems(this.language);
    return {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: items.map(({ trigger, content }) => ({
        '@type': 'Question',
        name: trigger,
        acceptedAnswer: { '@type': 'Answer', text: content },
      })),
    };
  }

  async generateSEO() {
    const baseSEO = await super.generateSEO();
    const jsonLd = await this.generateJsonLd();
    return { ...baseSEO, jsonLd };
  }
}

export async function getElectricCarSeo(locale, { absoluteTitle = false } = {}) {
  const seo = new ElectricCarPageSEO({ language: locale, absoluteTitle });
  return seo.generateSEO();
}
