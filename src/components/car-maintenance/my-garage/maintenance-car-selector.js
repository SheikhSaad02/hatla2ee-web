'use client';

import { useMemo, useRef } from 'react';
import { useLocale, useTranslations } from 'next-intl';
import { X } from 'lucide-react';

import CarSelection from '@/components/carSelection/carSelection';
import Button from '@/components/common/button/button';
import NextImage from '@/components/common/nextImage';
import { useMaintenanceCarListingImage } from '@/hooks/useMaintenanceCarListingImage';
import { cn } from '@/utils';
import { getAsset, getLocaleString } from '@/utils/general';

const STEPS = ['brand', 'model', 'year', 'class'];
const CAR_PLACEHOLDER = getAsset('/assets/car-placeholder-garage.svg');

export default function MaintenanceCarSelector({
  isMobile,
  value,
  onChange,
  onClear,
  isError = false,
  readOnly = false,
}) {
  const t = useTranslations('carMaintenance');
  const locale = useLocale();
  const pickerRef = useRef(null);

  const displayName = useMemo(() => {
    if (value?.manual_make_model) return value.manual_make_model;
    if (!value?.brand) return '';
    return ['brand', 'model', 'year']
      .map((step) => getLocaleString(value[step], 'label', locale))
      .filter(Boolean)
      .join(' ');
  }, [value, locale]);

  const isManual = Boolean(value?.manual_make_model?.trim());
  const hasSelection =
    isManual || Boolean(value?.brand && value?.model && value?.year);
  const { imageSrc, isListingPhoto } = useMaintenanceCarListingImage({
    model: value?.model,
    make: value?.brand,
    manualMakeModel: value?.manual_make_model,
    enabled: hasSelection && !isManual,
    fallbackImage: CAR_PLACEHOLDER,
    size: 'thumbnail',
  });

  const handleClear = () => {
    onClear?.();
  };

  const openPicker = () => {
    pickerRef.current?.querySelector('input')?.click();
  };

  return (
    <>
      <div className="flex flex-col gap-1">
        <div
          className={cn(
            'flex items-center justify-between gap-4 rounded-xl border p-4',
            hasSelection
              ? 'border-primary-200 bg-primary-50'
              : 'border-gray-200',
            !hasSelection && isError && 'border-danger',
          )}
        >
          <div className="flex min-w-0 flex-1 items-center gap-3">
            <div
              className={cn(
                'flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden',
                isListingPhoto && 'rounded bg-white',
              )}
            >
              <NextImage
                src={imageSrc}
                width={44}
                height={44}
                className="h-11 w-11 object-contain"
              />
            </div>
            <div className="min-w-0">
              {hasSelection ? (
                <p className="text-[15px] px-2 text-gray-900">{displayName}</p>
              ) : (
                <>
                  <p className="text-sm text-gray-500">{t('select_car')}</p>
                  <p className="text-base text-gray-800">
                    {t('select_car_placeholder')}
                  </p>
                </>
              )}
            </div>
          </div>

          {!readOnly &&
            (hasSelection ? (
              <Button
                type="button"
                variant="outline"
                size="icon"
                onClick={handleClear}
                className="shrink-0 border-none !bg-transparent"
                icon={<X className="size-4 text-gray-400" />}
                aria-label="Clear selection"
              />
            ) : (
              <Button
                type="button"
                variant="tertiary"
                className="shrink-0 rounded-sm border border-primary-500"
                onClick={openPicker}
              >
                {t('select_car')}
              </Button>
            ))}
        </div>

      </div>

      {!readOnly && (
        <div
          ref={pickerRef}
          className="sr-only h-0 w-0 overflow-hidden"
          aria-hidden
        >
          <CarSelection
            isMobile={isMobile}
            elasticSearch
            steps={STEPS}
            classMandatory={false}
            value={value}
            onSelect={onChange}
            onClear={handleClear}
            allowManualEntry
            size={isMobile ? 'small' : 'large'}
            containerClassName="w-full"
          />
        </div>
      )}
    </>
  );
}
