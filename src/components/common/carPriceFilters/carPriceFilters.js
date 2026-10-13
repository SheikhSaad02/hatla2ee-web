'use client';

import { getLocaleString } from '@/utils/general';
import { usePathname } from '@/i18n/navigation';
import { useLocale, useTranslations } from 'next-intl';
import { useState, useEffect } from 'react';
import { MultilineCarousel } from '../carousel/multlineCarousel';
import Text from '../text';
import SearchInput from '../searchInput/searchInput';

export default function CarPriceFilters({
  threshold,
  gridClassName,
  items = null,
  label,
  allowSearch = false,
  linkTitle,
  keyword,
  isMob,
  type,
}) {
  const t = useTranslations('common');
  const locale = useLocale();
  const pathname = usePathname();
  const [displayItems, setDisplayItems] = useState(items);

  useEffect(() => {
    setDisplayItems(items ?? []);
  }, [items]);

  const getLinkTitle = (item) => {
    const localizedLabel = getLocaleString(item, 'label', locale);
    if (!linkTitle) return localizedLabel; // fallback to just the label
    return t(linkTitle, { [keyword]: localizedLabel });
  };

  return (
    items?.length > 0 && (
      <div className="flex flex-col gap-2">
        <div className="flex flex-row items-center justify-between">
          <Text as="h2" className="text-base text-grey-900 font-medium">
            {t(label || 'All Brands')}
          </Text>
          {allowSearch && (
            <SearchInput
              placeholder={t('Search Brand')}
              items={items}
              filterKeys={['label', 'label_l1']}
              onFilter={setDisplayItems}
              className={`rounded-lg ${isMob ? 'w-44' : 'w-72'}`}
            />
          )}
        </div>
        <div className="min-h-[216px] lg:min-h-[248px] flex flex-col">
          {displayItems.length > 0 ? (
            <MultilineCarousel
              items={displayItems}
              rows={2}
              locale={locale}
              threshold={threshold ? threshold : isMob ? 4 : 20}
              getLinkTitle={getLinkTitle}
              type={type || 'optionCard'}
              gridClassName={gridClassName}
              itemClassname="text-center whitespace-normal"
            />
          ) : (
            <div className="flex-1 flex items-center justify-center">
              <p className="text-gray-500 text-center">
                {t('No options found')}
              </p>
            </div>
          )}
        </div>
      </div>
    )
  );
}
