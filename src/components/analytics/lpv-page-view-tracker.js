'use client';
import { usePageViewTracking } from '@/services/analyticsService/use-page-view-tracking';

export default function LpvPageViewTracker({ filters }) {
  usePageViewTracking(filters);
  return null;
}
