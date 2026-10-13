import { BaseSEOStrategy } from './baseSeoStrategyClass';
import { appPaths, appSections, BASE_URL } from '@/constants';
import { getAsset } from '@/utils/general';
import { isSectionEnabled } from '@/configs';

export class BuyCreditsPageSEO extends BaseSEOStrategy {
  async loadTranslations() {
    await super.loadTranslations(['buyCredits']);
  }

  async generateMetaTitle() {
    const t = await this.getTranslation('buyCredits');
    return t('seo.title');
  }

  async generateMetaDescription() {
    const t = await this.getTranslation('buyCredits');
    return t('seo.description');
  }

  async generateH1() {
    const t = await this.getTranslation('buyCredits');
    return t('seo.h1');
  }

  async generateBreadcrumbs() {
    const t = await this.getTranslation('buyCredits');
    return [{ label: t('seo.h1'), href: appPaths.buyCredits }];
  }

  async generateCanonical() {
    const { generateDefaultCanonical } = await import('@/utils/general');
    const canonical = await generateDefaultCanonical();
    if (canonical) return canonical;
    return `${BASE_URL}/${this.language}${appPaths.buyCredits}`;
  }

  async generateOpenGraph() {
    const baseOG = await super.generateOpenGraph();
    const t = await this.getTranslation('buyCredits');
    const ogImage = getAsset(
      this.isArabic()
        ? '/assets/buy-credits/og-buy-credits-ar.webp'
        : '/assets/buy-credits/og-buy-credits-en.webp',
    );

    return {
      ...baseOG,
      title: t('seo.ogTitle'),
      description: t('seo.ogDescription'),
      url: await this.generateCanonical(),
      images: [{ url: ogImage, width: 1200, height: 630 }],
    };
  }

  async generateRobotsTag() {
    return isSectionEnabled(appSections.BUY_CREDITS)
      ? this.getIndexableRobotsTag()
      : { index: false, follow: false };
  }

  async generateJsonLd() {
    const t = await this.getTranslation('buyCredits');
    const items = [1, 2, 3, 4, 5, 6, 7].map((n) => ({
      question: t(`faq.q${n}`),
      answer: t(`faq.a${n}`),
    }));

    return {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: items.map(({ question, answer }) => ({
        '@type': 'Question',
        name: question,
        acceptedAnswer: { '@type': 'Answer', text: answer },
      })),
    };
  }

  async generateSEO() {
    const baseSEO = await super.generateSEO();
    const jsonLd = await this.generateJsonLd();
    return { ...baseSEO, jsonLd };
  }
}

export async function getBuyCreditsSeo(locale) {
  const seo = new BuyCreditsPageSEO({ language: locale });
  return seo.generateSEO();
}
