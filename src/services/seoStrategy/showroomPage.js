import { BaseSEOStrategy } from './baseSeoStrategyClass';
import { getTranslations } from 'next-intl/server';
import configs from '@/configs';
const TITLE_KEY_MAP = {
  new: 'Find New Cars Showrooms in Egypt',
  authorized: 'Authorized Car Dealers in Egypt',
  used: 'Find Used Cars Showrooms in Egypt',
  ev: 'Find Electric Car Showrooms in Egypt',
};
const DESCRIPTION_KEY_MAP = {
  used: 'usedShowroomDescription',
  new: 'newShowroomDescription',
  authorized: 'authorizedDealersDescription',
  ev: 'evShowroomDescription',
};
export class ShowroomSEOStrategy extends BaseSEOStrategy {
  constructor(params) {
    super(params);
    this.page = params.page;
    this.absoluteTitle = params.absoluteTitle || false;
    this.titleKey = params.titleKey;
    this.isDetailPage = params.isDetailPage || false;
    this.listingDetailData = params.listingDetailData || {};
    this.make = params.make;
    this.makeLabel = params.makeLabel;
    this.condition = params.condition;
    this.country = configs.country[this.language].label;
    this.loadTranslations();
  }
  loadTranslations() {
    this.showroomT = getTranslations({
      locale: this.language,
      namespace: 'metadata',
    });
  }

  async generateMetaTitle() {
    const t = await this.showroomT;

    // Handle detail page case
    if (this.isDetailPage) {
      const showroomName = this.getLocaleString(this.listingDetailData, 'name');
      if (this.makeLabel) {
        return t('showroomDetailByMakeTitle', {
          showroomName,
          make: this.makeLabel,
        });
      }
      if (this.condition) {
        return t('showroomDetailByConditionTitle', {
          showroomName,
          country: this.country,
        });
      }
      return t('showroomDetailTitle', { showroomName });
    }
    const title = TITLE_KEY_MAP[this.titleKey];
    let absoluteTitle = `${t(title)} | ${t('Hatla2eeCountry', { country: this.country })}`;

    if (this.page && this.page > 1) {
      absoluteTitle = `${absoluteTitle} - ${t('Page')} ${this.page}`;
    }

    return this.absoluteTitle ? { absolute: absoluteTitle } : title;
  }

  async generateH1() {
    return '';
  }
  async generateMetaDescription() {
    return this.generatePageDescription(
      await this.resolveMetaDescription(),
      this.page,
    );
  }

  async resolveMetaDescription() {
    // Handle detail page case
    if (this.isDetailPage) {
      const t = await this.showroomT;
      const showroomName = this.getLocaleString(this.listingDetailData, 'name');
      if (this.makeLabel) {
        return t('showroomDetailByMakeDescription', {
          showroomName,
          make: this.makeLabel,
        });
      }
      if (this.condition) {
        return t('showroomDetailByConditionDescription');
      }
      return t('showroomDetailDescription', { showroomName });
    }

    const descriptionKey = DESCRIPTION_KEY_MAP[this.titleKey];
    if (descriptionKey) {
      const t = await this.showroomT;
      return t(descriptionKey);
    }

    return '';
  }
  async generateBreadcrumbs() {
    return '';
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
    // Handle detail page case - if make parameter exists, don't index
    if (this.isDetailPage && this.make) {
      return {
        index: false,
        follow: true,
      };
    }
    return this.getIndexableRobotsTag();
  }
}
