'use client';
import { CardContent, CardFooter } from '@/components/ui/card';
import configs from '@/configs';
import { tagList } from '@/data/common';
import { cn } from '@/utils';
import { formatNumberValue } from '@/utils/numbers';
import { BadgeCheck, MapPin, UserRound } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { Badge } from '../badge/badge';
import BaseCard from '../baseCard/baseCard';
import Price from '../price/price';
import { Tooltip } from '../tooltip/tooltip';
import InlineItems from '../inlineItems/inlineItems';
import NextImage from '../nextImage';
import NextLink from '../nextLink';
import Text from '../text';
import { WishList } from '../wishlist/wishlist';
import { Separator } from '@/components/ui/separator';
import { LocationIcon } from '@/icons/basicSvgs';
import { getLocaleString, getLocalisedHrefTitle } from '@/utils/general';
import InfoCTAButtons from './infoCtaButtons';
import { useRouter } from '@/i18n/navigation';
import { IMAGES_BASE_URL } from '@/constants';
import { useIsMobile } from '@/providers/isMobile';
import { ImageCarousel } from '../imageCarousel/imageCarousel';
import SellableBadges from '../sellableBadges/sellableBadges';
import { homeClickEvents } from '@/services/analyticsService/events';
import { useUser } from '@/providers/user';
import React from 'react';

const InfoCard = ({
  href = '#',
  images = [],
  tags = [],
  dealerTag,
  dealerHref,
  title,
  price,
  minInstallment,
  features = [],
  properties = [],
  contactInfo,
  className,
  location,
  hrefTitle,
  id,
  listingChips = [],
  badges = [],
  locale,
  contact_details,
  ctaMetrics,
  item = [],
  pageType = '',
  pageSection = '',
  make,
  totalImageCount = 0,
  prioritizeFirstImage = false,
}) => {
  const t = useTranslations('common');
  const router = useRouter();
  const isMob = useIsMobile() ?? false;
  const tagIcons = {
    'location-icon': <LocationIcon className="min-w-3" />,
  };
  const { user } = useUser();

  const handleFavoriteClick = () => {
    homeClickEvents.click_favourite(locale, user, pageType, pageSection, {
      item,
    });
  };
  const handleTagClick = (tagLabel) => {
    homeClickEvents.click_tag(locale, user, pageType, pageSection, tagLabel);
  };

  const currencyLabel = configs?.currency?.[locale]?.label;
  const isFinanced = listingChips?.some((chip) => chip?.label === 'Financed');

  const showTooltip = String(minInstallment ?? '').length > 6;
  const Wrapper = showTooltip ? Tooltip : React.Fragment;

  const installmentAmount = minInstallment != null && (
    <Wrapper
      {...(showTooltip && {
        content: `${formatNumberValue(minInstallment)} ${currencyLabel}${t('/mo')}`,
        className:
          'border border-gray-200 [&_svg]:border-gray-200 [&_svg]:border-b [&_svg]:border-r',
      })}
    >
      <span className="text-sm text-gray-900 whitespace-nowrap">
        <Price
          value={minInstallment}
          valueClassName="font-normal md:max-w-[7ch] md:truncate"
          currencyClassName="font-normal text-gray-900"
        />
        {t('/mo')}
      </span>
    </Wrapper>
  );
  return (
    <BaseCard
      className={cn(
        'flex flex-col h-full gap-0 p-0 box-border',
        'card group hover:shadow-sm',
        'cursor-pointer',
        className,
      )}
      onClick={() => router.push(href)}
    >
      <div className="relative p-0 m-0">
        <NextLink
          href={href}
          title={
            hrefTitle
              ? `${t('Picture')} ${hrefTitle}`
              : `${t('Picture')} ${title}`
          }
          className="no-underline"
          onClick={(e) => e.stopPropagation()}
        >
          {images?.[0] ? (
            <div className="relative aspect-5/3 overflow-hidden rounded-t-xl">
              {!isMob && !!images?.length ? (
                <ImageCarousel
                  carouselOpts={{ loop: false }}
                  showArrows={images?.length > 1 ? true : false}
                  totalImageCount={totalImageCount}
                  showItemCount={true}
                  images={images}
                  carouselClassName="object-cover w-full h-full transition-transform duration-300"
                  prioritizeFirstImage={prioritizeFirstImage}
                  pageType={pageType}
                  carouselName={pageSection || 'listing_card'}
                  listingId={id}
                  firstImageAlt={title}
                />
              ) : (
                <NextImage
                  src={images?.[0]}
                  alt={title || 'Listing Image'}
                  fill
                  className="object-cover transition-transform duration-300"
                  priority={prioritizeFirstImage}
                  fetchPriority={prioritizeFirstImage ? 'high' : 'auto'}
                  sizes="(max-width: 768px) 50vw, 33vw"
                />
              )}
            </div>
          ) : (
            <div className="flex items-center justify-center bg-primary-50 -ml-3 aspect-5/3">
              <NextImage
                src={`${IMAGES_BASE_URL}/${make?.slug}/thumbnail.png`}
                alt={make?.title || 'Logo'}
                width={140}
                height={140}
                className="object-contain max-h-35 max-w-35"
                priority={!!prioritizeFirstImage}
                fetchPriority={prioritizeFirstImage ? 'high' : 'auto'}
              />
            </div>
          )}
        </NextLink>

        <div className="absolute top-3 start-2 flex flex-wrap gap-2">
          {tagList
            .filter(({ slug }) => tags.includes(slug))
            .map((tag) => (
              <Badge
                key={tag?.slug}
                href={tag?.href}
                asChild={!!tag?.href}
                className="transition-transform duration-200 rounded-sm shadow ease-in-out"
                variant={tag?.variant}
                linkTooltip={t(tag?.title)}
              >
                {tag?.icon && <span>{tag.icon}</span>}
                {t(tag?.title)}
              </Badge>
            ))}
        </div>

        {badges?.length > 0 && (
          <div
            className="absolute bottom-2 start-3 z-10 flex h-5 items-center"
            onClick={(e) => e.stopPropagation()}
          >
            <SellableBadges badges={badges} variant="card" />
          </div>
        )}

        <WishList
          listingId={id}
          className="absolute top-2 end-2 p-1 size-8 cursor-pointer max-lg:opacity-100 opacity-0 group-hover:opacity-100"
          onFavoriteClick={handleFavoriteClick}
        />
      </div>
      <div
        className="flex flex-col flex-1
          group-hover:bg-[linear-gradient(225deg,_#FFFFFF_40%,_#F2F7FF_100%)]
          rtl:group-hover:bg-[linear-gradient(135deg,_#FFFFFF_40%,_#F2F7FF_100%)]
          transition-colors duration-3000"
      >
        <CardContent className="my-0 p-3 lg:pb-0 h-full flex flex-col flex-1 gap-3 border-t border-gray-200">
          <div>
            <NextLink
              href={href}
              title={hrefTitle ? hrefTitle : title}
              className="no-underline"
              onClick={(e) => e.stopPropagation()}
            >
              <Text className="fs-body truncate block mb-0.5" weight="semibold">
                {title}
              </Text>
            </NextLink>

            <Text weight="normal">
              <InlineItems
                items={features}
                locale={locale}
                className="gap-y-1"
              />
              <InlineItems
                separator={
                  <Separator
                    orientation="vertical"
                    className="min-h-3 ms-1 me-2"
                  />
                }
                items={properties}
                className="text-xs gap-y-1"
                locale={locale}
              />
            </Text>
          </div>
          {location && (
            <div className="flex items-center gap-1">
              <MapPin className="text-gray-500 w-4 h-3" />
              <Text className="text-xs" weight="regular">
                {location}
              </Text>
            </div>
          )}

          <div className="flex items-center gap-3">
            <div className="text-lg lg:text-xl font-bold text-primary">
              {formatNumberValue(price)}{' '}
              <span className="text-sm lg:text-base font-normal">
                {currencyLabel}
              </span>
            </div>
            {!isMob && minInstallment != null && (
              <>
                <Separator orientation="vertical" className="min-h-8" />
                {installmentAmount}
              </>
            )}
          </div>

          {isMob && isFinanced && (
            <div className="flex items-center gap-2 w-fit bg-gray-50 rounded-md px-2 py-1">
              <Badge
                variant="secondary"
                className="border-none bg-primary-800 text-white text-xs font-medium py-0.5 rounded-sm"
              >
                {t('Financed')}
              </Badge>
              {installmentAmount}
            </div>
          )}

          <div
            onClick={(e) => {
              e.stopPropagation();
            }}
            className="flex justify-between items-end"
          >
            <div className="flex flex-wrap gap-1.5 items-start max-w-full h-full content-start">
              {listingChips &&
                listingChips.map((data, index) => {
                  const contentLabel = getLocaleString(
                    data,
                    'label',
                    locale,
                    t,
                  );
                  const content = (
                    <>
                      {tagIcons?.[data?.icon] && tagIcons[data.icon]}
                      {contentLabel}
                    </>
                  );

                  return isMob &&
                    data?.label === 'Financed' ? null : data?.href ? (
                    <NextLink
                      key={index}
                      href={data.href}
                      title={getLocalisedHrefTitle(
                        data.hrefTitleKey,
                        data.hrefTitleParams,
                        t,
                        locale,
                      )}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleTagClick(contentLabel);
                      }}
                      className="inline-flex items-center gap-1 text-gray-500 bg-gray-50 hover:text-primary hover:bg-primary-100 text-[11px] px-1.5 py-0.5 rounded-sm border hover:border-primary-300 "
                    >
                      {content}
                    </NextLink>
                  ) : (
                    <div
                      key={index}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleTagClick(contentLabel);
                      }}
                      className="inline-flex items-center gap-1 text-gray-500 bg-gray-50 text-[11px] px-1.5 py-0.5 rounded-sm border hover:border-primary-300 cursor-default"
                    >
                      {content}
                    </div>
                  );
                })}
            </div>
          </div>
        </CardContent>

        <CardFooter className="flex justify-between items-center p-2 md:p-3 gap-2">
          <div className="relative bg-white flex-shrink-0 border rounded-sm">
            {dealerTag ? (
              <NextLink
                href={dealerHref}
                className={'no-underline'}
                onClick={(e) => e.stopPropagation()}
              >
                <NextImage
                  src={dealerTag}
                  alt={t('Dealer Tag')}
                  width={36}
                  height={36}
                  className="w-9 h-9 object-contain rounded-sm"
                />
              </NextLink>
            ) : (
              <div className="p-[7px]">
                <UserRound
                  size={20}
                  className="text-gray-300 fill-gray-300"
                  strokeWidth={0}
                />
              </div>
            )}
            {contactInfo?.isVerified && (
              <BadgeCheck
                className="absolute -end-2 -top-2 h-4 w-4 fill-[#3EA2FF] text-white"
                strokeWidth={1}
              />
            )}
          </div>
          <div onClick={(e) => e.stopPropagation()} className="flex-1">
            <InfoCTAButtons
              contactInfo={contactInfo}
              buttonAsIcon={true}
              showText={false}
              classWrapper="w-full gap-2"
              profile_image={contact_details?.profile_image || dealerTag}
              localisedName={getLocaleString(contact_details, 'name', locale)}
              ctaMetrics={ctaMetrics}
              item={item}
              locale={locale}
              pageType={pageType}
              pageSection={pageSection}
              showDisclaimer
              listingUrl={href}
            />
          </div>
          {/* <InfoCTAButtons
            contactInfo={contactInfo}
            buttonAsIcon={true}
            btnSize={'icon'}
            classWrapper="w-full gap-2"
            // classWrapper="lg:opacity-0 lg:group-hover:opacity-100 transition-opacity duration-200"
            classNameWhatsapp="rounded-sm flex-1"
            classNamePhoneNumber="rounded-sm flex-1"
            profile_image={contact_details?.profile_image || dealerTag}
            localisedName={getLocaleString(contact_details, 'name', locale)}
            ctaMetrics={ctaMetrics}
          /> */}
        </CardFooter>
      </div>
    </BaseCard>
  );
};

export default InfoCard;
