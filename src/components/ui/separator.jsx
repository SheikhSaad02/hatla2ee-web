'use client';

import * as React from 'react';
import * as SeparatorPrimitive from '@radix-ui/react-separator';

import { cn } from '@/utils';

function Separator({
  className,
  orientation = 'horizontal',
  decorative = true,
  variant = 'line',
  ...props
}) {
  return (
    <SeparatorPrimitive.Root
      data-slot="separator-root"
      decorative={decorative}
      orientation={orientation}
      className={cn(
        variant === 'line'
          ? 'bg-gray-300 shrink-0 data-[orientation=horizontal]:h-px data-[orientation=horizontal]:w-full data-[orientation=vertical]:h-full data-[orientation=vertical]:w-px'
          : 'bg-gray-300 h-[0.3334em] w-[0.3334em] rounded-full inline-block mx-2',
        className,
      )}
      {...props}
    />
  );
}

export { Separator };
