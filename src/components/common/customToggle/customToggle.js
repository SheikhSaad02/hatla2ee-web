'use client';

import React from 'react';
import { cn } from '@/utils';

const CustomToggle = ({ value, onChange, options }) => {
  return (
    <div className="flex rounded-full bg-primary-200 w-fit">
      {options.map((option) => (
        <button
          key={option}
          type="button"
          onClick={() => onChange(option)}
          className={cn(
            'w-fit py-1 px-2 rounded-full text-xs font-medium transition-all  m-1',
            value === option
              ? 'bg-primary text-white'
              : 'text-gray-light cursor-pointer',
          )}
        >
          {option}
        </button>
      ))}
    </div>
  );
};

export default CustomToggle;
