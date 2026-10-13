import { getTranslations } from 'next-intl/server';
import { isWebViewServer } from '@/utils/serverFunctions';
import { Button } from '@/components/ui/button';
import { appPaths } from '@/constants';
import NextLink from '@/components/common/nextLink';
import RevealOnScroll from './revealOnScroll';
import Text from '@/components/common/text';

// No background images in the handed-off assets, so the banner ships on a
// solid tint rather than a fabricated placeholder.
export default async function ContactSupportBanner() {
  const t = await getTranslations('buyCredits');
  // A new tab has nowhere to open inside the app's webview.
  const isWebView = await isWebViewServer();

  return (
    <div className="pb-10 pt-20 lg:pb-12 lg:pt-24">
      <RevealOnScroll className="relative overflow-hidden rounded-2.5xl bg-primary-50 px-8 py-6 lg:px-14 lg:py-8">
        <div className="relative max-w-[60%] lg:max-w-2xl">
          <Text
            as="h2"
            weight="semibold"
            className="text-[16px] leading-snug tracking-tight text-gray-900 lg:text-[28px]"
          >
            {t('promo.heading')}
          </Text>
          <Text
            as="p"
            className="mt-2 hidden max-w-xl text-base text-gray-600 lg:block"
          >
            {t('promo.body')}
          </Text>
          <div className="mt-5">
            <Button asChild size="xl" className="font-semibold">
              <NextLink
                href={appPaths.contactUs}
                {...(!isWebView && {
                  target: '_blank',
                  rel: 'noopener noreferrer',
                })}
              >
                {t('promo.cta')}
              </NextLink>
            </Button>
          </div>
        </div>
      </RevealOnScroll>
    </div>
  );
}
