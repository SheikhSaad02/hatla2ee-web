'use client';
import React, { useEffect, useState } from 'react';
import FullScreen from '../common/fullScreen';
import { Button } from '../ui/button';
import { ChevronDown, Search } from 'lucide-react';
import { useIsMobile } from '@/providers/isMobile';
import { Modal } from '../common/modal';
import { cn } from '@/utils';
import Label from '@/components/common/label';
import CarMakeModalSearch from './carMakeModalSearch';
import LocationSearch from '@/components/common/locationSearch';
import { RadioGroup } from '@/components/common/radioGroup';
import { CheckboxGroup } from '@/components/common/checkboxGroup';
import { normalizeUiFiltersToQuery } from '@/utils/used-cars/listings/parsingLayer';
import { buildUsedCarListingUrl } from '@/services/urlBuilder/usedCarListingUrl';
import { useRouter } from '@/i18n/navigation';
import FilterRange from '@/filters/components/filterRange';
import { useTranslations, useLocale } from 'next-intl';
import tenantFilterData from '@data';
import { useUser } from '@/providers/user';
import { usePageType } from '@/hooks/usePageType';
import { homeClickEvents } from '@/services/analyticsService/events';
import { PAGE_SECTIONS } from '@/services/analyticsService/constants';
import { getDisplayValue } from '@/utils/used-cars/listings';
import { createLocaleStringGetter } from '@/utils/general';

const Filters = ({ isOpen, onClose, fuelOptions }) => {
  const [filters, setFilters] = useState({});
  const isMob = useIsMobile() ?? false;
  const router = useRouter();
  const locale = useLocale();
  const { user } = useUser();
  const pageType = usePageType();
  const t = useTranslations('common');
  const filterT = useTranslations('filters');
  const tFunc = createLocaleStringGetter(locale);

  const filterLabels = {
    makeModal: t('Brand & Model'),
    year: t('Model Year'),
    city: t('City'),
    range: t('Price'),
    condition: t('Condition'),
  };

  const updateFilter = (key, value) => {
    const filterName = filterLabels[key] || key;
    let filterValue = '';
    
    if (value && typeof value === 'object' && value.min != null && value.max != null) {
      const formatting = key === 'range' ? { type: 'range', formatValue: true } : { type: 'range', formatValue: false };
      filterValue = getDisplayValue(value, tFunc, t, {
        ...formatting,
        locale,
      });
    } else {
      filterValue = value?.slug || value?.label || value || '';
    }

    if (filterValue) {
      homeClickEvents.click_filter(
        locale,
        user,
        pageType,
        PAGE_SECTIONS.HERO_SECTION,
        filterName,
        filterValue,
      );
    }

    setFilters((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const resetFilters = () => {
    setFilters({});
  };

  const applyFilters = () => {
    homeClickEvents.show_results_click(
      locale,
      user,
      pageType || 'home',
      PAGE_SECTIONS.HERO_SECTION,
    );

    const converted_filters = normalizeUiFiltersToQuery(filters);
    const url = buildUsedCarListingUrl(converted_filters);
    router.push(url);
  };

  const handleModalClose = () => {
    onClose(false);
    setFilters({});
  };

  const getFilters = () => {
    return (
      <div className="flex flex-col gap-6 pb-1">
        <div className={cn('gap-2 ')}>
          <Label className={cn('inline-block mb-2')}>
            {t('Brand & Model')}
          </Label>
          <CarMakeModalSearch
            value={filters.makeModal}
            triggerProps={{
              suffix: (
                <Search className="text-primary" size={isMob ? 14 : 20} />
              ),
              size: 'small',
            }}
            onSelect={(selectedOption) => {
              updateFilter('makeModal', selectedOption);
            }}
            routeOnSelect={false}
          />
        </div>
        <div className={cn('gap-2 ')}>
          <Label className={cn('inline-block mb-2')}>{t('Model Year')}</Label>
          <FilterRange
            min={1970}
            max={new Date().getFullYear() + 1}
            step={1}
            value={filters.year}
            onChange={(v) => updateFilter('year', v)}
            className="w-full"
            showReset={false}
            showGoButton={false}
            formatValue={false}
          />
        </div>
        <div className={cn('gap-2')}>
          <Label className={cn('inline-block mb-2')}>{t('City')}</Label>
          <LocationSearch
            value={filters.city}
            onSelect={(selectedOption) => {
              updateFilter('city', selectedOption);
            }}
            triggerProps={{
              size: 'small',
              ...(!isMob && {
                suffix: <ChevronDown className="text-primary" size={20} />,
              }),
            }}
          />
        </div>
        <div className={cn('gap-2 ')}>
          <Label className={cn('inline-block mb-2')}>{t('Price')}</Label>
          <FilterRange
            min={1000}
            max={90000000}
            value={filters.range}
            onChange={(v) => updateFilter('range', v)}
            className="w-full"
            showReset={false}
            showGoButton={false}
          />
        </div>
        <div className={cn('gap-2 ')}>
          <Label className={cn('inline-block mb-2')}>{t('Condition')}</Label>
          <RadioGroup
            value={filters.condition}
            options={tenantFilterData.usedListingsFilterData.condition}
            itemClassName="w-full max-w-[150px]"
            labelClassName="w-full text-center"
            onChange={(value) => updateFilter('condition', value)}
            getOptionValue={(item) => item?.slug}
            getOptionLabel={(item) => t(item?.label)}
            variant="outline"
          />
        </div>
        {fuelOptions?.length > 0 && (
          <div className={cn('gap-2 ')}>
            <Label className={cn('inline-block mb-2')}>{t('Fuel Type')}</Label>
            <CheckboxGroup
              name="fuel"
              options={fuelOptions}
              values={filters.fuel || []}
              getOptionValue={(option) => option.value}
              getOptionLabel={(option) => t(option.label)}
              onChange={(value, checked) => {
                const current = filters.fuel || [];
                updateFilter(
                  'fuel',
                  checked
                    ? [...current, value]
                    : current.filter((v) => v !== value),
                );
              }}
            />
          </div>
        )}
      </div>
    );
  };

  return !isMob ? (
    <Modal
      isOpen={isOpen}
      onClose={handleModalClose}
      title={t('Filters')}
      footerContent={
        <div className="flex gap-2 justify-between w-full">
          <Button
            variant="outline"
            className="border-none shadow-none hover:bg-transparent flex-start"
            onClick={() => {
              resetFilters();
            }}
          >
            {filterT('Clear All')}
          </Button>
          <Button onClick={applyFilters} className="w-[50%]">
            {t('Show Results')}
          </Button>
        </div>
      }
      showIconClose={true}
    >
      {getFilters()}
    </Modal>
  ) : (
    <FullScreen
      containerClassName={'flex flex-col justify-start pb-[60px]'}
      isOpen={isOpen}
      onClose={handleModalClose}
      title={
        <div className="flex items-center gap-2">
          <span>{t('Filters')}</span>
        </div>
      }
      footerClassName="bottom-0 fixed w-full "
      footerContent={
        <div className="flex gap-2 justify-end w-full ">
          <Button
            onClick={() => {
              resetFilters();
            }}
            variant="ghost"
            className="flex-1"
          >
            {filterT('Clear All')}
          </Button>
          <Button onClick={applyFilters} className="flex-1">
            {t('Show Results')}
          </Button>
        </div>
      }
      showIconClose={true}
    >
      {getFilters()}
    </FullScreen>
  );
};

export default Filters;
