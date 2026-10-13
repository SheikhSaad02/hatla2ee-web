/**
 * City Redirects Configuration
 * Generates all city redirect routes for a given old slug → new slug mapping
 * @param {string} oldSlug - The old/duplicate city slug
 * @param {string} newSlug - The new/retained city slug
 * @returns {Array} Array of redirect route objects
 */
export const locationRedirects = {
  middleware: [
    { oldSlug: "faiyum", newSlug: "El+Faiyum" },
  ],
  config: [
    { oldSlug: "el-mansoura", newSlug: "mansura" },
    { oldSlug: "Abo-Rawash", newSlug: "abu-rawash" },
    { oldSlug: "el-behiera", newSlug: "beheira" },
    { oldSlug: "el+beheira", newSlug: "beheira" },
    { oldSlug: "el-obour", newSlug: "obour_city" },
    { oldSlug: "el-agamy", newSlug: "agamy" },
    { oldSlug: "qaliubiya", newSlug: "qalyubia" },
    { oldSlug: "El-Mahalla+El-Kubra", newSlug: "mahala" },
    { oldSlug: "marj", newSlug: "el-marg" },
    { oldSlug: "al-marj", newSlug: "el-marg" },
    { oldSlug: "el-mohandseen", newSlug: "mohandessin" },
    { oldSlug: "kafr-el-cheik", newSlug: "kafr-el-sheikh" },
    { oldSlug: "Menufeya", newSlug: "monufia" },
    { oldSlug: "menoufia", newSlug: "monufia" },
    { oldSlug: "al-manial", newSlug: "el-manial" },
    { oldSlug: "el-warraq", newSlug: "warraq" },
    { oldSlug: "shobra", newSlug: "Shubra" },
    { oldSlug: "shubra-al-khaymah", newSlug: "shubra-al-khaimah" },
    { oldSlug: "kafr-shokr", newSlug: "kafr-shukr" },
    { oldSlug: "marsa-matruh", newSlug: "marsa-matrouh" },
    { oldSlug: "Mersa+Matruh", newSlug: "marsa-matrouh" },
    { oldSlug: "masr-al-jadidah", newSlug: "heliopolis" },
    { oldSlug: "kirdasah", newSlug: "kerdasa" },
    { oldSlug: "shebeen-el-kom", newSlug: "shibin-el-kom" },
    { oldSlug: "belbes", newSlug: "bilbeis" },
    { oldSlug: "tukh", newSlug: "touhk" },
    { oldSlug: "abidin", newSlug: "abdeen" },
    { oldSlug: "quwaysna", newSlug: "Quesna" },
    { oldSlug: "fasal", newSlug: "faisal" },
    { oldSlug: "5th-settlement", newSlug: "new-cairo" },
    { oldSlug: "al-shorouk", newSlug: "el-shorouk" },
  ],
};


const ROUTE_PATTERNS = [
  "",                             // Base city page
  "/page/:page",                  // Pagination
  "/body/:body",                  // Body type
  "/body/:body/page/:page",       // Body type + pagination
  "/:make",                       // Make
  "/:make/page/:page",            // Make + pagination
  "/:make/:model",                // Make + model
  "/:make/:model/page/:page",     // Make + model + pagination
];

/**
 * Escapes special characters in route patterns for Next.js
 * Specifically handles '+' which is a route modifier in Next.js
 * Similar to how it's handled in redirectRulesMap.js (e.g., C\\+300)
 */
function escapeRoutePattern(slug) {
  return slug.replace(/\+/g, '\\+');
}

export function generateCityRedirects(oldSlug, newSlug) {
  const escapedOld = escapeRoutePattern(oldSlug);
  return ROUTE_PATTERNS.map((pattern) => ({
    source: `/:locale/car/city/${escapedOld}${pattern}`,
    destination: `/:locale/car/city/${newSlug}${pattern}`,
    statusCode: 301,
  }));
}

export function getAllCityRedirects() {
  return locationRedirects.config.flatMap(({ oldSlug, newSlug }) =>
    generateCityRedirects(oldSlug, newSlug)
  );
}

/**
 * Handles city redirects that need to go through middleware (e.g., those with special characters like '+')
 * Checks if the pathname matches any middleware redirect and returns the redirect response
 * @param {string} pathname - The request pathname
 * @param {Function} createRedirectResponse - Function to create redirect response (e.g., NextResponse.redirect)
 * @param {Function} cloneUrl - Function to clone the URL (e.g., request.nextUrl.clone)
 * @returns {Response|null} Redirect response if match found, null otherwise
 */
export function handleMiddlewareCityRedirects(pathname, createRedirectResponse, cloneUrl) {
  for (const { oldSlug, newSlug } of locationRedirects.middleware) {
    if (pathname.includes(`/car/city/${oldSlug}`)) {
      const url = cloneUrl();
      url.pathname = pathname.replace(`/car/city/${oldSlug}`, `/car/city/${newSlug}`);
      return createRedirectResponse(url, 301);
    }
  }
  return null;
}