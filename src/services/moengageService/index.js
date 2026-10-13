'use client';

// MoEngage Service - Event tracking and user management for MoEngage
export {
  trackEventMoEngage,
  setMoengageUserAttributes,
  resetMoengageUser,
  isMoengageInitialized,
  getMoengageInstance,
} from './moengageHandler';

export {
  initializeMoEngage,
  updateMoengageUser,
} from './moengageInitializer';
