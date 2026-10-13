'use client';

import { getAsset } from '@/utils/general';
import Image from 'next/image';

export default function NextImage({
  src,
  alt,
  width,
  height,
  className,
  unoptimized = true,
  ...props
}) {
  return (
    <Image
      src={src ? src : getAsset('/assets/car-placeholder.svg')}
      alt={alt || 'Image'}
      width={width}
      height={height}
      className={className}
      unoptimized={unoptimized}
      // loader={() => src || '/assets/car-placeholder.svg'}
      {...props}
    />
  );
}
