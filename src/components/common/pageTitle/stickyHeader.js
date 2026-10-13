'use client';

import { useEffect, useState } from 'react';
import { cn } from '@/utils';

export default function StickyHeader({ children, className }) {
  const [isStuck, setIsStuck] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsStuck(window.scrollY > 0);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header className={cn('sticky top-0 z-30', className)}>
      <div
        className={cn(
          'breakout bg-white py-3 transition-all duration-300',
          isStuck && 'shadow',
        )}
      >
        {children}
      </div>
    </header>
  );
}
