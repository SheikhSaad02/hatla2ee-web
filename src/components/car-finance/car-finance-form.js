'use client';

import { Controller, useForm, useWatch } from 'react-hook-form';
import { forwardRef, useImperativeHandle } from 'react';

import BaseCard from '../common/baseCard/baseCard';
import CarSelection from '../carSelection/carSelection';
import Input from '../common/input/input';
import Label from '../common/label';
import NextImage from '../common/nextImage';
import { RadioGroup } from '../common/radioGroup';
import Select from '@/components/common/select/select';
import Text from '../common/text';
import { formatNumberValue } from '@/utils/numbers';
import { useCarFinanceForm } from '@/hooks/useCarFinanceForm';
import { useEffect, useMemo } from 'react';
import { useTranslations } from 'next-intl';
import InputRangeSlider from '../common/inputRangeSlider/inputRangeSlider';
import LoanPreview from './loan-preview';
import { getAsset } from '@/utils/general';
import { MIN_FINANCING_YEAR } from '@/data/car-finance';

const CarFinanceForm = () => {
  const { defaultValues } = useCarFinanceForm();
  const {
    control,
    setValue,
    handleSubmit,
    getValues,
    reset,
    trigger,
    formState: { errors, touchedFields },
  } = useForm({ values: defaultValues, mode: 'onChange' });

  const formValues = useWatch({ control });
  const { isMob, formItems } = useCarFinanceForm(
    getValues,
    setValue,
    reset,
    trigger,
  );
  const STEPS = useMemo(() => ['brand', 'model', 'year', 'class'], []);

  const t = useTranslations('carFinance');

  const hasErrors = Object.keys(errors).length !== 0;

  const handleResetForm = () => {
    reset(defaultValues);
  };

  const renderField = (field, item) => {
    const commonProps = {
      ...field,
      value:
        item?.formatValue && formValues?.[item.key]
          ? formatNumberValue(formValues?.[item.key])
          : formValues?.[item.key],
      errorMsg: errors?.[item?.key]?.message,
      placeholder: item.placeholder,
      ...item.triggerProps,
    };

    switch (item.type) {
      case 'select':
        return (
          <Select
            {...commonProps}
            triggerProps={{
              className: isMob ? 'text-sm' : '',
              ...item.triggerProps,
            }}
            defaultOptions={item.options}
            getOptionValue={(opt) => opt?.slug || opt?.key}
            onSelect={(val) => {
              field.onChange(val);
              item.onChange ? item.onChange(val) : setValue(item.key, val);
              item.onSelect && item.onSelect();
            }}
          />
        );
      case 'input':
        return (
          <Input
            {...commonProps}
            onChange={(e) => {
              const raw = e.target.value.replace(/[^\d.]/g, '');
              field.onChange(raw);
              item.onChange ? item.onChange(raw) : setValue(item.key, raw);
            }}
            showError
            inputDescription={item.inputDescription}
            maxLength={item.maxLength}
          />
        );

      case 'radio':
        return (
          <RadioGroup
            {...commonProps}
            options={item.options}
            labelClassName="w-full text-center"
            itemClassName={item.itemClassName}
            className="w-full"
            onChange={(val) => {
              field.onChange(val);
              item.onChange ? item.onChange(val) : setValue(item.key, val);
            }}
            getOptionValue={(opt) => opt.slug || opt.key}
            variant={item.variant || 'outline'}
          />
        );
      case 'car-selection':
        return (
          <CarSelection
            {...commonProps}
            onSelect={item.onSelect}
            onClear={item.onClear}
            isMobile={isMob}
            elasticSearch={item?.elasticSearch}
            inputProps={item?.triggerProps}
            steps={STEPS}
            refetchOnOpen
            startYear={MIN_FINANCING_YEAR}
          />
        );
      case 'input-slider':
        return (
          <InputRangeSlider
            {...commonProps}
            onChange={(e) => {
              field.onChange(e);
              item.onChange ? item.onChange(e) : setValue(item.key, e);
            }}
            label={item.label}
            inputDescription={item.inputDescription}
            showError
          />
        );

      default:
        return null;
    }
  };

  const onSubmit = (values) => {
    console.log('Form submitted: ', values);
  };

  return (
    <BaseCard
      className="
        md:p-4 
        grid grid-cols-1 
        lg:grid-cols-[460px_1fr] 
        gap-7 lg:gap-15 
        bg-[linear-gradient(180deg,#F5F9FF_0%,#FFFFFF_28%)]
        md:bg-none
        md:bg-primary-50
        rounded-xl 
        md:rounded-2xl 
        shadow-sm 
        overflow-hidden 
        relative 
        -mt-16
        md:-mt-40 
        py-8 
        px-3
      "
    >
      <BaseCard className="md:p-5 md:shadow-xs border-none md:border-gray-100 bg-transparent md:bg-white">
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col gap-4 "
        >
          {formItems.map((item) => (
            <div key={item.key} className="flex flex-col gap-3">
              {!item.hideExternalLabel && <Label>{item.label}</Label>}
              <Controller
                control={control}
                name={item.key}
                rules={item.rules}
                render={({ field }) => renderField(field, item)}
              />
            </div>
          ))}
        </form>

        <div className="flex items-center justify-between gap-2 border rounded-lg p-4 ">
          <Text className="text-gray text-xs">
            {t('Finance through Fast Track')}
          </Text>
          <NextImage
            src={getAsset('/assets/fast-track-logo.webp')}
            alt="Fast Track"
            width={80}
            height={20}
          />
        </div>
      </BaseCard>
      <LoanPreview
        previewDependents={['price']}
        values={formValues}
        touchedFields={touchedFields}
        onReset={handleResetForm}
        hasErrors={hasErrors}
      />
    </BaseCard>
  );
};

CarFinanceForm.displayName = 'CarFinanceForm';

export default CarFinanceForm;
