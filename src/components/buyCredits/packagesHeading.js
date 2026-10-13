'use client';

import { useScrollDarkBand } from '@/hooks/useScrollDarkBand';
import { cn } from '@/utils';

// Only the heading needs the `dark` flag — the cards get it via
// PackagesDarkBand — so this stays a tiny client component of its own.
export default function PackagesHeading({ children }) {
  const { dark } = useScrollDarkBand('packages');

  return (
    <h2
      className={cn(
        'mx-auto mb-12 text-center text-[32px] font-semibold leading-[1.1] tracking-tight transition-colors duration-500 lg:whitespace-nowrap md:text-[40px]',
        dark ? 'text-white' : 'text-gray-900',
      )}
    >
      {children}
    </h2>
  );
}
