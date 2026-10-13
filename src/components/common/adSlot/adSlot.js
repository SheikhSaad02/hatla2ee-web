'use client';

import { useEffect, useRef } from 'react';

import { usePathname } from 'next/navigation';

export default function AdSlot({
  adSlot,
  className,
  layout = 'auto',
  responsive = true,
}) {
  const ref = (useRef < HTMLDivElement) | (null > null);
  const pathname = usePathname();

  useEffect(() => {
    if (typeof window === 'undefined' || !window.adsbygoogle) return;

    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch (e) {}
  }, [pathname]);

  return (
    <div className={className} ref={ref}>
      <ins
        className="adsbygoogle"
        style={{ display: 'block' }}
        data-ad-client="ca-pub-XXXXXXXXXXXXXXXX"
        data-ad-slot={adSlot}
        data-ad-format={layout}
        data-full-width-responsive={responsive ? 'true' : 'false'}
      />
    </div>
  );
}
