import { cache } from 'react';

/**
 * React `cache()` dedupes by argument identity. Two object literals with the same
 * fields are different references → two runs. Keys the inner cache by
 * `JSON.stringify(payload)` so logically identical plain objects dedupe.
 *
 * Payload must be JSON-serializable (same limits as `JSON.stringify`).
 *
 * @template T
 * @template R
 * @param {(payload: T) => Promise<R>} fetcher
 * @returns {(payload: T) => Promise<R>}
 */
export function cacheBySerializedKey(fetcher) {
  const cached = cache(async (payloadKey) => fetcher(JSON.parse(payloadKey)));
  return (payload) => cached(JSON.stringify(payload ?? {}));
}
