'use client';

import { CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { navigationItems, mobileNavigationItems } from '@/data/layout';
import { isRtl } from '@/utils/general';
import { useIsMobile } from '@/providers/isMobile';
import { ChevronRight, LogOut, SettingsIcon } from 'lucide-react';
import { useLocale, useTranslations } from 'next-intl';

import { logout } from '@/apis/logout';
import UserSignIn from '@/components/authentication/sign-in';
import { Avatar } from '@/components/common/avatar';
import BaseCard from '@/components/common/baseCard/baseCard';
import Button from '@/components/common/button/button';
import FullScreen from '@/components/common/fullScreen';
import NextImage from '@/components/common/nextImage';
import NextLink from '@/components/common/nextLink';
import Text from '@/components/common/text';
import NewTag from '@/components/common/newTag';
import TextWithIcon from '@/components/common/textWithIcon/textWithIcon';
import { useUser } from '@/providers/user';
import { cn } from '@/utils';
import { isLoggedIn } from '@/utils/general';
import { useState } from 'react';
import styles from './index.module.css';
import { isSectionEnabled } from '@/configs';
import { appPaths, appSections } from '@/constants';
import { getUserPathToRedirect } from '@/utils/general';
import { homeClickEvents } from '@/services/analyticsService/events';
import {
  PAGE_TYPES,
  PAGE_SECTIONS,
  INTERACTED_FROM,
} from '@/services/analyticsService/constants';

const MobileNavDrawer = ({
  isOpen,
  setIsOpen,
  showIconClose,
  showHeader,
  title,
}) => {
  const t = useTranslations('layout');
  const locale = useLocale();
  const rtl = isRtl(locale);
  const isMobile = useIsMobile() ?? false;
  const cardGridLinks = mobileNavigationItems.filter((item) =>
    isSectionEnabled(item.id),
  );
  const [loginModalVisible, setLoginModalVisible] = useState(false);
  const { user, setUser } = useUser();

  // Check if parent sections are disabled
  const isCarPricesDisabled = !isSectionEnabled(appSections.CAR_PRICES);
  const isVehiclePricesDisabled = !isSectionEnabled(appSections.VEHICLE_PRICES);
  const isMoreDisabled = !isSectionEnabled(appSections.MORE);

  // Filter out disabled sections and their items
  const listItemLinks = isMoreDisabled
  ? []
  : navigationItems(locale, isMobile, user)?.more?.filter((item) =>
    isSectionEnabled(item.id),
  );
  const carPrices = isCarPricesDisabled
    ? []
    : navigationItems(locale)?.['car-prices']?.filter((item) =>
      isSectionEnabled(item.id),
    );
  const vehiclePrices = isVehiclePricesDisabled
    ? []
    : navigationItems(locale)?.['vehicle-prices']?.filter((item) =>
      isSectionEnabled(item.id),
    );

  const onLogout = async () => {
    const res = await logout();
    if (res) {
      setUser(null);
    }
  };

  const renderSection = (section, isLastElement = false) => {
    return (
      <NextLink
        href={section?.href}
        key={section.label}
        className={`flex items-center justify-between border-b-gray-100 py-3 ${!isLastElement && 'border-b'
          }`}
        onClick={() => {
          homeClickEvents.header_link_click(
            locale,
            user,
            PAGE_TYPES.MORE_SCREEN,
            t(section.label),
            PAGE_SECTIONS.MORE_SCREEN,
            INTERACTED_FROM.MORE_SCREEN,
          );
          setIsOpen(false);
        }}
      >
        <TextWithIcon
          className="gap-3"
          title={
            <span className="inline-flex items-center gap-2">
              {t(section.label)}
              {section.isNew && <NewTag />}
            </span>
          }
          icon={
            <div
              className={cn('vehicleContainer', [
                `vehicle${section.spriteClass}`,
              ])}
            />
          }
        />
        <ChevronRight size={16} className="text-gray-light flipX" />
      </NextLink>
    );
  };

  const renderProfileSection = () => {
    return (
      <div className="flex flex-col gap-2 w-full">
        <div className="flex flex-col gap-0.5">
          <Text weight="semibold" className="text-base">
            {t('Profile')}
          </Text>
        </div>
        <Button onClick={() => setLoginModalVisible(true)} size="xl">
          {t('Login or Sign up')}
        </Button>
      </div>
    );
  };

  return (
    <FullScreen
      side={rtl ? 'right' : 'left'}
      isOpen={isOpen}
      onClose={setIsOpen}
      headerClassName="border-0 shadow-none border-none"
      containerClassName={cn('gap-0', styles.gradient)}
      showHeader={showHeader}
      showIconClose={showIconClose}
      contentClassName="pt-0"
      title={title}
    >
      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-1">
          <BaseCard
            className={cn(
              'flex flex-row justify-between items-center bg-white px-4 py-3.5 border border-primary-100',
            )}
          >
            {isLoggedIn(user) ? (
              <>
                <TextWithIcon
                  icon={<Avatar className="h-10 w-10 rounded-lg" />}
                  title={user?.name || user?.mobile}
                  titleClassName={'text-2xl font-bold'}
                  descriptionClassName={'text-gray-light text-xs'}
                  description={user?.email}
                  titleDir="ltr"
                />
                <NextLink href={appPaths.userProfileSettings}>
                  <SettingsIcon className="text-disabled" />
                </NextLink>
              </>
            ) : (
              renderProfileSection()
            )}
            <FullScreen
              isOpen={loginModalVisible}
              onClose={() => setLoginModalVisible(false)}
              showIconClose={true}
              showHeader={false}
              contentClassName="justify-center"
            >
              <div className="w-full">
                <UserSignIn
                  setVisible={setLoginModalVisible}
                  isMobile={isMobile}
                  isModal
                />
              </div>
            </FullScreen>
          </BaseCard>
          <div className="grid grid-cols-2  gap-4 px-0 py-4">
            {cardGridLinks.map((item) => {
              return (
                <div key={item.id} className={`w-full h-full`}>
                  <NextLink
                    href={item.link}
                    onClick={() => {
                      homeClickEvents.header_link_click(
                        locale,
                        user,
                        PAGE_TYPES.MORE_SCREEN,
                        t(item.title),
                        PAGE_SECTIONS.MORE_SCREEN,
                      );
                      setIsOpen(false);
                    }}
                  >
                    <BaseCard
                      className={cn(
                        'rounded-md flex flex-col p-0 overflow-hidden gap-0 justify-between  h-full bg-gray-50',
                      )}
                    >
                      <CardHeader className="gap-0 p-2 pb-0 content-start">
                        <CardTitle className="text-sm lg:text-base">
                          {t(item.title)}
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="p-0 flex justify-center items-center">
                        <NextImage
                          src={item?.image}
                          alt="Image"
                          width={166}
                          height={53}
                          className=" w-full"
                          priority
                        />
                      </CardContent>
                    </BaseCard>
                  </NextLink>
                </div>
              );
            })}
          </div>
        </div>

        {!!listItemLinks?.length && (
          <div>
            <Text className="text-gray-700 text-xs font-bold">
              {t('More').toUpperCase()}
            </Text>
            {listItemLinks.map((section) => renderSection(section))}
          </div>
        )}
        {!!carPrices?.length && (
          <div>
            <Text className="text-gray-700 text-xs font-bold">
              {t('Car Prices').toUpperCase()}
            </Text>
            {carPrices.map((section) => renderSection(section))}
          </div>
        )}
        {!!vehiclePrices?.length && (
          <div>
            <Text className="text-gray-700 text-xs font-bold">
              {t('Vehicle Prices').toUpperCase()}
            </Text>
            {vehiclePrices.map((section, index) =>
              renderSection(section, index === vehiclePrices.length - 1),
            )}
          </div>
        )}

        {isLoggedIn(user) && (
          <div>
            <div className="flex items-center justify-between py-3">
              <Text className="font-semibold">{t('Logout')}</Text>
              <LogOut onClick={onLogout} size={16} className="text-danger" />
            </div>
          </div>
        )}
      </div>
    </FullScreen>
  );
};

export default MobileNavDrawer;
