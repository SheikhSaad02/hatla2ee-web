import { setNewRelicApi } from './newrelic-global';

// Node-only: import this from src/instrumentation.js inside the
// `process.env.NEXT_RUNTIME === 'nodejs'` branch so the edge bundle never
// includes the agent. Agent config lives in /newrelic.cjs.
export async function registerNewRelic() {
  if (!process.env.NEW_RELIC_LICENSE_KEY) {
    console.warn(
      'NEW_RELIC_ENABLED is true but NEW_RELIC_LICENSE_KEY is missing ===> new relic not started',
    );
    return;
  }

  // The agent reads app name and labels from env when it loads, so set
  // defaults here. NEXT_PUBLIC_TENANT is inlined at build time, so it is
  // reliable even if the runtime env lacks it. Explicit deployment values win.
  // Environment is part of the app name because New Relic merges every
  // instance reporting under one app name into a single entity.
  const tenant = process.env.NEXT_PUBLIC_TENANT;
  const environment = process.env.NEW_RELIC_ENVIRONMENT || 'local';
  process.env.NEW_RELIC_APP_NAME ||= ['hatla2ee-web', tenant, environment]
    .filter(Boolean)
    .join('-');
  process.env.NEW_RELIC_LABELS ||= [
    tenant && `tenant:${tenant}`,
    `environment:${environment}`,
  ]
    .filter(Boolean)
    .join(';');

  const { default: newrelic } = await import('newrelic');
  setNewRelicApi(newrelic);
  const agent = newrelic?.agent;
  if (!agent || agent.collector?.isConnected?.()) return;

  // Wait for the agent to connect so the first requests are not dropped,
  // but never block server startup for more than 8s.
  await new Promise((resolve) => {
    const done = () => {
      clearTimeout(timer);
      agent.removeListener('started', done);
      agent.removeListener('errored', done);
      resolve();
    };
    const timer = setTimeout(done, 8000);
    agent.once('started', done);
    agent.once('errored', done);
  });

  console.log('Running ===> new relic (hybrid agent)');
  console.log('Running ===> new relic (hybrid agent)');
}
