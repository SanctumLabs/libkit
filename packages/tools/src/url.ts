import libURL from 'url';

export type UrlObjectWithPathSegments = libURL.UrlObject & {
  path?: string[];
};

export type ToArgument = string | UrlObjectWithPathSegments;

export type QueryParams = {
  [name: string]: string | boolean | number;
};

/**
 * Build a URL path if possible.
 *
 * Path segments (either from `path` directly or by splitting `pathname` on `/`)
 * are URL-encoded, `path` is preferred over `pathname`.
 */
function buildPath(parts: UrlObjectWithPathSegments): string | undefined {
  const segments = parts.path ? parts.path : parts.pathname?.split('/');
  return segments ? segments.map((segment) => encodeURIComponent(segment)).join('/') : undefined;
}

/**
 * Resolve a target URL (or URL components) relative to a base URL.
 *
 * This is like `URL.resolve` but with some added functionality:
 *
 * 1. Splits `pathname` on `/` and encodes each segment before joining them
 *    again.
 * 2. Accepts a `path` URL object key, which is an array of path segments to be
 *    encoded and joined.
 *
 * This is useful for constructing a URL dynamically in a reliable fashion,
 * without either manually encoding each segment or forgetting to encode the
 * segments altogether.
 *
 * @category URL
 */
export function resolveURL(root: string, toOrObject: ToArgument): string {
  const to =
    typeof toOrObject === 'string'
      ? toOrObject
      : libURL.format({...toOrObject, pathname: buildPath(toOrObject)});
  return libURL.resolve(root, to);
}

/**
 * Curried version of `resolveURL`.
 *
 * @example
 * const clientURL = resolveURL$('https://core.example.com/api/client');
 * // Simple case with path.
 * fetch(clientURL('bills/latest'))
 * // Complex case with query arguments.
 * fetch(clientURL({
 *   path: ['bills', 'latest'],
 *   query: {limit: 5},
 * }));
 */
export function resolveURL$(root: string) {
  return (toOrObject: ToArgument) => resolveURL(root, toOrObject);
}

/**
 * Is the hostname of a URL trusted?
 *
 * Trusted hosts are okay to send sensitive headers like `X-Auth-Token` to.
 *
 * NOTE: When `__DEV__` is set, this function always returns true.
 *
 * @category URL
 */
export function isTrustedHostname(url: string, _devMode = __DEV__): boolean {
  const {hostname} = libURL.parse(url, false, true);
  return (
    _devMode ||
    !hostname ||
    /(^|\.)(sanctumlabs\.org|sanctumlabs\.com|sanctumlabs\.co\.ke|sanctumlabs\.help)/.test(hostname)
  );
}

/**
 * Returns a URL with added query parameters.
 */
export const withQueryParams = (url: string, query: QueryParams = {}) => {
  const _url = libURL.parse(url, true);
  return libURL.format({
    protocol: _url.protocol,
    pathname: _url.pathname,
    host: _url.host,
    query: {
      ..._url.query,
      'in-app': true,
      ...query,
    },
  });
};

/**
 * Parse and return the query part of a URL.
 */
export function parseQuery(url: string) {
  return libURL.parse(url, true).query;
}

/**
 * Format a URL for humans to read, without scheme, port, and query arguments.
 */
export function humanReadableURL(url?: string) {
  try {
    if (url) {
      const u = new URL(url);
      return u.host + u.pathname;
    }
  } catch (err) {}
  return undefined;
}
