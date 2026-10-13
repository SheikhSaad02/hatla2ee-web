'use client';

import React from 'react';
import { cn } from '@/utils';
import ValueCell from './ValueCell';
import { getCarAttributeValue, getCarPriceInfo } from '@/mappers/comparison';
import CarInfo from '../carSelection/carInfo';
import { IconTick } from '@/icons/basicSvgs';
import { X } from 'lucide-react';
import Button from '../common/button/button';
import configs from '@/configs';
import { useLocale } from 'next-intl';
import LeadCampaignActions from '../common/newCarListingActions/leadCampaignActions';

const AttributeValueColumn = ({
  car,
  attributes,
  onRemove,
  className,
  isMobile,
}) => {
  const locale = useLocale();

  if (!car) return null;

  const priceInfo = getCarPriceInfo(car);

  return (
    <div
      className={cn(
        'flex flex-col lg:flex-1 flex-shrink-0 rounded-lg lg:shadow border max-sm:min-w-30 bg-[linear-gradient(to_top,#F4F8FD_0%,white_100%)] relative',
        className,
      )}
    >
      {onRemove && (
        <Button
          onClick={onRemove}
          size="small"
          className="absolute top-2 end-2 z-10 border-none !bg-transparent"
          icon={<X className="text-gray-400 size-4 md:size-5" />}
          variant="outline"
        />
      )}

      <CarInfo
        carDetails={car}
        onRemove={onRemove}
        className="flex-none h-50 md:h-60 justify-center max-md:px-2 md:sticky md:top-10 z-9 rounded-lg bg-white"
      />
      <LeadCampaignActions
        entityType="NewListing"
        source="compare"
        entityId={car?.id}
        make={car?.make?.slug}
        model={car?.model?.slug}
        isMob={isMobile}
        launch_year={car?.launch_year}
        gridView={false}
        restrictedView
      />

      <div className="space-y-0 flex-1">
        {attributes.map((attribute, index) => {
          let value = '-';

          // Handle special price attributes
          if (attribute.slug === 'official_prices' && priceInfo) {
            value = priceInfo.official_price
              ? `${priceInfo.official_price.toLocaleString()} ${
                  configs.currency[locale].label
                }`
              : '-';
          } else if (attribute.slug === 'min_installment' && priceInfo) {
            value = priceInfo.min_installment
              ? `${priceInfo.min_installment.toLocaleString()} ${
                  configs.currency[locale].label
                }`
              : '-';
          } else if (attribute.slug === 'min_deposit' && priceInfo) {
            value = priceInfo.min_deposit
              ? `${priceInfo.min_deposit.toLocaleString()} ${
                  configs.currency[locale].label
                }`
              : '-';
          } else {
            value = getCarAttributeValue(car, attribute.slug, locale);
          }

          return (
            <ValueCell key={attribute.slug}>
              {value === 'Yes' ? (
                <div className="flex items-center justify-center">
                  <IconTick
                    size="16"
                    color="currentColor"
                    className="text-primary"
                  />
                </div>
              ) : value === 'No' || value === 'no' ? (
                <div className="flex items-center justify-center">
                  <span className="text-lg text-red-500 font-bold">✕</span>
                </div>
              ) : (
                <span className="text-xs md:text-base sfont-medium">
                  {value}
                </span>
              )}
            </ValueCell>
          );
        })}
      </div>
    </div>
  );
};

export default AttributeValueColumn;
