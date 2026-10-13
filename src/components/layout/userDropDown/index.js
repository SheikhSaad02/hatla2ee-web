'use client';

import { ChevronDown, LogOut } from 'lucide-react';

import { Avatar } from '@/components/common/avatar';
import Button from '@/components/common/button/button';
import Dropdown from '@/components/common/dropdown';
import { DropdownMenuSeparator } from '@/components/ui/dropdown-menu';
import NextLink from '@/components/common/nextLink';
import {
  getLocaleString,
  getUserPathToRedirect,
  isLoggedIn,
  isMobile,
} from '@/utils/general';
import { logout } from '@/apis/logout';
import { useMemo, useState } from 'react';
import { useLocale, useTranslations } from 'next-intl';
import { useUser } from '@/providers/user';
import { usePageType } from '@/hooks/usePageType';
import { Modal } from '@/components/common/modal';
import UserSignIn from '@/components/authentication/sign-in';
import { cn } from '@/utils';
import { loginClickEvents } from '@/services/analyticsService/events';
import configs from '@/configs';
import { appPaths } from '@/constants';
export function UserDropdown({ isLightVariant }) {
  const { user, setUser } = useUser();
  const locale = useLocale();

  const userDropDownItems = useMemo(
    () => [
      {
        label: 'My Ads',
        href: appPaths.listings,
      },
      {
        label: 'Saved Ads',
        href: appPaths.favoriteCars,
      },
      ...(configs.ENABLE_CREDIT_USAGE
        ? [
            {
              label: 'Credits Usage',
              href: appPaths.creditsUsage,
            },
          ]
        : []),
      {
        label: 'Settings',
        href: appPaths.userProfileSettings,
      },
      {
        label: 'Logout',
        href: '#',
        icon: <LogOut className="me-2 h-4 w-4 flipX" />,
        onClick: () => onLogout(),
      },
    ],
    [],
  );

  const isMob = isMobile();
  const t = useTranslations('layout');
  const pageType = usePageType('home');
  const [loginModalVisible, setLoginModalVisible] = useState(false);

  const onLogout = async () => {
    try {
      const res = await logout();
      if (res) {
        setUser(null);
        loginModalVisible && setLoginModalVisible(false);
      }
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const renderLoginPopUp = () => {
    return (
      <Modal
        //  radius
        isOpen={loginModalVisible}
        onClose={() => setLoginModalVisible(false)}
        showIconClose={true}
      >
        <div className="w-full">
          <UserSignIn
            setVisible={setLoginModalVisible}
            isMobile={isMob}
            isModal
          />
        </div>
      </Modal>
    );
  };

  return !isMob ? (
    isLoggedIn(user) ? (
      <Dropdown
        align="end"
        className="w-72 p-0"
        trigger={
          <div
            className={cn(
              'flex items-center gap-1 sm:gap-2 border rounded-full pl-1 pr-2 py-[3px] bg-transparent cursor-pointer hover:shadow-sm transition-all duration-200 group',
              isLightVariant
                ? 'border-[#5F8CCF] hover:border-primary-400 hover:bg-[#00000040]'
                : 'border-[#F0F0F0] hover:border-primary-600',
            )}
          >
            {' '}
            <div className="flex items-center space-x-2">
              <Avatar
                src={user?.profile_image}
                alt={getLocaleString(user, 'name', locale)}
                className="h-5 w-5 sm:h-6 sm:w-6 rounded-full"
              />
              {/* <span>
                {getLocaleString(loggedinUser, 'name', locale)?.split(' ')[0]}
              </span> */}
            </div>
            <ChevronDown
              className={cn(
                'h-4 w-4 text-gray-400',
                isLightVariant
                  ? 'group-hover:text-white'
                  : 'group-hover:text-gray-400',
              )}
            />
          </div>
        }
      >
        <div className="flex items-center gap-3 px-3 py-5 bg-primary-100">
          <Avatar
            src={user?.profile_image}
            alt={getLocaleString(user, 'name', locale)}
            className="h-10 w-10"
          />
          <div className="flex flex-col space-y-0.5">
            {/* <p className="text-sm font-medium">{getLocaleString(loggedinUser,'name')}</p>
            <p className="text-xs text-muted-foreground">
              {loggedinUser?.email}
            </p> */}
            <p className="text-sm md:text-xl font-medium" {...(!getLocaleString(user, 'name', locale) && { dir: 'ltr' })}>
              {getLocaleString(user, 'name', locale) || user?.mobile}
            </p>
            <p className="text-xs text-muted-foreground break-all">
              {user?.email}
            </p>
          </div>
        </div>
        <div className="p-2 flex flex-col gap-1">
          {userDropDownItems.map((item, index) => (
            <NextLink key={index} href={item?.href}>
              <div
                className="flex justify-between items-center text-sm px-2 py-2 hover:bg-gray-100 rounded-sm cursor-pointer text-gray-950"
                onClick={item?.onClick && item?.onClick}
              >
                <span>{t(item.label)}</span>
                {item.icon}
              </div>
              {index === userDropDownItems.length - 2 && (
                <DropdownMenuSeparator className={'my-0 bg-gray-100'} />
              )}
            </NextLink>
          ))}
        </div>
      </Dropdown>
    ) : (
      <>
        <Button
          onClick={() => {
            setLoginModalVisible(true);
            loginClickEvents['click_login']?.(locale, user, pageType);
          }}
          //href={`${pathname}#loginModal`}
          size="sm"
        >
          {t('Login')}
        </Button>
        {renderLoginPopUp()}
      </>
    )
  ) : null;
}
