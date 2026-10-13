'use client';

import {
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  Carousel as KitCarousel,
} from '@/components/ui/carousel';
import { useEffect, useState } from 'react';
import { useLocale, useTranslations } from 'next-intl';

import NextImage from '../nextImage';
import { cn } from '@/utils';
import { getAsset } from '@/utils/general';
import styles from './imageCarousel.module.css';
import { homeClickEvents } from '@/services/analyticsService/events';
import { useUser } from '@/providers/user';
import { usePageType } from '@/hooks/usePageType';

export function ImageCarousel({
  images = [],
  carouselClassName,
  showArrows = true,
  showItemCount = false,
  totalImageCount = 0,
  prioritizeFirstImage = false,
  pageType = '',
  carouselName = '',
  listingId = '',
  firstImageAlt,
}) {
  const [api, setApi] = useState(null);
  const [current, setCurrent] = useState(0);
  const t = useTranslations('common');
  const { user } = useUser();
  const locale = useLocale();
  const detectedPageType = usePageType();

  useEffect(() => {
    if (!api) return;
    setCurrent(api.selectedScrollSnap() + 1);

    api.on('select', () => {
      setCurrent(api.selectedScrollSnap() + 1);
    });
  }, [api]);

  const direction = locale === 'ar' ? 'rtl' : 'ltr';

  const handleArrowClick = () => {
      homeClickEvents.click_image_scroll(locale, user, detectedPageType, carouselName, listingId);
  };

  return (
    <KitCarousel
      setApi={setApi}
      opts={{ direction }}
      className={cn('group', styles.carouselWrapper, carouselClassName)}
    >
      <CarouselContent>
        {(images.length > 0
          ? images
          : [{ medium: getAsset('/assets/car-placeholder.svg') }]
        ).map((item, index) => (
          <CarouselItem key={index} className={styles.carouselItem}>
            <NextImage
              width={320}
              height={200}
              priority={prioritizeFirstImage && index === 0}
              loading={index === 0 ? undefined : 'lazy'}
              fetchPriority={
                prioritizeFirstImage && index === 0 ? 'high' : 'auto'
              }
              src={item}
              alt={index === 0 && firstImageAlt}
              className={cn('w-full h-full', styles.image)}
            />
            {totalImageCount > 3 && index === images?.length - 1 && (
              <div className="absolute inset-0 bg-black/50 flex items-center justify-center cursor-pointer">
                <span className="bg-white text-xs font-bold  rounded-sm px-3 py-1.5">
                  {t('View All')} ({totalImageCount})
                </span>
              </div>
            )}
          </CarouselItem>
        ))}
      </CarouselContent>

      <div className="flex gap-1 absolute bottom-1 end-2">
        {showArrows && (
          <div
            className={cn('flex gap-1', styles.arrowGroup)}
            onClick={(e) => {
              e.stopPropagation();
              e.preventDefault();
              handleArrowClick();
            }}
          >
            <CarouselPrevious className={cn(styles.carouselPrev)} />
            <CarouselNext className={cn(styles.carouselNext)} />
          </div>
        )}

        {showItemCount && totalImageCount > 1 && (
          <div
            className="bg-black text-white text-center text-xs font-bold rounded-sm leading-5 min-w-11 tabular-nums px-1.5"
            dir="ltr"
          >
            {current} / {totalImageCount}
          </div>
        )}
      </div>
    </KitCarousel>
  );
}
