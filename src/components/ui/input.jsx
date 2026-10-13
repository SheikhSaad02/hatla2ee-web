import * as React from 'react';

import { cn } from '@/utils';

function Input({ className, type, ...props }) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(className, 'inputField')}
      {...props}
    />
  );
}

export { Input };
