'use client';

import { useEffect, useRef, useState } from 'react';
import { useLocale, useTranslations } from 'next-intl';
import { usePathname } from '@/i18n/navigation';
import DrawerWrapper from '@/components/common/drawer';
import NextImage from '@/components/common/nextImage';
import Button from '@/components/common/button/button';
import { getAsset, openAppOrStore } from '@/utils/general';
import { appLinks } from '@/constants';
import { useUser } from '@/providers/user';
import { ChevronRight } from 'lucide-react';
import { continueInAppEvents } from '@/services/analyticsService/events';
const LS_DPV_VIEWS = 'hatla2ee_classified_app_sheet_dpv_views';

export default function DetailPageAppOpenSheet() {
  const t = useTranslations('layout');
  const locale = useLocale();
  const pathname = usePathname();
  const { user } = useUser();
  const [open, setOpen] = useState(false);
  const timeoutRef = useRef(null);
  const { GooglePlay, AppleStore } = appLinks('mweb', 'continue_bottom_sheet');

  useEffect(() => {
    const prevViews = Number(localStorage.getItem(LS_DPV_VIEWS) || 0);
    const views = prevViews + 1;
    localStorage.setItem(LS_DPV_VIEWS, String(views));

    if (views % 3 !== 0) return;

    timeoutRef.current = setTimeout(() => {
      timeoutRef.current = null;
      setOpen(true);
    }, 3000);

    return () => {
      if (timeoutRef.current != null) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
    };
  }, [pathname]);

  const close = () => {
    setOpen(false);
    continueInAppEvents.dismiss(locale, user);
  };

  const openInApp = () => {
    continueInAppEvents.click(locale, user);

    openAppOrStore({
      appleStoreLink: AppleStore,
      googlePlayLink: GooglePlay,
    });

    setOpen(false);
  };

  const renderContent = () => (
    <>
      <p className="text-sm text-center text-gray-500 mt-3">
        {t('Like this car')}
      </p>

      <div className="mt-5">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-2xl bg-gradient-to-r from-[#3160A5] to-[#13253F] p-1.5">
              <NextImage
                src={getAsset('/assets/logo-dark-new.svg')}
                alt=""
                width={50}
                height={50}
                className="size-9 object-contain"
              />
            </div>
            <span className="text-base text-gray-900">{t('Hatla2ee App')}</span>
          </div>

          <Button
            variant="default"
            size="xl"
            onClick={openInApp}
            className="shrink-0 text-sm text-white"
          >
            {t('Open in app')}
          </Button>
        </div>

        <div className="mt-1 flex justify-end">
          <Button
            variant="ghost"
            size="default"
            onClick={close}
            className="!px-0 h-auto gap-0.5 text-sm font-normal text-gray-500  has-[>svg]:!px-0"
          >
            {t('Not now continue in browser')}
            <ChevronRight className="size-4 shrink-0 flipX" aria-hidden />
          </Button>
        </div>
      </div>
    </>
  );

  return (
    <DrawerWrapper
      isOpen={open}
      onClose={close}
      fullScreen={false}
      containerClassName="px-4 pb-5 pt-2"
      childrenClassName="p-0"
    >
      {renderContent()}
    </DrawerWrapper>
  );
}
