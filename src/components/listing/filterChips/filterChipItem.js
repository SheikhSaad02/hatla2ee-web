'use client';

import { cn } from '@/utils';
import { X } from 'lucide-react';

const FilterChipItem = ({
  label,
  onRemove,
  onClick,
  hideCross = false,
  className,
}) => {
  return (
    <span
      onClick={onClick}
      className={cn(
        'group flex items-center px-4 pe-1 py-1 rounded-full bg-white text-gray-700 text-sm font-medium border border-gray-200 text-nowrap',
        className,
      )}
    >
      {label}
      <div
        onClick={(e) => {
          e.stopPropagation();
          onRemove?.(e);
        }}
        className={`ms-2 cursor-pointer ${
          !hideCross ? 'bg-gray-50' : ''
        } p-1 rounded-2xl group-hover:text-destructive group-hover:bg-danger-300`}
        aria-label={`Remove ${label}`}
      >
        {!hideCross && <X strokeWidth={3} size={11} />}
      </div>
    </span>
  );
};

export default FilterChipItem;
