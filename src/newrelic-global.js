// Where src/newrelic-agent.js keeps the loaded New Relic API, so code that
// must not import the agent itself (e.g. src/proxy.js) can still reach it.
// Unset when New Relic is off, so callers must treat it as optional.
const KEY = Symbol.for('hatla2ee.newrelic');

export const setNewRelicApi = (api) => {
  globalThis[KEY] = api;
};

export const getNewRelicApi = () => globalThis[KEY];
