import { BaseSEOStrategy } from './baseSeoStrategyClass';
import { appPaths, BASE_URL } from '@/constants';
import configs from '@/configs';

export class MaintenanceCenterPageStrategy extends BaseSEOStrategy {
  constructor(params) {
    super(params);
    this.pageType = params.pageType;
    this.requiredFields = this.getRequiredFields();
    this.setupDataProperties();
    this.absoluteTitle = params.absoluteTitle || false;
  }

  getRequiredFields() {
    const baseFields = [];

    return [...baseFields, ...Object.keys(this.data)];
  }

  setupDataProperties() {
    // Validate required data
    this.validateRequiredData(this.requiredFields);

    this.locationSlug = this.data.locationSlug;
    this.locationLabel = this.data.locationLabel;
    this.locationsArray = this.data.locationsArray;
    this.makeData = this.data.makeData;
    this.maintenanceCenterName = this.data.maintenanceCenterName;
  }

  async loadTranslations() {
    await super.loadTranslations(['metadata']);
  }

  processLocations(locations) {
    if (!locations || !Array.isArray(locations)) return [];

    let filtered = locations.filter((location) => location.level > 1);
    if (filtered.length > 1) {
      filtered = filtered.slice(0, -1);
      return filtered.map((location) => ({
        label: this.getLocaleString(location, 'title'),
        href: this.generateLocationHref(location),
      }));
    }
    return [];
  }

  generateLocationHref(location) {
    if (!location?.slug) return '#';

    if (this.makeData) {
      return `${appPaths.maintenanceCenter}/city/${location.slug}/brand/${this.makeData.slug}`;
    }

    return `${appPaths.maintenanceCenter}/city/${location.slug}`;
  }

  async buildMetaTitle() {
    const t = await this.getTranslation('metadata');

    switch (this.pageType) {
      case 'listings':
        return t('maintenanceCenterDetailPageTitle');

      case 'city':
        return t('cityPageTitle', {
          locationSlug: this.locationLabel,
          country: configs.country[this.language].label,
        });

      case 'detail':
        return t('detailPageTitle', {
          maintenanceCenterName: this.maintenanceCenterName,
        });

      case 'brand':
        return t('brandPageTitle', { makeData: this.makeData });

      case 'cityAndBrand':
        return t('cityAndBrandPageTitle', {
          makeData: this.makeData,
          locationLabel: this.locationLabel,
        });

      default:
        return t('maintenanceCenterDetailPageTitle');
    }
  }
  async generateMetaTitle() {
    const title = await this.buildMetaTitle();
    const t = await this.getTranslation('metadata');

    // Add page information if page parameter exists
    if (this.data.page && parseInt(this.data.page) > 1) {
      const pageInfo = ` - ${t('Page')} ${this.data.page}`;
      const finalTitle = title + pageInfo;

      return this.absoluteTitle ? { absolute: finalTitle } : finalTitle;
    }

    return this.absoluteTitle ? { absolute: title } : title;
  }
  async generateH1() {
    const t = await this.getTranslation('metadata');

    switch (this.pageType) {
      case 'listings':
        return t('maintenanceCenterListingsH1');

      case 'city':
        return t('cityMaintenanceH1', { location: this.locationLabel });

      case 'detail':
        return t('maintenanceCenterDetailH1', {
          name: this.maintenanceCenterName,
          location: this.locationLabel,
        });

      case 'brand':
        return t('brandMaintenanceH1', {
          brand: this.getLocaleString(this.makeData, 'label'),
        });

      case 'cityAndBrand':
        return t('cityBrandMaintenanceH1', {
          brand: this.getLocaleString(this.makeData, 'label'),
          location: this.locationLabel,
        });

      default:
        return t('maintenanceCenterListingsH1');
    }
  }

  async generateMetaDescription() {
    return this.generatePageDescription(
      await this.resolveMetaDescription(),
      this.data?.page,
    );
  }

  async resolveMetaDescription() {
    const t = await this.getTranslation('metadata');
    switch (this.pageType) {
      case 'listings':
        return t('maintenanceCenterListingsDescription');
      case 'city':
        return t('cityMaintenanceDescription', {
          locationSlug: this.locationLabel,
        });
      case 'brand':
        return t('brandMaintenanceDescription', {
          makeData: this.makeData,
        });
      case 'cityAndBrand':
        return t('cityAndBrandDescription', {
          makeData: this.makeData,
          locationLabel: this.locationLabel,
        });
      case 'detail':
        return t('maintenanceCenterDetailDescription', {
          maintenanceCenterName: this.maintenanceCenterName,
        });
      default:
        return '';
    }
  }

  async generateBreadcrumbs() {
    const t = await this.getTranslation('metadata');
    const breadcrumbs = [];

    breadcrumbs.push({
      label: t('Car Maintenance Centers'),
      href: appPaths.maintenanceCenter,
    });

    switch (this.pageType) {
      case 'detail':
        breadcrumbs.push({
          label: this.locationLabel,
          href: `${appPaths.maintenanceCenter}/city/${this.locationSlug}`,
        });
        break;

      case 'city':
        const cityLocations = this.processLocations(this.locationsArray);
        if (cityLocations.length > 0) {
          breadcrumbs.push(...cityLocations);
        }
        break;

      case 'brand':
        break;

      case 'cityAndBrand':
        breadcrumbs.push({
          label: this.getLocaleString(this.makeData, 'label'),
          href: `${appPaths.maintenanceCenter}/brand/${this?.makeData?.slug}`,
        });

        const brandCityLocations = this.processLocations(this.locationsArray);
        if (brandCityLocations.length > 0) {
          breadcrumbs.push(...brandCityLocations);
        }
        break;
    }

    return breadcrumbs;
  }

  async generateCanonical() {
    // Check for pagination pattern and generate canonical URL
    const { generateCanonicalUrlForPagination } =
      await import('@/utils/general');

    // Get the current URL path from headers
    const { headers } = await import('next/headers');
    const headersList = await headers();
    const currentPath = headersList.get('x-pathname') || '';

    if (currentPath) {
      // Use the current path directly (it already contains /page/X if present)
      const paginationCanonical = generateCanonicalUrlForPagination(
        currentPath,
        BASE_URL,
        { page: this.data?.page },
      );

      if (paginationCanonical) {
        return paginationCanonical;
      }
    }
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

  async getRobotsTags() {
    // Define allowed slugs for maintenance centers
    const allowedSlugs = [
      'cairo',
      'alexandria',
      'aswan',
      'damietta',
      'faiyum',
      'tanta',
      'ismailia',
      'kafr-el-sheikh',
      'luxor',
      'port-said',
      'banha',
      'hurghada',
      'suez',
      'zagazig',
      'qena',
      'sohag',
      'new-cairo',
      'giza',
      'nasr-city',
      'maadi',
      'el-haram',
      'mokattam',
      'qalyubia',
      'dakahlia',
      'red-sea',
      'el-katameya',
      'south-sinai',
      'masr-al-jadidah',
      'qaliubiya',
      'new-nozha',
      'zahraa-al-maadi',
      'el-obour',
      'abu-rawash',
      'gesr-al-suez',
      'alexandria-desert',
      'al-rehab',
      'menoufia',
      'ben-suef',
      'marsa-matruh',
      '6-october',
      'asyut',
      'el beheira',
      'el-salam-cty',
      'gharbia',
      'mansura',
      'el-minya',
      'sharqia',
    ];

    // Check if we should add robots noindex for city pages
    if (this.pageType === 'city') {
      const shouldAddRobots =
        this.data.maintenanceCentersCount < 3 &&
        !allowedSlugs.includes(this.locationSlug);

      if (shouldAddRobots) {
        return {
          index: false,
          follow: true,
        };
      }
    }

    //and for brand page if the cityAndBrand has count < 3 then no index
    if (this.pageType === 'cityAndBrand') {
      if (this.data.maintenanceCentersCount < 3) {
        return {
          index: false,
          follow: true,
        };
      }
    }

    return this.getIndexableRobotsTag();
  }
}
