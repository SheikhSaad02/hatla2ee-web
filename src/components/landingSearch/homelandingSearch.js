'use client';

import { Search, SlidersHorizontal } from 'lucide-react';
import { useLocale, useTranslations } from 'next-intl';

import Button from '@/components/common/button/button';
import CarMakeModalSearch from './carMakeModalSearch';
import Filters from './filters';
import { useState } from 'react';
import { cn } from '@/utils';
import { homeClickEvents } from '@/services/analyticsService/events';
import { useUser } from '@/providers/user';
import { useSearchAnalytics } from '@/hooks/useSearchAnalytics';
import { usePageType } from '@/hooks/usePageType';
import { PAGE_SECTIONS } from '@/services/analyticsService/constants';

const HomeLandingSearch = ({ isMobile }) => {
  const [isOpen, setIsOpen] = useState(false);
  const locale = useLocale();
  const { user } = useUser();
  const t = useTranslations('home');
  const commonT = useTranslations('common');
  const handleSearchOpen = useSearchAnalytics('home');
  const pageType = usePageType('home');

  return (
    <div className="flex flex-col w-full  gap-3 lg:gap-4">
      <div className="flex flex-col gap-3">
        <CarMakeModalSearch
          triggerProps={{
            className: cn(isMobile && 'text-sm', isMobile && 'rounded-md'),
            prefix: (
              <Search className="text-primary" size={isMobile ? 14 : 20} />
            ),
            suffix: (
              <Button
                variant="tertiary"
                size={isMobile ? 'sm' : 'default'}
                icon={
                  <SlidersHorizontal
                    className="size-[12px]"
                    size={isMobile ? '12px' : '14px'}
                  />
                }
                onClick={(e) => {
                  e.stopPropagation();
                  homeClickEvents.open_filter(
                    locale,
                    user,
                    pageType,
                    PAGE_SECTIONS.HERO_SECTION,
                  );
                  setIsOpen(true);
                }}
                className="px-2.5 h-[26px]"
              >
                {!isMobile ? commonT('Filters') : ''}
              </Button>
            ),
            size: isMobile ? 'small' : 'large',
          }}
          showInitialOptions
          locale={locale}
          zIndex="25"
          onOpen={handleSearchOpen}
        />
      </div>
      <Button
        href="/car/search"
        variant={'secondary'}
        className={cn('bannerBtn')}
        onClick={() => {
          homeClickEvents['browse_all_cars_click']?.(locale, user);
        }}
      >
        {t('Browse All Cars')}
      </Button>
      <Filters hideSlider={true} isOpen={isOpen} onClose={setIsOpen} />
    </div>
  );
};

export default HomeLandingSearch;
