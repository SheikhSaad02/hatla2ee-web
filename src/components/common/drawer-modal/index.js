'use client';

import DrawerWrapper from '@/components/common/drawer';
import { Modal } from '@/components/common/modal';
import { useIsMobile } from '@/providers/isMobile';
import { cn } from '@/utils';

export default function DrawerModal({
  isOpen,
  onClose,
  children,
  footer,
  title,
  description,
  showHeader = true,
  fullScreen = true,
  contentClassName,
  containerClassName,
  childrenClassName,
  trigger,
}) {
  const isMobile = useIsMobile() ?? false;

  if (isMobile) {
    return (
      <DrawerWrapper
        isOpen={isOpen}
        onClose={onClose}
        title={title}
        fullScreen={fullScreen}
        containerClassName={containerClassName}
        childrenClassName={cn('min-h-0 flex-1', childrenClassName)}
        titleClassName="text-sm"
        trigger={trigger}
        footer={footer}
      >
        {children}
      </DrawerWrapper>
    );
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      description={description}
      showHeader={showHeader}
      contentClassName={contentClassName}
      containerClassName={containerClassName}
      descriptionClassName="text-sm font-normal text-gray-500"
      footerClassName="border-gray-100"
      footerContent={footer}
      trigger={trigger}
    >
      {children}
    </Modal>
  );
}
