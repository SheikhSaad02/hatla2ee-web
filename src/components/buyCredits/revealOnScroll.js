'use client';

import { useLayoutEffect, useRef, useState } from 'react';
import { cn } from '@/utils';

// Server-rendered markup is the final, visible state, so with no JS or before
// hydration the content just reads normally. Once hydrated, useLayoutEffect
// hides it before the next paint (something to animate from, no flash) and an
// IntersectionObserver reveals it — once, then it stays.
export default function RevealOnScroll({
  as: Tag = 'div',
  className,
  style,
  delayMs = 0,
  children,
}) {
  const ref = useRef(null);
  const [ready, setReady] = useState(false);
  const [revealed, setRevealed] = useState(false);

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el || typeof IntersectionObserver === 'undefined') return;

    if (window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) {
      setRevealed(true);
      return;
    }

    setReady(true);

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setRevealed(true);
          observer.disconnect();
        }
      },
      { threshold: 0.15 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <Tag
      ref={ref}
      style={{ ...style, transitionDelay: ready ? `${delayMs}ms` : undefined }}
      className={cn(
        ready && 'transition-all duration-700 ease-out',
        ready &&
          (revealed ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'),
        className,
      )}
    >
      {children}
    </Tag>
  );
}
