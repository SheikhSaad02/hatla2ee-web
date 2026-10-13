import * as React from 'react';

import { cn } from '@/utils/index';

function Textarea({ className, ...props }) {
  return (
    <textarea
      data-slot="textarea"
      className={cn('inputField', className)}
      {...props}
    />
  );
}

export { Textarea };
