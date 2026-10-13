//Anything in this file must be imported using absolute paths, else the app will fail during build
import { CDN_PATH } from '../constants/index.js';

export function getCdnWithoutProtocol() {
  return CDN_PATH.replace(/^https?:\/\//, '');
}
