import { cn } from '@/utils';
import React from 'react';
import FullWidthBanner from '../fullWidthBanner';
import { isWebViewServer } from '@/utils/serverFunctions';
import HeroAdHandler from './heroAdHandler';
import { isMobileServer } from '@/utils/serverFunctions';
import NextImage from '../nextImage';
import { getLocale } from 'next-intl/server';
const HeroSectionContainer = async ({
  className,
  children,
  containerClassName,
  imageSrc,
  imageClassName = '',
}) => {
  const isWebView = await isWebViewServer();
  const isMobile = await isMobileServer();
  const locale = await getLocale();
  return (
    <FullWidthBanner
      className={
        isMobile
          ? cn(
              ' bg-cover bg-center bg-no-repeat flipX bg-[#132540] pb-4',
              isWebView ? 'mt-[-24px]' : 'mt-[-60px]',
              containerClassName,
            )
          : cn(
              'relative ltr:left-1/2 rtl:right-1/2 w-[min(1872px,calc(100vw-2rem))] ltr:-translate-x-1/2 rtl:translate-x-1/2',
              'bg-cover bg-center bg-no-repeat flipX bg-[#132540]',
              'h-[420px] mt-1 rounded-xl pb-6',
              isWebView ? 'mt-[-24px]' : '',
              containerClassName,
            )
      }
      breakout={isMobile}
    >
      {isMobile && imageSrc && (
        <NextImage
          src={imageSrc}
          fill
          className={cn('object-cover', imageClassName)}
          alt={'Hero image'}
          priority
          fetchPriority={'high'}
          sizes="100vw"
        />
      )}
      {!isMobile && (
        <HeroAdHandler
          imageSrc={imageSrc}
          locale={locale}
          isMobile={isMobile}
          imageClassName={imageClassName}
        />
      )}
      <div
        className={cn(
          'relative z-10 w-full max-w-screen-xl  h-[300px] md:h-[340px]  mx-auto flex items-end md:items-center flipX pointer-events-none',
          className,
        )}
      >
        <div className="pointer-events-auto w-full ">{children}</div>
      </div>
    </FullWidthBanner>
  );
};
export default HeroSectionContainer;
