import { BaseSEOStrategy } from './baseSeoStrategyClass';
import { appPaths } from '@/constants';
import { capitalizeFirstLetter } from '@/utils/general';
import { getTranslations } from 'next-intl/server';

export class AssembledPageSEOStrategy extends BaseSEOStrategy {
  constructor(params) {
    super(params);
    this.country = params.country;
    this.vehicleType = params.vehicleType || 'Vehicle';
    this.category = params.category;
    this.loadTranslations();
  }

  loadTranslations() {
    this.metadataT = getTranslations({
      locale: this.language,
      namespace: 'metadata',
    });
    this.newCarT = getTranslations({
      locale: this.language,
      namespace: 'newVehicleListingsSeo',
    });
  }

  async generateMetaTitle(page = null) {
    const t = await this.metadataT;
    const newCarT = await this.newCarT;
    const baseTitle = t('New {vehicleType} Assembled in {country}', {
      vehicleType: newCarT(this?.vehicleType),
      country: this?.country,
    });

    return {
      absolute: `${baseTitle} : ${t('Hatla2ee')}${
        page && page > 1 ? ` - ${t('Page')} ${page}` : ''
      }`,
    };
  }

  async generateH1() {
    const t = await this.metadataT;
    const newCarT = await this.newCarT;

    return t('New {vehicleType} Assembled in {country}', {
      vehicleType: newCarT(this?.vehicleType),
      country: this?.country,
    });
  }

  async generateMetaDescription() {
    return '';
  }

  async generateBreadcrumbs() {
    const t = await this.newCarT;
    return [
      {
        href: appPaths[`new-${this.category?.toLowerCase()}`],
        label: t(`new_car`, {
          category: t(this.category),
        }),
      },
    ];
  }
}
