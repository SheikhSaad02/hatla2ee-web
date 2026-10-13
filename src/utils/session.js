import { getCookie, setCookie } from '@/utils/cookies';
import { generateDeviceID, generateUUID } from '@/utils/general';

export const initializeSession = () => {
  let deviceId = getCookie('device_id');
  if (!deviceId) {
    deviceId = generateDeviceID();
    setCookie('device_id', deviceId);
  }

  let sessionId = getCookie('session_id');
  if (!sessionId) {
    sessionId = generateUUID();
    setCookie('session_id', sessionId);
  }

  return { deviceId, sessionId };
};
