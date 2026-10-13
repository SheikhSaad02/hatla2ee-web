import { startTransition, useEffect, useState } from 'react';

export function useOpenTransition({ isOpen, onClose }) {
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    if (isOpen === undefined) return;
    if (isOpen) {
      if (!mounted) setMounted(true);
      startTransition(() => setOpen(true));
    } else {
      setOpen(false);
    }
  }, [isOpen]);

  const handleChange = (val) => {
    if (val) {
      if (!mounted) setMounted(true);
      startTransition(() => setOpen(true));
    } else {
      startTransition(() => {
        setOpen(false);
        onClose?.(false);
      });
    }
  };

  return { open, mounted, handleChange };
}
