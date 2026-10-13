'use client';

import {
  Tabs as KitTabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';

import ScrollArea from '../scrollArea';
import { cn } from '@/utils';
import React, { useEffect, useState } from 'react';
import NextLink from '../nextLink';
import { useTranslations } from 'next-intl';
import { homeClickEvents } from '@/services/analyticsService/events';
import { useUser } from '@/providers/user';
import ClickEventTracker from '@/services/analyticsService/clickTracker';
import { PAGE_SECTIONS } from '@/services/analyticsService/constants';
export const Tabs = (props) => {
  const t = useTranslations('common');

  const {
    items,
    onValueChange = () => {},
    variant = 'tabs',
    getOptionLabel = (item) => item?.label,
    getOptionValue = (item) => item?.value,
    className = '',
    triggerClassName = '',
    tabsListClassName = '',
    defaultValue = getOptionValue(items[0]),
    showContent = true,
    value,
    tabClickGaEvent = '',
    locale = '',
    viewAllLink,
    page_type = '',
    autoContentHeight = false,
  } = props;
  const [selected, setSelected] = useState(defaultValue);
  const { user } = useUser();
  const valueChangeHandler = (newValue) => {
    homeClickEvents[tabClickGaEvent]?.(locale, user, newValue, page_type);
    onValueChange(newValue);
    setSelected(newValue);
  };

  useEffect(() => {
    if (defaultValue) {
      setSelected(defaultValue);
    }
  }, [items]);

  const PanelWrapper =
    showContent && autoContentHeight ? 'div' : React.Fragment;

  return (
    <KitTabs
      value={value || selected}
      onValueChange={valueChangeHandler}
      className={className}
    >
      <ScrollArea orientation="horizontal" className={'border-b'}>
        <TabsList
          className={cn(
            variant === 'tabs' ? tabstyles.tabsList : '',
            'w-full',
            tabsListClassName,
          )}
        >
          {items?.map((item, index) => (
            <TabsTrigger
              key={index}
              value={getOptionValue(item)}
              className={cn(
                variant === 'tabs' && tabstyles.TabsTrigger,
                triggerClassName,
              )}
            >
              {item.preffix && item.preffix}
              {item?.href ? (
                <NextLink href={item?.href}>{getOptionLabel(item)}</NextLink>
              ) : (
                <div className={cn()}>{getOptionLabel(item)}</div>
              )}
            </TabsTrigger>
          ))}
          {viewAllLink &&
            items?.map((item, index) => {
              if (!item?.link) return null;

              const currentValue = value || selected;
              const isActive = currentValue === getOptionValue(item);
              return (
                <div
                  key={`viewAll-${index}`}
                  className={cn(
                    'data-[active=true]:block data-[active=false]:hidden ms-auto flex-shrink-0 whitespace-nowrap',
                    isActive ? 'block' : 'hidden',
                  )}
                  data-active={isActive}
                >
                  {item.link?.event ? (
                    <ClickEventTracker
                      gaEvent={item.link?.event?.name}
                      pageType={page_type}
                      pageSection={item.link?.event?.params?.page_section}
                      {...(item.link?.event?.params?.active_tab !==
                        undefined && { activeTab: getOptionValue(item) })}
                    >
                      {item.link?.content}
                    </ClickEventTracker>
                  ) : (
                    item.link?.content
                  )}
                </div>
              );
            })}
        </TabsList>
      </ScrollArea>

      <PanelWrapper
        {...(showContent &&
          autoContentHeight && { className: 'grid w-full grid-cols-1' })}
      >
        {items?.map((item, index) => {
          if (showContent) {
            const isActive = selected === getOptionValue(item);
            return (
              <div
                key={index}
                role="tabpanel"
                aria-hidden={!isActive}
                {...(!autoContentHeight && { hidden: !isActive })}
                className={cn(
                  autoContentHeight && 'col-start-1 row-start-1',
                  autoContentHeight
                    ? 'data-[active=true]:visible data-[active=false]:invisible'
                    : cn(
                        'data-[active=true]:block data-[active=false]:hidden',
                        isActive ? 'block' : 'hidden',
                      ),
                )}
                data-active={isActive}
              >
                {item?.content}
              </div>
            );
          }
          return (
            <TabsContent key={index} value={getOptionValue(item)}>
              {item.content}
            </TabsContent>
          );
        })}
      </PanelWrapper>
    </KitTabs>
  );
};

const tabstyles = {
  tabsList:
    // 'inline-flex h-9 items-center text-muted-foreground justify-start rounded-none border-b bg-transparent',
    '',
  TabsTrigger:
    // 'items-center justify-center whitespace-nowrap text-md ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-background relative h-9 rounded-none border-b-2 border-b-transparent bg-transparent px-5 py-3 font-medium font-semibold text-muted-foreground shadow-none transition-none data-[state=active]:border-b-primary data-[state=active]:text-foreground data-[state=active]:shadow-none',
    '',
};
