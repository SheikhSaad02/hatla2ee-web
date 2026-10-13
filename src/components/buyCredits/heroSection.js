import { getLocale, getTranslations } from 'next-intl/server';
import { ArrowDown } from 'lucide-react';
import Container from '@/components/layout/container';
import { isMobileServer, isWebViewServer } from '@/utils/serverFunctions';
import ScrollToSection from './scrollToSection';
import NextImage from '@/components/common/nextImage';
import { getAsset } from '@/utils/general';
import Text from '@/components/common/text';

// The landing-route mobile header is transparent with a white logo, meant to
// sit on a dark hero. On mobile we pull the hero up by the header's height so
// its dark background runs behind it, instead of stranding a white logo on the
// white page bg. PageLayout renders no header in the webview, so no offset.
const MOBILE_HEADER_HEIGHT = 60;

// H1 here is the page's only <h1>.
export default async function HeroSection() {
  const t = await getTranslations('buyCredits');
  const locale = await getLocale();
  const isMobile = await isMobileServer();
  const isWebView = await isWebViewServer();
  const src = getAsset(
    `/assets/buy-credits/hero-buy-credits-${locale === 'ar' ? 'ar' : 'en'}.webp`,
  );

  return (
    <section
      id="hero"
      data-hero-panel
      className="breakout relative grid min-h-[440px] overflow-hidden lg:min-h-[520px]"
      style={{
        backgroundImage:
          'radial-gradient(115% 85% at 76% 12%, rgba(49,96,165,0.38) 0%, rgba(49,96,165,0) 62%), linear-gradient(155deg, #18324f 0%, #13253F 46%, #0b1524 100%)',
        ...(isMobile &&
          !isWebView && {
            marginTop: -MOBILE_HEADER_HEIGHT,
            paddingTop: MOBILE_HEADER_HEIGHT,
          }),
      }}
    >
      <Container className="relative z-10 flex items-center pb-0 pt-12 lg:py-0 lg:[grid-area:1/1]">
        <div className="grid w-full grid-cols-1 items-center md:gap-8 lg:grid-cols-[minmax(0,0.82fr)_minmax(0,1.18fr)] lg:gap-10">
          <div className="text-start">
            <Text
              as="h1"
              weight="bold"
              className="w-full text-[30px] leading-tight tracking-tight text-white md:text-[46px] md:leading-[65px]"
            >
              {t('hero.h1')}
            </Text>
            <Text
              as="p"
              className="mt-5 max-w-md text-base text-white/75 md:text-lg lg:w-[30rem] lg:max-w-none"
            >
              {t('hero.subline')}
            </Text>
            <div className="mt-8 flex justify-start">
              <ScrollToSection
                target="packages"
                trackAs="hero_cta_click"
                size="xl"
                variant="secondary"
                className="font-semibold"
              >
                {t('hero.cta')}
                <ArrowDown className="size-4" />
              </ScrollToSection>
            </div>
          </div>
        </div>
      </Container>

      {/* The asset's ~15.4% transparent left gutter (same in ar — not
          mirrored) is why -ml/118% sits it flush; -ms would break Arabic. */}
      <div className="overflow-hidden lg:me-[-2%] lg:w-[64%] lg:max-w-[1000px] lg:justify-self-end lg:self-end lg:[grid-area:1/1]">
        <NextImage
          locale={locale}
          src={src}
          alt={t('seo.ogTitle')}
          width={1200}
          height={676}
          preload
          fetchPriority="high"
          className="-ml-[12%] w-[118%] max-w-none object-contain lg:ml-0 lg:w-full"
        />
      </div>
    </section>
  );
}
