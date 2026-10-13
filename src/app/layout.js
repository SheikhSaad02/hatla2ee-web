import '@/styles/globals.css';

import { figtree, fonts } from '@/utils/fonts';

import { cn } from '@/utils';
import { getLocale } from 'next-intl/server';
import { getSpriteVariables } from '@/data/listings/used-cars/spriteMapping';
import { isMobileServer, isWebViewServer } from '@/utils/serverFunctions';
import { GoogleAnalytics, GoogleTagManager } from '@next/third-parties/google';
import Script from 'next/script';
import Providers from '@/components/layout/progressBarWrapper';
import configs from '@/configs';

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  minimumScale: 1,
  maximumScale: 1,
  viewportFit: 'cover',
};

export default async function RootLayout({ children, style, className }) {
  const locale = await getLocale();
  const isMobile = await isMobileServer();
  const isWebView = await isWebViewServer();

  const getFontClass = (locale) => {
    const font = fonts[locale] || figtree;
    return `${font.variable} ${font.className}`;
  };

  return (
    <html
      lang={locale}
      dir={locale === 'en' ? 'ltr' : 'rtl'}
      // className="scroll-smooth"
      style={{
        ...getSpriteVariables(isMobile),
      }}
    >
      <body
        style={{ ...style }}
        className={cn(getFontClass(locale), className)}
      >
        {/* ---- GPT loader + initialisation ---- */}
        {configs.ENABLE_ADS && (
          <>
            <Script
              async
              src="https://securepubads.g.doubleclick.net/tag/js/gpt.js"
              strategy="afterInteractive"
            />
            <Script
              id="gpt-init"
              strategy="afterInteractive"
              dangerouslySetInnerHTML={{
                __html: `window.googletag = window.googletag || { cmd: [] };`,
              }}
            />
          </>
        )}
        <Providers isWebView={isWebView}>{children}</Providers>

        {/* Set GA4 user property for chosen_country before session_start fires */}
        {process.env.NEXT_PUBLIC_GA_ID && (
          <Script
            id="ga4-user-properties"
            strategy="afterInteractive"
            dangerouslySetInnerHTML={{
              __html: `
                (function() {
                  const tenantCode = '${
                    process.env.NEXT_PUBLIC_TENANT || 'eg'
                  }';
                  const COUNTRY_NAMES = {
                    eg: 'EG',
                    jordan: 'JO',
                    ksa: 'SA',
                    kuwait: 'KW',
                    oman: 'OM',
                    uae: 'AE',
                    qatar: 'QA',
                  };
                  const chosenCountry = COUNTRY_NAMES[tenantCode] || tenantCode;
                  
                  // Set user property as soon as gtag is available
                  function setUserProperty() {
                    if (window.gtag) {
                      window.gtag('set', 'user_properties', {
                        chosen_country: chosenCountry,
                      });
                    } else {
                      setTimeout(setUserProperty, 50);
                    }
                  }
                  setUserProperty();
                })();
              `,
            }}
          />
        )}

        {/** Google Ad Sense */}

        {/* <Script
          id="adsbygoogle-init"
          strategy="afterInteractive"
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-XXXXXXXXXXXXXXXX"
          crossOrigin="anonymous"
        /> */}
      </body>
      {process.env.NEXT_PUBLIC_GA_ID && (
        <GoogleAnalytics gaId={process.env.NEXT_PUBLIC_GA_ID} />
      )}
      {process.env.NEXT_PUBLIC_GTM_ID && (
        <GoogleTagManager
          dataLayerName="dataLayerGTM"
          gtmId={process.env.NEXT_PUBLIC_GTM_ID}
        />
      )}
    </html>
  );
}
