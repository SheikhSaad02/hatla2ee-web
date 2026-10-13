'use client';
import { cn } from '@/utils';
import { useTranslations } from 'next-intl';
import BaseCard from '../baseCard/baseCard';
import InfoCTAButtons from '../infoCard/infoCtaButtons';
import NextImage from '../nextImage';
import NextLink from '../nextLink';
import Text from '../text';
import { LocationIcon } from '@/icons/basicSvgs';
import { useLocale } from 'next-intl';
import ClickEventTracker from '@/services/analyticsService/clickTracker';
import FeaturedBadge from '@/components/common/featuredBadge';
import VipBadge from '@/components/common/vipBadge';
import { CardContent } from '@/components/ui/card';
import { useRouter } from '@/i18n/navigation';
import React from 'react';
export default function DealerCard({
  href = '#',
  title,
  location,
  usedCount,
  newCount,
  image,
  phone,
  className,
  titleClassName,
  imageClassName,
  pageType = '',
  pageSection = '',
  gaEvent = '',
  item = {},
  showFeaturedBadge = false,
  showVipBadge = false,
  tile = false,
  centerTile = false,
  logoSize = 190,
  contactModalTitle,
  metaBadge,
  hideContact = false,
}) {
  const t = useTranslations('common');
  const locale = useLocale();
  const router = useRouter();
  const Wrapper = tile ? React.Fragment : CardContent;
  return (
    <ClickEventTracker
      gaEvent={gaEvent}
      pageType={pageType}
      pageSection={pageSection}
      showroom={title}
    >
      <BaseCard
        className={cn(
          'rounded-2xl group flex h-full flex-col gap-0 overflow-hidden box-border bg-white py-0',
          'cursor-pointer transition-shadow duration-300 hover:shadow-sm',
          tile &&
            'rounded-xl border-0 bg-transparent p-0 shadow-none overflow-visible hover:shadow-none',
          centerTile && 'items-center',
          className,
        )}
      >
        <div
          className={cn(
            'relative shrink-0',
            tile
              ? 'flex items-center justify-center overflow-hidden rounded-[12px] bg-white'
              : 'w-full',
          )}
          style={tile ? { width: logoSize, height: logoSize } : undefined}
        >
          {image && (
            <NextImage
              src={image?.src}
              alt={tile ? title || 'Dealer' : 'Image'}
              width={tile ? logoSize : 300}
              height={tile ? logoSize : 300}
              className={cn(
                tile
                  ? 'size-full object-contain object-center p-0'
                  : 'aspect-2/1 w-full cursor-pointer object-contain lg:aspect-5/3',
                imageClassName,
              )}
              onClick={() => router.push(href)}
            />
          )}
          {(showVipBadge || showFeaturedBadge) && (
            <div className="absolute top-2 start-2 flex items-center gap-2">
              {showVipBadge && <VipBadge />}
              {showFeaturedBadge && <FeaturedBadge />}
            </div>
          )}
        </div>

        <Wrapper
          {...(!tile && {
            className:
              'my-0 p-3 flex flex-col gap-1 justify-center h-full border-t border-gray-200',
          })}
        >
          <NextLink
            href={href}
            title={title}
            className={cn(
              'no-underline grid grid-cols-1 gap-1 content-start h-full',
              tile && 'mt-2',
            )}
          >
            <Text
              className={cn(
                'line-clamp-2 text-gray-900',
                tile ? 'text-sm line-clamp-2' : 'text-base',
                centerTile && 'w-full text-center',
                titleClassName,
              )}
              weight="semibold"
            >
              {title}
            </Text>
            {(location || metaBadge) && (
              <div className="flex items-center justify-between gap-2">
                {location && (
                  <div className="flex min-w-0 gap-1 text-gray-700">
                    <LocationIcon size={16} className="shrink-0 mt-0.5" />
                    <Text
                      className="text-xs text-gray-700 line-clamp-2"
                      weight="regular"
                    >
                      {location}
                    </Text>
                  </div>
                )}
                {metaBadge && (
                  <span className="shrink-0 rounded-md bg-gray-100 px-2 py-0.5 text-xs text-gray-600">
                    {metaBadge}
                  </span>
                )}
              </div>
            )}

            {(newCount || usedCount) && (
              <div className="text-xs flex gap-1">
                <Text>{t('Used Cars')}</Text>
                <Text weight="semibold">{usedCount}</Text>
                {' • '}
                {/* <span className="h-[5px] w-[5px] bg-[#bbb] rounded-full inline-block mx-2" />{' '} */}
                {/* sperator '•' */}
                <Text>{t('New Cars')}</Text>
                <Text weight="semibold">{newCount}</Text>
              </div>
            )}
          </NextLink>

          {!hideContact && (
            <div className="px-3 pb-3 pt-0" onClick={(e) => e.stopPropagation()}>
              <InfoCTAButtons
                contactInfo={phone}
                classWrapper="mt-2"
                profile_image={image?.src}
                localisedName={title}
                title={contactModalTitle ?? t('Contact Showroom')}
                fullWidth
                gaEvent="showroom_phone_view"
                clickGAEvent="showroom_phone_click"
                pageType={pageType}
                pageSection={pageSection}
                item={item}
                locale={locale}
                showroomInfo={{ showroom: title, tab: pageSection }}
              />
            </div>
          )}
        </Wrapper>
      </BaseCard>
    </ClickEventTracker>
  );
}
