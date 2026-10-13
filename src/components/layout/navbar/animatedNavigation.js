'use client';

import SsrDropdown from '@/components/common/dropdown/ssrDropdown';
import NextLink from '@/components/common/nextLink';
import NewTag from '@/components/common/newTag';
import TextWithIcon from '@/components/common/textWithIcon/textWithIcon';
import { isSectionEnabled, tenant } from '@/configs';
import { navigationItems, desktopNavigationItems } from '@/data/layout';
import { useNavIndicator } from '@/hooks/useNavIndicator';
import { usePageType } from '@/hooks/usePageType';
import { usePathname } from '@/i18n/navigation';
import { cn } from '@/utils';
import { ChevronDown } from 'lucide-react';
import { useLocale, useTranslations } from 'next-intl';
import { useRef } from 'react';
import { homeClickEvents } from '@/services/analyticsService/events';
import { INTERACTED_FROM } from '@/services/analyticsService/constants';
import { appSections } from '@/constants';

const getCarPriceLinks = (locale) => {
  const links = navigationItems(locale)?.[appSections.CAR_PRICES];
  return links?.filter((item) => isSectionEnabled(item.id)) || [];
};

const getOtherVehicleLinks = (locale) => {
  const links = navigationItems(locale)?.[appSections.VEHICLE_PRICES];
  return links?.filter((item) => isSectionEnabled(item.id)) || [];
};

const getMainMenuLinks = (locale) => {
  const links = navigationItems(locale)?.[appSections.MORE];
  return links?.filter((item) => isSectionEnabled(item.id)) || [];
};

const trackHeaderLinkClick = (
  locale,
  user,
  pageType,
  selected_link,
  pageSection,
  interactedFrom,
) => {
  homeClickEvents['header_link_click']?.(
    locale,
    user,
    pageType || 'home',
    selected_link,
    pageSection,
    interactedFrom,
  );
};

export default function AnimatedNavigation({
  isLightVariant,
  showSearchBar,
  user = {},
}) {
  const t = useTranslations('layout');
  const navLinksRef = useRef(null);
  const pathname = usePathname();
  const pageType = usePageType('home');
  const locale = useLocale();

  const filteredNavigationItems = desktopNavigationItems.filter((item) =>
    isSectionEnabled(item.id),
  );

  const {
    activeTab,
    tabRefs,
    indicatorStyle,
    handleMouseEnter,
    handleMouseLeave,
  } = useNavIndicator(pathname, navLinksRef);

  if (showSearchBar) {
    return null;
  }

  const trackHeaderLinkClick = (selected_link) => {
    homeClickEvents['header_link_click']?.(
      locale,
      user,
      pageType || 'home',
      selected_link,
    );
  };

  return (
    <div
      ref={navLinksRef}
      onMouseLeave={handleMouseLeave}
      className={cn(
        'hidden md:flex items-center min-h-6 md:rtl:text-[13px] lg:rtl:text-[13px] xl:rtl:text-sm  md:rtl:gap-4  xl:rtl:gap-5 gap-4 md:gap-4 xl:gap-5 font-regular relative md:text-sm xl:text-base',
        'transition-all duration-500 ease-in-out',
        showSearchBar
          ? 'opacity-0 translate-x-[-30px] pointer-events-none'
          : 'opacity-100 translate-x-0 pointer-events-auto',
        isLightVariant ? 'text-gray-100' : 'text-gray-500',
      )}
    >
      <div
        className={cn(
          'absolute h-1 rounded-b-full transition-all duration-300 ease-in-out',
          isLightVariant ? 'bg-white text-gray-100 ' : 'bg-primary',
        )}
        style={{
          width: `${indicatorStyle.width}px`,
          height: '6px',
          left: `${indicatorStyle.left}px`,
          opacity: indicatorStyle.opacity,
          top: '-21px',
        }}
      />
      {filteredNavigationItems.map((item) => {
        const isActive = activeTab === item.id;
        const textColor =
          (isLightVariant
            ? isActive && 'text-white'
            : isActive && 'text-primary') || '';

        if (item.dropdown) {
          return (
            <div
              key={item.id}
              ref={(el) => (tabRefs.current[item.id] = el)}
              onMouseEnter={() => handleMouseEnter(item.id)}
              className={textColor}
            >
              <SsrDropdown
                enableHover
                align={item.align || 'center'}
                trigger={
                  <div className="flex items-center gap-1 cursor-pointer">
                    {t(item.label)}
                    <ChevronDown className="w-4 h-4" />
                  </div>
                }
              >
                {item.id === appSections.CAR_PRICES &&
                  renderCarPricesDropdown(t, locale, user, pageType)}
                {item.id === appSections.VEHICLE_PRICES &&
                  renderVehiclePricesDropDown(t, locale, user, pageType)}
                {item.id === appSections.MORE &&
                  renderMoreDropdown(t, locale, user, pageType)}
              </SsrDropdown>
            </div>
          );
        }

        return (
          <NextLink
            key={item.id}
            href={item.href}
            ref={(el) => (tabRefs.current[item.id] = el)}
            onMouseEnter={() => handleMouseEnter(item.id)}
            className={cn('relative inline-flex items-center', textColor)}
            title={item.title}
            onClick={() => trackHeaderLinkClick(item.label)}
          >
            {t(item.label)}
            {item.isNew && (
              <NewTag className="absolute end-0 -top-3.5 z-[1] h-4 w-auto px-1.5 text-[9px] leading-none" />
            )}
          </NextLink>
        );
      })}
    </div>
  );
}

const renderCarPricesDropdown = (t, locale, user, pageType) => {
  const links = getCarPriceLinks(locale);

  if (links.length === 0) return null;

  return (
    <div className="flex flex-col p-3 gap-0">
      {links.map((item, index) => (
        <NextLink
          key={index}
          href={item?.href}
          title={t(item?.label)}
          className="hover:bg-primary-200  rounded-[8px] transition-colors duration-200 p-3"
          onClick={() =>
            trackHeaderLinkClick(locale, user, pageType, item?.label)
          }
        >
          <TextWithIcon
            className="w-full h-full"
            title={t(item.label)}
            description={t(item.description)}
            icon={
              <div
                className={cn('vehicleContainer', `vehicle${item.spriteClass}`)}
              />
            }
            titleClassName="text-base"
            descriptionClassName="text-xs text-gray-500"
          />
        </NextLink>
      ))}
    </div>
  );
};

const renderVehiclePricesDropDown = (t, locale, user, pageType) => {
  const links = getOtherVehicleLinks(locale);

  if (links.length === 0) return null;

  return (
    <div className="flex-2 grid grid-cols-2 p-3 gap-y-3 gap-x-4">
      {links.map((item, index) => (
        <NextLink
          key={index}
          href={item?.href}
          title={t(item?.label)}
          className="hover:bg-primary-200  rounded-[8px] transition-colors duration-200 p-3"
          onClick={() =>
            trackHeaderLinkClick(locale, user, pageType, item?.label)
          }
        >
          {
            <TextWithIcon
              className="w-full h-full"
              title={t(item.label)}
              description={t(item.description)}
              icon={
                <div
                  className={cn(
                    'vehicleContainer',
                    `vehicle${item.spriteClass}`,
                  )}
                />
              }
              titleClassName="text-base"
              descriptionClassName="text-xs text-gray-500"
            />
          }
        </NextLink>
      ))}
    </div>
  );
};

const renderMoreDropdown = (t, locale, user, pageType) => {
  const links = getMainMenuLinks(locale);

  if (links.length === 0) return null;

  return (
    <div className="flex w-full">
      <div
        className={cn(
          'flex-2 grid grid-cols-2 p-3 gap-y-3 gap-x-4',
          links.length < 2 && 'grid-cols-1',
        )}
      >
        {links.map((item, index) => (
          <NextLink
            key={index}
            href={item.href}
            title={t(item?.label)}
            className="hover:bg-primary-200  rounded-[8px] transition-colors duration-200 p-3"
            onClick={() =>
              trackHeaderLinkClick(
                locale,
                user,
                pageType,
                item?.label,
                undefined,
                INTERACTED_FROM.HEADER,
              )
            }
          >
            <TextWithIcon
              className="w-full h-full"
              title={
                <span className="inline-flex items-center gap-2">
                  {t(item.label)}
                  {item.isNew && (
                    <NewTag className="h-4 w-auto px-1.5 text-[9px] leading-none" />
                  )}
                </span>
              }
              description={t(item.description)}
              icon={
                <div
                  className={cn(
                    'vehicleContainer',
                    `vehicle${item.spriteClass}`,
                  )}
                />
              }
              titleClassName="text-base"
              descriptionClassName="text-xs text-gray-500"
            />
          </NextLink>
        ))}
      </div>
    </div>
  );
};
