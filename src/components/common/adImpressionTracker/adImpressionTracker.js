'use client';

import { useEffect } from 'react';
import { impressionEvents } from '@/services/analyticsService/events';
import { useLocale } from 'next-intl';
import { useUser } from '@/providers/user';

export default function AdImpressionTracker({ listings = [], pageType }) {
  const locale = useLocale();
  const { user } = useUser();

  useEffect(() => {
    if (!listings?.length || !pageType) return;

    const ids = listings.map((item) => item.listing_id).filter(Boolean);
    if (!ids.length) return;

    const set1 = ids.slice(0, 20).join(',');
    const set2 = ids.slice(20).join(',') || null;
    impressionEvents.ad_impression(locale, user, pageType, set1, set2);
  }, [listings, pageType, locale, user]);
  return null;
}
