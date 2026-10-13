'use client';
import React from 'react';
import NextImage from '../common/nextImage';
import { getLocaleString } from '@/utils/general';
import { useLocale } from 'next-intl';
import { cn } from '@/utils';
import { useTranslations } from 'next-intl';
import configs from '@/configs';
import NextLink from '../common/nextLink';

const CarInfo = ({ carDetails, showRemove = false, onRemove, className }) => {
  const locale = useLocale();
  const t = useTranslations('common');

  const getCarDisplayName = () => {
    if (!carDetails) return '';

    const make =
      getLocaleString(carDetails?.make, 'label', locale) ||
      getLocaleString(carDetails?.brand, 'label', locale);
    const model = getLocaleString(carDetails.model, 'label', locale);
    const year = carDetails.launch_year || carDetails.year?.slug;

    return `${make} ${model} ${year}`;
  };

  const getCarDetails = () => {
    if (!carDetails) return '';

    const variant = getLocaleString(carDetails.variant, 'label', locale);
    return variant;
  };

  const getCarPrice = () => {
    if (!carDetails?.price) return '';

    return `${t('Starting From')} ${carDetails.price.toLocaleString()} ${
      configs.currency[locale].label
    }`;
  };

  if (!carDetails) return null;

  return (
    <div
      className={cn('flex-1 flex flex-col items-center text-center', className)}
    >
      <NextImage
        src={carDetails.image}
        alt={getCarDisplayName()}
        width={200}
        height={140}
        className="object-contain max-sm:w-[94px] mb-3 h-[90px] md:h-[90px]"
      />

      <h3 className="font-bold  text-sm lg:text-xl mb-1 max-sm:w-[120px] max-sm:line-clamp-2 max-sm:min-h-[45px]">
        {carDetails.modelHref ? (
          <NextLink
            href={carDetails.modelHref}
            title={getCarDisplayName()}
            className={cn('text-primary-900')}
          >
            {getCarDisplayName()}
          </NextLink>
        ) : (
          getCarDisplayName()
        )}
      </h3>

      <p className="text-gray-600 text-xs md:text-sm mb-2">
        {carDetails.variantHref ? (
          <NextLink
            href={carDetails.variantHref}
            title={getCarDetails()}
            className={cn('text-primary-900')}
          >
            {getCarDetails()}
          </NextLink>
        ) : (
          getCarDetails()
        )}
      </p>

      <p className="text-black text-xs md:text-sm font-medium max-sm:w-[130px]">
        {getCarPrice()}
      </p>
    </div>
  );
};

export default CarInfo;
