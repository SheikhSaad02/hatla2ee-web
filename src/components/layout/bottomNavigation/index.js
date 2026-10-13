'use client';

import { useMemo, useState } from 'react';

import MobileNavDrawer from '../mobileNavDrawer';
import NextImage from '@/components/common/nextImage';
import NextLink from '@/components/common/nextLink';
import { cn } from '@/utils';
import styles from './index.module.css';
import { usePathname } from '@/i18n/navigation';
import { useLocale, useTranslations } from 'next-intl';
import { useUser } from '@/providers/user';
import { getAsset, getUserPathToRedirect, isLoggedIn } from '@/utils/general';
import { appPaths, appSections, BASE_URL } from '@/constants';
import { isSectionEnabled } from '@/configs';
import { homeClickEvents } from '@/services/analyticsService/events';

const BottomNavigation = ({ show }) => {
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);
  const pathname = usePathname();
  const t = useTranslations('layout');
  const { user } = useUser();
  const locale = useLocale();

  const renderLogo = () => {
    return (
      <NextLink
        href="#"
        className="flex items-center space-x-2 flex-shrink-0"
        localized={false}
      >
        <NextImage
          src={getAsset('/assets/logo-light-new.svg')}
          alt={t('Hatla2ee')}
          title={t('Hatla2ee')}
          width={70}
          height={26}
          className=" h-auto rtl:lg:w-[60px] rtl:xl:w-[90px]"
          priority
        />
      </NextLink>
    );
  };

  const mobileNavigationItems = useMemo(
    () => [
      { label: t('Home'), href: '/', spriteClass: 'home', pageSection: 'home' },
      {
        label: t('Used Cars'),
        href: appPaths.usedCarsListingsSearch,
        spriteClass: 'usedcar',
        pageSection: 'used_cars',
      },
      {
        label: t('Sell Now'),
        href: appPaths.postListing,
        spriteClass: 'sellNow',
        pageSection: 'sell_now',
        eventName: 'click_sell_now',
      },
      isSectionEnabled(appSections.NEW_CARS)
        ? {
            label: t('New Cars'),
            href: appPaths['new-car'],
            spriteClass: 'newcar',
            pageSection: 'new_cars',
          }
        : {
          label: t('My Ads'),
          href: getUserPathToRedirect(appPaths.listings, user, locale),
          spriteClass: 'myAds',
          pageSection: 'my_ads',
        },
      {
        label: t('More'),
        spriteClass: 'more',
        pageSection: 'more',
        onClick: () => setIsMobileNavOpen(true),
      },
    ],
    [t],
  );

  const renderItem = (href, icon, label, spriteClass, isActive) => (
    <>
      <span
        className={cn(
          styles.bottomNavContainer,
          styles[spriteClass],
          isActive && styles[`${spriteClass}-active`],
          'inline-flex',
        )}
      ></span>
      <div
        className={cn(
          isActive ? 'text-primary  font-bold' : 'text-gray-light',
          'text-xs',
        )}
      >
        {label}
      </div>
    </>
  );

  return (
    <>
      <nav
        className={cn(
          'sm:hidden fixed bottom-0 left-0 right-0 z-[40] flex py-3 w-full items-center justify-around bg-white border-t-2 shadow-sm',
          !show && 'hidden',
        )}
      >
        {mobileNavigationItems.map(
          ({ label, icon, href, spriteClass, onClick, pageSection, eventName }) => {
            const isActive =
              href === '/' ? pathname === '/' : pathname.startsWith(href);
            const commonClasses = cn(
              ' text-center text-gray-500 transition-colors hover:text-gray-900 focus:text-gray-900',
            );

            const handleClick = () => {
              homeClickEvents[eventName ? eventName : 'click_bottom_nav'](
                locale,
                user,
                pageSection || label,
                pathname,
              );
            };

            return href ? (
              <NextLink
                key={label}
                href={href}
                className={commonClasses}
                onClick={handleClick}
              >
                {renderItem(href, icon, label, spriteClass, isActive)}
              </NextLink>
            ) : (
              <div
                onClick={() => {
                  handleClick();
                  onClick?.();
                }}
                key={label}
                className={cn(commonClasses, 'cursor-pointer')}
              >
                {renderItem(href, icon, label, spriteClass, isActive)}
              </div>
            );
          },
        )}
      </nav>
      <MobileNavDrawer
        isOpen={isMobileNavOpen}
        setIsOpen={setIsMobileNavOpen}
        showIconClose={true}
        showHeader={true}
        title={renderLogo()}
      />
    </>
  );
};

export default BottomNavigation;
