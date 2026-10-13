'use client';

import { useState } from 'react';
import { cn } from '@/utils';
import Button from '../button/button';
import { useIsMobile } from '@/providers/isMobile';
import { useTranslations } from 'next-intl';
import { IconHeart } from '@/icons/basicSvgs';
import { useFavoritesContext } from '@/providers/favorites';

export const WishList = ({
  className,
  listingId,
  showText = false,
  onFavoriteClick,
}) => {
  const isMob = useIsMobile() ?? false;
  const t = useTranslations('common');
  const { isFavorite, toggleFavorite } = useFavoritesContext();
  const [isToggling, setIsToggling] = useState(false);

  const isWishlisted = isFavorite(listingId);

  const handleToggleFavorite = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (isToggling) return;

    setIsToggling(true);
    try {
      await toggleFavorite(listingId);
      onFavoriteClick?.();
    } catch (error) {
      console.error('Failed to toggle favorite:', error);
    } finally {
      setIsToggling(false);
    }
  };

  return (
    <Button
      onClick={handleToggleFavorite}
      className={cn(
        'group overflow-hidden transition-all duration-500 gap-0',
        className,
        isWishlisted || showText ? 'opacity-100 visible' : '',
      )}
      variant={!isMob && showText ? 'outline' : 'glassy'}
      icon={
        <IconHeart
          className={cn(isWishlisted ? 'fill-red-600' : 'currentColor')}
        />
      }
      size="sm"
      aria-label="Save"
      disabled={isToggling}
    >
      {!isMob && showText && (
        <span className="whitespace-nowrap max-w-0 overflow-hidden group-hover:max-w-xs transition-all duration-500">
          <span className="ps-1">{isWishlisted ? t('Saved') : t('Save')}</span>
        </span>
      )}
    </Button>
  );
};
