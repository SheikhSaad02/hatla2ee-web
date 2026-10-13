'use client';

import { formatNumberValue } from '@/utils/numbers';
import {
  getInterestRate,
  isUsedCondition,
  loanCalculator,
} from '@/utils/car-finance';
import { useMemo, useState } from 'react';
import BaseCard from '../common/baseCard/baseCard';
import Text from '../common/text';
import Price from '../common/price/price';
import PieChart from '../common/pieChart/pie-chart';
import Button from '../common/button/button';
import LoanApplicationFormModal from './loan-application-form-modal';
import { Separator } from '../ui/separator';
import NextImage from '../common/nextImage';
import { useTranslations } from 'next-intl';
import { CAMPAIGN_ID_FINANCE_LANDING } from '@/data/car-finance';
import { getAsset } from '@/utils/general';
import { PAGE_TYPES } from '@/services/analyticsService/constants';
import { useUser } from '@/providers/user';
import { carFinancingEvents } from '@/services/analyticsService/events';
import { useLocale } from 'next-intl';
const LoanPreview = (props) => {
  const {
    values,
    touchedFields = {},
    previewDependents = [],
    onReset,
    hasErrors,
  } = props || {};
  const [showApplyForm, setShowApplyForm] = useState(false);
  const showPreview = previewDependents?.every((key) => !!touchedFields?.[key]);
  const t = useTranslations('carFinance');
  const { user } = useUser();
  const locale = useLocale();
  const isUsedCar = useMemo(
    () => isUsedCondition(values?.condition),
    [values?.condition],
  );

  const {
    downPaymentAmount,
    totalRepayableAmount,
    monthlyInstallmentAmount,
    principalAmount,
    totalInterestAmount,
  } = loanCalculator(
    values,
    getInterestRate(isUsedCar, values?.deposit_amount),
  );

  const loanBreakdownData = useMemo(
    () => [
      {
        name: t('Interest Amount'),
        value: totalInterestAmount,
        color: '#165DFB',
      },
      {
        name: t('Principal Amount'),
        value: principalAmount,
        color: '#8EC6FF',
      },
    ],
    [totalInterestAmount, principalAmount, t],
  );

  const onClickApply = () => {
    carFinancingEvents['click_apply_financing']?.(
      locale,
      user,
      isUsedCar ? PAGE_TYPES?.CAR_FINANCING : PAGE_TYPES?.NEW_CAR_FINANCING,
      values?.deposit_amount,
      values?.price,
      values?.condition,
      values?.car_detail,
    );
    setShowApplyForm(true);
  };

  const renderEmptyState = () => {
    return (
      <div className="flex flex-col gap-6 place-content-center">
        <NextImage
          src={getAsset('/assets/finance-empty-state.webp')}
          width={318}
          height={302}
          className="mx-auto w-[130px] md:w-[318]"
        />
        <Text as="p" className="text-center text-dim text-sm md:text-base">
          {t(
            'Once you enter your details we’ll instantly show your monthly installments',
          )}
        </Text>
      </div>
    );
  };

  return !showPreview ? (
    renderEmptyState()
  ) : (
    <div className="flex flex-col justify-center gap-5 md:gap-12.5">
      <BaseCard className="p-4 md:px-7 md:py-5 w-full border-primary-600 shadow-lg gap-2 bg-[linear-gradient(180deg,rgba(145,234,228,0.06)_-0.18%,rgba(131,148,222,0.06)_49%,rgba(127,127,213,0.06)_99%)]">
        <div className="flex flex-col gap-1">
          <Text className="text-sm text-dim">{t('Monthly Payment')}</Text>
          <div className="text-xl">
            <Price
              value={monthlyInstallmentAmount}
              currencyClassName="text-gray-light"
              valueClassName="text-3.5xl"
            />
          </div>
        </div>
        <Separator className="bg-gray-100" />
        <div className="grid grid-cols-2 md:grid-cols-3 gap-1 items-center">
          <div className="flex flex-col">
            <Text className="text-dim text-sm">
              {t('Loan Duration (Years)')}
            </Text>
            <Text className="font-semibold">
              {values?.year?.label ?? '--'}{' '}
              {Number(values?.year?.label) > 1 ? t('Years') : t('Year')}
            </Text>
          </div>

          <div className="flex flex-col gap-1">
            <Text className="text-dim text-sm">{t('Deposit Amount')}</Text>
            <Price value={downPaymentAmount} />
          </div>
          <div className="flex flex-col gap-1">
            <Text className="text-dim text-sm">{t('Loan Amount')}</Text>
            <Price value={principalAmount} />
          </div>
        </div>
      </BaseCard>

      <div className="grid md:grid-cols-[230px_1fr] lg:grid-cols-[180px_1fr] xl:grid-cols-[230px_1fr] items-center gap-3">
        <PieChart
          data={loanBreakdownData}
          tooltipProps={{ valueAsPrice: true }}
        />
        <div className="flex flex-col gap-3 md:gap-4.5">
          {loanBreakdownData.map((item) => (
            <div key={item.name} className="flex justify-between text-sm">
              <Text
                className="flex gap-2 text-gray before:content-[''] before:self-center before:block before:w-3 before:h-3 before:rounded-xs before:bg-(--legend-bg-color) before:shrink-0"
                style={{ '--legend-bg-color': item.color }}
              >
                {item.name}
              </Text>
              <Price value={item.value} />
            </div>
          ))}

          <Separator className="my-1 bg-surface" />

          <div className="flex justify-between">
            <Text className="text-gray">{t('Total Amount Payable')}</Text>
            <Text className="font-semibold">
              {formatNumberValue(totalRepayableAmount)} {t('EGP')}
            </Text>
          </div>
        </div>
      </div>

      <Button
        onClick={onClickApply}
        disabled={!values?.car_detail || !values?.price || hasErrors}
        className="w-full md:h-12"
        size="xl"
      >
        {t('Apply For Car Financing')}
      </Button>
      <LoanApplicationFormModal
        isOpen={showApplyForm}
        setIsOpen={setShowApplyForm}
        values={values}
        campaignId={CAMPAIGN_ID_FINANCE_LANDING}
        pageType={
          isUsedCar ? PAGE_TYPES?.CAR_FINANCING : PAGE_TYPES?.NEW_CAR_FINANCING
        }
        onSuccess={() => {
          setShowApplyForm(false);
          onReset?.();
        }}
      />
    </div>
  );
};

export default LoanPreview;
