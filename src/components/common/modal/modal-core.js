'use client';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

import ScrollArea from '../scrollArea';
import { VisuallyHidden } from '@radix-ui/react-visually-hidden';
import { cn } from '@/utils';

export default function ModalContent({
  title,
  description,
  children,
  trigger,
  contentClassName,
  isOpen,
  onClose,
  footerContent,
  footerClassName,
  headerClassName,
  titleClassName,
  descriptionClassName,
  containerClassName,
  showHeader = true,
  showIconClose = true,
  radius = true,
  className,
  closeBtnClassName,
  titleContainerClass,
  overlayClassName,
  outsideCloseBtn,
  ...props
}) {
  return (
    <Dialog
      open={isOpen}
      onOpenChange={onClose}
      {...props}
      className={className}
    >
      {trigger && <DialogTrigger asChild>{trigger}</DialogTrigger>}

      <DialogContent
        className={cn('px-6 py-5 ', containerClassName)}
        onOpenAutoFocus={(e) => e.preventDefault()}
        showIconClose={showIconClose}
        closeBtnClassName={closeBtnClassName}
        overlayClassName={overlayClassName}
        outsideCloseBtn={outsideCloseBtn}
      >
        {showHeader && (
          <DialogHeader
            className={cn(
              'flex flex-row justify-between items-start text-start',
              headerClassName,
            )}
          >
            <div className={cn('flex flex-col gap-2', titleContainerClass)}>
              {title ? (
                <DialogTitle className={titleClassName}>{title}</DialogTitle>
              ) : (
                <VisuallyHidden>
                  <DialogTitle>{'Title'}</DialogTitle>
                </VisuallyHidden>
              )}
              {description && (
                <DialogDescription className={descriptionClassName}>
                  {description}
                </DialogDescription>
              )}
            </div>
          </DialogHeader>
        )}

        <ScrollArea className={cn('flex-1 py-4', contentClassName)}>
          {children}
        </ScrollArea>

        {footerContent && (
          <DialogFooter className={footerClassName}>
            {footerContent}
          </DialogFooter>
        )}
      </DialogContent>
    </Dialog>
  );
}
