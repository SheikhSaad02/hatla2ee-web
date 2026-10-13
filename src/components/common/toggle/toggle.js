'use client';

import React from 'react';
import { Switch } from '@/components/ui/switch';
import { cn } from '@/utils';

const Toggle = ({
  checked,
  onCheckedChange,
  label,
  className,
  labelClassName,
  containerClassName,
}) => {
  return (
    <div className={cn('flex items-center gap-3', containerClassName)}>
      {label && (
        <label
          className={cn(
            'text-sm font-medium text-gray-700 cursor-pointer',
            labelClassName,
          )}
          onClick={() => onCheckedChange(!checked)}
        >
          {label}
        </label>
      )}
      <Switch
        checked={checked}
        onCheckedChange={onCheckedChange}
        className={className}
      />
    </div>
  );
};

export default Toggle;
