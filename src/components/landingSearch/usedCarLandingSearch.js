'use client';
import Button from '@/components/common/button/button';
import React, { useState } from 'react';
import Filters from './filters';
import { Check, Search, SlidersHorizontal } from 'lucide-react';
import { useLocale, useTranslations } from 'next-intl';
import CarMakeModalSearch from './carMakeModalSearch';
import { cn } from '@/utils';
import { useSearchAnalytics } from '@/hooks/useSearchAnalytics';
import { useUser } from '@/providers/user';
import { usePageType } from '@/hooks/usePageType';
import { homeClickEvents } from '@/services/analyticsService/events';
import { PAGE_SECTIONS } from '@/services/analyticsService/constants';

const UsedCarLandingSearch = ({
  isMobile,
  className,
  browseAllHref = '/car/search',
  fuelOptions,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const locale = useLocale();
  const { user } = useUser();
  const t = useTranslations('home');
  const commonT = useTranslations('common');
  const handleSearchOpen = useSearchAnalytics('used_car_landing');
  const pageType = usePageType('used_car_landing');

  const scopeFilters = fuelOptions?.length
    ? { fuel: fuelOptions.map((o) => o.value) }
    : undefined;
  const fuelSlugs = fuelOptions?.length
    ? fuelOptions.map((o) => o.slug)
    : undefined;

  return (
    <div className={cn('flex  gap-4', className)}>
      <CarMakeModalSearch
        triggerProps={{
          className: cn(isMobile && 'text-sm', isMobile && 'rounded-md'),
          prefix: <Search className="text-primary" size={isMobile ? 14 : 20} />,
          suffix: (
            <Button
              size={isMobile ? 'sm' : 'default'}
              variant="tertiary"
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
        onOpen={handleSearchOpen}
        scopeFilters={scopeFilters}
        fuelSlugs={fuelSlugs}
      />

      <Button
        href={browseAllHref}
        variant={'secondary'}
        className={cn('bannerBtn')}
      >
        {t('Browse All')}
      </Button>

      <Filters
        hideSlider={true}
        isOpen={isOpen}
        onClose={setIsOpen}
        fuelOptions={fuelOptions}
      />
    </div>
  );
};

export default UsedCarLandingSearch;
