'use client';

import {
  Sheet as KitSheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';

import ScrollArea from '../scrollArea';
import { XIcon } from 'lucide-react';
import { cn } from '@/utils';

export function Sheet({
  title,
  description,
  children,
  trigger,
  side = 'bottom',
  isOpen,
  onClose,
  footerContent,
  contentClassName = '',
  containerClassName = '',
  headerClassName = '',
  footerClassName = '',
  titleClassName = '',
  descriptionClassName = '',
  ...props
}) {
  const appliedStyles = getAppliedStyles(side);

  return (
    <KitSheet open={isOpen} onOpenChange={onClose} {...props}>
      {trigger && <SheetTrigger asChild>{trigger}</SheetTrigger>}
      <SheetContent
        side={side}
        className={cn(appliedStyles.containerClassName, containerClassName)}
        onOpenAutoFocus={(e) => e.preventDefault()}
      >
        <SheetHeader
          className={cn(
            'relative',
            appliedStyles.headerClassName,
            headerClassName,
          )}
        >
          {title && <SheetTitle className={titleClassName}>{title}</SheetTitle>}
          {description && (
            <SheetDescription className={descriptionClassName}>
              {description}
            </SheetDescription>
          )}
        </SheetHeader>
        <ScrollArea className={cn('flex-1 p-4', contentClassName)}>
          {children}
        </ScrollArea>
        {footerContent && (
          <SheetFooter className={footerClassName}>{footerContent}</SheetFooter>
        )}
      </SheetContent>
    </KitSheet>
  );
}

const getAppliedStyles = (side) => {
  switch (side) {
    case 'bottom':
      return {
        containerClassName: 'rounded-t-2xl h-[70dvh] max-h-[400px]',
        headerClassName: 'shadow-[0px_1px_6px_0px_#00000014]',
      };
    default:
      return {
        containerClassName: '',
        headerClassName: '',
      };
  }
};
