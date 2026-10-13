'use strict';

// New Relic Node.js agent config, read from the process cwd when the agent is
// loaded in src/newrelic-agent.js. Any NEW_RELIC_* env var overrides the
// matching key here. Per-deployment values live in the environment, never in
// this file: NEW_RELIC_LICENSE_KEY (same account key as Legion BE), and
// NEW_RELIC_APP_NAME / NEW_RELIC_LABELS (defaulted in src/newrelic-agent.js).
// https://docs.newrelic.com/docs/apm/agents/nodejs-agent/extend-your-instrumentation/nextjs-instrumentation/

exports.config = {
  // Hybrid Agent: build transactions from the OpenTelemetry spans Next.js
  // emits natively. This is the supported approach for Next.js 16+.
  opentelemetry: {
    enabled: true,
  },
  // Next.js already creates spans for these, so the agent's own
  // instrumentation would only produce duplicates.
  instrumentation: {
    http: { enabled: false },
    next: { enabled: false },
    undici: { enabled: false },
  },
  distributed_tracing: {
    enabled: true,
  },
  // Don't record Kubernetes health checks: they hit /health every few seconds
  // per pod and would dominate throughput, averages and Apdex.
  rules: {
    ignore: ['^/health/?$'],
  },
  // Don't ship app logs to New Relic (same as Legion production): avoids
  // ingest cost and user data in New Relic. Only affects winston/pino/bunyan;
  // console output was never captured.
  application_logging: {
    forwarding: { enabled: false },
  },
  // The agent's own diagnostic log, not app logs.
  logging: {
    level: 'info',
    // Containers: log to stdout instead of newrelic_agent.log on disk.
    filepath: 'stdout',
  },
};
