'use client';

import { useEffect, useRef, useState } from 'react';
import { useLocale, useTranslations } from 'next-intl';
import { usePathname } from '@/i18n/navigation';
import { X } from 'lucide-react';
import { getDeviceOS } from '@/utils/general';
import { appLinks } from '@/constants';
import { getAsset } from '@/utils/general';
import NextImage from '@/components/common/nextImage';
import NextLink from '@/components/common/nextLink';
import Button from '@/components/common/button/button';
import { useUser } from '@/providers/user';
import { useIsMobile } from '@/providers/isMobile';
import { appBannerEvents } from '@/services/analyticsService/events';
import { getPageTypeFromPath } from '@/services/analyticsService/constants';

const BANNER_VERSION = 'v1';

export default function SmartStickyAppBanner() {
  const [os, setOs] = useState(null);
  const [isClosed, setIsClosed] = useState(false);
  const impressionTrackedRef = useRef(false);
  const locale = useLocale();
  const t = useTranslations('layout');
  const { user } = useUser();
  const isMobile = useIsMobile();
  const pathname = usePathname();
  const pageType = getPageTypeFromPath(pathname) || 'home';

  const { GooglePlay, AppleStore } = appLinks('mweb', 'sticky_banner');

  useEffect(() => {
    setOs(getDeviceOS().os);
  }, []);

  useEffect(() => {
    if (isClosed || impressionTrackedRef.current || !isMobile) {
      return;
    }

    appBannerEvents.impression(locale, user, pageType, BANNER_VERSION);
    impressionTrackedRef.current = true;
  }, [locale, user, pathname, isClosed, isMobile, pageType]);

  const getInstallLink = () => {
    if (os === 'android') return GooglePlay;
    if (os === 'ios') return AppleStore;
    return GooglePlay;
  };

  const handleClose = () => {
    setIsClosed(true);
    appBannerEvents.dismiss(locale, user, pageType, BANNER_VERSION);
  };

  if (isClosed || !isMobile) {
    return null;
  }

  return (
    <div className="sticky left-0 right-0 top-0 z-50 sm:hidden">
      <div className="bg-white shadow-[0_2px_8px_rgba(0,0,0,0.1)] px-3 py-2.5 flex items-center gap-3">
        <div className="shrink-0">
          <div className="w-11 h-11 rounded-xl bg-gradient-to-r from-[#3160A5] to-[#13253F] flex flex-col items-center justify-center overflow-hidden p-1.5">
            <NextImage
              src={getAsset('/assets/logo-dark-new.svg')}
              alt="Hatla2ee"
              width={40}
              height={40}
              className="w-8 h-8 object-contain"
            />
          </div>
        </div>

        <div className="flex-1 min-w-0">
          <div className="text-sm font-bold">{t('Hatla2ee App')}</div>
          <div className="text-xs text-gray-500">{t('2M+ Installs')}</div>
        </div>

        <NextLink
          href={getInstallLink()}
          className="shrink-0"
          onClick={() => {
            appBannerEvents.click(locale, user, pageType, BANNER_VERSION);
          }}
        >
          <Button
            variant="secondary"
            className="bg-secondary-600 font-bold px-12 py-5 rounded-lg whitespace-nowrap text-base"
          >
            {t('Install')}
          </Button>
        </NextLink>

        <Button
          onClick={handleClose}
          variant="ghost"
          size="small"
          className="shrink-0 p-0 w-5 h-5 flex items-center justify-center"
          aria-label={t('Close')}
        >
          <X className="size-4 text-gray-800" />
        </Button>
      </div>
    </div>
  );
}
