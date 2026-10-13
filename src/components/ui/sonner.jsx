'use client';

import { cn } from '@/utils';
import { AlertCircle, CheckCircle, Info, XCircle } from 'lucide-react';
import { useTheme } from 'next-themes';
import { Toaster as Sonner } from 'sonner';

const Toaster = ({ className, position, ...props }) => {
  const { theme = 'system' } = useTheme();

  return (
    <Sonner
      theme={theme}
      position={position || 'top-center'}
      className={cn('toaster w-[400px] ', className)}
      style={{
        '--normal-bg': 'var(--popover)',
        '--normal-text': 'var(--popover-foreground)',
        '--normal-border': 'var(--border)',
      }}
      toastOptions={{ className: 'toaster w-[700px]' }}
      {...props}
    />
  );
};

export { Toaster };
