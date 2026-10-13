// In /app/providers.tsx
'use client';

import { ProgressProvider } from '@bprogress/next/app';

const Providers = ({ children, isWebView = false }) => {
  if (isWebView) {
    return children;
  }
  return (
    <ProgressProvider
      height="3px"
      color="var(--color-secondary)"
      options={{ showSpinner: false }}
      shallowRouting
    >
      {children}
    </ProgressProvider>
  );
};

export default Providers;
