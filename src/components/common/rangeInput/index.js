'use client';

import { useTranslations } from 'next-intl';
import { cn } from '@/utils';
import Input from '../input/input';
import { useState, useEffect } from 'react';

export default function RangeInput({
  onChange,
  min = 0,
  max = 100,
  value = [min, max],
  disabled = false,
  className = '',
  formatValue = true,
  inputProps = {},
}) {
  const t = useTranslations('common');
  const [minValue, setMinValue] = useState(value[0]?.toString());
  const [maxValue, setMaxValue] = useState(value[1]?.toString());

  useEffect(() => {
    setMinValue(value[0]?.toString());
    setMaxValue(value[1]?.toString());
  }, [value]);

  const formatNumber = (num) => {
    if (!num) return '';
    if (!formatValue) return num?.toString();
    return new Intl.NumberFormat().format(num);
  };

  const parseNumber = (str) => {
    const cleaned = str?.replace(/[^\d.-]/g, '');
    const parsed = Number.parseFloat(cleaned);
    return isNaN(parsed) ? '' : parsed;
  };

  const handleMinChange = (e) => {
    const inputValue = e.target.value;
    let numericValue = parseNumber(inputValue);
    if (numericValue > max) {
      numericValue = max;
    }
    setMinValue(inputValue);

    const currentMax = parseNumber(maxValue);

    if (onChange) {
      onChange([numericValue, currentMax]);
    }
  };

  const handleMaxChange = (e) => {
    const inputValue = e.target.value;
    let numericValue = parseNumber(inputValue);
    if (numericValue > max) {
      numericValue = max;
    }
    setMaxValue(inputValue);

    const currentMin = parseNumber(minValue);

    if (onChange) {
      onChange([currentMin, numericValue]);
    }
  };

  return (
    <div className={cn('flex items-center gap-2', className)}>
      <Input
        id="min-value"
        type="text"
        placeholder={t('Min')}
        value={formatNumber(parseNumber(minValue))}
        onChange={handleMinChange}
        disabled={disabled}
        containerClassName="w-full"
        {...inputProps}
      />

      <Input
        id="max-value"
        type="text"
        placeholder={t('Max')}
        value={formatNumber(parseNumber(maxValue))}
        onChange={handleMaxChange}
        disabled={disabled}
        containerClassName="w-full"
        {...inputProps}
      />
    </div>
  );
}
