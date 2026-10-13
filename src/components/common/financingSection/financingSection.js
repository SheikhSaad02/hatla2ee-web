'use client';

import { TailoredIcon1, TailoredIcon2, TailoredIcon3 } from '@/icons';
import { useLocale, useTranslations } from 'next-intl';
import BaseCard from '../baseCard/baseCard';
import Button from '../button/button';
import Input from '../input/input';
import InputRangeSlider from '../inputRangeSlider/inputRangeSlider';
import NextImage from '../nextImage';
import Price from '../price/price';
import { RadioGroup } from '../radioGroup';
import Text from '../text';
import configs from '@/configs';
import { formatNumberWithPrice } from '@/utils/numbers';
import { useState } from 'react';
import LoanApplicationFormModal from '@/components/car-finance/loan-application-form-modal';
import {
  CAMPAIGN_ID_DETAIL_PAGE,
  CAR_PRICE_THRESHOLD,
  CAR_PRICE_UPPER_THRESHOLD,
  DEPOSIT_PERCENT_UPPER_THRESHOLD,
} from '@/data/car-finance';
import {
  getInterestRate,
  getMinDepositPercent,
  isUsedCondition,
  validateDepositAmount,
} from '@/utils/car-finance';
import { listingJumpLinks } from '@/data/detail';
import { carFinancingEvents } from '@/services/analyticsService/events';
import { PAGE_TYPES } from '@/services/analyticsService/constants';
import { useUser } from '@/providers/user';
import { getAsset } from '@/utils/general';

const FinancingSection = ({
  listingPrice = 0,
  condition,
  carDetail,
  showMarketingColumn = true,
}) => {
  const isUsedCar = isUsedCondition(condition);
  const minDepositPercent = getMinDepositPercent(isUsedCar);
  // The listing price is the ceiling, capped by the calculator's own upper bound
  const maxPrice = Math.min(
    Number(listingPrice) || CAR_PRICE_UPPER_THRESHOLD,
    CAR_PRICE_UPPER_THRESHOLD,
  );
  const [price, setPrice] = useState(Math.min(listingPrice, maxPrice));
  const [showApplyForm, setShowApplyForm] = useState(false);
  const { user } = useUser();
  const [depositPercent, setDepositPercent] = useState(minDepositPercent);
  const [term, setTerm] = useState({
    key: 5,
    label: '5',
    value: '5',
  });
  const t = useTranslations('common');
  const tCarFinance = useTranslations('carFinance');

  const rate = getInterestRate(isUsedCar, depositPercent);
  const depositAmount = Math.ceil((depositPercent / 100) * price);

  const loanAmount = price - depositAmount;
  const installmentCost = (loanAmount * rate * term?.value) / 100;
  const finalPrice = loanAmount + installmentCost;
  const monthlyInstallment = Math.ceil(finalPrice / (term?.value * 12));
  const parseNumber = (formattedValue) => {
    if (!formattedValue) return 0;
    const cleanValue = formattedValue.toString().replace(/[^\d.]/g, '');
    return Number(cleanValue) || 0;
  };

  const locale = useLocale();
  const depositValidation = validateDepositAmount({
    value: depositPercent,
    price,
    isUsedCar,
    t: tCarFinance,
  });
  const depositError =
    typeof depositValidation === 'string' ? depositValidation : undefined;

  return (
    <div
      id={listingJumpLinks.FINANCING}
      className="relative breakout overflow-hidden py-6 md:pt-10 bg-[linear-gradient(to_bottom,var(--color-primary-100)_0%,_white_60%,_white_100%)]"
    >
      <div className="container grid gap-10 lg:grid-cols-[1fr_43%] lg:gap-20">
        <div className="flex flex-col gap-4">
          <div className="flex items-center flex-wrap">
            <Text className="text-lg md:text-3xl font-bold leading-tight">
              {tCarFinance('Finance Your Car with')}
            </Text>
            <NextImage
              src={getAsset('/assets/fast-track-logo.webp')}
              width={150}
              height={48}
              className="object-contain h-8 md:h-10 relative top-[2px] -ml-2 md:ml-2"
            />
          </div>
          {showMarketingColumn && (
            <>
              <div className="grid grid-cols-3 gap-4 text-sm my-12">
                <div>
                  <TailoredIcon1 className="mb-3" />
                  <Text className="text-sm">
                    {t('Open and transparent interest rates and fees')}
                  </Text>
                </div>
                <div>
                  <TailoredIcon2 className="mb-3" />
                  <Text className="text-sm">
                    {t('Quick and simple paperless process')}
                  </Text>
                </div>
                <div>
                  <TailoredIcon3 className="mb-3" />
                  <Text className="text-sm">
                    {t('Fast approvals typically by the same business day')}
                  </Text>
                </div>
              </div>

              <NextImage
                src={getAsset('/assets/car-financing.png')}
                alt="Car finance"
                width={300}
                height={200}
                className="w-full flipX"
              />
            </>
          )}
        </div>

        <BaseCard className="p-5 flex gap-8 rounded-2xl shadow-lg">
          <Text as="h3" className="text-lg font-semibold">
            {t('How much do you want to spend?')}
          </Text>

          <div className="flex flex-col gap-6">
            <div className="flex flex-col gap-3">
              <Input
                value={formatNumberWithPrice(price, locale, false)}
                onChange={(e) => {
                  const rawValue = parseNumber(e.target.value);
                  setPrice(Math.min(rawValue, maxPrice));
                }}
                onBlur={() =>
                  setPrice((prev) => Math.max(prev, CAR_PRICE_THRESHOLD))
                }
                type="text"
                placeholder="0"
                suffix={
                  <div className="text-xs italic text-gray-light">
                    {configs?.currency[locale]?.label}
                  </div>
                }
                inputClassName="text-sm"
                inputTitle={t('Total Price')}
                inputTitleClassName="text-xs text-dim"
              />
              <InputRangeSlider
                label={t('Deposit Percentage')}
                value={depositPercent}
                onChange={(value) => setDepositPercent(Number(value) || 0)}
                min={minDepositPercent}
                max={DEPOSIT_PERCENT_UPPER_THRESHOLD}
                step={1}
                boundsAsPrice={false}
                boundsSuffix="%"
                errorMsg={depositError}
                suffix={<div className="text-xs italic text-gray-light">%</div>}
                inputClassName="text-sm"
                inputDescription={
                  <Text className="text-xs text-gray mt-1.5 italic">
                    {tCarFinance('deposit_amount_percent', {
                      percent: depositPercent,
                      amount: depositAmount.toLocaleString(),
                      currency: configs?.currency[locale]?.label,
                    })}
                  </Text>
                }
              />
            </div>

            <div>
              <Text className="block text-xs text-dim mb-2">
                {t('Term of loan (years)')}
              </Text>

              <RadioGroup
                value={term}
                options={[
                  {
                    key: 1,
                    label: '1',
                    value: '1',
                  },
                  {
                    key: 2,
                    label: '2',
                    value: '2',
                  },
                  {
                    key: 3,
                    label: '3',
                    value: '3',
                  },
                  {
                    key: 4,
                    label: '4',
                    value: '4',
                  },
                  {
                    key: 5,
                    label: '5',
                    value: '5',
                  },
                ]}
                itemClassName="flex-1"
                className={'w-full'}
                labelClassName="w-full text-center"
                onChange={(value) => {
                  setTerm(value);
                }}
              />
            </div>

            <div className="flex flex-col gap-4 bg-primary-50 rounded-lg p-4">
              <div className="grid grid-cols-1 sm:grid-cols-[1fr_auto] sm:items-end gap-x-4 gap-y-2">
                <div className="flex flex-col gap-1">
                  <Text className="text-[13px] font-bold text-grey-900">
                    {t('Monthly Installment')}
                  </Text>
                  <Text className="text-[11px] text-gray-500 font-normal leading-tight">
                    {tCarFinance(
                      'Terms and rates are determined upon final agreement',
                    )}
                  </Text>
                </div>
                <div className="text-2xl md:text-3xl font-extrabold text-primary-900 leading-tight">
                  <Price
                    currencyClassName="text-primary-900 font-bold"
                    value={monthlyInstallment}
                  />
                </div>
              </div>
              <Button
                className="w-full md:h-11 rounded-lg"
                disabled={!!depositError}
                onClick={() => {
                  carFinancingEvents['click_apply_financing']?.(
                    locale,
                    user,
                    'offerdetail',
                    depositPercent,
                    price,
                    condition,
                    carDetail,
                  );
                  setShowApplyForm(true);
                }}
              >
                {t('Apply for Car financing')}
              </Button>
            </div>
          </div>
        </BaseCard>
      </div>

      <LoanApplicationFormModal
        isOpen={showApplyForm}
        setIsOpen={setShowApplyForm}
        pageType="offerdetail"
        campaignId={CAMPAIGN_ID_DETAIL_PAGE}
        values={{
          price,
          year: term,
          condition,
          deposit_amount: depositPercent,
          car_detail: carDetail,
        }}
      />
    </div>
  );
};

export default FinancingSection;
