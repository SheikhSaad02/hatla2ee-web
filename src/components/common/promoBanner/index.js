'use client';

import { useLocale } from 'next-intl';
import Button from '../button/button';
import NextImage from '../nextImage';
import { cn } from '@/utils';
import { useUser } from '@/providers/user';
import { evLandingEvents } from '@/services/analyticsService/events';

export default function PromoBanner({
  image,
  imageAlt,
  imageWidth = 170,
  imageHeight = 100,
  title,
  description,
  buttonLabel,
  buttonHref,
  buttonIcon,
  buttonTarget,
  buttonVariant = 'secondary',
  onButtonClick,
  trackSellEv = false,
  className,
  imageClassName,
}) {
  const locale = useLocale();
  const { user } = useUser();

  const handleButtonClick = (e) => {
    onButtonClick?.(e);
    if (trackSellEv) evLandingEvents.click_sell_ev(locale, user);
  };

  const renderButton = (extraClass) =>
    buttonLabel && (
      <Button
        href={buttonHref}
        target={buttonTarget}
        onClick={handleButtonClick}
        icon={buttonIcon}
        variant={buttonVariant}
        className={cn('flex-shrink-0 font-bold whitespace-nowrap', extraClass)}
      >
        {buttonLabel}
      </Button>
    );

  return (
    <div
      className={cn(
        'flex items-center gap-4 md:gap-6 p-4 md:p-6',
        'bg-[#F5F9FF] rounded-xl',
        className,
      )}
    >
      {image && (
        <NextImage
          src={image}
          alt={imageAlt || title}
          width={imageWidth}
          height={imageHeight}
          className={cn(
            'h-16 md:h-[90px] w-auto object-contain flex-shrink-0',
            imageClassName,
          )}
        />
      )}

      <div className="flex flex-col gap-1 min-w-0">
        {title && (
          <h2 className="text-base md:text-2xl font-bold text-gray-900">
            {title}
          </h2>
        )}
        {description && (
          <p className="text-xs md:text-sm text-gray-500">{description}</p>
        )}
        {renderButton(
        'md:hidden mt-3 h-auto w-fit max-w-full whitespace-normal py-2 text-start leading-tight',
      )}
      </div>

      {renderButton('hidden md:inline-flex ms-auto')}
    </div>
  );
}
