import configs from '@/configs';
import { ovationApiClient } from '@/services/network/api-client';
import { initializeSession } from '@/utils/session';
import { isMobile } from '@/utils/general';

export class AdMetricsService {
  constructor() {
    this.isMob = isMobile();
    this.userContext = null;
    const { deviceId, sessionId } = initializeSession();
    this.commonParams = {
      client_device_id: deviceId,
      // client_user_external_id: sessionId,
      client_session_id: sessionId,
      google_client_id: null,
      facebook_browser_id: null,
      facebook_click_id: null,
      app_type: this.isMob ? 'web_mobile' : 'web_desktop',
      attributions: [],
      ad_source: 'imported',
      ad_type: 'car',
      ad_source_id: 1000,
    };
  }

  setUserContext(user) {
    this.userContext = user || null;
  }

  getUserContextPayload() {
    if (!this.userContext) return {};
    const u = this.userContext;
    return {
      ...(u.id != null && u.id !== '' && { user_external_id: String(u.id) }),
      ...(u.email != null && u.email !== '' && { user_email_address: u.email }),
      ...(u.name != null && u.name !== '' && { user_name: u.name }),
      ...(u.phone != null && u.phone !== '' && { user_phone_number: u.phone }),
      ...(u.mobile != null && u.mobile !== '' && !u.phone && { user_phone_number: u.mobile }),
    };
  }

  buildExternalPlatforms(ad_external_id) {
    return {
      strat: {
        ad_type: 'general',
        ad_source_id: 1,
        ad_external_id,
      },
    };
  }

  async setAdMetrics(data) {
    let payload;
    const userContextPayload = this.getUserContextPayload();

    if (Array.isArray(data)) {
      payload = data.map((item) => {
        const merged = { ...this.commonParams, ...userContextPayload, ...item };
        const { strat_ad_external_id, ...rest } = merged;
        const result = { ...rest };
        if (strat_ad_external_id != null && strat_ad_external_id !== '') {
          result.external_platforms = this.buildExternalPlatforms(strat_ad_external_id);
        }
        return result;
      });
    } else {
      const merged = { ...this.commonParams, ...userContextPayload, ...data };
      const { strat_ad_external_id, ...rest } = merged;
      const result = { ...rest };
      if (strat_ad_external_id != null && strat_ad_external_id !== '') {
        result.external_platforms = this.buildExternalPlatforms(strat_ad_external_id);
      }
      payload = [result];
    }

    if (!configs.SET_AD_METRICS) return null;

    return ovationApiClient.post('/ingest/adMetric/', payload);
  }

  async handleAdMetrics(type, data) {
    switch (type) {
      case 'view':
        return this.setViewAdMetrics(data);
      case 'detail':
        return this.setAdDetailMetrics(data);
      default:
        return null;
    }
  }

  async setViewAdMetrics(adsData) {
    if (!adsData?.length) return [];

    const payload = adsData.map((item) => {
      const productSlug = item?.products_information.some(
        (prod) => prod.slug === 'signature-listing',
      )
        ? 'signature-listing'
        : item?.products_information?.some(
            (prod) => prod.slug === 'turbo',
          )
        ? 'turbo'
        : 'basic-listing'; 

      return {
        ad_external_id: item?.listing_id,
        strat_ad_external_id: item?.platform_listing_external_id,
        ad_product: productSlug,
        metric_entity: 'ad',
        metric_source: 'search',
        metric_action: 'view',
        ad_image_url: item?.ad_image_url || null,
      };
    });

    return this.setAdMetrics(payload);
  }

  async setAdDetailMetrics(listing) {
    const productSlug = listing?.products_information.some(
      (prod) => prod.slug === 'signature-listing',
    )
      ? 'signature-listing'
      : listing?.products_information?.some(
          (prod) => prod.slug === 'turbo',
        )
      ? 'turbo'
      : 'basic-listing';

    const payload = {
      ad_external_id: listing?.listing_id,
      strat_ad_external_id: listing?.platform_listing_external_id,
      ad_product: productSlug,
      metric_entity: 'ad',
      metric_source: 'details',
      metric_action: 'view',
      ad_image_url: listing?.ad_image_url || null,
    };

    return this.setAdMetrics(payload);
  }

  async setCtaMetrics(metric_action = 'view', metricData) {
    const {
      source = 'search',
      entity = 'phone',
      listing_id,
      platform_listing_external_id: stratAdExternalId,
      products_information,
      ad_image_url = null,
    } = metricData;

    //make a util for product slug
    const productSlug = products_information.some(
      (prod) => prod.slug === 'signature-listing',
    )
      ? 'signature-listing'
      : products_information?.some(
          (prod) => prod.slug === 'turbo',
        )
      ? 'turbo'
      : 'basic-listing';

    const payload = {
      ad_external_id: listing_id,
      strat_ad_external_id: stratAdExternalId,
      ad_product: productSlug,
      metric_entity: entity,
      metric_source: source,
      metric_action,
      ad_image_url,
    };

    return this.setAdMetrics(payload);
  }
}
export const adMetricsService = new AdMetricsService();
