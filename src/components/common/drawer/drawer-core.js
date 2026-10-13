'use client';

import React from 'react';
import {
  Drawer,
  DrawerTrigger,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerDescription,
  DrawerFooter,
} from '@/components/ui/drawer';
import { cn } from '@/utils';
import ScrollArea from '../scrollArea';

export default function DrawerWrapperContent({
  trigger,
  title,
  description,
  children,
  footer,
  titleClassName = '',
  containerClassName = '',
  childrenClassName = '',
  isOpen,
  onClose,
  closeBtnClassName,
  fullScreen = true,
}) {
  return (
    <Drawer
      open={isOpen}
      onOpenChange={onClose}
      repositionInputs={false}
    >
      {trigger && <DrawerTrigger asChild>{trigger}</DrawerTrigger>}

      <DrawerContent
        fullScreen={fullScreen}
        className={cn(
          'overflow-y-visible overscroll-contain',
          containerClassName,
        )}
      >
        {(title || description) && (
          <DrawerHeader closeBtnClassName={closeBtnClassName}>
            {title && (
              <DrawerTitle className={cn('text-sm', titleClassName)}>
                {title}
              </DrawerTitle>
            )}
            {description && (
              <DrawerDescription>{description}</DrawerDescription>
            )}
          </DrawerHeader>
        )}

        <ScrollArea className={cn('flex-1 p-4', childrenClassName)}>
          {children}
        </ScrollArea>

        {footer && <DrawerFooter className="shadow-sm">{footer}</DrawerFooter>}
      </DrawerContent>
    </Drawer>
  );
}
