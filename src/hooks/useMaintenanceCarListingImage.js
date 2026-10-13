'use client';

import { useMemo } from 'react';

import { IMAGES_BASE_URL, newVehiclePlaceholder } from '@/constants';
import { getAsset } from '@/utils/general';

function getMakeImageSrc(make) {
  if (!make?.slug && !make?.logo) return null;
  return make.logo || `${IMAGES_BASE_URL}/${make.slug}/thumbnail.png`;
}

function getModelImageSrc(model, size = 'thumbnail') {
  if (!model?.slug) return null;
  return `${IMAGES_BASE_URL}/${model.slug}/${size}.png`;
}

export function useMaintenanceCarListingImage({
  model,
  make,
  manualMakeModel = null,
  enabled = true,
  fallbackImage = null,
  size = 'medium',
}) {
  const isManual = Boolean(manualMakeModel?.trim());
  const hasModelImage = enabled && !isManual && Boolean(model?.logo);
  const defaultFallback = getAsset(`/assets/${newVehiclePlaceholder.car}`);

  const imageSrc = useMemo(() => {
    if (!enabled || isManual) {
      return fallbackImage || getAsset('/assets/car-placeholder.svg');
    }
    if (hasModelImage) return getModelImageSrc(model, size);
    return getMakeImageSrc(make) || fallbackImage || defaultFallback;
  }, [
    enabled,
    isManual,
    fallbackImage,
    defaultFallback,
    hasModelImage,
    model,
    size,
    make,
  ]);

  return {
    imageSrc,
    isListingPhoto: hasModelImage,
  };
}
