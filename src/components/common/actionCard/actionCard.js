'use client';

import BaseCard from '../baseCard/baseCard';
import Button from '../button/button';
import Text from '../text';
import { cn } from '@/utils';
import { getAsset } from '@/utils/general';
import { useRouter } from '@/i18n/navigation';
import { usePageType } from '@/hooks/usePageType';
import { Plus } from 'lucide-react';
import { homeClickEvents } from '@/services/analyticsService/events';
import { useUser } from '@/providers/user';
import { PAGE_SECTIONS } from '@/services/analyticsService/constants';
import NextImage from '../nextImage';
import { useIsMobile } from '@/providers/isMobile';

const ActionCard = ({
  title,
  description,
  button,
  btnClassName,
  contentClassName,
  redirectTo,
  style,
  className,
  bannerBackgroundImage = getAsset(
    '/assets/sell-car-banner/sell-car-banner.webp',
  ),
  isMobileServer,
  gaEvent = '',
  locale = '',
  prioritizeImage = false,
  imageClassName,
}) => {
  const router = useRouter();
  const isMobileFromContext = useIsMobile();
  const isMob = isMobileServer ?? isMobileFromContext ?? false;
  const pageType = usePageType('home');
  const { user } = useUser();
  const handleBannerClick = () => {
    if (gaEvent) {
      if (typeof gaEvent === 'function') {
        gaEvent(locale, user, pageType || 'home', PAGE_SECTIONS.BANNER);
      } else {
        homeClickEvents[gaEvent]?.(
          locale,
          user,
          pageType || 'home',
          PAGE_SECTIONS.BANNER,
        );
      }
    }
  };
  const handleButtonClick = () => {
    if (redirectTo) {
      router.push(redirectTo);
    }
  };

  return (
    <BaseCard
      onClick={handleBannerClick}
      className={cn(
        `h-[130px] md:h-auto w-full px-4 py-3 md:px-7 md:py-8 border-none flex flex-col items-start justify-center rtl:items-end flipX bg-cover bg-no-repeat bg-[#1A293D] rounded-xl md:rounded-2xl overflow-hidden relative`,
        isMob && 'gap-0',
        className,
      )}
      // style={{ backgroundImage: `url(${bannerBackgroundImage})`, ...style }}
    >
      <div className="z-10 rtl:text-end">
        <div
          className={cn(
            'flex flex-col flipX max-w-[200px] md:max-w-full z-10 text-start',
            contentClassName,
          )}
        >
          <Text
            as="div"
            className={cn('text-white text-sm md:text-2xl mb-1 font-bold')}
          >
            {title}
          </Text>
          <Text
            as="p"
            className={cn('text-2xs md:text-base mb-3 text-gray-300')}
          >
            {description}
          </Text>
        </div>
        {button && (
          <Button
            href={redirectTo}
            variant="secondary"
            className={cn(
              'text-xs md:text-sm py-2 md:py-1 px-3 md:px-6 flipX z-10',
              btnClassName && btnClassName,
            )}
            onClick={handleButtonClick}
            size={isMob ? 'sm' : 'lg'}
            icon={<Plus strokeWidth={2} />}
          >
            {button}
          </Button>
        )}
      </div>

      <NextImage
        src={bannerBackgroundImage}
        width={1200}
        height={367}
        priority={prioritizeImage}
        fetchPriority={prioritizeImage ? 'high' : 'auto'}
        sizes="(max-width: 768px) 100vw, 1200px"
        className={cn(
          'absolute h-full rtl:left-[8rem] right-[-8rem] w-auto max-w-[unset] md:right-[0] md:max-w-none md:object-cover md:w-[100%]',
          imageClassName,
        )}
      />
    </BaseCard>
  );
};

export default ActionCard;
