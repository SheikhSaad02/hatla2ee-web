/**
 * Locale-agnostic prefixes for routes that require an authenticated user.
 * The proxy strips the locale before matching, so list paths without it.
 * A prefix protects the path itself and everything nested beneath it.
 */
export const PROTECTED_ROUTES = ['/car-maintenance/my-garage'];

export const isProtectedRoute = (pathWithoutLocale) =>
  PROTECTED_ROUTES.some(
    (route) =>
      pathWithoutLocale === route || pathWithoutLocale.startsWith(`${route}/`),
  );
