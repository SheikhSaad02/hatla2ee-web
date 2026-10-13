import {
  AvatarFallback,
  AvatarImage,
  Avatar as KitAvatar,
} from '@/components/ui/avatar';
import { getAsset } from '@/utils/general';

export function Avatar({
  src,
  alt = '',
  fallback = '',
  className,
  imageClassName,
  fallbackClassName,
}) {
  return (
    <KitAvatar className={className} role="button">
      <AvatarImage
        src={src || getAsset('/assets/user-placeholder.svg')}
        alt={alt}
        className={imageClassName}
      />
      <AvatarFallback className={fallbackClassName}>{fallback}</AvatarFallback>
    </KitAvatar>
  );
}
