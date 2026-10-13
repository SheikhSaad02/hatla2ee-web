'use client';
import { Plus } from 'lucide-react';
import BaseCard from '../baseCard/baseCard';
import Button from '../button/button';
import Text from '../text';
import { useRouter } from '@/i18n/navigation';
import { cn } from '@/utils';
import { getAsset } from '@/utils/general';
import { useIsMobile } from '@/providers/isMobile';
import NextLink from '../nextLink';

const ListingBanner = ({
  title,
  description,
  button,
  btnSize,
  btnClassName,
  redirectTo,
  className,
  singleSlot = false,
  bannerBackgroundImage = getAsset('/assets/sell-car-banner-list-v2.webp'),
  bannerBackgroundImageSingleSlot = getAsset(
    '/assets/sell-car-banner-list-compact.webp',
  ),
}) => {
  const router = useRouter();
  const isMobile = useIsMobile() ?? false;

  const handleButtonClick = () => {
    if (redirectTo) {
      router.push(redirectTo);
    }
  };
  return (
    <NextLink
      href={redirectTo}
      prefetch={false}
      className={cn('w-full', className)}
    >
      <BaseCard
        className={cn(
          `w-full px-4 py-3 md:px-7 md:py-6 border-none justify-center rtl:items-end flipX bg-right bg-cover bg-no-repeat bg-[#1A293D] listing-banner`,
          singleSlot && 'listing-banner-single-slot md:px-4',
          className,
        )}
        style={{
          '--banner-image': `url(${bannerBackgroundImage})`,
          ...(singleSlot && {
            '--banner-image-single-slot': `url(${bannerBackgroundImageSingleSlot})`,
          }),
        }}
      >
        <div
          className={cn(
            'max-w-[55%] md:max-w-[230px] text-white flipX',
            singleSlot && 'md:max-w-full',
          )}
        >
          <Text
            as="h5"
            className={cn(
              // the translated copy carries its own line break
              'text-base md:text-[40px] font-extrabold whitespace-pre-line',
              !singleSlot && 'md:mb-4',
              singleSlot && 'md:text-[28px] md:font-bold',
            )}
          >
            {title}
          </Text>
          <Text
            as="p"
            className={cn(
              'text-2xs md:text-sm mb-3 md:mb-6 text-gray-300',
              singleSlot && 'md:mb-8 md:font-medium',
            )}
          >
            {description}
          </Text>
          {button && (
            <Button
              variant="secondary"
              icon={<Plus strokeWidth={3} />}
              className={cn(
                'md:h-11 md:text-base md:w-full rounded-[10px] font-bold',
                btnClassName && btnClassName,
              )}
              onClick={handleButtonClick}
              size={btnSize ? btnSize : isMobile ? 'sm' : ''}
            >
              {button}
            </Button>
          )}
        </div>
      </BaseCard>
    </NextLink>
  );
};

export default ListingBanner;
