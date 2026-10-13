'use client';
import { useEffect, useState } from 'react';
import { getDeviceOS } from '@/utils/general';
import NextImage from '../common/nextImage';
import { useUser } from '@/providers/user';
import { useLocale } from 'next-intl';
import { homeClickEvents } from '@/services/analyticsService/events';
import NextLink from '../common/nextLink';
import { appLinks } from '@/constants';
import { getAsset } from '@/utils/general';
import { useIsMobile } from '@/providers/isMobile';
const StoreButtons = ({ isMobile }) => {
  const [os, setOs] = useState(null);
  const isMob = useIsMobile() ?? false;
  useEffect(() => {
    setOs(getDeviceOS().os);
  }, []);
  const { user } = useUser();
  const locale = useLocale();
  const medium = isMob ? 'mweb' : 'web';
  const { GooglePlay, AppleStore } = appLinks(
    medium,
    'footer',
    `footer_${medium}`,
  );
  const renderGooglePlay = () => {
    return (
      <NextLink href={GooglePlay}>
        <NextImage
          src={getAsset('/assets/footer/google-play-store.svg')}
          width={136}
          height={40}
          className="h-auto w-full lg:w-[135px] object-contain"
          onClick={() =>
            homeClickEvents['app_install_banner_click']?.(
              locale,
              user,
              'google-play',
            )
          }
        />
      </NextLink>
    );
  };
  const renderAppleStore = () => {
    return (
      <NextLink href={AppleStore}>
        <NextImage
          src={getAsset('/assets/footer/apple-store.svg')}
          width={136}
          height={40}
          className="h-auto w-full lg:w-[135px] object-contain"
          onClick={() =>
            homeClickEvents['app_install_banner_click']?.(
              locale,
              user,
              'apple-store',
            )
          }
        />
      </NextLink>
    );
  };

  const renderWebButtons = () => {
    return (
      <div className="grid grid-cols-3 md:grid-cols-6 lg:grid-cols-3 gap-2 sm:gap-6">
        {renderGooglePlay()}
        {renderAppleStore()}
      </div>
    );
  };
  const renderMobileButtons = () => {
    return (
      <div className="w-25">
        {os === 'android' && renderGooglePlay()}
        {os === 'ios' && renderAppleStore()}
      </div>
    );
  };
  return isMobile ? renderMobileButtons() : renderWebButtons();
};
export default StoreButtons;
