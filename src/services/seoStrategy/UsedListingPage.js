import {
  fetchSlottedListings,
  fetchUsedCarsListingsCount,
} from '@/apis/used-cars-listings';
import configs from '@/configs';
import { BASE_URL } from '@/constants';
import {
  createLocaleStringGetter,
  getAsset,
  getPaginationMeta,
  getPaginationMetaLinks,
  removeDoubleQuotes,
} from '@/utils/general';
import { getParentCityInfo } from '@/utils/used-cars/listings';
import { getTranslations } from 'next-intl/server';
import { BaseSEOStrategy } from './baseSeoStrategyClass';
import { metaTranslationArabicMap } from '@/configs/redirectRulesMap';

export class UsedCarsListingSEOStrategy extends BaseSEOStrategy {
  constructor(params) {
    super(params);
    this.isSearch = !!params.isSearch;
    this.isLanding = !!params.isLanding;
    this.extractString = createLocaleStringGetter(this.language);
    this.initializeDataProperties();
    this.urlInfo = params.urlInfo || {};
    this.loadTranslations();
    this.absoluteTitle = params.absoluteTitle || false;
  }

  buildPath(parts = []) {
    return `/${['car', ...parts.filter(Boolean)].join('/')}`;
  }

  async safeCount(filterOverrides = {}) {
    try {
      return await fetchUsedCarsListingsCount({
        ...this.data,
        ...filterOverrides,
      });
    } catch {
      return null;
    }
  }

  async resolveFallbackPath() {
    const makeSlug = this.data.make?.slug;
    const modelSlug = this.data.model?.slug;

    const modelCount = await this.safeCount({
      year: undefined,
      variant: undefined,
    });
    if (modelCount === null) {
      return this.buildPath();
    }
    if (modelCount > 0) {
      return this.buildPath([makeSlug, modelSlug]);
    }

    const makeCount = await this.safeCount({
      year: undefined,
      variant: undefined,
      model: undefined,
    });
    if (makeCount === null) {
      return this.buildPath();
    }
    if (makeCount > 0) {
      return this.buildPath([makeSlug]);
    }

    return this.buildPath();
  }

  async shouldIndex() {
    const makeSlug = this.data.make?.slug;
    const modelSlug = this.data.model?.slug;
    const citySlug = this.data.city?.slug;
    const bodySlug = this.data.body?.slug;
    const yearVal = this.year;
    const variantSlug = this.data.variant?.slug;
    const { results } = await fetchSlottedListings(this.data);
    const count = results?.length;
    const condition = this.data.condition?.slug;
    const imported = this.specialConditions === 'imported';

    // 1) make && !city -> index if count > 0
    if (makeSlug && !modelSlug && !citySlug) {
      return count > 0;
    }

    if (makeSlug && modelSlug && imported && condition === 'new') {
      return count > 5;
    }

    // 2) make && model && !city -> index if count > 0
    if (makeSlug && modelSlug && !yearVal && !variantSlug && !citySlug) {
      return count > 0;
    }

    // 3) make && model && year && variant && !city -> index if variant exists
    if (makeSlug && modelSlug && variantSlug && !citySlug) {
      return count > 7;
    }

    // 4) make && model && year && !city -> index if count >= 3
    if (makeSlug && modelSlug && yearVal && !variantSlug && !citySlug) {
      return count >= 3;
    }

    // 5) make && city && model -> index if count > 1
    if (makeSlug && modelSlug && citySlug) {
      return count > 1;
    }

    // 6) make && city -> index if count > 1
    if (makeSlug && citySlug && !modelSlug) {
      return count > 1;
    }

    // 7) city only -> index if count > 0
    if (citySlug && !makeSlug && !modelSlug && !bodySlug) {
      return count > 0;
    }

    // 9) body && city -> index if count > 0
    if (bodySlug && citySlug) {
      return count > 0;
    }

    // 8) default: index if count > 0
    else {
      return count > 0;
    }
  }

  async getRedirectPath() {
    const makeSlug = this.data.make?.slug;
    const modelSlug = this.data.model?.slug;
    const citySlug = this.data.city?.slug;
    const bodySlug = this.data.body?.slug;
    const yearVal = this.year;
    const variantSlug = this.data.variant?.slug;
    const { results } = await fetchSlottedListings(this.data);
    const count = results?.length;

    // 1) make && !city -> No redirect
    if (makeSlug && !modelSlug && !citySlug) {
      return null;
    }

    // 2) make && model && !city -> redirect to /car
    if (makeSlug && modelSlug && !yearVal && !variantSlug && !citySlug) {
      return null;
    }

    // 3) make && model && year && variant && !city -> redirect to /car if variant doesn't exist
    if (makeSlug && modelSlug && variantSlug && !citySlug) {
      if (count) return null;
      return configs.ENABLE_FACET_CASCADE_REDIRECT
        ? await this.resolveFallbackPath()
        : this.buildPath();
    }

    // 4) make && model && year && !city -> redirect to /car
    if (makeSlug && modelSlug && yearVal && !variantSlug && !citySlug) {
      if (count) return null;
      return configs.ENABLE_FACET_CASCADE_REDIRECT
        ? await this.resolveFallbackPath()
        : this.buildPath();
    }

    // 7) city only -> no redirection
    if (citySlug && !makeSlug && !modelSlug && !bodySlug) {
      return null;
    }

    // 9) body && city -> no redirection
    if (bodySlug && citySlug) {
      return null;
    }

    return null;
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

  loadTranslations() {
    this.usedCarT = getTranslations({
      locale: this.language,
      namespace: 'usedCarsListingSeo',
    });
    this.metaT = getTranslations({
      locale: this.language,
      namespace: 'metadata',
    });
  }

  initializeDataProperties() {
    const {
      make,
      model,
      specialConditions,
      variant,
      body,
      city,
      price,
      year,
      cc,
      page,
      condition,
      fuel,
      transmission,
    } = this.data;

    this.make = this.extractString(make, 'label');
    this.model = this.extractString(model, 'label');
    this.variant = this.extractString(variant, 'label');
    this.city = this.extractString(city, 'title');
    this.specialConditions = specialConditions?.[0].slug;
    this.year = year?.max;
    this.cc = this.extractString(cc, 'label');
    this.price = price;
    this.page = page || 1;

    this.condition = condition?.slug;
    this.fuelLabel = this.extractString(fuel, 'label');
    this.transmissionLabel = this.extractString(transmission?.slug, 'label');
  }

  getBrandEnglishName(addBrackets = true) {
    // Special case for Changhe brand
    if (this.data.make?.slug === 'changhe') {
      return addBrackets ? ' ( Changhe ) ' : ' Changhe ';
    }
    // Special case for Xiaomi brand
    if (this.data.make?.slug === 'xiaomi') {
      return addBrackets ? ' ( Xiaomi ) ' : ' Xiaomi ';
    }
    return this.isEnglish()
      ? ''
      : addBrackets
        ? ` ( ${this.data.make?.label} ) `
        : ` ${this.data.make?.label} `;
  }

  async generateH1() {
    const t = await this.usedCarT;
    const country = configs.country[this.language].label;

    if (this.isSearch) {
      return t('h1_search', { country });
    }

    const {
      make,
      model,
      variant,
      specialConditions,
      city,
      price,
      year,
      condition,
      fuelLabel,
      transmissionLabel,
    } = this;

    const cc = this.data?.cc?.slug;
    const body = (this.data?.body?.label && t(this.data.body.label)) ?? null;
    const currency = configs.currency[this.language].label;

    /* These 2 cases below need to be handled */
    // Case 21: Outdated ads
    // Case 20: Pre-existing installments

    if (specialConditions === 'imported' && (make || model)) {
      if (make && model && condition === 'new') {
        return t('h1_imported_new_make_model', {
          make,
          model: this.data?.model?.label,
          country,
        });
      }
      return t('h1_imported_new_make_model', {
        make,
        ...(model && { model }),
        country,
      });
    }
    if (specialConditions === 'financed' && condition === 'used') {
      return t('used_car_financed_h1', {
        country,
      });
    }

    // Make + Year (no model) — /make/year/2022
    if (make && year && !model && !city && !specialConditions) {
      return t('h1_make_year_country', { make, year, country });
    }

    // Make + Body (no model) — /make/body/suv
    if (make && body && !model && !city && !specialConditions) {
      return t('h1_make_body_country', { make, body, country });
    }

    // Make + Fuel (no model)
    if (make && fuelLabel && !model && !city && !specialConditions) {
      return t('h1_make_fuel_country', {
        make,
        fuel: fuelLabel,
        country,
      });
    }

    // Make + Transmission (no model)
    if (make && transmissionLabel && !model && !city && !specialConditions) {
      return t('h1_make_transmission_country', {
        make,
        transmission: t(transmissionLabel),
        country,
      });
    }

    // Fuel type only (no make) — /petrol-cars
    if (!make && fuelLabel && !model && !city && !specialConditions) {
      return t('h1_fuel_country', { fuel: fuelLabel, country });
    }

    // Transmission only (no make) — /manual-cars
    if (!make && transmissionLabel && !model && !city && !specialConditions) {
      return t('h1_transmission_country', {
        transmission: t(transmissionLabel),
        country,
      });
    }

    // Case 8: Most specific - Brand + Model + Year + Variant + Country
    if (make && model && year && variant) {
      return t('h1_make_model_year_variant', { make, model, year, variant });
    }

    // Case 9: Brand + Model + Year
    if (make && model && year && !city) {
      return t('h1_make_model_year', { make, model, year, country });
    }

    // Case 5: Brand + Model + City
    if (make && model && city) {
      return t('h1_make_model_city', { make, model, city });
    }

    // Case 7: Brand + Model + Country
    if (make && model && !city) {
      return t('h1_make_model_country', { make, model, country });
    }

    // Case 4: Brand + City
    if (make && city) {
      return t('h1_make_city', { make, city });
    }

    // Case 3: Brand + Country
    if (make && !city) {
      return t('h1_make_country', { make, country });
    }

    // Case 10: Price range
    if (price) {
      const { min: _min, max: _max } = price;
      const min = _min.toLocaleString();
      const max = _max.toLocaleString();
      return t('h1_price_range', { min, max, currency, country });
    }

    // Case 19: CC + Country
    if (cc) {
      return t('h1_cc_country', { cc, country });
    }

    // Case 6: Body type + City
    if (body && city) {
      const vehicleText = await this.getVehicleTextForBody(body);

      // Special case for minivan in English
      if (this.data.body?.slug === 'minivan' && this.language === 'en') {
        return t('h1_body_city', {
          body: 'Minivans/Vans',
          city,
          vehicle: vehicleText,
        });
      }

      // Special case for 4x4 in Arabic
      if (this.data.body?.slug === '4x4' && this.language === 'ar') {
        return t('h1_body_city_4x4', { city, body, vehicle: vehicleText });
      }

      return t('h1_body_city', { body, city, vehicle: vehicleText });
    }

    // Body type + Country
    if (body) {
      const vehicleText = await this.getVehicleTextForBody(body);

      // Special case for minivan in English
      if (this.data.body?.slug === 'minivan' && this.language === 'en') {
        return t('h1_body_country', {
          body: 'Minivans/Vans',
          country,
          vehicle: vehicleText,
        });
      }

      // Special case for 4x4 in Arabic
      if (this.data.body?.slug === '4x4' && this.language === 'ar') {
        return t('h1_body_country_4x4', {
          body,
          country,
          vehicle: vehicleText,
        });
      }

      return t('h1_body_country', { body, country, vehicle: vehicleText });
    }

    // Special conditions with country
    if (specialConditions) {
      const conditionMap = {
        ['kasr-zero']: t('h1_kasr_zero'),
        taxi: t('h1_taxi'),
        disabled: t('h1_disabled'),
        financed: t('h1_financed'),
        classic: t('h1_classic'),
        electric: t('h1_electric'),
        imported: t('h1_imported'),
        'imported-used': t('h1_imported_used'),
        'imported-new': t('h1_imported_new'),
      };

      let conditionKey = specialConditions;
      if (this.condition && ['used', 'new'].includes(this.condition)) {
        conditionKey = `${specialConditions}-${this.condition}`;
      }

      const conditionText = conditionMap[conditionKey];
      if (conditionText) {
        return t('h1_special_condition_with_country', {
          condition: conditionText,
          country,
        });
      }
    }

    // Case 2: City only
    if (city) {
      return t('h1_city_only', { city });
    }

    // Case 1: Default - Country only
    return t('h1_country_default', { country });
  }

  async buildMetaTitle() {
    if (this.isSearch) {
      const t = await this.usedCarT;
      const country = configs.country[this.language].label;
      return t('meta_title_search', { country });
    }

    const {
      make,
      model,
      variant,
      city,
      year,
      price,
      specialConditions,
      condition,
      fuelLabel,
      transmissionLabel,
    } = this;

    const cc = this.data?.cc?.slug;
    const t = await this.usedCarT;
    const body = this.data?.body ? t(this.data.body?.label) : null;
    const country = configs.country[this.language].label;
    const currency = configs.currency[this.language].label;

    /* These 2 cases below need to be handled */
    // Case 21: Outdated ads
    // Case 20: Pre-existing installments

    if (specialConditions === 'imported' && (make || model)) {
      if (make && model && condition === 'new') {
        return t('meta_title_imported_new_make_model', {
          make: this.data?.make?.label,
          model: this.data?.model?.label,
          country,
        });
      }
      return t('meta_title_imported_new_make_model', {
        make,
        ...(model && { model }),
        country,
      });
    }

    if (specialConditions === 'financed' && condition === 'used') {
      return t('used_car_financed_title', {
        country,
      });
    }

    // Make + Year (no model)
    if (make && year && !model && !city && !specialConditions) {
      return t('meta_title_make_year_country', { make, year, country });
    }

    // Make + Body (no model)
    if (make && body && !model && !city && !specialConditions) {
      return t('meta_title_make_body_country', { make, body, country });
    }

    // Make + Fuel (no model)
    if (make && fuelLabel && !model && !city && !specialConditions) {
      return t('meta_title_make_fuel_country', {
        make,
        fuel: fuelLabel,
        country,
      });
    }

    // Make + Transmission (no model)
    if (make && transmissionLabel && !model && !city && !specialConditions) {
      return t('meta_title_make_transmission_country', {
        make,
        transmission: t(transmissionLabel),
        country,
      });
    }

    // Fuel only (no make)
    if (!make && fuelLabel && !model && !city && !specialConditions) {
      return t('meta_title_fuel_country', { fuel: fuelLabel, country });
    }

    // Transmission only (no make)
    if (!make && transmissionLabel && !model && !city && !specialConditions) {
      return t('meta_title_transmission_country', {
        transmission: t(transmissionLabel),
        country,
      });
    }

    // Case 8: Most specific - Brand + Model + Year + Variant + Country - done
    if (make && model && year && variant && !city) {
      return t('meta_title_make_model_year_variant_country', {
        make,
        model,
        year,
        variant,
        country,
      });
    }

    // Case 9: Brand + Model + Year - done
    if (make && model && year && !city) {
      return t('meta_title_make_model_year', { make, model, year, country });
    }

    // Case 5: Brand + Model + City - done
    if (make && model && city) {
      const brandEn = this.getBrandEnglishName(false);
      let modelEn = '';
      if (metaTranslationArabicMap[this.data.model.slug]) {
        modelEn = metaTranslationArabicMap[this.data.model.slug];
        return t('meta_title_make_model_city_json', {
          make,
          model,
          city,
          brandEn,
          modelEn,
        });
      } else {
        modelEn =
          this.data.model?.label !== this.data.model.label_l1
            ? this.data.model.label
            : '';
      }

      return t('meta_title_make_model_city', {
        make,
        model,
        city,
        brandEn,
        modelEn,
      });
    }

    // Case 7: Brand + Model + Country - done
    if (make && model && !city) {
      const brandEn = this.getBrandEnglishName(false);

      let modelEn = '';
      if (metaTranslationArabicMap[this.data.model.slug]) {
        modelEn = metaTranslationArabicMap[this.data.model.slug];
        return t('meta_title_make_model_country_json', {
          make,
          model,
          country,
          brandEn,
          modelEn,
        });
      } else {
        modelEn =
          this.data.model?.label !== this.data.model.label_l1
            ? this.data.model.label
            : '';
      }

      return t('meta_title_make_model_country', {
        make,
        model,
        country,
        brandEn,
        modelEn,
      });
    }

    // Case 4: Brand + City - done
    if (make && city) {
      return t('meta_title_make_city', { make, city });
    }

    // Case 3: Brand + Country - done
    if (make && !city) {
      return t('meta_title_make_country', { make, country });
    }

    // Case 10: Price range - done
    if (price) {
      const { max: _max } = price;
      const max = _max.toLocaleString();
      return t('meta_title_price_range', { max, currency, country });
    }

    // Case 19: CC + Country - done
    if (cc) {
      return t('meta_title_cc_country', { cc, country });
    }

    // Case 6: Body type + City - done
    if (body && city) {
      const vehicleText = await this.getVehicleTextForBody(body);

      // Special case for minivan in English
      if (this.data.body?.slug === 'minivan' && this.language === 'en') {
        return t('meta_title_body_city', {
          body: 'Minivans/Vans',
          city,
          vehicle: vehicleText,
        });
      }

      // Special case for 4x4 in Arabic
      if (this.data.body?.slug === '4x4' && this.language === 'ar') {
        return t('meta_title_body_city_4x4', {
          city,
          body,
          vehicle: vehicleText,
        });
      }

      return t('meta_title_body_city', { body, city, vehicle: vehicleText });
    }

    // Case 11: Body type + Country - done
    if (body) {
      const vehicleText = await this.getVehicleTextForBody(body);

      // Special case for minivan in English
      if (this.data.body?.slug === 'minivan' && this.language === 'en') {
        return t('meta_title_body_country', {
          body: 'Minivans/Vans',
          country,
        });
      }

      if (this.data.body?.slug === '4x4' && this.language === 'ar') {
        return t('meta_title_body_country_4x4', {
          body,
          country,
          vehicle: vehicleText,
        });
      }

      return t('meta_title_body_country', {
        body,
        country,
        vehicle: vehicleText,
      });
    }

    // Special conditions with country
    if (specialConditions) {
      const conditionMap = {
        ['kasr-zero']: t('meta_title_kasr_zero'),
        taxi: t('meta_title_taxi'),
        disabled: t('meta_title_disabled'),
        financed: t('meta_title_financed'),
        classic: t('meta_title_classic'),
        electric: t('meta_title_electric'),
        imported: t('meta_title_imported'),
        'imported-used': t('meta_title_imported_used'),
        'imported-new': t('meta_title_imported_new'),
      };

      let conditionKey = specialConditions;
      if (this.condition && ['used', 'new'].includes(this.condition)) {
        conditionKey = `${specialConditions}-${this.condition}`;
      }

      const conditionText = conditionMap[conditionKey];
      if (conditionText) {
        if (specialConditions === 'financed') {
          return t('meta_title_financed_special', {
            condition: conditionText,
            country,
          });
        }

        return t('meta_title_special_condition_with_country', {
          condition: conditionText,
          country,
        });
      }
    }

    // Case 2: City only - done
    if (city) {
      return t('meta_title_city_only', { city });
    }

    // Case 1: Default - Country only - done
    return t('meta_title_country_default', { country });
  }
  async generateMetaTitle() {
    const title = await this.buildMetaTitle();

    const t = await this.usedCarT;
    const metaT = await this.metaT;
    const country = configs.country[this.language].label;
    let absoluteTitle = `${title} | ${metaT('Hatla2eeCountry', { country })}`;

    if (this.page && this.page > 1) {
      absoluteTitle = `${absoluteTitle} - ${t('Page')} ${this.page}`;
    }

    return this.absoluteTitle ? { absolute: absoluteTitle } : title;
  }

  async getTotalListingCount() {
    //check wheather to use for meta description
    const totalListingsCount = await fetchUsedCarsListingsCount(this.data); //tbd to cache or not
    return totalListingsCount;
  }

  async generatePaginationMetaLinks() {
    const totalCount = await this.getTotalListingCount();

    return getPaginationMetaLinks({
      currentPage: this.page,
      totalCount,
      baseUrl: `${BASE_URL}/${this.language}/${this.urlInfo.params.join('/')}`,
      pageSize: 40,
    });
  }

  async generateMetaDescription() {
    return this.generatePageDescription(
      await this.resolveMetaDescription(),
      this.page,
    );
  }

  async resolveMetaDescription() {
    const t = await this.usedCarT;

    if (this.isSearch) {
      const country = configs.country[this.language].label;
      return t('meta_desc_search', { country });
    }

    const {
      make,
      model,
      city,
      year,
      variant,
      page,
      price,
      fuelLabel,
      transmissionLabel,
    } = this;
    const country = configs.country[this.language].label;
    const currency = configs.currency[this.language].label;
    const body = (this.data?.body?.label && t(this.data.body.label)) ?? null;

    if (this.isLanding) {
      return t('meta_desc_landing', { country });
    }

    if (
      page > 1 &&
      !make &&
      !model &&
      !city &&
      !year &&
      !variant &&
      !this.specialConditions
    ) {
      if (this.isEnglish()) {
        return '';
      } else {
        const { totalCount } = await fetchSlottedListings(this.data);
        return t('meta_desc_default', {
          totalListingsCount: totalCount.toLocaleString(),
          country,
        });
      }
    }
    if (Object.keys(this.data).length === 0) {
      if (this.isEnglish()) {
        return '';
      } else {
        const { totalPages, totalCount } = await fetchSlottedListings(
          this.data,
        );
        return t('meta_desc_default', {
          totalListingsCount: totalCount.toLocaleString(),
          country,
        });
      }
    }

    // Make + Year (no model)
    if (
      make &&
      year &&
      !model &&
      !city &&
      !variant &&
      !this.specialConditions
    ) {
      return t('meta_desc_make_year_country', { make, year, country });
    }

    // Make + Body (no model)
    if (
      make &&
      body &&
      !model &&
      !city &&
      !variant &&
      !this.specialConditions
    ) {
      return t('meta_desc_make_body_country', {
        make,
        body,
        country,
      });
    }

    // Make + Fuel (no model)
    if (
      make &&
      fuelLabel &&
      !model &&
      !city &&
      !variant &&
      !this.specialConditions
    ) {
      return t('meta_desc_make_fuel_country', {
        make,
        fuel: fuelLabel,
        country,
      });
    }

    // Make + Transmission (no model)
    if (
      make &&
      transmissionLabel &&
      !model &&
      !city &&
      !variant &&
      !this.specialConditions
    ) {
      return t('meta_desc_make_transmission_country', {
        make,
        transmission: t(transmissionLabel),
        country,
      });
    }

    // Fuel only (no make)
    if (
      !make &&
      fuelLabel &&
      !model &&
      !city &&
      !variant &&
      !this.specialConditions
    ) {
      return t('meta_desc_fuel_country', { fuel: fuelLabel, country });
    }

    // Transmission only (no make)
    if (
      !make &&
      transmissionLabel &&
      !model &&
      !city &&
      !variant &&
      !this.specialConditions
    ) {
      return t('meta_desc_transmission_country', {
        transmission: t(transmissionLabel),
        country,
      });
    }

    // Make + Model + Year Page
    if (make && model && year && !city && !variant && !this.specialConditions) {
      return t('meta_desc_make_model_year', { make, model, year, country });
    }

    // Make + Model + City Page
    if (make && model && city) {
      return t('meta_desc_make_model_city', { make, model, city });
    }

    // Make + City Page
    if (make && city && !model) {
      return t('meta_desc_make_city', { make, city });
    }

    // Make + Model Page
    if (
      make &&
      model &&
      !city &&
      !year &&
      !variant &&
      !this.specialConditions
    ) {
      return t('meta_desc_make_model', { make, model, country });
    }

    // Body type + City (must be before city-only)
    if (body && city) {
      return t('meta_desc_body_city', { body, city });
    }

    if (city && !make && !model) {
      return t('meta_desc_city', { city });
    }

    // Make only (no model)
    if (make && !model) {
      return t('meta_desc_make', { make, country });
    }

    // Price range
    if (price) {
      const { max: _max } = price;
      const max = _max.toLocaleString();
      return t('meta_desc_price_range', { max, currency, country });
    }

    // Body type only
    if (body && !city && !make) {
      return t('meta_desc_body', { body, country });
    }

    // CC range only
    const cc = this.data?.cc;
    if (cc && !make && !model && !city) {
      const ccLabel = this.extractString(cc, 'label');
      return t('meta_desc_cc', { cc: ccLabel || cc.slug, country });
    }

    if (this.specialConditions && !make && !model) {
      let conditionKey = this.specialConditions;
      if (this.condition && ['used', 'new'].includes(this.condition)) {
        conditionKey = `${this.specialConditions}-${this.condition}`;
      }
      const conditionKeyStr = `condition_${conditionKey.replace(/-/g, '_')}`;
      const condition = t(conditionKeyStr) || conditionKey;
      return t('meta_desc_special_condition', { condition, country });
    }

    return '';
  }

  async generateBreadcrumbs() {
    const { make, model, variant, year, city, body } = this.data;

    const parentCity = await (async () => {
      if (!city || city?.level === 2) {
        return null;
      } else {
        return getParentCityInfo(city);
      }
    })();

    const t = await this.usedCarT;
    const breadcrumbs = [];

    //if it is imported car and condition is used then add the imported car breadcrumb
    if (this.specialConditions === 'imported' && this.condition === 'new') {
      breadcrumbs.push({
        href: `/new-car`,
        label: t('breadcrumb_new_car'),
      });
      breadcrumbs.push({
        href: `/new-car/imported`,
        label: t('breadcrumb_imported_new_car'),
      });
      return breadcrumbs;
    }

    // Homepage
    breadcrumbs.push({
      href: `/`,
      label: t('breadcrumb_cars_for_sale'),
    });

    if (Object.keys(this.data).length === 0) return breadcrumbs;

    const usedCarBreadcrumb = {
      href: `/car`,
      label: t('breadcrumb_used_cars'),
    };

    // Static URLs (no city, make, model, etc.)
    const hasStaticOnly =
      !city && !make && !model && !variant && !body && !year;

    if (hasStaticOnly) {
      breadcrumbs.push(usedCarBreadcrumb);
      return breadcrumbs;
    }

    // 1. City only
    if (city && !make && !model && !body) {
      breadcrumbs.push(usedCarBreadcrumb);
      if (parentCity) {
        breadcrumbs.push({
          href: `/car/city/${parentCity.slug}`,
          label: this.extractString(parentCity, 'label'),
        });
      }
      return breadcrumbs;
    }

    // 2. City + Make
    if (city && make && !model) {
      breadcrumbs.push(usedCarBreadcrumb);
      if (parentCity) {
        breadcrumbs.push({
          href: `/car/city/${parentCity.slug}`,
          label: this.extractString(parentCity, 'label'),
        });
      }
      breadcrumbs.push({
        href: `/car/city/${city.slug}`,
        label: this.extractString(city, 'label'),
      });
      breadcrumbs.push({
        href: `/car/${make.slug}`,
        label: this.extractString(make, 'label'),
      });
      return breadcrumbs;
    }

    // 3. City + Make + Model
    if (city && make && model && !year) {
      breadcrumbs.push(usedCarBreadcrumb);
      if (parentCity) {
        breadcrumbs.push({
          href: `/car/city/${parentCity.slug}`,
          label: this.extractString(parentCity, 'label'),
        });
      }
      breadcrumbs.push({
        href: `/car/city/${city.slug}`,
        label: this.extractString(city, 'label'),
      });
      breadcrumbs.push({
        href: `/car/city/${city.slug}/${make.slug}`,
        label: `${this.extractString(make, 'label')} ${this.extractString(
          city,
          'label',
        )}`,
      });
      breadcrumbs.push({
        href: `/car/${make.slug}/${model.slug}`,
        label: this.extractString(model, 'label'),
      });
      return breadcrumbs;
    }

    // 4. City + Body
    if (city && body) {
      breadcrumbs.push(usedCarBreadcrumb);
      breadcrumbs.push({
        href: `/car/city/${city.slug}`,
        label: this.extractString(city, 'label'),
      });
      breadcrumbs.push({
        href: `/car/body/${body.slug}`,
        label: t(body?.label),
      });
      return breadcrumbs;
    }

    // 5. Make Only
    if (make && !model && !year && !variant && !city) {
      const isImported = false; //re-confirm why we need this, there is no flow that requires this
      breadcrumbs.push({
        href: isImported ? `/car/imported` : `/car`,
        label: isImported
          ? t('breadcrumb_imported_cars')
          : t('breadcrumb_used_cars'),
      });
      return breadcrumbs;
    }

    // 6. Make + Model
    if (make && model && !year && !variant && !city) {
      breadcrumbs.push(usedCarBreadcrumb);
      breadcrumbs.push({
        href: `/car/${make.slug}`,
        label: this.extractString(make, 'label'),
      });
      return breadcrumbs;
    }

    // 7. Make + Model + Year
    if (make && model && year && !variant) {
      breadcrumbs.push(usedCarBreadcrumb);
      breadcrumbs.push({
        href: `/car/${make.slug}`,
        label: this.extractString(make, 'label'),
      });
      breadcrumbs.push({
        href: `/car/${make.slug}/${model.slug}`,
        label: this.extractString(model, 'label'),
      });
      return breadcrumbs;
    }

    // 8. Make + Model + Variant (Teraz) (+ year)
    if (make && model && year && variant) {
      breadcrumbs.push(usedCarBreadcrumb);
      breadcrumbs.push({
        href: `/car/${make.slug}`,
        label: this.extractString(make, 'label'),
      });
      breadcrumbs.push({
        href: `/car/${make.slug}/${model.slug}`,
        label: this.extractString(model, 'label'),
      });
      breadcrumbs.push({
        href: `/car/${make.slug}/${model.slug}/${year.max}`,
        label: `${this.extractString(model, 'label')} ${year.max}`,
      });
      return breadcrumbs;
    }

    // 9. Body Only
    if (body && !city && !make) {
      breadcrumbs.push(usedCarBreadcrumb);
      return breadcrumbs;
    }

    return breadcrumbs;
  }

  async generateCanonical() {
    const { params = [] } = this.urlInfo;
    const baseUrl = removeDoubleQuotes(BASE_URL);

    const showCanonicals = [
      'city',
      'disabled',
      'used-car-financed',
      'hybrid',
      'electric',
      'classic',
      'kasr-zero',
      'cc',
      'imported-car',
    ];

    const { generateCanonicalUrlForPagination } =
      await import('@/utils/general');
    const { headers } = await import('next/headers');
    const pathname = (await headers()).get('x-pathname') || '';

    const searchParams = this.urlInfo?.searchParams || {};
    const hasOtherParams = Object.keys(searchParams).some((k) => k !== 'page');
    const pageForCanonical = hasOtherParams ? undefined : this.data?.page;

    if (pathname) {
      const canonical = generateCanonicalUrlForPagination(pathname, baseUrl, {
        page: pageForCanonical,
      });
      if (canonical) return canonical;
    }

    const currentPath = `/${this.language}/car${
      params.length > 0 ? '/' + params.join('/') : ''
    }`;

    const paginationCanonical = generateCanonicalUrlForPagination(
      currentPath,
      baseUrl,
      { page: pageForCanonical },
    );
    if (paginationCanonical) return paginationCanonical;

    if (params.length === 0) {
      return `${baseUrl}/${this.language}/car`;
    } else if (params[0] === 'search') {
      return `${baseUrl}/${this.language}/car/search`;
    } else if (params[0] === 'imported-car' || params[0] === 'imported') {
      return `${baseUrl}/${this.language}/imported-car`;
    } else if (showCanonicals.includes(params[0])) {
      return `${baseUrl}/${this.language}/car/${params.join('/')}`;
    } else if (params.length >= 1) {
      return `${baseUrl}/${this.language}/car/${params.join('/')}`;
    } else {
      return '';
    }
  }

  async getVehicleTextForBody(body) {
    const t = await this.usedCarT;

    // Get body slug from body object
    const bodySlug = this.data.body?.slug || '';

    // For English
    if (this.language === 'en') {
      switch (bodySlug) {
        case 'coupe':
          return '';
        case 'sedan':
          return t('Car');
        case 'hatchback':
          return t('Cars');
        case 'suv':
          return '';
        case '4x4':
          return '';
        case 'minivan':
          return '';
        default:
          return t('Cars');
      }
    }

    // For Arabic
    if (this.language === 'ar') {
      switch (bodySlug) {
        case 'coupe':
          return '';
        case 'suv':
          return '';
        case 'sedan':
          return t('Car');
        case '4x4':
          return t('Cars');
        case 'hatchback':
          return t('Cars');
        case 'minivan':
          return ''; // Empty string for these body types
        default:
          return t('Cars');
      }
    }

    // Default fallback
    return t('Cars');
  }

  async generateOpenGraphImage() {
    // Fallback to a generic car image
    if (this.language === 'ar') {
      return getAsset(`/assets/og-images/used-cars-ar.webp`);
    }
    return getAsset(`/assets/og-images/used-cars-en.webp`);
  }

  async generateOpenGraph() {
    const baseOG = await super.generateOpenGraph();
    const title = await this.generateMetaTitle();
    const description = await this.generateMetaDescription();
    const image = await this.generateOpenGraphImage();
    const url = await this.generateCanonical();
    const titleValue =
      typeof title === 'object' && title !== null ? title.absolute : title;
    return {
      ...baseOG,
      title: titleValue,
      description,
      url,
      images: image
        ? [
            {
              url: image,
              width: 1200,
              height: 630,
              alt: titleValue,
            },
          ]
        : undefined,
    };
  }
}
