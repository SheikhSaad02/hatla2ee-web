import Container from '../layout/container';
import NextImage from '../common/nextImage';
import React from 'react';
import Text from '../common/text';
import { cn } from '@/utils';
import { getTranslations } from 'next-intl/server';
import { isMobileServer } from '@/utils/serverFunctions';
import StoreButtons from './store-buttons';
import { isRtl } from '@/utils/general';
import { getAsset } from '@/utils/general';

const AppBanner = async ({ className, locale }) => {
  const rtl = isRtl(locale);

  const isMobile = await isMobileServer();
  const t = await getTranslations({ locale, namespace: 'layout' });

  return (
    <div
      className={cn(
        ' relative breakout bg-primary-50 overflow-hidden',
        className,
      )}
    >
      <Container>
        <div className="py-4 lg:py-0 flex flex-col lg:flex-row items-center justify-between w-full">
          <div className="flex flex-row gap-7 justify-between w-full items-center lg:items-center lg:pt-6">
            <div className="flex flex-col items-start gap-4 md:gap-7">
              <div className="flex gap-6">
                <div className="flex flex-col gap-4 md:gap-2">
                  <Text as="h2" className="text-base sm:text-3xl" weight="bold">
                    {t('Download the Hatla2ee App')}
                  </Text>
                  <Text
                    as="div"
                    className="text-xs sm:text-sm text-gray-500 max-w-52 sm:max-w-86"
                    weight="normal"
                  >
                    {t('Buy and sell cars, motorcycles, and much more')}{' '}
                    {!isMobile && t('Scan the code and install Hatla2ee now')}
                  </Text>
                </div>
                {!isMobile && (
                  <div className="flex justify-center items-center">
                    <NextImage
                      src={getAsset('/assets/footer/qr-code.png')}
                      width={84}
                      height={84}
                    />
                  </div>
                )}
              </div>

              <StoreButtons isMobile={isMobile} />
            </div>

            <NextImage
              src={
                rtl
                  ? getAsset(
                      `/assets/footer/footer-banner-ar${isMobile ? '-mobile' : ''}.webp`,
                    )
                  : getAsset(
                      `/assets/footer/footer-banner-en${isMobile ? '-mobile' : ''}.webp`,
                    )
              }
              width={isMobile ? 150 : 339}
              height={isMobile ? 150 : 276}
              className={cn(
                'w-[150px] h-auto lg:w-[339px] lg:h-[276] object-contain object-top lg:object-right self-end',
                isMobile && '-mb-4',
              )}
            />
          </div>
        </div>
      </Container>
    </div>
  );
};

export default AppBanner;
