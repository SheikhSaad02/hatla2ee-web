'use client';
import dynamic from 'next/dynamic';

export const LazyBottomNavigation = dynamic(() => import('./index'), {
  ssr: false,
});
