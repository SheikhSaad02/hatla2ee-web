import { getTranslations } from 'next-intl/server';
import { generateHreflangAlternates } from '@/utils/general';
import { INDEXABLE_ROBOTS_TAG } from '@/constants';

export class BaseSEOStrategy {
  constructor(params = {}) {
    this.language = params.language || 'en';
    this.data = params.data || {};
    this.config = params.config || {};
    this.translations = {};
    this.initialized = false;
  }

  async initialize() {
    if (this.initialized) return;
    await this.loadTranslations();
    this.setupDataProperties();
    this.initialized = true;
  }

  async loadTranslations(namespaces = ['metadata']) {
    const toLoad = namespaces?.filter((ns) => !this.translations[ns]);
    if (toLoad.length === 0) return;

    const translations = await Promise.all(
      toLoad.map(async (namespace) => {
        const t = await getTranslations({
          locale: this.language,
          namespace,
        });
        return { namespace, t };
      }),
    );

    this.translations = {
      ...this.translations,
      ...translations.reduce((acc, { namespace, t }) => {
        acc[namespace] = t;
        return acc;
      }, {}),
    };
  }

  async getTranslation(namespace = 'metadata') {
    if (!this.translations[namespace]) {
      await this.loadTranslations([namespace]);
    }
    return this.translations[namespace];
  }

  setupDataProperties() {}

  async generateMetaTitle() {
    throw new Error('generateMetaTitle() must be implemented by subclass');
  }

  async generateH1() {
    throw new Error('generateH1() must be implemented by subclass');
  }

  async generateMetaDescription() {
    throw new Error(
      'generateMetaDescription() must be implemented by subclass',
    );
  }

  async generatePageDescription(description, page) {
    const pageNum = Number(page);

    if (!description || !pageNum || pageNum <= 1) {
      return description || '';
    }

    const t = await getTranslations({
      locale: this.language,
      namespace: 'metadata',
    });

    return `${description} – ${t('Page')} ${pageNum}`;
  }

  async generateBreadcrumbs() {
    throw new Error('generateBreadcrumbs() must be implemented by subclass');
  }

  async generateCanonical() {
    return null;
  }

  getIndexableRobotsTag() {
    return INDEXABLE_ROBOTS_TAG;
  }

  async generateRobotsTag() {
    return this.getIndexableRobotsTag();
  }

  async generateOpenGraph() {
    const title = await this.generateMetaTitle();
    const description = await this.generateMetaDescription();

    return {
      title,
      description,
      type: 'website',
      locale: this.language,
      siteName: 'Hatla2ee',
    };
  }

  async generateTwitterCard() {
    const title = await this.generateMetaTitle();
    const description = await this.generateMetaDescription();
    return { card: 'summary_large_image', title, description };
  }

  async generateLanguages() {
    return generateHreflangAlternates();
  }

  async generateSEO() {
    await this.initialize();

    const [
      metaTitle,
      h1,
      metaDescription,
      breadcrumbs,
      robotsTag,
      canonical,
      openGraph,
      twitterCard,
      languages,
    ] = await Promise.all([
      this.generateMetaTitle(),
      this.generateH1(),
      this.generateMetaDescription(),
      this.generateBreadcrumbs(),
      this.generateRobotsTag(),
      this.generateCanonical(),
      this.generateOpenGraph(),
      this.generateTwitterCard(),
      this.generateLanguages(),
    ]);

    return {
      metaTitle,
      h1,
      metaDescription,
      breadcrumbs,
      robotsTag,
      canonical,
      openGraph,
      twitterCard,
      languages,
    };
  }

  isEnglish() {
    return this.language === 'en';
  }

  isArabic() {
    return this.language === 'ar';
  }

  getLocaleString(data, field, fallback = '') {
    if (!data) return fallback;

    if (this.isEnglish()) {
      return data[field]?.en || data[field] || fallback;
    } else {
      return data[field]?.ar || data[`${field}_l1`] || fallback;
    }
  }

  formatNumber(number, options = {}) {
    return new Intl.NumberFormat(this.language, options).format(number);
  }

  formatCurrency(amount, currency = 'EGP') {
    return new Intl.NumberFormat(this.language, {
      style: 'currency',
      currency,
    }).format(amount);
  }

  validateRequiredData(requiredFields) {
    const missing = requiredFields?.filter((field) => !this.data[field]);
    if (missing.length > 0) {
      console.warn(`Missing required data fields: ${missing.join(', ')}`);
    }
  }

  safeGet(obj, path, fallback = '') {
    return path.split('.').reduce((current, key) => {
      return current && current[key] !== undefined ? current[key] : fallback;
    }, obj);
  }
}
