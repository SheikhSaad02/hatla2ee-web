'use client';

import { Controller, useForm } from 'react-hook-form';
import { getAsset, getLocaleString, isRtl } from '@/utils/general';
import { useLocale, useTranslations } from 'next-intl';
import { useMemo } from 'react';

import BaseCard from '../common/baseCard/baseCard';
import Button from '../common/button/button';
import DrawerWrapper from '../common/drawer';
import Input from '../common/input/input';
import { Modal } from '../common/modal';
import NextImage from '../common/nextImage';
import Text from '../common/text';
import configs from '@/configs';
import { showToast } from '@/utils/notification-service';
import { submitFinanceForm } from '@/apis/car-finance';
import { useFetchApi } from '@/hooks/useFetchApi';
import { useUser } from '@/providers/user';
import { carFinancingEvents } from '@/services/analyticsService/events';
import { formatNumberValue } from '@/utils/numbers';
import { getMinDepositPercent, isUsedCondition } from '@/utils/car-finance';
import { useIsMobile } from '@/providers/isMobile';

const LoanApplicationFormModal = ({
  isOpen,
  setIsOpen,
  values,
  onSuccess,
  pageType = '',
  campaignId,
}) => {
  const isMob = useIsMobile() ?? false;
  const locale = useLocale();
  const t = useTranslations('carFinance');
  const { user } = useUser();
  const isUsedCar = isUsedCondition(values?.condition);
  const minDepositPercent = getMinDepositPercent(isUsedCar);
  const depositPercent = Number(values?.deposit_amount) || 0;

  const defaultValues = useMemo(
    () => ({
      name: user?.name,
      phone: user?.phone,
      email: user?.email,
    }),
    [user],
  );

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({ values: defaultValues });

  const { isLoading: isSubmitLoading, refetch: submitForm } = useFetchApi({
    fetchFn: submitFinanceForm,
    autoFetch: false,
  });

  const onSubmit = async (data) => {
    carFinancingEvents['click_submit_financing']?.(
      locale,
      user,
      pageType,
      depositPercent,
      values,
    );
    const { brand, model, year } = values?.car_detail || {};
    const res = await submitForm({
      ...data,
      price: values?.price,
      year: values?.year?.label,
      condition: values?.condition?.slug,
      deposit_amount: depositPercent,
      car_detail: {
        brand: brand.id,
        model: model.id,
        year: year?.label,
      },
      locale,
      campaign_id: campaignId,
    });

    if (res?.error?.message) {
      showToast('error', res?.error?.message);
    } else if (res?.message) {
      showToast('success', res?.message);
      setIsOpen(false);
      onSuccess?.();
    }
  };

  const renderSelectedInfo = () => {
    const { brand, model, year, class: variant } = values?.car_detail || {};
    const carTitle = [brand, model, year, variant]
      .map((field) => getLocaleString(field, 'label', locale))
      .filter(Boolean)
      .join(' ');

    return (
      <div className="flex flex-col gap-2">
        <Text className="font-medium">{t('Financing Details')}</Text>
        <BaseCard className="bg-primary-50 border-primary-300 grid grid-cols-2 p-4 md:gap-x-10 md:gap-y-7 text-sm font-semibold">
          <div className="flex flex-col gap-1">
            <Text className="text-gray text-xs font-normal">
              {t('Car Name')}
            </Text>
            {carTitle}
          </div>
          <div className="flex flex-col gap-1">
            <Text className="text-gray text-xs font-normal">
              {t('Loan Duration')}
            </Text>
            {`${values?.year?.label} ${
              Number(values?.year?.label) > 1 ? t('Years') : t('Year')
            }`}
          </div>
          <div className="flex flex-col gap-1">
            <Text className="text-gray text-xs font-normal">
              {t('Car Price')}
            </Text>
            {`${formatNumberValue(values?.price)} ${
              configs?.currency[locale]?.label
            }`}
          </div>
          <div className="flex flex-col gap-1">
            <Text className="text-gray text-xs font-normal">
              {t('Deposit Percentage')}
            </Text>
            {`${depositPercent}%`}
          </div>
        </BaseCard>
      </div>
    );
  };

  const renderPromo = () => (
    <>
      <Text as="h3" className="text-sm md:text-xl lg:text-2xl font-bold">
        {t('Flexible Car Financing')}
      </Text>
      <Text className="text-xs md:text-sm lg:text-base">
        {t(
          'Down payment starting with {percent}% Fast approval Your next car awaits',
          { percent: minDepositPercent },
        )}
      </Text>
      <Text className="flex items-center gap-2 md:justify-center">
        {t('with')}{' '}
        <NextImage
          src={getAsset('/assets/sell-car-banner/fast-track-logo-blue.webp')}
          alt="Fast Track"
          width={133}
          height={20}
          className="w-20 md:w-24 h-auto"
        />
      </Text>
    </>
  );

  const renderContent = () => (
    <div className="flex flex-col gap-7">
      <div className="flipX md:absolute start-0 top-0 md:w-[260px] lg:w-[320px] rounded-xl md:rounded-none h-full p-4 md:p-0 overflow-hidden bg-[#0E2950] bg-[url('/assets/financing-popup-bg-mob.webp')] bg-[right_bottom] bg-cover md:bg-[#0E2950] bg-no-repeat flex flex-col gap-2 md:gap-6 justify-center">
        <NextImage
          src={getAsset(
            isRtl(locale)
              ? '/assets/finance_sidebar_ar.webp'
              : '/assets/finance_sidebar_en.webp',
          )}
          alt="Fast Track Car Financing"
          width={320}
          height={667}
          className="hidden md:block absolute inset-0 h-full w-full object-cover object-bottom flipX"
        />
        <div className="hidden md:flex flex-col gap-3 absolute inset-x-0 top-[12%] px-5 text-center text-white flipX">
          {renderPromo()}
        </div>
        <NextImage
          src={getAsset('/assets/sell-car-banner/fast-track-logo-blue.webp')}
          alt="Fast Track"
          width={132}
          height={85}
          className="w-16 md:hidden flipX rtl:ms-auto"
        />
        <div className="flex flex-col gap-1.5 md:hidden flipX">
          <Text className="text-white text-sm md:text-xl font-semibold">
            {t('Flexible Car Financing')}
          </Text>
          <Text className="text-white text-xs">
            {t(
              'Down payment starting with {percent}% Fast approval Your next car awaits',
              { percent: minDepositPercent },
            )}
          </Text>
        </div>
      </div>
      {renderSelectedInfo()}
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-y-4 lg:gap-y-7 gap-x-6 lg:gap-x-10">
          <Controller
            control={control}
            name="name"
            rules={{ required: t('Name is required') }}
            render={({ field }) => (
              <Input
                {...field}
                type="text"
                placeholder={t('Enter Your Full Name')}
                inputClassName="text-sm"
                inputTitle={t('Full Name')}
                errorMsg={errors.name?.message}
                showError
              />
            )}
          />

          <Controller
            control={control}
            name="phone"
            rules={{
              required: t('Phone Number is required'),
              validate: (value) => {
                return !configs.isValidMobileNumber(value)
                  ? t('Invalid Phone Number')
                  : true;
              },
            }}
            render={({ field }) => (
              <Input
                {...field}
                type="text"
                placeholder={t('Enter Your Phone Number')}
                inputClassName="text-sm rtl:text-right"
                inputTitle={t('Phone Number')}
                errorMsg={errors.phone?.message}
                showError
                dir="ltr"
              />
            )}
          />

          <Controller
            control={control}
            name="email"
            rules={{
              required: t('Email is required'),
              validate: (value) => {
                return !configs.isValidEmail(value) ? t('Invalid Email') : true;
              },
            }}
            render={({ field }) => (
              <Input
                {...field}
                type="text"
                placeholder={t('Enter Your Email')}
                inputClassName="text-sm"
                inputTitle={t('Email')}
                errorMsg={errors.email?.message}
                showError
              />
            )}
          />
        </div>

        <Button
          loading={isSubmitLoading}
          disabled={isSubmitLoading}
          className="w-full md:h-12"
          size="xl"
        >
          {t('Submit Application')}
        </Button>
      </form>
    </div>
  );

  return isMob ? (
    <DrawerWrapper
      isOpen={isOpen}
      onClose={() => setIsOpen(false)}
      title={t('Apply For Car Financing')}
    >
      {renderContent()}
    </DrawerWrapper>
  ) : (
    <Modal
      isOpen={isOpen}
      title={t('Apply For Car Financing')}
      onClose={() => setIsOpen(false)}
      contentClassName="overflow-visible py-0 flex flex-col gap-7"
      containerClassName="md:max-w-[767px] lg:max-w-[1024px] md:pl-[280px] lg:pl-[360px] md:pr-10 rtl:md:pr-[280px] rtl:lg:pr-[360px] rtl:md:pl-10 overflow-hidden"
    >
      {renderContent()}
    </Modal>
  );
};

export default LoanApplicationFormModal;
