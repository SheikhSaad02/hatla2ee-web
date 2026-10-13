'use client';
import { Search, XIcon } from 'lucide-react';
import { isRtl } from '@/utils/general';
import { useLocale } from 'next-intl';
import CarMakeModalSearch from '@/components/landingSearch/carMakeModalSearch';
import { useEffect, useRef, useState } from 'react';
import { cn } from '@/utils';
import { useSearchAnalytics } from '@/hooks/useSearchAnalytics';
import { PAGE_SECTIONS } from '@/services/analyticsService/constants';

export default function AnimatedSearchBar({
  showSearchBar,
  searchBarRef,
  toggleSearchBar,
}) {
  const locale = useLocale();
  const rtl = isRtl(locale);
  const selectRef = useRef(null);
  const [animateIn, setAnimateIn] = useState(false);
  const handleSearchOpen = useSearchAnalytics('home', PAGE_SECTIONS.HEADER);

  useEffect(() => {
    if (showSearchBar) {
      const timeout = setTimeout(() => setAnimateIn(true), 20); // short delay to trigger animation
      return () => clearTimeout(timeout);
    } else {
      setAnimateIn(false);
    }
  }, [showSearchBar]);

  if (showSearchBar) {
    return (
      <div className="flex items-center gap-2 max-w-[600px] w-full m-auto transition-all duration-500 ease-in-out">
        <div
          ref={searchBarRef}
          className={cn(
            'transition-all duration-500 ease-in-out w-full',
            animateIn
              ? 'opacity-100 translate-x-0'
              : `opacity-0 ${rtl ? 'translate-x-8' : 'translate-x-8'}`,
          )}
        >
          <CarMakeModalSearch
            triggerProps={{
              variant: 'small',
            }}
            onSelect={() => {
              toggleSearchBar(false);
            }}
            onOpen={handleSearchOpen}
            selectRef={selectRef}
            pageSection={PAGE_SECTIONS.HEADER}
          />
        </div>
        <XIcon
          className="cursor-pointer transition-opacity duration-300"
          onClick={() => toggleSearchBar(false)}
        />
      </div>
    );
  }

  return (
    <Search
      className="hidden sm:inline w-5 h-5 cursor-pointer transition-opacity duration-300"
      onClick={() => {
        toggleSearchBar(true);
        setTimeout(() => {
          selectRef.current.focus();
        }, 350);
      }}
    />
  );
}
