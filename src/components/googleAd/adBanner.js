'use client';
import { useEffect, useRef, useMemo } from 'react';
import { usePathname } from '@/i18n/navigation';
import { useSearchParams } from 'next/navigation';
import { initGPT, displayGPT } from './gpt';
import { cn } from '@/utils';
import configs from '@/configs';

export default function AdBanner({
  adConfig,
  fitContainer = false,
  className,
  stickyAd = false,
  onAdRendered,
}) {
  if (!configs.ENABLE_ADS || !adConfig) return null;
  const { path, size, displaySize, divId, targeting } = adConfig;
  const initializedRef = useRef(false);
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const fullUrl = useMemo(
    () => `${pathname}?${searchParams.toString()}`,
    [pathname, searchParams],
  );
  const previousUrlRef = useRef(fullUrl);

  const containerSize = displaySize || size;
  const isWallpaperAd = size[0] === 1 && size[1] === 1;
  useEffect(() => {
    if (previousUrlRef.current !== fullUrl && !stickyAd) {
      initializedRef.current = false;
      previousUrlRef.current = fullUrl;
    }
  }, [fullUrl]);
  useEffect(() => {
    if (!window.googletag || !divId) return;

    window.googletag.cmd.push(() => {
      const handler = (event) => {
        if (event.slot.getSlotElementId() === divId && !event.isEmpty) {
          onAdRendered?.();
        }
      };

      googletag.pubads().addEventListener('slotRenderEnded', handler);

      return () => {
        googletag.pubads().removeEventListener('slotRenderEnded', handler);
      };
    });
  }, [divId, onAdRendered]);

  useEffect(() => {
    if (initializedRef.current) return;

    const element = document.getElementById(divId);
    if (!element) return;

    element.innerHTML = '';

    const loadAd = () => {
      initGPT({ path, size, divId, targeting });
      displayGPT(divId);
      initializedRef.current = true;
    };

    if (targeting?.requiresPageLoad && document.readyState !== 'complete') {
      window.addEventListener('load', loadAd, { once: true });
      return () => window.removeEventListener('load', loadAd);
    }

    loadAd();
  }, [path, size, divId, targeting, fullUrl]);

  if (isWallpaperAd) {
    return (
      <div
        id={divId}
        style={{
          visibility: 'hidden',
          width: 0,
          height: 0,
          position: 'absolute',
        }}
      />
    );
  }

  return (
    <div
      className={cn('flex justify-center', fitContainer && 'w-full', className)}
    >
      <div
        id={divId}
        className="card flex items-center justify-center rounded-xl overflow-hidden"
        style={{
          width: fitContainer ? '100%' : `${containerSize[0]}px`,
          maxWidth: '100%',
          height: fitContainer ? '100%' : `${containerSize[1]}px`,
          minHeight: `${containerSize[1]}px`,
        }}
      />
    </div>
  );
}
