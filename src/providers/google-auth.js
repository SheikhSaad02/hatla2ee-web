'use client';

import dynamic from 'next/dynamic';
import { GOOGLE_CLIENT_ID } from '@/constants';

const LazyGoogleOAuthProvider = dynamic(
  () => import('@react-oauth/google').then((mod) => mod.GoogleOAuthProvider),
  { ssr: false },
);

export default function GoogleProvider({ children }) {
  if (!GOOGLE_CLIENT_ID) {
    console.warn(
      'NEXT_PUBLIC_GOOGLE_CLIENT_ID is not set. Google Sign-In will be disabled.',
    );
    return <>{children}</>;
  }

  return (
    <LazyGoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
      {children}
    </LazyGoogleOAuthProvider>
  );
}
