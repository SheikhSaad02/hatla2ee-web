'use client';

import {
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  Carousel as KitCarousel,
} from '@/components/ui/carousel';

import { cn } from '@/utils';
import { WheelGesturesPlugin } from 'embla-carousel-wheel-gestures';
import { useLocale } from 'next-intl';
import React from 'react';
import styles from './carousel.module.css';
import { useIsMobile } from '@/providers/isMobile';
import CarouselDots from './carouselDots';
import { useUser } from '@/providers/user';
import { usePageType } from '@/hooks/usePageType';
import { homeClickEvents } from '@/services/analyticsService/events';

const Carousel = (props) => {
  const { isMobileServer } = props;
  const isMobileFromContext = useIsMobile();
  const isMob = isMobileServer ?? isMobileFromContext ?? false;
  const {
    setApi,
    children,
    itemBasis,
    showArrows = isMob ? false : true,
    carouselOpts = {},
    className = '',
    itemClassName = '',
    contentClassName = '',
    showDots = false,
    showFade = false,
    // Extra embla plugins, appended after the wheel-gesture plugin every
    // carousel gets. Optional — existing callers are unaffected.
    plugins = [],
    pageType,
    pageSection = 'carousel',
  } = props;

  const locale = useLocale();
  const { user } = useUser();
  const detectedPageType = usePageType();
  const direction = locale === 'ar' ? 'rtl' : 'ltr';

  const handleArrowClick = () => {
    homeClickEvents.click_scroll(
      locale,
      user,
      pageType || detectedPageType,
      pageSection,
    );
  };
  const { orientation = 'horizontal', ...restOpts } = carouselOpts;
  const wheelPlugin = WheelGesturesPlugin();

  return (
    <KitCarousel
      setApi={setApi}
      orientation={orientation}
      opts={{ direction, dragFree: true, ...restOpts }}
      className={cn(
        // styles.carouselWrapper,
        className,
      )}
      plugins={[wheelPlugin, ...plugins]}
    >
      <CarouselContent
        className={cn(
          // styles.carouselContent,
          contentClassName,
        )}
      >
        {React.Children.map(children, (child, idx) => {
          if (!child) return null;
          return (
            <CarouselItem
              key={child.key || idx}
              className={cn(
                styles.carouselItem,
                // itemBasis || styles.defaultItemBasis,
                itemBasis,
                itemClassName,
              )}
            >
              {child}
            </CarouselItem>
          );
        })}
      </CarouselContent>

      {!!showArrows && !isMob && (
        <>
          <CarouselPrevious
            className={cn(styles.arrowStyles, styles.arrowLeft)}
            arrowClassName={styles.arrowFade}
            showFade={showFade}
            onArrowClick={handleArrowClick}
          />
          <CarouselNext
            className={cn(styles.arrowStyles, styles.arrowRight)}
            arrowClassName={styles.arrowFade}
            showFade={showFade}
            onArrowClick={handleArrowClick}
          />
        </>
      )}
      {showDots && <CarouselDots />}
    </KitCarousel>
  );
};

export default Carousel;
