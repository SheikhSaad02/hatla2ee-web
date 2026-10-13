'use client';

import { usePathname } from '@/i18n/navigation';
import { getLocaleString } from '@/utils/general';
import { useLocale, useTranslations } from 'next-intl';
import Text from '../text';
import { ChipWithIcon } from '../chip-with-icon/chip-with-icon';
import { appPaths } from '@/constants';
import { getYearRange } from '@/utils/date';
import { useCallback } from 'react';
import { MultilineCarousel } from '../carousel/multlineCarousel';

export function PriceRangesFilterClient({
  priceRanges = [],
  isMobile = false,
}) {
  const t = useTranslations('common');
  const locale = useLocale();
  const pathname = usePathname();

  // Detect base path
  const isUsedCar = pathname.startsWith(appPaths.usedCarPrices);

  // Base path (landing page when filter is cleared)
  const basePath = isUsedCar
    ? appPaths.usedCarPrices
    : appPaths['new-car-prices'];

  const carTypeLabel = isUsedCar ? t('used') : t('new');

  const slug = pathname
    ?.replace(
      isUsedCar ? appPaths.usedCarPrices : appPaths['new-car-prices'],
      '',
    )
    ?.split('/')
    .filter(Boolean);

  const isPriceSelected = (item) => {
    if (!slug.length) return false;

    if (isUsedCar) {
      if (!item.minValue && item.maxValue) {
        return slug[0] === 'to' && slug[1] === String(item.maxValue);
      }
      if (item.minValue && !item.maxValue) {
        return slug[0] === 'from' && slug[1] === String(item.minValue);
      }
      if (item.minValue && item.maxValue) {
        return (
          slug[0] === 'range' &&
          slug[1] === String(item.minValue) &&
          slug[2] === String(item.maxValue)
        );
      }
    } else {
      if (!item.minValue && item.maxValue) {
        return pathname === `${appPaths.newCarPricesTo}/${item.maxValue}`;
      }
      if (item.minValue && !item.maxValue) {
        return pathname === `${appPaths.newCarPricesFrom}/${item.minValue}`;
      }
      if (item.minValue && item.maxValue) {
        return (
          pathname ===
          `${appPaths.newCarPricesRange}/${item.minValue}/${item.maxValue}`
        );
      }
    }

    return false;
  };

  const getPriceFilterHref = (item) => {
    const isSelected = isPriceSelected(item);
    if (isSelected) return basePath;

    if (isUsedCar) {
      if (!item.minValue && item.maxValue) {
        return `${appPaths.usedCarPricesTo}/${item.maxValue}`;
      }
      if (item.minValue && !item.maxValue) {
        return `${appPaths.usedCarPricesFrom}/${item.minValue}`;
      }
      if (item.minValue && item.maxValue) {
        return `${appPaths.usedCarPricesRange}/${item.minValue}/${item.maxValue}`;
      }
    } else {
      if (!item.minValue && item.maxValue) {
        return `${appPaths.newCarPricesTo}/${item.maxValue}`;
      }
      if (item.minValue && !item.maxValue) {
        return `${appPaths.newCarPricesFrom}/${item.minValue}`;
      }
      if (item.minValue && item.maxValue) {
        return `${appPaths.newCarPricesRange}/${item.minValue}/${item.maxValue}`;
      }
    }

    return basePath;
  };

  const getHrefTitle = useCallback(
    (item) => {
      const yearRange = !isUsedCar ? getYearRange() : '';
      const title = getLocaleString(item, 'title', locale);

      return `${carTypeLabel} ${t('carPrices')} ${yearRange} ${title}`.trim();
    },
    [isUsedCar, carTypeLabel, t, locale],
  );

  return (
    <div className="flex flex-col gap-4">
      <Text as="h2" className="text-base text-grey-500 font-medium">
        {t('Price Range')}
      </Text>
      <MultilineCarousel
        items={priceRanges}
        rows={2}
        locale={locale}
        threshold={isMobile ? 4 : 20}
        itemBasis="basis-[52%] sm:basis-[30%] md:basis-[27.5%] lg:basis-[21%] xl:basis-[18%]"
        gridClassName="grid-cols-[repeat(auto-fill,minmax(180px,1fr))]"
        renderItem={(item) => (
          <ChipWithIcon
            key={item?.slug || item?.id}
            href={item?.href || getPriceFilterHref(item)}
            hrefTitle={item?.hrefTitle || getHrefTitle(item)}
            label={getLocaleString(item, 'label', locale)}
            className={`justify-center items-center w-[180px] ${
              isPriceSelected(item) && 'bg-primary-200 text-primary'
            }`}
          />
        )}
      />
    </div>
  );
}
