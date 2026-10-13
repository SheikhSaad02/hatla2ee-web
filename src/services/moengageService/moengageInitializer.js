'use client';

import { setMoengageInstance, setMoengageUserAttributes } from './moengageHandler';
import { getCookie } from '@/utils/cookies';
import configs from '@/configs';

let initializationPromise = null;

const getUserIdFromToken = () => {
  try {
    const token = getCookie(configs.authToken);
    if (!token || token.split('.').length !== 3) return null;
    const payload = JSON.parse(atob(token.split('.')[1]));
    return payload?.tokenable_id || null;
  } catch (e) {
    return null;
  }
};

export const initializeMoEngage = async () => {
  // Prevent multiple initializations
  if (initializationPromise) {
    return initializationPromise;
  }

  // Only run on client side
  if (typeof window === 'undefined') {
    return null;
  }

  // Check if MoEngage App ID is configured
  const appId = process.env.NEXT_PUBLIC_MOENGAGE_APP_ID;
  if (!appId) {
    if (process.env.NODE_ENV === 'development') {
      console.warn('[MoEngage] NEXT_PUBLIC_MOENGAGE_APP_ID not configured. MoEngage will not be initialized.');
    }
    return null;
  }

  initializationPromise = (async () => {
    try {
      // Dynamically import MoEngage SDK
      const { default: moengage } = await import('@moengage/web-sdk');

      // Get configuration from environment variables
      const dataCenter = process.env.NEXT_PUBLIC_MOENGAGE_DATA_CENTER || 'dc_1';
      const env = process.env.NEXT_PUBLIC_MOENGAGE_ENV || 'LIVE';
      const debugMode = process.env.NEXT_PUBLIC_MOENGAGE_DEBUG === 'true';

      // Initialize MoEngage
      const moengageConfig = {
        app_id: appId,
        datacenter: dataCenter,
        cluster: dataCenter,
        env: env,
        debug_logs: debugMode ? 2 : 0, // 0 = none, 1 = errors only, 2 = all logs
        enableSPA: true, // Enable for Single Page Applications (Next.js)
      };

      moengage.initialize(moengageConfig);

      // Set the instance for use in event tracking
      setMoengageInstance(moengage);

      // Set initial user attributes based on tenant
      const tenantCode = process.env.NEXT_PUBLIC_TENANT || 'eg';
      const COUNTRY_NAMES = {
        eg: 'EG',
        jordan: 'JO',
        ksa: 'SA',
        kuwait: 'KW',
        oman: 'OM',
        uae: 'AE',
        qatar: 'QA',
      };
      const chosenCountry = COUNTRY_NAMES[tenantCode] || tenantCode;

      // Set app/tenant attributes only. User attributes (email, phone, name) are set
      // in updateMoengageUser() when the client-side user fetch completes.
      const userId = getUserIdFromToken();
      setMoengageUserAttributes({
        chosen_country: chosenCountry,
        ...(userId && { user_id: userId }),
      });

      if (process.env.NODE_ENV === 'development') {
        console.log('[MoEngage] SDK initialized successfully', {
          appId,
          dataCenter,
          env,
          debugMode,
        });
      }

      return moengage;
    } catch (error) {
      console.error('[MoEngage] Failed to initialize SDK:', error);
      initializationPromise = null;
      return null;
    }
  })();

  return initializationPromise;
};

export const updateMoengageUser = (user) => {
  if (!user) return;

  const phone = user.phone || user.mobile;

  setMoengageUserAttributes({
    user_id: user.id?.toString(),
    is_showroom: !!user.agency_id,
    ...(user.email && { email: user.email }),
    ...(phone && { phone: phone }),
    ...(user.name && { name: user.name }),
  });
};
