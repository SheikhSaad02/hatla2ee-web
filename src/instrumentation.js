import * as Sentry from '@sentry/nextjs';
import { IS_PRODUCTION } from './constants';

export async function register() {
  // New Relic must load before Sentry so it owns the global OpenTelemetry setup.
  // Imported directly under the nodejs check so the edge bundle never pulls in
  // the agent (it is Node-only).
  if (process.env.NEXT_RUNTIME === 'nodejs') {
    if (process.env.NEW_RELIC_ENABLED === 'true') {
      const { registerNewRelic } = await import('./newrelic-agent');
      await registerNewRelic();
    }
  }

  if (IS_PRODUCTION) {
    if (process.env.NEXT_RUNTIME === 'nodejs') {
      console.log('Running ===> sentry.server.config');
      await import('../sentry.server.config');
    }
    if (process.env.NEXT_RUNTIME === 'edge') {
      console.log('Running ===> sentry.edge.config');
      await import('../sentry.edge.config');
    }
    console.log('Running ===> instrumentation.js');
  }
}

export const onRequestError = IS_PRODUCTION
  ? Sentry.captureRequestError
  : () => {};
