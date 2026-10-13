'use client';

import { onPhoneClick, onWhatsappClick } from '@/utils/numbers';
import Button from '../button/button';
import DrawerWrapper from '../drawer';
import ImageWithContent from '../imageWithContent/imageWithContent';
import { Modal } from '../modal';
import { Phone } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import Text from '../text';
import TextWithIcon from '../textWithIcon/textWithIcon';
import { VerifiedIcon } from '@/icons';
import { WhatsappIcon } from '@/icons/socials';
import { cn } from '@/utils';
import { useIsMobile } from '@/providers/isMobile';
import { useState } from 'react';
import { useLocale, useTranslations } from 'next-intl';
import { adMetricsService } from '@/services/mertrics/adMetrics';
import {
  contactDetailsEvents,
  homeClickEvents,
} from '@/services/analyticsService/events';
import { useUser } from '@/providers/user';
import { useLeadEnforcement } from '@/hooks/useLeadEnforcement';
import { useContactDetails } from '@/hooks/useContactDetails';
import React from 'react';

const InfoCTAButtons = ({
  sold_at,
  contactInfo = {},
  classWrapper,
  fullWidth,
  btnSize = 'default',
  showText = true,
  email,
  profile_image,
  localisedName,
  verified,
  title,
  fullScreen = false,
  classNameWhatsapp,
  classNamePhoneNumber,
  ctaMetrics,
  item = [],
  gaEvent = 'display_phone_click',
  clickGAEvent = 'call_phone_click',
  pageType = '',
  pageSection = '',
  showDisclaimer = false,
  listingUrl,
}) => {
  const isMob = useIsMobile() ?? false;
  const locale = useLocale();
  const [showNumberModal, setShowNumberModal] = useState(false);
  const [isWhatsappLoading, setIsWhatsappLoading] = useState(false);
  const [isPhoneLoading, setIsPhoneLoading] = useState(false);
  const [fetchedContact, setFetchedContact] = useState(null);
  const [errorChannel, setErrorChannel] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);
  const t = useTranslations('common');
  const { user, showLoginModal } = useUser();
  const { enforceLeadLogin } = useLeadEnforcement();

  const presence = contactInfo?.presence;
  const listingId = contactInfo?.listingId ?? ctaMetrics?.listing_id;
  // On-demand fetch is the standard path for listing contact details: it kicks
  // in whenever we have presence flags + a listing id to fetch with. Surfaces
  // that pass raw values instead (showroom/dealer/maintenance) keep working via
  // the raw fallback below.
  const onDemand = !!listingId && !!presence;

  const { fetchContactDetails, resetError } = useContactDetails(listingId);

  const rawPhone = contactInfo?.call;
  const rawWhatsapp = contactInfo?.whatsapp;

  const showPhone = onDemand ? !!presence?.phone : !!rawPhone;
  const showWhatsapp = onDemand ? !!presence?.whatsapp : !!rawWhatsapp;

  // Values used for the reveal modal / channel actions.
  const revealPhone = onDemand ? fetchedContact?.call : rawPhone;
  const revealEmail = onDemand ? fetchedContact?.email : email;

  const shouldEnforceLead = !!ctaMetrics;

  if (!showPhone && !showWhatsapp) return;

  const openPhone = (number) => {
    if (!number) return;
    onPhoneClick(number, setShowNumberModal);
    ctaMetrics &&
      adMetricsService.setCtaMetrics('view', {
        ...ctaMetrics,
        entity: 'phone',
      });
    homeClickEvents[gaEvent]?.(
      locale,
      user,
      pageType,
      gaEvent === 'showroom_phone_view'
        ? { showroom: localisedName || title, tab: pageSection }
        : pageSection,
      gaEvent === 'display_phone_click' && item,
    );
  };

  const openWhatsapp = async (number) => {
    if (!number) return;

    if (!ctaMetrics) {
      onWhatsappClick(number);
      return;
    }

    let traceId;

    try {
      // Ovation returns a trace_id on every ingested metric, so the single
      // 'view' call is enough to correlate the WhatsApp conversation back to
      // this ad. We used to fire an extra 'lead' metric just to read its
      // trace_id, which double-counted the CTA on the reporting side.
      const response = await adMetricsService.setCtaMetrics('view', {
        ...ctaMetrics,
        entity: 'whatsapp',
      });
      traceId = response?.[0]?.trace_id;
    } finally {
      const resolvedUrl = listingUrl
        ? new URL(`/${locale}${listingUrl}`, window.location.origin)
        : new URL(window.location.href);

      if (traceId) {
        resolvedUrl.searchParams.set('traceId', traceId);
      }

      // New-vehicle detail URLs end with listing_external_id
      // (/{locale}/new-*/{make}/{model}/{variantId}/{id}). The lead message
      // should carry listing_id instead, like used and imported URLs do.
      const segments = resolvedUrl.pathname.split('/');
      const isNewVehicleDetail =
        segments.length === 7 &&
        segments[2]?.startsWith('new-') &&
        segments[3] !== 'imported';
      if (isNewVehicleDetail && ctaMetrics?.listing_id) {
        segments[6] = ctaMetrics.listing_id;
        resolvedUrl.pathname = segments.join('/');
      }

      onWhatsappClick(
        number,
        `${t('Whatsapp lead message')}\n${resolvedUrl.toString()}`,
      );

      homeClickEvents['send_whatsapp_click']?.(
        locale,
        user,
        pageType,
        pageSection,
        item,
      );
    }
  };

  // Fallback path (flag OFF): values already in props.
  const handleWhatsappClick = async () => {
    if (!rawWhatsapp || isWhatsappLoading) return;

    if (!ctaMetrics) {
      onWhatsappClick(rawWhatsapp);
      return;
    }

    setIsWhatsappLoading(true);
    try {
      await openWhatsapp(rawWhatsapp);
    } finally {
      setIsWhatsappLoading(false);
    }
  };

  // On-demand path (flag ON): fetch the real value on click, then act.
  const handleOnDemandChannel = async (channel) => {
    const isBusy = channel === 'phone' ? isPhoneLoading : isWhatsappLoading;
    if (isBusy) return;

    const setLoading =
      channel === 'phone' ? setIsPhoneLoading : setIsWhatsappLoading;

    setErrorChannel(null);
    setErrorMessage(null);
    resetError();
    setLoading(true);

    // Open the sheet before the await so the tap paints straight away. Fetching
    // the number needs a reCAPTCHA token, and on a cold page that means pulling
    // Google's bundle first — seconds the visitor would otherwise spend looking
    // at an unchanged button. WhatsApp hands off to another app, so it has no
    // sheet to fill and keeps waiting on the button instead.
    if (channel === 'phone') setShowNumberModal(true);

    try {
      const res = fetchedContact
        ? { contact_details: fetchedContact, cached: true }
        : await fetchContactDetails();

      // Close the sheet first: it is already open with its skeleton, and the
      // login modal would otherwise stack on top of it.
      if (res?.enforceLogin) {
        setShowNumberModal(false);
        showLoginModal(true);
        return;
      }

      if (res?.error || !res?.contact_details) {
        setErrorChannel(channel);
        setErrorMessage(res?.message || null);
        setShowNumberModal(false);
        contactDetailsEvents.fetch_error(locale, user, channel, listingId);
        return;
      }

      const cd = res.contact_details;
      const mapped = res.cached
        ? cd
        : {
            call: cd.phone || cd.mobile,
            whatsapp: cd.whatsapp,
            email: cd.email,
          };

      if (!res.cached) {
        setFetchedContact(mapped);
        contactDetailsEvents.fetch_success(locale, user, channel, listingId);
      }

      const value = channel === 'phone' ? mapped.call : mapped.whatsapp;
      if (!value) {
        setErrorChannel(channel);
        return;
      }

      if (channel === 'phone') {
        openPhone(value);
      } else {
        await openWhatsapp(value);
      }
    } finally {
      setLoading(false);
    }
  };

  const onWhatsappButtonClick = () => {
    enforceLeadLogin(() => {
      if (onDemand) {
        handleOnDemandChannel('whatsapp');
      } else {
        handleWhatsappClick();
      }
    }, shouldEnforceLead);
  };

  const onPhoneButtonClick = () => {
    enforceLeadLogin(() => {
      if (onDemand) {
        handleOnDemandChannel('phone');
      } else {
        openPhone(rawPhone);
      }
    }, shouldEnforceLead);
  };

  const renderPhoneNumber = (phoneNumber) => {
    return (
      <Button
        onClick={() => {
          if (typeof window !== 'undefined') {
            window.location.href = `tel:${phoneNumber}`;
          }
          homeClickEvents[clickGAEvent]?.(
            locale,
            user,
            pageType,
            clickGAEvent === 'showroom_phone_click'
              ? { showroom: localisedName || title, tab: pageSection }
              : pageSection,
            clickGAEvent === 'call_phone_click' && item,
          );
        }}
        icon={<Phone size={20} fill="currentColor" strokeWidth={0} />}
        variant={'default'}
        size={'default'}
        aria-label="Phone"
      >
        <span dir="ltr">{phoneNumber}</span>
      </Button>
    );
  };

  // Mirrors the resolved sheet: avatar + name/email row, then the number button
  // and its disclaimer, so the layout does not jump when the values land.
  const renderPhoneSkeleton = () => (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-3 px-0 p-3 md:px-3">
        <Skeleton className="h-10 w-10 shrink-0 rounded-lg md:h-12 md:w-12" />
        <div className="flex flex-1 flex-col gap-2">
          <Skeleton className="h-4 w-1/2" />
          <Skeleton className="h-3 w-2/3" />
        </div>
      </div>
      <div className="flex flex-col gap-2">
        <Skeleton className="h-10 w-full rounded-md" />
        <Skeleton className="h-3 w-4/5" />
      </div>
    </div>
  );

  const renderContent = () => {
    if (isPhoneLoading) return renderPhoneSkeleton();

    return (
    <>
      {(localisedName || revealPhone || showWhatsapp) && (
        <div className="flex flex-col gap-4">
          {localisedName && (
            <div className="flex rounded-xl justify-between gap-3 items-center px-0 md:px-3 p-3">
              <ImageWithContent
                titleClassName="flex"
                descriptionClassName="flex"
                title={
                  <TextWithIcon
                    titleClassName="font-bold text-sm md:text-base line-clamp-1"
                    className={'gap-0.5 md:gap-1'}
                    title={localisedName}
                    icon={
                      verified ? (
                        <VerifiedIcon className="text-primary w-4 h-4" />
                      ) : undefined
                    }
                    iconPosition={'right'}
                  />
                }
                {...(revealEmail && {
                  description: (
                    <Text className="text-muted-foreground font-normal text-xs md:text-sm line-clamp-1">
                      {revealEmail}
                    </Text>
                  ),
                })}
                imgSrc={profile_image}
                imageProps={{
                  wrapperClassName: 'w-10 h-10 md:w-12 md:h-12 relative',
                  imgClassName: 'rounded-lg',
                  alt: localisedName,
                }}
              />
            </div>
          )}

          <div className="flex flex-col gap-2">
            {Array.isArray(revealPhone)
              ? revealPhone.map((data, index) => (
                  <React.Fragment key={index}>
                    {renderPhoneNumber(data)}
                  </React.Fragment>
                ))
              : renderPhoneNumber(revealPhone)}
            {showDisclaimer && (
              <Text className="text-xs text-gray-600">
                {t(
                  'Hatla2ee is not responsible for the ads validity proceed with caution',
                )}
              </Text>
            )}
          </div>
        </div>
      )}
    </>
    );
  };

  if (sold_at)
    return (
      <div className="w-full bg-gray-600 flex justify-center rounded-md px-2.5 py-3">
        <Text className="text-white font-semibold text-base">
          {t('Sold Out')}
        </Text>
      </div>
    );

  return (
    <>
      <div className={cn('gap-1.5', fullWidth ? 'grid' : 'flex', classWrapper)}>
        {showWhatsapp && (
          <Button
            onClick={onWhatsappButtonClick}
            loading={isWhatsappLoading}
            variant={'tertiary'}
            icon={!isWhatsappLoading ? <WhatsappIcon size={20} /> : undefined}
            className={cn(
              'flex-1 rounded-lg border border-[#DCF6E8] bg-[#e9f7f0] text-[#249f62] shadow-none hover:bg-[#e0f5ea] hover:shadow-none',
              !showText && 'px-0',
              classNameWhatsapp,
            )}
            size={btnSize}
            aria-label="Whatsapp"
          >
            {showText && t('Whatsapp')}
          </Button>
        )}
        {showPhone && (
          <Button
            onClick={onPhoneButtonClick}
            loading={isPhoneLoading}
            icon={
              !isPhoneLoading ? (
                <Phone
                  size={18}
                  fill="currentColor"
                  strokeWidth={0}
                  className="text-primary-800"
                />
              ) : undefined
            }
            variant="ghost"
            className={cn(
              'flex-1 rounded-lg border border-primary-200 bg-primary-50 text-primary-800 shadow-none hover:bg-primary-100 hover:shadow-none',
              classNamePhoneNumber,
            )}
            size={btnSize}
            aria-label="Call"
          >
            {t('Call')}
          </Button>
        )}
      </div>

      {errorChannel && (
        <button
          type="button"
          onClick={() => {
            enforceLeadLogin(
              () => handleOnDemandChannel(errorChannel),
              shouldEnforceLead,
            );
          }}
          className="mt-1.5 text-start text-xs text-red-600 underline"
        >
          {/* The backend's own wording when it sent one — it knows why the
              call failed. The generic line covers the cases it cannot: a
              dropped request, or a seller who simply left the field empty. */}
          {errorMessage || t('contact_details_load_error')}
        </button>
      )}

      {!isMob && (
        <Modal
          isOpen={showNumberModal}
          headerClassName={' py-3 px-4 h-min'}
          containerClassName={'p-0 w-[422] !gap-0'}
          contentClassName={'px-4 pb-4 pt-2'}
          title={title || t('Contact Seller')}
          onClose={() => {
            setShowNumberModal(false);
          }}
        >
          {renderContent()}
        </Modal>
      )}

      {isMob && (
        <DrawerWrapper
          fullScreen={fullScreen}
          isOpen={showNumberModal}
          onClose={() => {
            setShowNumberModal(false);
          }}
          title={title || t('Contact Seller')}
        >
          {renderContent()}
        </DrawerWrapper>
      )}
    </>
  );
};

export default InfoCTAButtons;
