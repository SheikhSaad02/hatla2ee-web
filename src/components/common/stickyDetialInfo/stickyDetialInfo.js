'use client';

import NewListingActions from '@/components/listing/newVehicleListings/newListingActions';
import { cn } from '@/utils';
import { ChevronLeftIcon } from 'lucide-react';
import { useLocale, useTranslations } from 'next-intl';
import BackButton from '../backButton';
import { Badge } from '../badge/badge';
import InfoCTAButtons from '../infoCard/infoCtaButtons';
import { getContactPresence } from '@/utils/contactDetails';
import InlineItems from '../inlineItems/inlineItems';
import NextImage from '../nextImage';
import Price from '../price/price';
import SpecificationList from '../specificationList/specificationList';
import Text from '../text';
import { useStickyNavOnScroll } from '@/hooks/useStickyNavOnScroll';
import { getDurationInMonths } from '@/utils/car-finance';
import { getLocaleString } from '@/utils/general';
import TextWithIcon from '../textWithIcon/textWithIcon';
import { InfoIcon } from '@/icons';
import {
  PAGE_SECTIONS,
  PAGE_TYPES,
} from '@/services/analyticsService/constants';
import { useIsMobile } from '@/providers/isMobile';
import { Tabs } from '../tabs';
import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  useEffectEvent,
} from 'react';

const scrollToSection = (id, isMob) => {
  const element = document.getElementById(id);
  if (!element) return;

  const yOffset = isMob ? -120 : -220;
  const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;
  window.scrollTo({ top: y, behavior: 'smooth' });
};

const StickyDetailInfo = ({
  id,
  image,
  title,
  specificationList,
  min_deposit,
  min_installment,
  duration,
  financed,
  price,
  type = 'used',
  brochure_url = null,
  mobileElement = 'listing-overview',
  webElement = 'contact-card',
  headerClass,
  titleClassName,
  contact_details,
  ctaMetrics,
  priceNotAvailable,
  href,
  imagesLength,
  item,
  sold_at,
  jumpLinks = [],
}) => {
  const t = useTranslations('common');
  const isMob = useIsMobile() ?? false;
  const isSticky = useStickyNavOnScroll(isMob, mobileElement, webElement);
  const locale = useLocale();
  const durationInMonths = getDurationInMonths(duration);

  const [activeSection, setActiveSection] = useState(null);
  const isScrollingProgrammatically = useRef(false);
  const scrollTimeoutRef = useRef(null);
  const jumpTabsRowRef = useRef(null);

  const visibleJumpLinks = useMemo(
    () => jumpLinks.filter((link) => link.show),
    [jumpLinks],
  );
  const { phone, mobile, whatsapp } = contact_details || {};

  const handleJumpLinkClick = useCallback(
    (section) => {
      isScrollingProgrammatically.current = true;
      setActiveSection(section);
      scrollToSection(section, isMob);

      clearTimeout(scrollTimeoutRef.current);
      // 1500ms lock gives mobile momentum scrolling time to settle
      scrollTimeoutRef.current = setTimeout(() => {
        isScrollingProgrammatically.current = false;
      }, 1500);
    },
    [isMob],
  );

  const onScroll = useEffectEvent(() => {
    if (isScrollingProgrammatically.current) return;

    let current = null;
    for (const link of jumpLinks) {
      if (!link.show) continue;
      const el = document.getElementById(link.id);
      if (el && el.getBoundingClientRect().top <= 200) {
        current = link.id;
      }
    }

    if (current !== null) setActiveSection(current);
  });

  useEffect(() => {
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();

    return () => {
      window.removeEventListener('scroll', onScroll);
      clearTimeout(scrollTimeoutRef.current);
    };
  }, []);

  useLayoutEffect(() => {
    if (!activeSection) return;
    jumpTabsRowRef.current
      ?.querySelector(`[role="tab"][data-state="active"]`)
      ?.scrollIntoView({
        behavior: 'smooth',
        block: 'nearest',
        inline: 'center',
      });
  }, [activeSection]);

  return (
    <div
      className={cn(
        'fixed invisible opacity-0 transition-all duration-400 left-0 -top-full z-40',
        isSticky ? 'visible opacity-100 top-0' : '',
      )}
    >
      <div className="breakout pt-2.5 md:pt-5 pb-0 bg-white shadow-md">
        <div className="container flex flex-col gap-4">
          <div className="flex justify-between w-full items-center gap-3">
            <div
              className={cn(
                'flex gap-1.5 md:gap-3.5 md:items-center grow',
                headerClass,
              )}
            >
              <div className="flex gap-2">
                {isMob && (
                  <BackButton className="w-[30px] h-10 flipX bg-gray-50 shadow-none">
                    <ChevronLeftIcon className="text-gray-700" />
                  </BackButton>
                )}
                <NextImage
                  src={image?.thumbnail}
                  width={isMob ? 40 : 90}
                  height={isMob ? 40 : 90}
                  alt="Car"
                  className={`min-w-10 h-10 md:w-22.5 md:h-22.5 rounded-sm shrink-0 ${
                    imagesLength > 0 ? 'object-cover' : 'object-contain'
                  }`}
                />
              </div>
              <div className="gap-1 md:gap-2 flex flex-col grow">
                {typeof title === 'object' ? (
                  <Text
                    as="p"
                    className={cn(
                      'text-sm md:text-[28px] font-medium md:font-bold',
                      isMob && 'line-clamp-1',
                      titleClassName,
                    )}
                  >
                    <span style={{ display: 'none' }}>{title?.name}</span>
                    {title?.h1}
                  </Text>
                ) : (
                  <Text
                    as="p"
                    className={cn(
                      'text-sm md:text-[28px] font-medium md:font-bold',
                      isMob && 'line-clamp-1',
                      titleClassName,
                    )}
                  >
                    {title}
                  </Text>
                )}

                {isMob &&
                  price &&
                  (priceNotAvailable === true ? (
                    <TextWithIcon
                      className="gap-1.5 text-danger"
                      icon={<InfoIcon className="w-4 h-4" />}
                      titleClassName="text-xs"
                      title={t('Price Not Available')}
                    />
                  ) : (
                    <div className="flex items-center gap-1.5">
                      <Price
                        valueClassName="text-base font-bold leading-none text-primary-800"
                        currencyClassName="font-bold text-base leading-none text-primary-800"
                        value={price}
                      />
                      {financed && (
                        <Badge className="text-[10px] font-bold shrink-0 border-none bg-primary-800 text-white px-1.5 py-0.5 leading-none">
                          {t('Financed')}
                        </Badge>
                      )}
                    </div>
                  ))}

                {specificationList && !isMob && (
                  <SpecificationList
                    specificationList={specificationList}
                    isMob={isMob}
                  />
                )}
              </div>
            </div>
            {!isMob && (
              <div className="flex flex-col">
                <div className="flex flex-col gap-1 md:items-end">
                  {priceNotAvailable === true ? (
                    <TextWithIcon
                      className="gap-1.5  text-danger"
                      icon={<InfoIcon className="w-6 h-6 " />}
                      titleClassName={'text-lg'}
                      title={t('Price Not Available')}
                    />
                  ) : (
                    <div className="flex items-center gap-2">
                      <Price
                        className="text-2xl text-primary-800"
                        valueClassName="font-bold leading-normal"
                        currencyClassName="font-bold text-primary-800 leading-normal"
                        value={price}
                      />
                      {financed && (
                        <Badge className="text-xs font-bold shrink-0 border-none bg-primary-800 text-white py-1">
                          {t('Financed')}
                        </Badge>
                      )}
                    </div>
                  )}
                  {financed && (
                    <div className="flex">
                      <InlineItems
                        className="text-xs md:text-sm text-gray-700"
                        items={[
                          min_deposit && {
                            label: (
                              <>
                                {t('Deposit')}{' '}
                                <Price
                                  value={min_deposit}
                                  valueClassName="max-w-[9ch] truncate"
                                />
                              </>
                            ),
                          },
                          min_installment && {
                            label: (
                              <>
                                {t('Installment ')}
                                <Price
                                  value={min_installment}
                                  valueClassName="max-w-[7ch] truncate"
                                />
                                {t(' /month')}
                              </>
                            ),
                          },
                          durationInMonths && {
                            label: (
                              <>
                                {t('Duration ')}
                                <span className="inline-flex items-baseline">
                                  <span className="leading-none font-bold">
                                    {durationInMonths}
                                  </span>
                                  <span className="leading-none ms-1 font-normal text-muted-foreground">
                                    {t(' Months')}
                                  </span>
                                </span>
                              </>
                            ),
                          },
                        ].filter(Boolean)}
                      />
                    </div>
                  )}
                  {type === 'used' && (
                    <InfoCTAButtons
                      contactInfo={{
                        call: phone || mobile,
                        whatsapp: whatsapp,
                        listingId: id,
                        presence: getContactPresence(contact_details),
                      }}
                      email={contact_details?.email}
                      profile_image={contact_details?.profile_image}
                      localisedName={getLocaleString(
                        contact_details,
                        'name',
                        locale,
                      )}
                      ctaMetrics={ctaMetrics}
                      showDisclaimer
                      item={item}
                      pageSection={PAGE_SECTIONS.STICKY_TAB}
                      pageType={PAGE_TYPES.OFFER_DETAIL}
                      classWrapper="w-full gap-2"
                      sold_at={sold_at}
                    />
                  )}
                  {type === 'new' && (
                    <NewListingActions
                      item={{ id, title, image, brochure_url, href }}
                      fullWidth={true}
                      className={'flex flex-row gap-2'}
                      size="default"
                    />
                  )}
                </div>
              </div>
            )}
          </div>
          {visibleJumpLinks.length > 0 && (
            <div ref={jumpTabsRowRef}>
              <Tabs
                tabsListClassName="w-min border-b-0"
                className="gap-0"
                showContent
                value={activeSection}
                items={visibleJumpLinks.map((link) => ({
                  label: link.label,
                  value: link.id,
                  content: null,
                }))}
                onValueChange={handleJumpLinkClick}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default StickyDetailInfo;
