'use client';

let moengageInstance = null;
let isInitialized = false;
let eventQueue = [];

export const setMoengageInstance = (instance) => {
  moengageInstance = instance;
  isInitialized = true;

  if (eventQueue.length > 0) {
    eventQueue.forEach(({ event, params }) => {
      trackEventMoEngage(event, params);
    });
    eventQueue = [];
  }
};

export const isMoengageInitialized = () => isInitialized;

export const getMoengageInstance = () => moengageInstance;


export const trackEventMoEngage = (event, params = {}) => {
  if (typeof window === 'undefined') return;

  if (!isInitialized || !moengageInstance) {
    eventQueue.push({ event, params });

    if (process.env.NODE_ENV === 'development') {
      console.log('[MoEngage] Event queued (SDK not ready):', event, params);
    }
    return;
  }

  try {
    moengageInstance.track_event(event, params);

    if (process.env.NODE_ENV === 'development') {
      console.log('[MoEngage] Event tracked:', event, params);
    }
  } catch (error) {
    if (process.env.NODE_ENV === 'development') {
      console.error('[MoEngage] Error tracking event:', error);
    }
  }
};

export const setMoengageUserAttributes = (attributes = {}) => {
  if (typeof window === 'undefined') return;

  if (!isInitialized || !moengageInstance) {
    if (process.env.NODE_ENV === 'development') {
      console.log('[MoEngage] User attributes queued (SDK not ready):', attributes);
    }
    return;
  }

  try {
    if (attributes.user_id) {
      moengageInstance.add_unique_user_id(attributes.user_id);
    }

    Object.entries(attributes).forEach(([key, value]) => {
      if (key !== 'user_id' && value !== null && value !== undefined) {
        moengageInstance.add_user_attribute(key, value);
      }
    });

    if (process.env.NODE_ENV === 'development') {
      console.log('[MoEngage] User attributes set:', attributes);
    }
  } catch (error) {
    if (process.env.NODE_ENV === 'development') {
      console.error('[MoEngage] Error setting user attributes:', error);
    }
  }
};


// Destroy/reset the MoEngage user session
// Call this when user logs out

export const resetMoengageUser = () => {
  if (typeof window === 'undefined') return;

  if (!isInitialized || !moengageInstance) return;

  try {
    moengageInstance.destroy_session();

    if (process.env.NODE_ENV === 'development') {
      console.log('[MoEngage] User session destroyed');
    }
  } catch (error) {
    if (process.env.NODE_ENV === 'development') {
      console.error('[MoEngage] Error destroying session:', error);
    }
  }
};
