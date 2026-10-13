'use client';

import { useEffect, useRef, useState } from 'react';

// "1M+", "100+", "2.6M+" — split off the number so only it counts up and the
// suffix stays put.
function parseStat(raw) {
  const match = String(raw).match(/^([\d.,]+)([A-Za-z]*)(\+?)$/);
  if (!match) return null;
  const [, numStr, suffix, plus] = match;
  const num = parseFloat(numStr.replace(/,/g, ''));
  const decimals = (numStr.split('.')[1] || '').length;
  if (Number.isNaN(num)) return null;
  return { num, suffix, plus, decimals };
}

// Starts at the final `value`, matching the server markup — no hydration
// mismatch, and no-JS clients see the real number. It drops to zero and counts
// back up only once its card scrolls into view, once per page load.
export default function StatValue({ value, className }) {
  const ref = useRef(null);
  const [display, setDisplay] = useState(value);
  const startedRef = useRef(false);

  useEffect(() => {
    const parsed = parseStat(value);
    const el = ref.current;
    if (!parsed || !el || typeof IntersectionObserver === 'undefined') return;
    if (window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting || startedRef.current) return;
        startedRef.current = true;
        observer.disconnect();

        setDisplay(`0${parsed.suffix}${parsed.plus}`);
        const duration = 1400;
        const start = performance.now();

        const tick = (now) => {
          const progress = Math.min((now - start) / duration, 1);
          if (progress >= 1) {
            setDisplay(value);
            return;
          }
          const eased = 1 - (1 - progress) ** 3;
          setDisplay(
            `${(parsed.num * eased).toFixed(parsed.decimals)}${parsed.suffix}${parsed.plus}`,
          );
          requestAnimationFrame(tick);
        };

        requestAnimationFrame(tick);
      },
      { threshold: 0.4 },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [value]);

  return (
    <span ref={ref} className={className}>
      {display}
    </span>
  );
}
