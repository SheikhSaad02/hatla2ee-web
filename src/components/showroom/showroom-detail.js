'use client';

import { ChevronLeftIcon, Facebook, Instagram, Map } from 'lucide-react';
import FeaturedBadge from '@/components/common/featuredBadge';
import { useLocale, useTranslations } from 'next-intl';

import BackButton from '../common/backButton';
import Button from '../common/button/button';
import DrawerWrapper from '../common/drawer';
import InfoCTAButtons from '../common/infoCard/infoCtaButtons';
import { LocaleSwitcher } from '../common/LocaleSwitcher';
import NextImage from '../common/nextImage';
import ShareListing from '../common/shareListing/shareListing';
import ShowRoomLocations from './showroom-locations';
import Text from '../common/text';
import { TwitterIcon, YoutubeIcon } from '@/icons/socials';
import { cn } from '@/utils';
import { getAsset, getLocaleString } from '@/utils/general';
import { useState } from 'react';
import { BottomBar } from '../common/bottomBar';
import {
  PAGE_TYPES,
  PAGE_SECTIONS,
} from '@/services/analyticsService/constants';
const ShowRoomDetail = ({ listingDetailData, isMobile, isWebView }) => {
  const t = useTranslations('common');
  const locale = useLocale();

  const trackingItem = {
    agency_name: getLocaleString(listingDetailData, 'name', locale),
    city: listingDetailData?.addresses
      ?.map((addr) => getLocaleString(addr.location, 'name', locale))
      .join(', '),
  };
  const socialIcons = {
    faceBookIcon: (
      <Facebook className="size-4 sm:size-4 stroke-0" fill="#8FAAD3" />
    ),
    instagramIcon: <Instagram className="size-4 sm:size-4 text-[#8FAAD3]" />,
    twitterIcon: (
      <TwitterIcon className="size-4 sm:size-4 stroke-0" fill="#8FAAD3" />
    ),
    youtubeIcon: (
      <YoutubeIcon className="size-4 sm:size-4 stroke-0" fill="#8FAAD3" />
    ),
  };
  const [locationsVisible, setLocationsVisible] = useState(false);

  const renderSocialLinks = (showRoomDetail) => {
    return (
      showRoomDetail && (
        <div className="flex items-center gap-1 md:gap-2">
          {showRoomDetail?.map((data, index) => (
            <Button
              key={index}
              asChild
              variant="tertiary"
              size="icon"
              className="rounded-md size-8"
              href={data?.link || '#'}
            >
              {socialIcons?.[data?.icon]}
            </Button>
          ))}
        </div>
      )
    );
  };
  const renderShowRoomDetailWeb = () => {
    return (
      <div className="relative">
        <div className="rounded-2.5xl border overflow-hidden">
          <NextImage
            src={
              listingDetailData?.cover_image ||
              getAsset('/assets/showroom-cover-placeholder.webp')
            }
            width={1200}
            height={230}
            alt={'Show Rooms Image'}
            className="w-full h-full rounded-md object-cover md:h-[230px]"
          />
        </div>

        <>
          <div className="grid md:grid-cols-[auto_1fr] items-start gap-4 w-full ps-8 ">
            <div className="rounded-2xl border-6 border-gray-100 -mt-[40px] overflow-hidden bg-white">
              <NextImage
                src={
                  listingDetailData?.agency_logo ||
                  getAsset('/assets/showroom-placeholder-image.png')
                }
                width={120}
                height={120}
                alt="Show Room detail"
                className="size-[110px] rounded-md object-contain"
              />
            </div>

            <div className="flex items-center justify-between pt-3 md:gap-4 gap-4">
              <div className="min-w-0 flex-1">
                <Text as="h1" className="font-bold text-3.5xl leading-10">
                  {getLocaleString(listingDetailData, 'name', locale)}
                  {listingDetailData?.featured && (
                    <span className="ml-2 inline-block relative -top-1">
                      <FeaturedBadge />
                    </span>
                  )}
                </Text>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                {renderSocialLinks(listingDetailData?.socialLinks)}
              </div>

              <div className="flex gap-2 items-center justify-end">
                <ShareListing
                  modalTitle={t('Share this Showroom')}
                  image={{ thumbnail: listingDetailData?.agency_logo }}
                  isMob={isMobile}
                  buttonVariant="tertiary"
                  showText={true}
                  title={getLocaleString(listingDetailData, 'name', locale)}
                  btnSize="xl"
                  className="max-w-fit px-2"
                  btnclassName="lg:min-w-32"
                />

                <InfoCTAButtons
                  contactInfo={{ call: listingDetailData?.mobile }}
                  btnSize="xl"
                  profile_image={listingDetailData?.agency_logo}
                  localisedName={getLocaleString(
                    listingDetailData,
                    'name',
                    locale,
                  )}
                  title={t('Contact Showroom')}
                  classNamePhoneNumber="lg:min-w-32"
                  showDisclaimer
                  pageType={PAGE_TYPES.SHOWROOM_DETAIL}
                  pageSection={PAGE_SECTIONS.SHOWROOM_CONTACT}
                  item={trackingItem}
                  locale={locale}
                />
              </div>
            </div>
          </div>
        </>
      </div>
    );
  };

  const getCtaButtons = () => (
    <>
      <InfoCTAButtons
        classWrapper="md:min-w-[220px] flex-1 grid-flow-col"
        contactInfo={{ call: listingDetailData?.mobile }}
        btnSize={isMobile ? 'xl' : 'xxl'}
        profile_image={listingDetailData?.agency_logo}
        localisedName={getLocaleString(listingDetailData, 'name', locale)}
        title={t('Contact Showroom')}
        classNamePhoneNumber="max-sm:px-0 max-sm:flex-1"
        fullWidth
        showDisclaimer
        gaEvent="showroom_phone_view"
        pageType={PAGE_TYPES.SHOWROOM_DETAIL}
        pageSection={PAGE_SECTIONS.SHOWROOM_CONTACT}
        item={trackingItem}
        locale={locale}
      />
      <Button
        onClick={() => {
          setLocationsVisible(true);
        }}
        variant="tertiary"
        className="px-3 max-sm:px-0 max-sm:flex-1"
        icon={<Map className="size-4" />}
        size={isMobile ? 'xl' : 'xxl'}
      >
        {t('Branches')}
      </Button>
    </>
  );

  const renderShowRoomDetailMobile = () => {
    return (
      <>
        <div className="relative w-full  breakout">
          {!isWebView && (
            <BackButton
              variant="glassy"
              className="absolute top-4 start-4 flipX h-8 w-8"
            >
              <ChevronLeftIcon />
            </BackButton>
          )}
          {!isWebView && (
            <div className="absolute end-4 top-4 flex items- gap-3">
              <ShareListing
                modalTitle={t('Share this Showroom')}
                image={{ thumbnail: listingDetailData?.agency_logo }}
                isMob={true}
                buttonVariant={'glassy'}
                showText={false}
                title={getLocaleString(listingDetailData, 'name', locale)}
                // wrapperClassName="absolute end-15 top-5"
                className="items-center"
              />
              <LocaleSwitcher
                className={
                  'h-7 rounded-md  bg-[#6D6D6D66] backdrop-blur-md text-white transition-all duration-300'
                }
              />
            </div>
          )}
          <div className=" border-b overflow-hidden  mb-2">
            <NextImage
              src={
                listingDetailData?.cover_image ||
                getAsset('/assets/showroom-cover-placeholder.webp')
              }
              width={300}
              height={300}
              alt="Showroom Cover"
              className="w-full  h-[120px] object-cover"
            />
          </div>
          <div className="grid  items-center gap-3 w-full px-4">
            <div className="rounded-2.5xl border-3 border-gray-100  overflow-hidden absolute  top-23">
              <NextImage
                src={
                  listingDetailData?.agency_logo ||
                  getAsset('/assets/showroom-logo.webp')
                }
                width={120}
                height={120}
                alt="Show Room detail"
                className="size-[76px] rounded-md object-contain"
              />
            </div>

            {/* second column also a grid */}
            <div className="flex items-center flex-wrap gap-x-3 gap-y-2 justify-between ps-24">
              <div className="flex items-center gap-2">
                <Text as="h1" className="font-bold text-xl leading-7">
                  {getLocaleString(listingDetailData, 'name', locale)}
                </Text>
                {listingDetailData?.featured && <FeaturedBadge />}
              </div>
              {renderSocialLinks(listingDetailData?.socialLinks)}
            </div>
          </div>
        </div>

        {!isMobile ? (
          <div className={cn('flex flex-row-reverse md:flex-row gap-3')}>
            {getCtaButtons()}
          </div>
        ) : (
          <BottomBar className={'flex flex-row-reverse gap-1.5'}>
            {getCtaButtons()}
          </BottomBar>
        )}
      </>
    );
  };

  return isMobile ? (
    <>
      {renderShowRoomDetailMobile()}
      <DrawerWrapper
        fullScreen={false}
        isOpen={locationsVisible}
        onClose={() => {
          setLocationsVisible(false);
        }}
        title={t('Other Branches')}
      >
        <ShowRoomLocations listingDetailData={listingDetailData} />
      </DrawerWrapper>
    </>
  ) : (
    renderShowRoomDetailWeb()
  );
};
export default ShowRoomDetail;
