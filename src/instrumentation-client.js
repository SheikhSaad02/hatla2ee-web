// This file configures the initialization of Sentry on the client.
// The added config here will be used whenever a users loads a page in their browser.
// https://docs.sentry.io/platforms/javascript/guides/nextjs/

import * as Sentry from '@sentry/nextjs';
import { IS_PRODUCTION } from './constants';
IS_PRODUCTION &&
  Sentry.init({
    dsn: 'https://c50c43547e75f412e2115883443cb8d0@o994084.ingest.us.sentry.io/4509943402790912',
    tracesSampleRate: 0.1,
    enableLogs: true,
    debug: false,
  });

console.log('Running ===> instrumentation-client.js');

export const onRouterTransitionStart = Sentry.captureRouterTransitionStart;
