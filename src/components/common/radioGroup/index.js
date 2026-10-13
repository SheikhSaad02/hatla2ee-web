'use client';

import {
  RadioGroup as KitRadioGroup,
  RadioGroupItem,
} from '@/components/ui/radio-group';

import Label from '../label';
import { cn } from '@/utils';
import NextLink from '../nextLink';
import { useLocale } from 'next-intl';
import { createLocaleStringGetter } from '@/utils/general';

const pillsBaseStyles = cn(
  'flex items-center justify-center border rounded-full cursor-pointer transition-colors',
  'text-gray-700 font-medium',
  'peer-data-[state=checked]:bg-primary-50 peer-data-[state=checked]:text-primary',
  'peer-data-[state=checked]:border-primary-600 peer-data-[state=checked]:font-semibold',
  'peer-disabled:cursor-not-allowed peer-disabled:opacity-50',
);

const pillsVariants = {
  large: cn('px-4 py-1.5 text-sm', pillsBaseStyles),
  small: cn('px-2 py-1 text-xs', pillsBaseStyles),
};

export function RadioGroup(props) {
  const locale = useLocale();
  const t = createLocaleStringGetter(locale);

  const {
    options,
    value,
    name,
    onChange,
    className,
    labelClassName,
    required = false,
    getOptionLabel = (item) => t(item, 'label'),
    getOptionValue = (item) => item?.value,
    pills = true,
    renderItem,
    itemClassName,
    asLink = false,
    size = 'large', // default to large
  } = props;

  return (
    <KitRadioGroup
      value={getOptionValue(value) || ''}
      onValueChange={(e) =>
        onChange(options.find((item) => getOptionValue(item) === e))
      }
      name={name}
      required={required}
      className={cn('flex flex-wrap gap-2', className)}
    >
      {options?.map((option) => {
        const optionValue = getOptionValue(option);
        const optionId = `${name}-${optionValue}`;
        const isChecked = optionValue === getOptionValue(value);

        return (
          <div
            key={optionValue}
            className={cn('flex items-center space-x-2', itemClassName)}
          >
            <RadioGroupItem
              value={optionValue}
              id={optionId}
              disabled={option.disabled}
              className={cn((renderItem || pills) && 'hidden peer sr-only')}
            />
            <Label
              htmlFor={optionId}
              className={cn(
                'inline-block',
                option.disabled && 'opacity-50',
                !renderItem && pills && pillsVariants[size],
                labelClassName,
              )}
            >
              {renderItem ? (
                renderItem({ option, isChecked })
              ) : asLink ? (
                <NextLink href={option?.href} title={option?.label}>
                  {getOptionLabel(option)}
                </NextLink>
              ) : (
                getOptionLabel(option)
              )}
            </Label>
          </div>
        );
      })}
    </KitRadioGroup>
  );
}
