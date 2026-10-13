'use client';

import dynamic from 'next/dynamic';
import { useOpenTransition } from '@/hooks/useOpenTransition';

const ModalContent = dynamic(() => import('./modal-core'), { ssr: false });

export function Modal({ isOpen, onClose, trigger, ...props }) {
  const { open, mounted, handleChange } = useOpenTransition({ isOpen, onClose });

  return (
    <>
      {trigger && <div onClick={() => handleChange(true)}>{trigger}</div>}
      {mounted && (
        <ModalContent isOpen={open} onClose={handleChange} {...props} />
      )}
    </>
  );
}
