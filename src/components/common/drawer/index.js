'use client';

import dynamic from 'next/dynamic';
import { useOpenTransition } from '@/hooks/useOpenTransition';

const DrawerWrapperContent = dynamic(() => import('./drawer-core'), {
  ssr: false,
});

export default function DrawerWrapper({ isOpen, onClose, trigger, ...props }) {
  const { open, mounted, handleChange } = useOpenTransition({ isOpen, onClose });

  return (
    <>
      {trigger && <div onClick={() => handleChange(true)}>{trigger}</div>}
      {mounted && (
        <DrawerWrapperContent isOpen={open} onClose={handleChange} {...props} />
      )}
    </>
  );
}
