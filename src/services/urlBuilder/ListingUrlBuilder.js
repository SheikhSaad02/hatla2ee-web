import { convertQueryObjToString } from '@/utils/general';

const PLACEHOLDER_RE = /:([a-zA-Z][\w]*)/g;

/**
 * Fills each `:name` from `f[name].slug`. Returns null if any segment is missing.
 */
export function fillRouteFromTemplate(route, f) {
  const names = [
    ...new Set([...route.matchAll(PLACEHOLDER_RE)].map((m) => m[1])),
  ];
  let path = route;
  for (const name of names) {
    const raw = f[name]?.slug;
    if (raw == null || raw === '') return null;
    const s = String(raw);
    path = path.replace(new RegExp(`:${name}(?=/|$)`, 'g'), s);
  }
  return path;
}

/**
 * Template for listing URLs: normalize → pretty fingerprint → optional path segment,
 * else search URL with full query. Subclasses supply paths, query mapping, fingerprint,
 * normalization, and the pretty registry (strings and/or `{ route, config? }`).
 */
export class ListingUrlBuilder {
  /**
   * @param {{ basePath: string; searchPath: string }} paths
   */
  constructor({ basePath, searchPath }) {
    this.basePath = basePath;
    this.searchPath = searchPath;
  }

  /** @param {Record<string, unknown>} f */
  mapToQuery(_f) {
    throw new Error('ListingUrlBuilder: mapToQuery must be implemented by subclass');
  }

  /** @param {Record<string, unknown>} f */
  normalize(f) {
    return { ...f };
  }

  /** @param {Record<string, unknown>} f */
  activeKeyString(_f) {
    return '';
  }

  get prettyRegistry() {
    return {};
  }

  /**
   * @param {string | { route: string; config?: { buildUrl?: (f: Record<string, unknown>) => string | null } }} entry
   * @param {Record<string, unknown>} f
   */
  resolvePrettyPath(entry, f) {
    if (typeof entry === 'string') {
      return fillRouteFromTemplate(entry, f);
    }
    if (entry && typeof entry === 'object' && typeof entry.route === 'string') {
      const { route, config } = entry;
      const buildPath = config?.buildUrl;
      if (typeof buildPath === 'function') {
        return buildPath.call({ route }, f);
      }
      return fillRouteFromTemplate(route, f);
    }
    return null;
  }

  /** @param {Record<string, unknown>} f */
  searchHref(f) {
    const q = { ...this.mapToQuery(f) };
    return `${this.searchPath}${convertQueryObjToString(q)}`;
  }

  /** Same encoding as `searchHref`; does not affect `activeKeyString`. */
  sortByQueryString(f) {
    const { sortby } = this.mapToQuery(f);
    if (sortby == null || sortby === '') return '';
    return convertQueryObjToString({ sortby });
  }

  /** Listing URLs omit page (page 1 after filter changes). */
  buildUrl(filters = {}) {
    const f = this.normalize({ ...filters });
    delete f.page;

    const key = this.activeKeyString(f);
    const registry = this.prettyRegistry;
    const entry = key ? registry[key] : null;
    const path =
      entry != null ? this.resolvePrettyPath(entry, f) : null;

    if (!key || entry == null || !path) {
      return this.searchHref(f);
    }

    return `${this.basePath}/${path}${this.sortByQueryString(f)}`;
  }
}
