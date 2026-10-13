import { Suspense } from 'react';
import { getCookieValue } from '@/utils/serverFunctions';
import { COOKIE_NAMES } from '@/constants';

export async function ConditionalSuspense({ children, fallback }) {
  return <Suspense fallback={fallback}>{children}</Suspense>;

  // // Read cookies on server
  // const enableSuspenseToggle =
  //   (await getCookieValue(COOKIE_NAMES.ENABLE_SUSPENSE_TOGGLE)) === 'true';
  // const suspenseNav =
  //   (await getCookieValue(COOKIE_NAMES.SUSPENSE_NAVIGATION)) === 'true';

  // // If feature toggle is enabled, check navigation cookie
  // // If feature toggle is NOT enabled, use Suspense (default behavior)
  // const shouldUseSuspense = enableSuspenseToggle ? suspenseNav : true;

  // if (shouldUseSuspense) {
  //   return <Suspense fallback={fallback}>{children}</Suspense>;
  // }

  // // Render children directly without Suspense
  // return children;
}
