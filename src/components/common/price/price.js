import configs from '@/configs';
import { cn } from '@/utils';
import { formatNumberValue } from '@/utils/numbers';
import clsx from 'clsx';
import { useLocale } from 'next-intl';

export default function Price({
  value,
  className = '',
  valueClassName = '',
  currencyClassName = '',
  showCurrencyLabel = true,
  currencyPosition = 'right',
  style = 'emphasize', // 'emphasize' | 'mutedCurrency' | 'uniform',
  priceFormatter,
}) {
  const formatPrice = priceFormatter ?? formatNumberValue;
  const locale = useLocale();
  const formattedValue = formatPrice(value, locale);

  const currencyLabel = () => {
    return configs.currency[locale]?.label ?? '';
  };

  const valueClass = cn(
    'leading-none',
    {
      'font-bold ': style === 'emphasize',
      'font-semibold ': style === 'mutedCurrency' || style === 'uniform',
    },
    valueClassName,
  );

  const currencyClass = cn(
    'leading-none',
    {
      'me-1': currencyPosition === 'left',
      'ms-1': currencyPosition === 'right',
      'font-normal text-muted-foreground': style === 'emphasize',
      'font-medium text-muted-foreground': style === 'mutedCurrency',
      'font-semibold': style === 'uniform',
    },
    currencyClassName,
  );

  return (
    <span className={clsx('inline-flex items-baseline', className)}>
      {currencyPosition === 'left' && showCurrencyLabel && (
        <span className={currencyClass}>{currencyLabel()}</span>
      )}

      <span className={valueClass}>{formattedValue}</span>

      {currencyPosition === 'right' && showCurrencyLabel && (
        <span className={currencyClass}>{currencyLabel()}</span>
      )}
    </span>
  );
}
