'use client';
import { useEffect, useState } from 'react';

export const useStickyNavOnScroll = (isMobile, mobileElement, webElement) => {
  const [isSticky, setIsSticky] = useState(false);
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const handleScroll = () => {
      const section = document.getElementById(
        isMobile ? mobileElement : webElement,
      );

      if (section) {
        const rect = section.getBoundingClientRect();
        const isScrolledPast = rect.bottom <= 0;
        setIsSticky(isScrolledPast);
      }
    };

    handleScroll();

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return isSticky;
};
