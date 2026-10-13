import { useMemo, useEffect } from 'react';
import { Search } from 'lucide-react';
import { useLocale, useTranslations } from 'next-intl';
import { usePathname, useSearchParams } from 'next/navigation';

import configs from '@/configs';
import Text from '@/components/common/text';
import { useIsMobile } from '@/providers/isMobile';
import { formatNumberValue } from '@/utils/numbers';
import { fetchNewCarVariantPrice } from '@/apis/new-car-prices';
import {
  CAR_PRICE_THRESHOLD,
  CAR_PRICE_UPPER_THRESHOLD,
  DEPOSIT_PERCENT_UPPER_THRESHOLD,
  getConditionOptions,
  yearsOptions,
} from '@/data/car-finance';
import { fetchListingDetail } from '@/apis/listing';
import { fetchNewListingVariantLevelDetail } from '@/apis/new-car';
import {
  clampCarPrice,
  getMinDepositPercent,
  isUsedCondition,
  validateDepositAmount,
} from '@/utils/car-finance';

export function useCarFinanceForm(
  getValues = () => ({}),
  setValue = () => {},
  reset = () => {},
  trigger = () => {},
) {
  const t = useTranslations('carFinance');
  const locale = useLocale();
  const pathname = usePathname();
  const isMob = useIsMobile() ?? false;
  const conditionOptions = useMemo(() => getConditionOptions(t), [t]);
  const isUsedCar = pathname.includes('/finance-used-car');
  const formValues = getValues();
  // The selected tab drives both the deposit floor and the applicable interest rate
  const isUsedSelected = formValues?.condition
    ? isUsedCondition(formValues.condition)
    : isUsedCar;
  const minDepositPercent = getMinDepositPercent(isUsedSelected);
  const searchParams = useSearchParams();
  const queryParams = Object.fromEntries(searchParams.entries());
  const { carId, nCarTeraz } = queryParams || {};

  useEffect(() => {
    if (carId || nCarTeraz) {
      fetchCarDetail();
    }
  }, [carId, nCarTeraz]);

  const defaultValues = useMemo(
    () => ({
      condition: conditionOptions.find((opt) =>
        isUsedCar ? opt.key === 'used' : opt.key === 'new',
      ),
      car_detail: null,
      price: '',
      deposit_amount: getMinDepositPercent(isUsedCar),
      year: { key: '5', label: '5' },
    }),
    [isUsedCar],
  );

  useEffect(() => {
    reset(defaultValues);
  }, [pathname, reset]);

  const mapCarDetail = (response) => {
    const dataKey = response?.dynamic_fields || response;
    return {
      brand: dataKey?.make,
      model: dataKey?.model,
      year: Object.fromEntries(
        ['key', 'slug', 'label'].map((k) => [k, dataKey?.year]),
      ),
      class: dataKey?.variant || {},
    };
  };

  const fetchCarDetail = async () => {
    let response = carId
      ? await fetchListingDetail(carId)
      : nCarTeraz
        ? await fetchNewListingVariantLevelDetail(nCarTeraz)
        : null;

    if (response && !response?.error) {
      setValue('car_detail', mapCarDetail(response), { shouldTouch: true });
      setValue('price', clampCarPrice(response?.price), { shouldTouch: true });
      setValue('deposit_amount', minDepositPercent, {
        shouldTouch: true,
      });
    }
  };

  const fetchCarPrice = async (value) => {
    const response = await fetchNewCarVariantPrice({
      make: value?.brand?.slug,
      model: value?.model?.slug,
      year: value?.year?.slug,
      variant: value?.class?.variant_id,
    });
    if (response) {
      setValue('price', clampCarPrice(response), { shouldTouch: true });
    }
  };

  const handleDepositValidation = (value) =>
    validateDepositAmount({
      value,
      price: getValues().price,
      isUsedCar: isUsedSelected,
      t,
    });

  const handlePriceValidation = (value) => {
    const price = Number(value);
    return price < CAR_PRICE_THRESHOLD || price > CAR_PRICE_UPPER_THRESHOLD
      ? t(
          'The car price must be between {minAmount} and {maxAmount} {currency}',
          {
            minAmount: formatNumberValue(CAR_PRICE_THRESHOLD),
            maxAmount: formatNumberValue(CAR_PRICE_UPPER_THRESHOLD),
            currency: configs?.currency[locale]?.label,
          },
        )
      : true;
  };
  const formItems = useMemo(() => {
    const { deposit_amount, price } = formValues;

    return [
      {
        label: t('Choose your financing option'),
        key: 'condition',
        type: 'radio',
        options: conditionOptions,
        onChange: (value) => {
          setValue('car_detail', null);
          // Reset to the new tab's floor rather than carrying over an invalid deposit
          setValue(
            'deposit_amount',
            getMinDepositPercent(isUsedCondition(value)),
          );
        },
      },
      {
        label: t('Select Car'),
        key: 'car_detail',
        type: 'car-selection',
        onSelect: (value) => {
          setValue('car_detail', value);
          setValue('price', '');
          if (
            !(carId || nCarTeraz) &&
            value &&
            formValues?.condition?.key == 'new'
          ) {
            fetchCarPrice(value);
          }
        },
        onClear: () => setValue('car_detail', null),
        triggerProps: {
          suffix: <Search className="text-primary" size={isMob ? 14 : 20} />,
          size: 'medium',
          placeholder: t('Select Brand, Model, Class'),
          prefix: null,
        },
        elasticSearch: formValues?.condition?.key != 'new',
      },
      {
        label: t('Car Price'),
        key: 'price',
        type: 'input-slider',
        placeholder: t('Enter Car Price'),
        triggerProps: {
          suffix: (
            <Text className="text-xs italic text-gray-light">
              {configs?.currency[locale]?.label}
            </Text>
          ),
          min: CAR_PRICE_THRESHOLD,
          max: CAR_PRICE_UPPER_THRESHOLD,
        },
        onChange: (value) => {
          setValue('price', value, { shouldTouch: true });
          if (formValues?.deposit_amount) trigger('deposit_amount');
        },

        rules: {
          required: t('Car Price is required'),
          validate: handlePriceValidation,
        },
        formatValue: true,
        hideExternalLabel: true,
      },
      {
        label: t('Deposit Percentage'),
        key: 'deposit_amount',
        type: 'input-slider',
        placeholder: t('Enter Deposit Percentage'),
        triggerProps: {
          suffix: <Text className="text-xs italic text-gray-light">%</Text>,
          min: minDepositPercent,
          max: DEPOSIT_PERCENT_UPPER_THRESHOLD,
          step: 1,
          boundsAsPrice: false,
          boundsSuffix: '%',
        },
        rules: {
          validate: handleDepositValidation,
        },
        hideExternalLabel: true,
        inputDescription: price ? (
          <Text className="text-xs text-gray mt-1.5 italic">
            {t('deposit_amount_percent', {
              percent: Number(deposit_amount) || 0,
              amount: formatNumberValue(
                Math.ceil(price * ((Number(deposit_amount) || 0) / 100)),
              ),
              currency: configs?.currency[locale]?.label,
            })}
          </Text>
        ) : null,
      },
      {
        label: t('Loan Duration (Years)'),
        key: 'year',
        type: 'radio',
        itemClassName: 'flex-1',
        options: yearsOptions,
      },
    ];
  }, [minDepositPercent, locale, isMob, formValues]);

  return { defaultValues, formItems, isMob };
}
