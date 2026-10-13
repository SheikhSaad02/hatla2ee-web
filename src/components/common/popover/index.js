'use client';

import {
  PopoverContent,
  PopoverTrigger,
  Popover as ShadcnPopover,
} from '@/components/ui/popover';

import ScrollArea from '../scrollArea';
import { cn } from '@/utils';

export default function Popover({
  trigger,
  children,
  align = 'left',
  side = 'bottom',
  avoidCollisions = true,
  className,
  isOpen,
  onClose,
  zIndex,
}) {
  return (
    <ShadcnPopover open={isOpen} onOpenChange={onClose}>
      <PopoverTrigger asChild>{trigger}</PopoverTrigger>
      <PopoverContent
        align={align}
        side={side}
        avoidCollisions={avoidCollisions}
        className={cn(' flex flex-col', className)}
        onOpenAutoFocus={(e) => e.preventDefault()}
        style={{ zIndex: zIndex, width: 'var(--radix-popover-trigger-width)' }}
        onWheel={(e) => {
          e.stopPropagation();
        }}
      >
        <ScrollArea className={'flex-1 '}>{children}</ScrollArea>
      </PopoverContent>
    </ShadcnPopover>
  );
}
