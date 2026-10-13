'use client';
import { useEffect, useRef, useState } from 'react';

// Single rAF-throttled scroll + resize listener — mirrors the shape of
// useStickyNavOnScroll.js. Optionally also reports a visibility threshold
// (window.scrollY past a ratio of the viewport height) so a caller like the
// sticky tab bar doesn't need a second listener.
export function useScrollSpy(sectionIds, { offset = 0, visibilityRatio } = {}) {
  const [activeId, setActiveId] = useState(sectionIds[0]);
  const [isVisible, setIsVisible] = useState(visibilityRatio == null);
  const rafRef = useRef(0);
  const idsKey = sectionIds.join(',');

  useEffect(() => {
    if (typeof window === 'undefined' || !sectionIds.length) return;

    const measure = () => {
      rafRef.current = 0;

      if (visibilityRatio != null) {
        setIsVisible(window.scrollY > window.innerHeight * visibilityRatio);
      }

      let current = sectionIds[0];
      for (const id of sectionIds) {
        const el = document.getElementById(id);
        if (el && el.getBoundingClientRect().top <= offset) {
          current = id;
        }
      }
      setActiveId(current);
    };

    const onScroll = () => {
      if (!rafRef.current) rafRef.current = requestAnimationFrame(measure);
    };

    measure();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [idsKey, offset, visibilityRatio]);

  return { activeId, isVisible };
}
