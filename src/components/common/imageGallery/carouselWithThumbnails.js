'use client';

import { NextButton, PrevButton, Thumb } from './emblaButtons';
import React, { useCallback, useEffect, useState } from 'react';

import NextImage from '../nextImage';
import useEmblaCarousel from 'embla-carousel-react';
import { useEmblaPrevNextButtons } from '@/hooks/useEmblaPrevNextButtons';
import { isServer } from '@/utils/general';
import { cn } from '@/utils';

const CarouselWithThumbnails = (props) => {
  const {
    images,
    options = {},
    onSlideClick = () => {},
    mainImgWrapClassName,
    mainImgClassName,
    imageThumbClass,
    imageTags,
  } = props;
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [mainViewportRef, emblaMainApi] = useEmblaCarousel({
    ...options,
    direction: isServer() ? 'ltr' : document.dir,
  });
  const [thumbViewportRef, emblaThumbsApi] = useEmblaCarousel({
    containScroll: 'keepSnaps',
    dragFree: true,
    direction: isServer() ? 'ltr' : document.dir,
  });

  const {
    prevBtnDisabled,
    nextBtnDisabled,
    onPrevButtonClick,
    onNextButtonClick,
  } = useEmblaPrevNextButtons(emblaMainApi);

  const onThumbClick = useCallback(
    (index) => {
      if (!emblaMainApi || !emblaThumbsApi) return;
      emblaMainApi.scrollTo(index);
    },
    [emblaMainApi, emblaThumbsApi],
  );

  const onSelect = useCallback(() => {
    if (!emblaMainApi || !emblaThumbsApi) return;
    setSelectedIndex(emblaMainApi.selectedScrollSnap());
    emblaThumbsApi.scrollTo(emblaMainApi.selectedScrollSnap());
  }, [emblaMainApi, emblaThumbsApi, setSelectedIndex]);

  useEffect(() => {
    if (!emblaMainApi) return;

    const isRtl = document.dir === 'rtl';

    const handleKeyDown = (e) => {
      if (e.key === 'ArrowRight') {
        isRtl ? emblaMainApi.scrollPrev() : emblaMainApi.scrollNext();
      }
      if (e.key === 'ArrowLeft') {
        isRtl ? emblaMainApi.scrollNext() : emblaMainApi.scrollPrev();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [emblaMainApi]);

  useEffect(() => {
    if (!emblaMainApi) return;
    onSelect();
    emblaMainApi.on('select', onSelect).on('reInit', onSelect);
    return () => {
      emblaMainApi.off('select', onSelect).off('reInit', onSelect);
    };
  }, [emblaMainApi, onSelect]);

  return (
    <div className="w-full flex flex-col flex-1">
      <div
        className={cn(
          'relative overflow-hidden rounded-lg md:max-h-[var(--gallery-height)] h-full',
          mainImgWrapClassName,
        )}
        style={{ '--gallery-height': 'calc(100vh - 250px)' }}
        ref={mainViewportRef}
      >
        <div className="flex touch-pan-y h-[inherit]">
          {images.map((image, index) => (
            <React.Fragment key={index}>
              <div
                className={cn('flex-[0_0_100%] bg-black')}
                onClick={(e) => {
                  e.preventDefault();
                  onSlideClick(selectedIndex);
                }}
              >
                <NextImage
                  src={image?.large}
                  width={768}
                  height={400}
                  priority={index === 0}
                  fetchPriority={index === 0 ? 'high' : 'auto'}
                  className={cn('object-contain size-full', mainImgClassName)}
                  alt={image?.alt}
                />
              </div>
            </React.Fragment>
          ))}
        </div>
        {imageTags && imageTags}
        <PrevButton onClick={onPrevButtonClick} disabled={prevBtnDisabled} />
        <NextButton onClick={onNextButtonClick} disabled={nextBtnDisabled} />
      </div>

      <div className={cn('mt-1 md:mt-4', imageThumbClass)}>
        <div className="overflow-hidden" ref={thumbViewportRef}>
          <div className="flex flex-row gap-1 md:gap-2 my-1">
            {images.map((image, index) => (
              <Thumb
                key={index}
                onClick={() => onThumbClick(index)}
                selected={index === selectedIndex}
                image={image?.thumbnail}
                alt={image?.alt}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CarouselWithThumbnails;
