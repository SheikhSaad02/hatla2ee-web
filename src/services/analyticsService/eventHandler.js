import { sendGAEvent, sendGTMEvent } from '@next/third-parties/google';
import { trackEventMoEngage } from '@/services/moengageService';

/**
 * Track event in GA4 only
 * This function remains unchanged to ensure GA4 implementation is not affected
 */
export const trackEventGA4 = (event, params) => {
  setTimeout(() => {
    sendGAEvent('event', event, params);
  }, 10);
};

export const trackEventGTM = (event, params) => {
  setTimeout(() => {
    sendGTMEvent({ event, ...params });
  }, 10);
};
/**
 * Track event in MoEngage only
 * Use this when you want to track an event only in MoEngage
 */
export const trackEventMoEngageOnly = (event, params) => {
  setTimeout(() => {
    trackEventMoEngage(event, params);
  }, 10);
};

/**
 * Track event in both GA4 and MoEngage
 * This is the unified tracking function that sends events to both platforms
 * Use this for new implementations where you want dual tracking
 */
export const trackEvent = (event, params) => {
  trackEventGA4(event, params);
  trackEventGTM(event, params);
  trackEventMoEngageOnly(event, params);
};
