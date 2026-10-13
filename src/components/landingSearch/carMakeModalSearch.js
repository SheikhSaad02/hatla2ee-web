'use client';

import { getLocaleString } from '@/utils/general';
import { useIsMobile } from '@/providers/isMobile';
import { useCallback, useEffect, useState } from 'react';
import { useLocale, useTranslations } from 'next-intl';

import { ChipWithIcon } from '@/components/common/chip-with-icon/chip-with-icon';
import ListItemCard from '@/components/common/listItemCard/listItemCard';
import { MakeModelSearchService } from '@/services/elasticsearch/make-model-search-service';
import { ModelsService } from '@/services/elasticsearch/models-service';
import NextLink from '../common/nextLink';
import OptionCard from '@/components/common/optionCard/optionCard';
import Price from '@/components/common/price/price';
import ScrollArea from '@/components/common/scrollArea';
import Select from '@/components/common/select/select';
import { cn } from '@/utils';
import { formatNumberValue } from '@/utils/numbers';
import tenantData from '@data';
import { transformRecentlySearched } from '@/mappers/listings';
import { useRecentlyViewedAndSearched } from '@/hooks/useRecentlyViewedAndSearched';
import { useRouter } from '@/i18n/navigation';
import { useUser } from '@/providers/user';
import { PAGE_SECTIONS } from '@/services/analyticsService/constants';
import { homeClickEvents } from '@/services/analyticsService/events';
import { usePageType } from '@/hooks/usePageType';
import { buildUsedCarListingUrl } from '@/services/urlBuilder/usedCarListingUrl';
import { MULTI_VALUE_SEPARATOR } from '@/constants';

const appendScopeToUrl = (url, scopeFilters) => {
  const fuel = scopeFilters?.fuel;
  if (!url || !Array.isArray(fuel) || fuel.length === 0) return url;
  const param = `fuel=${fuel.join(MULTI_VALUE_SEPARATOR)}`;
  return url.includes('?') ? `${url}&${param}` : `${url}?${param}`;
};

export default function CarMakeModalSearch({
  triggerProps,
  showInitialOptions = false,
  onSelect = () => {},
  onOpen = () => {},
  value,
  popoverClass,
  variant,
  routeOnSelect = true,
  selectRef,
  zIndex,
  pageSection = PAGE_SECTIONS.HERO_SECTION,
  placeholder,
  scopeFilters,
  fuelSlugs,
}) {
  const locale = useLocale();
  const isMobile = useIsMobile() ?? false;
  const { user } = useUser();
  const pageType = usePageType('home');
  const [initialOptions, setInitialOptions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [topModels, setTopModels] = useState([]);
  const t = useTranslations('home');
  const { push } = useRouter();
  const priceRanges = tenantData?.usedListingsFilterData?.priceRanges;

  const handleSelect = (selectedOption, searchQuery = '') => {
    const optionLabel = selectedOption.label || '';
    if (searchQuery) {
      homeClickEvents.search_complete(
        locale,
        user,
        pageType,
        pageSection,
        searchQuery,
        optionLabel,
      );
    }

    onSelect(selectedOption);

    if (routeOnSelect) {
      // Free-search + suggestion selections → scope to EV fuels on the EV page.
      push(
        buildUsedCarListingUrl({
          make: selectedOption.make,
          ...(selectedOption.model && { model: selectedOption.model }),
          ...scopeFilters,
        }),
      );
    }
  };

  const carInitialContent = (
    <CarSearchInitialView
      popularCars={topModels}
      priceRanges={priceRanges}
      onSelect={handleSelect}
      locale={locale}
      isMobile={isMobile}
      pageType={pageType}
      user={user}
      scopeFilters={scopeFilters}
    />
  );

  useEffect(() => {
    const loadInitialOptions = async () => {
      setLoading(true);
      const [options, topModels] = await Promise.all([
        MakeModelSearchService.getSuggestions('', 20, locale),
        // Scope the "Most Searched Cars" list to the given fuels (EV page).
        ModelsService.getTopModels(12, fuelSlugs),
      ]);
      setInitialOptions(options);
      setTopModels(topModels?.items);
      setLoading(false);
    };
    loadInitialOptions();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fuelSlugs?.join(',')]);

  return (
    <>
      <Select
        loading={loading}
        value={value}
        className="w-full"
        popoverClass={popoverClass}
        varianet={variant}
        title={t('Select Brand & Model')}
        placeholder={placeholder || t('Select Brand & Model')}
        maxLength={50}
        loadOptions={(query) =>
          MakeModelSearchService.getSuggestions(query, 10, locale)
        }
        onSelect={handleSelect}
        onOpen={onOpen}
        initialContent={showInitialOptions && carInitialContent}
        triggerProps={triggerProps}
        defaultOptions={initialOptions}
        ref={selectRef}
        zIndex={zIndex}
        selectOptionOnEnter
        enableKeyboardNavigation
      />
    </>
  );
}

function CarSearchInitialView({
  popularCars,
  priceRanges,
  onSelect,
  locale,
  isMobile,
  pageType,
  user,
  scopeFilters,
}) {
  const { recentSearches } = useRecentlyViewedAndSearched();

  const commonT = useTranslations('common');
  const recentSearchData = transformRecentlySearched(
    recentSearches,
    locale,
    commonT,
  );

  const t = useTranslations('home');
  const carPurposeTitle = t('Used Car For Sale');

  const handleSearchSuggestionClick = useCallback(
    (name, brand, model) => {
      homeClickEvents.search_suggestion_click(
        locale,
        user,
        pageType || 'home',
        PAGE_SECTIONS.HERO_SECTION,
        name,
        brand,
        model,
      );
    },
    [locale, user, pageType],
  );

  return (
    <div className="px-2 py-2 flex flex-col gap-7">
      {recentSearchData?.length > 0 && (
        <div>
          <div className="mb-2 text-xs md:text-sm font-semibold">
            {t('Recent Searches')}
          </div>
          <ScrollArea orientation="horizontal" className={'lg:overscroll-auto'}>
            <div className="flex w-max space-x-4">
              {recentSearchData?.map(
                ({ title, itemList, link, brand, model }, index) => (
                  <ListItemCard
                    key={index}
                    title={title}
                    itemList={itemList}
                    href={link}
                    onClick={() =>
                      handleSearchSuggestionClick(
                        'recent_searches',
                        brand,
                        model,
                      )
                    }
                    InlineItemsClassName={cn(
                      isMobile ? 'text-2xs' : 'text-xs',
                      'text-gray-500',
                    )}
                    className="px-3 py-2 rounded-md h-full"
                    titleClassName={cn(isMobile && 'text-xs', 'mb-1')}
                  />
                ),
              )}
            </div>
          </ScrollArea>
        </div>
      )}

      {popularCars.length > 0 && (
        <div>
          <div className="mb-2 text-xs md:text-sm font-semibold">
            {t('Most Searched Cars')}
          </div>
          <ScrollArea orientation="horizontal" className={'lg:overscroll-auto'}>
            <div className="flex w-max space-x-4">
              {popularCars.map((car, index) => {
                const hrefTitle = `${getLocaleString(
                  car,
                  'label',
                  locale,
                )} ${carPurposeTitle}`;
                const href = buildUsedCarListingUrl(
                  car?.makeSlug
                    ? {
                        make: {
                          ...(scopeFilters && { id: car.makeId }),
                          slug: car.makeSlug,
                        },
                        ...(car.modelSlug && {
                          model: {
                            ...(scopeFilters && { id: car.modelId }),
                            slug: car.modelSlug,
                          },
                        }),
                        ...scopeFilters,
                      }
                    : { ...scopeFilters },
                );
                return (
                  <NextLink
                    key={car.id || index}
                    hrefTitle={hrefTitle}
                    href={href}
                    onClick={() =>
                      handleSearchSuggestionClick('most_searched_cars')
                    }
                  >
                    <OptionCard
                      width={70}
                      height={70}
                      label={getLocaleString(car, 'label', locale)}
                      className={'rounded-sm flex-shrink-0 w-[80px] '}
                      imageClassName={'flex-shrink-0'}
                      labelClassName="text-xs"
                      imageContainer="lg:h-[54]"
                      src={car.src}
                      variant="default"
                    />
                  </NextLink>
                );
              })}
            </div>
          </ScrollArea>
        </div>
      )}

      <div>
        <div className="mb-2 text-xs md:text-sm font-semibold">
          {commonT('Price Ranges')}
        </div>
        <ScrollArea orientation="horizontal" className={'lg:overscroll-auto'}>
          <div className="flex h-[54px] w-max gap-4">
            {priceRanges.map((range, index) => (
              <ChipWithIcon
                key={range.key}
                href={
                  scopeFilters
                    ? buildUsedCarListingUrl({
                        price: { max: range.value },
                        ...scopeFilters,
                      })
                    : appendScopeToUrl(range.url, scopeFilters)
                }
                className="text-center flex flex-col gap-1 justify-center align-middle  bg-primary-50 hover:bg-primary-50"
                label={
                  <>
                    <div className="text-xs font-normal text-gray-700">
                      {t('Under')}{' '}
                    </div>
                    <Price
                      className="text-xs text-black"
                      valueClassName="text-priamry font-semibold"
                      currencyClassName="text-gray-light"
                      value={range.value}
                      priceFormatter={(value, locale) => {
                        if (index < priceRanges.length - 2) {
                          return formatNumberValue(value, locale);
                        }
                        return range.label;
                      }}
                    />
                  </>
                }
              />
            ))}
          </div>
        </ScrollArea>
      </div>
    </div>
  );
}
