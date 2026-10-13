'use client';

import { Checkbox } from '@/components/ui/checkbox';
import Label from '../label';
import React from 'react';
import { cn } from '@/utils';
import { useLocale } from 'next-intl';
import { createLocaleStringGetter } from '@/utils/general';

export function CheckboxGroup(props) {
  const locale = useLocale();
  const t = createLocaleStringGetter(locale);

  const {
    options,
    values,
    onChange,
    name,
    className,
    itemClassName,
    labelClassName,
    pills = true,
    renderItem,
    getOptionLabel = (item) => t(item, 'label'),
    getOptionValue = (item) => item?.value,
  } = props;

  return (
    <div className={cn('flex flex-wrap gap-2', className)}>
      {options.map((option) => {
        const isChecked = values.includes(getOptionValue(option));
        const checkboxId = `${name}-${getOptionValue(option)}`;

        return (
          <Label
            key={getOptionValue(option)}
            className={cn(
              'flex items-center space-x-2 cursor-pointer',
              pills &&
                cn(
                  'rounded-full px-4 py-1.5 lg:py-2 text-sm font-medium border bg-white transition-colors',
                  isChecked
                    ? 'bg-primary-50 lg:bg-primary-50 text-primary border-primary-500'
                    : '',
                ),
              itemClassName,
            )}
            htmlFor={checkboxId}
          >
            <Checkbox
              id={checkboxId}
              checked={isChecked}
              onCheckedChange={(checked) =>
                onChange(getOptionValue(option), checked)
              }
              className={cn((renderItem || pills) && 'sr-only')}
            />
            {renderItem ? (
              renderItem({ option, isChecked })
            ) : (
              <span className={cn(labelClassName)}>
                {getOptionLabel(option)}
              </span>
            )}
          </Label>
        );
      })}
    </div>
  );
}
