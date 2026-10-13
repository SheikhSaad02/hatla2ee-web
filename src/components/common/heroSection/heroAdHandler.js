'use client';

import { useEffect, useState } from 'react';

import NextImage from '../nextImage';
import configs from '@/configs';

export default function HeroAdHandler({
  children,
  heroId = 'hero-section',
  imageSrc,
  isMobile = false,
  locale = 'en',
  imageClassName = '',
}) {
  const [adBackground, setAdBackground] = useState(null);
  const [adClickUrl, setAdClickUrl] = useState(null);

  useEffect(() => {
    // Only set up wallpaper on desktop
    if (isMobile || !configs.ENABLE_ADS) return;

    window._setWallpaper = function (data) {
      if (!data) return;
      if (data.imageUrl && data.imageUrl.indexOf('http') === 0) {
        setAdBackground(data.imageUrl);
      }
      if (data.targetUrl && data.targetUrl.indexOf('http') === 0) {
        setAdClickUrl(data.targetUrl);
      }
    };

    if (window._wallpaper) {
      window._setWallpaper(window._wallpaper);
    }

    return () => {
      delete window._setWallpaper;
    };
  }, [isMobile]);

  const handleAdClick = (e) => {
    e.stopPropagation();
    if (adClickUrl) {
      window.open(adClickUrl, '_blank', 'noopener,noreferrer');
    }
  };

  const imageToShow = isMobile ? imageSrc : adBackground || imageSrc;
  const isAdImage = !isMobile && !!adBackground;

  return (
    <>
      {imageToShow && (
        <NextImage
          src={imageToShow}
          fill
          className={`object-cover ${
            isAdImage && locale === 'ar' ? 'flipX' : ''
          } ${isAdImage ? '' : imageClassName}`}
          alt={isAdImage ? 'Advertisement' : 'Hero image'}
          priority
          fetchPriority={isMobile ? 'high' : 'auto'}
          sizes="100vw"
          onClick={isAdImage && adClickUrl ? handleAdClick : undefined}
          style={{ cursor: isAdImage && adClickUrl ? 'pointer' : 'default' }}
        />
      )}

      {children}
    </>
  );
}
