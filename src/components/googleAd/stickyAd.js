'use client';

import { useState, useEffect, useRef, useMemo } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import { useLocale } from 'next-intl';
import { X } from 'lucide-react';
import AdBanner from './adBanner';
import Button from '@/components/common/button/button';

const STORAGE_KEY = 'stickyAdClosed';

export default function StickyAd({ adConfig }) {
  const [isClosed, setIsClosed] = useState(false);
  const [canRender, setCanRender] = useState(false);
  const [isAdRendered, setIsAdRendered] = useState(false);
  const hasScrolledRef = useRef(false);

  const pathname = usePathname();
  const searchParams = useSearchParams();
  const locale = useLocale();
  const fullUrl = useMemo(
    () => `${pathname}?${searchParams.toString()}`,
    [pathname, searchParams],
  );
  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (sessionStorage.getItem(STORAGE_KEY) === 'true') {
      setIsClosed(true);
    }
  }, []);
  useEffect(() => {
    hasScrolledRef.current = false;
    setCanRender(false);
    setIsAdRendered(false);

    if (typeof window === 'undefined') return;

    const handleScroll = () => {
      if (window.scrollY > 0 && !hasScrolledRef.current) {
        hasScrolledRef.current = true;
        setCanRender(true);
        window.removeEventListener('scroll', handleScroll);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => window.removeEventListener('scroll', handleScroll);
  }, [fullUrl]);

  const handleClose = () => {
    setIsClosed(true);
    sessionStorage.setItem(STORAGE_KEY, 'true');
  };

  if (
    process.env.NEXT_PUBLIC_STICKY_AD_ENABLED !== 'true' ||
    isClosed ||
    !canRender ||
    !adConfig
  ) {
    return null;
  }

  return (
    <div className="fixed left-0 right-0 bottom-[80px] z-[50] sm:hidden flex items-center justify-center">
      <div
        className={`relative rounded-xl overflow-hidden flex items-center justify-center ${
          isAdRendered ? 'bg-gray-100' : ''
        }`}
      >
        {isAdRendered && (
          <Button
            onClick={handleClose}
            variant="outline"
            size="small"
            className={`absolute top-2 z-[100] rounded-full bg-gray-200 hover:bg-gray-300 p-0 text-gray-700 w-7 h-7 flex items-center justify-center ${
              locale === 'ar' ? 'left-2' : 'right-2'
            }`}
            icon={<X className="size-3.5" />}
            aria-label="Close ad"
          />
        )}

        <AdBanner
          adConfig={adConfig}
          fitContainer
          stickyAd
          onAdRendered={() => setIsAdRendered(true)}
        />
      </div>
    </div>
  );
}
