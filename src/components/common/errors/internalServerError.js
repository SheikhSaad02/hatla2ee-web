'use client';

import { Illustrator } from '@/components/common/illustrator/illustrator';
import NextImage from '@/components/common/nextImage';
import { getAsset } from '@/utils/general';
import { useTranslations, useLocale } from 'next-intl';
import { useRouter } from 'next/navigation';
import Button from '@/components/common/button/button';
import { RefreshCw, Home } from 'lucide-react';
import Navbar from '@/components/layout/navbar';
import FooterClient from './footerClient';
import { useIsMobile } from '@/providers/isMobile';

export default function InternalServerError() {
  const t = useTranslations('common');
  const locale = useLocale();
  const router = useRouter();
  const isMob = useIsMobile() ?? false;

  const handleRefresh = () => {
    router.refresh();
  };

  const handleGoHome = () => {
    router.push(`/${locale}`);
  };

  return (
    <>
      <Navbar />
      <div className="flex flex-col items-center justify-center px-10 py-30 lg:py-40 gap-6">
        <Illustrator
          image={
            <NextImage
              src={getAsset('/assets/500.webp')}
              width={isMob ? 100 : 200}
              height={isMob ? 100 : 200}
              alt="Internal Server Error"
            />
          }
          title={t('Internal Server Error')}
          description={t(
            'An unexpected error occurred while processing your request Please try again later',
          )}
        />
        <div className="flex flex-col sm:flex-row gap-3 items-center justify-center">
          <Button
            onClick={handleRefresh}
            variant="primaryLight"
            size="lg"
            icon={<RefreshCw />}
          >
            {t('Refresh')}
          </Button>
          <Button
            onClick={handleGoHome}
            variant="default"
            size="lg"
            icon={<Home />}
          >
            {t('Back to Home')}
          </Button>
        </div>
      </div>
      <FooterClient />
    </>
  );
}
