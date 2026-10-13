import { getLocale, getTranslations } from 'next-intl/server';

import ActionCard from '../actionCard/actionCard';
import NextLink from '../nextLink';
import React from 'react';
import { getAsset } from '@/utils/general';
import { appPaths } from '@/constants';
import { isWebViewServer } from '@/utils/serverFunctions';

const SellCarBanner = async ({
  locale: staticLocale,
  prioritizeImage = false,
  ...rest
}) => {
  const isWebView = await isWebViewServer();
  const locale = await getLocale();
  const t = await getTranslations({
    locale: staticLocale || locale,
    namespace: 'common',
  });

  return (
    !isWebView && (
      <NextLink href={appPaths.postListing} prefetch={false}>
        <ActionCard
          title={t('Post, Connect, & Sell')}
          description={t(
            "Join the millions who've sold with confidence and meet trusted buyers",
          )}
          bannerBackgroundImage={getAsset(
            '/assets/sell-car-banner/sell-car-banner.webp',
          )}
          button={t('Sell My Car')}
          gaEvent={'click_sell_car'}
          locale={locale}
          prioritizeImage={prioritizeImage}
          {...rest}
        />
      </NextLink>
    )
  );
};

export default SellCarBanner;
