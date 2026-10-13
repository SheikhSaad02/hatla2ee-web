'use client';

import { fetchComparisonDetail } from '@/apis/comparison';
import { ComparisonDetailSkeleton } from '@/components/common/loading';
import { mapComparisonDetailResponse } from '@/mappers/comparison';
import { useLocale, useTranslations } from 'next-intl';
import React, { useEffect, useState } from 'react';
import AddCarButton from './AddCarButton';
import AttributeLabelColumn from './AttributeLabelColumn';
import AttributeValueColumn from './AttributeValueColumn';
import EmptyValueColumn from './EmptyValueColumn';
import { appPaths, vehicleSlugLabel } from '@/constants';
import { showToast } from '@/utils/notification-service';
import Button from '../common/button/button';
import { useRouter } from '@/i18n/navigation';

const ComparisonModule = ({
  initialCars = null,
  carIds = null,
  className,
  isMobile,
  vehicleCategorySlug,
}) => {
  const router = useRouter();
  const locale = useLocale();
  const t = useTranslations('common');
  const [cars, setCars] = useState([]);
  const [allAttributes, setAllAttributes] = useState([]);
  const [hideSimilarities, setHideSimilarities] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentCarIds, setCurrentCarIds] = useState(carIds || []);
  const [showEmptyColumn, setShowEmptyColumn] = useState(false);
  const [carErrors, setCarErrors] = useState([false, false, false]);

  const maxCars = 4;
  const minCars = 2;

  useEffect(() => {
    const loadComparisonData = async () => {
      if (initialCars) {
        // Use provided initial cars data
        const mappedData = mapComparisonDetailResponse(initialCars, locale);
        setCars(mappedData.cars);
        setAllAttributes(mappedData.attributes);
        // Extract car IDs from initial cars
        const extractedCarIds = mappedData.cars.map((car) => car.id);
        setCurrentCarIds(extractedCarIds);
        setLoading(false);
      } else if (carIds && carIds.length > 0) {
        // Fetch data using car IDs
        try {
          const response = await fetchComparisonDetail({ listing_ids: carIds });
          if (response.error) {
            setError(response.error);
          } else {
            const mappedData = mapComparisonDetailResponse(response?.listings);
            setCars(mappedData.cars);
            setAllAttributes(mappedData.attributes);
            setCurrentCarIds(carIds);
          }
          setLoading(false);
        } catch (err) {
          setError('Failed to load comparison data');
          setLoading(false);
        } finally {
          setLoading(false);
        }
      }
    };

    loadComparisonData();
  }, [initialCars, carIds]);

  const handleRemoveCar = (carId) => {
    const updatedCarIds = currentCarIds.filter((id) => id !== carId);
    setCurrentCarIds(updatedCarIds);
    setCars((prevCars) => prevCars.filter((car) => car.id !== carId));

    // Update URL with remaining car IDs
    if (updatedCarIds.length > 0) {
      const carIdsString = updatedCarIds.join('/');
      router.push(
        `${
          appPaths[`new-${vehicleCategorySlug}-compare-terazes`]
        }/${carIdsString}`,
      );
    } else {
      // If no cars left, redirect to comparison main page
      const vehicle = vehicleSlugLabel[vehicleCategorySlug];
      router.push(`${appPaths[`new${vehicle}Compare`]}`);
    }
  };

  const handleAddCarClick = () => {
    setShowEmptyColumn(true);
  };

  const handleCarSelect = (carData) => {
    if (!carData || !carData.class || !carData.class.id) {
      console.error('Invalid car data: missing class.id');
      showToast('error', 'Error in adding car');
      setShowEmptyColumn(false);
      return;
    }

    const newCarId = carData.listingId;

    if (currentCarIds.includes(newCarId)) {
      showToast('error', 'Car already in comparison');
      setCarErrors((prev) => {
        const newErrors = [...prev];
        newErrors[currentCarIds.length] = true;
        return newErrors;
      });
      return;
    }

    const updatedCarIds = [...currentCarIds, newCarId];
    const carIdsString = updatedCarIds.join('/');
    router.push(
      `${
        appPaths[`new-${vehicleCategorySlug}-compare-terazes`]
      }/${carIdsString}`,
    );
  };

  const canAddMoreCars = currentCarIds.length < maxCars;
  const shouldShowEmptyColumn =
    currentCarIds.length < minCars || showEmptyColumn;

  // Filter attributes based on hideSimilarities setting
  const attributes = React.useMemo(() => {
    if (!hideSimilarities || cars.length <= 1) {
      return allAttributes;
    }

    return allAttributes.filter((attribute) => {
      const values = cars.map((car) => {
        // Handle special price attributes
        if (attribute.slug === 'official_prices') {
          const priceInfo = car.generation_variant;
          return priceInfo?.min_market_price || car.price || '-';
        } else if (attribute.slug === 'min_installment') {
          const priceInfo = car.generation_variant;
          return priceInfo?.min_installment || '-';
        } else if (attribute.slug === 'min_deposit') {
          const priceInfo = car.generation_variant;
          return priceInfo?.min_deposit || '-';
        } else {
          // Get value from specs or features
          if (car.specs?.description) {
            const spec = car.specs.description.find(
              (s) => s.slug === attribute.slug,
            );
            if (spec?.spec_values?.[0]) {
              return spec.spec_values[0].value;
            }
          }
          if (car.specs?.features) {
            const feature = car.specs.features.find(
              (f) => f.slug === attribute.slug,
            );
            if (feature) {
              return 'Yes';
            }
          }
          return '-';
        }
      });

      // Check if all values are the same
      const firstValue = values[0];
      return !values.every((value) => value === firstValue);
    });
  }, [allAttributes, hideSimilarities, cars]);

  if (loading) {
    const carCount = carIds ? carIds.length : 3;
    return <ComparisonDetailSkeleton carCount={carCount} />;
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error}</p>
          <Button onClick={() => window.location.reload()}>Try Again</Button>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Heading and Add Another Car Button */}
      {!isMobile && (
        <div className="flex justify-end items-center">
          {canAddMoreCars &&
            currentCarIds.length >= minCars &&
            !showEmptyColumn && (
              <AddCarButton onClick={handleAddCarClick} isMobile={false} />
            )}
        </div>
      )}

      {isMobile &&
        canAddMoreCars &&
        currentCarIds.length >= minCars &&
        !showEmptyColumn && (
          <div className="flex justify-end">
            <AddCarButton onClick={handleAddCarClick} isMobile />
          </div>
        )}

      {/* Comparison Grid */}
      <div className="flex w-full gap-2 lg:gap-3">
        <AttributeLabelColumn
          hideSimilarities={hideSimilarities}
          onToggleSimilarities={setHideSimilarities}
          attributes={attributes}
          // className="sticky left-0 rtl:left-auto rtl:right-0 z-11"
        />

        <div className="flex gap-2 lg:gap-3 flex-1 overflow-x-auto lg:overflow-x-visible hide-scrollbar">
          {cars.map((car) => (
            <AttributeValueColumn
              key={car?.variant?.id}
              car={car}
              isMobile={isMobile}
              attributes={attributes}
              onRemove={() => handleRemoveCar(car?.variant?.id)}
            />
          ))}

          {canAddMoreCars && shouldShowEmptyColumn && (
            <EmptyValueColumn
              onAddCar={handleCarSelect}
              onRemove={
                currentCarIds.length >= minCars
                  ? () => setShowEmptyColumn(false)
                  : null
              }
              attributes={attributes}
              isMobile={isMobile}
              hasError={carErrors[currentCarIds.length]}
              vehicleCategorySlug={vehicleCategorySlug}
            />
          )}
        </div>
      </div>
    </>
  );
};

export default ComparisonModule;
