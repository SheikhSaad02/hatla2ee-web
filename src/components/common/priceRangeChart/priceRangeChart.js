import { getLocale, getTranslations } from 'next-intl/server';

import BaseCard from '../baseCard/baseCard';
import { ChevronRightIcon } from 'lucide-react';
import LinkWithIcon from '../linkWithIcon/linkWithIcon';
import Price from '../price/price';
import Text from '../text';
import { appPaths } from '@/constants';
import { cn } from '@/utils';
import { fetchUsedCarPriceRange } from '@/apis/listing';

const tooltipPositionMap = {
  top: {
    containerStyle: (progressPercent, insetInlineStart) => ({
      insetInlineStart,
    }),
    tooltipClass: (progressPercent) =>
      progressPercent >= 85
        ? 'rtl:translate-x-full ltr:-translate-x-full'
        : progressPercent >= 33
          ? '-translate-x-1/2 rtl:translate-x-1/2'
          : '',
    arrowClass: (progressPercent) =>
      progressPercent >= 85
        ? 'end-1.5'
        : progressPercent >= 33
          ? 'start-1/2'
          : 'start-1.5',
    arrowBorderClass: () => 'border-l border-t rounded-tl -top-[5.5px]',
  },
  left: {
    containerStyle: (progressPercent) => ({
      insetInlineEnd: `calc(${100 - progressPercent}% + 28px)`,
    }),
    tooltipClass: () => '-translate-y-1/2 top-1/2',
    arrowClass: () => '-end-[5.5px] top-1/2 -translate-y-1/2',
    arrowBorderClass: (isRTL) =>
      isRTL ? 'border-l border-b rounded-bl' : 'border-r border-t rounded-tr',
  },
  right: {
    containerStyle: (progressPercent) => ({
      insetInlineStart: `calc(${progressPercent}% + 32px)`,
    }),
    tooltipClass: () => '-translate-y-1/2 top-1/2',
    arrowClass: () => '-start-[5.5px] top-1/2 -translate-y-1/2',
    arrowBorderClass: (isRTL) =>
      isRTL ? 'border-r border-t rounded-tr' : 'border-l border-b rounded-bl',
  },
};

const CustomTooltip = ({
  active,
  price = '0',
  label,
  progressPercent,
  insetInlineStart,
  position = 'top',
  isRTL = false,
}) => {
  if (!active) return null;

  const map = tooltipPositionMap[position];
  const containerStyle = map.containerStyle(progressPercent, insetInlineStart);
  const tooltipClass = map.tooltipClass(progressPercent);
  const arrowClass = map.arrowClass(progressPercent);
  const arrowBorderClass = map.arrowBorderClass(isRTL);

  return (
    <div
      className={cn(
        'absolute z-10 min-w-[150px] inline-block transform',
        tooltipClass,
      )}
      style={containerStyle}
    >
      <div className="bg-white border border-gray-200 shadow-lg rounded-md flex items-center text-center p-2 justify-center">
        <div>
          <div className="text-xs text-gray-500 mb-0">{label}</div>
          <Price
            className="font-bold text-xs md:text-sm"
            currencyClassName="font-bold"
            value={price}
          />
        </div>
      </div>
      <div
        className={cn(
          'absolute transform w-3 h-3 bg-white border-gray-200 rotate-45',
          arrowClass,
          arrowBorderClass,
        )}
      />
    </div>
  );
};

const PriceRangeChart = async ({
  title,
  listingTitle,
  makeSlug,
  modelSlug,
  price,
  modelYear,
  showPrice = true,
  showLink = true,
}) => {
  const priceRangesData = await fetchUsedCarPriceRange({
    model: modelSlug,
    modelYear: modelYear,
  });

  const { minPrice, maxPrice, avgPrice } = priceRangesData || {};

  const t = await getTranslations('common');
  const locale = await getLocale();
  const direction = locale === 'ar' ? 'rtl' : 'ltr';
  const isRTL = direction === 'rtl';

  const progressPercent =
    price <= minPrice
      ? 0
      : price >= maxPrice
        ? 100
        : ((price - minPrice) / (maxPrice - minPrice)) * 100;

  const clampedPercent = Math.max(0, Math.min(100, progressPercent));

  let pointerOffset = 0;
  if (clampedPercent >= 85) {
    pointerOffset = -12;
  } else if (clampedPercent >= 33) {
    pointerOffset = 8;
  } else {
    pointerOffset = 12;
  }
  const rtlThreshold = isRTL ? 65 : 45;
  return (
    priceRangesData && (
      <BaseCard className="gap-3 md:gap-4 p-3 md:p-4 rounded-md border border-[#F7F9FA] bg-[#F5F9FF66] shadow-[0px_4px_14px_#0000000A,inset_0px_0px_2px_#00000012]">
        {(title || showLink) && (
          <div className="flex justify-between items-center gap-2">
            <div className="flex flex-col">
              {title && (
                <Text as="h5" className="font-semibold">
                  {title}
                </Text>
              )}
              {showLink && (
                <LinkWithIcon
                  href={`${appPaths['usedCarPrices']}/${makeSlug}/${modelSlug}${
                    modelYear ? `/${modelYear}` : ''
                  }`}
                  title={t('Used {title} Prices', {
                    title: listingTitle,
                  })}
                  icon={
                    <ChevronRightIcon className="w-4 h-4 bg-primary-100 text-primary rounded-xs shrink-0 flipX" />
                  }
                  iconPosition={'right'}
                  className="text-primary text-xs hover:text-primary font-semibold items-center"
                />
              )}
            </div>
          </div>
        )}
        <div className="flex flex-col w-full justify-between">
          <div className="relative w-full">
            <div
              className={cn(
                'relative w-full h-[10px] rounded-[4px] mt-3 bg-[linear-gradient(94.03deg,#BFD6F6_4.5%,#32C15942_50.4%,#BFD6F6_96.3%)] rtl:bg-[linear-gradient(-94.03deg,#BFD6F6_4.5%,#32C15942_50.4%,#BFD6F6_96.3%)]',
                showPrice && 'my-8',
              )}
            >
              {showPrice && (
                <div
                  className="absolute top-1/2 w-3 h-3 bg-[#3160A5] border-[2.4px] border-[#E0EDFF] rounded-full shadow-[0px_0px_10px_#00000059] transform -translate-y-1/2 ltr:-translate-x-1/2 rtl:translate-x-1/2 z-20"
                  style={{
                    insetInlineStart: `calc(${clampedPercent}% + ${pointerOffset}px)`,
                  }}
                />
              )}

              {showPrice && (
                <CustomTooltip
                  active={true}
                  price={price}
                  label={t('This ad lies here')}
                  progressPercent={clampedPercent}
                  insetInlineStart={`${clampedPercent}%`}
                  position={clampedPercent <= rtlThreshold ? 'right' : 'left'}
                  isRTL={isRTL}
                />
              )}
            </div>
          </div>

          <div className="flex flex-row items-center justify-between w-full text-xs md:text-sm mb-0">
            <div className="text-start">
              <div className="text-xs text-gray-600">{t('Minimum Price')}</div>
              <Price
                className="text-xs md:text-sm"
                valueClassName="font-semibold"
                currencyClassName="font-semibold"
                value={minPrice}
              />
            </div>

            <div className="text-end">
              <div className="text-xs text-gray-600">{t('Maximum Price')}</div>
              <Price
                className="text-xs md:text-sm"
                valueClassName="font-semibold"
                currencyClassName="font-semibold"
                value={maxPrice}
              />
            </div>
          </div>
        </div>
      </BaseCard>
    )
  );
};

export default PriceRangeChart;
