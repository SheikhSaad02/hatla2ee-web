import { Modal } from '../modal';
import React from 'react';
import { cn } from '@/utils';

const FullScreen = ({
  isOpen,
  title,
  onClose,
  children,
  footerContent,
  containerClassName,
  headerClassName,
  footerClassName,
  contentClassName,
  showHeader,
  showIconClose,
  className,
  overlayClassName,
  closeBtnClassName,
  outsideCloseBtn,
  ...rest
}) => {
  return (
    <Modal
      isOpen={isOpen}
      title={title}
      onClose={onClose}
      footerContent={footerContent}
      className={className}
      containerClassName={cn(
        'w-svw h-full max-w-auto p-0 rouded-initial flex flex-col',
        containerClassName,
      )}
      contentClassName={cn('flex flex-col gap-6 p-4', contentClassName)}
      radius={false}
      headerClassName={cn(
        'border-b border-gray-300 shadow-md py-5 px-4 h-min z-1',
        headerClassName,
      )}
      footerClassName={cn(
        'border-t border-gray-300 shadow-md py-3 px-4 h-min bg-white bottom-0 mt-auto fixed z-1 w-full',
        footerClassName,
      )}
      showHeader={showHeader}
      showIconClose={showIconClose}
      closeBtnClassName={closeBtnClassName}
      overlayClassName={cn('hidden', overlayClassName)}
      outsideCloseBtn
      {...rest}
    >
      {children}
    </Modal>
  );
};

export default FullScreen;
