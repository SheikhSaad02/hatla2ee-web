'use client';

import { useEffect, useRef, useState } from 'react';
import { useLocale, useTranslations } from 'next-intl';
import { usePathname } from '@/i18n/navigation';
import { X } from 'lucide-react';
import { Modal } from '@/components/common/modal';
import NextImage from '@/components/common/nextImage';
import Button from '@/components/common/button/button';
import NextLink from '@/components/common/nextLink';
import { getAsset, getDeviceOS } from '@/utils/general';
import { appLinks } from '@/constants';
import { useUser } from '@/providers/user';
import { appBannerEvents } from '@/services/analyticsService/events';
import { getPageTypeFromPath } from '@/services/analyticsService/constants';

const LS_LISTING_VISITS = 'hatla2ee_used_listing_app_modal_visits';
const VISIT_INTERVAL = 4;
const MODAL_VERSION = 'modal_v1';
/* Localised artwork — the in-image app UI is already RTL in the Arabic version,
   so it must not be mirrored via flipX. */
const BG_IMAGE = {
  en: '/assets/app-promo-modal-bg-en.webp',
  ar: '/assets/app-promo-modal-bg-ar.webp',
};

const BENEFIT_KEYS = [
  'Contact unlimited sellers',
  "Track your car's maintenance",
  'Explore detailed price trends',
  'Get the latest updates on cars you love',
];

export default function AppPromoModal() {
  const t = useTranslations('layout');
  const locale = useLocale();
  const pathname = usePathname();
  const { user } = useUser();
  const [open, setOpen] = useState(false);
  const visitCountedRef = useRef(false);
  const impressionTrackedRef = useRef(false);
  const pageType = getPageTypeFromPath(pathname) || 'used_car_results';

  const { GooglePlay, AppleStore } = appLinks('mweb', 'popup_banner');

  /* Safe to read the OS during render: the modal body is client-only (Modal
     lazy-loads with ssr:false and stays unmounted until opened), so there is no
     server render of this href to mismatch against. Play is the fallback. */
  const installLink = getDeviceOS().os === 'ios' ? AppleStore : GooglePlay;

  useEffect(() => {
    /* Every arrival on the listing counts as a visit — a reload or coming back
       from another page each increment. Deps are empty rather than [pathname]
       so in-page filter and pagination navigations, which do change the
       pathname on this route, don't inflate the count.

       The ref guard makes this once per mounted instance: React Strict Mode
       runs effects setup/cleanup/setup in dev, which would otherwise count
       this read-modify-write twice and step the counter by 2. */
    if (visitCountedRef.current) return;
    visitCountedRef.current = true;

    const prevVisits = Number(localStorage.getItem(LS_LISTING_VISITS) || 0);
    const visits = prevVisits + 1;
    localStorage.setItem(LS_LISTING_VISITS, String(visits));

    if (visits % VISIT_INTERVAL !== 0) return;

    setOpen(true);
  }, []);

  useEffect(() => {
    if (!open || impressionTrackedRef.current) return;

    appBannerEvents.impression(locale, user, pageType, MODAL_VERSION);
    impressionTrackedRef.current = true;
  }, [open, locale, user, pageType]);

  const close = () => {
    setOpen(false);
    appBannerEvents.dismiss(locale, user, pageType, MODAL_VERSION);
  };

  const handleDownload = () => {
    appBannerEvents.click(locale, user, pageType, MODAL_VERSION);
    setOpen(false);
  };

  return (
    <Modal
      isOpen={open}
      onClose={close}
      showHeader={false}
      showIconClose={false}
      containerClassName="p-0 overflow-hidden rounded-[12px] w-[320px] max-w-[320px] sm:max-w-[320px]"
      contentClassName="p-0"
    >
      <div className="relative flex h-[569px] max-h-[90dvh] w-full flex-col overflow-hidden">
        <NextImage
          src={getAsset(BG_IMAGE[locale] || BG_IMAGE.en)}
          alt=""
          fill
          sizes="320px"
          aria-hidden
          className="object-cover"
        />

        <div className="relative flex h-full flex-col p-5">
          <Button
            onClick={close}
            variant="ghost"
            size="small"
            aria-label={t('Close')}
            className="absolute end-4 top-4 z-10 flex h-8 w-8 items-center justify-center rounded-full !p-0 text-white hover:bg-white/15"
          >
            <X className="size-5" />
          </Button>

          <h2 className="pe-10 text-xl font-bold leading-tight text-white">
            {t('Get the Full Experience with the Hatla2ee App')}
          </h2>

          <ul className="mt-4 flex flex-col gap-2">
            {BENEFIT_KEYS.map((key) => (
              <li
                key={key}
                className="flex items-start gap-2 text-xs leading-snug text-white"
              >
                <span className="mt-1.5 size-1 shrink-0 rounded-full bg-white" />
                <span>{t(key)}</span>
              </li>
            ))}
          </ul>

          <NextLink
            href={installLink}
            className="mt-auto w-full"
            onClick={handleDownload}
          >
            <Button
              variant="secondary"
              className="w-full rounded-xl py-6 text-base font-bold"
            >
              {t('Download App Now')}
            </Button>
          </NextLink>
        </div>
      </div>
    </Modal>
  );
}
