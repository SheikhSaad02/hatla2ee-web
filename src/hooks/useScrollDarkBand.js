'use client';
import { useEffect, useRef, useState } from 'react';

const clamp = (value, min, max) => Math.max(min, Math.min(max, value));

// Drives the light↔dark cross-fade behind the packages section. Renders at
// opacity: 0 on the server so the initial HTML is always the light variant.
// Looks the section up by id (rather than taking a ref) so independent
// consumers — the page-level fixed overlay and the packages grid itself —
// can each call this and stay in sync without sharing state.
export function useScrollDarkBand(sectionId) {
  const [state, setState] = useState({ opacity: 0, height: 0 });
  const lastRef = useRef({ opacity: -1, height: -1 });
  const rafRef = useRef(0);

  useEffect(() => {
    const el = document.getElementById(sectionId);
    if (!el) return;

    const measure = () => {
      rafRef.current = 0;
      const rect = el.getBoundingClientRect();
      const viewportHeight = window.innerHeight || 1;
      const opacity = clamp(
        (viewportHeight * 0.85 - rect.top) / (viewportHeight * 0.5),
        0,
        1,
      );
      const height = clamp(rect.bottom, 0, viewportHeight);
      const last = lastRef.current;

      if (Math.abs(last.opacity - opacity) > 0.004 || Math.abs(last.height - height) > 1) {
        lastRef.current = { opacity, height };
        setState({ opacity, height });
      }
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
  }, [sectionId]);

  return { opacity: state.opacity, height: state.height, dark: state.opacity > 0.45 };
}
