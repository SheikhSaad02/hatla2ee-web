'use client';
import { usePageViewTracking } from '@/services/analyticsService/use-page-view-tracking';

export default function GlobalPageViewTracker() {
    usePageViewTracking();
    return null;
}
