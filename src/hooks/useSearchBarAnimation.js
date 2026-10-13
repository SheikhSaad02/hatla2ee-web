'use client';
import { useState, useRef } from 'react';
import { isRtl } from '@/utils/general';
import { useLocale } from 'next-intl';
export const useSearchBarAnimation = (options = {}) => {
  const { animationDuration = 300 } = options;
  const [showSearchBar, setShowSearchBar] = useState(false);
  const searchBarRef = useRef(null);
  const navLinksRef = useRef(null);
  const locale = useLocale();
  const rtl = isRtl(locale);
  const toggleSearchBar = (show) => {
    if (show) {
      setShowSearchBar(true);
      setTimeout(() => {
        if (searchBarRef.current) {
          searchBarRef.current.style.opacity = '1';
          searchBarRef.current.style.transform = 'translateX(0)';
        }
        if (navLinksRef.current) {
          navLinksRef.current.style.opacity = '0';
          navLinksRef.current.style.transform = rtl
            ? 'translateX(20px)'
            : 'translateX(-20px)';
        }
      }, 10);
    } else {
      if (searchBarRef.current) {
        searchBarRef.current.style.opacity = '0';
        searchBarRef.current.style.transform = rtl
          ? 'translateX(-20px)'
          : 'translateX(20px)';
      }
      if (navLinksRef.current) {
        navLinksRef.current.style.opacity = '1';
        navLinksRef.current.style.transform = 'translateX(0)';
      }

      setTimeout(() => {
        setShowSearchBar(false);
      }, animationDuration);
    }
  };

  return {
    showSearchBar,
    searchBarRef,
    navLinksRef,
    toggleSearchBar,
  };
};
