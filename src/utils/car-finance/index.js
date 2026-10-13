import {
  CAR_PRICE_THRESHOLD,
  CAR_PRICE_UPPER_THRESHOLD,
  DEPOSIT_PERCENT_LOWER_THRESHOLD_NEW_CAR,
  DEPOSIT_PERCENT_LOWER_THRESHOLD_USED_CAR,
  DEPOSIT_PERCENT_UPPER_THRESHOLD,
  INTEREST_RATE_NEW_CAR,
  INTEREST_RATE_NEW_CAR_LOW_DEPOSIT,
  INTEREST_RATE_USED_CAR,
  NEW_CAR_LOW_DEPOSIT_THRESHOLD,
} from '@/data/car-finance';

export const getDurationInMonths = (duration) => {
  const years = Number(duration?.value ?? duration);
  return duration != null && !Number.isNaN(years) ? years * 12 : null;
};

export const isUsedCondition = (condition) =>
  (condition?.slug ?? condition?.key ?? condition) === 'used';

export const getMinDepositPercent = (isUsedCar) =>
  isUsedCar
    ? DEPOSIT_PERCENT_LOWER_THRESHOLD_USED_CAR
    : DEPOSIT_PERCENT_LOWER_THRESHOLD_NEW_CAR;

export const getInterestRate = (isUsedCar, depositPercent) => {
  if (isUsedCar) return INTEREST_RATE_USED_CAR;

  return Number(depositPercent) >= NEW_CAR_LOW_DEPOSIT_THRESHOLD
    ? INTEREST_RATE_NEW_CAR
    : INTEREST_RATE_NEW_CAR_LOW_DEPOSIT;
};

export const clampCarPrice = (price) =>
  Math.min(
    Math.max(Number(price) || 0, CAR_PRICE_THRESHOLD),
    CAR_PRICE_UPPER_THRESHOLD,
  );

export function validateDepositAmount({ value, price, isUsedCar, t }) {
  if (!Number(price)) return true;

  const numericValue = Number(value);
  const lowerThreshold = getMinDepositPercent(isUsedCar);

  if (
    numericValue < lowerThreshold ||
    numericValue > DEPOSIT_PERCENT_UPPER_THRESHOLD
  ) {
    return t(
      'The deposit amount must be between {lowerThreshold} and {upperThreshold}',
      {
        lowerThreshold: `${lowerThreshold}%`,
        upperThreshold: `${DEPOSIT_PERCENT_UPPER_THRESHOLD}%`,
      },
    );
  }

  return true;
}

export function loanCalculator(formValues, annualInterestRate) {
  if (!formValues?.price) {
    return {
      downPaymentAmount: 0,
      principalAmount: 0,
      totalInterestAmount: 0,
      totalRepayableAmount: 0,
      monthlyInstallmentAmount: 0,
      totalCostWithDownPayment: 0,
    };
  }

  const downPaymentAmount = Math.ceil(
    ((Number(formValues.deposit_amount) || 0) / 100) * formValues.price,
  );

  const principalAmount = formValues.price - downPaymentAmount;

  const totalInterestAmount = Math.ceil(
    (principalAmount * annualInterestRate * (formValues.year?.key || 0)) / 100,
  );

  const totalRepayableAmount = principalAmount + totalInterestAmount;

  const monthlyInstallmentAmount = Math.ceil(
    totalRepayableAmount / ((formValues.year?.key || 1) * 12 || 1),
  );

  const totalCostWithDownPayment = downPaymentAmount + totalRepayableAmount;

  return {
    downPaymentAmount,
    principalAmount,
    totalInterestAmount,
    totalRepayableAmount,
    monthlyInstallmentAmount,
    totalCostWithDownPayment,
  };
}
