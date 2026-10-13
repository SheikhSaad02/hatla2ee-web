'use client';

import { useScrollDarkBand } from '@/hooks/useScrollDarkBand';
import PackageCard from './packageCard';

// The light↔dark background itself is PageDarkBand, rendered near the root so
// the change reads full-viewport. This only needs the `dark` boolean, from the
// same #packages element, to recolor the cards.
export default function PackagesDarkBand({ packages }) {
  const { dark } = useScrollDarkBand('packages');

  return (
    <div className="relative mx-auto grid max-w-4xl grid-cols-1 items-stretch gap-6 md:grid-cols-2 lg:gap-8">
      {packages.map((pkg) => (
        <PackageCard key={pkg.slug} pkg={pkg} dark={dark} />
      ))}
    </div>
  );
}
