'use client';

import { useLocale } from 'next-intl';
import { useScrollDarkBand } from '@/hooks/useScrollDarkBand';

// Anchored in px to the overlay's top; a % gradient would drift as it animates.
const glow = (rtl) =>
  `radial-gradient(1100px 760px at ${rtl ? '100%' : '0%'} 240px, rgba(49,96,165,0.38) 0%, rgba(49,96,165,0) 68%)`;

// Page-level light↔dark background: a fixed white base plus a navy overlay
// tracking #packages' scroll position, so the change reads full-viewport.
export default function PageDarkBand() {
  const { opacity, height } = useScrollDarkBand('packages');
  const rtl = useLocale() !== 'en';

  return (
    <>
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 -z-10 bg-white"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-x-0 top-0 -z-10"
        style={{
          opacity,
          height: `${height}px`,
          backgroundColor: '#0f1e35',
          backgroundImage: glow(rtl),
        }}
      />
    </>
  );
}
