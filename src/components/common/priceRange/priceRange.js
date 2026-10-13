import { cn } from '@/utils';
import { useLocale, useTranslations } from 'next-intl';
import Price from '../price/price';
import Text from '../text';
import configs from '@/configs';
import TextWithIcon from '../textWithIcon/textWithIcon';
import { InfoIcon } from '@/icons';

const PriceRange = ({
  label,
  min,
  max,
  className,
  valueClassName,
  variant = 'uniform',
  showFallbackMsg = true,
  priceNotAvailable,
}) => {
  const t = useTranslations('common');
  const locale = useLocale();

  const renderPrice = (value) => {
    return value !== null && value !== undefined ? (
      <Price
        value={value}
        showCurrencyLabel={false}
        style={variant}
        valueClassName={cn('break-all font-semibold', valueClassName)}
      />
    ) : null;
  };

  return (
    <div
      className={cn(
        // 'w-full',
        className,
      )}
    >
      {label && <Text className="text-sm text-gray mb-1">{label}</Text>}
      <div className="flex flex-wrap items-center gap-1 text-xs md:text-sm">
        {(!min && !max) || priceNotAvailable === true ? (
          <Text className="text-xs md:text-sm italic">
            {showFallbackMsg ? (
              priceNotAvailable === true ? (
                <TextWithIcon
                  className="gap-1.5  text-danger"
                  icon={<InfoIcon className="w-4 h-4 " />}
                  titleClassName={'text-xs'}
                  title={t('Price Not Available')}
                />
              ) : (
                t('Data Not Available')
              )
            ) : (
              ' '
            )}
          </Text>
        ) : min === max ? (
          <>
            {renderPrice(min)}
            {configs.currency[locale]?.label}
          </>
        ) : (
          <>
            {renderPrice(min)}
            {min != null && max != null && (
              <span className="leading-none">-</span>
            )}
            {renderPrice(max)}
            {configs.currency[locale]?.label}
          </>
        )}
      </div>
    </div>
  );
};

export default PriceRange;
