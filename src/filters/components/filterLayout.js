'use client';
import Accordion from '@/components/common/accordian';
import Button from '@/components/common/button/button';
import FullScreen from '@/components/common/fullScreen';
import Label from '@/components/common/label';
import Sidebar from '@/components/common/sidebar';
import Text from '@/components/common/text';
import { cn } from '@/utils';
import { createLocaleStringGetter } from '@/utils/general';
import { useLocale, useTranslations } from 'next-intl';
import React from 'react';
import { SlidersHorizontal } from 'lucide-react';
import { useUser } from '@/providers/user';
import { homeClickEvents } from '@/services/analyticsService/events';
import { PAGE_SECTIONS } from '@/services/analyticsService/constants';
import { usePageType } from '@/hooks/usePageType';

const FilterLayout = ({
  open,
  setIsOpen,
  isMobile,
  items,
  quickLinks,
  handleApplyFilters,
  handleClearAllFilters,
  filterCount,
}) => {
  const locale = useLocale();
  const t = createLocaleStringGetter(locale);
  const trans = useTranslations('filters');
  const { user } = useUser();
  const pageType = usePageType('searchresults');

  const applyFilterHandler = () => handleApplyFilters();
  const clearFilterHandler = () => handleClearAllFilters();

  const handleQuickLinkClick = (link) => {
    homeClickEvents.filter_quick_link_click(locale, user, link.key);
  };

  return !isMobile ? (
    <Sidebar
      header={
        <div className="flex items-center justify-between w-full">
          <Text weight="semibold">{trans('Modify Search')}</Text>
        </div>
      }
      className={'px-4 pt-4 pb-2'}
      bottomSlot={
        !!quickLinks?.length && (
          <div className="flex flex-col gap-2 mt-2">
            {quickLinks.map((link) => (
              <Button
                key={link.key}
                variant="tertiary"
                size="lg"
                href={link.link}
                className="whitespace-normal text-center p-2 md:h-auto min-h-10"
                onClick={() => handleQuickLinkClick(link)}
              >
                {t(link, 'label')}
              </Button>
            ))}
          </div>
        )
      }
    >
      <Accordion items={items} />
    </Sidebar>
  ) : (
    <>
      <Button
        size="sm"
        variant="outline"
        className="rounded-2xl text-gray-500 bg-primary-50 h-8"
        onClick={() => {
          homeClickEvents.open_filter(
            locale,
            user,
            pageType,
            PAGE_SECTIONS.FILTERS,
          );
          setIsOpen(true);
        }}
        icon={
          <SlidersHorizontal
            className="size-[12px] text-primary-700"
            size="12px"
          />
        }
      >
        {trans('All Filters')}
      </Button>
      <FullScreen
        isOpen={open}
        onClose={() => setIsOpen((prev) => !prev)}
        showIconClose
        containerClassName={'max-h-auto h-full pb-17'}
        title={trans('Modify Search')}
        footerContent={
          <div className="flex justify-between w-full">
            <Button
              size="lg"
              variant="ghost"
              className="flex-1 text-gray-500"
              onClick={clearFilterHandler}
            >
              {trans('Reset All')}
            </Button>
            <Button size="lg" className="flex-1" onClick={applyFilterHandler}>
              {trans('Apply Filters')} {filterCount}
            </Button>
          </div>
        }
        footerClassName="border-gray-100"
      >
        {items.map((item, index) => (
          <div key={index}>
            <Label className={cn('inline-block mb-2')}>{item.trigger}</Label>
            {item.getContent()}
          </div>
        ))}
      </FullScreen>
    </>
  );
};

export default FilterLayout;
