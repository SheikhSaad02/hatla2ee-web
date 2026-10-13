'use client';

import { usePathname, useRouter } from '@/i18n/navigation';
import { useTranslations } from 'next-intl';
import { useSearchParams } from 'next/navigation';
import Select from '@/components/common/select/select';
import { ChevronDown } from 'lucide-react';
import filterData from '@data';
import { appPaths } from '@/constants';
import { useLocale } from 'next-intl';
import { useUser } from '@/providers/user';
import { homeClickEvents } from '@/services/analyticsService/events';
export default function Sortby({
  data,
  isMobile,
  options = filterData.usedListingsFilterData.sortby,
  defaultValue = filterData.DEFAULT_SORT,
  icon,
}) {
  const { sortby = defaultValue } = data;
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { push } = useRouter();
  const t = useTranslations('usedCarsListings');
  const commonT = useTranslations('common');
  const locale = useLocale();
  const { user } = useUser();
  function handleSearch(item) {
    homeClickEvents.select_sort(locale, user, item?.slug);
    const params = new URLSearchParams(searchParams);
    if (item.slug === defaultValue.slug) {
      params.delete('sortby');
    } else {
      params.set('sortby', item.slug);
    }
    params.delete('page');
    let cleansedPath = pathname.replace(/\/page\/\d+/, '');
    if (cleansedPath === appPaths.usedCars) {
      cleansedPath = appPaths.usedCarsListingsSearch;
    }

    push(`${cleansedPath}?${params.toString()}`);
  }

  const value = options.find((item) => item.slug == sortby?.slug);

  return (
    <Select
      triggerProps={{
        suffix: <ChevronDown size={16} className="text-gray-800" />,
        prefix: icon && <span>{icon}</span>,
        ...(isMobile
          ? {
              className: 'text-xs px-2 h-8 rounded-full',
              containerClassName: 'rounded-4xl',
              size: 'small',
            }
          : {
              size: 'small',
            }),
      }}
      defaultOptions={options}
      getOptionLabel={(e) => (e?.label != null ? commonT(e.label) : '')}
      value={value}
      onSelect={(value) => handleSearch(value)}
      allowSearch={false}
      fullScreen={false}
      containerClassName={!isMobile ? 'max-w-[245] text-dim' : 'w-52'}
      placeholder={t('Order by')}
      getOptionValue={(option) => option?.slug}
      onOpen={() => homeClickEvents.click_sort(locale, user)}
    />
  );
}
