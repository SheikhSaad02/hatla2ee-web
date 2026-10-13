'use client';
import React, { useState } from 'react';
import NextImage from '../common/nextImage';
import CarSelection from './carSelection';
import CarInfo from './carInfo';
import { X } from 'lucide-react';
import { fetchNewListingVariantLevelDetail } from '@/apis/new-car';
import { useTranslations } from 'next-intl';
import { cn } from '@/utils';
import { formatNumberValue } from '@/utils/numbers';
import { showToast } from '@/utils/notification-service';
import { getAsset } from '@/utils/general';
import { newVehiclePlaceholder } from '@/constants';

const CarSelectionCard = ({
  isMobile,
  onSelect,
  onRemove,
  selectedCar,
  placeholder,
  showRemove = false,
  className,
  hasError = false,
  categorySlug,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [carDetails, setCarDetails] = useState(selectedCar || null);
  const t = useTranslations('common');

  // Sync with selectedCar prop
  React.useEffect(() => {
    setCarDetails(selectedCar || null);
  }, [selectedCar]);

  const createCarInfo = (
    selectedValue,
    image = getAsset(`/assets/${newVehiclePlaceholder[categorySlug]}`),
    price = 0,
  ) => ({
    ...selectedValue,
    image,
    price,
    listingId: selectedValue.class.variant_id,
    variant: selectedValue.class,
  });

  const handleCarSelect = async (selectedValue) => {
    if (
      !selectedValue?.brand ||
      !selectedValue?.model ||
      !selectedValue?.year ||
      !selectedValue?.class
    ) {
      return;
    }

    setIsLoading(true);
    try {
      const details = await fetchNewListingVariantLevelDetail(
        selectedValue.class.variant_id,
      );

      const image =
        details?.images?.find((image) => image?.main)?.medium ||
        getAsset(`/assets/${newVehiclePlaceholder[categorySlug]}`);
      const price = formatNumberValue(details?.price || 0);

      const carInfo = createCarInfo(selectedValue, image, price);
      setCarDetails(carInfo);
      onSelect(carInfo);
    } catch (error) {
      console.error('Error fetching car details:', error);
      showToast('error', 'Error fetching car details');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRemove = () => {
    setCarDetails(null);
    onRemove();
  };

  return (
    <div
      className={cn(
        'bg-white rounded-lg shadow-sm p-4 h-[240px] flex flex-col relative',
        className,
      )}
    >
      {showRemove && carDetails && (
        <button
          onClick={handleRemove}
          className="absolute top-2 right-2 z-10 bg-gray-100 hover:bg-gray-200 rounded-full p-1 cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>
      )}

      {carDetails && !hasError ? (
        <CarInfo
          carDetails={carDetails}
          showRemove={showRemove}
          onRemove={handleRemove}
        />
      ) : (
        <div className="flex-1 flex flex-col items-center text-center">
          <div className="flex-1 flex items-center justify-center mb-3">
            <NextImage
              src={getAsset(`/assets/${newVehiclePlaceholder[categorySlug]}`)}
              alt="Select Car"
              width={200}
              height={140}
              className="object-contain max-h-[90px] md:max-h-[90px] w-auto"
            />
          </div>

          <div className="flex w-full items-end">
            <CarSelection
              classMandatory={true}
              isMobile={isMobile}
              elasticSearch={false}
              categorySlug={categorySlug}
              onSelect={handleCarSelect}
              onClear={() => {}}
              inputProps={{
                placeholder: placeholder || t('Select Car To Compare'),
                className: 'text-center bg-primary-100',
              }}
              size={isMobile ? 'small' : 'medium'}
              containerClassName="w-full max-w-full"
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default CarSelectionCard;
