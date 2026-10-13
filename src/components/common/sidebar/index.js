import React from 'react';
import { cn } from '@/utils';

function Sidebar({ header, children, className, bottomSlot, containerClassName }) {
  return (
    // <div className="flex flex-col">
    <div className={cn("h-min sticky top-18 max-h-[calc(100dvh-76px)] overflow-y-auto hide-scrollbar", containerClassName)}>
      <div className={cn('flex flex-col gap-2 border rounded-xl', className)}>
        {header && (
          <div className="flex items-center justify-between">{header}</div>
        )}
        {children && <div>{children}</div>}
      </div>

      {bottomSlot}
    </div>
    // </div>
  );
}

export default Sidebar;
