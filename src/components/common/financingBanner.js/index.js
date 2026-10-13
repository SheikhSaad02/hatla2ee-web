'use client';
import { useLocale, useTranslations } from 'next-intl';
import ActionCard from '../actionCard/actionCard';
import NextImage from '../nextImage';
import NextLink from '../nextLink';
import React from 'react';
import { appPaths } from '@/constants';
import { carFinancingEvents } from '@/services/analyticsService/events';
import { getAsset, isRtl } from '@/utils/general';
import { useIsMobile } from '@/providers/isMobile';

const FinancingBannerBanner = ({ ...rest }) => {
  const locale = useLocale();
  const isMobile = useIsMobile() ?? false;
  const t = useTranslations('common');

  const device = isMobile ? 'mweb' : 'web';

  return (
    <NextLink href={appPaths.carFinance}>
      <ActionCard
        title={
          <span className="leading-tight">
            {t('Get Started with Car Financing through')}
            <NextImage
              src={getAsset(
                '/assets/sell-car-banner/fast-track-logo-blue.webp',
              )}
              alt="Fast Track"
              width={133}
              height={20}
              className="inline-block align-middle ms-1.5 -translate-y-0.5 w-18 md:w-31 h-auto"
            />
          </span>
        }
        description={t('Simple, flexible plans designed to fit your budget')}
        bannerBackgroundImage={getAsset(
          isRtl(locale)
            ? `/assets/sell-car-banner/finance_banner_ar_${device}.webp`
            : `/assets/sell-car-banner/finance_banner_en_${device}.webp`,
        )}
        contentClassName="max-w-[200px] md:max-w-full"
        className="lg:aspect-[6/1]"
        button={t('Apply Now')}
        gaEvent={carFinancingEvents.click_apply_financing}
        locale={locale}
        imageClassName={
          'flipX w-full object-cover left-0 right-0 rtl:left-0 md:right-[0]'
        }
        {...rest}
      />
    </NextLink>
  );
};

export default FinancingBannerBanner;
