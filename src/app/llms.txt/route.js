import configs from '@/configs';
import { egLlmsTxt } from '@/tenant/eg/llms';

/**
 * Serves /llms.txt as plain text.
 *
 * Unlike robots.txt and sitemap.xml, llms.txt is not a Next.js metadata file
 * convention, so it is exposed through a Route Handler in a segment literally
 * named "llms.txt".
 *
 * Only enabled for tenants with ENABLE_LLMS_TXT (currently EG). Because
 * NEXT_PUBLIC_TENANT is inlined at build time and this route is force-static,
 * the EG build prerenders the file once and every other tenant's build
 * prerenders the 404 — the branch never runs per-request.
 *
 * NOTE: "llms.txt" must stay listed in the matcher exclusions in src/proxy.js,
 * otherwise next-intl (localePrefix: 'always') redirects it to /<locale>/llms.txt.
 *
 * @see https://llmstxt.org/
 */

export const dynamic = 'force-static';

const CONTENT_TYPE = 'text/plain; charset=utf-8';

export function GET() {
  if (!configs.ENABLE_LLMS_TXT) {
    return new Response('Not Found', {
      status: 404,
      headers: { 'Content-Type': CONTENT_TYPE },
    });
  }

  return new Response(egLlmsTxt, {
    headers: { 'Content-Type': CONTENT_TYPE },
  });
}
