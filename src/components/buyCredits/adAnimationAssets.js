import { getAsset } from '@/utils/general';

// Every ad clip and the images it references live side by side under here.
export const AD_ASSET_BASE_PATH = getAsset('/assets/buy-credits/');

const AVAILABLE_ASSET_LOCALES = new Set(['ar', 'en']);
const assetLocale = (locale) =>
  AVAILABLE_ASSET_LOCALES.has(locale) ? locale : 'ar';

// One fetch per clip per page load, however many previews ask for it. Only a
// pending or fulfilled request stays cached: a rejection is evicted, or one
// flaky response would keep that product blank for the rest of the page.
const jsonCache = new Map();

export function fetchLottieJson(productId, locale) {
  const key = `${productId}-${assetLocale(locale)}`;
  if (!jsonCache.has(key)) {
    jsonCache.set(
      key,
      fetch(`${AD_ASSET_BASE_PATH}ad-${key}.json`)
        .then((res) => {
          if (!res.ok) throw new Error(`Failed to load ${key} animation`);
          return res.json();
        })
        .catch((error) => {
          jsonCache.delete(key);
          throw error;
        }),
    );
  }
  return jsonCache.get(key);
}

// Clips reference images by filename, so they paint solid until those arrive.
// Each file is warmed and awaited before the old clip is torn down. crossOrigin
// matches lottie's loader; without it the browser downloads each image twice.
const assetPromises = new Map();

function preloadAsset(file) {
  if (!assetPromises.has(file)) {
    assetPromises.set(
      file,
      new Promise((resolve) => {
        const img = new Image();
        img.crossOrigin = 'anonymous';
        img.onload = resolve;
        img.onerror = resolve;
        img.src = `${AD_ASSET_BASE_PATH}${file}`;
      }),
    );
  }
  return assetPromises.get(file);
}

export function preloadLottieAssets(data) {
  const files = (data?.assets || []).map((asset) => asset?.p).filter(Boolean);
  return Promise.all(files.map(preloadAsset));
}

let lottiePromise;

export function loadLottie() {
  if (!lottiePromise) {
    lottiePromise = import('lottie-web/build/player/lottie_light_canvas')
      .then((m) => m.default)
      .catch((error) => {
        // A chunk request that failed once — a stale hash after a deploy, a
        // dropped connection — can succeed on the next try, and caching the
        // rejection would blank every preview on the page until a reload.
        lottiePromise = undefined;
        throw error;
      });
  }
  return lottiePromise;
}
