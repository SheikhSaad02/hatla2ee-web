'use client';
import CarSelectionModal from './carSelectionModal';
import { useEffect, useState } from 'react';
import Input from '../common/input/input';
import { useLocale, useTranslations } from 'next-intl';
import { Search } from 'lucide-react';
import CarSelectionBottomSheet from './carSelectionBottomSheet';
import AddCarManuallyModal from './addCarManuallyModal';
import { newVehiclesCategorySlugs } from '@/constants';
import {
  fetchMakesData,
  fetchModelsData,
  fetchVariantsData,
} from '@/apis/new-cars-listings';
import { useFetchApi } from '@/hooks/useFetchApi';
import { getLocaleString } from '@/utils/general';
import { MakesService } from '@/services/elasticsearch/makes-service';
import { ModelsService } from '@/services/elasticsearch/models-service';
import { ClassesService } from '@/services/elasticsearch/classes-service';

export default function CarSelection({
  isMobile,
  elasticSearch,
  containerClassName,
  className,
  onSelect = () => {},
  onClear = () => {},
  onOpen: onOpenCallback = () => {},
  allowManualEntry = false,
  inputProps = {},
  categorySlug = newVehiclesCategorySlugs.newCars,
  steps = ['brand', 'model', 'year', 'class'],
  brandInitialArgs = false,
  modelInitialArgs = false,
  classInitialArgs = false,
  size,
  value,
  refetchOnOpen = false,
  startYear = 1970,
  classMandatory = false,
  ...props
}) {
  const t = useTranslations('home');
  const [isOpen, setIsOpen] = useState(false);
  const [isManualOpen, setIsManualOpen] = useState(false);
  const [step, setStep] = useState(0);
  const [selectedValue, setSelectedValue] = useState(value || {});
  const locale = useLocale();
  const skipYears = !elasticSearch;

  useEffect(() => {
    setSelectedValue(value || {});
  }, [value]);

  const {
    data: brands,
    isLoading: brandLoading,
    error: brandError,
    refetch: getMakes,
  } = useFetchApi({
    fetchFn: elasticSearch ? MakesService.getAllMakes : fetchMakesData,
    initialArgs: [brandInitialArgs],
    autoFetch: !!brandInitialArgs ? brandInitialArgs : false,
  });
  const {
    data: models,
    isLoading: modelLoading,
    error: modelError,
    refetch: getModels,
  } = useFetchApi({
    fetchFn: elasticSearch
      ? ModelsService.getAllModelsForMake
      : fetchModelsData,
    initialArgs: [modelInitialArgs],
    autoFetch: modelInitialArgs ? modelInitialArgs : false,
  });
  const {
    data: classes,
    isLoading: classLoading,
    error: classError,
    refetch: getClasses,
  } = useFetchApi({
    fetchFn: elasticSearch
      ? ClassesService.getClassesForModelYear
      : fetchVariantsData,
    autoFetch: classInitialArgs ? classInitialArgs : false,
  });

  const currentYear = new Date().getFullYear() + 1;
  const years = Array.from({ length: currentYear - startYear + 1 }, (_, i) => {
    const year = currentYear - i;
    return {
      value: year,
      label: year.toString(),
      slug: year.toString(),
    };
  });

  const onClose = () => {
    setIsOpen(false);
    // setSelectedValue({});
  };

  const onOpen = () => {
    if (!brands || refetchOnOpen) {
      if (elasticSearch) {
        getMakes();
      } else {
        getMakes(categorySlug);
      }
    }
    setIsOpen(true);
    onOpenCallback();
  };

  const onDoneClick = () => {
    setIsOpen(false);
    onSelect(selectedValue);
  };

  const handleEnterCarManually = () => {
    setIsOpen(false);
    setIsManualOpen(true);
  };

  const handleManualAdd = (text) => {
    const manualValue = { manual_make_model: text };
    setSelectedValue(manualValue);
    setIsManualOpen(false);
    onSelect(manualValue);
  };

  const getValue = () =>
    Object.values(selectedValue)
      .map((item) => getLocaleString(item, 'label', locale))
      .filter(Boolean)
      .join(' ');

  const dataSelector = async (value, step) => {
    switch (step) {
      case 'brand': {
        if (steps.includes('model')) {
          if (elasticSearch) {
            getModels(value?.slug);
          } else {
            getModels(value?.slug, categorySlug);
          }
        }
        setSelectedValue(() => ({ brand: value }));
        break;
      }

      case 'model': {
        setSelectedValue(({ brand }) => ({
          brand,
          model: value,
        }));
        if (skipYears) {
          getClasses(
            selectedValue?.brand?.slug,
            value?.slug,
            null,
            categorySlug,
            true,
          );
        }
        break;
      }

      case 'year': {
        if (steps.includes('class')) {
          if (elasticSearch) {
            getClasses(selectedValue?.model?.slug, value?.slug);
          } else if (!skipYears) {
            getClasses(
              selectedValue?.brand?.slug,
              selectedValue?.model?.slug,
              value?.slug,
              categorySlug,
            );
          }
        }
        setSelectedValue(({ brand, model }) => ({
          brand,
          model,
          year: value,
        }));
        break;
      }
      case 'class': {
        setSelectedValue((prev) => ({
          ...prev,
          class: value,
          ...(skipYears && { year: { label: value?.year, slug: value?.year } }),
        }));

        break;
      }
      default:
        break;
    }
  };

  return (
    <>
      <Input
        readOnly
        tabIndex={-1}
        value={getValue()}
        onClear={() => {
          setSelectedValue({});
          setStep(0);
          onClear();
        }}
        inputClassName={isMobile ? 'text-ms' : 'text-md'}
        placeholder={t('Select Brand & Model')}
        onChange={() => {}}
        prefix={<Search className="text-primary" size={isMobile ? 14 : 20} />}
        size={size || (isMobile ? 'xsmall' : 'large')}
        onClick={onOpen}
        className={className}
        containerClassName={containerClassName}
        // "w-full"
        {...inputProps}
      />
      {!isMobile ? (
        <CarSelectionModal
          classMandatory={classMandatory}
          brands={brands}
          models={models}
          years={years}
          classes={classes}
          brandLoading={brandLoading}
          modelLoading={modelLoading}
          classLoading={classLoading}
          setIsOpen={setIsOpen}
          isOpen={isOpen}
          onClick={dataSelector}
          selectedValue={selectedValue}
          onClose={onClose}
          OnDoneClick={onDoneClick}
          steps={steps}
          skipYears={skipYears}
          {...(allowManualEntry && {
            onEnterCarManually: handleEnterCarManually,
          })}
          {...props}
        />
      ) : (
        <CarSelectionBottomSheet
          step={step}
          classMandatory={classMandatory}
          setStep={setStep}
          brands={brands}
          models={models}
          years={years}
          classes={classes}
          brandLoading={brandLoading}
          modelLoading={modelLoading}
          classLoading={classLoading}
          setIsOpen={setIsOpen}
          isOpen={isOpen}
          onClick={dataSelector}
          selectedValue={selectedValue}
          onClose={onClose}
          OnDoneClick={onDoneClick}
          skipYears={skipYears}
          steps={steps}
          {...(allowManualEntry && {
            onEnterCarManually: handleEnterCarManually,
          })}
          {...props}
        />
      )}
      {allowManualEntry && (
        <AddCarManuallyModal
          isOpen={isManualOpen}
          onClose={() => setIsManualOpen(false)}
          onAdd={handleManualAdd}
        />
      )}
    </>
  );
}
