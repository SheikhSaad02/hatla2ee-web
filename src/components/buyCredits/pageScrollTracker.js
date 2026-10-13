'use client';

import { useEffect, useRef } from 'react';
import { useLocale } from 'next-intl';
import { useUser } from '@/providers/user';
import { buyCreditsEvents } from '@/services/analyticsService/events';

// DOM id -> the section name the event reports. The spec lists four sections
// for this event (hero, packages, payment_method, order_summary); only the
// first two exist on this page — payment_method and order_summary belong to the
// checkout flow, which lives in profolio, not here.
const SECTIONS = {
  hero: 'hero',
  packages: 'packages',
};

export default function PageScrollTracker() {
  const locale = useLocale();
  const { user } = useUser();
  // The observer is built once, but `user` resolves asynchronously — reading it
  // from a ref at fire time keeps the payload current without re-observing.
  const latest = useRef({ locale, user });
  latest.current = { locale, user };

  useEffect(() => {
    if (typeof IntersectionObserver === 'undefined') return undefined;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          // One event per section per page view; unobserving is what enforces
          // that, so scrolling back up does not re-fire.
          observer.unobserve(entry.target);
          buyCreditsEvents.page_scroll(
            latest.current.locale,
            latest.current.user,
            SECTIONS[entry.target.id],
          );
        });
      },
      // threshold 0: "reached" means any part of the section has come into
      // view. These sections are taller than the viewport, so a fractional
      // threshold could never be met on a phone.
      { threshold: 0 },
    );

    Object.keys(SECTIONS).forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  return null;
}
