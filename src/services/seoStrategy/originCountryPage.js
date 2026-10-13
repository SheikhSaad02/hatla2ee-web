import { BaseSEOStrategy } from './baseSeoStrategyClass';
import { appPaths, BASE_URL } from '@/constants';
import { capitalizeFirstLetter, getAsset } from '@/utils/general';
import { getTranslations } from 'next-intl/server';
export class OriginCountrySEOStrategy extends BaseSEOStrategy {
  constructor(params) {
    super(params);
    this.country = params.country;
    this.vehicleType = params.vehicleType || 'Vehicle';
    this.category = params.category;
    this.loadTranslations();
  }
  loadTranslations() {
    this.newCarSeoT = getTranslations({
      locale: this.language,
      namespace: 'newVehicleListingsSeo',
    });
    this.newCarT = getTranslations({
      locale: this.language,
      namespace: 'newCar',
    });
  }
  async generateMetaTitle() {
    const t = await this.newCarSeoT;
    return t('vehicle_origin', {
      vehicle: t(this?.vehicleType),
      country: this?.country,
    });
  }

  async generateH1() {
    const t = await this.newCarSeoT;

    return t('vehicle_origin', {
      vehicle: t(this?.vehicleType),
      country: this?.country,
    });
  }
  async generateMetaDescription() {
    return '';
  }

  async generateBreadcrumbs() {
    const t = await this.newCarSeoT;
    return [
      {
        href: appPaths[`new-${this.category?.toLowerCase()}`],
        label: t(`new_car`, {
          category: t(this.category),
        }),
      },
    ];
  }
  async generateOpenGraphImage() {
    return getAsset(`/assets/og-images/new-cars-${this.language}.webp`);
  }
}
