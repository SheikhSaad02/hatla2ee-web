'use client';

import React from 'react';
import { cn } from '@/utils';

const ValueCell = ({ children, className, isLabel = false }) => {
  return (
    <div
      className={cn(
        'flex items-center justify-center h-12 lg:h-16 px-2 lg:px-4 border-b border-gray-50',
        isLabel ? 'justify-start text-left' : 'text-center',
        className,
      )}
    >
      {children}
    </div>
  );
};

export default ValueCell;
