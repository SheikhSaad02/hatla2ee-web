'use client';

import { useEffect, useState } from 'react';
import { cn } from '@/utils';

export const BottomBar = ({ children, className, ...props }) => {
  const [hide, setHide] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const { scrollTop, scrollHeight, clientHeight } =
        document.documentElement;
      setHide(scrollTop + clientHeight >= scrollHeight - 100);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div
      className={cn(
        'fixed-bottom-bar transition-transform duration-300',
        hide && 'translate-y-full',
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
};
