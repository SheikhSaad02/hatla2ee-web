'use client';

import { useEffect, useRef, useState } from 'react';
import { useLocale } from 'next-intl';
import {
  AD_ASSET_BASE_PATH,
  fetchLottieJson,
  loadLottie,
  preloadLottieAssets,
} from '@/components/buyCredits/adAnimationAssets';

// Slide in over 0-45, then loop the highlight 45-135. Frames 45 and 135 are the
// same state, so the wrap is invisible; the 135-180 slide-off never plays.
const SLIDE_END_FRAME = 45;
const HIGHLIGHT_END_FRAME = 135;
const HIGHLIGHT_REST_FRAME = 120;

// Pump's card rotation is a genuine loop, not an arrival.
const LOOPING_PRODUCTS = new Set(['pump']);

// Owns one lottie instance for one ad product and returns the ref for the
// element it renders into. The clip is mounted only while near the viewport and
// destroyed once it isn't; `nextProductId` is prefetched while the tab is idle.
export function useAdAnimation({ productId, nextProductId }) {
  const locale = useLocale();
  const containerRef = useRef(null);
  const animRef = useRef(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = containerRef.current;
    if (!el || typeof IntersectionObserver === 'undefined') return;
    const observer = new IntersectionObserver(
      ([entry]) => setInView(entry.isIntersecting),
      {
        rootMargin: '50% 0px 50% 0px',
      },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!inView) {
      animRef.current?.destroy();
      animRef.current = null;
      return undefined;
    }

    let cancelled = false;
    const reducedMotion =
      typeof window !== 'undefined' &&
      window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;

    (async () => {
      const [lottie, data] = await Promise.all([
        loadLottie(),
        fetchLottieJson(productId, locale),
      ]).catch((error) => {
        // Handled here rather than left to reject: an unhandled rejection from
        // the chunk import is noise, and it would skip the cleanup below.
        console.error('[buy-credits] ad animation failed to load', error);
        return [];
      });
      if (cancelled || !containerRef.current) return;

      // With no clip to show, drop whatever is on screen — leaving it would
      // play the previous product's ad under this product's copy.
      if (!lottie || !data) {
        animRef.current?.destroy();
        animRef.current = null;
        return;
      }

      // Tearing the live clip down before these load leaves a white canvas.
      await preloadLottieAssets(data);
      if (cancelled || !containerRef.current) return;

      const playsStraightThrough = LOOPING_PRODUCTS.has(productId);
      animRef.current?.destroy();
      const anim = lottie.loadAnimation({
        container: containerRef.current,
        renderer: 'canvas',
        loop: playsStraightThrough,
        autoplay: false,
        animationData: data,
        // Filename-referenced, so every ad clip shares one image download.
        assetsPath: AD_ASSET_BASE_PATH,
        rendererSettings: {
          // deviceFrame locks the screen to 568x480, so this fits exactly.
          preserveAspectRatio: 'xMidYMid meet',
        },
      });
      animRef.current = anim;

      if (reducedMotion) {
        anim.goToAndStop(playsStraightThrough ? 0 : HIGHLIGHT_REST_FRAME, true);
      } else if (playsStraightThrough) {
        anim.play();
      } else {
        anim.playSegments([0, SLIDE_END_FRAME], true);
        anim.addEventListener('complete', function onSlideIn() {
          anim.removeEventListener('complete', onSlideIn);
          anim.setLoop(true);
          anim.playSegments([SLIDE_END_FRAME, HIGHLIGHT_END_FRAME], true);
        });
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [inView, productId, locale]);

  useEffect(() => {
    if (!inView || !nextProductId) return;
    const idle = window.requestIdleCallback || ((cb) => setTimeout(cb, 200));
    idle(() =>
      fetchLottieJson(nextProductId, locale)
        .then(preloadLottieAssets)
        .catch(() => {}),
    );
  }, [inView, nextProductId, locale]);

  useEffect(() => () => animRef.current?.destroy(), []);

  return containerRef;
}
